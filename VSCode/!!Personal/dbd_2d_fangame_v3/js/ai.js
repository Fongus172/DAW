import { GAME } from "./config.js";
import { dist, angleTo, rand, choose } from "./utils.js";

function nearest(list, ent, pred = () => true) {
  let best = null;
  let bd = Infinity;
  for (const x of list) {
    if (!x || !pred(x)) continue;
    const d = dist(ent, x);
    if (d < bd) {
      best = x;
      bd = d;
    }
  }
  return best;
}

function scoreNearestReachable(game, list, ent, pred = () => true, extraScore = () => 0) {
  let best = null;
  let bestScore = Infinity;
  for (const obj of list) {
    if (!obj || !pred(obj)) continue;
    const blockedPenalty = game.map.lineBlocked(ent, obj) ? 180 : 0;
    const score = dist(ent, obj) + blockedPenalty + extraScore(obj);
    if (score < bestScore) {
      best = obj;
      bestScore = score;
    }
  }
  return best;
}

function safeFromKiller(game, obj, min = 230) {
  return dist(game.killer, obj) > min || game.map.lineBlocked(game.killer, obj);
}

function setGoal(ent, goal, target = null, force = false) {
  if (force || ent.ai.goal !== goal || ent.ai.target !== target) {
    ent.ai.goal = goal;
    ent.ai.target = target;
    ent.ai.think = 0;
    if (ent.ai.nav) {
      ent.ai.nav.path = [];
      ent.ai.nav.key = "";
      ent.ai.nav.repath = 0;
    }
  }
}

function fleePoint(game, s, distance = 440) {
  const killer = game.killer;
  const base = angleTo(killer, s);
  const candidates = [];

  for (let i = -3; i <= 3; i++) {
    const a = base + i * 0.42;
    const p = {
      x: s.x + Math.cos(a) * distance,
      y: s.y + Math.sin(a) * distance
    };
    const safe = game.map.nearestOpenPoint(p.x, p.y, 14);
    const blockedPenalty = game.map.lineBlocked(s, safe) ? 140 : 0;
    const palletBonus = nearest(game.pallets, safe, p => !p.used && !p.broken && dist(p, safe) < 150) ? -120 : 0;
    const windowBonus = nearest(game.windows, safe, w => dist(w, safe) < 140) ? -80 : 0;
    candidates.push({ p: safe, score: -dist(safe, killer) + blockedPenalty + palletBonus + windowBonus });
  }

  return candidates.sort((a, b) => a.score - b.score)[0]?.p || game.map.randomOpenPointReachableFrom(s, 250, 200);
}

