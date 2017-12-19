var keyup = false, keydown, lock, timeout;
var $prompt = $("#prompt");
var $pk = $(".pk-view");
var $speak = $("#speak");
var index,talk,step;
init();

$("body").on("keydown", function (e) {
    keydown = true;
    if (!lock) {
        // if(!keyup){
        switch (e.keyCode) {
            case 37:
                move(-1, 0, 0);
                break;
            case 38:
                move(0, -1, 1);
                break;
            case 39:
                move(1, 0, 2);
                break;
            case 40:
                move(0, 1, 3);
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
$(".button").on("click", function (e) {
    $("#dead").hide(200);
    if (e.target.id === "back") {
        p1.ATK = Math.max(Math.floor(p1.ATK * 0.7), 0);
        p1.DEF = Math.max(Math.floor(p1.DEF * 0.7), 0);
        p1.HP = 300;
        p1.money = Math.max(Math.floor(p1.money * 0.7), 0);
        p1.name = "奄奄一息的勇士";
        statusUp();
    }
    if (e.target.id === "god") {
        whosyourdaddy();
    }
    if (e.target.id === "over") {
        $(".over-view").show(800);
    }
});

$(".new-game").click(function () {
    init();
});

$("#speak-content").on('click',function () {
    if(index === talk.length){
        index = 0;
        $speak.hide();
    }else {
        $(this).text(talk[index]);
        index++;
    }
});
$("#speak-before").find("p").on('click',function () {
    index = Math.max(--index,0);
    var i=0,len=talk[index].length;
    var show = setInterval(function () {
        $(this).text(talk[index][i++]);
        if(i === len){
            clearInterval(show);
        }
    },50);

});
function once(fn,context) {
    return function () {
        if(fn) {
            fn.apply(context || this, arguments);
            fn = null;
        }
    }
}

function move(x, y, direction) {
    var toX = nowX + x,
        toY = nowY + y;
    if (toX > 9 || toX < 0 || toY > 9 || toY < 0) {
        return;
    }
    var a = map[floor][toY][toX];
    walk();
    if (!a) {
        if(floor === 11){
            once(function () {
                step = p1.lv;
            })();
            maze(x, y, direction);
        }else {
            update(x, y, direction);
        }
        return;
    }
    var type = a.id.slice(0, 1);
    switch (type) {
        case "m":                     //怪
            pk(a, x, y, direction);
            break;
        case "g":                     //物品
            a.updateState();
            update(x, y, direction);
            break;
        // case "n":                     //人物
        //     speak();
        //     break;
        case "u":                     //上楼
            floor++;
            MapInit(floor);
            play_floor();
            break;
        case "d":                     //下楼
            floor--;
            MapInit(floor);
            play_floor();
            break;
    }

}

function pk(a, x, y, direction) {
    lock = true;
    fight_sound();
    var data = {
        mATK: a.ATK,
        mDEF: a.DEF,
        mHP: a.HP,
        mMoney: a.money,
        mJingyan: a.jingyan,
        mImg: a.img.src,
        mName: a.name,
        pATK: p1.ATK,
        pDEF: p1.DEF,
        pHP: p1.HP,
        pLv: p1.lv,
        pName: p1.name
    };
    var html = template("pk", data);
    $pk.html(html);
    $pk.show();
    var hurtP = Math.max((p1.ATK - a.DEF), 0);
    var hurtM = Math.max((a.ATK - p1.DEF), 0);
    var mHP = a.HP;
    var pHP = p1.HP;
    var pk = setInterval(function () {
        mHP = Math.max((mHP - hurtP), 0);
        pHP = Math.max((pHP - hurtM), 0);
        $(".left .hp span").text(mHP);
        $(".right .hp span").text(pHP);
        if (!mHP) {
            p1.HP = pHP;
            $pk.html("");
            $pk.hide();
            clearInterval(pk);
            p1.money += a.money;
            p1.jingyan += a.jingyan;
            p1.sj();
            a.ability && a.ability();
            $prompt.find("span").text(a.jingyan + "点经验和" + a.money + "金币！");
            $prompt.show(200);
            update(x, y, direction);
            setTimeout(function () {
                $prompt.hide(500);
                lock = false;
            }, 1000);
        } else if (!pHP) {
            p1.HP = pHP;
            $("#dead").show(300);
        }
    }, 300);

}

function statusUp() {
    var data = {
        ATK: p1.ATK,
        DEF: p1.DEF,
        HP: p1.HP,
        name: p1.name,
        money: p1.money,
        lv: p1.lv,
        jingyan: p1.jingyan
    };
    var html = template("status", data);
    $("#status-contain").html(html);
}

function getPosition() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (map[floor][i][j] === p1) {
                nowX = j;
                nowY = i;
            }
        }
    }
}

