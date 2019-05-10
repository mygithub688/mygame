var GameOver = (function(_super){
    function GameOver(){
        GameOver.super(this);
        this.restartBtn.on(Laya.Event.CLICK,this,this.restartGame);
    }
    Laya.class(GameOver,"GameOver",_super);
    var _proto = GameOver.prototype;
    _proto.restartGame = function(){
        //先移除自己
        this.removeSelf();
        //移除正在显示的游戏面板
        LayaSample.game.removeSelf();
        Laya.stage.addChild(LayaSample.gameStart);
    }
    //游戏结束计分的方法
    _proto.setScoreUI = function(score){
        this.data = {};
        this.temp = score;
        for(var i=9;i>=0;i--){
            this.data["item"+i] = {index:Math.floor(this.temp%10)};
            this.temp/=10;
        }
        this.scoreNums.dataSource = this.data;
    }
    return GameOver;
})(ui.GameOverUI);