export function updateSurvivorAI(game, s, dt) {
  if (s.isPlayer || !s.alive || s.onHook || s.carried) return;

  s.ai.think -= dt;
  s.ai.blackboard = s.ai.blackboard || { objectiveAge: 0, lastSafePos: { x: s.x, y: s.y } };
  s.ai.blackboard.objectiveAge += dt;
  s.vx = 0;
  s.vy = 0;

  const killer = game.killer;
  const kd = dist(s, killer);
  const seesKiller = kd < (390 * s.char.stealth) && !game.map.lineBlocked(s, killer);
  const danger = seesKiller || kd < 170 || s.revealed > 0;

  if (!danger && kd > GAME.terrorRadius) s.ai.blackboard.lastSafePos = { x: s.x, y: s.y };

  if (s.inLocker) {
    const shouldLeave = kd > 340 || s.ai.blackboard.objectiveAge > 8 || Math.random() < dt * 0.03;
    if (shouldLeave) game.exitLocker(s);
    return;
  }

  if (s.state === "downed") {
    if (s.recover < 0.95) {
      game.performRecover(s, dt, true);
      return;
    }
    const ally = scoreNearestReachable(game, game.survivors, s, o => o !== s && o.alive && o.interactable && o.state !== "downed" && safeFromKiller(game, o, 220));
    if (ally) game.smartMove(s, ally, 34, dt, { stopRange: 55, repathEvery: 0.8 });
    return;
  }

  if (danger && s.state !== "downed") {
    s.ai.panic = Math.max(s.ai.panic || 0, rand(2.4, 5.4));
    const pallet = nearest(game.pallets, s, p => !p.used && !p.broken && dist(p, s) < 78 && dist(p, killer) < 115);
    if (pallet) {
      game.dropPallet(s, pallet);
      setGoal(s, "flee", fleePoint(game, s, 520), true);
      return;
    }

    const vault = nearest(game.windows, s, w => dist(w, s) < 58 && dist(w, killer) < 175);
    if (vault && Math.random() < 0.55) {
      game.vaultEntity(s, vault, true);
      setGoal(s, "flee", fleePoint(game, s, 520), true);
      return;
    }

    const locker = nearest(game.lockers, s, l => !l.inside && kd > 250 && kd < 420 && safeFromKiller(game, l, 250));
    if (locker && Math.random() < dt * 0.08 && !seesKiller) {
      game.enterLocker(s, locker);
      return;
    }

    if (s.ai.goal !== "flee" || !s.ai.target || s.ai.blackboard.objectiveAge > 1.6) {
      setGoal(s, "flee", fleePoint(game, s, 520), true);
      s.ai.blackboard.objectiveAge = 0;
    }
  } else {
    s.ai.panic = Math.max(0, (s.ai.panic || 0) - dt);
  }

  if (s.ai.goal === "flee") {
    const target = s.ai.target || fleePoint(game, s, 420);
    if (dist(s, target) < 70 || s.ai.blackboard.objectiveAge > 2.7 || kd > GAME.terrorRadius * 1.25) {
      s.ai.blackboard.objectiveAge = 99;
      if (kd > GAME.terrorRadius * 1.25) setGoal(s, "decide", null, true);
      else setGoal(s, "flee", fleePoint(game, s, 460), true);
    } else {
      game.smartMove(s, target, s.speed(true), dt, { stopRange: 48, repathEvery: 0.32 });
      return;
    }
  }

  if (s.ai.think <= 0 || !s.ai.target || s.ai.blackboard.objectiveAge > 12 || s.ai.goal === "decide") {
    s.ai.think = rand(0.35, 0.85) / game.difficulty.survivorAi;
    s.ai.blackboard.objectiveAge = 0;

    const hooked = scoreNearestReachable(
      game,
      game.survivors,
      s,
      o => o !== s && o.alive && o.onHook && safeFromKiller(game, o, o.hookCount >= 2 ? 135 : 205),
      o => dist(game.killer, o) < 240 ? 8 : 0
    );
    const downed = scoreNearestReachable(
      game,
      game.survivors,
      s,
      o => o !== s && o.alive && o.state === "downed" && !o.carried && !o.onHook && safeFromKiller(game, o, 215)
    );
    const injured = scoreNearestReachable(
      game,
      game.survivors,
      s,
      o => o !== s && o.alive && o.state === "injured" && !o.carried && !o.onHook && safeFromKiller(game, o, 250),
      o => game.countSurvivorIntent("heal", o, s) * 6
    );

    if (game.gensDone >= GAME.gensNeeded) {
      const gate = game.bestGateFor(s);
      setGoal(s, gate?.open ? "escape" : "gate", gate, true);
    } else if (hooked && Math.random() < (hooked.hookCount >= 2 ? 0.95 : 0.72)) {
      setGoal(s, "rescue", hooked, true);
    } else if (downed && Math.random() < 0.78) {
      setGoal(s, "heal", downed, true);
    } else if (s.state === "injured" && s.item.id === "medkit" && safeFromKiller(game, s, 300)) {
      setGoal(s, "selfheal", s, true);
    } else if (injured && Math.random() < 0.48) {
      setGoal(s, "heal", injured, true);
    } else {
      const hex = scoreNearestReachable(game, game.totems, s, t => !t.cleansed && t.hex && safeFromKiller(game, t, 270));
      const chest = scoreNearestReachable(game, game.chests, s, c => !c.opened && s.item.id === "none" && safeFromKiller(game, c, 240));
      const gen = game.bestGeneratorFor(s);

      if (hex && game.hexActive && Math.random() < 0.35) setGoal(s, "totem", hex, true);
      else if (chest && Math.random() < 0.18) setGoal(s, "chest", chest, true);
      else setGoal(s, "repair", gen, true);
    }
  }

  const t = s.ai.target;
  if (!t) return;

  const goalRanges = {
    repair: 50, heal: 44, selfheal: 0, rescue: 44, gate: 55, escape: 72, chest: 46, totem: 46
  };
  const stopRange = goalRanges[s.ai.goal] ?? 46;

  if (s.ai.goal === "selfheal") {
    if (safeFromKiller(game, s, 280)) game.performHeal(s, s, dt, true);
    else setGoal(s, "flee", fleePoint(game, s, 500), true);
    return;
  }

  if (dist(s, t) > stopRange) {
    const ok = game.smartMove(s, t, s.speed(false), dt, { stopRange, repathEvery: 0.52 });
    if (!ok) setGoal(s, "decide", null, true);
    return;
  }

  if (s.ai.goal === "repair") {
    if (t.done || !safeFromKiller(game, t, 140)) setGoal(s, "decide", null, true);
    else game.performRepair(s, t, dt, true);
  } else if (s.ai.goal === "heal") {
    if (!t.alive || t.state === "healthy" || t.carried || t.onHook) setGoal(s, "decide", null, true);
    else game.performHeal(s, t, dt, true);
  } else if (s.ai.goal === "rescue") {
    if (!t.onHook) setGoal(s, "decide", null, true);
    else game.performRescue(s, t, dt, true);
  } else if (s.ai.goal === "gate") {
    if (t.open) setGoal(s, "escape", t, true);
    else game.performGate(s, t, dt, true);
  } else if (s.ai.goal === "escape") {
    game.tryEscape(s, t);
    if (!s.escaped && !t.open) setGoal(s, "gate", t, true);
  } else if (s.ai.goal === "chest") {
    if (t.opened) setGoal(s, "decide", null, true);
    else game.performChest(s, t, dt, true);
  } else if (s.ai.goal === "totem") {
    if (t.cleansed) setGoal(s, "decide", null, true);
    else game.performTotem(s, t, dt, true);
  }
}

