export const LEVELS = [
  {
    id: "level-0",
    number: "0",
    name: "The Yellow Hell",
    menuName: "Level 0 - The Yellow Hell",
    type: "yellow",
    prompt: "Pulsa E para atravesar la pared parpadeante",
    nextText: "La moqueta desaparece bajo tus pies. Huele a hormigón mojado.",
    palette: {
      floorA: "#b6a15c",
      floorB: "#aa9652",
      wallA: "#d5c55a",
      wallB: "#c9bc52",
      trim: "#756b2f",
      light: "#fff7bb",
      shadow: "#0a0801",
      fog: "rgba(255, 232, 115, 0.05)"
    }
  },
  {
    id: "level-1",
    number: "1",
    name: "Habitable Zone",
    menuName: "Level 1 - Habitable Zone",
    type: "warehouse",
    prompt: "Pulsa E para cruzar la puerta industrial",
    nextText: "Las tuberías empiezan a cubrir las paredes. Mal asunto, colega.",
    palette: {
      floorA: "#77776d",
      floorB: "#68685f",
      wallA: "#555851",
      wallB: "#474a45",
      trim: "#9b9b8a",
      light: "#dfe7d4",
      shadow: "#070807",
      fog: "rgba(180, 190, 180, 0.08)"
    }
  },
  {
    id: "level-2",
    number: "2",
    name: "Abandoned Utility Halls",
    menuName: "Level 2 - Abandoned Utility Halls",
    type: "pipes",
    prompt: "Pulsa E para entrar por el túnel que baja",
    nextText: "El ruido eléctrico se vuelve insoportable.",
    palette: {
      floorA: "#5a5145",
      floorB: "#4a4238",
      wallA: "#6a594a",
      wallB: "#4d4038",
      trim: "#9e6237",
      light: "#ffb163",
      shadow: "#090604",
      fog: "rgba(255, 128, 40, 0.05)"
    }
  },
  {
    id: "level-3",
    number: "3",
    name: "Electrical Station",
    menuName: "Level 3 - Electrical Station",
    type: "electrical",
    prompt: "Pulsa E para forzar la compuerta metálica",
    nextText: "De pronto todo parece una oficina vacía. No es necesariamente mejor.",
    palette: {
      floorA: "#54575d",
      floorB: "#3e4146",
      wallA: "#6c4f3e",
      wallB: "#51372d",
      trim: "#c07d43",
      light: "#d2eaff",
      shadow: "#030405",
      fog: "rgba(120, 170, 255, 0.045)"
    }
  },
  {
    id: "level-4",
    number: "4",
    name: "Abandoned Office",
    menuName: "Level 4 - Abandoned Office",
    type: "office",
    prompt: "Pulsa E para usar el ascensor silencioso",
    nextText: "El ascensor se abre en un hotel que parece demasiado limpio.",
    palette: {
      floorA: "#8c9298",
      floorB: "#777e85",
      wallA: "#d2d0c8",
      wallB: "#bcbab1",
      trim: "#5e6670",
      light: "#eff6ff",
      shadow: "#08090a",
      fog: "rgba(200, 220, 240, 0.04)"
    }
  },
  {
    id: "level-5",
    number: "5",
    name: "Terror Hotel",
    menuName: "Level 5 - Terror Hotel",
    type: "hotel",
    prompt: "Pulsa E para abrir la puerta del servicio",
    nextText: "Se apagan todas las luces. Ahora sí que se ha puesto tonta la cosa.",
    palette: {
      floorA: "#7c2d22",
      floorB: "#5f211b",
      wallA: "#d6c19a",
      wallB: "#bda77f",
      trim: "#4a2418",
      light: "#ffd08a",
      shadow: "#070302",
      fog: "rgba(255, 160, 70, 0.05)"
    }
  },
  {
    id: "level-6",
    number: "6",
    name: "Lights Out",
    menuName: "Level 6 - Lights Out",
    type: "darkness",
    prompt: "Pulsa E para bajar por las escaleras donde suenan olas",
    nextText: "Escuchas agua. Muchísima agua. Iván, no mires abajo.",
    palette: {
      floorA: "#101010",
      floorB: "#070707",
      wallA: "#161616",
      wallB: "#0b0b0b",
      trim: "#252525",
      light: "#1b1b1b",
      shadow: "#000000",
      fog: "rgba(0, 0, 0, 0.16)"
    }
  },
  {
    id: "level-7",
    number: "7",
    name: "Thalassophobia",
    menuName: "Level 7 - Thalassophobia",
    type: "ocean",
    prompt: "Pulsa E para alcanzar la puerta sobre la plataforma",
    nextText: "La humedad se convierte en piedra fría. Cuevas. Muchas cuevas.",
    palette: {
      floorA: "#363a3f",
      floorB: "#272b30",
      wallA: "#54575a",
      wallB: "#3e4144",
      trim: "#7a858d",
      light: "#7ea6b8",
      shadow: "#010407",
      fog: "rgba(80, 150, 190, 0.08)"
    }
  },
  {
    id: "level-8",
    number: "8",
    name: "Cave Systems",
    menuName: "Level 8 - Cave Systems",
    type: "caves",
    prompt: "Pulsa E para colarte por el hueco con aire frío",
    nextText: "La piedra se abre a una calle nocturna. Muy normal todo.",
    palette: {
      floorA: "#3b332c",
      floorB: "#2b2520",
      wallA: "#1c1815",
      wallB: "#14110f",
      trim: "#796955",
      light: "#b88445",
      shadow: "#010101",
      fog: "rgba(80, 55, 35, 0.10)"
    }
  },
  {
    id: "level-9",
    number: "9",
    name: "The Suburbs",
    menuName: "Level 9 - The Suburbs",
    type: "suburbs",
    prompt: "Pulsa E para entrar en la casa con la puerta imposible",
    nextText: "La calle se transforma en campos infinitos.",
    palette: {
      floorA: "#4a4d43",
      floorB: "#3c4037",
      wallA: "#8d8374",
      wallB: "#6d655b",
      trim: "#2b2d2f",
      light: "#d1d8ff",
      shadow: "#010209",
      fog: "rgba(60, 80, 140, 0.10)"
    }
  },
  {
    id: "level-10",
    number: "10",
    name: "Bumper Crop",
    menuName: "Level 10 - Bumper Crop",
    type: "fields",
    prompt: "Pulsa E para cruzar la línea de árboles",
    nextText: "La tierra se vuelve asfalto, hormigón y edificios infinitos.",
    palette: {
      floorA: "#a99a4a",
      floorB: "#8f813d",
      wallA: "#34522d",
      wallB: "#243a22",
      trim: "#796331",
      light: "#c9c0a8",
      shadow: "#11130c",
      fog: "rgba(210, 210, 190, 0.10)"
    }
  },
  {
    id: "level-11",
    number: "11",
    name: "The City That Never Sleeps",
    menuName: "Level 11 - The City That Never Sleeps",
    type: "city",
    prompt: "Pulsa E para entrar al edificio sin interior",
    nextText: "Todo se vuelve blanco, húmedo y absurdamente limpio.",
    palette: {
      floorA: "#5c6164",
      floorB: "#454a4e",
      wallA: "#969a9c",
      wallB: "#6d7377",
      trim: "#d0d6d9",
      light: "#f2f6ff",
      shadow: "#050607",
      fog: "rgba(180, 200, 210, 0.06)"
    }
  },
  {
    id: "level-37",
    number: "37",
    name: "Sublimity",
    menuName: "Level 37 - The Poolrooms",
    type: "poolrooms",
    prompt: "Pulsa E para sumergirte en el umbral azul verdoso",
    nextText: "Has salido de la ruta principal. O eso parece.",
    palette: {
      floorA: "#dce6d8",
      floorB: "#c9d5cc",
      wallA: "#eef5ed",
      wallB: "#d7e2d9",
      trim: "#8aa59c",
      light: "#dffff2",
      shadow: "#02100f",
      fog: "rgba(120, 230, 215, 0.08)"
    }
  }
];

export function getLevelById(id) {
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0];
}

export function getNextLevel(currentId) {
  const index = LEVELS.findIndex((level) => level.id === currentId);
  return LEVELS[(index + 1) % LEVELS.length];
}