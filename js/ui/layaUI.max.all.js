var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var GameInfoUI=(function(_super){
		function GameInfoUI(){
			
		    this.pauseBtn=null;
		    this.hpLabel=null;
		    this.levelLabel=null;
		    this.scoreLabel=null;
		    this.infoLabel=null;
		    this.item_skill=null;
		    this.item_effec=null;

			GameInfoUI.__super.call(this);
		}

		CLASS$(GameInfoUI,'ui.GameInfoUI',_super);
		var __proto__=GameInfoUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(GameInfoUI.uiView);
		}

		STATICATTR$(GameInfoUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":400,"height":852},"child":[{"type":"Button","props":{"y":17,"x":328,"var":"pauseBtn","stateNum":1,"skin":"war/btn_pause.png"}},{"type":"Label","props":{"y":25,"x":18,"width":88,"var":"hpLabel","text":"HP:10","height":28,"fontSize":24,"color":"#6ff903","align":"center"}},{"type":"Label","props":{"y":25,"x":121,"width":96,"var":"levelLabel","text":"Level:10","height":30,"fontSize":24,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":26,"x":227,"width":101,"var":"scoreLabel","text":"Score:50","height":30,"fontSize":24,"color":"#fdf308","align":"center"}},{"type":"Label","props":{"y":385,"x":22,"wordWrap":true,"width":360,"var":"infoLabel","text":"战斗结束","skewY":0,"skewX":0,"height":143,"fontSize":24,"color":"#ffffff","align":"center"}},{"type":"Box","props":{"y":817,"x":40,"width":80,"mouseThrough":false,"height":70,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":35,"x":40,"width":50,"var":"item_skill","skin":"war/Skill1.png","mouseThrough":true,"height":50,"gray":false,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":10,"x":15,"width":50,"visible":false,"var":"item_effec","skin":"war/Skill1.png","mouseThrough":false,"height":50}}]}]};}
		]);
		return GameInfoUI;
	})(View);