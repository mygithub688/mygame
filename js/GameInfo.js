//游戏UI文件
var GameInfo = (function(_super){
    function GameInfo(){
        GameInfo.super(this);
        //注册按钮点击事件，点击后暂停游戏
        this.pauseBtn.on(Laya.Event.CLICK,this,this.onPauseBtnClick);
        //初始化UI显示
        this.reset();
    }
    //注册类
    Laya.class(GameInfo,"GameInfo",_super);
    var _proto = GameInfo.prototype;
    _proto.reset = function(){
        this.infoLabel.text = "";
        this.hp(5);
        this.level(0);
        this.score(0);
    }
    _proto.onPauseBtnClick = function(e){
        e.stopPropagation();
        //暂停游戏
        this.infoLabel.text = "游戏已暂停，点击任意地方恢复游戏";
        this.infoLabel.color = "#ffffff";
        pause();
        Laya.stage.once(Laya.Event.CLICK,this,this.onStageClick);
    }
    _proto.onStageClick = function(){
        this.infoLabel.text = "";
        resume();
    }
    //显示血量
    _proto.hp = function(value){
        this.hpLabel.text = "HP:"+value;
    }
    //显示关卡级别
    _proto.level = function(value){
        this.levelLabel.text = "Level:"+value;
    }
    //显示积分
    _proto.score = function(value){
        this.scoreLabel.text = "Score:"+value;
    }
    //boss关
    _proto.bossComing = function(){
        this.infoLabel.text = "全民偶像练习生来袭！！！";
        this.infoLabel.color = "red";
        this.infoLabel.fontSize = 30;
        Laya.timer.once(3000, this, this.onComplete);
    }
    //进入下一关
    _proto.nextTage = function(value){
        this.infoLabel.text = "第" +value+ "关";
        this.infoLabel.color = "#ffffff";
        Laya.timer.once(3000, this, this.onComplete);
    }
    _proto.onComplete = function(){
        this.infoLabel.text = "";
    }
    return GameInfo;
})(ui.GameInfoUI);