export function updateKillerAI(game, k, dt) {
  if (k.isPlayer || k.stun > 0) return;

  k.ai.think -= dt;
  k.vx = 0;
  k.vy = 0;

  if (k.carrying) {
    const hook = game.safeHookForKiller();
    if (hook) {
      if (dist(k, hook) > 40) game.smartMove(k, hook, k.speed, dt, { stopRange: 38, repathEvery: 0.35 });
      else game.hookSurvivor(k.carrying, hook);
    } else {
      const p = game.map.randomOpenPointReachableFrom(k, 240, 500);
      game.smartMove(k, p, k.speed * 0.82, dt, { stopRange: 42, repathEvery: 0.7 });
    }
    return;
  }

  const downedClose = nearest(game.survivors, k, s => s.alive && s.state === "downed" && !s.carried && !s.onHook && dist(k, s) < 56);
  if (downedClose) {
    game.pickUpSurvivor(downedClose);
    return;
  }

  const visible = game.survivors
    .filter(s => s.alive && s.interactable && !s.inLocker)
    .filter(s => dist(k, s) < (s.state === "injured" || s.revealed > 0 ? 520 : 420))
    .filter(s => s.revealed > 0 || !game.map.lineBlocked(k, s))
    .sort((a, b) => {
      const woundedA = a.state === "injured" ? -90 : 0;
      const woundedB = b.state === "injured" ? -90 : 0;
      return dist(k, a) + woundedA - (dist(k, b) + woundedB);
    })[0];

  const trail = game.findFreshTrailNear(k, 470);
  const noise = game.noises
    .filter(n => n.life > 0)
    .sort((a, b) => dist(k, a) - dist(k, b))[0];

  if (visible) {
    setGoal(k, "chase", visible, true);
    k.ai.lostTimer = 2.2;
  } else if (trail && Math.random() < 0.90) {
    setGoal(k, "investigate", trail, true);
  } else if (noise && Math.random() < 0.95) {
    setGoal(k, "investigate", noise, true);
  } else if (k.ai.lostTimer > 0 && k.ai.target) {
    k.ai.lostTimer -= dt;
  } else if (k.ai.think <= 0 || !k.ai.target) {
    k.ai.think = rand(0.55, 1.2) / game.difficulty.killerAi;

    const carriedHook = nearest(game.survivors, k, s => s.alive && s.onHook);
    const gate = game.gensDone >= GAME.gensNeeded ? nearest(game.gates, k, g => true) : null;
    const gen = [...game.generators]
      .filter(g => !g.done)
      .sort((a, b) => (b.progress + b.users.size * 0.15) - (a.progress + a.users.size * 0.15))[0];

    if (carriedHook && Math.random() < 0.18) setGoal(k, "patrol", carriedHook, true);
    else if (gate && Math.random() < 0.55) setGoal(k, "patrol", gate, true);
    else if (gen) setGoal(k, "patrol", gen, true);
    else setGoal(k, "patrol", choose([...game.hooks, ...game.gates]), true);
  }

  if (k.ai.goal === "chase" && k.ai.target) {
    const t = k.ai.target;
    if (!t.alive || t.onHook || t.inLocker) {
      setGoal(k, "decide", null, true);
      return;
    }

    const palletBlocking = nearest(game.pallets, k, p => p.used && !p.broken && dist(p, k) < 64);
    if (palletBlocking && Math.random() < 0.80) {
      game.breakPallet(palletBlocking);
      setGoal(k, "chase", t, true);
      return;
    }

    if (dist(k, t) < 48 && k.attackCd <= 0) {
      game.killerAttack(k);
      return;
    }

    if (k.powerCd <= 0 && dist(k, t) > 125 && dist(k, t) < 290 && !game.map.lineBlocked(k, t) && Math.random() < 0.018 * game.difficulty.killerAi) {
      game.useKillerPower();
    }

    if (k.trapCd <= 0 && dist(k, t) > 155 && dist(k, t) < 260 && Math.random() < dt * 0.05) game.placeTrap(false);

    const lead = {
      x: t.x + (t.vx || 0) * 0.22,
      y: t.y + (t.vy || 0) * 0.22
    };
    const ok = game.smartMove(k, lead, k.speed * game.difficulty.killerAi, dt, { stopRange: 42, repathEvery: 0.25, directRange: 130 });
    if (!ok) setGoal(k, "investigate", t, true);
    return;
  }

  if (k.ai.goal === "investigate" && k.ai.target) {
    if (dist(k, k.ai.target) > 44) game.smartMove(k, k.ai.target, k.speed * 0.92 * game.difficulty.killerAi, dt, { stopRange: 44, repathEvery: 0.4 });
    else setGoal(k, "decide", null, true);
    return;
  }

  if (k.ai.goal === "patrol" && k.ai.target) {
    if (dist(k, k.ai.target) > 56) {
      const ok = game.smartMove(k, k.ai.target, k.speed * 0.82 * game.difficulty.killerAi, dt, { stopRange: 52, repathEvery: 0.6 });
      if (!ok) setGoal(k, "decide", null, true);
    } else {
      if (k.ai.target.progress > 0.08 && !k.ai.target.done) game.kickGenerator(k.ai.target);
      if (Math.random() < 0.30 && k.trapCd <= 0) game.placeTrap(false);
      setGoal(k, "decide", null, true);
    }
  }
}
