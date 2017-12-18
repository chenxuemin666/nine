var keyup = false,keydown,lock,timeout;
var $prompt = $("#prompt");
var $pk = $(".pk-view");

MapInit(floor);
statusUp();
$("body").on("keydown",function (e) {
    keydown = true;
    if(!lock){
        // if(!keyup){
            switch (e.keyCode){
                case 37:
                    move(-1,0,0);
                    break;
                case 38:
                    move(0,-1,1);
                    break;
                case 39:
                    move(1,0,2);
                    break;
                case 40:
                    move(0,1,3);
                    break;
            }
        // }
    }
});
// $("body").on("keyup",function (e) {
//     if(keydown){
//         keyup = true;
//         keydown = false;
//     }
// });
$(".button").on("click",function (e) {
    $("#dead").hide();
    if(e.target.id === "back"){
        $("#status-contain .name").text("奄奄一息的勇士");

    }
    if(e.target.id === "god"){

    }
    if(e.target.id === "over"){

    }
});


function move (x, y ,direction) {
    var toX = nowX+x,
        toY = nowY+y;
    if(toX>9 || toX<0 || toY>9 || toY<0){
        return;
    }
    var a = map[floor][toY][toX];
    if(!a){
        update(x,y,direction);
        return;
    }
    var type = a.id.slice(0,1);
    switch (type){
        case "m":                     //怪
            pk(a,x,y,direction);
            break;
        case "g":                     //物品
            a.updateState();
            update(x,y,direction);
            break;
        case "n":                     //人物
            speak();
            break;
        case "l":                     //楼梯
            if(a.direction === "up"){
                floor++;
                getPosition();
                update(x,y,direction);
                MapInit(floor);
            }
    }

}

function pk(a,x,y,direction) {
    lock = true;
    var data = {
        mATK : a.ATK,
        mDEF : a.DEF,
        mHP : a.HP,
        mMoney : a.money,
        mJingyan : a.jingyan,
        mImg : a.img.src,
        mName : a.name,
        pATK : p1.ATK,
        pDEF : p1.DEF,
        pHP : p1.HP,
        pLv : p1.lv,
        pName : p1.name
    };
    var html = template("pk",data);
    $pk.html(html);
    $pk.show();
    var hurtP = Math.max((p1.ATK - a.DEF),0);
    var hurtM = Math.max((a.ATK - p1.DEF),0);
    var mHP = a.HP;
    var pHP = p1.HP;
    var pk = setInterval(function () {
        mHP = Math.max((mHP - hurtP),0);
        pHP = Math.max((pHP - hurtM),0);
        $(".left .hp span").text(mHP);
        $(".right .hp span").text(pHP);
        if(!mHP){
            p1.HP = pHP;
            $pk.html("");
            $pk.hide();
            clearInterval(pk);
            p1.money += a.money;
            p1.jingyan += a.jingyan;
            p1.sj();
            $prompt.find("span").text(a.jingyan + "点经验和" + a.money + "金币！");
            $prompt.show(200);
            update(x,y,direction);
            setTimeout(function () {
                $prompt.hide(500);
                lock = false;
            },1000);
        }else if(!pHP){
            p1.HP = pHP;
            $("#dead").show(300);
        }
    },1000);

}
function dead() {
    
}
function statusUp() {
    var data = {
        ATK : p1.ATK,
        DEF : p1.DEF,
        HP : p1.HP,
        name : p1.name,
        money : p1.money,
        lv : p1.lv,
        jingyan : p1.jingyan
    };
    var html = template("status",data);
    $("#status-contain").html(html);
}
function getPosition() {
    for(var i=0;i<10;i++){
        for(var j=0;j<10;j++){
            if(map[floor][i][j] === p1){
                nowX = j;
                nowY = i;
            }
        }
    }
}

function maze() {
    
}