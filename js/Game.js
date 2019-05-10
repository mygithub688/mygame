// var Game = (function(){
//     (function Game(){
        //子弹发射偏移位置表
        this.bulletPos = [[0],[-15,15],[-30,0,30],[-45,-15,15,45]];
        //关卡等级
        this.level = 0;
        //本关积分成绩
        this.score = 0;
        //总成绩
        this.allScore = 0;
        //升级等级所需的成绩数量
        this.levelUpScore = 10;
        //子弹级别
        this.bulletLevel = 0;
        //关卡
        this.checkpoint = 1;
        //是否BOSS关
        this.boss = null;
        this.bossFlg = false;
        this.bossLoop = true;
        this.direct = "right";
        //敌机血量
        this.hps = [1,2,2];
        //敌机速度
        this.speeds = [3,2,1];
        //敌机被击半径
        this.radius = [15,30,60];
        //技能是否冷却
        this.skillFlg = false;
        //初始化引擎，设置游戏宽高
        //初始化微信小游戏
        Laya.MiniAdpter.init();
        Laya.init(400,852,laya.webgl.WebGL);
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignH = "center";
        Laya.stage.screenMode = "vertical";
        //加载图集资源
        Laya.loader.load(["res/atlas/war.atlas","res/atlas/skill.atlas"],Laya.Handler.create(this,onLoaded),null,Laya.Loader.ATLAS);
        // Laya.loader.load("particleNew.part", Laya.Handler.create(this, onAssetsLoaded), null, Laya.Loader.JSON);
    // })();
    function onLoaded(){
        //创建循环滚动的背景
        this.bg = new BackGround();
        //把背景添加到舞台上显示出来
        Laya.stage.addChild(this.bg);

        //实例化角色容器
        this.roleBox = new Laya.Sprite();
        //添加到舞台上
        Laya.stage.addChild(this.roleBox);

        //创建游戏UI界面
        this.gameInfo = new GameInfo();
        this.gameInfo.item_skill.on(Laya.Event.MOUSE_DOWN,this,useSkill);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,onMouseUp);
        //添加到舞台上
        Laya.stage.addChild(this.gameInfo);

        //创建一个主角
        this.hero = new Role();
        //添加到舞台上
        this.roleBox.addChild(this.hero);
        //创建敌人
        // createEnemy(10);
    
        //开始游戏
        restart();
    }
    function onLoop(){
        //遍历所有飞机，更改飞机状态
        for(var i = this.roleBox.numChildren-1;i>-1;i--){
            var role = this.roleBox.getChildAt(i);
            if(role && role.speed){
                //根据飞机速度更改飞机位置
                if(role.bulletType == 1)
                {
                    // var dx = this.hero.x - role.x;       
                    // var dy = this.hero.y - role.y;
                    // var rad = Math.atan2(dy,dx);
                    // var vx = role.speed * Math.cos(rad);
                    // var vy = role.speed * Math.sin(rad);
                    var vx = role.speed * Math.cos(role.hudu);
                    var vy = role.speed * Math.sin(role.hudu);

                    role.x += vx;
                    role.y += vy;
                }
                else if(role.bulletType == 2)
                {
                    if(role.recDis >= role.dis)
                    {
                        role.visible = false;
                        for(var s=0;s<2;s++)
                        {
                            var bullet = Laya.Pool.getItemByClass("role",Role);
                            bullet.init("bullet4",1,1,6,1,1);
                            bullet.isBullet = true;
                            bullet.bulletType = 1;
                            var hudu = (2*Math.PI / 360) * (i/10) * 360;
                            bullet.hudu = hudu;
                            var x = role.x + Math.sin(hudu) * 96;
                            var y = role.y - Math.cos(hudu) * 96;
                            bullet.pos(x,y);
                            this.roleBox.addChild(bullet);
                        }
                    }
                    else
                    {
                        role.y += role.speed;
                        role.recDis += role.speed;
                    }
                }
                else
                {
                    role.y+=role.speed;
                    if(role.heroType == 6){
                        role.x -= 1;
                    }
                    else if(role.heroType == 7){
                        role.x += 1;
                    }
                }  
                //如果敌机移动到显示区域以外则移除
                if(role.y>1000 || !role.visible || (role.isBullet && role.y<-20)){
                    //从舞台移除
                    role.removeSelf();
                    //回收钱重置属性信息
                    role.isBullet = false;
                    role.visible = true;
                    role.bulletType = null;
                    role.hudu = null;
                    role.dis = null;
                    role.recDis = 0;
                    //回收到对象池
                    if(role.heroType != 4){
                        role.skewX = 0;
                        role.skewY = 0;
                        Laya.Pool.recover("role",role);
                    }
                    else{
                        role.destroy();
                    }
                }
            }
            //处理发射子弹逻辑
            if(role.shootType > 0){
                //获取到当前时间
                var time = Laya.Browser.now();
                //如果当前时间大于下次射击时间
                if(time>role.shootTime){
                    //更新下次射击时间
                    role.shootTime = time+role.shootInterval;

                    //根据不同子弹类型，设置不同的数量及位置
                    this.pos = this.bulletPos[role.shootType - 1];
                    for(var index = 0;index<pos.length;index++){
                        //从对象池里边创建一个子弹
                        var bullet = Laya.Pool.getItemByClass("role",Role);
                        //初始化子弹信息
                        bullet.init("bullet1",role.camp,1,-4-role.shootType - Math.floor(this.level / 15),1,1);
                        // //设置角色类型为子弹类型
                        bullet.isBullet = true;
                        //设置子弹发射初始化位置
                        bullet.pos(role.x+pos[index],role.y-role.hitRadius - 10);
                        //添加舞台上
                        this.roleBox.addChild(bullet);
                    }
                    //发射子弹声音
                    Laya.SoundManager.playSound("res/sound/bullet.mp3");
                }
            }
            //敌机释放子弹
            if(role.type == "enemy2" || role.type == "enemy3"){
                var time = Laya.Browser.now();
                if(time > role.shootTime){
                    if(role.type == "enemy2"){
                        role.shootTime = time+900;
                    }
                    else{
                        role.shootTime = time+700;
                    }
                    //从对象池里边创建一个子弹
                    var bullet = Laya.Pool.getItemByClass("role",Role);
                    //初始化子弹信息
                    bullet.init("bullet2",role.camp,1,5 + Math.floor(this.level / 15),1,1);
                    // //设置角色类型为子弹类型
                    bullet.isBullet = true;
                    //设置子弹发射初始化位置
                    bullet.pos(role.x,role.y);
                    //添加舞台上
                    this.roleBox.addChild(bullet);
                }
            
            }
            //BOSS子弹
            if(role.heroType == 5){
                var time = Laya.Browser.now();
                if(role.type == "boss1"){
                    if(time > role.shootTime){
                        role.shootTime = time +650;
                        BOSS(1,role);
                    }
                    //BOSS移动
                    if(this.direct == "right")
                    {
                        role.x += 1;
                        if(role.x >= 350)
                        {
                            this.direct = "left";
                        }
                    }
                    else if(this.direct == "left")
                    {
                        role.x -=1;
                        if(role.x <= 50){
                            this.direct = "right";
                        }
                    }
                }
                else if(role.type == "boss2"){
                    if(role.hp >= 1000){
                        if(time > role.shootTime){
                            role.shootTime = time +600;
                            role.playAction("act");
                            role.interval = 100;
                            BOSS(2,role);
                        }
                    }
                    //BOSS半血
                    else if(role.hp < 1000){
                        role.playAction("next");
                        if(time > role.shootTime){
                            role.shootTime = time + 500;
                            BOSS(2,role);
                        }
                        if(this.direct == "right"){
                            role.x += 1;
                            if(role.x >= 350){
                                this.direct = "left";
                            }
                        }
                        else if(this.direct == "left"){
                            role.x -=1;
                            if(role.x <= 50){
                                this.direct = "right";
                            }
                        }
                    }
                }
            }
            //技能释放逻辑
            if(role.type == "skill1"){
                if(role.y <300){
                    var enmNum = 0;
                    role.destroy();
                    var skill = new Skill();
                    this.roleBox.addChild(skill);
                    skill.init(1,4,0);
                    //消灭全部敌人
                    for(var i = this.roleBox.numChildren-1;i>-1;i--){
                         var myEmy = this.roleBox.getChildAt(i);
                         if(myEmy.camp != 0){
                                lostHp(myEmy,100);
                                enmNum++;
                         }
                    }
                    //每消灭一个敌人，积分+1
                    this.score += enmNum;
                    this.allScore += enmNum;
                    showScore();
                }
                //技能10S冷却
                Laya.timer.once(20000, this, onComplete);
            }
        }
        
        //检测碰撞
        for(var i = this.roleBox.numChildren-1;i>-1;i--){
            //获取角色对象1
            var role1 = this.roleBox.getChildAt(i);
            //如果角色死亡则忽略
            if(role1.hp<1)continue;
            for(var j = i-1;j>-1;j--){
                //如果角色死亡则忽略
                if(!role1.visible)continue;
                //获取角色对象2 
                var role2 = this.roleBox.getChildAt(j);
                //如果角色未死亡，并且阵营不同，才行进碰撞
                if(role2.hp>0 && role1.camp != role2.camp && role1.heroType != 4 && role2.heroType != 4 && !(role1.heroType == 1 && role2.heroType == 1)){
                    //计算碰撞区域
                    var hitRadius = role1.hitRadius > role2.hitRadius? role1.hitRadius : role2.hitRadius;
                    //根据距离判断是否碰撞
                    if(Math.abs(role1.x-role2.x) < hitRadius && Math.abs(role1.y-role2.y) < hitRadius){
                        //判断是否吃到补给品
                        if(role1.isPackbag == true || role2.isPackbag == true){
                            if(role1.isBullet == false && role2.isBullet == false){
                                getSupply(role1);
                                getSupply(role2);
                            }
                       
                        }
                        else{
                            //碰撞后掉血
                            lostHp(role1,1);
                            lostHp(role2,1);
                                       
                            //每掉一滴血，积分+1
                            this.score++;
                            this.allScore++;
                            showScore();
                        }
                    }
                }
            }
        }
        //关卡越高，创建敌机间隔越短
        var cutTime = this.level < 30 ? this.level * 2 : 60;
        //关卡越高，敌机飞行速度越高
        var speedUp = Math.floor(this.level  / 6);
        //关卡越高，敌机血量越高
        var hpUp = Math.floor(this.level / 8);
        //关卡越高，敌机数量越多
        var numUp = Math.floor(this.level / 10);
        if(!this.bossFlg){
            //生成小飞机
            if(Laya.timer.currFrame % (80 - cutTime) === 0){
                createEnemy(0,2+numUp,3+speedUp,1);
            }
            //生成中型飞机
            if(Laya.timer.currFrame % (150 - cutTime * 4) === 0){
                createEnemy(1,1+numUp,2+speedUp,2+hpUp *2)
            }
            //生成小boss
            if(Laya.timer.currFrame % (900 -cutTime *4) === 0){
                createEnemy(2,1,1+speedUp,10+hpUp*6);
                //boss添加声音
                Laya.SoundManager.playSound("res/sound/enemy3_out.mp3");
            }
        }
        //生成关卡BOSS
        // if(this.level == 5 && this.bossFlg == true && this.bossLoop == true){
        if(this.level == 2 && this.bossFlg == true && this.bossLoop == true)
        {
            this.gameInfo.bossComing();
            this.bossLoop = false;
            if(this.checkpoint == 1){
                createBoss(0,1000,70,200,100);
            }
            else if(this.checkpoint ==2){
                createBoss(1,2000,80,200,100);
            }
        }
        //击败BOSS
        if(this.boss != null){
            //生成小飞机
            // if(Laya.timer.currFrame % 80  === 0){
            //     createEnemy(0,3,3+speedUp,1);
            // }
            // //生成中型飞机
            // if(Laya.timer.currFrame % 150  === 0){
            //     createEnemy(1,2,2+speedUp,2+hpUp *2)
            // }
            // //生成小boss
            // if(Laya.timer.currFrame % 800 === 0){
            //     createEnemy(2,1,1+speedUp,10+hpUp*6);
            // }
            if(this.boss.hp < 1){
                this.bossFlg = false;
                this.bossLoop = true;
                Laya.SoundManager.stopMusic();
                // this.boss.destroy();
                this.boss = null;
                this.checkpoint++;
                if(this.checkpoint > 2){
                    Laya.timer.clear(this,onLoop);
                    //显示提示信息
                    this.gameInfo.infoLabel.text = "恭喜通关！分数："+this.allScore+"\n点击这里重新开始。";
                    this.gameInfo.infoLabel.color = "#ffffff";
                    //注册点击事件，点击重新开始游戏
                    this.gameInfo.infoLabel.once(Laya.Event.CLICK,this,restart);
                }
                else{
                    this.gameInfo.nextTage(this.checkpoint);
                }
                this.level = 0;
                this.score = 0;
                this.levelUpScore = 0;
            }
        }
        //如果主角死亡，则停止游戏循环
        if(this.hero.hp<1){
            Laya.timer.clear(this,onLoop);
            //游戏结束声音
            Laya.SoundManager.playSound("res/sound/game_over.mp3");
            //显示提示信息
            this.gameInfo.infoLabel.text = "GameOver,分数："+this.allScore+"\n点击这里重新开始。";
            this.gameInfo.infoLabel.color = "#ffffff";
            //注册点击事件，点击重新开始游戏
            this.gameInfo.infoLabel.once(Laya.Event.CLICK,this,restart);
        }    
    }
    function lostHp(role,lostHp){
        //减血
        role.hp-=lostHp;
        if(role.hp>0){
            //如果未死亡，则播放爆炸动画
            if(role.type != "bullet3"){
                role.playAction("hit");
            }
        }
        else{
            if(role.isBullet){
                //如果是子弹，则直接隐藏
                if(role.type == "bullet3"){
                    role.playAction("down");
                }
                else{
                    role.visible = false;
                }
                
            }
            else if(!role.isPackbag){
                role.playAction("down");
                //击中boss掉落血瓶或者子弹升级道具
                if(role.type == "enemy3"){
                    //随机是子弹升级道具还是血瓶
                    var type = Math.random() < 0.7 ? 2 : 3;
                    var item = Laya.Pool.getItemByClass("role",Role);
                    //初始化信息
                    item.init("ufo" + (type - 1),role.camp,1000,1,15,type);
                    item.isPackbag = true;
                    //设置位置
                    item.pos(role.x,role.y);
                    //添加到舞台上
                    this.roleBox.addChild(item);
                }
            }
        }
        //设置主角血量值
        if(role == this.hero){
            this.gameInfo.hp(role.hp);
        }
    }
    //获取补给品
    function getSupply(role){
        if(role.heroType === 2){
            // //每吃一个子弹升级道具，子弹升级+1
            this.bulletLevel++;
            // //子弹每升2级，子弹数量增加1，最大数量限制在4个
            this.hero.shootType = Math.min(Math.floor(this.bulletLevel / 2) + 1,4);
            // //子弹级别越高，发射频率越快
            this.hero.shootInterval = 400 -20 * (this.bulletLevel > 12 ? 12 : this.bulletLevel);
            // //隐藏道具
            role.visible = false;
            // //获得道具声音
            Laya.SoundManager.playSound("res/sound/achievement.mp3");
        }
        else if(role.heroType === 3){
            //每吃一个血瓶，血量增加1
            this.hero.hp++;
            //设置主角血量
            this.gameInfo.hp(this.hero.hp);
            //设置最大血量不超过10
            if(this.hero.hp>10)this.hero.hp = 10;
            //隐藏道具
            role.visible = false;
            //获得道具声音
            Laya.SoundManager.playSound("res/sound/achievement.mp3");
        }
    }
    //释放技能
    function useSkill(){
        onMouseDown();
        if(!this.skillFlg){
            //从对象池里边创建一个炸弹
            var boom = Laya.Pool.getItemByClass("role",Role);
            //初始化炸弹信息
            boom.init("skill1",0,100,-10,1,4);
            //设置炸弹发射初始化位置
            boom.pos(200,700);
            boom.anchorX = 0.5;
            boom.anchorY = 0.5;
            //添加舞台上
            this.roleBox.addChild(boom);
            Laya.timer.loop(1000,this,skillLoop);
            this.gameInfo.item_effec.scrollRect.y = 0;
        }
        this.skillFlg = true;
        this.gameInfo.item_effec.gray = true;
        this.gameInfo.item_effec.visible = true;
    }
    function onComplete(){
        this.skillFlg = false;
        this.gameInfo.item_effec.gray = false;
        this.gameInfo.item_effec.y = 10;
        Laya.timer.clear(this,skillLoop);
    }
    //技能冷却计时
    function skillLoop(){
        if(this.gameInfo.item_effec.scrollRect.y < this.gameInfo.item_effec.height){
            this.gameInfo.item_effec.scrollRect.y -= 2.5;
            this.gameInfo.item_effec.y -=2.5;
        }
    }
    //分数显示
    function showScore(){
            this.gameInfo.score(this.allScore);
            //积分大于升级积分，则升级
            if(this.score > this.levelUpScore){
                //升级关卡
                this.level++;
                if(this.level>15) this.level = 15;
                //在UI上显示关卡等级
                this.gameInfo.level(this.level);
                //提高下一级的升级难度
                this.levelUpScore += this.level * 5;
                //进入BOSS关
                if(this.level == 2){
                    this.bossFlg = true;
                }
            }
    }
    function restart(){
        //重置游戏数据
        this.allScore = 0;
        this.score = 0;
        this.level = 0;
        this.checkpoint = 1;
        this.levelUpScore = 0;
        this.bulletLevel = 0;
        this.boss = null;
        this.bossFlg = false;
        this.skillFlg = false;
        this.gameInfo.item_skill.gray = false;
        this.gameInfo.item_effec.visible = false;
        this.gameInfo.item_effec.y = 10;
        Laya.timer.clear(this,skillLoop);
        this.gameInfo.item_effec.scrollRect = this.gameInfo.item_effec.scrollRect || new Laya.Rectangle(0,0,this.gameInfo.item_effec.width,this.gameInfo.item_effec.height);
        this.bossLoop = true;
        this.gameInfo.reset();

        //初始化角色
        this.hero.init("hero",0,50,0,30);
        //设置射击类型
        this.hero.shootType = 1;
        //设置主角位置
        this.hero.pos(200,500);
        //重置射击间隔
        this.hero.shootInterval = 500;
        //显示角色
        this.hero.visible = true;

        for(var i = this.roleBox.numChildren-1;i>-1;i--){
            var role = this.roleBox.getChildAt(i);
            if(role != this.hero){
                role.removeSelf();
                //回收之前重置
                role.visible = true;
                //回收到对象池
                if(role.heroType != 4){
                    role.skewX = 0;
                    role.skewY = 0;
                    Laya.Pool.recover("role",role);
                }
                else{
                    role.destroy();
                }
            }
        }
        //恢复游戏
        resume();
    }
    //暂停
    function pause(){
        //停止游戏主循环
        Laya.timer.clear(this,onLoop);
        //移除舞台的鼠标移动事件
        Laya.stage.off(Laya.Event.MOUSE_MOVE,this,onMouseMove);
    }
    //恢复
    function resume(){
        //在循环中创建敌人
        Laya.timer.frameLoop(1,this,onLoop);
        //监听舞台的鼠标移动事件
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,onMouseMove);
    }
    function onMouseMove(){
        //始终保持主角和鼠标位置一致
        Laya.Tween.to(this.hero,{x:Laya.stage.mouseX,y:Laya.stage.mouseY},50,null,null,0);
        // this.hero.pos(Laya.stage.mouseX,Laya.stage.mouseY);
    }
    function onMouseDown(){
        Laya.stage.off(Laya.Event.MOUSE_MOVE,this,onMouseMove);
    }
    function onMouseUp(){
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,onMouseMove);
    }
    function createEnemy(type,num,speed,hp){
        for(var i=0;i<num;i++){
            //随机出现敌人
            // var r = Math.random();
            // //根据随机数，随机敌人
            // var type = r<0.7?0:r<0.95?1:2;
            //创建敌人
            var enemy = Laya.Pool.getItemByClass("role",Role);
            //初始化角色
            enemy.init("enemy"+(type+1),1,hp,speed,this.radius[type]);
            //随机位置
            enemy.pos(Math.random()*400,-Math.random()*200 - 100);
            //添加到舞台上
            this.roleBox.addChild(enemy);
        }
    }
    function createBoss(type,hp,hitRadius,posX,posY){
        console.log("创建boss");
        this.boss = Laya.Pool.getItemByClass("role",Role);
        this.boss.init("boss"+(type+1),1,hp,0,hitRadius,5);
        this.boss.visible = true;
        this.boss.pos(posX,posY);
        this.boss.scale(2,2);
        this.roleBox.addChild(this.boss);

        //boss添加声音
        Laya.SoundManager.playMusic("res/sound/1908547769.mp3");
    }

    // function onAssetsLoaded(settings)
	// {
	// 	sp = new Laya.Particle2D(settings);
	// 	sp.emitter.start();
	// 	sp.play();
	// 	Laya.stage.addChild(sp);

	// 	sp.x = Laya.stage.width / 2;
	// 	sp.y = Laya.stage.height / 2;
    //     sp.zOrder = 10000;
	// }
// })();