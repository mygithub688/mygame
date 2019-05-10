var Hammer = (function(_super){
    function Hammer(){
        Hammer.super(this);
    }
    Laya.class(Hammer,"Hammer",_super);
    var _proto = Hammer.prototype;
    //开始使用锤子
    _proto.start = function(){
        //鼠标处理类,  Laya.Mouse.hide();  隐藏鼠标
        Laya.Mouse.hide(); 
        //参数 事件类型，作用域，事件监听函数
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
        this.onMouseMove();
    }
    //结束使用锤子
    _proto.end = function(){
        Laya.Mouse.show();
        //关闭事件监听
        Laya.stage.off(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
    }
    _proto.onMouseDown = function(){
        //播放定义好的锤子动画， 参数 开始播放的帧数，是否重复播放
        this.hit.play(0,false);
    }
    _proto.onMouseMove = function(){
        //锤子跟随鼠标的移动
        this.pos(Laya.stage.mouseX-this.width/2,Laya.stage.mouseY-this.height/3);
    }
    return Hammer;
})(ui.HammerUI);