
//  怪兽对象
function Monster(id, img, ATK, DEF, HP, jingyan, money, name, ability) {
    this.id = id;
    this.ATK = ATK;
    this.DEF = DEF;
    this.HP = HP;
    this.jingyan = jingyan;
    this.money = money;
    this.name = name;
    this.img = img;
    this.ability = ability;
}
 
//  玩家对象
function Player (id, img, ATK, DEF, HP, money, imgArr, name, key ,lv ) {
    this.id = id || 0;
    this.img = img || imgPath;
    this.ATK = ATK || 10;
    this.DEF = DEF || 0;
    this.HP = HP || 100;
    this.money = money || 0;
    this.key = key || 0;
    this.jingyan = 0;
    this.imgArr = imgArr;
    this.lv = lv || 0;
    this.name = name || "勇士";
    // this.lv = jingyan/100;
}

Player.prototype.sj = function () {
    while(this.jingyan>=100){
        this.jingyan -= (100 + this.lv*30);
        this.lv++;
        var ATK =  5 + Math.floor(this.lv/2);
        var DEF  3 + Math.floor(this.lv/2);
        var HP = 50 + this.lv*10;
        this.ATK += ATK;
        this.DEF += DEF;
        this.HP += HP;
        $prompt.find("span").text("升级了！"+"攻击力提升" + ATK + "点，防御力提升" + DEF + "点，血量提升" + HP);
        $prompt.show(400);
        setTimeout(function () {
            $prompt.hide(500);
            lock = false;
        }, 2000);
    }
    statusUp();
};

//  物品对象
function Goods(id, img, ATK, DEF, HP, jingyan, money, name, speak) {
    this.img = img;
    this.id = id;
    this.ATK = ATK;
    this.DEF = DEF;
    this.HP = HP;
    this.jingyan = jingyan;
    this.money = money;
    this.name = name;
    this.img = img;
    this.speak = speak || this.name + "!";
    if(ATK){
        this.speak += "攻击力+" + ATK + "!";
    }
    if(DEF){
        this.speak += "防御力+" + DEF +"!";
    }
    if(HP){
        this.speak += "血量+" + HP + "!";
    }
    if(jingyan){
        this.speak += "攻击力+" + jingyan + "!";
    }
    if(money){
        this.speak += "金币+" + money + "!";
    }
}
Goods.prototype.updateState = function () {
    clearTimeout(timeout);
    p1.ATK += this.ATK;
    p1.DEF += this.DEF;
    p1.money += this.money;
    p1.HP += this.HP;
    p1.jingyan += this.jingyan;
    $prompt.show(300);
    $prompt.find("span").text(this.speak);

    timeout = setTimeout(function () {
        $prompt.hide(500);
    },1000);
    if(p1.jingyan){
        p1.sj();
        statusUp();
    }
};
