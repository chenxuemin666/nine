plugIn = false;
function whosyourdaddy() {
    if(!plugIn){
        p1.ATK += 1000;
        p1.DEF += 1000;
        p1.HP += 10000;
        p1.lv += 100;
        p1.money += 1000;
        p1.name = "开挂的勇士";
        plugIn = true;
        statusUp();
    }
}
function whosyourson() {
    if(plugIn){
        p1.ATK -= 1000;
        p1.DEF -= 1000;
        p1.HP -= 10000;
        p1.lv -= 100;
        p1.money -= 1000;
        p1.name = "外挂到期的勇士";
        plugIn = false;
        statusUp();
    }
}