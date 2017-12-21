var $canvas = $("#mainC");
var $ground = $("#ground");
var mainW = $canvas.width();
var mainH = $canvas.height();
var ctx = $canvas[0].getContext("2d");
var bottom = $ground[0].getContext("2d");
var w = mainW/10,h = mainH/10;
$mask = $(".mask");
function MapInit(floor) {
    lock = true;
    $mask.show();
    $mask.animate({"opacity":1},600,function () {
        for(var x=0;x<10;x++){
            for(var y=0;y<10;y++){
                if(map[floor][x][y]){
                    bottom.drawImage(ground[floor],y*w,x*h,w,h);//  因为用png画图，为了每个功能格子有背景色添加bottom层
                }
            }
        }
        ctx.clearRect(0,0,mainW,mainH);
        for(var x=0;x<10;x++){
            for(var y=0;y<10;y++){
                if(map[floor][x][y]){
                    ctx.drawImage(map[floor][x][y].img,y*w,x*h,w,h);
                }
            }
        }
        setTimeout(function () {
            $mask.animate({"opacity":0},600,function () {
                $mask.hide();
                lock = false;
            });
        },1000);
        getPosition();
    });
}


function update(x,y,direction) {
    ctx.clearRect(nowX*w,nowY*h,w,h);
    map[floor][nowY][nowX] = "";
    nowX += x;
    nowY += y;
    map[floor][nowY][nowX] = p1;
    ctx.clearRect(nowX*w,nowY*h,w,h);
    ctx.drawImage(p1.imgArr[direction],nowX*w,nowY*h,w,h);

}

function maze(moveX,moveY,direction) {
    if (step--) {
        return;
    }
    bottom.clearRect(nowX * w - w, nowY * h - w, 3 * w, 3 * h);
    ctx.clearRect(nowX * w - w, nowY * h - w, 3 * w, 3 * h);
    map[floor][nowY][nowX] = "";
    nowX += moveX;
    nowY += moveY;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            bottom.drawImage(ground[floor],j*w,i*h,w,h)
        }
    }
    map[floor][nowY][nowX] = p1;
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            var img = map[floor][x][y] === p1 ? p1.imgArr[direction] : map[floor][nowY - 1 + y][nowX - 1 + x].img;
            ctx.drawImage(img, y * w, x * h, w, h);
        }
    }
}