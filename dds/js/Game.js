//继承UI文件，接收父类
var Game = (function(_super){
    function Game(){
        this.moles = new Array;   //定义数组存存放逻辑类
        this.moleNum = 9;         //定义地鼠的数量
        Game.super(this);

        this.hitCallBackHd = Laya.Handler.create(this,this.setScore,null,false);  //create  从对象池中取
        for(var i =0; i < this.moleNum;i++)
        {
            this.box = this.getChildByName("item"+i);
            this.mole = new Mole(this.box.getChildByName("normal"),this.box.getChildByName("hit"),21
            ,this.hitCallBackHd,this.box.getChildByName("scoreimg"));    //this.hitCallBackHd  添加的回调参数，获取分数
            this.moles.push(this.mole);
        }
        //实例化锤子类
        this.hammer = new Hammer();
        this.addChild(this.hammer);
        //先隐藏，准备主动调用锤子显示
        this.hammer.visible = false;
    }
    //注册类
    //三个参数（主函数，路径，继承的父类）
    Laya.class(Game,"Game",_super);
    var _proto = Game.prototype;
    // _proto.onLoop = function(){
    //     //调用显示的方法
    //     this.mole.show();
    // }
    _proto.isShow = function(){
        this.timeBar.value-=(1/15);
        if(this.timeBar.value<=0)
        {
            //console.log("游戏结束");
            this.gameOver();
            return;
        }
        //this.mole.show();
        //随机九个地鼠的坐标
        this.index = Math.floor(Math.random()*this.moleNum);
        this.moles[this.index].show();
    }
    
    //游戏结束的方法
    _proto.gameOver = function(){
        Laya.timer.clear(this,this.isShow);
        //隐藏小锤子
        this.hammer.visible = false;
        this.hammer.end();
        //console.log("游戏结束");
        //判断是否实例化游戏结束的类
        if(!LayaSample.gameOver)
        {
            LayaSample.gameOver = new GameOver();
        }
        //设置游戏结束界面的显示位置
        LayaSample.gameOver.centerX = 0;
        LayaSample.gameOver.centerY = 40;
        //游戏结束，传分数并且计算
        LayaSample.gameOver.setScoreUI(this.score);
        Laya.stage.addChild(LayaSample.gameOver);
    }
    _proto.setScore = function(type){
        this.score+=(type==1?-100:100);
        //
        this.timeBar.value+=(type==1?-(1/10):(1/10));
        //刚开始加载时候会是负数，所以判断并且等于0
        if(this.score<=0)this.score = 0;
        this.updateScoreUI();
    }
    _proto.updateScoreUI = function(){
        this.data = {};
        this.temp = this.score;
        for(var i=9; i>=0;i--)
        {
            this.data['item'+i] = {index:Math.floor(this.temp%10)};
            this.temp/=10;
        }
        this.scoreNums.dataSource = this.data;
    }
    //游戏开始，设置初始值
    _proto.gameStart = function(){
        //设置进度条初始值
        this.timeBar.value = 1;
        //得分
        this.score = 0;
        //计分
        this.updateScoreUI();
        //调用显示游戏锤子
        this.hammer.visible = true;
        //开始使用锤子
        this.hammer.start();
        //三个参数    this.normal 地鼠的常态图 this.hit 地鼠的受击图 ,常态地鼠的最低点Y
        //this.mole = new Mole(this.normal,this.hit,21);
        //定时重复执行
        //Laya.timer.loop(2000,this,this.onLoop);

        //this.scoreNums.dataSource = {item0:{index:5},item1:{index:6}};
        Laya.timer.loop(1000,this,this.isShow);
    }
    return Game;
})(ui.GameUI);