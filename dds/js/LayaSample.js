// var LayaSample = (function(){
//     (function()
//     {   
//         //初始化引擎
//         Laya.init(800,600);
//         //设置stage颜色
//         Laya.stage.bgColor = '#ffffff';
//         //加载资源          //图集的描述文件  资源加载后的回调 （执行域，回调方法）   进度回调        资源类型
//         Laya.loader.load("res/atlas/comp.json",Laya.Handler.create(this,onLoaded),null,Laya.Loader.ATLAS);

//     })();
//     function onLoaded(){
//         var game = new Game();
//         Laya.stage.addChild(game);
//     }
// })();
(function(){
    (function(LayaSample)
    {   
        //初始化引擎
        Laya.init(800,600);
        Laya.stage.scaleMode = Laya.Stage.SCALE_NOSCALE;   //不缩放
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;   //水平居中
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;   //垂直居中
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;  //自动横屏   Laya.Stage.SCREEN_NONE,不改变屏幕显示
        //设置stage颜色
        Laya.stage.bgColor = '#ffffff';
        //加载资源          //图集的描述文件  资源加载后的回调 （执行域，回调方法）   进度回调        资源类型
        Laya.loader.load("res/atlas/comp.json",Laya.Handler.create(this,onLoaded),null,Laya.Loader.ATLAS);

    })();
    function onLoaded(){
        // var game = new Game();
        // Laya.stage.addChild(game);
        LayaSample.gameStart = new GameStart();
        Laya.stage.addChild(LayaSample.gameStart);
    }
})(window.LayaSample || (window.LayaSample = {}));