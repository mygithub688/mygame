var GameStart = (function(_super){
    function GameStart(){
        GameStart.super(this);
        this.startBtn.on(Laya.Event.CLICK,this,this.onStartGame);
    }
    Laya.class(GameStart,"GameStart",_super);
    var _proto = GameStart.prototype;
    _proto.onStartGame = function()
    {
        //先移除自己，然后跳转到游戏界面
        this.removeSelf();
        //判断是否有实例化游戏类，没有的话就实例化
        if(!LayaSample.game){
            LayaSample.game = new Game();
        }
        LayaSample.game.gameStart();
        Laya.stage.addChild(LayaSample.game);
    }
    return GameStart;  
})(ui.GameStartUI);