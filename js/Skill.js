//技能类
var Skill = (function(_super){
    function Skill(){
        Skill.super(this);
    }
    Skill.cached = false;
    Laya.class(Skill,"Skill",_super);
    var _proto = Skill.prototype;
    _proto.init = function(_type,_heroType,_camp){
        this.heroType = _heroType;
        this.camp = _camp;
        this.type = _type; //技能类型
        if(!Skill.cached){
        Skill.cached = true;
        //缓存技能1动画
        Laya.Animation.createFrames(["skill/skill1_0.png","skill/skill1_1.png","skill/skill1_2.png","skill/skill1_3.png","skill/skill1_2.png","skill/skill1_1.png","skill/skill1_4.png"],"skill1_boom");
        }
        this.playSkill();
    }

    _proto.playSkill = function(){
        this.body = new Laya.Animation();
        this.body.x = -50;
        this.body.width = 852;
        this.body.height = 400;
        this.body.scale(3,10);
        this.body.interval = 100;
        this.addChild(this.body);
        this.body.on(Laya.Event.COMPLETE,this,this.onPlayComplete);
        switch(this.type){
            case 1:
                this.body.play(0,false,"skill1_boom");
            break;
        }
    }
    _proto.onPlayComplete = function(){
        if(this.body){
            this.body.destroy();
        }
    }

    return Skill;

})(Laya.Sprite);

