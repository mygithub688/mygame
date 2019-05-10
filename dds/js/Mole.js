var Mole = (function(){
    function Mole(normalState,hitState,downY,hitCallBackHd,scoreImg){
        this.normalState = normalState;
        this.hitState = hitState;
        this.downY = downY;   //最低点的坐标
        this.upY = this.normalState.y;   //常态的坐标
        this.hitCallBackHd = hitCallBackHd;  //计分
        this.scoreImg= scoreImg;  //分数图片
        this.scoreY = this.scoreImg.y;      //y点就是图片当前的位置
        this.normalState.on(Laya.Event.CLICK,this,this.hit);
        this.reset();  //先调用重置方法，避免刷新时候直接显示UI
    };
    //接收类的原型
    var _proto = Mole.prototype;
    //重置
    _proto.reset = function(){
        //不显示常态图
        this.normalState.visible = false;
        //不显示受击图
        this.hitState.visible = false;
        //是否是激活状态
        this.isVctive = false;
        //地鼠是否显示
        this.isShow = false;
        //地鼠的受击
        this.isHit = false;
        //分数的图片显示
        this.scoreImg.visible = false;
    }
    //显示
    _proto.show = function(){
        if(this.isVctive)return;
        this.isVctive = true;
        this.isShow = true;
        //加上另一种地鼠，随机显示
        this.type = Math.random()<0.3?1:2;
        this.normalState.skin = "comp/mouse_normal_"+this.type+".png";    //.skin  皮肤地址
        this.hitState.skin = "comp/mouse_hit_"+this.type+".png";
        this.scoreImg.skin = "comp/score_"+this.type+".png";
        this.normalState.y = this.downY;
        this.normalState.visible = true;
        this.hitState.visible = false;
        //缓动类    变化的对象，变化的属性类表，花费的时间，缓动类型，运行结束后的回调   ,最后还有一个延迟执行的时间，此处不用到
        Laya.Tween.to(this.normalState,{y:this.upY},500,Laya.Ease.backOut,Laya.Handler.create(this,this.showComplete));
    }
    //停留
    _proto.showComplete = function(){
        //
        if(this.isShow && !this.isHit)
        {
            //定时执行函数     定时时间，执行域，回调消失的方法
            Laya.timer.once(2000,this,this.hide);
        }
    }
    //消失
    _proto.hide = function(){
        if(this.isShow && !this.isHit)
        {
            this.isShow = false;
            Laya.Tween.to(this.normalState,{y:this.downY},300,Laya.Ease.backIn,Laya.Handler.create(this,this.reset));
        }
    }
    //受击
    _proto.hit = function(){
        if(this.isShow && !this.isHit)
        {
            this.isShow = false;
            this.isHit = true;
            //清除定时器，避免停留那边的两秒定时器，造成错误
            Laya.timer.clear(this,this.hide);   
            this.normalState.visible = false;
            this.hitState.visible = true;
            //将受击的类型传出去   回调函数有run方法，是立即执行的而且不会挟带参数，所以用runWith,将地鼠的类型传出去
            this.hitCallBackHd.runWith(this.type);
            //定时器调用重置方法
            Laya.timer.once(500,this,this.reset);
            //受击后调用显示分数数字图片的方法
            this.showScore();   
        }
    }
    //显示受击数字的方法
    _proto.showScore = function()
    {
        this.scoreImg.y = this.scoreY + 30;
        this.scoreImg.scale(0,0);   //缩放的效果
        this.scoreImg.visible = true;
        Laya.Tween.to(this.scoreImg,{y:this.scoreY,scaleX:1,scaleY:1},300,Laya.Ease.backOut);
    }
    return Mole;
})();