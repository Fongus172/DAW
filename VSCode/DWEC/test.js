function enemyInfo(enemyName = "MobIsMissingID", enemyHP = "null") {
    console.log("+---------------------------------+");
    console.log("| " + enemyName + " | PS: " + enemyHP + "       |");
}

function frame() {
    console.log("+---------------------------------+");
    console.log("|                                 |");
    console.log("|                                 |");
    console.log("|                                 |");
    console.log("|                                 |");
    console.log("|                                 |");
    console.log("|                                 |");
    console.log("|                                 |");
    console.log("|                                 |");
    console.log("+---------------------------------+");
}

function playerInfo(playerHP = "null") {
    console.log("| PS: " + playerHP + "                        |")
    console.log("+---------------------------------+");
}

function screen() {
    enemyInfo();
    frame();
    playerInfo();
}

screen();