game.import("extension",function(lib,game,ui,get,ai,_status){
	return {
		name:"叶原之夜",
		content:function (config,pack){
			//——————————体力下限——————————// 
			lib.skill._cyshfminhp2={        
            trigger:{
        player:["dieBefore"],
        },
        forced:true,
        direct:true,
        popup:false,
        forceDie:true,
        filter:function(event,player){
        return player.hp<=0&&player.hp>player.countMark("_cyshminhp")&&event.player.isIn()&&event.reason&&event.getParent().name=='dying';
        },
        content:function(){
        trigger.cancel();
        },
          }
        lib.skill._cyshfminhp1={        
            trigger:{
        player:["dieBefore"],
        },
        forced:true,
        direct:true,
        popup:false,
        forceDie:true,
        filter:function(event,player){
        return player.maxHp<=0&&player.maxHp>player.countMark("_cyshminhp")&&event.player.isIn()&&event.reason&&event.getParent().name=='loseMaxHp';
        },
        content:function(){
        trigger.cancel();
        },
          }
        lib.skill._cyshfminhp={        
            trigger:{
        player:["dyingBefore"],
        },
        forced:true,
        direct:true,
        popup:false,
        forceDie:true,
        filter:function(event,player){
        return player.hp<=0&&player.hp>player.countMark("_cyshminhp");
        },
        content:function(){
        trigger.cancel();
        },
          }
        lib.skill._cyshminhp2={
        trigger:{
        player:["loseMaxHpEnd"],
        },
        filter:function(event,player){
        return player.hasMark("_cyshminhp")&&player.maxHp<=player.countMark("_cyshminhp");
        },
        forced:true,
        direct:true,
        popup:false,
        content:function(){
        player.die(event);
        },
        }  
        lib.skill._cyshminhpdie={
        trigger:{
        player:["die","changeHp"],
        },
        forced:true,
        direct:true,
        popup:false,
        forceDie:true,
        filter:function(event,player){
        return !player.isAlive()&&player.hasMark("_cyshminhp");
        },
        content:function(){
        player.removeMark("_cyshminhp",player.countMark("_cyshminhp"));
					player.storage._cyshminhp1=false;
        },
        }        
        lib.skill._cyshminhp1={
        trigger:{
        player:["damage"],
        },
        filter:function(event,player){
        return player.hp>0&&player.hasMark("_cyshminhp")&&player.hp<=player.countMark("_cyshminhp");
        },
        forced:true,
        direct:true,
        popup:false,
        firstDo:true,
        priority:null,                
        content:function(){
        "step 0"
					event.forceDie=true;
					if(player.isDying()||player.hp>player.countMark("_cyshminhp")){
						event.finish();
						return;
					}
					_status.dying.unshift(player);
					game.broadcast(function(list){
						_status.dying=list;
					},_status.dying);																						
					game.log(player,'异常濒死');	
							event.trigger('dyingBefore');
							if(event.unreal){event.goto(3); return;}
								event.trigger('dyingBegin');
							if(event.unreal){event.goto(3); return;}
					event.trigger('dying');
					"step 1"
					delete event.filterStop;
					if(player.hp>player.countMark("_cyshminhp")||event.nodying){
						_status.dying.remove(player);
						game.broadcast(function(list){
							_status.dying=list;
						},_status.dying);
						event.finish();
					}
					else if(!event.skipTao){
						var next=game.createEvent('_save');
						var start=false;
						var starts=[_status.currentPhase,event.source,event.player,game.me,game.players[0]];
						for(var i=0;i<starts.length;i++){
							if(get.itemtype(starts[i])=='player'){
								start=starts[i];break;
							}
						}
						next.player=start;
						next._trigger=event;
						next.triggername='_save';
						next.forceDie=true;
						next.setContent(lib.skill._save.content);
					}
					"step 2"
					_status.dying.remove(player);
					game.broadcast(function(list){
						_status.dying=list;
					},_status.dying);
					if(player.hp<=player.countMark("_cyshminhp")&&!event.nodying&&!player.nodying){
					if(trigger.source!=undefined){
					var next=game.createEvent('die');
                    next.player=player; 
                    next.source=trigger.source;        
                    next.set(event.reason);      
                    next.setContent('die');            
                    return false;
					}
					player.die(event.reason);
					}
					"step 3"
					        },
        }
        lib.skill._cyshminhp={
        trigger:{
        player:["changeHp"],
        },
        mark:true,
        intro: {
        name:"诱死",
                content:function(storage,player){
			if(player.hasMark('_cyshminhp')) return '你当前的体力下限为'+player.countMark('_cyshminhp')+'点，当你的体力值达到你的体力下限及以下时(大于0)，你将会进行特殊濒死流程直到体力值大于体力下限。';
			 },     			           
              },
        marktext:"死",
        filter:function(event,player){
        return event.getParent().name!='damage'&&player.hp>0&&player.hasMark("_cyshminhp")&&player.hp<=player.countMark("_cyshminhp");
        },
        forced:true,
        direct:true,
        popup:false,
        content:function(){
        "step 0"
					event.forceDie=true;
					if(player.isDying()||player.hp>player.countMark("_cyshminhp")){
						event.finish();
						return;
					}
					_status.dying.unshift(player);
					game.broadcast(function(list){
						_status.dying=list;
					},_status.dying);											
					if(trigger.num<=0){			
					game.log(player,'异常濒死');
						event.trigger('dyingBefore');
							if(event.unreal){event.goto(3); return;}
								event.trigger('dyingBegin');
							if(event.unreal){event.goto(3); return;}						
					event.trigger('dying');					
					}						
					"step 1"
					delete event.filterStop;
					if(player.hp>player.countMark("_cyshminhp")||event.nodying){
						_status.dying.remove(player);
						game.broadcast(function(list){
							_status.dying=list;
						},_status.dying);
						event.finish();
					}
					else if(!event.skipTao){
						var next=game.createEvent('_save');
						var start=false;
						var starts=[_status.currentPhase,event.source,event.player,game.me,game.players[0]];
						for(var i=0;i<starts.length;i++){
							if(get.itemtype(starts[i])=='player'){
								start=starts[i];break;
							}
						}
						next.player=start;
						next._trigger=event;
						next.triggername='_save';
						next.forceDie=true;
						next.setContent(lib.skill._save.content);
					}
					"step 2"
					_status.dying.remove(player);
					game.broadcast(function(list){
						_status.dying=list;
					},_status.dying);
					if(player.hp<=player.countMark("_cyshminhp")&&!event.nodying&&!player.nodying) player.die(event.reason);					
        },
        }
          lib.element.player.cyshminhp=function(num){
          if(num==undefined){
          num=1;
          }
					var next=game.createEvent('cyshminhp',false);
					next.num=num;					
					next.player=this;
					next.setContent('cyshminhp');
					return next;
				}
				   lib.element.content.cyshminhp=function(){
        "step 0"
        event.trigger('cyshminhpBefore');
        if(event.unreal){event.goto(5); return;}
        "step 0"
        event.trigger('cyshminhpBegin');
        if(event.unreal){event.goto(5); return;}  
        "step 2"                        
        player.addMark("_cyshminhp",num);                                     
        if(player.countMark("_cyshminhp")>=player.maxHp){
        player.useSkill("_cyshminhp2");
        };
        if(player.countMark("_cyshminhp")>=0&&player.maxHp<=0){
        player.useSkill("_cyshminhp2");
        }        
        "step 3"      
        event.trigger("cyshminhpEnd");        
        "step 4"
        event.trigger("cyshminhpAfter");
        "step 5"
        }
	//——————————改【飞扬】弃牌AI——————————// 
	lib.skill.feiyang={
		trigger:{
        player:"phaseJudgeBegin",
    },
    charlotte:true,
    direct:true,
    filter:function(event,player){
        return _status.mode!='online'&&_status.mode!='binglin'&&player==game.zhu&&player.countCards('j')&&player.countCards('h')>1;
    },
    content:function () {
        'step 0'
        player.chooseToDiscard('h', 2, '是否发动【飞扬】，弃置两张手牌并弃置自己判定区的一张牌？').set('logSkill', 'feiyang').ai = function (card) {
            if (player.countCards('j') <= 1 && (player.hasSkillTag('rejudge') || player.hasSkillTag('nodamage') || player.hasSkillTag('nothunder')) && (player.hasJudge('shandian') || player.hasJudge('fulei'))) return false;
				if (player.countCards('j')<=1&&(player.hasJudge('yangjingxurui'))) return false;
            return 6 - get.value(card);
        };
        'step 1'
        if (result.bool) player.discardPlayerCard(player, 'j', true).ai = function (card) {
			if(card.name=='yangjingxurui') return false
            if (player.countCards('h') < 2 && (!player.hasJudge('shandian') || !player.hasJudge('fulei'))) return -get.value(card);
            return get.value(card);
        };
    },
    "_priority":0,
		},
//——————————伤害属性——————————// 
	lib.translate.wind='风';
    lib.nature.add('wind');
lib.linked.add('wind');
//即时牌定义
	if(get.is.instantCard==undefined){
		get.is.instantCard=function(obj){
			var types=['equip','delay'];
			return !types.contains(get.type(obj));
		}
	}
    //——————————角色界面——————————//   
    //自选势力
    var characterDialogOrigin = ui.create.characterDialog;
    ui.create.characterDialog = function(){
        Array.prototype.AddOrigin = Array.prototype.add;
        Array.prototype.add = function(a){
            if(a == 'shen' || a == 'key'){
                if(this[0] == 'wei' && this[1] == 'shu' && this[2] == 'wu'){               
                    if(!this.contains("yee"))this.push("yee"); 
                    if(!this.contains("zhu"))this.push("zhu");
                    if(!this.contains("ye_jiu"))this.push("ye_jiu");
                    if(!this.contains("yue"))this.push("yue");
                    if(!this.contains("hong"))this.push("hong");
                    if(!this.contains("yao"))this.push("yao");
                    if(!this.contains("yong"))this.push("yong");
                    if(!this.contains("zhan"))this.push("zhan");
                    if(!this.contains("feng"))this.push("feng");
                    if(!this.contains("di"))this.push("di");
                    if(!this.contains("ling"))this.push("ling");
                    if(!this.contains("zhang"))this.push("zhang");
                    if(!this.contains("gui"))this.push("gui");
                    if(!this.contains("wai"))this.push("wai");
                }
            }
            if(!this.contains(a))this.AddOrigin(a);                      
        };
        var ret = characterDialogOrigin.apply(this,arguments);
        Array.prototype.add = Array.prototype.AddOrigin;
        delete Array.prototype.AddOrigin;
        return ret;
    };
	//表头//必须放列表最后
            for (var i in lib.character) {
				 if (i.indexOf('slm_') == 0) {
                    if (lib.translate[i].indexOf('SP') != 0) lib.translate[i] = 'SP' + lib.translate[i];
                    if (!lib.translate[i + '_prefix']) lib.translate[i + '_prefix'] = 'SP';
                }
				 if (i.indexOf('yym_') == 0) {
                    if (lib.translate[i].indexOf('SP') != 0) lib.translate[i] = 'SP' + lib.translate[i];
                    if (!lib.translate[i + '_prefix']) lib.translate[i + '_prefix'] = 'SP';
                }
                if (i.indexOf('sp_') == 0) {
                    if (lib.translate[i].indexOf('SP') != 0) lib.translate[i] = 'SP' + lib.translate[i];
                    if (!lib.translate[i + '_prefix']) lib.translate[i + '_prefix'] = 'SP';
                }
				if (i.indexOf('god_') == 0) {
                    if (lib.translate[i].indexOf('神') != 0) lib.translate[i] = '神' + lib.translate[i];
                    if (!lib.translate[i + '_prefix']) lib.translate[i + '_prefix'] = '神';
                }
            };
},
precontent:function(){   
	 lib.init.js(lib.assetURL + 'extension/叶原之夜/skin.js', null, function () { }, function () { });
            window.hyyzImport = function (func) { func(lib, game, ui, get, ai, _status) };
	game.import('character', function () {
                var yyzy = {
                    name: 'yyzy',
                    connect: true,
					   character:{//角色
		 "huhai":["female","yee",3,["ye_ershi","ye_weizheng"],["zhu"]],
			"Arithmetic progression":["none","yee",4,["ye_dengcha"],[]],
			sp_kyouko:["female","xing",3,["ye_huisheng","ye_yexiang"],[]],
			tokiko:["female","wai",3,["ye_fandu","ye_taohuan"],[]],
			seija:["female","hui",3,["ye_nizhuan","ye_guizha"],[]],
            "Hoshimiya Mukuro":["female","yue",3,["ye_kongjian","kongjianzhen"],[]],
            afu:["male","yee",4,["ye_baizhao","ye_wuyazuofeiji"],[]],
            xiusi:["male","yee",4,["ye_bukeshizhishou"],[]],
            bentiaoeya:["female","yue",3,["DALF_jizai","DALF_niegao"],[]],
          luotianyi:["female","yee",4,["ye_luoshuitianyi","ye_shanliangdengchang"],[]],
            xianhong:["female","yee",4,["ye_juhe","ye_jiangqi"],[]],
            peikelili:["female","yee",5,["ye_kongfu","ye_tungyan","ye_kaiyan"],["zhu"]],
            lumuyuan:["female","yee",3,["ye_yinguo","ye_yuanhuan","ye_qiyue"],[]],
            napolun:["male","yee",4,["ye_paohuo","ye_hongming","ye_gaoge"],[]],
            shishigui:["female","yee","3/4",["ye_bianyi","ye_fuhuai","ye_fusheng"],[]],
  sijishaonv:["female","yee",4,["ye_siji","ye_dongquchunlai","ye_qiugaoqishuang"],[]],
            xiana:["female","yee",3,["SE_zhuoyan","SE_shenpan","SE_duanzui"],[]],
            aierna:["female","yee",5,["ye_qianbing","ye_juanxi"],[]],
            huayuanbaiheling:["female","yee",4,["ye_mowu","ye_nuyi"],[]],
            bingyachuansisinai:["female","yue",3,["ye_dongkai","ye_bingjiekuilei","ye_sifan","kongjianzhen"],[]],
    yedaoshenshixiang:["female","yue",4,["ye_aoshagong","ye_aosha","kongjianzhen"],[]],
            "god_remilia":["female","shen",3,["SE_zhouye","SE_hongwu","SE_shenqiang","SE_yewang"],[]],
			"god_yuka":["female","shen",4,["ye_xiuye","ye_kuanji"],[]],
			"god_reimu":["female","shen",4,["ye_yibian","ye_tuizhi","ye_tongjie"],[]],
			"god_tenshi":["female","shen",4,["ye_dimai","ye_tiandao"],[]],
			"tenshi":["female","zhan",4,["ye_feixiang","ye_dizhen","ye_tianren"],["zhu"]],
            "god_meirin":["female","shen",4,["SE_huaxiang7","SE_caiyu","SE_xuanlan"],[]],
            "god_yukari":["female","shen",3,["SE_jiexian","SE_xijian"],[]],
            "god_eirin":["female","shen",4,["ye_qiannian"],[]],
            yukari:["female","yao",4,["ye_shenying","ye_xijian"],[]],
            marisa:["female","ye_zhu",4,["ye_mofa","ye_qinmian","ye_wuyu"],["zhu"]],
            ye_akyuu:["female","wai",3,["ye_qiuwen","ye_zaocu","ye_dangjia"],["zhu"]],
            rumia:["female","hong",3,["ye_zhenye","ye_anyu"],[]],
            yachie:["female","gui",4,["ye_weiyi","ye_duozhi"],[]],
			mayumi:["female","gui",4,["ye_lingjun","ye_ciou"],[]],
			kutaka:["female","gui",4,["ye_yushou","ye_lingdu"],[]],
			keiki:["female","gui",4,["ye_shanxing","ye_lingshou","ye_qijue"],["zhu"]],
            mokou:["female","yong",4,["ye_fengxiang","ye_kaifeng"],[]],
            iku:["female","zhan",4,["ye_leiyu","ye_shizhai"],[]],
			sp_aya:["female","zhan",4,["ye_toupai","ye_qucai"],[]],
            toziko:["female","ling",4,["ye_leishi","ye_fenyuan"],[]],
            kyouko:["female","ling",3,["ye_songjing","ye_gongzhen"],[]],
            "god_sakuya":["female","shen",3,["ye_shicao","ye_shiting","ye_huanzai","ye_shanghun"],[]],
            yoshika:["female","ling",4,["ye_taotie","ye_duzhua"],[]],
			miko:["female","ling",4,["ye_shengge","ye_qingting","ye_chiling"],["zhu"]],
            "slm_sanae":["female","ye_zhu",4,["ye_siyu","ye_qishu"],[]],
            "yym_reimu":["female","ye_zhu",4,["ye_zhize","ye_chunxi"],[]],
            "slm_reimu":["female","ye_zhu",4,["ye_5yu"],[]],
            "sp_marisa":["female","ye_zhu",3,["ye_jiezou","ye_shoucang"],[]],
            "slm_marisa":["female","ye_zhu",3,["ye_qiangyu","ye_mokai"],[]],
            flandre:["female","hong",3,["ye_yuxue","ye_shengyan","ye_pohuai"],[]],
          "god_komachi":["female","shen",4,["ye_yindu","ye_huanming","ye_chuanwu"],[]],
            "god_reisen":["female","shen",4,["ye_ningshi","ye_gaoao"],[]],
            remilia:["female","hong",3,["ye_mingyun","ye_kexie","ye_xueyi"],["zhu"]],
        "god_flandre":["female","shen",3,["ye_huimie","ye_kuangyan","ye_jinguo"],[]],
            "god_byakuren":["female","shen",4,["ye_chaoren"],[]],
            "slm_youmu":["female","ye_zhu",2,["ye_shiyu","yee_juhe"],[]],
            "ye_zhuque":["female","yee",3,["queyu","ye_youyu"],[]],
            aaaa:["female","yee",4,["jumu","seer_qinyin","qiuyao","yingping","santou"],[]],
            yileina:["female","yee",4,["ye_tabitabi","ye_gufangzishang"],[]],
            wuming:["female","yee",3,["ye_shifang","ye_bixin"],[]],
            "sp_rumia":["female","hong","4/5",["ye_shixie","ye_ziye"],[]],
            cirno:["female","hong",3,["ye_dongjie","ye_bingpo"],[]],
            "sp_cirno":["female","wai",3,["ye_xunshi","ye_jidong"],[]],
            xiaomeiyan:["female","yee","3/6",["ye_lunhui","nuoyan"],[]],
			rin:["female","di",4,["ye_yuangling","ye_songzang"],[]],
            satori:["female","di",3,["ye_duxing","ye_xiangqi","ye_zhushi"],["zhu"]],
			koishi:["female","di",3,["ye_maihuo","ye_wunian"],[]],
			god_satori:["female","shen",3,["ye_kuixin","ye_xinhua"],[]],
            "M4A1":["female","yee",4,["ye_zhanshu","ye_yigou"],[]],
           kanako:["female","feng",5,["ye_shende","ye_qiankun","ye_gongfeng"],["zhu"]],
            "god_yuyuko":["female","shen",1,["ye_fanhun","ye_yousi"],[]],
   "god_suika":["female","shen",Infinity,["ye_huanmeng","ye_cuixiang","ye_xuying"],[]],
			sp_okina:["female","zhang",4,["ye_menfei","ye_houhu"],[]],
            aun:["female","zhang",3,["ye_xunfo","ye_zhengshe"],[]],
            "sp_sakuya":["female","hong",4,["ye_mizong","ye_yinreng"],[]],
            daiyousei:["female","hong",3,["ye_juxiang","ye_bangyue"],[]],
            koakuma:["female","hong",3,["ye_moqi","ye_shishu"],[]],
           shikieiki:["female","zhan",3,["ye_shenpan","ye_huiwu","ye_huayan"],["zhu"]],
            "ye_bawujiemei":["female","yue",4,["ye_jufengqishi","kongjianzhen"],[]],
            lilywhite:["female","yao","3/4",["ye_baochun","ye_chunyi"],[]],
            minoriko:["female","feng",4,["ye_fengrang","ye_shouhuo"],[]],
         yumemi:["female","ye_jiu",4,["ye_ciyuan","ye_shigui","ye_chongdong"],["zhu"]],
            letty:["female","yao",4,["ye_jiyi","ye_chunmiang"],[]],
			yuyuko:["female","yao",4,["ye_shidie","ye_yiling","ye_morang"],["zhu"]],
            "sp_momizi":["female","feng",4,["ye_buju"],[]],
            eirin:["female","yong",4,["ye_ruizhi","ye_miyao"],[]],
            kaguya:["female","yong",4,["ye_yongheng","ye_zhuqu"],["zhu"]],
        shinki:["female","ye_jiu",4,["ye_chuangshi","ye_yuanfa","ye_shenwei"],["zhu"]],
            Nightmare:["female","yue",3,["ye_shiying","ye_kedi"],[]],
            "xing_Witch":["female","yue",3,["ye_yanzaomonv","kongjianzhen"],[]],
          Witch:["female","yue",3,["ye_yanzaomonv2","ye_jingxiang","kongjianzhen"],[]],
            "god_utsuho":["female","shen",4,["ye_shikong","ye_ronhui","ye_jubian","ye_hengxing"],[]],
			"reimu":["female","ye_zhu",4,["ye_qixian","ye_fengmo","ye_boli"],["zhu"]],
			ALyCE:["female","yee",3,["ye_juji","ye_yinbi"],[]],
			yaodaoji:["female","yee",5,["xin_sm","xin_daoxi"],[]],
            bzh:["female","yee",3,["yan_die","lishan","xin_jr"],[]],
	        "xiazhemeiyou":["female","yee",3,["yinni","yee_qiji"],[]],
"ye_wuheqinli":["female","yue",4,["ye_yanmo","ye_zhuolanjiangui","kongjianzhen"],[]],
			"suwako":["female","feng",3,["ye_bushu","ye_qiankun","ye_chuanchen"],[]],
			"sanae":["female","feng",4,["ye_jiyii","ye_qiji"],[]],
			"star":["female","yee",3,["ye_shuku","ye_zhanxing"],[]],
			"hzqeg_diyemupingguo":["female","yee",3,["hzqeg_mingyun"],[]],
			"dswn_gaoyueyejian":["female","yee","4/4/2",["dswn_canhuang","dswn_heidie"],[]],
			"dswn_cihuashoushouhua":["female","yee",4,["dswn_hualuo"],[]],
			shizuha:["female","feng",4,["ye_jiliao","ye_zhongyan"],[]],
			"df_05":["female","shen",4,["df_s0501","df_s0502"],[]],
	   },
        translate:{//翻译
			//技能
			 "ye_chaoren1":"超人",
			visible_kuixin:"明",
			visible_zhaoxing:"明",
			"star":"星",

			"ye_huangdi_Range":"六龙骖驾",
			//名称

			"huhai":"胡亥",
			"tenshi":"比那名居天子",
			"Arithmetic progression":"等差数列",
			"god_yuka":"神风见幽香",
			"god_reimu":"神博丽灵梦",
			"sp_kyouko":"SP幽谷响子",
			"tokiko":"朱鹭子",
			"mayumi":"杖刀偶磨弓",
			"kutaka":"庭渡久侘歌",
			"keiki":"埴安神袿姬",
			"seija":"鬼人正邪",
			"df_05":"芙兰朵露",
			"shizuha":"秋静叶",
			"suwako":"洩矢诹访子",
			"sanae":"东风谷早苗",
			"dswn_cihuashoushouhua":"此花寿寿花",
			"dswn_gaoyueyejian":"皋月夜见",
			"hzqeg_diyemupingguo":"荻野目苹果",
			"ye_wuheqinli":"五河琴里",
			sp_okina:"SP摩多罗隐岐奈",
			xiazhemeiyou:"霞泽美游",
			bzh:"不知火",
			yaodaoji:"妖刀姬",
			"ye_qiugaoqishuang_backup":"秋行夏令",
			"ALyCE":"爱丽丝",
            "Hoshimiya Mukuro":"星宫六喰",
            afu:"阿福",
            xiusi:"休斯",
            bentiaoeya:"本条二亚",
	"DALF_niegao_backup":"嗫告",
            luotianyi:"洛天依",
            xianhong:"鲜红",
            peikelili:"佩可莉姆",
            lumuyuan:"陆沐缘",
            napolun:"拿破仑",
            shishigui:"食尸鬼",
            sijishaonv:"四季少女",
            xiana:"夏娜",
            aierna:"艾尔娜",
            huayuanbaiheling:"花园百合铃",
            bingyachuansisinai:"冰芽川四糸乃",
            yedaoshenshixiang:"夜刀神十香",
			"god_tenshi":"神比那名居天子",
            "god_remilia":"神蕾米莉亚",
            "god_meirin":"神红美玲",
            "god_yukari":"神八云紫",
            "god_eirin":"神八意永琳",
            yukari:"八云紫",
            marisa:"魔理沙",
            ye_akyuu:"稗田阿求",
            rumia:"露米娅",
            yachie:"吉吊八千慧",
            mokou:"藤原妹红",
            iku:"永江衣玖",
			sp_aya:"SP文花帖文",
            toziko:"苏我屠自古",
            kyouko:"幽谷响子",
            "god_sakuya":"神十六夜咲夜",
            yoshika:"宫古芳香",
			miko:"丰聪耳神子",
            "slm_sanae":"SP神灵庙早苗",
            "yym_reimu":"SP妖妖梦灵梦",
            "slm_reimu":"SP神灵庙灵梦",
            "sp_marisa":"SP大盗魔理沙",
            "slm_marisa":"SP神灵庙魔理沙",
            flandre:"芙兰朵露",
            "god_komachi":"神小野塚小町",
            "god_reisen":"神铃仙",
            remilia:"蕾米莉亚",
            "god_flandre":"神芙兰朵露",
            "god_byakuren":"神圣白莲",
            "slm_youmu":"SP神灵庙妖梦",
            "ye_zhuque":"朱雀",
            aaaa:"aaaa",
            yileina:"伊蕾娜",
            wuming:"无名",
            "sp_rumia":"SP幼灵梦露米娅",
            cirno:"琪露诺",
            "sp_cirno":"SP三月精琪露诺",
            xiaomeiyan:"晓美焰",
            satori:"古明地觉",
			rin:"火焰猫燐",
			koishi:"古明地恋",
			god_satori:"神古明地觉",
            "M4A1":"M4A1",
            kanako:"八坂神奈子",
            "god_yuyuko":"神西行寺幽幽子",
            "god_suika":"神伊吹萃香",
            aun:"高丽野阿吽",
            "sp_sakuya":"SP猎人咲夜",
            daiyousei:"大妖精",
            koakuma:"小恶魔",
            shikieiki:"四季映姬",
            "ye_bawujiemei":"八舞夕弦&八舞耶俱矢",
            "ye_bawujiemei_ab":"八舞姊妹",
            lilywhite:"莉莉霍瓦特",
            minoriko:"秋穰子",
            yumemi:"冈崎梦美",
            letty:"蕾蒂",
            "sp_momizi":"SP犬走椛",
            eirin:"八意永琳",
            kaguya:"蓬莱山辉夜",
            shinki:"神绮",
            Nightmare:"时崎狂三",
            "xing_Witch":"☆镜野七罪",
            Witch:"镜野七罪",
            "god_utsuho":"神灵乌路空",
			reimu:"博丽灵梦",
			yuyuko:"西行寺幽幽子",
        },
        characterTitle:{//标题
		seija:"<span class=\"bluetext\" style=\"color:#AACC66\">逆袭的天邪鬼</span>",
		sanae:"<span class=\"bluetext\" style=\"color:#CC9C3D\">被祭拜的风之人</span>",
		suwako:"<span class=\"bluetext\" style=\"color:#CC9C3D\">土著神的顶点</span>",
	shizuha:"<span class=\"bluetext\" style=\"color:#CC9C3D\">寂寞与终焉的象征</span>",
			shinki:"<span class=\"bluetext\" style=\"color:#A699CC\">魔界之神</span>",
	sp_momizi:"<span class=\"bluetext\" style=\"color:#CC9C3D\">钻研棋技的天狗</span>",
	minoriko:"<span class=\"bluetext\" style=\"color:#CC9C3D\">丰收与成熟的象征</span>",
			eirin:"<span class=\"bluetext\" style=\"color:#999999\">月之头脑</span>",
	kaguya:"<span class=\"bluetext\" style=\"color:#999999\">永远与须臾的罪人</span>",
			"yukari":'<div class="text center" style="color:#3D3DCC">'+'神隐的主犯',
"dswn_cihuashoushouhua":'<div class="text center" style="color:#228B22">'+'鞍马落刀',
			"yuyuko":'<div class="text center" style="color:#3D3DCC">'+'华胥的亡灵',
			"letty":'<div class="text center" style="color:#3D3DCC">'+'冬季的遗忘之物',
		"lilywhite":'<div class="text center" style="color:#3D3DCC">'+'带来春天的妖精',
	"dswn_gaoyueyejian":'<div class="text center" style="color:#5c7a29">'+'忠义之剑',
		"hzqeg_diyemupingguo":'<div class="text center" style="color:#8B4513">'+'苹果',
		"ye_wuheqinli":'<div class="text center" style="color:#FF0000">'+'炎魔',
	sp_okina:"<span class=\"bluetext\" style=\"color:#48D1CC\">威风堂堂的神秘</span>",
        "yedaoshenshixiang":"<font color=#EEB2FF>鏖杀公</font>",
					"ye_bawujiemei":"<font color=#8272FF>飓风骑士</font>",
					"Witch":"<font color=#60DE79>赝作魔女</font>",
					"xing_Witch":"<font color=#60DE79>赝作魔女</font>",
					"Hoshimiya":"<font color=#FFDE32>封解主</font>",
					"bingyachuansisinai":"<font color=#91D0F6>冰结傀儡</font>",
					"Nightmare":"<font color=#AA3300>刻刻帝</font>",
					"bentiaoeya":"<font color=#F0FFFF>嗫告篇帙</font>",
		"god_yuka":"<span class=\"bluetext\" style=\"color:#96943D\">风花笑月</span>",
	"god_reimu":"<span class=\"bluetext\" style=\"color:#96943D\">幻想乡秩序的守护者</span>",
	"god_tenshi":"<span class=\"bluetext\" style=\"color:#96943D\">有顶天变</span>",
  "god_remilia":"<span class=\"bluetext\" style=\"color:#96943D\">永远的红之幼月</span>",
      "god_meirin":"<span class=\"bluetext\" style=\"color:#96943D\">龙神的化身</span>",
        "god_yukari":"<span class=\"bluetext\" style=\"color:#96943D\">幻想之界</span>",
       "god_eirin":"<span class=\"bluetext\" style=\"color:#96943D\">月都大贤者</span>",
          marisa:"<span class=\"bluetext\" style=\"color:#853DCC\">普通的魔法使</span>",
		  sp_kyouko:"<span class=\"bluetext\" style=\"color:#3DCCCC\">门前的妖怪小姑娘</span>",
           ye_akyuu:"<span class=\"bluetext\" style=\"color:#CC7014\">幻想乡的记忆</span>",
		   tokiko:"<span class=\"bluetext\" style=\"color:#CC7014\">无名的读书妖怪</span>",
            rumia:"<span class=\"bluetext\" style=\"color:#CC1414\">宵暗的妖怪</span>",
		    mayumi:"<span class=\"bluetext\" style=\"color:#FF8080\">埴轮兵长</span>",
	kutaka:"<span class=\"bluetext\" style=\"color:#FF8080\">地狱口岸的守护神</span>",
	keiki:"<span class=\"bluetext\" style=\"color:#FF8080\">孤立无援造就的造形神</span>",
            yachie:"<span class=\"bluetext\" style=\"color:#FF8080\">鬼杰组组长</span>",
            mokou:"<span class=\"bluetext\" style=\"color:#999999\">蓬莱之人形</span>",
            tenshi:"<span class=\"bluetext\" style=\"color:#3DCC3D\">非想非非想天的少女</span>",
			iku:"<span class=\"bluetext\" style=\"color:#3DCC3D\">美丽的绯之衣</span>",
			sp_aya:"<span class=\"bluetext\" style=\"color:#3DCC3D\">捏造新闻的记者</span>",
         toziko:"<span class=\"bluetext\" style=\"color:#66CC99\">神明后裔的亡灵</span>",
            kyouko:"<span class=\"bluetext\" style=\"color:#66CC99\">念经的山灵</span>",
    "god_sakuya":"<span class=\"bluetext\" style=\"color:#96943D\">铭刻的月之钟</span>",
	miko:"<span class=\"bluetext\" style=\"color:#66CC99\">圣德道士</span>",
           yoshika:"<span class=\"bluetext\" style=\"color:#66CC99\">忠臣的尸体</span>",
       "slm_sanae":"<span class=\"bluetext\" style=\"color:#853DCC\">私欲的巫女</span>",
          "yym_reimu":"<span class=\"bluetext\" style=\"color:#853DCC\">春巫女</span>",
       "slm_reimu":"<span class=\"bluetext\" style=\"color:#853DCC\">五欲的巫女</span>",
            "sp_marisa":"<span class=\"bluetext\" style=\"color:#853DCC\">大盗</span>",
    "slm_marisa":"<span class=\"bluetext\" style=\"color:#853DCC\">强欲的魔法使</span>",
            yileina:"<span class=\"bluetext\" style=\"color:#DCDCDC\">灰の魔女</span>",
			"reimu":"<span class=\"bluetext\" style=\"color:#853DCC\">乐园的美妙巫女</span>",
            wuming:"卡巴内瑞",
            flandre:"<span class=\"bluetext\" style=\"color:#CC1414\">恶魔之妹</span>",
            "god_komachi":"<span class=\"bluetext\" style=\"color:#96943D\">江户时代气质的死神</span>",
            "god_reisen":"<span class=\"bluetext\" style=\"color:#96943D\">狂气的赤眼</span>",
            remilia:"<span class=\"bluetext\" style=\"color:#CC1414\">红之恶魔</span>",
            "god_flandre":"<span class=\"bluetext\" style=\"color:#96943D\">绯下月色</span>",
            "god_byakuren":"<span class=\"bluetext\" style=\"color:#96943D\">灭除八古的尼公</span>",
            "slm_youmu":"<span class=\"bluetext\" style=\"color:#853DCC\">死欲的半灵</span>",
            "sp_rumia":"<span class=\"bluetext\" style=\"color:#CC1414\">食人妖怪</span>",
            cirno:"<span class=\"bluetext\" style=\"color:#CC1414\">湖上的冰精</span>",
            "sp_cirno":"<span class=\"bluetext\" style=\"color:#CC7014\">活力无限的小姑娘</span>",
            satori:"<span class=\"bluetext\" style=\"color:#CC3D85\">连怨灵也恐惧的少女</span>",
			koishi:"<span class=\"bluetext\" style=\"color:#CC3D85\">紧闭着的恋之瞳</span>",
			rin:"<span class=\"bluetext\" style=\"color:#CC3D85\">地狱的车祸</span>",
            kanako:"<span class=\"bluetext\" style=\"color:#CC9C3D\">山坡与湖水的化身</span>",
            "god_satori":"<span class=\"bluetext\" style=\"color:#96943D\">大家的心病</span>",
			"god_yuyuko":"<span class=\"bluetext\" style=\"color:#96943D\">无衣无缝的亡灵</span>",
            "god_suika":"<span class=\"bluetext\" style=\"color:#96943D\">虚幻的萃聚之梦</span>",
            aun:"<span class=\"bluetext\" style=\"color:#48D1CC\">醉心神佛的守护神兽</span>",
            "sp_sakuya":"<span class=\"bluetext\" style=\"color:#CC1414\">吸血鬼猎人</span>",
            daiyousei:"<span class=\"bluetext\" style=\"color:#CC1414\">雾之湖畔的妖精</span>",
            koakuma:"<span class=\"bluetext\" style=\"color:#CC1414\">图书馆中的使魔</span>",
            shikieiki:"<span class=\"bluetext\" style=\"color:#3DCC3D\">乐园的最高裁判长</span>",
        },
                   characterReplace: {//同分异构
					   kyouko: ['kyouko','sp_kyouko'],
					   tenshi: ['tenshi','god_tenshi'],
					    remilia: ['remilia','god_remilia'],
                        jingyeqizui: ['jingyeqizui','xing_jingyeqizui'],
                        flandre: ['flandre','god_flandre'],
                        marisa: ['marisa','sp_marisa'],
                        reimu: ['reimu','yym_reimu','slm_reimu'],
                        cirno: ['cirno','sp_cirno'],
                        sanae: ['sanae','slm_sanae'],
	                    yukari: ['yukari','god_yukari'],
	                    satori: ['satori','god_satori'],
	                    yuyuko: ['yuyuko','god_yuyuko'],
	                    eirin: ['eirin','god_eirin'],
                    },
                    characterIntro: {//介绍
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
						bzh: "不知火传记<br>原本黑寂的海面上，突然出现了一束火光。火光分裂，滋生，最终成百上千，沿着海面直达天际。这便是大妖怪不知火的传说，它深深地烙印在每一个杏原人的脑海里。每过数十年，不知火便会降临在杏原的海面，带来福祉抑或灾难。不过，传说归传说，真正见过不知火的人，却是寥寥无几。而我，却被赋予了这个神秘又不祥的名字。自从记事起，我便生活在这杏原湾的离岛之上。离岛上并无人居住，只有一座离人阁，一座闻名杏原的烟花之所。我被当作头牌歌姬培养，离人阁之于我是存在的意义，却也是内心的牢笼。每到入夜时分，我一步一步走向伫立在海面之上的舞台。看着远处星星点点的火光，那是慕名而来的游船上的渔灯。待到夜色渐浓，那火光也蔓延开来。它们成百上千，接天连地，一如传说中的大妖怪不知火。歌姬不知火，也许真的是这样呢。时间原本只是麻木地流逝着，直到一个冒失的阴阳师闯进了我的生活，他仿佛黑暗的房间中照进的一束光线，刺眼却热烈。在我的演出上读懂了我歌声中的无奈，他带着我出海，为我讲述着外面的花花世界。而我，则和着他所作的和歌，跳着真正自由的舞步。夏夜的海黑暗寂静，可是为什么会有火焰?先是遥远的一小束，接着越来越多，蔓延至整个海面。并不是游船的灯火，而是闪动着的橘色火焰，它们随着我的动作起落，仿若相处已久的友人般。也许，在漫长的岁月中，我已经与那传说合而为一了呢。",
						yaodaoji: "妖刀姬传记<br>传记一<bt>当我遭遇危险的时候，就会变成那样，变成兵器，这把妖刀，很可怕。强的话，会伤害别人；弱的话，会被人伤害，力量就是这样的东西。强者和弱者，到底哪一边比较幸福呢？<br>传记二<br>人类和我完全不一样，他们很弱。但我却觉得有些熟悉。我平时很少说话，也不知道要怎么诉说。可是我想试着和他们交谈，也想试着靠近他们，还想试着去理解他们。也许那么做之后，我就能知道为什么我会觉得那么熟悉了。但我却不能靠近他们。很想，可是不能。<br>传记三<br>虽然不想遭遇「危险」，才会变成那个样子。不过对许多人来说，我才是危险。为了保护自己不受「伤害，而伤他人……就是我的宿命。所以，不要和我交谈，不要理解我，也不要靠近……如果你不想，被我伤害的话。善良？不，我想我并不是善良。要说的话……或许弱的人是我也说不定。只有弱者，才会害怕被伤害并为此不惜去伤害其他人。我好像说的太多了，下次再会。或许不再会对你来说，反而比较好。那么还是，后会无期吧。",
						 hzqeg_diyemupingguo: "悲伤和痛苦也一定是有意义的，没有任何一件事是无意义的。",
						huhai:"胡亥（前230年/前221年—前207年），即秦二世，嬴姓，赵氏，名胡亥，秦始皇第十八子，公子扶苏之弟。秦朝第二位皇帝。胡亥早年随中车府令赵高学习狱法。秦始皇三十七年（前210年），始皇帝病死。时年十二岁的胡亥在赵高和丞相李斯的扶植下，得立为太子继而承袭帝位。即位后胡亥实行残暴的统治，群臣人人自危。二世元年（前209年）七月，征发闾左戍边，结果刑者相半于道，死人堆积于市。胡亥又任赵高为中丞相，专擅朝政。二世三年（前207年）七月，刘邦带领的起义军攻下武关。赵高与其婿咸阳令阎乐合谋，诈诏发兵包围望夷宫，胡亥被迫自杀。",
						yumemi: "简单小连招：最后接连放出牌和摸牌，出完牌摸至5掉1血，摸完牌弃1牌回1血。   出牌放第x位，出完弃至x回1，摸牌放最后摸至6掉1",
						dswn_gaoyueyejian: "折神家亲卫队第三席。  在亲卫队当中也是经常守候在折神紫身边的一位。  不怎么表露出感情，也不会进行超出必要程度的对话。  与拥有光辉实绩的真希和寿寿花不同，至今为止并没有什么醒目的实绩，实力不明。  是有着重重谜团的刀使。  母校为糸见沙耶香就读中的镰府女学院，校长为高津雪那。",
						dswn_cihuashoushouhua: "折神家亲卫队第二席。  京都名门此花家的大小姐，言谈举止十分优雅。  拥有在剑术大赛中连续两次亚军的实力。  但对于在两次的决赛中都将自己击破的真希怀有竞争意识。  拥有敏锐的洞察力和高超的指挥能力。  经常负责直接的作战指挥，此外在紫担任政治职务时也会同行。  母校与亲卫队的燕结芽同为绫小路武艺学舍，校长为相乐结月。",
						xiazhemeiyou: "隶属 SRT 特殊学园，RABBIT小队的狙击手。 虽然她期待以自己狙击手的天赋进入 SRT 特殊学园，但学园突然关闭。目前和小队的其他成员住在公园里。存在感很低，虽然这对狙击任务很有帮助，她往往被敌人忘记，但朋友也经常忘记她。代号是「RABBIT4」。",
                    },
                  perfectPair: {},//合纵连横
                };
                if (lib.device || lib.node) {
                    for (var i in yyzy.character) {
                        yyzy.character[i][4].push('ext:叶原之夜/image/character/' + i + '.jpg');
                    }
                } else {
                    for (var i in yyzy.character) {
                        yyzy.character[i][4].push('db:extension-叶原之夜/image/character:' + i + '.jpg');
                    }
                }
                return yyzy;
            });
			lib.config.all.characters.push('yyzy');
            if (!lib.config.characters.contains('yyzy')) lib.config.characters.remove('yyzy');
            lib.translate['yyzy_character_config'] = '<img src="' + lib.assetURL + 'extension/叶原之夜/yyzy.png" width="76" height="22">';
},
help:{
	"叶原之夜":"<ul><li>风属性：当一名角色受到风属性伤害时，若该角色有准备牌，则其选择弃置一张装备牌。"
	},
config:{},
package:{
    character: { character: {}, translate: {}, },
    card:{
        card:{
            yangjingxurui:{
				fullimage:true,
                audio:true,
                fullskin:true,
                type:"delay",
                filterTarget:function(card,player,target){
        return (lib.filter.judge(card,player,target));
    },
                judge:function(card){
        if(get.suit(card)!='spade') return 1;
        return 0;
    },
                "judge2":function(result){
                    if(result.bool==true) return true;
                    return false;
                },
                effect:function(){
        if(result.bool){
            player.skip("phaseDiscard");
            player.addSkill("yangjingxurui_skill");
        }
    },
                ai:{
                    basic:{
                        order:1,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:function(player,target){
                            return 3;
                        },
                    },
                    tag:{
                        skip:"phaseDiscard",
                        draw:2,
                    },
                },
                selectTarget:1,
                enable:true,
                content:function(){
        if(lib.filter.judge(card,player,target)&&cards.length&&get.position(cards[0],true)=='o') target.addJudge(card,cards);
    },
                allowMultiple:false,
	image:"ext:叶原之夜/yangjingxurui.png",
            },
            guojiu:{
            audio:true,
				fullimage:true,
				fullskin:true,
				type:"basic",
				toself:true,
				enable:function(event,player){
					//return !player.hasSkill('guojiu_skill');
					return true;
				},
				lianheng:true,
				logv:false,
				savable:function(card,player,dying){
					return dying==player||player.hasSkillTag('jiuOther',null,dying,true);
				},
				usable:1,
				selectTarget:-1,
				modTarget:true,
				filterTarget:function(card,player,target){
					return target==player;
				},
				content:function(){
					if(typeof event.baseDamage!='number') event.baseDamage=1;
					if(target.isDying()||event.getParent(2).type=='dying'){
						target.recover();
						if(_status.currentPhase==target){
							target.getStat().card.guojiu--;
						}
					}
					else{
						game.addVideo('jiuNode',target,true);
						if(cards&&cards.length){
							card=cards[0];
						}
						if(!target.storage.guojiu) target.storage.guojiu=0;
						target.storage.guojiu+=event.baseDamage;
						game.broadcastAll(function(target,card,gain2){
							target.addSkill('guojiu_skill');
							if(!target.node.jiu&&lib.config.jiu_effect){
								target.node.jiu=ui.create.div('.playerjiu',target.node.avatar);
								target.node.jiu2=ui.create.div('.playerjiu',target.node.avatar2);
							}
							if(gain2&&card.clone&&(card.clone.parentNode==target.parentNode||card.clone.parentNode==ui.arena)){
								card.clone.moveDelete(target);
							}
						},target,card,target==targets[0]&&cards.length==1);
						if(target==targets[0]&&cards.length==1){
							if(card.clone&&(card.clone.parentNode==target.parentNode||card.clone.parentNode==ui.arena)){
								game.addVideo('gain2',target,get.cardsInfo([card]));
							}
						}
					}
				},
				ai:{
					basic:{
						useful:(card,i)=>{
							if(_status.event.player.hp>1){
								if(i===0) return 5;
								return 2;
							}
							if(i===0) return 8.3;
							return 4;
						},
						value:(card,player,i)=>{
							if(player.hp>1){
								if(i===0) return 6;
								return 2;
							}
							if(i===0) return 8.3;
							return 4;
						}
					},
					order:()=>{
						if(_status.event.dying) return 8;
						let sha=get.order({name:'sha'});
						let tao=get.order({name:'tao'});
						let shunshou=get.order({name:'shunshou'});
						let guohe=get.order({name:'guohe'});
						let jiedao=get.order({name:'jiedao'});
						let huogong=get.order({name:'huogong'});
						if(sha>0) return sha+0.1;
							if(player.getDamagedHp()>=2&&tao>0) return tao+0.1;
								if(shunshou>0) return shunshou+0.1;
									if(guohe>0) return guohe+0.1;
										if(jiedao>0) return jiedao+0.1;
											if(huogong>0) return huogong+0.1;
						return 0;
					},
					result:{
						target:(player,target,card)=>{
							if(target&&target.isDying()) return 2;
							if(!target || target._jiu_temp || !target.isPhaseUsing()) return 0;
							let usable=target.getCardUsable('sha');
							if(!usable || lib.config.mode==='stone'&&!player.isMin()&&player.getActCount()+1>=player.actcount || !target.mayHaveSha(player,'use',card)) return 0;
							let effs={order:0},temp;
							target.getCards('hs',i=>{
								if(get.name(i)!=='sha' || ui.selected.cards.includes(i)) return false;
								temp=get.order(i,target);
								if(temp<effs.order) return false;
								if(temp>effs.order) effs={order:temp};
								effs[i.cardid]={
									card:i,
									target:null,
									eff:0
								};
							});
							delete effs.order;
							for(let i in effs){
								if(!lib.filter.filterCard(effs[i].card,target)) continue;
								game.filterPlayer(current=>{
									if(get.attitude(target,current)>=0 || !target.canUse(effs[i].card,current,null,true) || current.hasSkillTag('filterDamage',null,{
										player:target,
										card:effs[i].card,
										jiu:true
									})) return false;
									temp=get.effect(current,effs[i].card,target,player);
									if(temp<=effs[i].eff) return false;
									effs[i].target=current;
									effs[i].eff=temp;
									return false;
								});
								if(!effs[i].target) continue;
								if(target.hasSkillTag('directHit_ai',true,{
									target:effs[i].target,
									card:i
								},true) || usable===1&&(target.needsToDiscard()>Math.max(0,3-target.hp) || !effs[i].target.mayHaveShan(player,'use',effs[i].target.getCards(i=>{
									return i.hasGaintag('sha_notshan');
								})))){
									delete target._jiu_temp;
									return 1;
								}
							}
							delete target._jiu_temp;
							return 0;
						}
					},
					tag:{
						save:1,
						recover:0.1,
					}
				}
			},
			},
        translate:{
            yangjingxurui:"养精蓄锐",
            "yangjingxurui_info":"出牌阶段，对一名角色使用。若判定结果不为♠，目标角色跳过弃牌阶段，并于此阶段结束时摸两张牌。",
			guojiu:"果酒",
			"guojiu_info":"①每回合限一次。出牌阶段，对你自己使用。本回合目标角色使用的下一张基本牌或普通锦囊牌结算次数+1。②当你处于濒死状态时，对你自己使用。目标角色回复1点体力。",
        },
        list:[
			["heart",11,"yangjingxurui"],
			["diamond",9,"yangjingxurui"],
		    ["spade",10,"guojiu"],
			["diamond",6,"guojiu"],
		],
    },
    skill:{
        skill:{
			ye_weizheng:{
     audio:2,
    trigger:{
        global:"phaseJieshuBegin",
    },
	zhuSkill:true,
	unique:true,
    direct:true,
    filter(event, player) {
        return player != event.player && event.player.getHistory('sourceDamage').length && event.player.isIn() && player.hasZhuSkill("ye_weizheng", event.player);
    },
    async content(event, trigger, player) {
        const {
            result: { bool, cards },
        } = await trigger.player
            .chooseCard(`是否响应${get.translation(player)}的主公技【危政】？`, "将一张红色手牌当【远交近攻】对其使用并弃置一张手牌", (card, player) => {
                if (get.color(card) != "red") return false;
                return player.canUse(get.autoViewAs({ name: "yuanjiao" }, [card]), get.event("target"));
            })
            .set("target", player)
            .set("ai", card => {
                if (get.effect(get.event("target"), get.autoViewAs({ name: "yuanjiao" }, [card]), player) <= 0) return 0;
                return 7 - get.value(card);
            });
        if (bool) {
            trigger.player.logSkill("ye_weizheng", player);
            trigger.player.useCard(get.autoViewAs({ name: "yuanjiao" }, cards), cards, player);
			trigger.player.chooseToDiscard(true);
        }
    },
    "_priority":0,
    ai:{
        threaten:1.1186889420813968,
    },
            },
			ye_ershi:{
forced:true,
    juexingji:true,
    trigger:{
        global:"phaseBegin",
    },
    skillAnimation:"legend",
    animationColor:"ice",
    content:function(){
        'step 0'
        player.awakenSkill('ye_ershi');
        player.disableEquip(1,3,4,5);
        event.syr_xhcard=function(name){
            var card=ui.create.card();
            card._destroy = true;
            card.expired = true;
            const info = lib.card[name];
            card.init(['', '', name, info && info.cardnature]);
            return card;
        };
        'step 1'
        player.$gain(event.syr_xhcard('yuxi'),false);
        game.delayx();
        'step 2'
        player.$gain(event.syr_xhcard('feilongduofeng'),false);
        game.delayx();
		'step 3'
        player.$gain(event.syr_xhcard('xuwangzhimian'),false);
        game.delayx();
		'step 4'
        player.$gain(event.syr_xhcard('liulongcanjia'),false);
        game.delayx();
        'step 5'
        player.addSkills(['feilongduofeng','feilongduofeng3','ye_ershi_Range','yuxi_skill','xuwangzhimian']);
    },
    derivation:["feilongduofeng","liulongcanjia","yuxi","xuwangzhimian"],
    subSkill:{
        Range:{
            equipSkill:true,
            mod:{
				 attackRange:function (player, num) {
            return num +1;
        },
                globalFrom:function(from,to,current){
                    return current-1;
                },
                globalTo:function(from,to,current){
                    return current+1;
                },
            },
            sub:true,
            sourceSkill:"ye_ershi",
            "_priority":-25,
        },
    },
    markimage:"extension/OLUI/image/player/marks/juexingji.png",
    "_priority":0,
            },
			santou:{
                trigger:{
                    player:"phaseEnd",
                },
                check:function(event,player){
                    if(player.countCards('h')>player.maxHp) return false;
                    return true;
                },
                content:function (){
                    'step 0'
                    if(player.countCards('h')>player.maxHp) player.chooseToDiscard('h',player.countCards('h')-player.maxHp,true);
                    else if(player.countCards('h')<player.maxHp) player.draw(player.maxHp-player.countCards('h'));
                    'step 1'
                    player.showHandcards(get.translation(player)+'发动了【三骰】');
                    'step 2'
                    var list=[];
                    var cards=player.getCards('h');
                    for(var i=0;i<cards.length;i++){
                        var num=0;
                        for(var j=0;j<list.length;j++){
                            if(get.number(cards[i])!=list[j]) num++;
                        }
                        if(num==list.length) list.push(get.number(cards[i]));
                    }
                    if(list.length<=3) player.gainMaxHp();
                    if(list.length<=2){
                        player.recover();
                        player.draw(2);
                    }
                    if(list.length<=1) event.goto(3);
                    else event.finish();
                    'step 3'
                    if(player.maxHp>3) player.loseMaxHp(player.maxHp-3);
                    else if(player.maxHp<3) player.gainMaxHp(3-player.maxHp);
                    player.chooseToDiscard('h',player.countCards('h'),true);
                    for(var name of lib.inpile){
                        if(get.type(name)=='basic'||get.type(name)=='trick'){
                            var card=get.cardPile(function(card){
                                return card.name==name;
                            });
                            if(card) player.gain(card,'gain2');
                        }
                    }
                },
                ai:{
                    threaten:3.4,
                },
            },
			ye_feixiang:{
                trigger:{
        global:"judge",
    },
    direct:true,
    filter:function(event){
        return game.hasPlayer(function(current){
            return current.countCards('he');
        });
    },
    content:function(){
        "step 0"
		player.chooseTarget('请选择〖绯想〗的目标','展示其一张牌，令其打出此牌替换'+get.translation(trigger.player.judging[0]),function(card,player,target){
            return target.countCards('he')>0;
        }).set('ai',function(target){
			if(target.hasSkill('tuntian')) return get.attitude(player,target)/10;
            return target.countCards('he');
        });
		"step 1"
		if(result.bool){
			player.logSkill('ye_feixiang',result.targets[0]);
			event.player=result.targets[0]
var list=[];
            list=list.concat(event.player.getCards('he'));
        var dialog=ui.create.dialog(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+get.translation(trigger.player.judging[0])+
            '，'+get.prompt('ye_feixiang'),list,'hidden');
        player.chooseButton(dialog,true,function(button){
            var card=button.link;
            var trigger=_status.event.parent._trigger;
            var player=_status.event.player;
            var result=trigger.judge(card)-trigger.judge(trigger.player.judging[0]);
            var attitude=get.attitude(player,trigger.player);
            return result*attitude;
        });
}
else event.finish();
        "step 2"
        if(result.bool){
			event.card=result.buttons[0].link;
            event.player.respond(event.card,'highlight','noOrdering');
        }
		else{
            event.finish();
        }
        "step 3"
        if(result.bool){
			event.player.$gain2(trigger.player.judging[0]);
            event.player.gain(trigger.player.judging[0]);
            var card=event.card;
            trigger.player.judging[0]=event.card;
            trigger.orderingCards.addArray(result.cards);
            game.log(trigger.player,'的判定牌改为',event.card);
        }
		"step 4"
        game.delay(2);
    },
    ai:{
		rejudge:true,
        tag:{
            rejudge:0.6,
        },
    },
    "_priority":0,
            },
			ye_dizhen:{
                shaRelated:true,
    trigger:{
        player:"useCardToPlayered",
    },
    check:function(event,player){
return get.attitude(player,event.target)<0;
},
    filter:function(event,player){
return event.card.name=='sha';
},
    logTarget:"target",
    preHidden:true,
    content:function(){
'step 0'
player.judge(function(card){
if(get.color(card)=='red') return 2;
return -1;
}).judge2=function(result){
return result.bool;
};
'step 1'
if(result.bool&&trigger.target.countCards('h')>0) event.goto(2);
else event.finish();
	'step 2'
        var cards=trigger.target.getCards('h');
        player.chooseButton(2,[
            '地震',
            cards,
            [['弃置此牌','置于牌堆顶'],'tdnodes'],
        ]).set('filterButton',function(button){
            var type=typeof button.link;
            if(ui.selected.buttons.length&&type==typeof ui.selected.buttons[0].link) return false;
            return true;
        });
        'step 3'
        if(result.bool){
            if(typeof result.links[0]!='string') result.links.reverse();
            var card=result.links[1],choice=result.links[0];
            if(choice=='弃置此牌') trigger.target.discard(card);
            else{
                player.showCards(card,get.translation(player)+'对'+get.translation(trigger.target)+'发动了【地震】');
                trigger.target.lose(card,ui.cardPile,'visible','insert');
            }
        }
},
    "_priority":0,
            },
			ye_tianren:{
                unique:true,
    zhuSkill:true,
				unique:true,
    trigger:{
        player:["chooseToRespondBefore","chooseToUseBefore"],
    },
    filter(event,player){
        if(event.responded) return false;
        if(player.storage.ye_tianrening) return false;
        if(!player.hasZhuSkill('ye_tianren')) return false;
        if(!event.filterCard({name:'shan',isCard:true},player,event)) return false;
        return player!=_status.currentPhase&&game.hasPlayer(current=>current!=player&&(current.group=='zhan'||current.countCards('ej')<=player.countCards('ej')));
    },
    check(event,player){
        if(get.damageEffect(player,event.player,player)>=0) return false;
        return true;
    },
    async content(event,trigger,player){
        while(true){
            let bool;
            if(!event.current) event.current=player.next;
            if(event.current==player) return;
            else if(event.current.group=='zhan'||event.current.countCards('ej')<=player.countCards('ej')){
                if((event.current==game.me&&!_status.auto)||(
                    get.attitude(event.current,player)>2)||
                    event.current.isOnline()){
                    player.storage.ye_tianrening=true;
                    const next=event.current.chooseToRespond('是否替'+get.translation(player)+'打出一张闪？',{name:'shan'});
                    next.set('ai',()=>{
                        const event=_status.event;
                        return (get.attitude(event.player,event.source)-2);
                    });
                    next.set('skillwarn','替'+get.translation(player)+'打出一张闪');
                    next.autochoose=lib.filter.autoRespondShan;
                    next.set('source',player);
                    bool=(await next).result.bool;
                }
            }
            player.storage.ye_tianrening=false;
            if(bool){
                trigger.result={bool:true,card:{name:'shan',isCard:true}};
                trigger.responded=true;
                trigger.animate=false;
                if(typeof event.current.ai.shown=='number'&&event.current.ai.shown<0.95){
                    event.current.ai.shown+=0.3;
                    if(event.current.ai.shown>0.95) event.current.ai.shown=0.95;
                }
                return;
            }
            else{
                event.current=event.current.next;
            }
        }
    },
    ai:{
        respondShan:true,
        skillTagFilter(player){
            if(player.storage.ye_tianrening) return false;
            if(!player.hasZhuSkill('ye_tianren')) return false;
            return game.hasPlayer(current=>current!=player&&(current.group=='zhan'||current.countCards('ej')<=player.countCards('ej')));
        },
    },
    "_priority":0,
	group:["ye_tianren_1"],
    subSkill:{
		1:{
			                unique:true,
    zhuSkill:true,
    trigger:{
        player:["chooseToRespondBefore","chooseToUseBefore"],
    },
    filter(event,player){
        if(event.responded) return false;
        if(player.storage.ye_tianrening) return false;
        if(!player.hasZhuSkill('ye_tianren')) return false;
        if(!event.filterCard({name:'sha',isCard:true},player,event)) return false;
        return player!=_status.currentPhase&&game.hasPlayer(current=>current!=player&&(current.group=='zhan'||current.countCards('ej')<=player.countCards('ej')));
    },
    check(event,player){
        if(get.damageEffect(player,event.player,player)>=0) return false;
        return true;
    },
    async content(event,trigger,player){
        while(true){
            let bool;
            if(!event.current) event.current=player.next;
            if(event.current==player) return;
            else if(event.current.group=='zhan'||event.current.countCards('ej')<=player.countCards('ej')){
                if((event.current==game.me&&!_status.auto)||(
                    get.attitude(event.current,player)>2)||
                    event.current.isOnline()){
                    player.storage.ye_tianrening=true;
                    const next=event.current.chooseToRespond('是否替'+get.translation(player)+'打出一张杀？',{name:'sha'});
                    next.set('ai',()=>{
                        const event=_status.event;
                        return (get.attitude(event.player,event.source)-2);
                    });
                    next.set('skillwarn','替'+get.translation(player)+'打出一张杀');
                    next.autochoose=lib.filter.autoRespondSha;
                    next.set('source',player);
                    bool=(await next).result.bool;
                }
            }
            player.storage.ye_tianrening=false;
            if(bool){
                trigger.result={bool:true,card:{name:'sha',isCard:true}};
                trigger.responded=true;
                trigger.animate=false;
                if(typeof event.current.ai.shown=='number'&&event.current.ai.shown<0.95){
                    event.current.ai.shown+=0.3;
                    if(event.current.ai.shown>0.95) event.current.ai.shown=0.95;
                }
                return;
            }
            else{
                event.current=event.current.next;
            }
        }
    },
    ai:{
        respondSha:true,
        skillTagFilter(player){
            if(player.storage.ye_tianrening) return false;
            if(!player.hasZhuSkill('ye_tianren')) return false;
            return game.hasPlayer(current=>current!=player&&(current.group=='zhan'||current.countCards('ej')<=player.countCards('ej')));
        },
    },
    "_priority":0,
			sub:true,
        },
      },
   
            },
			jumu:{
                trigger:{
                    target:"useCardToTargeted",
                },
                forced:true,
                priority:13,                
                filter:function (event,player){        
                    return event.player!=player;              
                },
                logTarget:"player",
                content:function (){               
            'step 0'
            player.draw(1);
            trigger.player.draw(1);
            'step 1'
        var next=player.chooseToCompare(trigger.player);
        if(!next.fixedResult) next.fixedResult={};
        next.fixedResult[player.playerid]=trigger.cards.filterInD()[0];
       'step 2'
        if(result.bool){
            trigger.getParent().excluded.add(player);
       }  
    },              
                "_priority":0,
            },
			"ye_toupai":{
	    trigger:{
        player:"phaseDrawBegin1",
    },
    direct:true,
    preHidden:true,
    filter:function(event,player){
        return event.num>0&&!event.numFixed&&game.hasPlayer(function(target){
            return target.countCards('h')>0&&player!=target;
        });
    },
	content:function (){
        "step 0"
		player.chooseTarget(get.prompt('ye_toupai'),'观看其他一至两名角色各手牌并可以弃置各一张基本牌',[1,2],function(card,player,target){
            return target.countCards('h')>0&&player!=target;
        }).set('ai',function(target){
			if(target.hasSkill('tuntian')) return get.attitude(player,target)/10;
            return (1-get.attitude(player,target)*target.countCards('h'));
        });
        "step 1"
		if(result.bool){
			event.targets=result.targets;
			player.logSkill('ye_toupai',result.targets);
		}
		else event.finish();
        "step 2"
        event.current=event.targets.shift();
        player.discardPlayerCard(event.current,'h','visible').set('filterButton',function(button){
							return get.type(button.link)=='basic';
						});
		"step 3"
        if(event.targets.length>0) event.goto(2);
			trigger.changeToZero();
    },
    ai:{
        threaten:1.6,
        expose:0.2,
    },
    },
	"ye_qucai":{
	trigger:{
        global:["loseAfter","useCard2"],
    },
    filter:function(event,player){
		if(player!=_status.currentPhase||event.player==player) return false;
			if(event.name=='useCard'){
return get.color(event.card)=='red';
}
if(event.type=='discard'){
for(var i=0;i<event.cards2.length;i++){
if(get.color(event.cards2[i],null,event.hs.contains(event.cards2[i])?event.player:false)=='red'){
return true;
}
}
}
return false;
},
    frequent:true,
    content:function(){
'step 0'
if(trigger.delay==false) game.delay();
'step 1'
player.draw();
},
    "_priority":0,
    },
			"ye_dengcha":{
                enable:"phaseUse",
                usable:1,
                position:"he",
                complexCard:true,
                filter:function(event,player){
        return player.countCards('he')>=3;
    },
                filterCard:function(card,player,target){
        
        var num=get.number(card);
        var ta=ui.selected.cards;
        if(ta.length){
            //debugger
            for(var i=0; i<ta.length; i++){
                if(num==get.number(ta[i])){
                    return false;
                }
                
            }
        }
        // if(ta.length==2){
        //     var numm1=get.number(ta[0])+get.number(ta[0])- get.number(ta[1]);
        //     var numm2=get.number(ta[1])+get.number(ta[1])- get.number(ta[0]);
        //     var numm3=get.number(ta[1])+get.number(ta[0]);
        //     var numm4=numm3 / 2;
        //     if(num!=numm1&&num!=numm2&&num!=numm4)return false;
        // }
        // if(ta.length>2){
        //     var num4=14;
        //     var num5=14;
        //     var num6=0;
        //     var num7=0;
        //     for(var i=0; i<ta.length; i++){
        //         if(get.number(ta[i])<num4){
        //             num4=get.number(ta[i]);
        //         }
        //     }
        //     for(var i=0; i<ta.length; i++){
        //         if(get.number(ta[i])<num5&&get.number(ta[i])!=num4){
        //             num5=get.number(ta[i]);
        //         }
        //     }
        //     for(var i=0; i<ta.length; i++){
        //         if(get.number(ta[i])>num6){
        //             num6=get.number(ta[i]);
        //         }
        //     }
        //     for(var i=0; i<ta.length; i++){
        //         if(get.number(ta[i])>num7&&get.number(ta[i])!=num6){
        //             num7=get.number(ta[i]);
        //         }
        //     }
        //     if((num4+num4-num5)!=num&&(num6+num6-num7)!=num)return false;
        // }
        // return true;
        
        if (ta.length == 2) {
            return (get.number(ta[0]) + get.number(ta[1])) == 2 * num ||
            (get.number(ta[0]) + num) == 2 * get.number(ta[1]) ||
            (num + get.number(ta[1])) == 2 * get.number(ta[0]);
            
            //    (get.number(ta[0]) + get.number(ta[1])) == 2 * get.number(ta[2]) ||
            // (get.number(ta[0]) + get.number(ta[2])) == 2 * get.number(ta[1]) ||
            //(get.number(ta[2]) + get.number(ta[1])) == 2 * get.number(ta[0])
        }
        return true;
    },
                selectCard:3,
                check:function(card){
        return 20-get.value(card);
    },
                filterTarget:function(card,player,target){
        var car=ui.selected.cards;
        var ji=false;
        var ou=false;
        for(var i=0; i<car.length; i++){
            var numm=get.number(car[i]);
            if(numm%2==1&&ji==false){
                ji=true;
            }
            if(numm%2==0&&ou==false){
                ou=true;
            }
        }
        if(ji==true&&ou==true){
            return true;
        }else if(ji==true&&ou==false){
            return true;
        }else if(ji==false&&ou==true){
            if(target.hp>=target.maxHp)return false;
            return true;
        }
    },
                selectTarget:function(target,card,player){
        var car=ui.selected.cards;
        var ji=false;
        var ou=false;
        for(var i=0; i<car.length; i++){
            var numm=get.number(car[i]);
            if(numm%2==1&&ji==false){
                ji=true;
            }
            if(numm%2==0&&ou==false){
                ou=true;
            }
        }
        if(ji==true&&ou==true){
            return -1;
        }else if(ji==true&&ou==false){
            return [1,8];
        }else if(ji==false&&ou==true){
            return [1,8];
        }
    },
                multitarget:true,
                multiline:true,
                content:function(){
        "step 0"
        var car=cards;
        var ji=false;
        var ou=false;
        for(var i=0; i<car.length; i++){
            var numm=get.number(car[i]);
            if(numm%2==1&&ji==false){
                ji=true;
            }
            if(numm%2==0&&ou==false){
                ou=true;
            }
        }
        event.ji=ji;
        event.ou=ou;
        if(ji==true&&ou==true){
            for(var i of targets){
                i.loseHp();
            }
        }else if(ji==true&&ou==false){
            for(var i of targets){
                i.damage(1,player);
            }
        }else if(ji==false&&ou==true){
            for(var i of targets){
                i.recover();
            }
        }
        "step 1"
        var count=0;
        var ji=event.ji;
        var ou=event.ou;
        if(ji==true&&ou==true){
            for(var i of targets){
                count=4;
            }
        }else if(ji==true&&ou==false){
            for(var i of targets){
                if(i.hp==1) count++;
            }
        }else if(ji==false&&ou==true){
            for(var i of targets){
                if(!i.isDamaged()) count++;
            }
        }
        if(count){
            if(ji==true&&ou==true){
            player.draw(count); 
            }else if(ji==true&&ou==false){
            player.draw(count+1); 
            }else if(ji==false&&ou==true){
            player.draw(count+1); 
            }
        }
    },
                ai:{
                    order:11,
                    result:{
                        target:function(player,target){
                var car=ui.selected.cards;
                var ji=false;
                var ou=false;
                for(var i=0; i<car.length; i++){
                    var numm=get.number(car[i]);
                    if(numm%2==1&&ji==false){
                        ji=true;
                    }
                    if(numm%2==0&&ou==false){
                        ou=true;
                    }
                }
                if(ji==true&&ou==true){
                    return -get.recoverEffect(target,player,player);
                }else if(ji==true&&ou==false){
                    return get.damageEffect(target,player);
                }else if(ji==false&&ou==true){
                    return get.recoverEffect(target,player,player);
                }
            },
                    },
                    threaten:1,
                },
               "_priority":0,
            },
			"ye_shengge":{
	      skillAnimation:true,
    animationColor:"fire",
    audio:2,
    unique:true,
    juexingji:true,
    trigger:{
        player:"phaseZhunbeiBegin",
    },
    forced:true,
    filter:function(event,player){
        if(player.storage.ye_shengge) return false;
        return player.countCards('h')==0||player.isMinHandcard(true);
    },
    content:function(){
        "step 0"
        player.awakenSkill('ye_shengge');
        player.draw(3);
        "step 1"
        player.loseMaxHp();
        player.addSkills('ye_qingting_0');
    },
    markimage:"extension/OLUI/image/player/marks/juexingji.png",
    "_priority":0,
    },
	"ye_qingting":{
	      enable:"phaseUse",
    usable:1,
    filter:function(event,player){
        return game.hasPlayer(current=>{
            return current!=player&&current.countCards('h')>0;
        });
    },
    filterTarget:function(card,player,target){
        return target!=player&&target.countCards('h')>0;
    },
    selectTarget:-1,
    multitarget:true,
    multiline:true,
    async content(event,trigger,player){
        let targets=event.targets,
            list=[];
        while(true){
            if(targets[0].countCards('h')==0){
                targets.shift();
                continue;
            }
             if(!player.hasSkill('ye_qingting_0')){
				 var cards = await targets[0].chooseCard(true)
                .set('prompt',`【倾听】:请选择一张牌交给${get.translation(player)}`)
                .set('ai',function(card){
                    return get.value(card)<6;
                })
                .forResult('cards');
            if(!cards){
                targets.shift();
                continue;
            }
            targets[0].give(cards,player);
			 } 
			 if(player.hasSkill('ye_qingting_0')){
				 player.gainPlayerCard(targets[0],'h',true);
			 } 
            list.add(targets[0]);
            targets.shift();
            if(targets.length==0) break;
        }
        if(list.length==0) return;
        while(true){
            if(player.countCards('he')==0) return;
            var cards = await player.chooseCard(true,'he')
                .set('prompt',`【倾听】:请选择一张牌交给${get.translation(list[0])}`)
                .set('ai',function(card){
                    return get.value(card)<6;
                })
                .forResult('cards');
            if(!cards){
                list.shift();
                continue;
            }
            player.give(cards,list[0]);
            list.shift();
            if(list.length==0) break;
        }
    },
    ai:{
        order:13,
        result:{
            player:1,
        },
    },
	subSkill:{
        "0":{
            charlotte:true,
            sub:true,
            "_priority":0,
        },
    },
    },
	"ye_chiling":{
		zhuSkill:true,
		unique:true,
	    trigger:{
                global:"gainAfter",
            },
            filter:function(event,player){
if(event.player!=player){
var evt=event.getl(player);
return evt&&evt.hs&&evt.hs.length>0;
}
return false;
},
check:function(event,player){
		var target=event.player;
	if(event.cards.some(card=>{
            return get.name(card,false)=='sha';
        })){
            return get.attitude(player,target)>0;
        }
        return get.attitude(player,target)<0;
    },
            content:function(){
				var cards=trigger.cards;
        event.cards=cards;
        trigger.player.showCards(cards);
        if(cards.some(card=>{
            return get.name(card,false)=='sha';
        })){
            trigger.player.chooseToUse({name:'sha'},'敕令：是否使用一张杀？',false).logSkill='ye_chiling';
        }
},
    },
			"ye_xiuye":{
	      trigger:{
        player:"loseEnd",
        global:["equipEnd","addJudgeEnd","gainEnd","loseAsyncEnd","addToExpansionEnd"],
    },
    filter:function(event,player){
        return (player.countCards('h')>=0)^player.hasSkill('ye_xiuye_in');
    },
    forced:true,
    locked:false,
    firstDo:true,
    silent:true,
    content:function(){
            var cards=[];
            game.checkGlobalHistory('cardMove',evt=>{
                if(evt.name=='lose'&&evt.position==ui.discardPile||evt.name=='cardsDiscard'){
					cards.addArray(evt.cards.filter(i=>get.position(i,true)=='d'&&!idList.includes(i.cardid)&&(get.type(i)=='basic'||get.type(i)=='trick')&&get.suit(i)=='club'));
                }
            });
            var cardsx=cards.map(card=>{
                var cardx=ui.create.card();
                cardx.init(get.cardInfo(card));
                cardx._cardid=card.cardid;
                return cardx;
            });
            player.directgains(cardsx,null,'ye_xiuye');
            player.addSkill('ye_xiuye_in');
    },
	group:["ye_xiuye_destroy"],
    subSkill:{
		destroy:{
			trigger:{
        player:"useCardAfter",
    },
    forced:true,
    filter:function (event,player){
        if(!event.cards.length) return true;
        if(!player.hasHistory('lose',function(evt){
            return evt.getParent()==event;
        })) return true;
    },
            content:function(){
                player.addToExpansion(trigger.card,player,'give').gaintag.add('ye_xiuye_use');
				game.cardsGotoSpecial(trigger.card);
                game.log(trigger.card,'被销毁了');
            },
			sub:true,
        },
        in:{
            audio:"ye_xiuye",
            trigger:{
                global:["loseAfter","loseAsyncAfter","cardsDiscardAfter","equipAfter"],
            },
            forced:true,
            locked:false,
            silent:true,
            filter:function(event,player){
                var cards=event.getd();
                return cards.length;
            },
            onremove:function(player){
                var cards2=player.getCards('s',card=>{
                    return card.hasGaintag('ye_xiuye');
                });
                if(player.isOnline2()){
                    player.send(function(cards,player){
                        cards.forEach(i=>i.delete());
                        if(player==game.me) ui.updatehl();
                    },cards2,player);
                }
                cards2.forEach(i=>i.delete());
                if(player==game.me) ui.updatehl();
            },
            group:["ye_xiuye_use"],
            content:function(){
                var cards=[];
                var idList=player.getCards('s',card=>card.hasGaintag('ye_xiuye')).map(i=>i._cardid);
                game.checkGlobalHistory('cardMove',evt=>{
                    if(evt.name=='lose'&&evt.position==ui.discardPile||evt.name=='cardsDiscard'){
                        cards.addArray(evt.cards.filter(i=>get.position(i,true)=='d'&&!idList.includes(i.cardid)&&(get.type(i)=='basic'||get.type(i)=='trick')&&get.suit(i)=='club'));
                    }
                });
                var cards2=cards.map(card=>{
                    var cardx=ui.create.card();
                    cardx.init(get.cardInfo(card));
                    cardx._cardid=card.cardid;
                    return cardx;
                });
                player.directgains(cards2,null,'ye_xiuye');
            },
            mod:{
                "cardEnabled2":function(card,player){
					var cards=player.getExpansions('ye_xiuye_use');
            if(cards.length){
                var type=get.type(card);
                if(type=='none') return;
                for(var i of cards){
                    if(get.itemtype(card)=='card'&&card.hasGaintag('ye_xiuye')&&get.type(i,player)==type) return false;
                }
            }
                },
            },
            sub:true,
            popup:false,
            "_priority":1,
        },
        use:{
            trigger:{
                player:["useCardBefore","respondBefore"],
            },
            charlotte:true,
            forced:true,
            popup:false,
            firstDo:true,
            filter:function(event,player){
                var cards=player.getCards('s',card=>card.hasGaintag('ye_xiuye')&&card._cardid);
                return event.cards&&event.cards.some(card=>{
                    return cards.includes(card);
                });
            },
            content:function(){
                var idList=player.getCards('s',card=>card.hasGaintag('ye_xiuye')).map(i=>i._cardid);
                var cards=[];
                game.checkGlobalHistory('cardMove',evt=>{
                    if(evt.name=='lose'&&evt.position==ui.discardPile||evt.name=='cardsDiscard'){
                        cards.addArray(evt.cards.filter(i=>idList.includes(i.cardid)&&(get.type(i)=='basic'||get.type(i)=='trick')&&get.suit(i)=='club'));
                    }
                });
                var cards2=[];
                for(var card of trigger.cards){
                    var cardx=cards.find(cardx=>cardx.cardid==card._cardid);
                    if(cardx) cards2.push(cardx);
                }
                var cards3=trigger.cards.slice();
                trigger.cards=cards2;
                trigger.card.cards=cards2;
                if(player.isOnline2()){
                    player.send(function(cards,player){
                        cards.forEach(i=>i.delete());
                        if(player==game.me) ui.updatehl();
                    },cards3,player);
                }
                cards3.forEach(i=>i.delete());
                if(player==game.me) ui.updatehl();
            },
            sub:true,
            "_priority":0,
			marktext:"叶",
			intro:{
        content:"expansion",
        markcount:"expansion",
    },
    onremove:function(player,skill){
        var cards=player.getExpansions(skill);
        if(cards.length) player.loseToDiscardpile(cards);
    },
        },
    },
    popup:false,
    "_priority":1,
    },
	"ye_kuanji":{
	      trigger:{
        player:["useCardAfter","damageEnd"],
    },
    direct:true,
	filter:function(event,player){
        return player.hasHistory('lose',function(evt){
            return evt&&evt.hs.length&&evt.getParent()==event;
        })
    },
    filterx:[null,null,null,null],
    onremove:true,
    content:function(){
                "step 0"
                var choices=[];
                if(player.getExpansions('ye_xiuye_use').length>0) choices.push('将所有“叶”以任意顺序置于牌堆底');     
                choices.push('将牌堆顶的四张牌置入弃牌堆');
                choices.push('cancel2');
				player.chooseControl(choices).set(get.prompt2('ye_kuanji')).set('ai',function(){
                    if(player.getExpansions('ye_xiuye_use').length>0) return '将所有“叶”以任意顺序置于牌堆底';
                    return '将牌堆顶的四张牌置入弃牌堆';
                });
                "step 1"
                if(result.control!='cancel2'){
                    if(result.control=='将牌堆顶的四张牌置入弃牌堆'){
                    var cards=get.cards(4);
						player.$throw(cards, 1000);
            game.cardsDiscard(cards);
            game.log(cards, '被置入了弃牌堆');
						event.finish();
        }
        else{
        var cards=player.getExpansions('ye_xiuye_use');
        game.cardsGotoOrdering(cards);
        var next=player.chooseToMove('狂季：将所有“叶”置于牌堆底',true);
        next.set('list',[
			['牌堆底'],
            ['叶',cards],
        ]);
        next.set('filterMove',function(from,to,moved){
            if(to==1&&moved[1].length>=player.getExpansions('ye_xiuye_use').length) return false;
            return true;
        });
        next.set('filterOk',function(moved){
            return moved[1].length==player.getExpansions('ye_xiuye_use').length;
        });
        }
                }
                else event.finish();
					"step 2"
				var top=result.moved[0];
        var bottom=result.moved[1];
        top.reverse();
        for(var i=0;i<top.length;i++){
            ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
        }
        for(i=0;i<bottom.length;i++){
            ui.cardPile.appendChild(bottom[i]);
        }
        game.updateRoundNumber();
        game.delayx();
    },
    },
			"ye_yibian":{
	      trigger:{
        global:"phaseZhunbeiBegin",
    },
	direct:true,
	content:function(){
		'step 0'
        player.line(trigger.player,'fire');
        trigger.player.chooseBool('异变：是否亮出身份并解封技能？');
        'step 1'
        if(result.bool){
			game.log(trigger.player,'响应了','#g【异变】','亮出了身份');
            trigger.player.showIdentity();
        }
        else event.finish();
		},
    },
	"ye_tuizhi":{
	      
    },
	"ye_tongjie":{
	      
    },
			"ye_huisheng":{
	      trigger:{
                target:"useCardToTargeted",
            },
            usable:1,
            filter:function (event, player) {
                if (get.type(event.card) == 'delay' || get.type(event.card) == 'equip') return false
                return event.player!=player&&player.canUse(event.card,event.player,false);
            },
            direct:true,
            content:function () {
                'step 0'
                player.chooseTarget(function (card, player, target) {
                    return (player.canUse(trigger.card,target,false)&&target!=player)&&target==_status.event.TriPlayer;
                }).set('TriPlayer', trigger.player).set('prompt', get.prompt('ye_huisheng')).set('prompt2', '【回声】:你可以使用一张【' + get.translation(trigger.card.name) + '】').ai = function (target) {
                    return get.effect(trigger.player,trigger.card,player,false);
                };
                'step 1'
                if (result.bool) {
                    player.useCard({ name: trigger.card.name, isCard: true }, result.targets[0], false);
                    player.logSkill('ye_huisheng');
                }
            },
    },
	"ye_yexiang":{
	 trigger:{
        global:"loseAfter",
    },
	check:function(event,player){
		var target=event.player;
        return get.attitude(player,target)<0;
    },
    filter:function (event,player){
		if(player==event.player) return false;
        return event.js&&event.js.length>0&&event.player.hasCard(card=>lib.filter.canBeDiscarded(card,player,event.player),get.is.single()?'h':'h');;
    },
	prompt:function (event,player){
        return '〖夜响〗：是否弃置'+get.translation(event.player)+'的两张手牌？';
    },
    content:function (){
          player.discardPlayerCard(trigger.player,'h',2,true);   
    },
    },
	"ye_fandu":{
	 trigger:{
        player:["phaseZhunbeiBegin","damageEnd"],
    },
    direct:true,
    content:function (){
		 'step 0'
  if(trigger.name=='damage')  event.count=trigger.num;
        else event.count=1;
    'step 1'
    event.count--;
        player.chooseTarget(get.prompt2('ye_fandu'),function(card,player,target){
            return player!=target;
        }).set('ai',function(target){
            var player=_status.event.player;
            return 9999999999-get.attitude(_status.event.player,target);
        });
        "step 2"
        if(result.bool){
			event.target=result.targets[0]
			player.draw(2);
			player.logSkill('ye_fandu',result.targets);
            game.delay();
        }
		 else event.finish();
		'step 3'
            event.target.discardPlayerCard(player,'h',true);
		 "step 4"
        if(get.type(result.links[0])!='basic'&&player.canCompare(event.target)){
			player.chooseBool('是否发动【讨还】，与'+get.translation(event.target)+'拼点').set('choice',get.attitude(player,event.target)<0);
        }
		 else event.goto(6);
		'step 5'
		if(result.bool){
            var next=game.createEvent('ye_taohuan_insert',false);
next.player=player;
next.target=event.target;
next.setContent(lib.skill.ye_taohuan.contentx);
        }
		'step 6'
    if(event.count>0) event.goto(1);
    },
    ai:{
        expose:0.2,
        threaten:0.4,
    },
    },
	"ye_taohuan":{
	 trigger:{
		 global:['gainAfter'],
        player:"loseAsyncAfter",
    },
    filter:function(event,player){
     if(!player.canCompare(event.player)) return false;
if(event.name=='loseAsync'){
if(event.type!='gain'&&event.type!='discard') return false;
}
var cards=event.getl(player).cards2;
return game.hasPlayer(function(current){
if(current==player) return false;
var cardsx=event.getg(current);
for(var i of cardsx){
if(cards.includes(i)) return true;
}
return false;
});
},
    check:function(event,player){
        return get.attitude(player,event.player)<0&&player.countCards('h')>1;
    },
    content:function(){
'step 0'
var cards=trigger.getl(player).cards2;
event.cards=cards;
event.targets=game.filterPlayer(function(current){
if(current==player) return false;
var cardsx=trigger.getg(current);
for(var i of cardsx){
if(cards.includes(i)) return true;
}
return false;
}).sortBySeat();
'step 1'
var target=targets.shift();
var cardsx=trigger.getg(target);
var next=game.createEvent('ye_taohuan_insert');
next.player=player;
next.target=target;
next.cards=cardsx;
next.setContent(lib.skill.ye_taohuan.contentx);
if(targets.length>0) event.redo();
},
    contentx:function(){
'step 0'
player.chooseToCompare(target).clear=false;
'step 1'
if(result.bool){
if(target.countGainableCards(player,'he')) player.gainPlayerCard(target,true,'he');
ui.clear();
}
},
    },
			"ye_shanxing":{
	trigger:{
        global:["loseAfter","equipAfter","gainAfter","addJudgeAfter","loseAsyncAfter","addToExpansionAfter"],
    },
    filter:function ( event, player ) {
		if(!event.player.isIn()) return false;
        let evt = event.getl (event.player);
        return evt &&  evt.es && evt.es.length;
    },
	direct:true,
    content:function(){
		'step 0'
        player.chooseBool('是否发动【缮形】，令'+get.translation(trigger.player)+'摸一张牌？').set('choice',get.attitude(player,trigger.player)>0);
        'step 1'
        if(result.bool){
            player.logSkill("ye_shanxing",trigger.player);
			player.line(trigger.player,'green');
			trigger.player.draw();
			if(player=trigger.player) event.finish();
        }
		else event.finish();
        'step 2'
        trigger.player
                .chooseCard("是否发动" + get.translation(player) + "的【缮形】？", "你可以选择一张手牌，并交给该角色")
                .set("ai", card => {
                    if (_status.event.goon) return 6 - get.value(card);
                    return 0 - get.value(card);
                })
                .set("goon", get.attitude(trigger.player, player) > 2);
			"step 2"
                trigger.player.logSkill("ye_shanxing", player);
                trigger.player.give(result.cards, player);
        }
    },
	"ye_lingshou":{
	trigger:{
        player:"phaseJieshuBegin",
    },
	direct:true,
	content:function () {
	'step 0'
	player.chooseTarget(get.prompt2('ye_lingshou'),function(card,player,target){
if(player==target) return false;
return target.countCards('h');
}).set('ai',function(target){
            return target.countCards('he');
        });
        'step 1'
        if(result.bool){
			 event.target=result.targets[0]
            player.logSkill('ye_lingshou',event.target);
		player.chooseCardButton(event.target,event.target.getCards('h'),'【灵守】：是否选择展示其一张手牌，令其选择将此牌和其装备区里所有同花色的牌当【杀】使用或重铸之。',1).set('ai',function(card){
			if(get.attitude(player,event.target)<0) return get.value(card);
                return 6-get.value(card);
            });
        }
		else event.finish();
		'step 2'
if(result.bool){
	 event.cards=[];
	event.cards.addArray(result.links);
	event.cards.addArray(target.getCards("e", function (i) {
                return get.suit(i) == get.suit(result.links) ;
            }));
			player.showCards(event.cards);
        event.target.chooseUseTarget({name:'sha'},event.cards,'将'+get.translation(event.cards)+'当做【杀】使用或重铸',false).viewAs=true;
}
else{
event.finish();
}
'step 3'
if(!result.bool) event.target.recast(event.cards);
	 },
    },
	"ye_qijue":{
		trigger:{
        global:["dieAfter","die"],
    },
	zhuSkill:true,
	unique:true,
    filter(event,player,name){
		if (!player.hasZhuSkill('ye_qijue')) return false;
        if (name == 'dieAfter' && event.source && (event.source.group == 'gui'||event.source.maxHp>=player.hp)) return true;
        if (name == 'die' && (event.player.group == 'gui'||event.player.maxHp>=player.hp)) return true;
        return false;
    },
    direct:true,
    content:function(){
        'step 0'
		if(trigger.player.group == 'gui'||trigger.player.maxHp>=player.hp){
        trigger.player.chooseBool('是否发动【祈绝】，令'+get.translation(player)+'回复1点体力？').set('choice',get.attitude(trigger.player,player)>0);
		}
        'step 1'
        if(result.bool){
            trigger.player.logSkill('ye_qijue',player);
            trigger.player.line(player,'green');
            player.recover();
        }
		'step 2'
        if(trigger.source.group == 'gui'||trigger.source.maxHp>=player.hp){
        trigger.source.chooseBool('是否发动【祈绝】，令'+get.translation(player)+'回复1点体力？').set('choice',get.attitude(trigger.source,player)>0);
		}
		'step 3'
        if(result.bool){
            trigger.source.logSkill('ye_qijue',player);
            trigger.source.line(player,'green');
            player.recover();
        }
    },
    "audioname2":{
        yuanshu:"weidi",
    },
    },
	"ye_yushou":{
	    trigger:{
        global:"phaseZhunbeiBegin",
    },
    filter:function(event,player){
        return player!=event.player&&event.player.isIn()&&player.countCards('he')>0;
    },
	direct:true,
	content:function(){
     "step 0"
      player.chooseToDiscard('he',get.prompt2('ye_yushou')).set('logSkill','ye_yushou').set('ai',function(card){
             return get.number(card)-get.value(card);
            return 0;
        });
        "step 1"
        if(result.bool){
		trigger.player.addTempSkill('ye_yushou_1');
        trigger.player.markAuto('ye_yushou_1',[get.number(result.cards[0],player)]);
    } 
   },
subSkill:{
      1:{
            charlotte:true,
            onremove:true,
            marktext:"狱",
            intro:{
                markcount:(list)=>{
                    var list2=[1,11,12,13];
                    return list.reduce((str,num)=>{
                        if(list2.includes(num)) return str+['A','J','Q','K'][list2.indexOf(num)];
                        return str+parseFloat(num);
                    },'');
                },
                content:"使用点数小于等于$的基本牌或普通锦囊牌失效",
            },
            trigger:{
                player:"useCard",
            },
            filter:function(event,player){
                if(get.type(event.card)!='basic'&&get.type(event.card)!='trick') return false;
                var num=get.number(event.card,player);
                return typeof num=='number'&&player.getStorage('ye_yushou_1').some(numx=>num<=numx)&&player.isPhaseUsing();
            },
            direct:true,
            content:function(){
				trigger.cancel();
                game.log(trigger.card,'因','#g【狱守】','失效了');
				player.removeSkill('ye_yushou_1');
            },
            sub:true,
        }, 
		},
    },
	"ye_lingdu":{
    trigger:{
        player:"loseAfter",
    },
    frequent:true,
    filter:function (event,player){
		if(player==_status.currentPhase) return false;
        return ((!player.countCards('e')&&event.es&&event.es.length>0)||
            (!player.countCards('h')&&event.hs&&event.hs.length>0)||
            (!player.countCards('j')&&event.js&&event.js.length>0));
    },
    content:function (){
          player.draw();    
    },
    ai:{
        threaten:0.8,
        effect:{
            target:function (card){
                if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
            },
        },
    },
    },
	"ye_dimai":{
	marktext:"脉",
                intro:{
                    name:"地脉",
                    content:"mark",
                },
                trigger:{
                    global:"phaseJudgeBegin",
                },
                forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                filter:function(event,player){
        return event.player.isAlive()&&!event.player.countCards('j');
    },
                logTarget:"player",
                content:function(){
        "step 0"
        var list={basic:[],equip:[],trick:[],delay:[]};
        for(var i=0;i<lib.inpile.length;i++){
            var name=lib.inpile[i];
            var info=lib.card[name];
            if(info.autoViewAs) continue;
            if(!list[info.type]){
                list[info.type]=[];
            }
            list[info.type].push(lib.inpile[i]);
        }
        list.delay.sort(lib.sort.name);
        event.card=game.createCard(list.delay.randomGet());
        "step 1"
        trigger.player.popup(event.card.name,'thunder');
        "step 2"
        if(!event.cancelled) trigger.player.judge(event.card);
        "step 3"
        event.card.expired=true;
        var name=event.card.name;
        if(trigger.cancelled&&!trigger.direct){
            if(lib.card[name].cancel){
                var next=game.createEvent(name+'Cancelled');
                next.setContent(lib.card[name].cancel);
                next.card=event.card;
                next.player=trigger.player;
            }
        }
        else{
            var next=game.createEvent(name);
            next.setContent(lib.card[name].effect);
            next._result=result;
            next.card=event.card;
            next.player=trigger.player;
        }
        ui.clear();
        "step 4"
        if(event.card) event.card.delete();
    },
    },
	"ye_tiandao":{
	   trigger:{
        global:"judgeEnd",
    },
    filter:function(event,player){
        return get.position(event.result.card,true)=='o';
    },
	direct:true,
    content:function(){
		"step 0"
		if(trigger.result.card&&game.hasPlayer(function(current){
            return current==trigger.player&&player.canUse(trigger.result.card,current,false);
        })){
            event.goto(1);
        }
            else event.finish();
"step 1"
if(player==game.me){ 
player.line(trigger.player)        
       }
                 var str1='对'+get.translation(trigger.player)+'使用'+get.translation(trigger.result.card)+'';
    
    if(player==game.me) player.line(trigger.player)
var str3='取消';
    trigger.player.prompt('目标','fire');
    player.chooseControl(str1,str3,function(event,player){
   if(player==game.me) player.line(trigger.player)
        return _status.event.choice;
    }).set('choice',get.effect(trigger.player,trigger.result.card,player,false)>0?str1:str3);
    "step 2"   
if(event.directcontrol||result.control!='取消'){
              }
              else event.finish();
    "step 3"
    game.delay(0.8)
    "step 4"
    player.useCard(trigger.result.card,trigger.player,false);
     },
    },
	"ye_lingjun":{
		trigger:{
        player:"useCardToPlayered",
    },
	usable:1,
	direct:true,
    filter:function(event,player){
        if(event.card.name!='sha'||event.targets.length!=1) return false;
			return true;
    },
    content:function(){
        'step 0'
			player.chooseBool('是否发动【领军】，令其他角色各选择是否对'+get.translation(trigger.target)+'使用一张【杀】').set('choice',get.attitude(player,trigger.target)<0);
        'step 1'
        if(result.bool){
            player.line(trigger.target,'green');
            player.addTempSkill('ye_lingjun_effect');
			event.targets=game.filterPlayer(function(current){
            return current!=trigger.target;
        }).sortBySeat();
        if(!event.targets.length) event.finish();
			player.markAuto('ye_lingjun_effect',event.targets);
        }
        "step 2"
		event.current=event.targets.shift();
            event.current.addTempSkill('ye_lingjun_1');
		"step 3"
        if(event.targets.length>0) event.goto(2);
    },
    subSkill:{
        effect:{
            charlotte:true,
            trigger:{
                player:"useCardAfter",
            },
            onremove:true,
            forced:true,
            popup:false,
            filter:function(event,player){
                if(event.card.name!='sha'||event.targets.length!=1||!event.targets[0].isIn()) return false;
                if(event.getParent(2).name=='ye_lingjun_effect') return false;
                var list=player.getStorage('ye_lingjun_effect'),target=event.targets[0];
                if(!list.contains(event.player)) return false;
                for(var i of list){
                    if(i==event.player||!i.isIn()) continue;
                    if(!i.canUse('sha',target,false)) continue;
                    if(_status.connectMode&&i.countCards('hs')>0) return true;
                    if(i.hasSha()) return true;
                }
                return false;
            },
            content:function(){
                'step 0'
                event.targets=player.getStorage('ye_lingjun_effect').filter(function(i){
                    return i!==trigger.player;
                }).sortBySeat();
                event.target=trigger.targets[0];
                'step 1'
                var current=targets.shift();
                if(current.isIn()&&target.isIn()&&current.canUse('sha',target,false)&&(_status.connectMode||current.hasSha())){
                    current.chooseToUse(function(card,player,event){
                        if(get.name(card)!='sha') return false;
                        return lib.filter.filterCard.apply(this,arguments);
                    },'领军：是否对'+get.translation(target)+'使用一张杀？').set('targetRequired',true).set('complexSelect',true).set('filterTarget',function(card,player,target){
                        if(target!=_status.event.sourcex&&!ui.selected.targets.contains(_status.event.sourcex)) return false;
                        return lib.filter.targetEnabled.apply(this,arguments);
                    }).set('sourcex',target).set('logSkill','ye_lingjun_effect').set('addCount',false);
                    if(targets.length>0) event.redo();
                }
            },
            sub:true,
        },
    1:{
            enable:["chooseToUse"],
    filterCard:function(card,player){
        return get.type(card)=='basic';
    },
    position:"hes",
    viewAs:{
        name:"sha",
    },
    viewAsFilter:function(player){
            if(!player.countCards('hes',{type:'basic'})) return false;
    },
    prompt:"将一张基本牌当杀使用",
    check:function(card){
        var val=get.value(card);
        return 6-val;
    },
    ai:{
                yingbian:function(card,player,targets,viewer){
                    if(get.attitude(viewer,player)<=0) return 0;
                    var base=0,hit=false;
                    if(get.cardtag(card,'yingbian_hit')){
                        hit=true;
                        if(targets.some(target=>{
                            return target.mayHaveShan(viewer)&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.natureList(card))>0;
                        })) base+=5;
                    }
                    if(get.cardtag(card,'yingbian_add')){
                        if(game.hasPlayer(function(current){
                            return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                        })) base+=5;
                    }
                    if(get.cardtag(card,'yingbian_damage')){
                        if(targets.some(target=>{
                            return get.attitude(player,target)<0&&(hit||!target.mayHaveShan(viewer)||player.hasSkillTag('directHit_ai',true,{
                            target:target,
                            card:card,
                            },true))&&!target.hasSkillTag('filterDamage',null,{
                                player:player,
                                card:card,
                                jiu:true,
                            })
                        })) base+=5;
                    }
                    return base;
                },
                canLink:function(player,target,card){
                    if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
                    if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                        target:target,
                        card:card,
                    },true)) return false;
                    if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
                    return true;
                },
                basic:{
                    useful:[5,3,1],
                    value:[5,3,1],
                },
                order:function(item,player){
                    if(player.hasSkillTag('presha',true,null,true)) return 10;
                    if(game.hasNature(item,'linked')){
                        if(game.hasPlayer(function(current){
                            return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                        })&&game.countPlayer(function(current){
                            return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                        })>1) return 3.1;
                        return 3;
                    }
                    return 3.05;
                },
                result:{
                    target:function(player,target,card,isLink){
                        var eff=function(){
                            if(!isLink&&player.hasSkill('jiu')){
                                if(!target.hasSkillTag('filterDamage',null,{
                                    player:player,
                                    card:card,
                                    jiu:true,
                                })){
                                    if(get.attitude(player,target)>0){
                                        return -7;
                                    }
                                    else{
                                        return -4;
                                    }
                                }
                                return -0.5;
                            }
                            return -1.5;
                        }();
                        if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                            target:target,
                            card:card,
                        },true)) return eff/1.2;
                        return eff;
                    },
                },
                tag:{
                    respond:1,
                    respondShan:1,
                    damage:function(card){
                        if(game.hasNature(card,'poison')) return;
                        return 1;
                    },
                    natureDamage:function(card){
                        if(game.hasNature(card,'linked')) return 1;
                    },
                    fireDamage:function(card,nature){
                        if(game.hasNature(card,'fire')) return 1;
                    },
                    thunderDamage:function(card,nature){
                        if(game.hasNature(card,'thunder')) return 1;
                    },
                    poisonDamage:function(card,nature){
                        if(game.hasNature(card,'poison')) return 1;
                    },
                },
            },
            sub:true,
        },
		},
    },
	"ye_ciou":{
	trigger:{
        player:"damageEnd",
    },
    filter:function(event,player){
        if(event.hasNature()) return true;
			if(event.card.cards&&event.card.cards.length>0&&(!event.card.isCard||event.card.name!=event.card.cards[0].name)) return true;
       return false;
    },
            content:function() {
                	player.addTempSkill('ye_ciou_after');
    },
	subSkill:{
		after:{
            trigger:{
                global:"phaseJieshuBegin",
            },
            forced:true,
            popup:false,
            charlotte:true,
            onremove:true,
            filter:function(event,player){
                return player.isDamaged();
            },
            content:function(){
                'step 0'
        player.chooseBool('是否发动【瓷偶】，回复1点体力？').set('choice',get.attitude(player,player)>0);
        'step 1'
        if(result.bool){
            player.logSkill('ye_ciou');
            player.recover();
        }
            },
            sub:true,
        },
    },
    },
			"ye_nizhuan":{
          shaRelated:true,
    trigger:{
        player:"useCardToPlayered",
    },
    filter:function(event,player){
		if(player.hasSkill('ye_nizhuan_used')) return false;
		if(!event.isFirstTarget) return false;
        if(!event.targets||!event.targets.length) return false;
        return event.card.name=='sha'&&event.isFirstTarget;
    },
	check:function(event,player){
		var target=event.target;
		if(target.hp<=1&&(player.countCards('h',{name:'tao'})||player.countCards('h',{name:'jiu'}))) return false;
		if(!target.countCards('h')) return false;
        return get.attitude(player,target)<0&&!player.countCards('h',{name:'shan'});
    },
    content:function(){
        player.swapHandcards(trigger.target);
		player.addTempSkill('ye_nizhuan_after');
            player.markAuto('ye_nizhuan_after',[trigger.card]);
		player.addTempSkill('ye_nizhuan_used',['phaseZhunbeiAfter','phaseDrawAfter','phaseJudgeAfter','phaseUseAfter','phaseDiscardAfter','phaseJieshuAfter']);
    },
	group:["ye_nizhuan_ed"],
	subSkill:{
		ed:{
            trigger:{
        target:"useCardToTarget",
    },
    filter:function(event,player){
		if(player.hasSkill('ye_nizhuan_used')) return false;
		if(!event.isFirstTarget) return false;
        if(!event.targets||!event.targets.length) return false;
        return event.card.name=='sha'&&event.isFirstTarget;
},
check:function(event,player){
		var target=event.player;
	    if(!player.countCards('h',{name:'shan'})) return true;
		if(target.countCards('h')>=3) return true;
        return false;
    },
    content:function(){
        player.swapHandcards(trigger.player);
		player.addTempSkill('ye_nizhuan_after2');
            player.markAuto('ye_nizhuan_after2',[trigger.card]);
		player.addTempSkill('ye_nizhuan_used',['phaseZhunbeiAfter','phaseDrawAfter','phaseJudgeAfter','phaseUseAfter','phaseDiscardAfter','phaseJieshuAfter']);
    },
	ai:{
        effect:{
            target:function(card,player,target){
if(card.name=='sha'&&player.countCards('h',{name:'shan'})) return 0.1;
},
        },
    },
            sub:true,
        },
        after:{
            trigger:{
                global:"useCardAfter",
            },
            forced:true,
            popup:false,
            charlotte:true,
            onremove:true,
            filter:function(event,player){
                return player.storage.ye_nizhuan_after.contains(event.card);
            },
            content:function(){
                player.storage.ye_nizhuan_after.remove(trigger.card);
                if(!player.storage.ye_nizhuan_after.length) player.removeSkill('ye_nizhuan_after');
                    player.line(trigger.player,'green');
				if(trigger.targets[0].isIn()) player.swapHandcards(trigger.targets[0]);
            },
            sub:true,
        },
		after2:{
            trigger:{
                global:"useCardAfter",
            },
            forced:true,
            popup:false,
            charlotte:true,
            onremove:true,
            filter:function(event,player){
                return player.storage.ye_nizhuan_after2.contains(event.card);
            },
            content:function(){
                player.storage.ye_nizhuan_after2.remove(trigger.card);
                if(!player.storage.ye_nizhuan_after2.length) player.removeSkill('ye_nizhuan_after2');
                    player.line(trigger.player,'green');
					if(trigger.player.isIn()) player.swapHandcards(trigger.player);
            },
            sub:true,
        },
		used:{
            charlotte:true,
            sub:true,
        },
    },
    },
	"ye_guizha":{
         trigger:{
        player:"dying",
    },
	direct:true,
    content:function(){
'step 0'
player.chooseTarget(get.prompt2('ye_guizha'),function(card,player,target){
if(player==target) return false;
return target.countCards('h');
}).set('ai',function(target){
return -get.attitude(player,target);
});
'step 1'
if(result.bool){
	var target=result.targets[0]
player.logSkill('ye_guizha',target);
        player.chooseCardButton(target,target.getCards('h')).set('filterButton',function(button){
            return get.name(button.link)=='tao'||get.name(button.link)=='jiu';
        });
}
else event.finish();
'step 2'
if(result.bool){
            player.gain(result.links,target,'giveAuto');
        }
},
ai:{
        threaten:0.5,
    },
    },
			"qiuyao":{
	init:function(player){
        player.storage.qiuyao=1;
    },
    trigger:{
        player:["phaseZhunbeiBegin","phaseEnd"],
    },
    filter:function(event,player){
        return player.storage.qiuyao<=13;
    },
    content:function(){
        var card=get.cardPile(function(card){
            return get.number(card)==player.storage.qiuyao;
        });
        if(card) player.gain(card,'gain2');
        player.storage.qiuyao++;
    },
    ai:{
        threaten:1.2,
    },
    },
			"ye_yuangling":{
	trigger:{
        player:"damageAfter",
    },
	direct: true,
	filter:function(event,player){
return event.source;
},
	content:function(){
		"step 0"
	if(player==game.me){ 
		player.line(trigger.source)        
               }
                         var str1='视为对'+get.translation(trigger.source)+'使用一张火杀';
            
            if(player==game.me) player.line(trigger.source)
    var str3='取消';
            trigger.source.prompt('攻击目标','fire');
            player.chooseControl(str1,str3,function(event,player){
   if(player==game.me) player.line(trigger.source)
                return _status.event.choice;
            }).set('choice',get.effect(trigger.source,get.autoViewAs({name:'sha',nature:'fire'}),player,false)>0?str1:str3);
			"step 1"   
    if(event.directcontrol||result.control!='取消'){
                      }
                      else{
						  if(player.hp<=2) player.draw();
                      event.finish();
						  }
            "step 2"
            game.delay(0.8)
            "step 3"
            player.useCard({name:'sha',nature:'fire'},trigger.source,false);
               if(player.hp<=2) player.draw();
             },
			 ai:{
				 effect:{
            target:function(card,player,target){
                if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
                return 0.8;
                // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
            },
        },
        "maixie_defend":true,
        expose:0.3,
    },
    },
	"ye_songzang":{
	intro:{
        content:"已因$发动过技能",
    },
    trigger:{
        global:"dying",
    },
    filter:function(event,player){
return !player.storage.ye_songzang||!player.storage.ye_songzang.contains(event.player);
},
    forced:true,
    content:function(){
		"step 0"
if(!player.storage.ye_songzang) player.storage.ye_songzang=[];
player.storage.ye_songzang.add(trigger.player);
player.storage.ye_songzang.sortBySeat();
player.markSkill('ye_songzang');
        'step 1'
        var num=1;
        if(num>0){
            var cards=[];
            for(var i=0;i<ui.cardPile.childNodes.length;i++){
                var card=ui.cardPile.childNodes[i];
				if(card.suit=='club'){
                    cards.add(card);
                    num--;
                }
                if(card.suit=='spade'){
                    cards.add(card);
                    num--;
                }
                if(num==0) break;
            }
            if(num>0){
                for(var i=0;i<ui.discardPile.childNodes.length;i++){
                    var card=ui.discardPile.childNodes[i];
					if(card.suit=='club'){
                    cards.add(card);
                    num--;
                }
                    if(card.suit=='spade'){
                        cards.add(card);
                        num--;
                    }
                    if(num==0) break;
                }
            }
            if(cards.length) player.gain(cards,'gain2');
        }
},
	group:["ye_songzang_1"],
    subSkill:{
        "1":{
          enable:"chooseToUse",
    filter:function (event, player) {
        return event.type == 'dying' &&  _status.event.dying != player;
    },
    filterTarget:function (card, player, target) {
        return target == _status.event.dying&&player.countCards('he',function(card){
            if(_status.connectMode&&get.position(card)=='h') return true;
            return get.suit(card,player)=='spade';
        })>0;
    },
    selectTarget:-1,
	content:function(){
		'step 0'
		player.chooseToDiscard('he',{suit:'spade'},get.prompt2('ye_songzang')).set('ai',function(card){
            return get.attitude(player,target)<0;
        });
        'step 1'
		 if (result.bool) {
			 _status.dying.remove(target);
						game.broadcast(function(list){
							_status.dying=list;
						},_status.dying);
              target.die().source=player;
                  } 
                        },
						ai:{
        order:6,
        threaten:1.4,
        skillTagFilter:function (player) {
            if (!_status.event.dying) return false;
        },
        save:true,
        result:{
            target:-99999,
        },
    },
            sub:true,
        },
    },
    },
			  yingping: {
                            trigger: {
                                player: 'gainAfter'
                            },
                            filter: function (event, player) {
                                for (var i of event.cards) {
                                    if (player.getCards('h').contains(i) && game.hasPlayer(current => lib.filter.targetEnabled(i, player, current) && lib.filter.cardEnabled(i, player))) return true
                                };
                            },
                            direct:true,
                            content: function () {
                                'step 0'
                                var cards = [], hs = player.getCards('h');
                                cards = trigger.cards.filter(function (i) {
                                    if (!hs.contains(i)) return false;
                                    if (!game.hasPlayer(current => lib.filter.targetEnabled(i, player, current) && lib.filter.cardEnabled(i, player))) return false;
                                    if (_status.currentPhase == player) {
                                        return ['basic', 'trick'].contains(get.type(i));
                                    } else return true;
                                });
                                if (!cards.length) event.finish();
                                event.cards = cards;
                                'step 1'
                                var str = '应评：对任一合法目标' + (_status.currentPhase == player ? '视为' : '') + '使用其中一张牌';
                                player.chooseCardTarget({
                                    prompt: str,
                                    cards: event.cards,
                                    filterCard: function (card) {
                                        return _status.event.cards.contains(card) && lib.filter.cardEnabled(card, player);
                                    },
                                    filterTarget: function (card, player, target) {
                                        if (ui.selected.cards.length) {
                                            return lib.filter.targetEnabled2(ui.selected.cards[0], player, target);
                                        }
                                        return false;
                                    },
                                    ai1: function (card) {
                                        _status.event.player.getUseValue(card);
                                    },
                                    ai2: function (target) {
                                        if (ui.selected.cards.length) {
                                            var player = _status.event.player;
                                            return get.effect(target, ui.selected.cards[0], player, player) > 0;
                                        } else {
                                            return -get.attitude(_status.event.player, target);
                                        }
                                    }
                                });
                                'step 2'
                                if (result.bool) {
                                    var card = result.cards[0];
                                    var target = result.targets[0];
                                    if (_status.currentPhase == player) {
                                        card = {
                                            name: get.name(result.cards[0]),
                                            nature: get.nature(result.cards[0]),
                                        }
                                    }
                                    player.useCard(card, target).logSkill = 'yingping';
                                } else event.finish();
                            },
                            group: 'yingping_log',
                            subSkill: {
                                log: {
                                    trigger: {
                                        player: 'yingpingAfter'
                                    },
                                    silent: true,
                                    popup: false,
                                    locked: true,
                                    forced: true,
                                    charlotte: true,
                                    content: function () {
                                        player.getStat().skill.yingping++;
                                    }
                                }
                            }
                        },                   
			 "seer_qinyin":{
				 usabls:2,
                trigger:{
                    player:"loseAfter",
                    global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
                },
                frequent:true,
                filter:function(event,player){
        if(event.name=='gain'&&event.player==player){}
        else{
            var evt=event.getl(player);
            if(!evt||!evt.hs||evt.hs.length==0){
                return false;
            }
        }
        var list=[1,2,3,5,6];
        return list.indexOf(player.countCards("h"))>=0&&game.hasPlayer(function(current){
            return current.hp>0&&current!=player&&list.indexOf(current.countCards("h"))>=0&&(!current.storage["qinyin"+player.playerid]||current.storage["qinyin"+player.playerid]!=game.phaseNumber);
        });
    },
                init:function(player){
        player.storage["qinyin_count"]=0;
        player.storage["qinyin_round"]=0;
    },
                content:function(){
        "step 0"
        var targets=[];
        var list=[1,2,3,5,6];
        for(var i=0;i<game.players.length;i++){
            var current=game.players[i];
            if(current.hp>0&&current!=player&&list.indexOf(current.countCards("h"))>=0&&(!current.storage["qinyin"+player.playerid]||current.storage["qinyin"+player.playerid]!=game.phaseNumber)){
               targets.push(current);
            }
        }
        if(targets.length==0){
            event.finish();
            return;
        }
        player.chooseTarget('选择一名知音',[1,1],function(card,player,target){
            return target.hp>0&&targets.indexOf(target)>=0;
}).set('ai',function(target){
            if(get.attitude(player,target)>=0){
                return 5+get.attitude(player,target);
            }
                    return 0;
        });
        "step 1"
        if(result.bool){
            event.target=result.targets[0];
            player.line(event.target);
            event.target.storage["qinyin"+player.playerid]=game.phaseNumber;
        }
        else{
            event.finish();
            return;
        }
        "step 2" 
            var list=[1,2,3,5,6,8];
            var num1=0,num2=0;
            var h1=event.target.countCards("h"),h2=player.countCards("h");
            for(var i=0;i<list.length;i++){
                if(h1<list[i]){
                    num1=list[i];
                    break;
                }
            }
            for(var i=0;i<list.length;i++){
                if(h2<list[i]){
                    num2=list[i];
                    break;
                }
            }
            if(num1>0){
                event.target.drawTo(num1);
            }
            if(num2>0){
                player.drawTo(num2);
            }
            event.finish();
            return;
    },
            },
			 'df_s0501':{
                trigger:{
                    player:"phaseDrawBegin1",
                },
                filter:function(event,player){
                    return !event.numFixed;
                },
                content:function(){
                    "step 0"
                    trigger.changeToZero();
                    event.cards=get.cards(6);
                    game.cardsGotoOrdering(event.cards);
                    event.videoId=lib.status.videoId++;
                    game.broadcastAll(function(player,id,cards){
                        var str;
                        if(player==game.me&&!_status.auto){
                            str='禁忌：获取三张牌牌';
                        }
                        else{
                            str='禁忌';
                        }
                        var dialog=ui.create.dialog(str,cards);
                        dialog.videoId=id;
                    },player,event.videoId,event.cards);
                    event.time=get.utc();
                    game.addVideo('showCards',player,['禁忌',get.cardsInfo(event.cards)]);
                    game.addVideo('delay',null,2);
                    "step 1"
                    var list=[];
                    var next=player.chooseButton(3,true);
                    next.set('dialog',event.videoId);
                    next.set('ai',function(button){
                        return get.value(button.link,_status.event.player);
                    });
                    "step 2"
                    if(result.bool&&result.links){
                        event.cards2=result.links;
                    }
                    else{
                        event.finish();
                    }
                    var time=1000-(get.utc()-event.time);
                    if(time>0){
                        game.delay(0,time);
                    }
                    "step 3"
                    game.broadcastAll('closeDialog',event.videoId);
                    var cards2=event.cards2;
                    player.gain(cards2,'log','gain2');
                    "step 4"
                    var next=player.chooseToDiscard('h','禁忌：是否弃置一至两张手牌,本回合令其他角色不能使用或打出同名牌？',[1,2]);
					next.set('ai',function(card){
						var player=_status.event.player;
                        if(ui.selected.cards.length){
                            return -1;
                        };
                        if(player.countCards('h','sha')>0&&player.countCards('h','shan')>1){
                            if(card.name=='shan'){
                                return 1;
                            };
                            return -1;
                        };
						return -1;
					});
					next.logSkill='df_s0501';
                    "step 5"
                    if(result.bool){
                        var list=[]
                        for(var i=0;i<result.cards.length;i++){
                            list.push(result.cards[i].name)
                        }
                        var targets=game.filterPlayer();
                        targets.remove(player);
                        targets.sort(lib.sort.seat);
                        for(var i=0;i<targets.length;i++){
                            targets[i].addTempSkill('df_s0501_1');
                            targets[i].storage.df_s0501_1=list
                        };
                    }
                },
                subSkill:{
                    1:{
                        marktext:"禁",
                        mark:true,
                        intro:{
                            content:"你不能使用或打出：$",
                        },
                        onremove:function(player){
                            delete player.storage.df_s0501_1;
                        },
                        charlotte:true,
                        mod:{
                            cardEnabled:function(card,player){
                                if(player.storage.df_s0501_1&&player.storage.df_s0501_1.contains(card.name)) return false;
                            },
                            cardRespondable:function(card,player){
                                if(player.storage.df_s0501_1&&player.storage.df_s0501_1.contains(card.name)) return false;
                            },
                            cardSavable:function(card,player){
                                if(player.storage.df_s0501_1&&player.storage.df_s0501_1.contains(card.name)) return false;
                            },
                        },
                    },
                },
                ai:{
                    threaten:0.8,
                },
            },
            'df_s0502':{
                trigger:{
                    source:"damageBegin2",
                },
                logTarget:function(event,player){
					return event.player;
				},
                filter:function(event,player){
                    return event.player.countCards('hej')>0&&!player.hasHistory('useSkill',function(evt){
                        return evt.skill=='df_s0502'&&evt.targets.contains(event.player);
                    });
                },
                check:function(event,player){
                    var target=event.player;
                    if(get.attitude(player,target)<0) return true;
                    return get.attitude(player,target)>0&&target.countCards('j')>0;
                },
                content:function(){
                    'step 0'
                    var num=trigger.num;
                    player.choosePlayerCard(trigger.player,'hej',[1,num],'弃置'+get.translation(trigger.player)+get.cnNumber(num)+'张牌')
                    'step 1'
                    if(result.bool){
						event.damage=false;
                        var listh=0;
                        var liste=0;
                        var listj=0;
                        for(var i=0;i<result.cards.length;i++){
                            var position=get.position(result.cards[i]);
                            switch(position){
                                case 'h':
                                    listh++;
                                    break;
                                case 'e':
                                    liste++;
                                    break;
                                case 'j':
                                    listj++;
                                    break;
                            }
                        };
                        if(listh>0&&trigger.player.countCards('h')<=listh) event.damage=true;
                        if(liste>0&&trigger.player.countCards('e')<=liste) event.damage=true;
                        if(listj>0&&trigger.player.countCards('j')<=listj) event.damage=true;
                        trigger.player.discard(result.cards);
                    }else{
                        event.finish();
                    };
                    'step 2'
                    if(event.damage){
                        game.log(player,'发动【破灭】,对',trigger.player,'造成一点伤害');
                        trigger.player.damage('nocard');
                    };
                },
            },
			"ye_maihuo":{
	usable:1,
     enable:"phaseUse",
				filter:function(event,player){
        return player.countCards('he')>0;
    },
    filterTarget:lib.filter.notMe,
    position:"he",
    check:function(card){
var num=get.value(card);
if(get.color(card)=='black'){
if(num>=6) return 0;
return 9-num;
}
else return 7-num;
},
	filterCard:true,
	 discard:false,
    prepare:"throw",
    loseTo:"cardPile",
    visible:true,
    insert:true,
    content:function(){
		'step 0'         
        game.log(player,'将',cards,'置于牌堆顶'); 		
            event.cards=get.cards(2);
            target.showCards(event.cards);
        'step 1'
        target.gain(event.cards,'gain2');
		if(get.color(event.cards,player)=='red'){
player.chooseDrawRecover(2,false);
}
    },
	ai:{
        order:9,
        expose:0.2,
        result:{
            target:function(player,target){
              return 2;
},        
            player:function(player,target){
              if(ui.selected.cards.length&&get.color(ui.selected.cards[0])=='red'){
                  return 1;
}
},
        },
    },
    },
	"ye_wunian":{
	forced:true,
    trigger:{
        source:"damageBegin1",
    },
    filter:function (event, player) {
        return event.source != undefined;
    },
    content:function () {
        trigger.cancel();
        trigger.player.damage('nosource', trigger.num,trigger.nature);//.set('source',player);
    },
    group:["ye_wunian_1"],
    subSkill:{
        1:{
            trigger:{
        target:"useCardToTargeted",
    },
	forced:true,
    filter:function(event,player){
        if(player==event.player||event.player.isDead()) return false;
        let type=get.type(event.card);
        return type=='trick'&&player.getDamagedHp() > 0;
    },
	content:function () {
        trigger.targets.remove(player);
            trigger.getParent().triggeredTargets2.remove(player);
            trigger.untrigger();
    },
	ai:{
                    effect:{
                        target:function(card,player,target,current){  
							if(get.type(card)=='trick'&&target.getDamagedHp()>0&&player!=target){
                    return 'zeroplayertarget';
                }
            },
                    },
                },
            sub:true,
            "_priority":0,
        },
     },
    },
			"ye_jiliao":{
				usable:1,
     enable:"phaseUse",
				filterTarget:function(card,player,target){
        return true;
    },
    content:function(){
        'step 0'
       if(target.countCards('e')>0) target.gain(target.getCards('e'),'gain2');
        'step 1'
       if(target.countCards('h')>=target.hp) player.discardPlayerCard(target,'he');
    },
    ai:{
        order:999,
        result:{
            target:function(player,target){
                var att=get.attitude(player,target);
                var es=target.getCards('he');
				for(var i=0;i<es.length;i++){
                    var val=get.equipValue(es[i],target);
					if(target.countCards('he')>=target.hp) return -2-val;
                            return -val;
                }
                return 0;
            },
        },
    },
    },
	"ye_zhongyan":{
     trigger:{
        player:"damageBegin4",
    },
    filter:function(event,player){
        return event.source&&event.source.isIn()&&[event.source,event.player].contains(player)&&event.source!=event.player;
    },
    logTarget:function(event,player){
        return event.source;
    },
    check:function(event,player){
        _status.ye_zhongyan=true;
        var bool=false;
            if(get.damageEffect(player,event.source,player,event.nature)<0){
                if(event.source.getDamagedHp()>=event.source.hp) bool=true;
                if(event.num>=player.hp+player.countCards('hs',{name:['tao','jiu']})&&(!player.hasFriend()||player==get.zhu(player))) bool=true;
            }
        delete _status.ye_zhongyan;
        return bool;
    },
	limited:true,
    clanSkill:true,
    skillAnimation:true,
    animationColor:"soil",
    content:function(){
        player.awakenSkill('ye_zhongyan');
        trigger.cancel();
        trigger.source.loseHp(Math.max(trigger.source.getDamagedHp(),1));//.set('source',player);
    },
	ai:{
        "maixie_defend":true,
    },
    },
				 "ye_bushu":{
              trigger:{
        global:"damageEnd",
    },
	prompt:function (event,player){
        return '〖不输〗：是否与'+get.translation(event.source)+'拼点并可能令'+get.translation(event.player)+'恢复一点体力？';
    },
    filter:function(event,player){
        if(!event.source) return false;
        return player.countCards('h')>0&&event.player.classList.contains('dead')==false&&player.canCompare(event.source)&&event.source!=event.player&&(event.player==player||player.inRange(event.player));
    },
	check:function(event,player){
        return get.attitude(player,event.source)<0&&get.attitude(player,event.player)>2;
    },
    logTarget:"target",
	content:function(){
        "step 0"
        player.chooseToCompare(trigger.source).clear=false;
        "step 1"
        if(result.bool){
           player.line(trigger.player,'green')    
       trigger.player.recover()
            ui.clear();
        }
        else{
            var card2=result.target;
            if(get.position(card2)=='d') player.gain(card2,'gain2');
        }
    },
	ai:{
        threaten:1.1,
    },
    },
	"ye_chuanchen":{
              forceDie:true,
    trigger:{
        player:"die",
    },
    skillAnimation:true,
    animationColor:"gray",
    direct:true,
    content:function(){
        'step 0'
        player.chooseTarget(get.prompt('ye_chuanchen'),'令一名其他角色获得〖乾坤〗或〖传承〗，然后然后其获得你区域里所有的牌',function(card,player,target){
            return true;
        }).set('forceDie',true).set('ai',(target)=>get.attitude(_status.event.player,target));
        'step 1'
        if(result.bool){
			var target=result.targets[0];
			target.addSkillLog('ye_qiankun');
			target.addSkillLog('ye_chuanchen');
			target.gain(player.getCards('hej'),player,'giveAuto');
        }
    },
    },
	"ye_jiyii":{
              trigger:{
        player:"phaseDrawEnd",
    },
    direct:true,
    filter:function (event, player) {
        return player.countCards('hes')>=2;
    },
    content:function () {
		'step 0'
        player.chooseToDiscard('hes',2,get.prompt('ye_jiyii'),'选择弃置两张牌。',false).set('ai',function(card){
            return 7-get.value(card);
        }).set('autodelay',0.5).logSkill='ye_jiyii';
        'step 1'
        if(result.bool){
            player.logSkill('ye_jiyii');
            player.addTempSkill('ye_jiyii_0')
        }
    },
    subSkill:{
        "0":{
            charlotte:true,
            forced:true,
            trigger:{
                player:"phaseEnd",
            },
            content:function (){
				player.draw(3);
    },
            sub:true,
            "_priority":0,
        },
    },
    
    },
	"ye_qiji":{
		subSkill:{
        used:{
            charlotte:true,
            sub:true,
            sourceSkill:"ye_qiji",
            "_priority":0,
        },
    },
		usable:1,
       charlotte:true,
    enable:["chooseToUse","chooseToRespond"],
    filter:function(event,player){
		if(player.hasSkill('ye_qiji_used')) return false;
        var hs=player.getCards('h');
        if(hs.length!=1) return false;
        for(var i of hs){
            if(!game.checkMod(i,player,'unchanged','cardEnabled2',player)) return false;
        }
        for(var name of lib.inpile){
            var type=get.type(name);
            if(type!='basic'&&type!='trick') return false;
            var card=get.autoViewAs({name:name},hs)
            if(event.filterCard(card,player,event)) return true;
            if(name=='sha'){
                for(var nature of lib.inpile_nature){
                    card.nature=nature;
                    if(event.filterCard(card,player,event)) return true;
                }
            }
        }
        return false;
    },
    hiddenCard:function(player,name){
        var type=get.type(name);
        if(type!='basic'&&type!='trick') return false;
        var hs=player.getCards('h');
        if(!hs.length) return false;
        if(_status.connectMode) return true;
        for(var i of hs){
            if(!game.checkMod(i,player,'unchanged','cardEnabled2',player)) return false;
        }
        return true;
    },
    chooseButton:{
        dialog:function(event,player){
            var list=[],hs=player.getCards('h');
            for(var name of lib.inpile){
                var type=get.type(name);
                if(type!='basic'&&type!='trick') continue;
                var card=get.autoViewAs({name:name},hs);
                if(event.filterCard(card,player,event)) list.push([type,'',name]);
                if(name=='sha'){
                    for(var nature of lib.inpile_nature){
                        card.nature=nature;
                        if(event.filterCard(card,player,event)) list.push([type,'',name,nature]);
                    }
                }
            }
            return ui.create.dialog('奇迹',[list,'vcard'],'hidden');
        },
        check:function(button){
            var player=_status.event.player;
            var card={
                name:button.link[2],
                nature:button.link[3],
            };
            if(_status.event.getParent().type=='phase') return player.getUseValue(card,null,true);
            return 1;
        },
        backup:function(links,player){
            return {
                viewAs:{
                    name:links[0][2],
                    nature:links[0][3],
                },
                filterCard:true,
                position:'h',
                selectCard:-1,
				onuse:function(result,player){
					player.addTempSkill('ye_qiji_used',['phaseZhunbeiAfter','phaseDrawAfter','phaseJudgeAfter','phaseUseAfter','phaseDiscardAfter','phaseJieshuAfter']);
                },
            }
        },
    },
    ai:{
        respondSha:true,
        respondShan:true,
        skillTagFilter:function(player,tag,arg){
            return lib.skill.ye_qiji.hiddenCard(player,'s'+tag.slice(8));
        },
        order:999,
        result:{
            player:function(player){
                if(_status.event.dying) return get.attitude(player,_status.event.dying);
                return 2;
            },
        },
    },
    subSkill:{
        backup:{
            sub:true,
            "_priority":0,
        },
    },
    },
			"ye_kuixin":{
				forced:true,
       trigger:{
        player:"useCardAfter",
    },
	filter:function(event,player){
if(!event.targets||event.targets.length!=1||event.targets.contains(player)||event.targets[0].countCards('h')<=0||event.targets[0].countCards('h',function(card){
            return !get.is.shownCard(card);
        })<=0) return false;
   return event.targets[0].countCards('h',function(card){
            return get.is.shownCard(card);
        })<=player.getDamagedHp();
},
content:function (){
        var target=trigger.targets[0];
	var card=target.getCards('h',card=>!get.is.shownCard(card));
	var cards=card.randomGet();					
            player.logSkill('ye_kuixin',target);
            target.addShownCards(cards,'visible_kuixin');
    },
group:["ye_kuixin_2"],
                subSkill:{
                    "2":{
						forced:true,
                   trigger:{
		   global:"useCardAfter",
					    },
					   filter:function(event,player){
						 if(player==event.player||event.targets.length!=1||event.targets[0]!=player||event.player.countCards('h')<=0||event.player.countCards('h',function(card){
            return !get.is.shownCard(card);
        })<=0) return false;
					 return event.player.countCards('h',function(card){
            return get.is.shownCard(card);
        })<=player.getDamagedHp();
},
content:function (){
        'step 0'
        var target=trigger.player;
	var card=target.getCards('h',card=>!get.is.shownCard(card));
	var cards=card.randomGet();					
            player.logSkill('ye_kuixin',target);
            target.addShownCards(cards,'visible_kuixin');
    },
	sub:true,
                        },
						 },         
						 },
			"ye_xinhua":{
				usable:1,
          enable:"phaseUse",
				filter:function (event,player){ 
        return game.hasPlayer(function(current){
            return current.countCards('h',function(card){
            return get.is.shownCard(card);
        })>0;});
    },
	check:function(event,player){
        return true;
    },
                content:function(){
        'step 0'
        event.cards=[];
        event.cards2=[];
        var list=game.filterPlayer(function(current){
            return current.countCards('h',function(card){
            return get.is.shownCard(card);
        })>0;
        });
        list.sortBySeat();
        event.targets=list;
        'step 1'
        var target=targets.shift();
        event.target=target;
        if(target.isAlive()) target.chooseToDiscard('h','弃置一张明置的手牌',true,(card,player)=>{
            return get.is.shownCard(card);
        });
        'step 2'
        if(result.bool&&Array.isArray(result.cards)) event.cards.addArray(result.cards);
        if(targets.length) event.goto(1);
        'step 3'
        event.cards=cards.filter(function(i){
            return get.position(i,true)=='d';
        });
        if(!event.cards.length) event.finish();
        "step 4"
        game.broadcastAll('closeDialog',event.videoId);
        var card2=event.card2;
                player.chooseButton(['心花：是否使用这些牌？',cards]).set('filterButton',button=>{
                    return _status.event.player.hasUseTarget(button.link);
                }).set('ai',button=>{
                    return _status.event.player.getUseValue(button.link);
                });
                'step 5'
                if(result.bool){
                    var card=result.links[0];
                    event.cards.remove(card);
                    player.$gain2(card,false);
                    game.delayx();
                    player.chooseUseTarget(card,true);
                }
				else event.finish();
                'step 6'
                if(event.cards.filter(card=>{
                    return get.position(card,true)=='d'&&player.hasUseTarget(card);
                }).length) event.goto(4);
				if (!event.cards.length) {
                delete player.getStat().skill.ye_xinhua;
            }
    },
	ai:{
        order:10,
        result:{
            player:1,
        },
    },
    },
						 "ye_shidie":{
               trigger:{
        player:"phaseZhunbeiBegin",
    },
    direct:true,
    content:function(){
        'step 0'
		player.draw();
        player.chooseTarget(get.prompt('ye_shidie'),'视为对一名手牌数小于等于你的角色使用一张【杀】',(card,player,target)=>{
            return player.canUse('sha',target,false)&&target.countCards('h')<=player.countCards('h');
        }).set('ai',target=>{
            return get.effect(target,{name:'sha'},_status.event.player);
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            player.logSkill('ye_shidie',target);
            player.useCard({name:'sha',isCard:true},target,false);
        }
    },
    },
			"ye_yiling":{
               trigger:{
        global:"phaseBegin",
    },
    filter:function(event,player){  
        return player.countCards('e')>0&&event.player!=player;
    },
	direct:true,
	content:function(){
		'step 0'
		player.chooseToDiscard('e',[1,player.countCards('e')],function(card){
            return true;
        },'是否弃置装备区里至少一张牌，摸等量的牌，然后令'+get.translation(trigger.player)+'于本回合内拥有“死蝶”').set('ai',function(card){
            if(get.attitude(player,trigger.player)<=0) return false;
            return 6-get.value(card);
        });
        'step 1'
        if (result.bool) {
        player.logSkill('ye_yiling',trigger.player);
	       player.draw(result.cards.length);
		trigger.player.addTempSkill('ye_shidie');
        }
    },
            },
            "ye_morang":{
				zhuSkill:true,
				unique:true,
                trigger:{
                    global:"damageEnd",
                },
                filter:function(event,player){
					if(event.player==player) return false;
        if(event.player.hp>player.hp&&event.player.group!='yao') return false;
        return player.hasZhuSkill('ye_morang');
    },
                direct:true,
                content:function(){
					'step 0'
					event.num = trigger.num;
        'step 1'
        trigger.player.chooseBool('是否发动【墨染】，进行判定并于判定结果为黑色时令'+get.translation(player)+'获得判定牌？').set('choice',get.attitude(trigger.player,player)>0);
					 'step 2'
        if(result.bool){
            trigger.player.logSkill('ye_morang',player);
            trigger.player.line(player,'green')
            trigger.player.judge(function(card){
                if(get.color(card)=='black') return 1;
                return 0;
            }).judge2=function(result){
                return result.bool?true:false;
            };
			event.num--;
        }
        else{
            event.finish();
        }
        'step 3'
        if(result.color=='black'){
            player.gain(result.card,'gain2');
        }
		if (event.num) event.goto(1);
    },
                "audioname2":{
                    yuanshu:"weidi",
                },
            },
			"dswn_hualuo":{
                mod:{
                    targetInRange:function (card,player,target){
            if(target.hasSkill('dswn_hualuo_2')&&target.getStorage('dswn_hualuo_2').contains(get.suit(card))){
                return true;
            }
        },
                    cardUsableTarget:function (card,player,target){
            if(target.hasSkill('dswn_hualuo_2')&&target.getStorage('dswn_hualuo_2').contains(get.suit(card))) return true;
        },
                },
                shaRelated:true,
                group:["dswn_hualuo2"],
                trigger:{
                    player:"useCardToPlayered",
                },
                prompt:function (event,player){
        return '〖花落〗：是否令'+get.translation(event.target)+'获得【落】标记？';
    },
                check:function (event,player){
        return get.attitude(player,event.target)<=0;
    },
                filter:function (event,player){
        if(event.target==player) return false;
        return !event.target.hasSkill('dswn_hualuo_2')&&event.cards.length>0;
    },
                content:function (){
        trigger.target.addTempSkill('dswn_hualuo_2',{player:'phaseAfter'});
        for(var i=0;i<trigger.cards.length;i++){
            trigger.target.storage.dswn_hualuo_2.add(get.suit(trigger.cards[i]));
        }
            trigger.target.markSkill('dswn_hualuo_2');
    },
                subSkill:{
                    "2":{
                        charlotte:true,
                        mark:true,
                        marktext:"落",
                        intro:{
                            content:"无法使用或打出$牌。",
                        },
                        init:function (player,skill){
        if(!player.storage[skill]) player.storage[skill]=[];
    },
onremove:function (player,skill){
player.storage[skill]=[];
    },
                        mod:{
                            cardEnabled:function (card,player){
            if(player.getStorage('dswn_hualuo_2').contains(get.suit(card))) return false;
        },
                            cardUsable:function (card,player){
            if(player.getStorage('dswn_hualuo_2').contains(get.suit(card))) return false;
        },
        cardRespondable:function (card,player){
            if(player.getStorage('dswn_hualuo_2').contains(get.suit(card))) return false;
        },
                            cardSavable:function (card,player){
            if(player.getStorage('dswn_hualuo_2').contains(get.suit(card))) return false;
        },
                        },
                        sub:true,
                    },
                },
            },
			"dswn_hualuo2":{
                trigger:{
                    global:"loseAfter",
                },
                direct:true,
                filter:function (event,player){
        if(player==event.player) return false;
        if(!event.player.hasSkill('dswn_hualuo_2')) return false;
        if(event.type!='discard') return false;
        for(var i=0;i<event.cards2.length;i++){                if(event.player.getStorage('dswn_hualuo_2').contains(get.suit(event.cards2[i]))&&get.position(event.cards2[i],true)=='d'){
                        return true;
                    }
                }
        return false;
    },
                content:function (){
                "step 0"
                var cards=[];
                for(var i=0;i<trigger.cards2.length;i++){                if(trigger.player.getStorage('dswn_hualuo_2').contains(get.suit(trigger.cards2[i]))&&get.position(trigger.cards2[i],true)=='d'){
                        cards.push(trigger.cards2[i]);
                    }
                }
                if(cards.length){
                    player.chooseButton(['花落：选择要获得的牌',cards],[1,cards.length]).set('ai',function(button){
                        return get.value(button.link,_status.event.player,'raw');
                    });
                }
                "step 1"
                if(result.bool){
                    player.logSkill(event.name);
                    player.gain(result.links,'gain2','log');
                }
    },
            },
			"dswn_canhuang":{
                mod:{
                    targetInRange:function (card,player,target){
            if(card.name=='sha'&&(target.hasSkill('dswn_canhuang_1')||target.hasSkill('dswn_canhuang_2'))) return true;
        },
                },
                trigger:{
                    player:"loseHpEnd",
                },
                locked:true,
                direct:true,
                group:["dswn_canhuang_1"],
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt('dswn_canhuang'),[1,Math.max(1,player.getDamagedHp())],'选择令其他角色获得【荒】标记。',function(card,player,target){
            return target!=player&&!target.hasSkill('dswn_canhuang_1')&&!target.hasSkill('dswn_canhuang_2');
        }).set('ai',function(target){
            return get.attitude(player,target)<0&&!target.hasSkill('xinleiji');
        });
        'step 1'
        if(result.bool){
            player.logSkill('dswn_canhuang',result.targets);
            for(var i=0;i<result.targets.length;i++){
                result.targets[i].addTempSkill('dswn_canhuang_2',{player:'damageAfter'});
            }
        }
        else{
            player.logSkill('dswn_canhuang');
            var num=Math.max(1,player.getDamagedHp())
            var num1=Math.min(5,num)
            player.draw(num1);
        }
    },
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseEnd",
                        },
                        marktext:"荒",
                        init:function (player){
        player.markSkill('dswn_canhuang_1');
    },
                        forced:true,
                        charlotte:true,
                        mark:true,
                        intro:{
                            content:"回合结束时，你进行判定，若结果不为红桃，你失去一点体力。",
                        },
                        content:function (){
        'step 0'
        player.judge(function(card){
            var suit=get.suit(card);
            if(suit=='heart') return 1;
            return -1;
        });
        'step 1'
        if(result.suit!='heart'){
            player.loseHp();
        }
    },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            player:"phaseEnd",
                        },
                        marktext:"荒",
                        forced:true,
                        charlotte:true,
                        mark:true,
                        intro:{
                            content:"回合结束时，你进行判定，若结果不为红桃，你失去一点体力。直至你受到伤害。",
                        },
                        content:function (){
        'step 0'
        player.judge(function(card){
            var suit=get.suit(card);
            if(suit=='heart') return 1;
            return -1;
        });
        'step 1'
        if(result.suit!='heart'){
            player.loseHp();
        }
    },
                        sub:true,
                    },
                },
            },
            "dswn_heidie":{
                trigger:{
                    target:"useCardToTargeted",
                },
                filter:function (event,player){
        return event.card.name=='sha';
    },
                check:function (event,player){
        return get.damageEffect(event.player,player,player)>0&&!player.hasShan();
    },
                prompt:function (event,player){
        return '〖黑蝶〗：是否令'+get.translation(event.player)+'使用的'+get.translation(event.card)+'不可被响应并视为对其使用一张无视防具的【杀】？';
    },
                content:function (){
        "step 0"
            trigger.directHit.add(player);
        "step 1"  
        var card={name:'sha',isCard:true};
            if(player.canUse(card,trigger.player,false)) player.useCard(card,trigger.player,false).card.dswn_heidie=true;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(!arg||!arg.card||arg.card.dswn_heidie!=true) return false;
        },
                },
            },
			"hzqeg_mingyun":{
                group:["hzqeg_mingyun_2"],
                preHidden:["hzqeg_mingyun_2"],
                trigger:{
                    global:"useCard",
                },
                filter:function (event,player){
        if (event.cards.length>=2) return false;
        var cards=[];
        for(var i=0;i<1;i++){
            var card=ui.cardPile.childNodes[i];
            if(card) cards.push(card);
            else break;
        }
        return get.suit(cards)==get.suit(event.card)||get.number(cards)==get.number(event.card);
    },
                marktext:"命运",
                intro:{
                    content:"expansion",
                    markcount:"expansion",
                },
                forced:true,
                onremove:function (player,skill){
        var cards=player.getExpansions(skill);
        if(cards.length) player.loseToDiscardpile(cards);
    },
                content:function (){
        player.addToExpansion(get.cards(),'gain2').gaintag.add('hzqeg_mingyun');
    },
                subSkill:{
                    "2":{
                        trigger:{
                            global:"dying",
                        },
                        forced:true,
                        content:function (){
        player.gain(player.getExpansions('hzqeg_mingyun'),'gain2','fromStorage'); 
    },
                        sub:true,
                    },
                },
            },
			"ye_yanmo":{
                mod:{
                    globalFrom:function (from,to){
            if(to.hasMark('ye_yanmo_sign')) return -Infinity;
        },
                },
                trigger:{
                    source:"damageSource",
                    player:"damageEnd",
                },
                priority:1,
                forced:true,
                filter:function (event, player){
        return event.card&&event.card.name=='sha';
    },
                content:function (){
        player.addMark('ye_yanmo_sign',trigger.num);
    },
                group:["ye_yanmo_1","ye_yanmo_2"],
                global:"ye_yanmo_sign",
                subSkill:{
                    "1":{
                        trigger:{
                            global:"damageEnd",
                        },
                        filter:function (event,player){
        return event.nature=='fire';
    },
                        forced:true,
                        content:function (){
        trigger.player.addMark('ye_yanmo_sign',1);
                if(trigger.source){
        trigger.source.addMark('ye_yanmo_sign',1); 
                }
    },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            player:"damageBegin4",
                        },
                        forced:true,
                        filter:function (event,player){
        if(event.num<=1) return false;
        return event.nature=='fire';
    },
                        content:function (){
        trigger.num=1;
    },
                        ai:{
                            filterDamage:true,
                            skillTagFilter:function (player,tag,arg){
            if(arg&&arg.player){
                if(arg.player.hasSkillTag('jueqing',false,player)) return false;
            }
        },
                        },
                        sub:true,
                    },
                    sign:{
                        marktext:"炎",
                        intro:{
                            content:function (storage){
            return '当前拥有的炎标记：'+storage+'';
        },
                        },
                        sub:true,
                    },
                },
            },
            "ye_zhuolanjiangui":{
                nobracket:true,
                group:"ye_zhuolanjiangui_fire",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                direct:true,
				filter:function(event,player){
        return game.hasPlayer(function(current){
            return current.countMark('ye_yanmo_sign')>=current.hp;
        });
    },
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt('ye_zhuolanjiangui'),'是否弃置一名角色所有的【炎魔】标记？',function(card,player,target){
            return target.countMark('ye_yanmo_sign')>=target.hp;
        }).set('ai',function(target){
            return target.isMinHp();
        });
        'step 1'
        if(result.bool){
            player.logSkill('ye_zhuolanjiangui',result.targets);
            event.target=result.targets[0]
            num1=result.targets[0].storage.ye_yanmo_sign
            num2=Math.min(3,num1-result.targets[0].hp)
            player.chooseControl('造成伤害','恢复体力','取消',function(event,player){
            if(get.damageEffect(event.target,player,player)>0) return '造成伤害';
            if(get.attitude(event.target,player)>=0&&event.target.hp<event.target.maxHp) return '恢复体力';
            return '取消';
        }).set('prompt','灼烂歼鬼：令选择的角色受到一点火焰伤害或恢复一点体力');
            
        }
        else{
            player.draw();
            event.finish();
        }
        'step 2'
        if(result.control){
        if(result.control=='造成伤害'){
             event.target.removeMark('ye_yanmo_sign', event.target.countMark('ye_yanmo_sign'));
            event.target.damage('fire');
            if(num2>0){
                player.draw(num2);
            }
        }
        else if(result.control=='恢复体力'){
            event.target.removeMark('ye_yanmo_sign', event.target.countMark('ye_yanmo_sign'));
            event.target.recover();
            if(num2>0){
                player.draw(num2);
            }
        }
         else{
             player.draw();
         }
        }
    },
                subSkill:{
                    fire:{
                        trigger:{
                            player:"useCard1",
                        },
                        filter:function (event,player){
        if(event.card.name=='sha'&&!event.card.nature) return true;
    },
                  "prompt2":function(event,player){
        return '将'+get.translation(event.card)+'改为火属性';
    },
                        check:function (event,player){
        var eff=0;
        for(var i=0;i<event.targets.length;i++){
            var target=event.targets[i];
            var eff1=get.damageEffect(target,player,player);
            var eff2=get.damageEffect(target,player,player,'fire');
            eff+=eff2;
            eff-=eff1;
        }
        return eff>=0;
    },
                        content:function (){
        trigger.card.nature='fire';
        if(get.itemtype(trigger.card)=='card'){
            var next=game.createEvent('zhuque_clear');
            next.card=trigger.card;
            event.next.remove(next);
            trigger.after.push(next);
            next.setContent(function(){
                delete card.nature;
            });
        }
    },
                        sub:true,
                    },
                },
            },           
			ye_menfei:{
				 markimage:"extension/叶原之夜/image/mark/@door.png",
                marktext:"扉",
                intro:{
                    name:"门扉(扉)",
                    "name2":"扉",
                },
				enable:"phaseUse",
				filter:function(event,player){
                return !game.hasPlayer(function(current){
                    return current.hasMark('ye_menfei');
                });
               },
			   filterTarget:true,
			   ai:{
        order:10,
        result:{
            target:-1,
        },
    },
			   content:function(){
            target.addMark('ye_menfei',1);
    },
	group:["ye_menfei_use"],
                subSkill:{
                    use:{
                       trigger:{
        player:"useCardAfter",
    },
	filter:function(event,player){
                return game.hasPlayer(function(current){
                    return current.hasMark('ye_menfei');
                });
               },
	content:function(){
                var list=game.filterPlayer((current)=>current.hasMark('ye_menfei')).sortBySeat();
                var map={};
                for(var i of list){
                    var num=i.countMark('ye_menfei');
                    i.removeMark('ye_menfei',num);
                    map[i.playerid]=num;
                }
                for(var i of list){
                    var next=i.next;
                    next.addMark('ye_menfei',map[i.playerid]);
                }
            },
    forced:true,
                        sub:true,
			"_priority":0,
                    },
                },
            },
			ye_houhu:{
				trigger:{
        player:"useCardToPlayered",
    },
	direct:true,
	charlotte:true,
	filter:function (event, player) {
		if(get.type(event.card) == 'equip') return false;
        return game.hasPlayer(function(current){
                    return current.hasMark('ye_menfei');
                });
    },
    content:function (){
        'step 0'
		if(player.countMark('ye_houhu')>0){
			player.removeMark('ye_houhu',1,false);
			event.finish();
		};
		'step 1'
		player.addMark('ye_houhu',1,false);
		if(trigger.target.countMark('ye_menfei')>0){
			player.chooseBool('是否摸一张牌？').set('choice',get.attitude(player,player)>0);
		};
        'step 2'
        if(result.bool){
            player.logSkill('ye_houhu');
            player.line(player,'green');
            player.draw();
        }
			var current=game.findPlayer(function(player){
						return player.countMark('ye_menfei')>0;
					});
		if(trigger.targets.contains(current)){
			player.removeMark('ye_houhu',1,false);
			event.finish();
		};
		if(get.type(trigger.card) == 'delay'){
			player.removeMark('ye_houhu',1,false);
			event.finish();
		}
			'step 3'
        var prompt2='是否令拥有【扉】标记的角色成为'+get.translation(trigger.card)+'的额外目标'
        player.chooseTarget(get.prompt('ye_houhu'),function(card,player,target){
            var player=_status.event.source;
			if(target.countMark('ye_menfei')<=0) return false;
            return !_status.event.targets.contains(target)&&lib.filter.targetEnabled2(_status.event.card,player,target);//&&lib.filter.targetInRange(_status.event.card,player,target);
        }).set('prompt2',prompt2).set('ai',function(target){
            var trigger=_status.event.getTrigger();
            var player=_status.event.source;
            return get.effect(target,trigger.card,player,_status.event.player);
        }).set('targets',trigger.targets).set('card',trigger.card).set('source',trigger.player).setHiddenSkill(event.name);
        'step 4'
        if(result.bool){
            if(!event.isMine()&&!event.isOnline()) game.delayx();
            event.targets=result.targets;
        }
        else{
			player.removeMark('ye_houhu',1,false);
            event.finish();
        }
        'step 5'
        if(event.targets){
            player.logSkill(event.name,event.targets);
            trigger.targets.addArray(event.targets);
            game.log(event.targets,'也成为了',trigger.card,'的目标');
        }
    },
	},
			ye_qixian:{
				trigger:{
        global:["cardsDiscardAfter","loseAsyncAfter"],
    },
	filter:function(event,player){
        if(event.name.indexOf('lose')==0){
            if(event.getlx===false||event.position!=ui.discardPile) return false;
        }
        else{
            var evt=event.getParent();
            if(evt.relatedEvent&&evt.relatedEvent.name=='respond'||evt.relatedEvent&&evt.relatedEvent.name=='useCard'||event.type=='discard') return false;
        }
        for(var i of event.cards){
            var owner=false;
            if(event.hs&&event.hs.contains(i)) owner=event.player;
            var suit=get.suit(i,null,owner);
            if(suit=='heart') return true;
        }
        return false;
    },
	frequent:true,
    content:function(){
'step 0'
player.chooseTarget(get.prompt('ye_qixian'),'令一名角色摸一张牌').set('ai',function(target){
var player=_status.event.player;
return get.attitude(player,target);
});
'step 1'
if(result.bool){
player.logSkill('ye_qixian',result.targets);
result.targets[0].draw();
}
},
            },
			ye_fengmo:{
				trigger:{
        global:"useCard",
    },
	direct:true,
    filter:function(event,player){
		if(player.countCards('hes')<=0) return false;
		if(event.player==player) return false;
        if(event.card.isCard){
            return !event.player.hasSkill('ye_fengmo2')&&get.type(event.card)=='basic';
        }
        return false;
    },
    content:function(){
        "step 0"
		trigger.player.addTempSkill('ye_fengmo2');
        var next=player.chooseToDiscard('hes',get.prompt2('ye_fengmo',trigger.player));
        var check=get.attitude(player,trigger.player)<0;
        next.set('ai',function(card){
			if(get.attitude(player,trigger.player)>=0) return 0;
             return 8-get.value(card);
        });
		next.set('logSkill','ye_fengmo');
        next.set('goon',check);
        next.setHiddenSkill('ye_fengmo');
        "step 1"
        if(result.bool){
			player.logSkill('ye_fengmo',trigger.player);
			trigger.player.judge(function(result){
				if(get.suit(card)=='heart') return 2;
                if(get.suit(card)=='diamond') return 1;
                return 0;
            });
        }
        else{
            event.finish();
        }
        "step 2"
		if(result.color){
            if(result.color=='red'){
                trigger.cancel();
game.broadcastAll(ui.clear);
game.delayx();
            }
            else{
                player.draw();
            }
        }
    },
            },
			ye_fengmo2:{
            },
			ye_boli:{
    zhuSkill:true,
				unique:true,
				trigger:{
        global:"judge",
    },
	direct:true,
    filter:function(event,player){
		if (!player.hasZhuSkill('ye_boli')) return false;
            return get.suit(event.player.judging[0],event.player)!='heart';
    },
	check:function(event,player){
var judging=_status.event.judging;
var cardh={name:judging.name,suit:'heart'};
var resulth=event.judge(cardh)-event.judge(judging);
var attitude=get.attitude(player,event.player);
if(attitude==0||(resulth==0)) return false;
if(attitude>0){
if(resulth>0) return true;
return false;
}
else{
 if(resulth>0) return false;
return true;
}
    },
	content:function(){
		'step 0'
var str=get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+
get.translation(trigger.player.judging[0])+'，是否发动「博丽」令其他角色选择是否打出♥手牌代替之？';
player.chooseControl('是','否').set('prompt',get.prompt('ye_boli')).set('prompt2',str).set('ai',function(){
var judging=_status.event.judging;
var cardh={name:judging.name,suit:'heart'};
var resulth=trigger.judge(cardh)-trigger.judge(judging);
var attitude=get.attitude(player,trigger.player);
if(attitude==0||(resulth==0&&results==0)) return '取消';
if(attitude>0){
if(resulth>0) return '是';
return '否';
}
else{
 if(resulth>0) return '否';
return '是';
}
}).set('judging',trigger.player.judging[0]);
'step 1'
if(['否'].includes(result.control)){
event.finish();
}
        "step 2"
        if(event.current==undefined) event.current=player.next;
			if(event.current==player){
            event.finish();
        }
        else{
            if((event.current==game.me&&!_status.auto)||(
                get.attitude(event.current,player)>2)||
                event.current.isOnline()){
                player.storage.ye_boliing=true;
                var next=event.current.chooseCard('是否打出一张红桃牌代替原判定牌？',{suit:'heart'});
                next.set('ai',function(){
                    var event=_status.event;
                    return (get.attitude(event.player,event.source)-2);
                });
                next.set('skillwarn','打出一张红桃牌代替原判定牌');
				next.autochoose=lib.filter.autoRespondShan;
                next.set('source',player);
            }
        }
		"step 3"
        if(result.bool){
            event.current.respond(result.cards,'ye_boli','highlight','noOrdering');
        }
        "step 4"
        player.storage.ye_boliing=false;
        if(result.bool){
            if(trigger.player.judging[0].clone){
                trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                game.broadcast(function(card){
                    if(card.clone){
                        card.clone.classList.remove('thrownhighlight');
                    }
                },trigger.player.judging[0]);
                game.addVideo('deletenode',player,get.cardsInfo([trigger.player.judging[0].clone]));
            }
            game.cardsDiscard(trigger.player.judging[0]);
            trigger.player.judging[0]=result.cards[0];
            trigger.orderingCards.addArray(result.cards);
            game.log(trigger.player,'的判定牌改为',result.cards[0]);
            game.delay(2);
        }
        else{
            event.current=event.current.next;
            event.goto(0);
        }
    },
	ai:{
        rejudge:true,
        tag:{
            rejudge:1,
        },
        expose:0.5,
    },
            },
			eyinni:{
                mod:{
                    targetEnabled:function(card,player,target,now){
            if(card.name=='sha'||card.name=='juedou') return false;
        },
                },
                forced:true,
            },
			yinni:{
                audio:"ext:叶原之夜/audio/skill:2",
                frequent:true,
                trigger:{
                    player:"phaseAfter",
                },
               filter:function(event,player){
        return !player.getHistory('sourceDamage').length;
    },
                content:function(){
					player.addTempSkill('eyinni',{player:'phaseBegin'});
					player.draw();
        
    },
            },
            yee_qiji:{
                audio:"ext:叶原之夜/audio/skill:2",
                trigger:{
                    global:"useCard",
                },
                filter:function(event,player){
        if(player==_status.currentPhase) return false;
        return event.card.name=='shan'&&event.player!=player&&(player.hp>0||player.hasCard(function(card){
            return player.countCards('he')>0;
        },'eh'))
        return player.current!=_status.currentPhase;
    },
                logTarget:"player",
                check:function(event,player){
        if(get.attitude(player,event.player)>=0) return false;
        if(get.damageEffect(event.player,event.getParent(3).player,player,get.nature(event.card))<=0) return false;
        if(player.hasCard(function(card){
            return get.value(card)<7;
        },'eh')) return true;
        return player.hp>Math.max(1,event.player.hp);
    },
                content:function(){
        'step 0'
        trigger.all_excluded=true;
        var str='弃置一张牌';
        if(player.hp>0) str+='，出其不意咯';
        var next=player.chooseToDiscard(str,function(card){
            return true;
        },'he',true).set('ai',function(card){
            return 7-get.value(card);
        });
        if(player.hp<=0) next.set('forced',true);
        'step 1'
        var cards=trigger.cards.filterInD();
    
    },
            },
			"xin_jr":{
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player!=player&&event.player.hasMark('yan_die');
    },
                logTarget:"player",
                forced:true,
                content:function (){
        'step 0'        
        if(trigger.player.countCards('h')>0)       trigger.player.chooseToDiscard('h','弃置一张手牌或令'+get.translation(player.name)+'收回你的“焰蝶”并摸一张牌，然后你受到1点火焰伤害').set('ai',function(card){
            return 9-get.value(card); 
        });  
       'step 1'
       if(!result.bool){  
	      player.draw();
          var num=trigger.player.countMark('yan_die');
          trigger.player.damage('fire');
          player.addMark('yan_die',num);
          trigger.player.removeMark('yan_die',num);          
       }
    },
                ai:{
                    threaten:1.1,
                    expose:0.3,
                },
            },
			"yan_die":{
                intro:{
                    name:"蝶",
                    "name2":"蝶",
                    content:"当前有#个“焰蝶”",
                },
				marktext:"蝶",
                group:["xin_yd","yan_die_a","yan_die_b"],
                trigger:{
                    global:"gameDrawAfter",
                },
                forced:true,
                content:function (){
        player.addMark('yan_die',3);     
    },
                subSkill:{
                    a:{
                        trigger:{
                            global:"dieBefore",
                        },
                        frequent:true,
                        filter:function (event,player){
                return event.player!=player&&event.player.storage.yan_die>0;
            },
                        content:function (){
                x=trigger.player.countMark('yan_die');
                player.addMark('yan_die',x);
				player.draw(2);			
                player.markSkill('yan_die');
                trigger.player.removeMark('yan_die',x);
                trigger.player.unmarkSkill('yan_die');
            },
                        sub:true,
                    },
					b:{
                        trigger:{player:'phaseDrawBegin2'},
				forced:true,
				preHidden:true,
				filter:function(event,player){
					return !event.numFixed&&player.countMark('yan_die')>=1;
				},
				content:function(){
					trigger.num+=1;
				},
                        sub:true,
                    },
                },
            },
			"xin_yd":{
                popup:false,
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                direct:true,
                priority:-5,
                content:function (){                 
       'step 0'
       var nxt=player.chooseTarget(get.prompt2('xin_yd'),function(card,player,target){
               return target.hasMark('yan_die');
       });
       nxt.set('ai',function(target){
            var player=_status.event.player;
            var att=get.attitude(player,target);
            if(att>0){
                if(target==player&&player.hasMark('yan_die')) return att+2;            
                if(target.countMark('yan_die')>0) return att+1;
            }
                return att;         
        });     
       'step 1'
        if(result.bool){
        z1=result.targets[0];
        var next=player.chooseTarget('请选择要转移的目标',function(card,player,target){
               return !target.hasMark('yan_die');
        });
        next.set('ai',function(target){
            var player=_status.event.player;
            var att=get.attitude(player,target);
            if(att<0){
            if(target.hasMark('yan_die')) return att+1;             
            }
            else{
                if(att>0){
                    if(!target.hasMark('yan_die')) return att=0;                   
                }
            }
            return -att;        
        });
        }
        else{event.finish();}
        'step 2'
        if(result.bool){         
          z2=result.targets[0];
          player.logSkill('xin_yd',z2);
          if(z1.hasMark('yan_die')) z2.addMark('yan_die');
          z1.removeMark('yan_die');
        }    
    },
            },
            "yd3":{
                popup:false,
                trigger:{
                    source:"damageBegin1",
                },
                forced:true,
                filter:function (event,player){
        return event.player!=player&&event.player.hasMark('yan_die');
    },
                logTarget:"player",
                content:function (){  
       'step 0'  
       var num=trigger.player.countMark('yan_die');
       player.addMark('yan_die',num);
       trigger.player.addTempSkill('yd_5',{player:['loseAfter','damageBegin']});
       trigger.player.removeMark('yan_die',num);
        'step 1'
        player.chooseTarget('是否将“蝶”交给一名其他角色？',function(card,player,target){
            return target!=player&&!target.hasSkill('yd_5');
        }).set('ai',function(target){
            var player=_status.event.player;
            return -get.attitude(player,target);
        });
        'step 2'
        if(result.bool){
          var target=result.targets[0];  
           target.addMark('yan_die',1); 
           player.removeMark('yan_die',1);
        }
    },
            },
            "y_f":{
            },
            "lishan":{
				round:2,
                trigger:{
                    player:"dying",
                },
                forced:true,
                filter:function (event,player){
        return player.hp<=0&&!player.hasSkill('y_d2');
    },
                content:function (){
       'step 0'
       var num=1-player.hp;
       if(num) player.recover(num);
       player.chooseUseTarget({name:'sha'},'是否视为使用一张【杀】？',false);    
    },
            },
            "yd_5":{
            },
			"xin_daoxi":{
                intro:{
                    name:"刀袭",
                    content:function (storage){
						return  '当前有'+storage+'枚“刀袭”<br>与其他角色距离-'+storage+'<br>手牌上限+'+storage+'';
        },
                },
                trigger:{
                    player:"damageEnd",
                    source:"damageEnd",
                },
                forced:true,
                content:function (){
        "step 0"
        event.c=trigger.num;
        "step 1" 
        event.c--;
        player.addMark('xin_daoxi');        
        if(player.countMark('xin_daoxi')>2){
	 player.draw();
            player.removeMark('cv',Infinity);
            player.removeMark('xin_daoxi',Infinity);
            player.addSkill('xin_sm_c');
        }
        "step 2"
        if(event.c>0){
            event.goto(1);
        }
    },
                mod:{
                    globalFrom:function (from,to,distance){
            var c=from.countMark('xin_daoxi');
            return distance-c;
        },
		maxHandcardBase:function(player,num){
            return num+player.countMark('xin_daoxi');
        },
                },
            },
            "xin_sm":{
                shaRelated:true,
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function (event,player){
       return event.targets.length==1&&event.card&&['sha'].contains(event.card.name)&&!player.hasSkill('xin_sm_c');
    },
                forced:true,
                content:function (){
        "step 0"         
        var d;
        var c=player.hujia>0?'掉甲':d;
        player.chooseControl('掉血',c,'cancel2').set('prompt','要执行一项效果并令'+get.translation(trigger.card)+'无法被响应并摸一张牌吗？').set('ai',function(){
                    var player=_status.event.player;
                    if(player.hp>3) return '掉血';
                    if(player.hujia>0&&player.countMark('xin_daoxi')>1&&player.hp<=3) '掉盾';
                    return 'cancel2';
                });
        "step 1"
        if(result.control=='cancel2')   event.finish();
        if(result.control=='掉血'){
            player.loseHp();
	 player.draw();
            trigger.directHit.addArray(game.players);            
        }
        if(result.control=='掉甲'&&player.hujia>0){
            player.changeHujia(-1);
			player.draw();
            trigger.directHit.addArray(game.players);          
        }
    },
                group:["xin_sm_f"],
                subSkill:{
                    f:{
                        shaRelated:true,
                        trigger:{
                            player:"useCardToPlayered",
                        },
                        filter:function (event,player){
     return event.targets.length==1&& event.card&&['sha'].contains(event.card.name)&&player.hasSkill('xin_sm_c');
    },
                        forced:true,
                        content:function (){
        'step 0'
 player.chooseControl('无法响应','伤害+1并获得1点护甲','cancel2').set('prompt','是否令'+get.translation(trigger.card)+'执行以下效果之一？').set('ai',function(){     
            return '伤害+1并获得1点护甲';          
        });  
        'step 1'
        if(result.control=='cancel2')   event.finish();
        if(result.control=='无法响应'){
            trigger.directHit.addArray(game.players);
        }
        if(result.control=='伤害+1并获得1点护甲'){
            player.changeHujia();
            var trigger2=trigger.getParent();
                if(typeof trigger2.baseDamage!='number'){
                trigger2.baseDamage=1;
            }
            trigger2.baseDamage+=1;      
        }        
    },
                        sub:true,
                    },
                    c:{
                        popup:false,
                        priority:9990,
                        trigger:{
                            player:"phaseJieshuBegin",
                        },
                        forced:true,
                        content:function (){
            player.addMark('cv');
            player.markSkill('xin_sm_c');
        if(player.countMark('cv')>1){
            player.removeMark('cv',Infinity);
            player.removeSkill('xin_sm_c');
            }
        },
                        marktext:"化",
                        mark:true,
                        intro:{
                            name:"强化",
                            content:"「噬魔」己被强化<br>强化效果（直到自己的下个回合结束强化效果失效）当你使用【杀】指定一名角色为目标后，你可以令此【杀】执行以下效果之一:1.此【杀】不可被响应；2.此【杀】伤害+1并获得一点护盾。",
                        },
                        sub:true,
                    },
                },
            },
			"ye_zhanxing":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                trigger:{
                    player:"phaseAfter",
                },
                priority:-1,
                forced:true,
                content:function (){
        'step 0'              
            event.cards=get.cards(2);
            player.showCards(event.cards);
        'step 1'
        var gained=[];
        for(var i=0;i<event.cards.length;i++){
            var suit=get.suit(event.cards[i]);
            if(suit&&!player.countCards('h',{suit:suit})){
                gained.push(event.cards[i]);
            }
            else{
                event.cards[i].discard();
            }
        }
        player.gain(gained,'gain2');
    },
                ai:{
                    threaten:1.5,
                },
            },
                    "ye_5yu8":{
                        direct:true,
                        filter:function(event,player){
                return player.hasMark('ye_5yu')||player.hasCard((card)=>lib.filter.cardDiscardable(card,player,'ye_5yu_2'),'hes');
            },
                        trigger:{
                            player:"phaseJudgeBefore",
                        },
                        check:function(event,player){
                return player.hasCard(function(card){
                    return get.effect(player,{
                        name:card.viewAs||card.name,
                        cards:[card],
                    },player,player)<0;
                },'j');
            },
                        content:function(){
                "step 0"
                var choices=[];
                if(player.hasMark('ye_5yu')) choices.push('弃置标记');     
                if(player.hasCard((card)=>lib.filter.cardDiscardable(card,player,'ye_5yu_2'),'hes')) choices.push('弃置牌');
                choices.push('cancel2');
				player.chooseControl(choices).set('prompt','名欲：是否跳过判定阶段？').set('ai',function(){
                    var evt=_status.event;
                    if(lib.skill[evt.getParent().name].check(evt.getTrigger(),evt.player)) return 0;
                    return 'cancel2';
                });
                "step 1"
                if(result.control!='cancel2'){
                    if(result.control=='弃置标记'){
                    player.logSkill(event.name);
                        player.removeMark('ye_5yu',1,false);
        }
        else{
            player.chooseToDiscard('hes',true).logSkill=event.name;
        }
                }
                else event.finish();
                "step 2"
        trigger.cancel();
    },
                    },
                    "ye_5yu3":{
                        direct:true,
                        filter:function(event,player){
                return player.hasMark('ye_5yu')||player.hasCard((card)=>lib.filter.cardDiscardable(card,player,'ye_5yu_3'),'hes');
            },
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        content:function(){
                "step 0"
                var choices=[];
                if(player.hasMark('ye_5yu')) choices.push('弃置标记');     
                if(player.hasCard((card)=>lib.filter.cardDiscardable(card,player,'ye_5yu_3'),'hes')) choices.push('弃置牌');
                choices.push('cancel2');
player.chooseControl(choices).set('prompt','财欲：是否摸一张牌？').set('ai',function(){
                    if(player.hasMark('ye_5yu')) return '弃置标记';
                    return '弃置牌';
                });
                "step 1"
                if(result.control!='cancel2'){
                    if(result.control=='弃置标记'){
                    player.logSkill(event.name);
                        player.removeMark('ye_5yu',1,false);
        }
        else{
            player.chooseToDiscard('hes',true).logSkill=event.name;
        }
                }
                else event.finish();
                "step 2"
        player.draw();
    },
                    },
                    "ye_5yu4":{
                        direct:true,
                        filter:function(event,player){
                return player.hasMark('ye_5yu')||player.hasCard((card)=>lib.filter.cardDiscardable(card,player,'ye_5yu_4'),'hes');
            },
                        check:function(event,player){
                return player.needsToDiscard();
            },
                        trigger:{
                            player:"phaseDiscardBefore",
                        },
                        content:function(){
                'step 0'
                var choices=[];
                if(player.hasMark('ye_5yu')) choices.push('弃置标记');
                if(player.hasCard((card)=>lib.filter.cardDiscardable(card,player,'ye_5yu_4'),'hes')) choices.push('弃置牌');
                choices.push('cancel2');
                player.chooseControl(choices).set('prompt','睡欲：是否跳过弃牌阶段？').set('ai',function(){
                    if(player.hasMark('ye_5yu')) return '弃置标记';
                    return '弃置牌';
                });
                'step 1'
                if(result.control!='cancel2'){
                    if(result.control=='弃置牌'){
                        player.chooseToDiscard('hes',true).logSkill=event.name;
                    }
                    else{
                        player.logSkill(event.name);
                        player.removeMark('ye_5yu',1,false);
                    }
                }
                else event.finish();
                'step 2'
                trigger.cancel();
            },
                    },
			"ye_5yu6":{
		enable:"chooseToUse",
    filter:function(event, player) {
        if (event.responded) return false;
        if (!event.filterCard({
            name: "jiu",
            isCard: true
        }, player, event)) return false;
        return player.hasMark('ye_5yu')||player.hasCard((card)=>lib.filter.cardDiscardable(card,player,'ye_5yu_4'),'hes');
    },
    hiddenCard:function(player, name) {
        return lib.inpile.includes(name) && name == "jiu";
    },
    content:function() {
		
        "step 0"
		var choices=[];
                if(player.hasMark('ye_5yu')) choices.push('弃置标记');
                if(player.hasCard((card)=>lib.filter.cardDiscardable(card,player,'ye_5yu_4'),'hes')) choices.push('弃置牌');
                choices.push('cancel2');
                player.chooseControl(choices).set('prompt','食欲：是否将一张牌当酒使用？').set('ai',function(){
                    if(player.hasMark('ye_5yu')) return '弃置标记';
                    return '弃置牌';
                });
                'step 1'
                if(result.control!='cancel2'){
                    if(result.control=='弃置牌'){
                        player.chooseToDiscard('hes',true).logSkill=event.name;
                    }
                    else{
                        player.logSkill(event.name);
                        player.removeMark('ye_5yu',1,false);
                    }
                }
                else event.finish();
                'step 2'
        player.choosePlayerCard(player, "hes", true, get.translation(event.name) + "：请选择将一张牌当作【酒】使用");
        "step 3"
        if (result.cards && result.cards.length) {
            if (_status.event.getParent(2)['type'] == 'dying') {
                event.dying = player;
                event.type = 'dying';
            }
            var card = get.autoViewAs({
                name: 'jiu',
                isCard: true
            }, result.cards);
            player.useCard(card, result.cards, false, player);
        }
    },
    ai:{
        order:5,
        result:{
            player:function (player) {
                if (_status.event.parent.name == "phaseUse") {
                    if (player.countCards("h", "jiu") > 0) return 0;
                    if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) return 0;
                    if (!player.countCards("h", "sha")) return 0;
                    var targets = [];
                    var target;
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i++) {
                        if (get.attitude(player, players[i]) < 0) {
                            if (player.canUse("sha", players[i], true, true)) {
                                targets.push(players[i]);
                            }
                        }
                    }
                    if (targets.length) {
                        target = targets[0];
                    } else {
                        return 0;
                    }
                    var num = get.effect(target, { name: "sha" }, player, player);
                    for (var i = 1; i < targets.length; i++) {
                        var num2 = get.effect(targets[i], { name: "sha" }, player, player);
                        if (num2 > num) {
                            target = targets[i];
                            num = num2;
                        }
                    }
                    if (num <= 0) return 0;
                    var e2 = target.getEquip(2);
                    if (e2) {
                        if (e2.name == "tengjia") {
                            if (!player.countCards("h", { name: "sha", nature: "fire" }) && !player.getEquip("zhuque")) return 0;
                        }
                        if (e2.name == "renwang") {
                            if (!player.countCards("h", { name: "sha", color: "red" })) return 0;
                        }
                        if (e2.name == "baiyin") return 0;
                    }
                    if (player.getEquip("guanshi") && player.countCards("he") > 2) return 1;
                    return target.countCards("h") > 3 ? 0 : 1;
                }
                if (player == _status.event.dying || player.isTurnedOver()) return 3;
            },
        },
        effect:{
            target:function (card, player, target) {
                if (card.name == "guiyoujie") return [0, 0.5];
                if (target.isTurnedOver()) {
                    if (get.tag(card, "damage")) {
                        if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
                        if (target.hp == 1) return;
                        return [1, target.countCards("h") / 2];
                    }
                }
            },
        },
    },
                    },
			"ye_5yu5":{
                        enable:"phaseUse",
                        filter:function(event,player){
                return player.hasCard((card)=>lib.filter.cardDiscardable(card,player,'ye_5yu5'),'hes');
            },
                        filterCard:true,
                        position:"hes",
                        selectCard:function(){
        return 1;
    },
                        check:function(card){
        return 6-get.value(card);
    },
                        prompt:function(){
        return '色欲：弃置一张牌然后令此回合内使用【杀】的次数上限+1';
    },
                        content:function(){
             player.addTempSkill('ye_5yu2','phaseUseEnd');
             player.addMark('ye_5yu2',1,false);
    },
                    },
					"ye_5yu7":{
                        enable:"phaseUse",
                        filter:function(event,player){
                return player.hasMark('ye_5yu');
            },
                        prompt:function(){
        return '弃1枚【欲】标记然后令此回合内使用【杀】的次数上限+1';
    },
	content:function(){
					'step 0'
					player.chooseBool('色欲：是否弃1枚【欲】标记然后令此回合内使用【杀】的次数上限+1？').forceDie=true;
					'step 1'
					if(result.bool){
						player.removeMark('ye_5yu',1,false);
             player.addTempSkill('ye_5yu2','phaseUseEnd');
             player.addMark('ye_5yu2',1,false);
					}
				},
                    },
			"ye_shoushan":{
               trigger:{
        player:"phaseDrawBegin",
    },
    forced:true,
    mark:true,
    intro:{
        content:"下个摸牌阶段摸牌数-1",
    },
    filter:function(event){
        return event.num>0;
    },
    content:function(){
        trigger.num--;
        player.removeSkill('ye_shoushan');
    },
            },
			"ye_juji":{
			 audio:"ext:叶原之夜/audio/skill:1",
                enable:"phaseUse",
    usable:1,
    position:"hes",
    filterCard:true,
    selectCard:[1,3],
				check:function(card){
        return 7-get.value(card)
    },
				filterTarget:function(card,player,target){
        return !target.inRange(player)&&player!=target;
    },
                content:function (){
					if(cards.length==1){
						target.damage();
						event.finish();
					}
					if(cards.length==2){
						target.damage();
						player.draw();
						event.finish();
					}
					if(cards.length==3){
						target.damage();
						player.draw();
						target.addSkill('ye_shoushan');
						event.finish();
					}
					event.finish();
},
ai:{
        order:7,
        result:{
            target:function(player,target){
return get.damageEffect(target,player);
},
        },
    },

            },
            "ye_yinbi":{
				unique:true,
				group:["ye_yinbi_1","ye_yinbi_2"],
                subSkill:{
                    "1":{
						unique:true,
                        trigger:{
        player:"phaseBegin",
    },
                        forced:true,
                        content:function() {
							var num=player.countMark('ye_yinbi');
                    if(num!=0){
                        player.addMark('ye_yinbi',-num,false);
						player.draw(num);
                    }
            },
                        sub:true,
                    },
					"2":{
						unique:true,
                        trigger:{
        player:"damageEnd",
    },
                        forced:true,
                        content:function() {
                player.addMark('ye_yinbi',1,false);
            },
                        sub:true,
                    },
				},
				mod:{
        globalTo:function(from,to,distance){
            if(typeof to.storage.ye_yinbi=='number'){
                return distance+to.storage.ye_yinbi;
            }
        },
    },
				mark:true,
    intro:{
        content:function(storage){
			if(storage<0){
                return '其他角色计算与你的距离时'+storage;
            }
            if(storage>0){
                return '其他角色计算与你的距离时+'+storage;
            }
            else{
                return '无距离变化';
            }
        },
    },
    init:function(player){
        if(typeof player.storage.ye_yinbi!='number') player.storage.ye_yinbi=1;
    },
				filter:function (event, player) {
        return player.countCards('he');
    },
                trigger:{
        player:"phaseUseBegin",
    },
    direct:true,
                content:function (){
                'step 0'
        player.chooseToDiscard(get.prompt2('ye_yinbi'), [1], 'he', function (card) {
            return true;
        }).set('ai', function (card) {
            return 6 - get.value(card);
        }).logSkill = 'ye_yinbi';
        'step 1'
        if (result.bool) {
        player.$damagepop(result.cards.length,'unknownx');
        player.storage.ye_yinbi+=result.cards.length;
        player.markSkill('ye_yinbi');
        game.addVideo('storage',player,['ye_yinbi',player.storage.ye_yinbi]);
        }
        else event.finish();
},
            },
            "ye_siji":{
                usable:1,
                trigger:{
                    global:["recoverBefore","dyingBefore"],
                },
                forced:true,
                unique:true,
                content:function (){
                player.draw()
},
            },
            "ye_bianyi":{
                nobracket:true,
                trigger:{
                    global:"die",
                },
                frequent:true,
                filter:function(event,player){
        return !player.storageye_bianyi||!player.storage.ye_bianyi.contains(event.player);
    },
                content:function(){
        'step 0'
        if(!player.storage.ye_bianyi) player.storage.ye_bianyi=[];
        player.storage.ye_bianyi.add(trigger.player);
        player.storage.ye_bianyi.sortBySeat();
        player.markSkill('ye_bianyi');
        player.gainMaxHp(2);
        var list=[];
        if(!player.hasSkill('dbquedi')){
            list.push('dbquedi');
        }
        if(!player.hasSkill('ye_huixing')){
            list.push('ye_huixing');
        }
        if(list.length){
            player.draw();
            event.list=list;
        }
        else{
            player.draw(2);
            event.finish();
        }
        'step 1'
        if(event.list.length==1) event._result={control:event.list[0]};
        else player.chooseControl(event.list).set('prompt','变异：选择获得下列技能中的一个').set('ai',function(){
            if(event.list.contains('xindangxian')) return 'xindangxian';
            return 0;
        });
        'step 2'
        player.addSkill(result.control);
        player.popup(result.control);
        game.log(player,'获得了技能','#g【'+get.translation(result.control)+'】');
    },
                ai:{
                    threaten:1.3,
                },
                intro:{
                    content:"已因$发动过技能",
                },
                derivation:["dbquedi","ye_huixing"],
            },
            "ye_fuhuai":{
                nobracket:true,
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                content:function(){
        player.loseHp()
        player.draw();
        player.gainMaxHp();
    },
            },
            "ye_huixing":{
                mod:{
                    maxHandcardBase:function(player,num){
            return player.maxHp;
        },
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return num+1;
        },
                },
            },
            "ye_fusheng":{
                nobracket:true,
                trigger:{
                    player:["dyingBefore"],
                },
                frequent:true,
                content:function(){
        player.loseMaxHp(2)
        player.draw(2);
        if(player.hp<3){
            player.recover(1-player.hp);
        }
    },
            },
            "ye_paohuo":{
                nobracket:true,
                enable:"phaseUse",
                usable:1,
                selectCard:1,
                filterTarget:function(card,player,target){
        return player!=target;
    },
                check:function(card){
        return 10-get.value(card);
    },
                content:function(){
        "step 0"
        target.damage('fire',1);
        if(get.is.altered('duanyi')){
            event.finish();
        }
        "step 1"
        player.chooseToDiscard('hes',target.maxHp-target.hp,true);
    },
                ai:{
                    expose:1,
                    damage:true,
                    threaten:1.5,
                    order:1,
                    result:{
                        target:function(player,target){
                if(target.Hp<=3) return -3;
                return -2;
            },
                    },
                },
            },
            "ye_hongming0":{
                trigger:{
                    global:"damageAfter",
                },
                forced:true,
                popup:false,
                content:function(){
        'step 0'
        if(player.storage.ye_hongming0&&player.storage.ye_hongming0.length){
            var target=player.storage.ye_hongming0.shift();
            player.line(target,'fire');
            target.damage('fire');
            event.redo();
        }
        'step 1'
        delete player.ye_hongming0;
        player.removeSkill('ye_hongming0');
    },
            },
            "ye_hongming":{
                nobracket:true,
                trigger:{
                    source:"damageBegin",
                },
                skillAnimation:true,
                animationColor:"fire",
                filter:function(event,player){
        return !player.storage.ye_hongming&&event.nature=='fire';
    },
                intro:{
                    content:"limited",
                },
                mark:true,
                logTarget:"player",
                init:function(player){
        player.storage.ye_hongming=false;
    },
                check:function(event,player){
        if(get.attitude(player,event.player)>=0) return 0;
        if(player.hasUnknown()) return 0;
        var num=0,players=game.filterPlayer();
        for(var i=0;i<players.length;i++){
            if(players[i]!=player&&
                players[i]!=event.player&&
                get.distance(event.player,players[i])<=1){
                var eff=get.damageEffect(players[i],player,player,'fire');
                if(eff>0){
                    num++;
                }
                else if(eff<0){
                    num--;
                }
            }
        }
        return num>0;
    },
                content:function(){
        trigger.num++;
        player.addSkill('ye_hongming0');
        player.storage.ye_hongming=true;
        player.awakenSkill('ye_hongming');
        player.storage.ye_hongming0=[];
        var players=game.filterPlayer();
        for(var i=0;i<players.length;i++){
            if(players[i]!=player&&
                players[i]!=trigger.player&&
                get.distance(trigger.player,players[i])<=3){
                player.storage.ye_hongming0.push(players[i]);
            }
        }
        player.storage.ye_hongming0.sort(lib.sort.seat);
    },
                ai:{
                    result:{
                        player:function(player){

　　return 1;

　　},
                    },
                },
            },
            "ye_gaoge":{
                priority:1,
                nobracket:true,
                filter:function(event,player){
        return event.nature=='fire';
    },
                trigger:{
                    global:["damageAfter"],
                },
                forced:true,
                unique:true,
                content:function (){
                player.draw()
},
            },
            "ye_qiyue":{
                trigger:{
                    global:"phaseJieshuBegin",
                },
                direct:true,
                filter:function(event,player){
        return player!=event.player&&event.player.getHistory('sourceDamage').length>0&&event.player.isIn()&&(player.countCards('h')>0||player.canUse('guohe',event.player));
    },
                content:function(){
        'step 0'
        var target=trigger.player;
        var choiceList=['将一张牌当做【冰杀】对其使用','视为对其使用一张【过河拆桥】'];
        var bool=false,hs=player.getCards('he');
        for(var i of hs){
            if(game.checkMod(i,player,'unchanged','cardEnabled2',player)!==false&&player.canUse(get.autoViewAs({name:'sha',nature:'ice'},[i]),target,false)){
                bool=true;
                break;
            }
        }
        var choices=[];
        if(bool) choices.push('选项一');
        else choiceList[0]='<span style="opacity:0.5">'+choiceList[0]+'</span>';
        if(player.canUse('guohe',target)) choices.push('选项二');
        else choiceList[1]='<span style="opacity:0.5">'+choiceList[1]+'</span>';
        choices.push('cancel2');
        player.chooseControl(choices).set('choiceList',choiceList).set('prompt',get.prompt('ye_qiyue',target)).set('ai',function(){
            var choices=_status.event.controls;
            var eff1=0,eff2=0;
            var player=_status.event.player,target=_status.event.getTrigger().player;
            if(choices.contains('选项一')) eff1=get.effect(target,{name:'sha',nature:'ice'},player,player);
            if(choices.contains('选项二')) eff2=get.effect(target,{name:'guohe'},player,player);
            if(eff1>0&&(player.hasSkill('xsqianxin')&&player.isDamaged()||eff1>eff2)) return '选项一';
            if(eff2>0) return '选项二';
            return 'cancel2';
        });
        'step 1'
        if(result.control!='cancel2'){
            if(result.control=='选项一'){
                player.chooseCard('he',true,function(card,player){
                    if(!game.checkMod(card,player,'unchanged','cardEnabled2',player)) return false;
                    return player.canUse(get.autoViewAs({name:'sha',nature:'ice'},[card]),_status.event.getTrigger().player,false);
                },'选择一张牌当做【冰杀】对'+get.translation(trigger.player)+'使用').set('ai',function(card){
                    var player=_status.event.player;
                    return get.effect(_status.event.getTrigger().player,get.autoViewAs({name:'sha',nature:'ice'}[card]),player,player)/Math.max(1,get.value(card));
                });
            }
            else{
                player.useCard({name:'guohe',isCard:true},trigger.player,'ye_qiyue');
                event.finish();
            }
        }
        else event.finish();
        'step 2'
        if(result.bool){
            player.useCard({name:'sha',nature:'ice'},result.cards,'ye_qiyue',trigger.player,false);
        }
    },
            },
            "ye_yinguo":{
                trigger:{
                    player:"damageEnd",
                    source:"damageEnd",
                },
                priority:1,
                forced:true,
                content:function (){
        player.gainMaxHp(true)
    },
	  group:["ye_yinguo_1"],
                subSkill:{
                    1:{
                        trigger:{
        player:"damageEnd",
    },
	intro:{
        content:"已因$发动过技能",
    },
    filter:function(event,player){
		if(!event.source) return false;
        return !player.storage.ye_yinguo_1||!player.storage.ye_yinguo_1.contains(event.source);
    },
    content:function(){
		if(!player.storage.ye_yinguo_1) player.storage.ye_yinguo_1=[];
player.storage.ye_yinguo_1.add(trigger.source);
player.storage.ye_yinguo_1.sortBySeat();
player.markSkill('ye_yinguo_1');
        player.recover();
    },
    forced:true,
    charlotte:true,
    priority:2009,
    init:function(player,skill){
        if(!player.storage[skill]) player.storage[skill]=[];
    },
    intro:{
        content:"已对$发动过",
    },
    "_priority":200900,
                        sub:true,
                    },
                },
           
            },
            "ye_yuanhuan":{
				trigger:{
        global:"phaseJieshuBegin",
    },
	filter:function(event,player){
        return player.getDamagedHp()>=3&&event.player.isDamaged();
    },
	prompt:function (event,player){
      return '〖圆环〗：是否失去2点体力上限并令'+get.translation(event.player)+'回复一点体力并摸一张牌？';
    },
	check:function (event,player){
        if(get.attitude(player,event.player)>0) return 1;
        return 0;
    },
                content:function(){
        player.loseMaxHp(2)
        trigger.player.recover();
        trigger.player.draw()
    },
            },
            "ye_kongfu":{
                group:["ye_kongfu_qip","ye_kongfu_end"],
                trigger:{
                    player:"phaseDrawBegin2",
                },
                forced:true,
                content:function() {
        trigger.num--;
    },
                subSkill:{
                    qip:{
                        trigger:{
                            player:"phaseDiscardBefore",
                        },
                        forced:true,
                        filter:function(event, player) {
                return true;
            },
                        content:function() {
                trigger.cancel();
            },
                        sub:true,
                    },
                    end:{
                        trigger:{
                            player:"phaseJieshuBegin",
                        },
                        forced:true,
                        content:function() {
                player.draw();
				if(player.countCards("h")<player.maxHp&&player.getDamagedHp()>0) player.draw(player.getDamagedHp());
            },
                        sub:true,
                    },
                },
            },
            "ye_kaiyan":{
                zhuSkill:true,
				unique:true,
                filter:(event, player) => {
        if (event.card.name != 'taoyuan'&&event.card.name != 'tao') return false;
        if (!player.hasZhuSkill('ye_kaiyan')) return false;
        return player.countCards('h') > 1 && game.hasPlayer((target) => {
            return target != player 
        })
    },
                trigger:{
                    player:["useCard"],
                },
				direct:true,
                content:() => {
        'step 0'
					player.chooseCard('hes',2,'〖开宴〗:是否将两张牌交给一名其他角色，然后你摸一张牌').set('ai', function(card) {
            if (ui.selected.cards.length > 1) return 0;
            if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
            if (!ui.selected.cards.length && card.name == 'du') return 20;
            if (player.hp == player.maxHp || num > 1 || player.countCards('h') <= 1) {
                if (ui.selected.cards.length) {
                    return -1;
                }
                var players = game.filterPlayer();
                for (var i = 0; i < players.length; i++) {
                    if (players[i].hasSkill('haoshi') &&
                        !players[i].isTurnedOver() &&
                        !players[i].hasJudge('lebu') &&
                        get.attitude(player, players[i]) >= 3 &&
                        get.attitude(players[i], player) >= 3) {
                        return 11 - get.value(card);
                    }
                }
                if (player.countCards('h') > player.hp) return 10 - get.value(card);
                if (player.countCards('h') > 2) return 6 - get.value(card);
                return -1;
            }
            return 10 - get.value(card);
        })
        'step 1'
		if (result.bool) {
            event.cards = result.cards
        player.chooseTarget(1, '选择一位目标角色', (card, player, target) => {
            return player != target;
        }).set('ai', (target) => {
            return get.attitude(player, target) > 0
        })
        }
        'step 2'
        if (result.bool) {
            result.targets[0].gain(event.cards, player, 'giveAuto');
            player.draw();
        }
    },
                ai:{
                    order:function(skill, player) {
            if (player.hp < player.maxHp && player.storage.rende < 2 && player.countCards('h') > 1) {
                return 10;
            }
            return 1;
        },
                    result:{
                        target:function(player, target) {
                if (target.hasSkillTag('nogain')) return 0;
                if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                    if (target.hasSkillTag('nodu')) return 0;
                    return -10;
                }
                if (target.hasJudge('lebu')) return 0;
                var nh = target.countCards('h');
                var np = player.countCards('h');
                if (player.hp == player.maxHp || player.storage.rende < 0 || player.countCards('h') <= 1) {
                    if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
                }
                return Math.max(1, 5 - nh);
            },
                    },
                    effect:{
                        target:function(card, player, target) {
                if (player == target && get.type(card) == 'equip') {
                    if (player.countCards('e', {
                            subtype: get.subtype(card)
                        })) {
                        var players = game.filterPlayer();
                        for (var i = 0; i < players.length; i++) {
                            if (players[i] != player && get.attitude(player, players[i]) > 0) {
                                return 0;
                            }
                        }
                    }
                }
            },
                    },
                    threaten:0.8,
                },
            },
            "ye_juhe":{
                group:["ye_juhe_1","ye_juhe_3","ye_juhe_4"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"shaBegin",
                        },
                        forced:true,
                        filter:function (event,player){
                if(event.directHit) return false;
    return player.countCards('e')>=event.target.countCards('e');
            },
                        priority:-1,
                        content:function (){
                if(typeof trigger.shanRequired=='number'){
                    trigger.shanRequired++;
                }
                else{
                    trigger.shanRequired=2;
                }
            },
                        sub:true,
                    },
                    "3":{
                        trigger:{
                            player:"shaAfter",
                        },
                        priority:-10,
                        usable:1,
                        check:function (event,player){
                return get.damageEffect(event.target,player,player)>0;
            },
                        filter:function (event,player){
                return event.card&&event.target.isAlive();
            },
                        content:function (){
              trigger.effectCount++;
            },
                        sub:true,
                    },
                    "4":{
                        ai:{
                            unequip:true,
                            skillTagFilter:function (player,tag,arg){
                    if(arg&&arg.name=='sha') return true;
                    return false;
                },
                        },
                        sub:true,
                    },
                },
                ai:{
                    result:{
                        target:function (card,player,target){
                if(card.name=='sha'&&target.num('h')>0) return [1,0,0,-1];               
            },
                    },
                },
            },
            "ye_jiangqi":{
                marktext:"气",
                intro:{
                    name:"剑气",
                    content:function (storage){
			 return '当你使用实体【杀】结算结束后，你可以摸'+Math.ceil(storage/2)+'张牌';
		}
                },
				trigger:{
                            player:"useCardAfter",
                        },
                        frequent:true,
                        filter:function(event, player) {
                return event.card && event.card.name == 'sha' &&player.hasMark('ye_jiangqi');;
            },
                        check:function(event,player){
        return true;
    },
                        content:function() {
                        var num1=player.countMark('ye_jiangqi');
                player.draw(Math.ceil(num1/2));
            },
                markimage:"extension/叶原之夜/image/mark/@qi.png",
                group:["ye_jiangqi_1"],
                subSkill:{
                    "1":{
                        trigger:{
                            source:"dieAfter",
                        },
                        forced:true,
                        content:function() {
                player.addMark('ye_jiangqi',1,false);
            },
                        sub:true,
                    },
                },
            },
            "ye_luoshuitianyi":{
                nobracket:true,
                frequent:true,
                trigger:{
                    player:"phaseBegin",
                },
                content:function (){
        'step 0'
					event.forceDie=true;
var list=['中华食谱颂','英雄出征','操戈天下','权御天下','cancel2'];
player.chooseControl(list).set('ai',function(){
var player=_status.event.player;
var list=[
player.getUseValue({name:'taoyuan'}),
game.filterPlayer().reduce((sum,target)=>sum+get.effect(target,{name:'losehp'},player,player),0),
player.getUseValue({name:'wugu'}),
-1,
0,
];
var num=list.slice().sort((a,b)=>b-a)[0];
return _status.event.controls[list.indexOf(num)];
}).set('prompt',get.prompt2('ye_luoshuitianyi'));
        "step 1"
		if(result.control!='cancel2'){
if(result.control=='中华食谱颂'){
            for(var i=0;i<game.players.length;i++){
                ui.backgroundMusic.src=lib.assetURL+'extension/叶原之夜/audio/huan_zhonghuashipusong.mp3'; 
                game.players[i].recover();
            };
        };
        if(result.control=='英雄出征'){
            for(var i=0;i<game.players.length;i++){
                ui.backgroundMusic.src=lib.assetURL+'extension/叶原之夜/audio/huan_yingxiongchuzheng.mp3'; 
                game.players[i].loseHp();//.set('source',player);
            };
        };
        if(result.control=='操戈天下'){
            for(var i=0;i<game.players.length;i++){
                ui.backgroundMusic.src=lib.assetURL+'extension/叶原之夜/audio/huan_caogetianxia.mp3'; 
                game.players[i].draw(2);
            };
        };
        if(result.control=='权御天下'){
            for(var i=0;i<game.players.length;i++){
                ui.backgroundMusic.src=lib.assetURL+'extension/叶原之夜/audio/huan_quanyutianxia.mp3'; 
                game.players[i].chooseToDiscard(2,true,"he");
            };
        };
}
else event.finish();
	"step 2"
game.delayx();
        },
            },
            "ye_shanliangdengchang":{
                nobracket:true,
                trigger:{
                    global:"gameStart",
                },
                frequent:true,
                content:function (){ 
    ui.background.setBackgroundImage('extension/叶原之夜/image/Background/huan_luotianyi.jpg');
    },
            },
"DALF_jizai":{
	mark:true,
	marktext:"记",
	intro:{
		name:"记载",
		content:function (storage){
			if(storage) return '其他角色摸牌阶段结束时，你可以令其摸两张牌，然后观看其手牌，将其中一张牌置底，再获得其中另一张牌。';
			return '其他角色摸牌阶段结束时，你可以交给其一张手牌并令其摸一张牌，然后观看其手牌，将其中两张牌置底。';
		}
	},
	zhuanhuanji:true,
    trigger:{
        global:"phaseDrawEnd",
    },
    direct:true,
    filter:function (event,player){
        return event.player!=player&&(player.countCards('h')||player.storage['DALF_jizai']);
    },
    checkx:function (event,player){
        return get.attitude(player,event.player);
    },
    content:function (){
        "step 0"
		if(player.storage['DALF_jizai']){
			var next=player.chooseBool(get.prompt2('DALF_jizai'));
			next.set('ai',function(){
				return true;
			});
			event.isYang=true;
		}else{
			var next=player.chooseCard(get.prompt2('DALF_jizai'),'h');
			next.set('ai',function(card){
				if(_status.event.att>0){
					return get.value(card,_status.event.target)
						-get.value(card,_status.event.player);
				}
				return 5-get.value(card);
			});
			next.set('target',trigger.player);
			next.set('att',player.attitudeTo(trigger.player));
		}
		"step 1"
		if(result.bool){
			player.logSkill('DALF_jizai',trigger.player);
			player.changeZhuanhuanji('DALF_jizai');
			if(event.isYang){
				trigger.player.draw(2);
			}else{
				trigger.player.gain(result.cards,player,'giveAuto');
				trigger.player.draw();
			}
		}else event.finish();
		"step 2"
		var hs=trigger.player.countCards('h');
		if(hs>0){
			hs=Math.min(hs,2);
			var next=player.choosePlayerCard(trigger.player,'h',true,'visible');
			var tip='记载：将'+get.translation(trigger.player)+'的';
			if(!event.isYang){
				next.set('selectButton',Math.min(hs,2));
				tip+=get.cnNumber(hs)+'张手牌至于牌堆底';
				if(hs>1) tip+='（先选择的在上）';
			}else{
				tip+='一张手牌至于牌堆底';
				if(trigger.player.countGainableCards(player,'h')>0){
					next.set('selectButton',Math.min(hs,2));
					tip+='，再获得其一张牌';
				}
			}
			next.set('prompt',tip);
			next.set('filterButton',function(button){
				if(!ui.selected.buttons.length&&_status.event.isYang){
					return lib.filter.canBeGained(
						button.link,
						_status.event.target,
						_status.event.player
					);
				}
				return true;
			});
			next.set('ai',function(button){
				if(_status.event.att>0){
					return 10-get.value(button.link,_status.event.target);
				}
				return get.value(button.link,_status.event.player);
			});
			next.set('att',player.attitudeTo(trigger.player));
			next.set('isYang',event.isYang);
			next.set('target',trigger.player);
		}else event._result={bool:false};
		"step 3"
		if(result.bool){
			event.cards=result.links.slice(0);
			if(event.isYang) event.gain=[event.cards.pop()];
			trigger.player.lose(event.cards,ui.special);
			var cardxs=[];
            var cardx=ui.create.card();
            cardx.classList.add('infohidden');
            cardx.classList.add('infoflip');
			for(let i=0;i<event.cards.length;i++){
				cardxs.push(cardx);
			}
            trigger.player.$throw(cardxs,1000,'nobroadcast');
			game.log(trigger.player,'的'+get.cnNumber(event.cards.length)+'张牌被放到了牌堆底');
		}else event.finish();
		"step 4"
		if(cards.length){
			var onCard=cards.shift();
			onCard.fix();
			ui.cardPile.appendChild(onCard,ui.cardPile.firstChild);
            event.redo();
			/*ai记忆->*/
			if(!player.storage['DALF_niegao_aiMemory']){
				player.storage['DALF_niegao_aiMemory']=[];
			}
			player.storage['DALF_niegao_aiMemory'].push(get.name(onCard));
			if(player.storage['DALF_niegao_aiMemory'].length>6){
				player.storage['DALF_niegao_aiMemory'].shift();
			}
			/*<-ai记忆*/
        }
		"step 5"
		if(event.isYang){
			player.gain(event.gain,trigger.player,'giveAuto');
		}
    },
},
            "DALF_niegao":{
	enable:"phaseUse",
	filter:function (event,player){
		return !player.hasSkill('DALF_niegao_off');
	},
	chooseButton:{
		dialog:function (event,player){
			var map={};
			for(var i=0;i<lib.inpile.length;i++){
				var typex=get.type2(lib.inpile[i]);
				if(!map[typex]) map[typex]=[];
				map[typex].push([typex,'',lib.inpile[i]]);
			}
			var dialog=ui.create.dialog('嗫告','hidden');
			for(var j in map){
				dialog.addText(get.translation(j));
				dialog.add([map[j],'vcard']);
			}
			//dialog.add([map['trick'],'vcard']);
			return dialog;
		},
		filter:function (button){
			var storage=_status.event.player.storage['DALF_niegao_declare'];
			if(storage){
				var type=storage[button.link[0]]||0;
				return type<2;
			}
			return true;
		},
		check:function (button){
			var player=_status.event.player;
			var storage=player.storage['DALF_niegao_aiMemory'];
			if(storage&&storage.length){
				return button.link[2]==storage[storage.length-1];
			}
			if(!get.is.instantCard(button.link[2])) return -1;
			return player.getUseValue({name:button.link[2]},true,true)+(Math.random()*5);
		},
		backup:function (links,player){
			return {
				audio:"DALF_niegao",
				filterCard:function (){return false},
				selectCard:-1,
				card:links[0],
				delay:false,
				content:function (){
					"step 0"
					player.addTempSkill('DALF_niegao_declareCount');
					event.cardName2=lib.skill['DALF_niegao_backup'].card[2];
					var type=lib.skill['DALF_niegao_backup'].card[0];
					if(!player.storage['DALF_niegao_declare'][type]){
						player.storage['DALF_niegao_declare'][type]=1;
					}else{
						player.storage['DALF_niegao_declare'][type]++;
					}
					event.card=get.bottomCards()[0];
					game.cardsGotoOrdering(event.card);
					if(get.type(event.card)==type&&get.is.instantCard(event.cardName2)){
						event.canViewasUse=true;
						if(player.storage['DALF_niegao_aiMemory']){
							player.storage['DALF_niegao_aiMemory'].pop();
						}
					}else{
						delete player.storage['DALF_niegao_aiMemory'];
					}
					game.log(player,'声明了','#y【'+get.translation(event.cardName2)+'】');
					player.showCards('嗫告：牌堆底的牌',event.card);
					"step 1"
					if(get.name(event.card)!=event.cardName2){
						player.addTempSkill('DALF_niegao_off','phaseUseAfter');
						event.goto(4);
					}else{
						var next=player.chooseTarget('嗫告：令一名角色获得'+get.translation(event.card),true);
						next.set('ai',function(target){
							if(_status.event.player.attitudeTo(target)<=0) return 0;
							return Math.max(
								get.value(_status.event.card,target),
								target.getUseValue(_status.event.card,true,true)
							);
						});
						next.set('card',event.card);
					}
					"step 2"
					if(result.bool){
						event.target=result.targets[0];
						player.line(event.target,'green');
						event.target.gain(event.card,player,'give');
					}else event.goto(4);
					"step 3"
					if(event.target.hasUseTarget(event.card,true,true)&&
						get.owner(event.card)==event.target){
						event.target.chooseToUse({
							filterCard:function (cardx,player,target){
								return cardx==_status.event.cardx;
							},
							prompt:'嗫告：是否使用'+get.translation(event.card)+'？',
							cardx:event.card
						});
					}
					"step 4"
					if(event.canViewasUse&&
						player.hasUseTarget({name:event.cardName2},true,true)){
						player.chooseUseTarget({name:event.cardName2},'嗫告：你可以视为使用【'+get.translation(event.cardName2)+'】').set('addCount',false);
					}
				},
				ai:{
					order:10,
					result:{
						player:1
					}
				}
			};
		}
	},
    ai:{
        order:1,
        result:{
            player:1
        }
    },
	subSkill:{
		declareCount:{
			init:function (player){
				player.storage['DALF_niegao_declare']={};
			},
			onremove:function (player){
				player.storage['DALF_niegao_declare']={};
			},
			sub:true
		},
		off:{sub:true}
	}
},
            "ye_bukeshizhishou":{
                nobracket:true,
                usable:1,
                enable:"phaseUse",
                content:function(){ 
    player.loseHp();
        
    "step 1"
     player.draw();
     player.chooseUseTarget('###视为使用一张无距离限制的【顺手牵羊】',{name:'shunshou'},false,'nodistance');
  
     "step 2"
 
  player.chooseUseTarget('###视为使用一张无距离限制的【顺手牵羊】',{name:'shunshou'},false,'nodistance');
        
               
    },
                mod:{
                    targetInRange:function(card,player,target){
            if(card.name=='shunshou'){
       if(target.countCards('h')>=player.countCards('h')) return true;
            }
        },
                },
                ai:{
                    maihp:true,
                    basic:{
                        order:99,
                    },
                    result:{
                        player:function(player,target){
                if(player.hp>1) return 2;
                return 0;
            },
                    },
                },
            },
            "ye_baizhao":{
                trigger:{
                    player:["useCard","respond"],
                },
                forced:true,
                content:function(){
        "step 1"
        player.say( ["暴龙振翅飞翔！","笨驴踢腿！","仓鼠上车轮！","豺狼捕兔！","超行星燃烧！","打虎式！","大象拳！","大象踢腿！","袋鼠跳！","地震拳！","电眼逼人！","饿狼前进！","二龙戏珠！","飞鹤捕虾！","飞龙在天！","飞天陲！","飞天猴巧夺宝盒！","飞象踩老鼠！","飞鹰展翅！","愤怒的章鱼！","凤凰奔月！","弗拉明戈舞步！","黑虎捕食困小羊！","黑虎掠过秃鹰！","黑虎掏心！","轰雷拳！","猴子爬树！","虎落鹰背！","虎爪吃布丁！","火山烧农场！","鲸鱼摆尾！","巨斧砍大树！","飓风踢！","老鼠偷奶酪！","老鼠走迷宫！","老鹰展翅！","莲花飘！","镰刀扫地！","猎豹飞奔！","羚羊飞跃！","羚羊起跳！","流星毁灭！","流星连打山！","龙卷风摧毁停车场！","龙虾爪！","龙抓手！","骡子踢腿！","螺丝卷！","马尾拍苍蝇！","猫抖水！","猫落地！","猫转身！","牡蛎壳！","脑袋砸核桃！","怒鸦飞行！","怒鸦起飞！","劈山掌！","泼猴发功！","青鱼绝杀！","扫堂腿！","鲨鱼吃鱼！","鲨鱼吞饵！","山羊爬山！","蛇拳出动！","蛇形步！","狮子拜天！","树獭踢腿！","双风贯耳！","水牛打老鼠！","睡熊猛醒！","碎瓜拳！","泰山压顶！","螳螂拳！","腾空飞脚！","土拨鼠掷鼬鼠！","兔子拳！","顽猴神功！","螳螂神拳！","狡兔出击！","我成了瘸腿鹅！","乌龟拳！","犀牛狂奔！","小行星带！","小鱼水中游！","蝎子掌！","猩猩折枝！","熊掌出击！","熊捉鲑鱼！","眼镜蛇！","鹞鹰落地！","一虎杀两羊！","鹰爪功！","长臂在天！","蜘蛛吃苍蝇！"].randomGet() ); 
        "step 2"
    player.draw();
					player.chooseToDiscard('he',1,true).set('ai',function(card){
    return 9999-get.value(card);
    })
    },
                intro:{
                    content:"card",
                },
            },
            "ye_wuyazuofeiji":{
                 nobracket:true,
                audio:"ext:叶原之夜:1",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                filter:function(event,player){
     return player.countCards('h')==0;
 },
                frequent:true,
                content:function(){

        
        player.draw(4);
    },
            },
            "SE_xuanlan":{
                trigger:{
                    player:"phaseDiscardBefore",
                },
                priority:10,
                forced:true,
                filter:function(event,player){
        return player.hp==player.maxHp;
    },
                content:function(){
        trigger.untrigger();
        trigger.finish();
    },
            },
            "SE_caiyu":{
                trigger:{
                    global:"phaseEnd",
                },
                priority:10,
                unique:true,
                filter:function(event,player){
        if(player.storage.SE_huaxiang&&player.storage.SE_huaxiang.length>=4) return true;
        return false;
    },
                content:function(){
        "step 0"
        var cards=[];
           for(var i=0;i<player.storage.SE_huaxiang.length;i++){
            cards.push(player.storage.SE_huaxiang[i]);
          }
        player.gain(cards);        
        player.storage.SE_huaxiang=[];
        player.unmarkSkill('SE_huaxiang');
        player.chooseToDiscard(`he`,2,true);
        if(player.maxHp<=1) event.finish();
        "step 1"
        player.chooseBool('〖彩雨〗:是否选择失去1点体力上限？').ai=function(){
            return true;
        }
        "step 2"
        if(result.bool){
            player.loseMaxHp(true);
			player.changeHujia();
        }
        else{
            event.finish();
        }            
    },
            },
            "SE_huaxiang":{
                init:function(player){
        player.storage.SE_huaxiang=[];
    },
                marktext:"虹",
                intro:{
                    content:"cards",
                },
                enable:["chooseToUse","chooseToRespond"],
                position:"hes",
                filter:function(event,player){            
        if(player.storage.SE_huaxiang&&player.storage.SE_huaxiang.length>=4) return false;
        return true;
    },
                check:function(card,event){
        return 7-get.value(card);
    },
                filterCard:function(card){    
        for(var i=0;i<_status.event.player.storage.SE_huaxiang.length;i++){
           if(get.suit(card)==get.suit(_status.event.player.storage.SE_huaxiang[i])) return false;
        }
        return true;        
    },
                prompt:"选择1张花色不同于武将牌上的牌置于你的武将牌上",
                viewAs:{
                    name:"sha",
                },
                ai:{
                    respondSha:true,
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            var base=0,hit=false;
            if(get.cardtag(card,'yingbian_hit')){
                hit=true;
                if(targets.filter(function(target){
                    return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_all')){
                if(game.hasPlayer(function(current){
                    return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_damage')){
                if(targets.filter(function(target){
                    return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                    },true))&&!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })
                })) base+=5;
            }
            return base;
        },
                    canLink:function(player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
            if(player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))){
                if(game.hasPlayer(function(current){
                    return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                })&&game.countPlayer(function(current){
                    return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                })>1) return 3.1;
                return 3;
            }
            return 3.05;
        },
                    result:{
                        player:2,
                        target:function(player,target,card,isLink){
                var eff=function(){
                    if(!isLink&&player.hasSkill('jiu')){
                        if(!target.hasSkillTag('filterDamage',null,{
                            player:player,
                            card:card,
                            jiu:true,
                        })){
                            if(get.attitude(player,target)>0){
                                return -7;
                            }
                            else{
                                return -4;
                            }
                        }
                        return -0.5;
                    }
                    return -1.5;
                }();
                if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                },true)) return eff/1.2;
                return eff;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function(card){
                if(card.nature) return 1;
            },
                        fireDamage:function(card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function(card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function(card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "SE_huaxiang2":{
                enable:["chooseToUse","chooseToRespond"],
                position:"hes",
                filter:function(event,player){            
        if(player.storage.SE_huaxiang&&player.storage.SE_huaxiang.length>=4) return false;
        return true;
    },
                check:function(card,event){
        return 7-get.value(card);
    },
                filterCard:function(card){    
        for(var i=0;i<_status.event.player.storage.SE_huaxiang.length;i++){
           if(get.suit(card)==get.suit(_status.event.player.storage.SE_huaxiang[i])) return false;
        }
        return true;        
    },
                prompt:"选择1张花色不同于武将牌上的牌置于你的武将牌上",
                viewAs:{
                    name:"sha",
                    nature:"fire",
                },
                ai:{
                    respondSha:true,
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            var base=0,hit=false;
            if(get.cardtag(card,'yingbian_hit')){
                hit=true;
                if(targets.filter(function(target){
                    return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_all')){
                if(game.hasPlayer(function(current){
                    return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_damage')){
                if(targets.filter(function(target){
                    return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                    },true))&&!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })
                })) base+=5;
            }
            return base;
        },
                    canLink:function(player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
            if(player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))){
                if(game.hasPlayer(function(current){
                    return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                })&&game.countPlayer(function(current){
                    return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                })>1) return 3.1;
                return 3;
            }
            return 3.05;
        },
                    result:{
                        player:2,
                        target:function(player,target,card,isLink){
                var eff=function(){
                    if(!isLink&&player.hasSkill('jiu')){
                        if(!target.hasSkillTag('filterDamage',null,{
                            player:player,
                            card:card,
                            jiu:true,
                        })){
                            if(get.attitude(player,target)>0){
                                return -7;
                            }
                            else{
                                return -4;
                            }
                        }
                        return -0.5;
                    }
                    return -1.5;
                }();
                if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                },true)) return eff/1.2;
                return eff;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function(card){
                if(card.nature) return 1;
            },
                        fireDamage:function(card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function(card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function(card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "SE_huaxiang3":{
                enable:["chooseToUse","chooseToRespond"],
                position:"hes",
                filter:function(event,player){            
        if(player.storage.SE_huaxiang&&player.storage.SE_huaxiang.length>=4) return false;
        return true;
    },
                check:function(card,event){
        return 7-get.value(card);
    },
                filterCard:function(card){    
        for(var i=0;i<_status.event.player.storage.SE_huaxiang.length;i++){
           if(get.suit(card)==get.suit(_status.event.player.storage.SE_huaxiang[i])) return false;
        }
        return true;        
    },
                prompt:"选择1张花色不同于武将牌上的牌置于你的武将牌上",
                viewAs:{
                    name:"sha",
                    nature:"thunder",
                },
                ai:{
                    respondSha:true,
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            var base=0,hit=false;
            if(get.cardtag(card,'yingbian_hit')){
                hit=true;
                if(targets.filter(function(target){
                    return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_all')){
                if(game.hasPlayer(function(current){
                    return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_damage')){
                if(targets.filter(function(target){
                    return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                    },true))&&!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })
                })) base+=5;
            }
            return base;
        },
                    canLink:function(player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
            if(player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))){
                if(game.hasPlayer(function(current){
                    return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                })&&game.countPlayer(function(current){
                    return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                })>1) return 3.1;
                return 3;
            }
            return 3.05;
        },
                    result:{
                        player:2,
                        target:function(player,target,card,isLink){
                var eff=function(){
                    if(!isLink&&player.hasSkill('jiu')){
                        if(!target.hasSkillTag('filterDamage',null,{
                            player:player,
                            card:card,
                            jiu:true,
                        })){
                            if(get.attitude(player,target)>0){
                                return -7;
                            }
                            else{
                                return -4;
                            }
                        }
                        return -0.5;
                    }
                    return -1.5;
                }();
                if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                },true)) return eff/1.2;
                return eff;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function(card){
                if(card.nature) return 1;
            },
                        fireDamage:function(card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function(card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function(card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "SE_huaxiang4":{
                enable:["chooseToUse","chooseToRespond"],
                position:"hes",
                filter:function(event,player){            
        if(player.storage.SE_huaxiang&&player.storage.SE_huaxiang.length>=4) return false;
        if(player.maxHp>1) return false;
        return true;
    },
                check:function(card,event){
        return 7-get.value(card);
    },
                filterCard:function(card){    
        for(var i=0;i<_status.event.player.storage.SE_huaxiang.length;i++){
           if(get.suit(card)==get.suit(_status.event.player.storage.SE_huaxiang[i])) return false;
        }
        return true;        
    },
                prompt:"选择1张花色不同于武将牌上的牌置于你的武将牌上",
                viewAs:{
                    name:"wuxie",
                },
                ai:{
                    basic:{
                        useful:[6,4,3],
                        value:[6,4,3],
                    },
                    result:{
                        player:1,
                    },
                    expose:0.2,
                },
            },
            "SE_huaxiang5":{
                enable:["chooseToUse","chooseToRespond"],
                position:"hes",
                filter:function(event,player){            
        if(player.storage.SE_huaxiang&&player.storage.SE_huaxiang.length>=4) return false;
        if(player.maxHp>2) return false;
        return true;
    },
                check:function(card,event){
        return 9-get.value(card);
    },
                filterCard:function(card){    
        for(var i=0;i<_status.event.player.storage.SE_huaxiang.length;i++){
           if(get.suit(card)==get.suit(_status.event.player.storage.SE_huaxiang[i])) return false;
        }
        return true;        
    },
                prompt:"选择1张花色不同于武将牌上的牌置于你的武将牌上",
                viewAs:{
                    name:"tao",
                },
                ai:{
                    save:true,
                    basic:{
                        order:function(card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                        useful:[6.5,4,3,2],
                        value:[6.5,4,3,2],
                    },
                    result:{
                        player:2,
                        target:2,
                        "target_use":function(player,target){
                // if(player==target&&player.hp<=0) return 2;
                if(player.hasSkillTag('nokeep',true,null,true)) return 2;
                var nd=player.needsToDiscard();
                var keep=false;
                if(nd<=0){
                    keep=true;
                }
                else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
                    keep=true;
                }
                var mode=get.mode();
                if(target.hp>=2&&keep&&target.hasFriend()){
                    if(target.hp>2||nd==0) return 0;
                    if(target.hp==2){
                        if(game.hasPlayer(function(current){
                            if(target!=current&&get.attitude(target,current)>=3){
                                if(current.hp<=1) return true;
                                if((mode=='identity'||mode=='versus'||mode=='chess')&&current.identity=='zhu'&&current.hp<=2) return true;
                            }
                        })){
                            return 0;
                        }
                    }
                }
                if(target.hp<0&&target!=player&&target.identity!='zhu') return 0;
                var att=get.attitude(player,target);
                if(att<3&&att>=0&&player!=target) return 0;
                var tri=_status.event.getTrigger();
                if(mode=='identity'&&player.identity=='fan'&&target.identity=='fan'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'&&tri.source!=target){
                        var num=game.countPlayer(function(current){
                            if(current.identity=='fan'){
                                return current.countCards('h','tao');
                            }
                        });
                        if(num>1&&player==target) return 2;
                        return 0;
                    }
                }
                if(mode=='identity'&&player.identity=='zhu'&&target.identity=='nei'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='zhong'){
                        return 0;
                    }
                }
                if(mode=='stone'&&target.isMin()&&
                player!=target&&tri&&tri.name=='dying'&&player.side==target.side&&
                tri.source!=target.getEnemy()){
                    return 0;
                }
                return 2;
            },
                    },
                    tag:{
                        recover:1,
                        save:1,
                    },
                },
            },
            "SE_huaxiang6":{
                enable:["chooseToUse","chooseToRespond"],
                position:"hes",
                filter:function(event,player){            
        if(player.storage.SE_huaxiang&&player.storage.SE_huaxiang.length>=4) return false;
        return true;
    },
                check:function(card,event){
        return 8-get.value(card);
    },
                filterCard:function(card){    
            for(var i=0;i<_status.event.player.storage.SE_huaxiang.length;i++){
              if(get.suit(card)==get.suit(_status.event.player.storage.SE_huaxiang[i])) return false;
            }
        return true;        
    },
                prompt:"选择1张花色不同于武将牌上的牌置于你的武将牌上",
                viewAs:{
                    name:"shan",
                },
                ai:{
                    respondShan:true,
                    order:3,
                    basic:{
                        useful:[7,5.1,2],
                        value:[7,5.1,2],
                    },
                    result:{
                        player:2,
                    },
                },
            },
            "SE_huaxiang7":{
                trigger:{
                    player:["useCardToBefore","respond"],
                },
                forced:true,
                popup:false,
                priority:null,
                filter:function(event,player){
        if(event.skill=='SE_huaxiang'||event.skill=='SE_huaxiang2'||event.skill=='SE_huaxiang3'||event.skill=='SE_huaxiang4'||event.skill=='SE_huaxiang5'||event.skill=='SE_huaxiang6'||event.skill=='SE_huaxiang8') return true;
        return false; 
    },
                content:function(){
        var cards=[];
        if(trigger.cards&&trigger.cards.length){
            for(var i=0;i<trigger.cards.length;i++){
                if(get.position(trigger.cards[i])=='d'){
                    cards.push(trigger.cards[i]);
                    trigger.cards.remove(trigger.cards[i]);
                }
            }
        }            
        player.lose(cards,ui.special)._triggered=null;
        player.$gain2(cards);
        player.markSkill('SE_huaxiang');
        player.storage.SE_huaxiang=player.storage.SE_huaxiang.concat(cards);
        player.syncStorage('SE_huaxiang');
    },
                group:["SE_huaxiang2","SE_huaxiang3","SE_huaxiang4","SE_huaxiang5","SE_huaxiang6","SE_huaxiang","SE_huaxiang8"],
            },
            "SE_zhouye":{
                markimage:"extension/叶原之夜/image/mark/@ye.png",
                locked:true,
                marktext:"夜",
                intro:{
                    content:"mark",
                },
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                content:function(){    
        "step 0"
        player.removeMark('SE_zhouye',1);
        "step 1"
        event.cards=get.cards();
        player.showCards(event.cards);
        game.delay();
        "step 2"
        if(get.color(event.cards)=='black'){
			player.addMark('SE_zhouye',1,false);
        }
        for(var i=0;i<cards.length;i++){
                ui.discardPile.appendChild(cards[i]);
                game.log(player,'将',cards[i],'置入了弃牌堆');
            }    
    },
                group:["SE_zhouye2"],
            },
            "SE_hongwu":{
                enable:"phaseUse",
                filterCard:function(card){
        return get.color(card)=='red';
    },
                selectCard:1,
                position:"he",
                filter:function(event,player){
        return !player.storage.SE_zhouye||player.storage.SE_zhouye<=0;
    },
                unique:true,
                content:function(){    
player.addMark('SE_zhouye',1,false);
    },
                ai:{
                    order:9,
                    result:{
                        player:function(player,target){
                return 4;
            },
                    },
                },
            },
            "SE_shenqiang":{
				usable:2,
                enable:"phaseUse",
                filterCard:function(card){
        return get.suit(card)=='heart'||get.subtype(card)=='equip1';
    },
                filterTarget:function(card,player,target){
        return player!=target;
    },
                selectCard:1,
                position:"he",
                filter:function(event,player){
        return player.storage.SE_zhouye>0;
    },
                content:function(){    
        target.damage();
    },
                ai:{
					threaten: 1.2,
                    order:9,
                    expose:1,
                    damage:true,
                    result:{
                        target:function(player,target){
                if(target.Hp<=2) return -3;
                return -2;
            },
                    },
                },
            },
            "SE_yewang":{
				unique:true,
                trigger:{
                    global:"useCardAfter",
                },
                direct:true,
				filter:function (event, player) {
        if (event.targets.length != 1) return false
        
        if (!event.targets.contains(player) && event.player != player) return false
        if (event.player == player && event.targets.contains(player)) return false
        return player.storage.SE_zhouye>0
    },
                content:function () {
        'step 0'
        var p, t
        var b1, b2
        var att = 0
        if (player == trigger.player) {
            p = player
            t = trigger.targets[0]
            
        } else {
            p = player
            t = trigger.player
        }
        
        if (trigger.player&&trigger.targets[0]&&trigger.targets[0].isAlive()&&lib.filter.targetEnabled({name:trigger.card.name,nature:trigger.card.nature},player,trigger.targets[0])&&player == trigger.player&&get.type(trigger.card)!='delay'&&get.type(trigger.card)!='equip'&& !player.hasSkill('SE_yewang_1')) {
            b1 = true
        }
        if (trigger.player&&trigger.targets[0]&&t.countCards('he') && player != trigger.player &&! player.hasSkill('SE_yewang_2')) {
            b2 = true
        }
        att = get.attitude(p, t)
        event.b1 = b1
        event.b2 = b2
        event.p = p
        event.t = t
        if (b1) {
            player.chooseBool('是否令' + get.translation(trigger.card) + '额外结算一次？').set('ai', function () {
                return get.effect(t, { name:trigger.card.name,nature:trigger.card.nature}, p, p)
            })
        } else {
            event.goto(2)
        }
        'step 1'
        
        if (result.bool) {
          { player.addTempSkill('SE_yewang_1',['phaseZhunbeiAfter','phaseJudgeAfter','phaseDrawAfter','phaseUseAfter','phaseDiscardAfter','phaseJieshuAfter'])}
   player.useCard(trigger.card,trigger.targets,false);
            
        }
        'step 2'
        if (event.b2) {player.discardPlayerCard(event.t, 'he')
            
            
            
        } else {
            event.finish()
        }
        'step 3'
        if (result.bool) {
         player.addTempSkill('SE_yewang_2',['phaseZhunbeiAfter','phaseJudgeAfter','phaseDrawAfter','phaseUseAfter','phaseDiscardAfter','phaseJieshuAfter'])
   }
    },
                subSkill:{
                    "1":{
                        marktext:"连击",
                        intro:{
                            name:"连击",
                            content:"选项一已执行",
                        },
                        sub:true,
                    },
                    "2":{
                        marktext:"破坏",
                        intro:{
                            name:"破坏",
                            content:"选项二已执行",
                        },
                        sub:true,
                    },
                    be:{
                        trigger:{
                            global:"phaseBefore",
                        },
                        forced:true,
                        content:function () {
                player.addSkill('SE_yewang_1')
                player.addSkill('SE_yewang_2')
            },
                        sub:true,
                    },
                },
            },
            "SE_zhouye2":{
                mod:{
                    cardEnabled:function(card,player){
            if(card.name=='sha'&&player.storage.SE_zhouye<=0) return false;
        },
                },
            },
            "SE_xijian":{
                trigger:{
                    global:"phaseBegin",
                },
				direct:true,
                unique:true,
                filter:function(event,player){
        if(!player.num('h',{suit:'diamond'})) return false;    
        return event.player!=player&&event.player.num('h')>0&&get.distance(player,event.player,'attack')>1;
    },
                content:function(){
        "step 0"
        var next=player.chooseToDiscard('隙间：是否发动【隙间】弃置1张方块牌令'+get.translation(trigger.player)+'选择交出一张黑桃牌或受到1点伤害？',{suit:'diamond'});
        next.ai=function(card){
			if(get.attitude(player,trigger.player)>=0) return false;
            return 7-get.value(card);
        };    
        "step 1"
		 if(result.bool){
        trigger.player.chooseCard('交出一张黑桃牌或受到1点伤害',function(card){
        return get.suit(card)=='spade';
        }).ai=function(card){
            return 6-get.value(card);
        };
		}
		else{
            event.finish();
        }
        "step 2"
        if(result.bool){
            player.gain(result.cards[0]);
            trigger.player.$give(1,player);
        }
        else{
            trigger.player.damage('nosource');
        }
    },
                group:["SE_xijian2"],
                ai:{
                    expose:1,
                    result:{
                        target:function(player,target){
                if(target.Hp<=2) return -3;
                return -2;
            },
                    },
                },
            },
            "SE_jiexian":{
                trigger:{
                    global:"damageBegin",
                },
                priority:5,
                filter:function(event,player){
        if(!player.num('he',{suit:'heart'})) return false;
        return true;
    },
                direct:true,
                content:function(){
        "step 0"
        var next=player.chooseToDiscard('he','界线：是否发动【界线】弃置1张红桃牌使伤害无效且令'+get.translation(trigger.player)+'回复1点体力？',{suit:'heart'});
        next.ai=function(card){
			if(get.attitude(player,trigger.player)<=0) return false;
            return 999-get.value(card);
        };
        "step 1"
        if(result.bool){
            player.logSkill('SE_jiexian',trigger.player);
            trigger.untrigger();
            trigger.finish();
            trigger.player.recover();
        }
    },
                group:["SE_jiexian2"],
                ai:{
                    result:{
                        player:function(player,target){
                return 1;
            },
                    },
                    expose:0.2,
                    threaten:1.5,
                },
            },
            "SE_jiexian2":{
                trigger:{
                    global:"recoverBegin",
                },
                priority:5,
                filter:function(event,player){
        if(!player.num('he',{suit:'spade'})) return false;
        return true;
    },
                direct:true,
                content:function(){
        "step 0"
        var next=player.chooseToDiscard('he','界线：是否发动【界线】弃置1张黑桃牌使回复无效且对'+get.translation(trigger.player)+'造成1点伤害？',{suit:'spade'});
        next.ai=function(card){
			if(get.attitude(player,trigger.player)>=0) return false;
            return 999-get.value(card);
        };
        "step 1"
        if(result.bool){
            player.logSkill('SE_jiexian2',trigger.player);
            game.delay();
            trigger.untrigger();
            trigger.finish();
            trigger.player.damage('nosource');
        }
    },
                ai:{
                    result:{
                        target:function(player,target){
                return -2;
            },
                    },
                    expose:0.2,
                    threaten:1.5,
                },
            },
            "SE_xijian2":{
                trigger:{
                    global:"phaseEnd",
                },
                unique:true,
				direct:true,
                filter:function(event,player){
        if(!player.num('he',{suit:'club'})) return false;    
        return event.player!=player&&event.player.num('h')>0&&get.distance(player,event.player,'attack')<=1;
    },
                content:function(){
        "step 0"
        var next=player.chooseToDiscard('he','隙间：是否发动【隙间】弃置1张梅花牌令'+get.translation(trigger.player)+'选择交出一张红桃牌或受到1点伤害？',{suit:'club'});
        next.ai=function(card){
			if(get.attitude(player,trigger.player)>=0) return false;
            return 7-get.value(card);
        };    
        "step 1"
		if(result.bool){
        trigger.player.chooseCard('交出一张红桃牌或受到1点伤害',function(card){
            return get.suit(card)=='heart';
        }).ai=function(card){
            return 6-get.value(card);
        };
		 }
		 else{
            event.finish();
        }
        "step 2"
        if(result.bool){
            player.gain(result.cards[0]);
            trigger.player.$give(1,player);
        }
        else{
            trigger.player.damage('nosource');
        }
    },
            },
            "SE_zhuoyan":{
                trigger:{
        source:"damageBefore",
    },
    priority:10,
    filter:function(event){
        return event.nature!='fire';
    },
	prompt:function(event,player){
					return '灼眼：是将对'+get.translation(event.player)+'造成的伤害改为火焰伤害？';
				},
	check:function(card){
        var att=get.attitude(player,trigger.player);
            if(trigger.player.hasSkillTag('nofire')){
                if(att>0) return 8;
                return -1;
            }
            if(att<0){
                return 7;
            }
            return -1;
    },
    content:function(){
            player.logSkill('SE_zhuoyan',trigger.player,'fire');
            trigger.nature='fire';
    },
                group:["SE_zhuoyan_1"],
	subSkill:{
        "1":{
			trigger:{
                    source:"damageEnd",
                },
                direct:true,
    filter:function(event){
        return event.player.num('he')>0;
    },
    content:function (){
        "step 0"
        player.discardPlayerCard(trigger.player,1,'he');
    "step 1"
    if(result.bool){player.logSkill('SE_zhuoyan',trigger.target);}else{} 
    },
            sub:true,
        },
    },
            },
            "SE_shenpan":{
                enable:"phaseUse",
                usable:1,
                position:"hes",
                filterCard:function(card){
        var type=get.type(card);
        for(var i=0;i<ui.selected.cards.length;i++){
            if(get.type(ui.selected.cards[i])==type) return false;
        }
        return true;
    },
                filterTarget:function(card,player,target){
        return player!=target;
    },
                selectTarget:[1,3],
                selectCard:3,
                check:function(card){
        if(_status.event.player.hp==_status.event.player.maxHp){
            return 8-get.value(card);
        }
        return 6-get.value(card);
    },
                content:function(){
        target.damage();
    },
                ai:{
                    order:9.5,
                    result:{
                        target:function(player,target){
                if(target.hasSkillTag('nodamage')) return 0.5;
                if(lib.config.mode=='versus') return -1;
                for(var i=0;i<game.players.length;i++){
                    if(lib.config.mode=='identity'){
                        if(game.players[i].ai.shown<=0.2) return 0;
                    }
                    else if(lib.config.mode=='guozhan'){
                        if(game.players[i].identity=='unknown') return 0;
                    }
                }
                return get.damageEffect(target,player);
            },
                        player:function(player){
                var num=player.num('h');    
                if(num<4) return 0;
                if(player.isDamaged){
                    if(num==4&&(player.num('h','shan')||player.num('h','jiu')||player.num('h','tao'))) return -0.5;
                }
                return 0.9;    
            },
                    },
                    expose:0.2,
                },
            },
            "SE_duanzui":{
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return target!=player&&target.countCards('h')>0;
    },
                content:function (){
        'step 0'
        var hs=target.getCards('h');
        player.gain(hs,target);
        target.$giveAuto(hs,player);
        event.hs=hs;
        'step 1'
        var damage=(target.hp>=player.hp&&get.damageEffect(target,player,player)>0);
        var hs=event.hs;
        if(damage&&target.hp>1){
            for(var i=0;i<hs.length;i++){
                if(get.value(hs[i],player,'raw')>=8){
                    damage=false;break;
                }
            }
        }
        player.chooseCard(hs.length,true,'选择还给'+get.translation(target)+'的牌').ai=function(card){
            if(damage){
                return hs.contains(card)?1:0;
            }
            else{
                return -get.value(card,player,'raw');
            }
        }
        if(!event.isMine()) game.delay();
        'step 2'
        target.gain(result.cards,player);
        player.$giveAuto(result.cards,target);
        event.hs2=result.cards;
        if(player.hp>target.hp){
            event.finish();
        }
        'step 3'
        for(var i=0;i<event.hs2.length;i++){
            if(!event.hs.contains(event.hs2[i])) return;
        }
        player.line(target);
        target.damage();
    },
                ai:{
                    order:11,
                    result:{
                        target:function (player,target){
                return -Math.sqrt(target.countCards('h'));
            },
                    },
                },
            },
            "ye_qianbing2":{
                trigger:{
                    player:"loseAfter",
                },
                forced:true,
                filter:function(event,player){
        return event.es&&event.es.length>0;
    },
                content:function(){
        "step 0"
        event.count=trigger.es.length;
        "step 1"
        event.count--;
        player.draw();
        "step 2"
        if(event.count>0){
            player.chooseBool(get.prompt2('ye_qianbing2')).set('frequentSkill','ye_qianbing2').ai=lib.filter.all;
        }
        "step 3"
        if(result.bool){
            player.logSkill('ye_qianbing2');
            event.goto(1);
        }
    },
                ai:{
                    noe:true,
                    reverseEquip:true,
                    effect:{
                        target:function(card,player,target,current){
                if(get.type(card)=='equip'&&!get.cardtag(card,'gifts')) return [1,3];
            },
                    },
                },
            },
            "ye_qianbing":{
                trigger:{
                    player:"equipBegin",
                },
                forced:true,
                content:function (){
        "step 0"
        trigger.untrigger();
        trigger.finish();
        player.$equip(trigger.card);
        game.addVideo('equip',player,get.cardInfo(trigger.card));
        game.log(player,'装备了',trigger.card);
        "step 1"
        var info=get.info(trigger.card);
        if(info.onEquip&&(!info.filterEquip||info.filterEquip(trigger.card,player))){
            var next=game.createEvent('equip_'+trigger.card.name);
            next.setContent(info.onEquip);
            next.player=player;
            next.trigger.card=trigger.card;
            game.delayx();
        }
        delete player.equiping;
    },
                group:"ye_qianbing2",
            },
            "ye_juanxi":{
                nobracket:true,
                trigger:{
                    player:"useCardAfter",
                },
                forced:true,
                filter:function (event,player){
        if(!event.targets||!event.card) return false;
        var type=get.type(event.card);
        if(type!='equip') return false;
        var card=game.createCard(event.card.name,event.card.suit,event.card.number);
        for(var i=0;i<event.targets.length;i++){
            if(!event.targets[i].isAlive()) return false;
            if(!player.canUse({name:event.card.name},event.targets[i],false,false)){
                return false;
            }
        }
        return event.getParent(2).name!='ye_juanxi';
    },
                content:function (){
         var equip=get.cardPile(function(card){
            return get.type(card)=='equip'&&player.hasUseTarget(card);
        });
        player.chooseUseTarget(equip,'nothrow','nopopup',true);
    },
                group:["ye_juanxi2"],
            },
            "ye_tungyan":{
                skillAnimation:true,
                animationColor:"wood",
                juexingji:true,
                derivation:["ye_zengli","ye_fuchen"],
                unique:true,
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                filter:function(event,player){
					if(player.storage.ye_tungyan) return false;
        return player.countCards('h')>5||player.hp<3;
    },
                forced:true,
                content:function(){
        player.loseMaxHp();
        player.addSkill('ye_zengli');
        player.addSkill('ye_fuchen');
        game.log(player,'获得了技能','#g【赠礼】和【浮沉】')
        player.awakenSkill(event.name);
        player.storage[event.name]=true;
    },
                ai:{
                    threaten:function(player,target){
            if(target.handCard>=8) return 2;
            return 1;
        },
                    maixie:true,
                },
                markimage:"extension/OLUI/image/player/marks/juexingji.png",
            },
            "ye_zengli":{
                filterTarget:function(card,player,target){
        return true;
    },
    inherit:"zhiheng",
    selectCard:function(){
        var player=_status.event.player;
        return [1,player.maxHp];
    },
    filterCard:function(card,player){
        return true;
    },
    prompt:"出牌阶段限一次，你可以弃置至多X张牌（X为你的体力上限）并令一名角色摸等量的牌",
    mod:{
        aiOrder(player,card,num){
            if(num<=0||get.itemtype(card)!=='card'||get.type(card)!=='equip') return num;
            let eq=player.getEquip(get.subtype(card));
            if(eq&&get.equipValue(card)-get.equipValue(eq)<Math.max(1.2,6-player.hp)) return 0;
        },
    },
    locked:false,
    enable:"phaseUse",
    usable:1,
    position:"hes",
    check(card){
        return 6-get.value(card)
    },
	content:function(){
        target.draw(event.cards.length);
    },
    ai:{
        order:1,
        result:{
                        target:function(player,target){
                if(target.handCard==1) return 5;
                if(player==target&&player.countCards('h')>player.hp) return 5;
                return 2;
            },
                    },
        threaten:1.5,
    },
            },
            "ye_fuchen":{
                mark:true,
                locked:true,
                zhuanhuanji:true,
                marktext:"☯",
                intro:{
                    content:function(storage,player,skill){
            if(player.storage.ye_fuchen==true) return '锁定技，出牌阶段开始时，你流失一点体力并减一点体力上限，然后摸一张牌';
            return '锁定技，出牌阶段开始时，你加一点体力上限并回复一点体力，然后弃置一张牌';
        },
                },
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                content:function(){
        if(player.storage.ye_fuchen==true){
            player.loseHp();
            player.loseMaxHp();
            player.draw();
        }
        else{
            player.gainMaxHp();
            player.recover();
            player.chooseToDiscard(1,true);
        };
        player.changeZhuanhuanji('ye_fuchen')
    },
            },
            "ye_juanxi2":{
                priority:1,
                usable:1,
                trigger:{
                    global:"useCardAfter",
                },
                direct:true,
                filter:function(event,player){
        var type=get.type(event.card);
        if(type!='equip') return false;
        if(event.cards.length!=1) return false;
        var position=get.position(event.cards[0]);
        if(position=='e') return true;
        return event.player.isIn();
    },
                content:function(){
        'step 0'
        var str=get.translation(trigger.cards[0]),owner=get.owner(trigger.cards[0]);
        var choiceList=[
            '弃置'+(owner?(get.translation(owner)+'区域内的'):'')+str,
            '弃置一张手牌并获得'+str,
        ];
        var choices=[];
        if(owner&&lib.filter.canBeDiscarded(card,player,owner)) choices.push('选项一');
        else choiceList[0]='<span style="opacity:0.5">'+choiceList[0]+'</span>';
        if(owner&&player.hasCard(function(card){
            return lib.filter.cardDiscardable(card,player,'ye_juanxi2');
        },'h')&&lib.filter.canBeGained(card,player,owner)) choices.push('选项二');
        else choiceList[1]='<span style="opacity:0.5">'+choiceList[1]+'</span>';
        player.chooseControl(choices,'cancel2').set('choiceList',choiceList).set('prompt',get.prompt('ye_juanxi2')).set('ai',function(){
            var player=_status.event.player,choices=_status.event.controls.slice(0);
            var card=_status.event.getTrigger().cards[0],owner=get.owner(card);
            var getEffect=function(choice){
                if(choice=='cancel2') return 0.1;
                var result;
                if(get.position(card)=='j'){
                    result=-get.effect(player,{
                        name:card.viewAs||card.name,
                        cards:[card],
                    },player,player)*get.sgn(get.attitude(player,owner));
                }
                else result=-(get.value(card,owner)-0.01)*get.sgn(get.attitude(player,owner));
                if(choice=='选项一') return result;
                if(player.hasCard(function(cardx){
                    return lib.filter.cardDiscardable(cardx,player,'ye_juanxi2')&&get.value(cardx,player)<get.value(card,player);
                },'h')) return result*1.2;
                return 0;
            }
            choices.sort(function(a,b){
                return getEffect(b)-getEffect(a);
            });
            return choices[0];
        });
        'step 1'
        if(result.control!='cancel2'){
            var card=trigger.cards[0],owner=get.owner(card);
            switch(result.control){
                case '选项一':
                    player.logSkill('ye_juanxi2',owner);
                    owner.discard(card,'notBySelf');
                    event.finish();
                    break;
                case '选项二':
                    player.chooseToDiscard('h',true).logSkill=['ye_juanxi2',owner];
                    event.target=owner;
                    break;
            }
        }
        else player.storage.counttrigger.ye_juanxi2--;
        'step 2'
        if(result.bool&&target.getCards('e').contains(trigger.cards[0])) player.gain(trigger.cards,target,'give');
    },
            },
            "ye_mowu":{
				mod:{
                aiOrder:function(player,card,num){
						if(player.storage.ye_mowu!=true&&get.name(card)!='sha') return num+5;
						if(player.storage.ye_mowu==true&&get.name(card)=='sha') return num+5;
					},
            },
                mark:true,
                locked:false,
                zhuanhuanji:true,
                marktext:"☯",
                intro:{
                    content:function (storage,player,skill){
            if(player.storage.ye_mowu==true) return '当你使用【杀】指定目标后，你可以弃置其一张牌';
            return '当你使用牌名不为【杀】的牌指定目标后，你可以摸X张牌';
        },
                },
                group:["ye_mowu_1","ye_mowu_2","ye_mowu_3"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"useCardToPlayered",
                        },
                        "prompt2":"当你使用牌名不为【杀】的牌指定目标后，你可以摸X张牌",
                        forced:true,
                        filter:function (event,player){
        if(event.getParent().triggeredTargets3.length>1||event.card.name=='sha') return false;
        return event.targets.length>0&&player.storage.ye_mowu!=true;
    },
                        content:function (){
							var mp=Math.min(3,trigger.targets.length);
        player.changeZhuanhuanji('ye_mowu')
        player.draw(mp);
    },
                        ai:{
                            presha:true,
                            pretao:true,
                            threaten:1.8,
                        },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            player:"useCardToPlayered",
                        },
						forced:true,
                        prompt:"当你使用【杀】指定目标后，你需弃置其一张牌。",
                        filter:function (event,player){
        return event.card.name=='sha'&&(player.storage.ye_mowu==true);
         
    },
                        logTarget:"target",
                        content:function (){
                player.changeZhuanhuanji('ye_mowu')
      player.discardPlayerCard(trigger.target,'he',true);
    },
                        sub:true,
                    },
					"3":{
                        trigger:{
                            player:"phaseBegin",
                        },
						filter:function (event,player){
        return player.storage.ye_mowu==true;
    },
                        forced:true,
                        content:function (){
                player.changeZhuanhuanji('ye_mowu')
    },
                        sub:true,
                    },
                },
            },
            "ye_nuyi":{
                skillAnimation:true,
                animationColor:"thunder",
                unique:true,
                juexingji:true,
                derivation:"ye_ducai",
                trigger:{
                    player:"dying",
                },
                forced:true,
                filter:function (event,player){
        return !player.storage.ma_nuyi;
    },
                content:function (){
        "step 0"
        player.loseMaxHp();
        "step 1"
        if(player.hp<1){
            player.recover(1-player.hp);
        }
        "step 2"
        player.addSkill('ye_ducai');
        
        player.awakenSkill('ye_nuyi');
    },
                markimage:"extension/OLUI/image/player/marks/juexingji.png",
            },
            "ye_ducai":{
                enable:"phaseUse",
                usable:1,
                unique:true,
                forceunique:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
    return target!=player;
},
                check:function (card){
        if(_status.event.player.countCards('h')>=3){
            return 5-get.value(card);
        }
        return 0;
    },
                position:"he",
                filterCard:true,
                content:function (){
      "step 0"
         target.addTempSkill('ye_ducai1',{player:'gameOver'});
      target.storage.ma_ducai1=cards[0];
      
    },
                mod:{
                    maxHandcard:function (player,num){
           return num+2;
        },
                },
                ai:{
                    order:8,
                    result:{
                        player:1,
                    },
                },
            },
            "ye_ducai1":{
                trigger:{
                    global:"phaseAfter",
                },
                forced:true,
                mark:true,
                content:function (){
                    player.removeSkill('ye_ducai1');
                    delete player.storage.ye_ducai1;
                },
                mod:{
                    cardEnabled:function (card,player){
                        if(get.color(card,'trick')!=player.storage.ye__ducai1) return false;
                    },
                    cardUsable:function (card,player){
                        if(get.color(card,'trick')!=player.storage.ye__ducai1) return false;
                    },
                    cardRespondable:function (card,player){
                        if(get.color(card,'trick')!=player.storage.ye__ducai1) return false;
                    },
                    cardSavable:function (card,player){
            if(get.color(card,'trick')!=player.storage.ye__ducai1) return false;
        },
                },
                intro:{
                    content:function (type){
            return '只能使用或打出与'+get.translation(type)+'花色相同的牌';
        },
                },
            },
            "ye_yanzaomonv":{
                unique:true,
                forceunique:true,
                nobracket:true,
                init:function (player){
        player.storage.ye_yanzaomonv2=player.sex
    },
                group:["ye_yanzaomonv_1"],
                trigger:{
                    player:"phaseBegin",
                },
                frequent:true,
                filter:function (event,player){
        if(!player.countCards('he')) return false;
        return true;
    },
                content:function (){
        "step 0"
        if(player.countCards('he')){
            player.chooseCardTarget({
                prompt:get.prompt('ye_yanzaomonv'),
                filterCard:lib.filter.cardDiscardable,
                position:'he',
                filterTarget:function(card,player,target){
                    if(target==player) return false;
                    var name=target.name.indexOf('unknown')==0?target.name2:target.name;
                    if(name==player.storage.ye_yanzaomonv) return false;

                    var info=lib.character[name];
                    if(info){
                        var skills=info[3];
                        for(var j=0;j<skills.length;j++){
                            if(lib.translate[skills[j]+'_info']&&lib.skill[skills[j]]&&
                                !lib.skill[skills[j]].unique&&!player.hasSkill(skills[j])){
                                return true;
                            }
                        }
                    }
                    return false;
                },
                ai1:function(card){
                    if(player.additionalSkills.ye_yanzaomonv&&player.additionalSkills.ye_yanzaomonv.length>0) return 0;
                    return 7-get.value(card);
                },
                ai2:function(target){
                    if(target.isMin()) return 0;
                    return 6-target.maxHp;
                }
            });
        }
        else{
            event.finish();
        }
        "step 1"
        if(result.bool){
            player.unmark(player.storage.ye_yanzaomonv+'_charactermark');
            player.discard(result.cards);
            player.logSkill('ye_yanzaomonv',result.targets);
            var name=result.targets[0].name;
            if(name.indexOf('unknown')==0){
                name=result.targets[0].name2;
            }
            var list=[];
            var skills=lib.character[name][3];
            for(var j=0;j<skills.length;j++){
                if(lib.translate[skills[j]+'_info']&&lib.skill[skills[j]]&&
                    !lib.skill[skills[j]].unique&&!player.hasSkill(skills[j])){
                    list.push(skills[j]);
                }
            }
            player.addAdditionalSkill('ye_yanzaomonv',list);
            player.markCharacter(name,null,true,true);
            game.addVideo('markCharacter',player,{
                name:'赝造',
                content:'',
                id:'ye_yanzaomonv',
                target:name
            });
            player.storage.ye_yanzaomonv=name;
            player.sex=result.targets[0].sex
        }
    },
                subSkill:{
                    "1":{
                        unique:true,
                        forceunique:true,
                        trigger:{
                            player:"phaseBefore",
                        },
                        priority:-15,
                        forced:true,
                        filter:function (event,player){
        return player.additionalSkills.ye_yanzaomonv&&player.additionalSkills.ye_yanzaomonv.length>0;
    },
                        content:function (){
        player.draw();
        player.unmark(player.storage.ye_yanzaomonv+'_charactermark');
        player.removeAdditionalSkill('ye_yanzaomonv');
        delete player.storage.ye_yanzaomonv;
        player.checkMarks();
                player.sex=player.storage.ye_yanzaomonv2
    },
                        sub:true,
                    },
                },
            },
            kongjianzhen:{
                nobracket:true,
                trigger:{
                    player:"changeHp",
                },
                filter:function (event, player) {
        return player.hp<=player.maxHp/2&&player.storage.kongjianzheng!=true;
      },
                logTarget:"targets",
                forced:true,
	  content:function (){
        "step 0"
		  player.draw();
        player.storage.kongjianzheng = true;
        event.targets=game.filterPlayer(function(current){
            return current!=player;
        }).sortBySeat();
        if(!event.targets.length) event.finish();
        "step 1"
        event.current=event.targets.shift();
        if(!event.current.countCards('he')) event.goto(2);
        else event.current.discard(event.current.getCards('he').randomGet());
        "step 2"
        if(event.targets.length>0) event.goto(1);
    },
            },
            "ye_sifan":{
                trigger:{
                    player:"phaseUseBefore",
                },
                filter:function (event, player) {
        return player.storage.ye_sifan!=true;
      },
                forced:true,
                content:function (){
        'step 0'
        player.storage.ye_sifan=true
        var card=get.cardPile(function(card){
                    return (card.name=='wanjian'||card.name=='nanman');
                });
                if(card) player.gain(card,'gain2');
        'step 1'
         if (player.hasSkill('ye_dongkai')) {
          var num=game.countGroup();
             player.addMark('ye_dongkai',num);
          player.syncStorage('ye_dongkai');
        }
    },
            },
            "ye_bingjiekuilei":{
                nobracket:true,
                trigger:{
                    player:"damageBefore",
                },
                forced:true,
                filter:function (event,player){
 return event.nature=='ice';
    },
                content:function (){
         trigger.cancel();
    },
                group:["ye_bingjiekuilei_1","ye_bingjiekuilei_2","ye_bingjiekuilei_3"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"useCard2",
                        },
                        popup:false,
                        priority:99999,
                        forced:true,
                        content:function (){
                if(trigger.card&&get.tag(trigger.card,'damage')){
                    player.storage.ye_bingjiekuilei=true;
                }
                else{
                    player.storage.ye_bingjiekuilei=false;
                }
            },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            source:"damageBegin1",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
        return !event.card;
    },
                        content:function (){
                player.storage.ye_bingjiekuilei=false;
            },
                        sub:true,
                    },
                    "3":{
                        trigger:{
                            source:"damageBegin",
                        },
                        forced:true,
                        filter:function (event){
        return event.card&&get.type(event.card)=='trick'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
    },
                        content:function (){
              trigger.nature='ice';
    },
                        sub:true,
                    },
                },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player){
             if(player.storage.ye_bingjiekuilei!=true) return false;
                return true;
        },
                },
            },
            "ye_dongkai":{
                markimage:"extension/叶原之夜/image/mark/@dong.png",
                marktext:"冻",
                intro:{
                    content:function (storage){
            return '当前拥有的冰冻值：'+storage+'';
        },
                },
                trigger:{
                    global:["loseAfter"],
                },
                forced:true,
                popup:false,
                filter:function (event,player){
        if(event.player==player) return false;
        if(event.type!='discard') return false;
        return player.isPhaseUsing()&&event.player.isAlive();
    },
                content:function (){
          player.addMark('ye_dongkai');
          player.syncStorage('ye_dongkai');
    },
                group:["ye_dongkai_1","ye_dongkai_hj","ye_dongkai_damage"],
                subSkill:{
					1:{
                        trigger:{
                            player:"phaseBegin",
                        },
						forced:true,
                        content:function (){
                player.addMark('ye_dongkai');
    },
                        sub:true,
                    },
                    hj:{
                        priority:1,
                        trigger:{
                            player:"phaseEnd",
                        },
                        filter:function (event,player){
        return !player.hujia&&player.storage.ye_dongkai>=2;
    },
                        "prompt2":"是否失去两点冰冻值并获得一点护甲？",
                        content:function (){
                player.removeMark('ye_dongkai',2);
        player.changeHujia();
    },
                        sub:true,
                    },
                    damage:{
						priority:9990,
                        trigger:{
                            player:"phaseEnd",
                        },
                        direct:true,
                        filter:function (event,player){
        return player.hasMark('ye_dongkai');
    },
                        content:function (){
        'step 0'
        player.chooseTarget(get.prompt('ye_dongkai_damage'),'弃置与一名其他角色当前体力值相当的冰冻值并对其造成一点伤害',function(card,player,target){
            var num=Math.min(5,target.hp)
            return target!=player&&player.storage.ye_dongkai>=num;
        }).set('ai',function(target){
			var player=_status.event.player
            return get.damageEffect(target,player,player)&&(player.storage.ye_dongkai>target.hp+2||target.hp<=2);
        });
        'step 1'
        if(result.bool){
            player.logSkill('ye_dongkai_damage',result.targets);
            var target=result.targets[0]
            var num1=Math.min(5,target.hp)    
            player.removeMark('ye_dongkai',num1);
            result.targets[0].damage('nocard');
        }
    },
                        sub:true,
                    },
                },
            },
            "ye_aoshagong":{
                intro:{
                    name:"鏖",
                    content:"mark",
                },
                group:["ye_aoshagong_1","ye_aoshagong_2"],
                nobracket:true,
                enable:"phaseUse",
                usable:1,
                position:"he",
                filter:function(event,player){
        if(!player.hasMark('ye_aoshagong')) return false;
        var stat=player.getStat('ye_aoshagong');
        return game.hasPlayer(function(current){
            return (!stat||!stat.contains(current));
        });
    },
                filterTarget:function (card,player,target){
        return target!=player&&player.hasMark('ye_aoshagong');
    },
                prompt:"移除一枚【鏖】标记并选择一名其他角色，你对其造成一点伤害并无视其防具且计算与其的距离时视为1直至当前回合结束。",
                content:function (){
        var stat=player.getStat();
        if(!stat.ye_aoshagong) stat.ye_aoshagong=[];
        stat.ye_aoshagong.push(target);
        player.removeMark('ye_aoshagong',1);
        target.damage();
        player.storage.ye_aoshagong2=target;
        player.addTempSkill('ye_aoshagong2');
    },
                ai:{
                    order:99,
                    result:{
                        target:function (player,target){
                return get.damageEffect(target,player);
            },
                    },
                },
                threaten:1.5,
                subSkill:{
                    "1":{
                        trigger:{
                            global:["gameDrawAfter","dieAfter"],
                        },
                        forced:true,
                        content:function (){
        player.addMark('ye_aoshagong',trigger.name=='die'?trigger.num:3);
                if(trigger.name=='die'){
                player.draw();
                    player.getStat('skill').ye_aoshagong--;
                }
    },
                        sub:true,
                    },
                    "2":{
                        usable:1,
                        prompt:"弃置两张[杀]并获得一枚【鏖】标记。",
                        enable:"phaseUse",
                        filter:function(event,player){
        return player.countCards('he',{name:'sha'})>=2;
    },
                        filterCard:function(card){
        return get.name(card)=='sha';
    },
                        selectCard:2,
                        position:"he",
                        unique:true,
                        content:function(){    
                player.addMark('ye_aoshagong');
    },
                        ai:{
                            order:1,
                            result:{
                                player:function(player,target){
                return 4;
            },
                            },
                        },
                        sub:true,
                    },
                },
            },
            "ye_aoshagong2":{
                mark:"character",
                onremove:true,
                intro:{
                    content:"到$的距离视为1且无视其护甲",
                },
                mod:{
                    globalFrom:function (from,to){
            if(to==from.storage.ye_aoshagong2){
                return -Infinity;
            }
        },
                },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg.target!=player.storage.ye_aoshagong2) return false;
        },
                    expose:0.3,
                },
                sub:true,
            },
            "ye_qiannian":{
                markimage:"extension/叶原之夜/image/mark/@yong.png",
                init:function (player){
        player.storage.ye_qiannian=0;
    },
                mark:true,
                marktext:"永",
                intro:{
                    content:"mark",
                },
                forced:true,
                group:["ye_qiannian_1","ye_qiannian_2","ye_qiannian_3"],
                subSkill:{
                    "1":{
						priority:9990,
                        forced:true,
                        trigger:{
                            global:"gameStart",
                        },
                        content:function (player){
        player.storage.ye_qiannian+=1;
							player.gainMaxHp();
							player.recover();
    },
                        sub:true,
                    },
                    "2":{
                        forced:true,
                        trigger:{
                            player:"phaseDrawBegin2",
                        },
                        filter:function(event,player){
        return !event.numFixed;
    },
                        content:function(){
        trigger.num+=player.storage.ye_qiannian;
    },
                        mod:{
                            maxHandcard:function (player,num){
            return num+=player.storage.ye_qiannian*2;
        },
                        },
                        sub:true,
                    },
                    "3":{
                        trigger:{
                            global:"washCard",
                        },
						priority:9990,
                        forced:true,
                        content:function (player){
        player.storage.ye_qiannian+=1;
							player.gainMaxHp();
							player.recover();
    },
                        sub:true,
                        group:["ye_qiannian_3_roundcount"],
                    },
                },
            },
            "ye_yanzaomonv2":{
                nobracket:true,
                trigger:{
                    player:"useCard",
                },
                mark:true,
                direct:true,
                intro:{
                    content:"已发动#次技能",
                },
                init:function (player){
        player.storage.ye_yanzaomonv2=0;
    },
                filter:function (event,player){
        if(player.countCards('hej')<1) return false;
        return true;
    },
                content:function (){
        'step 0'
        player.logSkill('ye_yanzaomonv2',player);
        player.chooseCard(1,'hej',"弃置一张牌").set('ai',function(card){
            if(get.suit(card)=='club') return 10-get.value(card);
            if(get.tag(card,'save')){
                return -1;
            }
            if(get.tag(card,'damage')) return -2;
            return 8-get.value(card);
        });
        'step 1'
        var card=result.cards[0];
        card.discard();
        game.log(player,'<span style="color: thunder">弃置了</span>',card);
            player.draw();
        'step 2'
        player.storage.ye_yanzaomonv2++;
        if(player.storage.ye_yanzaomonv2%7==0){
            player.draw();
            player.storage.ye_yanzaomonv2=0;
            player.updateMarks();
        }
    },
                ai:{
                    order:8,
                    threaten:2,
                },
            },
            "ye_jingxiang":{
                trigger:{
        target:"useCardToTarget",
    },
    usable:1,
    filter:function (event,player){
        return player!=_status.currentPhase;
    },
    content:function (){
        "step 0"
        if(player.countCards('he',trigger.card.name)){
            var tran='【'+get.translation(trigger.card.name)+'】';
            player.chooseToDiscard('he','弃置一张'+tran+'令之失效，或取消并获得'+tran,{name:trigger.card.name}).set('ai',function(card){
                if(get.effect(_status.event.player,trigger.card)>0) return 0;
                return 7-get.value(card);
            });
        }else event._result={bool:false};
        "step 1"
        if(result.bool==true){
            trigger.getParent().excluded.add(player);
        }else{
            var card1=game.createCard(trigger.card);
            player.gain(card1,'gain2','log');
        }
    },
    ai:{
        threaten:0.85,
    },
            },
            "ye_xijian":{
                trigger:{
        player:"phaseJieshuBegin",
    },
                direct:true,
                content:function(){
        'step 0'
        player.chooseTarget(get.prompt2('ye_xijian'),2,function(player,target){
                if(!ui.selected.targets.length) return target.countCards('he')>0;
        return target!=ui.selected.targets[0]&&ui.selected.targets[0].countGainableCards(target,'he')>0;
            }).set('ai',function(target){
                if(ui.selected.targets.length){
                    return get.attitude(player,target)
                }
                else{
                    return 1-get.attitude(player,target)
                }
            }).set('targetprompt',['被拿牌','得到牌']);
        'step 1'
        if(result.bool){
            event.target1=result.targets[0];
            event.target2=result.targets[1];
            game.delay();
        }
        else{
            event.finish();
        }
		'step 2'
		event.target2.gainPlayerCard(event.target1,'he',true);
        },
                 ai:{
                    expose:0.9,
                },
    },
            "ye_shenying":{
                trigger:{
        player:"damageEnd",
        source:"damageEnd",
    },
	filter:function(event,player){
        return event.player.isIn();
    },
	check:function(event,player){
		if(_status.currentPhase==player&&event.player==player) return false;
			if(_status.currentPhase!=player&&event.player==player) return true;
        return get.effect(event.player,{name:'diaohulishan'},_status.event.player);
		},
                content:function (){
        trigger.player.addTempSkill('ye_shenyingbuff');		
    },
            },
            "ye_wuyu":{
                unique:true,
                global:"ye_wuyu1",
                zhuSkill:true,
            },
            "ye_wuyu1":{
                enable:"phaseUse",
                discard:false,
                lose:false,
                delay:false,
                line:true,
                direct:true,
                clearTime:true,
                prepare:function(cards,player,targets){
        targets[0].logSkill('ye_wuyu');
    },
                prompt:function(){
        var player=_status.event.player;
        var list=game.filterPlayer(function(target){
            return target!=player&&target.hasZhuSkill('ye_wuyu',player);
        });
        var str='将一张手牌交给'+get.translation(list);
        if(list.length>1) str+='中的一人';
        return str;
    },
                filter:function(event,player){    
                    return game.hasPlayer(function(target){
                        return target!=player&&target.hasZhuSkill('ye_wuyu',player)&&!target.hasSkill('ye_wuyu1_used');
                    });
                },
                filterCard:function(card,player){
        return get.suit(card,player)=='spade'
    },
                log:false,
                visible:true,
                filterTarget:function(card,player,target){
        return target!=player&&target.hasSkill('ye_wuyu',player)&&!target.hasSkill('ye_wuyu1_used');
    },
                content:function(){
        target.gain(cards,player,'giveAuto');
        target.addTempSkill('ye_wuyu1_used','phaseUseEnd');
    },
                ai:{
                    expose:0.3,
                    order:10,
                    result:{
                        target:5,
                    },
                },
				subSkill:{
        used:{
            charlotte:true,
            sub:true,
        },
    },
            },
            "ye_mofa":{
				position:"hes",
                enable:"phaseUse",
                filterCard:true,
                usable:1,
                filter:function(event,player){
        return player.countCards('hes')>0;
    },
                check:function(card){
        if(get.suit(card)=='spade') return 9-get.value(card);
        return 7-get.value(card);
    },
                content:function(){
					player.addTempSkill('ye_mofa_1');
    },
                subSkill:{
                    "1":{
                        trigger:{
                            source:"damageBegin1",
                        },
                        forced:true,
                        content:function (){
                trigger.num++;
            },
                        sub:true,
                    },
                },
                ai:{
                    expose:1,
                    order:999,
                    result:{
                        player:function(player,target){
            return 2;
        },
                    },
                },
            },
			"ye_qinmian":{
				usable:3,
		trigger:{
                player:"loseAfter",
                global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
            },
			frequent:true,
            filter:function(event,player){
if(event.name=='gain'&&event.player==player) return false;
var evt=event.getl(player);
return evt&&evt.cards2&&evt.cards2.filter(function(card){
return get.suit(card)=='spade';
}).length;
},
            content:function(){
player.draw();
},
            },  
			"ye_qiuwen":{
                enable:"phaseUse",
                usable:1,
                content:function (){
        player.draw(player.maxHp);
    },
                ai:{
                    order:18.5,
                    result:{
                        player:4,
                    },
                },
            },
            "ye_zaocu":{
                trigger:{
                    player:"phaseAfter",
                },
                forced:true,
                filter:function(event,player,card){ 
       return player.countCards('h')>player.maxHp;
    },
                content:function(){
        player.loseHp();
    },
                group:"ye_zaocu_qip",
                subSkill:{
                    qip:{
                        trigger:{
                            player:"phaseDiscardBefore",
                        },
                        forced:true,
                        filter:function(event,player){
                return true;
            },
                        content:function() {
                trigger.cancel();
            },
                        sub:true,
                    },
                },
            },
            "ye_dangjia":{
                unique:true,
                global:"ye_dangjia1",
                zhuSkill:true,
            },
            "ye_dangjia1":{
                enable:"phaseUse",
                prompt:function(){
        var player=_status.event.player;
        var list=game.filterPlayer(function(target){
            return target.hasZhuSkill('ye_dangjia',player)&&player.canCompare(target);
        });
        var str='和'+get.translation(list);
        if(list.length>1) str+='中的一人';
        str+='进行拼点。若你没赢，其回复一点体力。';
        return str;
    },
                filter:function(event,player){
					if(player.countCards('h')==0) return false;
                if(!player.isHealthy()&&player.group!='wai') return false;
                return game.hasPlayer(function(target){
            return target.hasZhuSkill('ye_dangjia',player)&&player.canCompare(target);
        });
    },
                filterTarget:function(card,player,target){
        return target.hasZhuSkill('ye_dangjia',player)&&player.canCompare(target)&&target.isDamaged()>0;
    },
                direct:true,
                clearTime:true,
                prepare:function(cards,player,targets){
        targets[0].logSkill('ye_dangjia');
    },
                usable:1,
                content:function(){
        "step 0"
        player.chooseToCompare(target,function(card){
            if(card.name=='du') return 20;
            var player=get.owner(card);
            var target=_status.event.getParent().target;
            if(player!=target&&get.attitude(player,target)>0){
                return -get.number(card);
            }
            return get.number(card);
        }).set('preserve','lose');
        "step 1"
        if(result.bool==false){
            var list=[];
            if(get.position(result.player)=='d') list.push(result.player);
            if(get.position(result.target)=='d') list.push(result.target);
            if(!list.length) event.finish();
            else{
                target.chooseBool('是否回复一点体力').ai=function(){
                    return get.value(list)>0;
                };
            }
        }
        else event.finish();
        "step 2"
        if(result.bool) target.recover();
    },
                ai:{
                    basic:{
                        order:9,
                    },
                    expose:0.2,
                    result:{
                        target:function(player,target){
                        if(target.countCards('h')>target.hp+1&&get.recoverEffect(target)>0){
                    return 1;
                }
                if(player.countCards('h','du')&&get.attitude(player,target)<0) return -1;
                if(player.countCards('h')<=player.hp) return 0;
                var maxnum=0;
                var cards2=target.getCards('h');
                for(var i=0;i<cards2.length;i++){
                    if(get.number(cards2[i])>maxnum){
                        maxnum=get.number(cards2[i]);
                    }
                }
                if(maxnum>10) maxnum=10;
                if(maxnum<5&&cards2.length>1) maxnum=5;
                var cards=player.getCards('h');
                for(var i=0;i<cards.length;i++){
                    if(get.number(cards[i])<maxnum) return 1;
                }
                return 0;
            },
                    },
                },
            },
            "ye_zhenye":{
                trigger:{
                    player:"phaseAfter",
                },
                filterTarget:true,
                direct:true,
                preHidden:true,
                content:function(){
        "step 0"
        player.chooseTarget(get.prompt('ye_zhenye'),'令一名其他角色与你将武将牌翻面，然后你摸一张牌',function(card,player,target){
            return player!=target
        }).setHiddenSkill('ye_zhenye').ai=function(target){
            if(target.hasSkillTag('noturn')) return 0;
            var player=_status.event.player;
            if(get.attitude(_status.event.player,target)==0) return 0;
            if(get.attitude(_status.event.player,target)>0){
                if(target.classList.contains('turnedover')) return 1000-target.countCards('h');
                return 0;
            }
            else{
                if(target.classList.contains('turnedover')) return -1;
                return 1+target.countCards('h');
            }
        }
        "step 1"
        if(result.bool){
            player.logSkill('ye_zhenye',result.targets);
            result.targets[0].turnOver();
            player.turnOver();
            player.draw();
        }
    },
            },
            "ye_anyu":{
                frequent:true,
                trigger:{
                    player:"damageAfter",
                },
                filter:function (event,player){
        return get.color(event.card)!='red';
    },
                content:function(){
        "step 0"
        player.chooseControl('翻面','摸一张牌',function(event,player){
            if(player.classList.contains('turnedover')) return '翻面';
            return '摸一张牌';
        }).set('prompt','暗域：翻面或摸一张牌');
        "step 1"
        if(result.control=='翻面'){
            player.turnOver();
        }
        else{
            player.draw();
        }
    },
	ai:{
        maixie:true,
        "maixie_hp":true,
        result:{
            effect:function (card,player,target){
                if(get.tag(card,'damage')&&(get.color(card)=='black')&&target.isTurnedOver()){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    if(!target.hasFriend()) return;
                    var num=1;
                    if(get.attitude(player,target)>0){
                            num=0.5;
                    }
                    if(player.hp>=4) return [1,num*2];
                    if(target.hp==3) return [1,num*1.5];
                    if(target.hp==2) return [1,num*0.5];
                }
            },
        },
        threaten:0.9,
    },
            },
			"ye_weiyi":{
       enable:"phaseUse",
    usable:1,
    multitarget:true,
    audio:2,
    filterTarget:function (card, player, target) {
        if (player == target&&!ui.selected.targets.length) return false;
		if(!ui.selected.targets.length) return target.countCards('he')>0;
        return true;
    },
	targetprompt: ["出杀", "被杀"],
    selectTarget:2,
	content:function(){
		 "step 0"
		var target=targets[0]
                targets[0]
            .chooseToUse(
                function (card, player, event) {
                    if (get.name(card) != "sha") return false;
                    return lib.filter.filterCard.apply(this, arguments);
                },
                "【伪仪】：对" + get.translation(targets[1]) + "使用一张杀，或将一张牌交给"+get.translation(player)+"，其获得后，其可以将之当【杀】对你使用"
            )
            .set("targetRequired", true)
            .set("complexSelect", true)
            .set("filterTarget", function (card, player, target) {
                if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
                return lib.filter.targetEnabled.apply(this, arguments);
            })
            .set("sourcex", targets[1]);
            "step 1";
        if (!result.bool ) {
            target.chooseCard("he", "交给" + get.translation(player) + "一张牌", true);
        } else event.finish();
        "step 2";
        if (result.bool) {
            targets[0].give(result.cards, player);
			player.chooseUseTarget( "【伪仪】：是否将" + get.translation(result.cards) + "当不计入次数限制的杀对" + get.translation(targets[0]) + "使用",{name:'sha'},'nodistance',result.cards,false,targets[0]).viewAs=true;
        }
            },
    ai:{
        expose:0.4,
        order:9,
        result:{
            target:function (player, target) {
                if (ui.selected.targets.length){
                if (ui.selected.targets[0].countCards("h") == 0) return 0;
                if (ui.selected.targets[0].countCards("h") == 1) return -0.1;
                if (target.hp <= 2) return -2;
                if (target.countCards("h", "shan") == 0) return -1;
                return -0.5;
				}
                return -1.5;
            },
        },
    },
    "_priority":0,
            },
            "ye_duozhi":{
                trigger:{
        global:"phaseZhunbeiBegin",
    },
	direct:true,
	filter:function(event,player){
		if(event.player.countCards('h')<player.countCards('h')) return false;
		return game.hasPlayer(function(current){
return current.countCards('h')<player.countCards('h');
});
    },
               content:function(){
        "step 0"
        player.chooseTarget(get.prompt('ye_duozhi'),'是否令一名手牌数小于你的角色摸一张牌，然后令后者于此回合内不能使用或打出【闪】？',function(card,player,target){
            return target.countCards('h')<player.countCards('h');
        }).setHiddenSkill('ye_duozhi').ai=function(target){
			var att1=get.attitude(player,target);
			var att2=get.attitude(player,trigger.player);
           if(att1>0&&att2>0) return att2;
			if(att1<0&&att2<0) return 0;
						return 0;
        }
        "step 1"
        if(result.bool){
            player.logSkill('ye_duozhi',result.targets);
            result.targets[0].addTempSkill('ye_duozhi_fenyin');
            result.targets[0].draw();
        }
    },
	subSkill:{
                    "fenyin":{
                    charlotte:true,
    forced:true,
    mark:true,
    marktext:"封",
    intro:{
        content:"不能使用或打出【闪】",
    },
             mod:{
        cardEnabled:function (card,player){
            if(card.name=='shan') return false;
        },
        cardRespondable:function (card,player){
            if(card.name=='shan') return false;
        },
        cardSavable:function (card,player){
            if(card.name=='shan') return false;
        },
    },
                        sub:true,
                    },
                },
				ai:{
        expose:0.3,
    },
            },
           "ye_fengxiang":{
                enable:"phaseUse",
                usable:1,
                selectTarget:[1,Infinity],
                filterTarget:function(card,player,target){
                    return target!=player&&player.canUse('huogong',target,false);
                },
                multiline:true,
                multitarget:true,
                content:function(){
    player.useCard({name:'huogong'},targets);
    },
                ai:{
                    order:9.2,
                    result:{
            target:-1,
        },
                },
            },
            "ye_kaifeng":{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function(event,player){
					if(event.source.hp<=player.hp) return false;
        return event.nature=='fire';
    },
                content:function(){
        player.recover();
    },
                group:["ye_kaifeng_1","ye_kaifeng_2"],
                subSkill:{
                    "1":{
                        trigger:{
                            source:"damageBegin",
                        },
                        forced:true,
                        filter:function(event,player){
							if(event.player.hp<=player.hp) return false;
        return event.nature=='fire';
    },
                        content:function(){
        player.recover();
    },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            source:"damageAfter",
                        },
						filter:function(event){
        return event.nature=='fire';
    },
                        forced:true,
                        content:function (){
 player.draw();
    },
                        sub:true,
                    },
                },
            },
            "ye_leishi":{
                enable:"phaseUse",
                usable:1,
				filterTarget:function(card,player,target){
        return target!=player;
    },
	ai:{
        damage:true,
        thunderAttack:true,
        order:1,
        result:{
            target:function(player,target){
                var eff=get.damageEffect(target,player,target,'thunder');
                if(target.isLinked()){
                    return eff/10;
                }
                else{
                    return eff;
                }
            },
        },
    },
                content:function(){
					'step 0'
        player.addTempSkill('ye_leishi_1');
			player.addTempSkill('unequip','useCardAfter');
				player.useCard({name:'sha',nature:"thunder"},targets,false);
        'step 1'
        player.removeSkill('ye_leishi_1');
    },
                subSkill:{
                    "1":{
                        trigger:{
                            player:"shaMiss",
                        },
                        forced:true,
                        content:function(){
        player.loseHp();
        player.draw();
    },
                        sub:true,
                    },
                },
            },
            "ye_fenyuan":{
                trigger:{
                    player:"die",
                },
                check:function(event,player){
        return get.damageEffect(_status.currentPhase,player,player)>0;
    },
                forceDie:true,
                filter:function(event,player,name){
        return _status.currentPhase!=player;
    },
                content:function(){
        _status.currentPhase.damage(2,'thunder','nocard');
    },
	ai:{
        threaten:function (player, target) {
            if (target.hp == 1) return 0.2;
            return 1.5;
        },
        effect:{
            target:function (card, player, target, current) {
                if (!target.hasFriend()) return;
                if (target.hp <= 1 && get.tag(card, 'damage')) return [1, 0, -1, -2.5];
            },
        },
    },
            },
            "ye_songjing":{
                trigger:{
                    global:"useCard",
                },
                filter:function(event){
        return (get.type(event.card)=='delay');
    },
                content:function(){
        player.draw(2);
    },
            },
            "ye_gongzhen":{
                trigger:{
                    global:"damageEnd",
                },
                filter:function(event,player){
        return (event.card&&event.card.name=='sha'&&event.player!=player&&
            event.player.classList.contains('dead')==false&&player.countCards('hes'));
    },
                direct:true,
                checkx:function(event,player){
        var att1=get.attitude(player,event.player);
        return att1<=0;
    },
                preHidden:true,
                content:function(){
        "step 0"
        var next=player.chooseToDiscard('hes',get.prompt2('ye_gongzhen',trigger.player));
        var check=lib.skill.ye_gongzhen.checkx(trigger,player);
        next.set('ai',function(card){
            if(_status.event.goon) return 8-get.value(card);
            return 0;
        });
        next.set('logSkill','ye_gongzhen');
        next.set('goon',check);
        next.setHiddenSkill('ye_gongzhen');
        "step 1"
        if(result.bool){
            trigger.player.damage();
        }
    },
                ai:{
                    expose:0.3,
                },
            },
            "ye_shicao":{
                unique:true,
                round:1,
                trigger:{
                    player:"phaseZhunbeiBefore",
                },
                forced:true,
                content:function (){
                player.addMark('ye_shiting',1,false);
    },
                group:["ye_shicao_roundcount"],
            },
            "ye_shiting":{
                unique:true,
                markimage:"extension/叶原之夜/image/mark/@shi.png",
                marktext:"时",
                intro:{
                    name:"时停(时)",
                    "name2":"时",
                },
                trigger:{
                    global:"phaseAfter",
                },
                filter:function(event,player){
        return player.hasMark('ye_shiting');
    },
                content:function(){
        player.removeMark('ye_shiting',1);
        player.insertPhase();
    },
                ai:{
                    result:{
                        player:1,
                    },
                },
            },
            "ye_huanzai":{
                unique:true,
                filter:function(event,player){
        return !player.hasMark('ye_shiting');
    },
                trigger:{
                    player:"phaseJieshuBefore",
                },
                limited:true,
                skillAnimation:"epic",
                animationColor:"thunder",
                multitarget:true,
                multiline:true,
                content:function(){
        player.awakenSkill('ye_huanzai');
        player.addMark('ye_shiting',1,false);
    },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function(player,skill){
        player.storage[skill]=false;
    },
                ai:{
                    result:{
                        player:1,
                    },
                },
                markimage:"extension/OLUI/image/player/marks/xiandingji.png",
            },
            "ye_shanghun":{
                unique:true,
                trigger:{
                    player:"damageEnd",
                },
                filter:function(event,player){
        return !player.hasMark('ye_shiting');
    },
                limited:true,
                skillAnimation:"epic",
                animationColor:"thunder",
                multitarget:true,
                multiline:true,
                content:function(){
        player.awakenSkill('ye_shanghun');
        player.addMark('ye_shiting',1,false);
    },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function(player,skill){
        player.storage[skill]=false;
    },
                ai:{
                    maixie:true,
                    result:{
                        player:1,
                    },
                },
                markimage:"extension/OLUI/image/player/marks/xiandingji.png",
            },
            "ye_taotie":{
                frequent:true,
                filter:function(event,player){
        return event.card.name=='shan'&&event.player!=player;
    },
                trigger:{
                    global:"useCardEnd",
                },
                content:() => {
        "step 0"
            player.judge();
        "step 1"
        switch(result.suit){
            case 'club':player.recover();break;
            case 'spade':player.recover();break;
            case 'heart':player.draw();break;
            case 'diamond':player.draw();break;
        }
    },
            },
            "ye_duzhua":{
                usable:1,
                enable:"phaseUse",
                filterCard:function(card,player){
        return get.color(card)=='red';
    },
                position:"h",
                viewAs:{
                    name:"sha",
                },
                group:["ye_huixing"],
                prompt:"将一张红色手牌当【杀】使用并摸一张牌",
                onuse:function(result,player){
        player.draw();
    },
                ai:{
					result:{
            player:function(player){
                return 1;
            },
        },
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            var base=0,hit=false;
            if(get.cardtag(card,'yingbian_hit')){
                hit=true;
                if(targets.filter(function(target){
                    return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_all')){
                if(game.hasPlayer(function(current){
                    return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_damage')){
                if(targets.filter(function(target){
                    return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                    },true))&&!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })
                })) base+=5;
            }
            return base;
        },
                    canLink:function(player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
            if(player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))){
                if(game.hasPlayer(function(current){
                    return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                })&&game.countPlayer(function(current){
                    return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                })>1) return 3.1;
                return 3;
            }
            return 3.05;
        },
                    result:{
                        target:function(player,target,card,isLink){
                var eff=function(){
                    if(!isLink&&player.hasSkill('jiu')){
                        if(!target.hasSkillTag('filterDamage',null,{
                            player:player,
                            card:card,
                            jiu:true,
                        })){
                            if(get.attitude(player,target)>0){
                                return -7;
                            }
                            else{
                                return -4;
                            }
                        }
                        return -0.5;
                    }
                    return -1.5;
                }();
                if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                },true)) return eff/1.2;
                return eff;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function(card){
                if(card.nature) return 1;
            },
                        fireDamage:function(card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function(card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function(card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "ye_siyu":{
                enable:"phaseUse",
                usable:1,
				filter:function(event,player){
        return player.countCards('h')>0&&game.hasPlayer((current)=>lib.skill.ye_siyu.filterTarget(null,player,current));
    },
	selectCard:[1,2],
	discard:false,
                lose:false,
                filterCard:true,
                position:"h",
                check:function(card){
        return 6-get.value(card);
    },
                filterTarget:function(card,player,target){
        return target!=player;
    },
    content:function (){
        target.gain(cards,player,'giveAuto');
		target.addTempSkill('ye_siyu_1'); 
            target.addMark('ye_siyu',cards.length,false);
        player.addTempSkill('ye_siyu_0')
    },
    subSkill:{
        "0":{
            charlotte:true,
            forced:true,
            trigger:{
                player:"phaseEnd",
            },
            filter:function (event,player){
				var current=game.findPlayer(function(player){
						return player.countMark('ye_siyu')>0;
					});
        return current;
    },
            content:function (){
				var current=game.findPlayer(function(player){
						return player.countMark('ye_siyu')>0;
					});
                player.gainPlayerCard(current.countMark('ye_siyu'),current,get.buttonValue,'h',true,'visible');
					current.removeMark('ye_siyu',current.countMark('ye_siyu'),false);
    },
            sub:true,
            "_priority":0,
        },
		"1":{
            trigger:{
            },
            charlotte:true,
            forced:true,
            mark:true,
            marktext:" 私",
            content:function (){player.removeSkill('ye_siyu_1');},
            intro:{
				content:function(storage,player){
			if(player.hasMark('ye_siyu')) return '回合结束时将被观看并获取'+player.countMark('ye_siyu')+'张手牌';
			 },  
            },
            sub:true,
            "_priority":0,
        },
    },
    ai:{
        threaten:1.5,
        order:15,
        result:{
            player:function(player,target){
                    return target.countCards('h');
            },
        },
        expose:1.2,
    },
            },
            "ye_qishu":{
                trigger:{
                    player:"useCard2",
                },
                forced:true,
                filter:function (event,player){
        if(player.countCards('h')>=1) return false;
        var type=get.type(event.card);
        if(type=='equip'||type=='delay') return false;
        return event.card;
    },
                content:function (){
        'step 0'
        player.chooseTarget('是否发动【奇术】，令任意名其他角色也成为此牌的目标？',[1,Infinity],function(card,player,target){
            return target!=player&&!trigger.targets.contains(target);
        }).ai=function(target){
            var trigger=_status.event.getTrigger();
            var player=_status.event.source;
            return get.effect(target,trigger.card,player,_status.event.player);
        };
        'step 1'
        if(result.bool&&result.targets&&result.targets.length){
            var targets=result.targets;
            player.logSkill('ye_qishu',targets);
            player.line(targets,trigger.card.nature);
            trigger.targets.addArray(targets);
        }
    },
                mod:{
                    targetInRange:function(card,player,target,now){
            return true;
        },
                },
            },
            "ye_zhize":{
                trigger:{
                    player:"phaseDrawBefore",
                },
                forced:true,
				filter:function (event,player){
        return !event.numFixed;
    },
                content:function(){
        "step 0"
					trigger.num--;
player.chooseTarget(get.prompt("ye_zhize"),"是否观看一名有手牌的其他角色的手牌并获得其中的一张牌",function(card,player,target){
            if(player==target) return false;
            return target.countCards('h');
        }).set('ai',function(target){
            var att=get.attitude(player,target);
            if(att>0) return false;
            if(att<0) return -att+target.countCards('h');
            return target.countCards('h');
        }).setHiddenSkill('ye_zhize');
        "step 1"
        if(result.bool){     
			player.logSkill('ye_zhize',result.targets[0]);
        player.gainPlayerCard(result.targets[0],'h',true,'visible').set('ai',function(card){
            if(get.suit(card)=='heart'){
                 return get.value(card)+999;
            };
            return get.value(card);
        }).setHiddenSkill('ye_zhize');
        }
    },
                ai:{
                    threaten:2,
                    expose:0.3,
                },
            },
            "ye_chunxi":{
                direct:true,
                trigger:{
                    player:"gainAfter",
                },
                content:function(){
         'step 0'
        event.videoId=lib.status.videoId++;
        var cards=trigger.cards;
        if(player.isOnline2()){
            player.send(function(cards,id){
                ui.create.dialog('春息',cards).videoId=id;
            },cards,event.videoId);
        }
        event.dialog=ui.create.dialog('春息',cards);
        event.dialog.videoId=event.videoId;
        if(!event.isMine()){
            event.dialog.style.display='none';
        }
        player.chooseButton().set('filterButton',function(button){
            return get.suit(button.link)=='heart';
        }).set('dialog',event.videoId);
        "step 1"
        if(result.bool){
            event.card=result.links[0];
            var func=function(card,id){
                var dialog=get.idDialog(id);
                if(dialog){
                    for(var i=0;i<dialog.buttons.length;i++){
                        if(dialog.buttons[i].link==card){
                            dialog.buttons[i].classList.add('selectedx');
                        }
                        else{
                            dialog.buttons[i].classList.add('unselectable');
                        }
                    }
                }
            }
            if(player.isOnline2()){
                player.send(func,event.card,event.videoId);
            }
            else if(event.isMine()){
                func(event.card,event.videoId);
            }
        }
        else{
            if(player.isOnline2()){
                player.send('closeDialog',event.videoId);
            }
            event.dialog.close();
            event.finish();
        }
        "step 2"
        if(player.isOnline2()){
            player.send('closeDialog',event.videoId);
        }
        event.dialog.close();
        var card=event.card;
            player.showCards(card);
        "step 3"
        if(result.bool){ player.chooseTarget(get.prompt("ye_chunxi"),"获得一名有手牌的其他角色的一张手牌",function(card,player,target){
            if(player==target) return false;
            if(!target.countCards('h')>0) return false;
            return true;
        }).set('ai',function(target){
            var att=get.attitude(player,target);
            if(att>0) return false;
            if(att<0) return -att/target.countCards('h');
            return target.countCards('h');
        }).setHiddenSkill('ye_chunxi');
        }
        "step 4"
        if(result.bool){
            event.target=result.targets[0];       
        player.gainPlayerCard(event.target,'h',true);
            player.logSkill('ye_chunxi',result.targets);
            event.finish();
        }
    },
            },
            "ye_5yu":{
                markimage:"extension/叶原之夜/image/mark/@yu.png",
                locked:false,
                mark:true,
                marktext:"欲",
                intro:{
                    "name2":"欲",
                },
                priority:1,
                        trigger:{
                            player:"phaseZhunbeiBegin",
                        },
                        forced:true,
                        content:function (player){
                player.addMark('ye_5yu',player.getDamagedHp()-player.storage.ye_5yu+1);
                game.delayx();
    },
                group:["ye_5yu8","ye_5yu3","ye_5yu4","ye_5yu5","ye_5yu6","ye_5yu7"],
                },
            "ye_jiezou":{
				mod:{
        targetInRange:function(card,player,target){
            if(card.storage&&card.storage.ye_jiezou&&get.suit(card)=='spade') return true;
        },
    },
          enable:"chooseToUse",
    position:"hes",
    viewAs:{
        name:"shunshou",
		storage:{ye_jiezou:true},
    },
	filterCard:function(card){
        return true;
    },
    viewAsFilter:function(player){
        if(!player.countCards('hes')) return false;
    },
    prompt:"将一张牌当顺手牵羊使用",
    check:function(card){
		return get.suit(card)=='spade';
		},
	basic:{
            order:999,
            useful:4,
            value:9,
        },
		group:["ye_jiezou_count"],
    subSkill:{
        count:{
            trigger:{
                player:"useCard",
            },
            filter:function(event){
return event.skill=='ye_jiezou'&&get.suit(event.card)!='spade';
},
            content:function(){
        player.popup();
                for (var phase of lib.phaseName) {
                    var evt = event.getParent(phase);
                    if (evt && evt.name == phase) {
                        var name = ["准备", "判定", "摸牌", "出牌", "弃牌", "结束"][lib.phaseName.indexOf(phase)];
                        game.log(player, "令", _status.currentPhase, "结束了" + name + "阶段");
                        player.line(_status.currentPhase, "thunder");
                        evt.skipped = true;
                    }
                }
},
            sub:true,
            forced:true,
           popup:false,
            charlotte:true,
            "_priority":1,
        },
    },
            },
            "ye_shoucang":{
               trigger:{
        player:"phaseDiscardBegin",
    },
    direct:true,
    filter:function(event,player){
        return player.countCards('h')>0;
    },
	check:function(event,player){
                return player.needsToDiscard();
            },
    content:function(){
        'step 0'
        player.chooseCard('h',get.prompt('ye_shoucang'),'展示任意张花色不同的手牌并令你的手牌上限于此回合内等量增加',[1,player.getCards('h').reduce((list,card)=>list.add(get.suit(card,player)),[]).length],function(card,player){
            return !ui.selected.cards.reduce((list,card)=>list.add(get.suit(card,player)),[]).includes(get.suit(card,player));
        }).set('complexCard',true).set('ai',function(card){
			if(player.needsToDiscard()) return true;
				return false;
});
        'step 1'
        if(result.bool){
			player.showCards(result.cards);
            player.addMark('ye_shoucang2',result.cards.length,false);
            player.addSkill('ye_shoucang2');
        }
    },
            },
			"ye_shoucang2":{
                   mod:{
        maxHandcard:function(player,num){
            return num+player.countMark('ye_shoucang2');
        },
    },
    onremove:true,
    charlotte:true,
    intro:{
        content:"手牌上限+#",
    },
	trigger:{
        player:"phaseEnd",
    },
    forced:true,
	direct:true,
	content:function(){
		var num=player.countMark('ye_shoucang2');
                        player.removeMark('ye_shoucang2',num,false);
player.removeSkill('ye_shoucang2');
},
            },
            "ye_qiangyu":{
                trigger:{
                    player:"gainAfter",
                },
                filter:function (event,player){
        return event.getParent().name=='draw'&&event.getParent(2).name!='ye_qiangyu';
    },
                content:function (){
        "step 0"
        player.draw(2);
        "step 1"
        player.chooseToDiscard('弃置一张♠手牌，否则弃置两张手牌',{suit:'spade'},1).set('ai',function(card){
return 9-get.value(card);
}).set('logSkill','ye_qiangyu');
        "step 2"
        if(result.bool){
            event.finish;
        }
        else{
 player.chooseToDiscard('弃置两张手牌',2,true);
        }
    },
            },
            "ye_mokai":{
                init:function (player){
        player.storage.ye_mokai=0;
    },
                mark:true,
                locked:true,
                marktext:"魔",
                intro:{
                    onunmark:true,
                    content:"已使用$次魔开",
                },
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){
        return (get.type(event.card)=='trick'&&event.card.isCard&&player.isPhaseUsing()&&
                get.color(event.card)=='black'&&player.countCards('e')>0&&player.storage.ye_mokai<player.hp);
    },
                content:function (){
        player.chooseToDiscard('弃置一张装备牌',1,'e',true);
        player.draw(2);
        player.storage.ye_mokai+=1;
    },
                group:"ye_mokai_clear",
                subSkill:{
                    clear:{
                        trigger:{
                            player:"phaseBefore",
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        content:function (){
                player.storage.ye_mokai=0;
            },
                        sub:true,
                    },
                },
                ai:{
                    result:{
                        player:2,
                    },
                },
            },
            "ye_yuxue":{
                trigger:{
                    player:"damageEnd",
                },
                filter:function(event,player){
        return player.hasSha();
    },
                direct:true,
                content:function(){
        "step 0"
        player.addSkill('ye_yuxue2');
        player.addMark('ye_yuxue2',1,false);
        player.chooseToUse({name:'sha'},'浴血：是否使用一张杀？',false).logSkill='ye_yuxue';
        "step 1"
        player.removeSkill('ye_yuxue2');
    },
            },
            "ye_yuxue2":{
                charlotte:true,
                trigger:{
                    player:"useCard1",
                },
                firstDo:true,
                forced:true,
                popup:false,
                onremove:true,
                filter:function(event,player){
        return event.card.name=='sha';
    },
                mod:{
                    targetInRange:function(card,player,target,now){
            var name=get.name(card);
            if(name=='sha') return true;
        },
                },
                content:function(){
        trigger.baseDamage+=player.countMark('ye_yuxue2');
        player.getStat().card.sha--;
        player.removeSkill('ye_yuxue2');
    },
            },
            "ye_shengyan":{
                trigger:{
                    source:"damageSource",
                },
                forced:true,
                content:function(){
        player.draw(trigger.num);
    },
            },
            "ye_pohuai":{
                priority:1,
                forced:true,
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                logTarget:function(event,player){
        return game.filterPlayer(function(current){
            return get.distance(player,current)<=1;
        }).sortBySeat();
    },
                content:() => {
        "step 0"
        player.judge(function(card){
            if(get.name(card)=='sha') return 2;
            return -1;
        }).judge2=function(result){
            return result.bool;
        };
        "step 1"
        if(result.judge<2){
            event.finish();return;
        }
        event.targets=game.filterPlayer(function(current){
            return get.distance(player,current)<=1&&current!=player;
        }).sortBySeat();
        event.targets.sort(lib.sort.seat);
        player.line(event.targets,'green');
        event.targets2=event.targets.slice(0);
        event.targets3=event.targets.slice(0);
        "step 2"
        if(event.targets2.length){
            event.targets2.shift().damage('nocard');
            event.redo();
        }
		"step 3"
            player.damage('nocard');
    },
            },
            "ye_yindu":{
                trigger:{
                    global:"dieBefore",
                },
                filter:function(event,player){
        return player.storage.ye_yindu<=0&&event.player!=player;
    },
                init:function (player){
        player.storage.ye_yindu=0;
    },
                mark:false,
                intro:{
                    content:"mark",
                },
                content:function(){
        "step 0"
		_status.dying.remove(trigger.player);
						game.broadcast(function(list){
							_status.dying=list;
						},_status.dying);
        player.storage.ye_yindu+=1;
        "step 1"
        trigger.player.die();
        player.draw(2);
        "step 2"
        player.storage.ye_yindu-=1;
    },
	group:["ye_yindu_dameji"],
                subSkill:{
                    dameji:{
                         trigger:{
        source:"damageBegin",
    },
	prompt:"是否令此伤害加一并摸一张牌",
    filter:function (event,player){
         return event.notLink()&&(event.player.hp==1);
    },
	check:function(event,player){
        return get.damageEffect(event.player,player,player)>0;
    },
    content:function (){
       'step 0'
    player.draw()   
     player.line(trigger.player,'red');
       trigger.num++;
  },
  sub:true,
                    },
					},
	},
            "ye_huanming":{
                trigger:{
                    source:"damageBefore",
                },
                unique:true,
                limited:true,
                skillAnimation:"epic",
                animationColor:"thunder",
                multitarget:true,
                multiline:true,
				prompt:function(event,player){
					return '换命：是否防止此伤害并与'+get.translation(event.player)+'交换体力值？';
				},
                filter:function(event,player){
        return event.player!=player&&event.player.hp!=player.hp;
    },
                check:function(event,player){
        return event.player.hp>player.hp&&get.attitude(player,event.player)<0;
    },
                content:function(){
        trigger.cancel();
        var tmp=player.hp;
        player.hp=trigger.player.hp;
        trigger.player.hp=tmp;
        player.update();
        trigger.player.update();
        player.awakenSkill('ye_huanming');
    },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function(player,skill){
        player.storage[skill]=false;
    },
                ai:{
                    skillTagFilter:function(player){
            if(!event.player.Hp>player.Hp) return false;
        },
                    result:{
                        player:function(player,target){
                if(event.player.Hp>player.Hp) return 5;
                return -2;
            },
                    },
                },
                markimage:"extension/OLUI/image/player/marks/xiandingji.png",
            },
            "ye_chuanwu":{
                mod:{
                    globalFrom:function(from,to){
            if(to.hp<=2) return -Infinity;  
        },
                },
            },
            "ye_ningshi":{
                forced:true,
                trigger:{
                    player:"useCardToPlayered",
                },
                logTarget:"target",
                filter:function(event,player){
        return _status.currentPhase==player&&event.target!=player&&event.targets.length==1
    },
                check:function(event,player){
        return get.attitude(player,event.target)<=0;
    },
                content:function(){
        trigger.target.loseHp();//.set('source',player);
    },
	ai:{
        threaten:2.5,
        expose:0.1,
    },
            },
            "ye_gaoao":{
                locked:true,
                subSkill:{
                    discard:{
                        trigger:{
                            player:"gainAfter",
                        },
                        forced:true,
                        filter:function(event,player){
                if(_status.currentPhase!=player){
                    var he=player.getCards('h');
                    var bool=false;
                    player.getHistory('gain',function(evt){
                        if(!bool&&evt&&evt.cards){
                            for(var i=0;i<evt.cards.length;i++){
                                if(he.contains(evt.cards[i])) bool=true;break;
                            }
                        }
                    });
                    return bool;
                }
                return false;
            },
                        content:function(){
                var he=player.getCards('h');
                var list=[];
                player.getHistory('gain',function(evt){
                    if(evt&&evt.cards){
                        for(var i=0;i<evt.cards.length;i++){
                            if(he.contains(evt.cards[i])) list.add(evt.cards[i]);
                        }
                    }
                });
                player.$throw(list,1000);
                player.lose(list,ui.discardPile,'visible');
                game.log(player,'将',list,'置入弃牌堆');
            },
                        sub:true,
                    },
                    mark:{
                        trigger:{
                            player:"gainBegin",
                            global:"phaseBeginStart",
                        },
                        silent:true,
                        filter:function(event,player){
                return event.name!='gain'||player!=_status.currentPhase;
            },
                        content:function(){
                if(trigger.name=='gain') trigger.gaintag.add('ye_gaoao');
                else player.removeGaintag('ye_gaoao');
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
                ai:{
                    threaten:1.2,
                    nogain:1,
                    skillTagFilter:function(player){
            return player!=_status.currentPhase;
        },
                },
                group:["ye_gaoao_discard","ye_gaoao_mark"],
            },
            "ye_mingyun":{
                trigger:{
                    global:"judgeBefore",
                },
                direct:true,
                content:function(){
        "step 0"
					var cards=get.cards(2);
					for(var i=cards.length-1;i>=0;i--){
						ui.cardPile.insertBefore(cards[i],ui.cardPile.firstChild);
					}
					game.updateRoundNumber();
					event.cards=cards;
					event.videoId=lib.status.videoId++;
					game.broadcastAll(function(player,id,cards){
						var str;
						if(player==game.me&&!_status.auto){
							if(player.countCards('h')<=player.maxHp){
						 str='命运：'+get.translation(trigger.player)+'即将进行'+(trigger.judgestr||'')+'判定，请选择要置顶的牌并获得另一张牌';
					 }
							else str='命运：'+get.translation(trigger.player)+'即将进行'+(trigger.judgestr||'')+'判定，请选择要置顶的牌';
						}
						else str=get.translation(player)+'发动了【命运】';
						var dialog=ui.create.dialog(str,cards);
						dialog.videoId=id;
					},player,event.videoId,event.cards);
					game.addVideo('showCards',player,['命运',get.cardsInfo(event.cards)]);
					if(!event.isMine()&&!event.isOnline()) game.delayx();
					'step 1'
					player.chooseButton(['命运：选择一张置顶',cards],true).set('ai',button=>{
						if(get.attitude(player,trigger.player)>0){
                return trigger.judge(button.link);
            }
            if(get.attitude(player,trigger.player)<0){
                return -trigger.judge(button.link);
            }
            return 0;
					}).set('dialog',event.videoId);
					'step 2'
					game.broadcastAll('closeDialog',event.videoId);
					if(result.bool){
						game.log(player,'发动了','#g【命运】','将',result.links[0],'置顶了');
					 if(player.countCards('h')<=player.maxHp){
						 player.gain(cards.removeArray(result.links).filter(i=>get.position(i)=='c'));
						 player.$draw(cards.removeArray(result.links).filter(i=>get.position(i)=='c'));
						game.log(player,'获得了',cards.removeArray(result.links).filter(i=>get.position(i)=='c'));
					 }
					}
						 for(var i=event.cards.length-1;i>=0;i--){
                ui.cardPile.insertBefore(event.cards[i],ui.cardPile.firstChild);
        }
					'step 3'
						game.updateRoundNumber();
    },
                group:["ye_mingyun_1"],
	subSkill:{
                    1:{
						trigger:{
                    player:"phaseEnd",
                },
				direct:true,
                        content:function(){
							"step 0"
        var cards=get.cards(2);
        event.cards=cards;
        var next=player.chooseCardButton(cards,'是否选择获得一张牌',[1]).set('ai',function(card){
                return get.value(cards);
            });
        "step 1"
        if(result.bool){
            player.gain(result.links);
			player.$draw(result.links);
			game.log(player,'发动了','#g【命运】','获得了',result.links);
            game.delay(2);
        }
        for(var i=event.cards.length-1;i>=0;i--){
            if(!result.bool||!result.links.contains(event.cards[i])){
                ui.cardPile.insertBefore(event.cards[i],ui.cardPile.firstChild);
            }
        }
		'step 2'
        game.updateRoundNumber();
        game.delayx();
            },
                        sub:true,
                    },
                },
            ai:{
					rejudge:true,
					tag:{
						rejudge:0.6
					}
				},
				},
            "ye_kexie":{
            ai:{
        threaten:function (player, target) {
            if (target.hp == 1) return 0.2;
            return 0.6;
        },
        effect:{
            target:function (card, player, target, current) {
                if (!target.hasFriend()) return;
                if (target.hasFriend() && get.tag(card, 'damage')) return [1, 0, -1, -2.5];
            },
        },
    },
                filter:function(event,player){
        return player.isDying();
    },
	trigger:{
        player:"dying",
    },
    content:function(){
        'step 0'
        var targets=game.filterPlayer();
        targets.remove(player);
        event.targets=targets;
		player.line(event.targets,'green');
        'step 1'
        if(event.targets.length){
            var current=event.targets.shift();
            if(!current.isDying()){
                current.chooseBool('是否令'+get.translation(player)+'回复一点体力？').set('ai',function(){
                    return get.attitude(_status.event.player,_status.event.target)>2;
                }).set('target',player);
                event.current=current;
            }
            else{
                event.redo();
            }
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.bool){
            event.current.line(player,'green');
            game.log(event.current,'令',player,'回复一点体力');
            player.recover();
			event.current.draw(2);
			event.current.loseHp();
        }
        if(event.targets.length){
            event.goto(1);
        }
    },
            },
            "ye_xueyi":{
				zhuSkill:true,
				unique:true,
                trigger:{
                    global:"recoverEnd",
                },
                filter:function(event,player){
					if(event.player==player) return false;
        if(event.player.countCards('ej')<player.countCards('ej')&&event.player.group!='hong') return false;
        return player.hasZhuSkill('ye_xueyi');
    },
                direct:true,
                content:function(){
        'step 0'
        trigger.player.chooseBool('是否发动【血裔】，令'+get.translation(player)+'摸一张牌？').set('choice',get.attitude(trigger.player,player)>0);
        'step 1'
        if(result.bool){
            trigger.player.logSkill('ye_xueyi',player);
            trigger.player.line(player,'green');
            player.draw();
        }
    },
                "audioname2":{
                    yuanshu:"weidi",
                },
            },
            "ye_jinguo":{
                markimage:"extension/叶原之夜/image/mark/@jin.png",
                marktext:"禁忌",
                intro:{
                    name:"禁忌(禁)",
                    "name2":"禁",
                },
                trigger:{
                    player:"phaseUseEnd",
                },
                forced:true,
                content:function(){
        "step 0"
        player.judge(function(card){
            if(get.suit(card)=='spade') return 2;
            return -2;
        }).judge2=function(result){
            return result.bool;
        };
        "step 1"
        if(result.judge>=2){
			var num=player.countMark('ye_jinguo');
                    if(num){
                        player.removeMark('ye_jinguo',1);
                    }
            player.addTempSkill('ye_jinguo2','phaseAfter')
            event.finish();return;
        }
        if(player.countMark('ye_jinguo')<=1) event.finish();
        "step 2"
        var num1=player.countMark('ye_jinguo');
        var num2=Math.floor(num1/2);
        player.chooseToDiscard('hes','弃置'+num1+'张牌，或者失去'+num2+'点体力',num1).set('ai',function(card){
            return 100-get.value(card);
        });
        "step 3"
        if(result.bool){
            event.finish();
        }
        else{
 player.loseHp(Math.floor(player.countMark('ye_jinguo')/2));
        }
    },
            },
            "ye_jinguo2":{
                forced:true,
                trigger:{
                    player:"phaseDiscardBefore",
                },
                content:function(){
                trigger.cancel();
            },
            },
            "ye_huimie":{
                unique:true,
                enable:"phaseUse",
                usable:1,
                filterTarget:function(card,player,target){
        return player!=target
    },
                selectTarget:function(){
        var player=_status.event.player
        return 1;
    },
                multitarget:true,
                multiline:true,
                line:"fire",
                content:function(){
        'step 0'
        player.addMark('ye_jinguo',1,false);
        event.delay=false;
        for(var i=0;i<targets.length;i++){
            if(!targets[i].isLinked()){
                targets[i].link(true);
                event.delay=true;
            }
        }
        'step 1'
        if(event.delay){
            game.delay();
        }
        'step 2'
        targets[0].damage('fire','nocard');
    },
                ai:{
                    damage:true,
                    fireAttack:true,
                    threaten:1.5,
                    order:7,
                    result:{
                        target:function(player,target){
                var eff=get.damageEffect(target,player,target,'fire');
                if(target.isLinked()){
                    return eff/10;
                }
                else{
                    return eff;
                }
            },
                    },
                },
            },
            "ye_kuangyan":{
				usable:1,
                unique:true,
                trigger:{
                    player:"dying",
                },
                filter:function(event,player,name){
        return _status.currentPhase!==player;
    },
                content:function(){
        "step 0"
        if(player.hp<1){
            player.recover(1-player.hp);
        }
        "step 1"
        player.addMark('ye_jinguo',1,false);
        "step 2"
        _status.currentPhase.damage();
    },
                ai:{
                    "maixie_defend":true,
                    expose:0.4,
                },
            },
            "ye_chaoren":{
                                locked: true,
                                popup: false,
                                init: function (player) {
                                    if (!player.ye_chaoren) {
                                        var num = 1
                                        var list = [];
                                        for (var i = 0; i < num; i++) {
                                            list.push(game.createCard(ui.special))
                                        }
                                        var reupdate = function () {
                                            var cards = player.ye_chaoren[1];
                                            var suit
                                            var num
                                            var name
                                            var nature
                                            var currentChild = []
                                            if (cards.length < 1) {
                                                var card1 = game.createCard({ name: 'ying' })
                                                player.directgains([card1], null, 'ye_chaoren1');
                                                player.ye_chaoren[1].push(card1)
                                            }
                                            for (var i = 0; i < cards.length; i++) {

                                                suit = ui.cardPile.childNodes[i].suit
                                                num = ui.cardPile.childNodes[i].number
                                                name = ui.cardPile.childNodes[i].name
                                                nature = ui.cardPile.childNodes[i].nature
                                                if (ui.cardPile.childNodes[i]) {
                                                    currentChild = ui.create.card();
                                                    // game.broadcastAll(function (currentChild, i, suit, num, name, nature) {
                                                    currentChild.init([
                                                        suit,
                                                        num,
                                                        name,
                                                        nature
                                                    ]);
                                                    //  }, currentChild, i, suit, num, name, nature)
                                                }
                                                else
                                                    currentChild = game.createCard({ name: 'ying', suit: 'spade', number: '1' })
                                                if (ui.cardPile.childNodes[i]) {
                                                    //game.broadcastAll(function (cards, currentChild, i) {
                                                    cards[i].init(currentChild);
                                                    //}, cards, currentChild, i)
                                                    cards[i].cardid = ui.cardPile.childNodes[i].cardid,
                                                        cards[i].wunature = ui.cardPile.childNodes[i].wunature,
                                                        cards[i].storage = ui.cardPile.childNodes[i].storage,
                                                        cards[i].relatedCard = ui.cardPile.childNodes[i];

                                                }
                                                else {
                                                    //   game.broadcastAll(function (cards, i) {
                                                    cards[i].init(game.createCard({ name: 'ying', suit: 'spade', number: '1' }))
                                                    //  }, cards, i)
                                                }
                                            }
                                        };
                                        player.ye_chaoren = [setInterval(reupdate, 500), list];
                                        setTimeout(function () {
                                            for (var num = 0; num < list.length; num++) {

                                                player.directgains([list[num]], null, 'ye_chaoren1');
                                            }
                                            ui.updatehl()
                                        }, 750);
                                    }
                                },
                                onremove: function (player) {
                                    if (player.ye_chaoren) {
                                        clearInterval(player.ye_chaoren[0]);
                                        delete player.ye_chaoren;
                                    }
                                },
                                mod: {


                                    cardUsable(card, player, num) {
                                        if (card.name == 'sha' || card.name == 'jiu') return num + player.hp;
                                    },
                                    aiOrder(player, card, num) {
                                        if (get.itemtype(card) == 'card' && card.hasGaintag('ye_chaoren1')) return num + 4;
                                    },
                                    aiValue: (player, card, num) => {
                                        if (card.hasGaintag('ye_chaoren1')) return 2;
                                    },
                                    aiUseful(player, card, num) {
                                        if (get.itemtype(card) == 'card' && card.hasGaintag('ye_chaoren1')) return num + 10;
                                    },

                                },

                                group: 'ye_chaoren_use',
                                subSkill: {
                                    use: {
                                        trigger: {
                                            player: ['useCardBegin', 'respondBegin']
                                        },
                                        direct: true,
                                        forced: true,
                                        locked: true,
                                        filter: function (event, player) {
                                            for (var card of event.cards) {
                                                if (card.relatedCard) return true
                                            }

                                        },
                                        content: function () {
                                            var mark = 0
                                            for (var num = 0; num < player.ye_chaoren[1].length; num++) {
                                                for (var card of trigger.cards) {
                                                    if (card == player.ye_chaoren[1][num]) {

                                                        player.ye_chaoren[1].splice(num, 1)
                                                        card.relatedCard.fix();
                                                        card.relatedCard.remove();
                                                        card.relatedCard.destroyed = true;
                                                        mark = 1
                                                        break
                                                    }
                                                }
                                                if (mark) {
                                                    num--
                                                    mark = 0
                                                }
                                            }
                                        }
                                    },
                                },
            },
            "ye_shiyu":{
                trigger:{
                    player:"dying",
                },
                forced:true,
                filter:function (event,player){
        return _status.currentPhase!=player;
    },
                content:function (){
        'step 0'
        player.discard(player.getCards('j'));
        player.link(false);        player.turnOver(false);        trigger.untrigger();
        trigger.finish();
        'step 1'
        var evt=_status.event.getParent('phase');
        if(evt){
            game.resetSkills();
            _status.event=evt;
            _status.event.finish();
            _status.event.untrigger(true);
        }
        player.insertPhase();
    },
                group:["ye_shiyu_die"],
                subSkill:{
                    die:{
                        trigger:{
                            player:"phaseAfter",
                        },
                        forced:true,
                        charlotte:true,
                        filter:function (event,player,name){
                return player.hp<=0;
            },
                        content:function (){
                    "step 0"
                    event.forceDie=true;
                    _status.dying.unshift(player);
                    game.broadcast(function(list){
                        _status.dying=list;
                    },_status.dying);
                    event.trigger('dying');
                    game.log(player,'濒死');
                    "step 1"
                    delete event.filterStop;
                    if(player.hp>0){
                        _status.dying.remove(player);
                        game.broadcast(function(list){
                            _status.dying=list;
                        },_status.dying);
                        event.finish();
                    }
                    else if(!event.skipTao){
                        var next=game.createEvent('_save');
                        var start=false;
                        var starts=[_status.currentPhase,event.source,event.player,game.me,game.players[0]];
                        for(var i=0;i<starts.length;i++){
                            if(get.itemtype(starts[i])=='player'){
                                start=starts[i];break;
                            }
                        }
                        next.player=start;
                        next._trigger=event;
                        next.triggername='_save';
                        next.forceDie=true;
                        next.setContent(lib.skill._save.content);
                    }
                    "step 2"
                    _status.dying.remove(player);
                    game.broadcast(function(list){
                        _status.dying=list;
                    },_status.dying);
                    if(player.hp<=0&&!player.nodying) player.die(event.reason);
            },
                        sub:true,
                    },
                },
            },
            "yee_juhe":{
                trigger:{
                    player:"phaseDrawEnd",
                },				check:function(event,player){        return player.hp<=3;    },
                content:function(){        player.draw(3);        if(player.hp>0){        player.chooseToDiscard(player.hp,true,"h");
        }
    },
            },
            "ye_youyu":{
                trigger:{
                    player:"phaseDiscardEnd",
                },
                frequent:true,
                filter:function (event,player){
        if(player.countCards('h')<=player.Hp) return true;
        if(!player.isMaxHandcard(true)) return true;
        if(!player.isMaxHp(true)) return true;
    },
                content:function (){
        if(player.countCards('h')<player.hp) player.draw();
        if(!player.isMaxHandcard()||!player.isMaxHp()) player.draw();
    },
                ai:{
                    expose:0.1,
                    threaten:0.5,
                },
            },
            "ye_yigou":{
                trigger:{
                    player:"useCardAfter",
                },
                direct:true,
                filter:function(event,player){
        return event.targets.length>0&&['basic','trick'].contains(get.type(event.card))&&(get.itemtype(event.cards)=='cards'&&get.position(event.cards[0],true)=='o');
    },
                content:function(){
"step 0"
if(trigger.targets.length>0){
player.chooseTarget(get.prompt2('ye_yigou'),function(card,player,target){
return trigger.targets.contains(target);
}).ai=function(target){
if(get.effect(player,trigger.card,target,player)>=0||target==player){
return 4;
}
if(get.attitude(player,target)<=0){
return 2;
}
return 0;
};
}
"step 1"
if(result.bool&&result.targets){
player.logSkill('ye_yigou',result.targets);
result.targets[0].addSkill('ye_yigou2');
result.targets[0].addToExpansion(trigger.cards,player,'give').gaintag.add('ye_yigou2');
event.target=result.targets[0];
    }
"step 2"
if(event.target){
if(result.targets[0].getExpansions('ye_yigou2').length>1){
for(var i=0;i<trigger.cards.length;i++){
for(var j=0;j<result.targets[0].getExpansions('ye_yigou2').length;j++){
if(result.targets[0].getExpansions('ye_yigou2')[j].name==trigger.cards[i].name&&result.targets[0].getExpansions('ye_yigou2')[j]!=trigger.cards[i]){
result.targets[0].loseToDiscardpile([result.targets[0].getExpansions('ye_yigou2')[j],trigger.cards[i]]);
 player.useCard({name:trigger.cards[i].name,isCard:true,},result.targets[0],false,); 
break;
}
}
}

}
}


    },
            },
            "ye_yigou2":{
                intro:{
                    content:"expansion",
                    markcount:"expansion",
                },
                onremove:function (player,skill){
        var cards=player.getExpansions(skill);
        if(cards.length) player.loseToDiscardpile(cards);
    },
                locked:false,
                unique:true,
                silent:true,
                popup:false,
                marktext:"构",
                forced:true,
            },
                 "ye_tabitabi":{
                trigger:{
                    player:"phaseDrawBegin2",
                },
                forced:true,
                filter:function (event,player){
        return !event.numFixed;
    },
                content:function (){
    trigger.num-=1;
    },
                group:["ye_tabitabi_card","ye_tabitabi_lose"],
                subSkill:{
                    card:{
                        sub:true,
                        trigger:{
                            global:"phaseBegin",
                        },
                        forced:true,
                        content:function (){ 
    var list=[];
  if(ui.discardPile.childElementCount>0){
  if(ui.discardPile.childElementCount<=4){
    for(var i=0;i<ui.discardPile.childElementCount;i++){
            var node=ui.discardPile.childNodes[i];
    list.push(node);    
    }
  }
    else{
  var nodes=[];
    for(var i=0;i<ui.discardPile.childElementCount;i++){
            nodes[i]=ui.discardPile.childNodes[i];
  }
    for(var i=0;i<4;i++){
        var ka=nodes.randomGet();
        list[i]=ka;
        nodes.remove(ka);
        }
    }
        if(list.length>0){
   player.gain(list,'gain2');
        }
       game.updateRoundNumber();
        }
            },
                    },
                    lose:{
                        usb:true,
                        trigger:{
                            global:"phaseEnd",
                        },
                        forced:true,
                        filter:function (event,player){
        return event.player.isAlive();
    },
                        content:function (){  
        var num=player.countCards('h');
            if(num>0){
                player.discard(player.getCards('h'));
            }
    },
                        sub:true,
                    },
                },
            },
            "ye_shiying":{
                trigger:{
                    global:"gameDrawAfter",
                    player:"enterGame",
                },
                audio:"ext:叶原之夜:2",
                nobracket:true,
                forced:true,
                locked:false,
                content:function (){ 
        player.disableEquip('equip1');
        player.disableEquip('equip2');
        player.disableEquip('equip3');
        player.disableEquip('equip4');
        player.disableEquip('equip5');
    },
                group:["ye_shiying_dameji"],
                subSkill:{
                    dameji:{
                        trigger:{
                            player:"damageEnd",
                            source:"damageEnd",
                        },
                        direct:true,
                        sub:true,
                        content:function (){
        player.logSkill('ye_shiying');
    for(var i=0;i<trigger.num;i++){
       player.chooseToEnable();
      }
      },
                    },
                },
            },
            "ye_kedi":{
                trigger:{
                    global:"phaseBegin",
                },
                audio:"ext:叶原之夜:2",
                filter:function (event,player){
        return player.countDisabled()<5;
    },
                check:function (event,player){
    if(!player.ye_kedi||player.ye_kedi.length<=0) return player.countDisabled()<5;
       var att=get.attitude(player,event.player)>0;
   if(player.ye_kedi.contains('判定阶段')&&player.ye_kedi.contains('弃牌阶段')&&att>0) return false;
   if(player.ye_kedi.contains('出牌阶段')&&player.ye_kedi.contains('摸牌阶段')&&att<0) return false;
        return player.countDisabled()<5;
    },
                content:function (){
      'step 0'
         player.chooseToDisable().ai=function(event,player,list){
                if(list.contains('equip5')) return 'equip5';
                return list.randomGet();
            };
        player.draw(2);
        if(!player.ye_kedi){
            player.ye_kedi=[];
        }
        var controls=[];
        var list=['判定阶段','摸牌阶段','出牌阶段','弃牌阶段'];
        for(var i=0;i<list.length;i++){
            if(!player.ye_kedi.contains(list[i])){
            controls.push(list[i]);    
            }
        }
        player.chooseControl(controls).set('ai',function(){
        var att=get.attitude(player,trigger.player);
        if(controls.length==1){
            if(((controls[0]=='判定阶段'||controls[0]=='弃牌阶段')&&att>0)||((controls[0]=='出牌阶段'||controls[0]=='摸牌阶段')&&att<0)) return controls[0];
        }
        if((controls.contains('判定阶段')||controls.contains('弃牌阶段'))&&att>0){
        return (trigger.player.countCards('h')>=3&&controls.contains('弃牌阶段'))?'弃牌阶段':'判定阶段';    
        }
        if((controls.contains('出牌阶段')||controls.contains('摸牌阶段'))&&att<0){
        return (trigger.player.countCards('h')>=3&&controls.contains('出牌阶段'))?'出牌阶段':'摸牌阶段';    
        }
            return controls[0];
        }).set('prompt','刻刻帝：你可选择一个阶段令其本回合跳过');
        'step 1'
        player.popup(result.control);
        game.log(player,'选择了跳过',result.control);
            player.ye_kedi.push(result.control);
        switch(result.control){
            case '判定阶段':
                trigger.player.skip('phaseJudge');
                break;
            case '摸牌阶段':
                trigger.player.skip('phaseDraw');
                break;
            case '出牌阶段':
                trigger.player.skip('phaseUse');
                break;
            case '弃牌阶段':
                trigger.player.skip('phaseDiscard');
                break;
        }
        'step 2'
        if(player.ye_kedi.length>=4){
        player.ye_kedi=[]    
        }
    },
                ai:{
                    maixie:true,
                    threaten:0.5,
                    result:{
                        player:function (player,target){     
                return 2;
            },
                    },
                },
            },
            "ye_shifang_debuff":{
                trigger:{
                    player:"useCardAfter",
                },
                forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                content:function (){ 
    player.draw();
            player.chooseToDiscard("h", 2, true);
    },
	 group:["ye_shifang_debuff_1"],
                subSkill:{
                    "1":{
                        trigger:{
        source:"damageEnd",
    },
                        forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                        content:function(){
        player.draw(2);
            player.chooseToDiscard("h", true);
    },
                        sub:true,
                    },
                },
            
            },
            "ye_shifang":{
				"_priority":1,
                forced:true,
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                audio:"ext:叶原之夜:2",
                content:function (){ 
					event.cards = get.cards(player.getDamagedHp()+2);
        player.showCards(event.cards);
        player.gain(event.cards,'gain2');
        player.addTempSkill('ye_shifang_debuff','phaseEnd');
  
    },
            },
            "ye_bixin":{
                trigger:{
                    player:["phaseDrawBefore"],
                },
                forced:true,
                filter:function (event,player){
        return player.hp==1;
    },
                content:function (){ 
    player.recover();
 trigger.cancel(); 
     },
            },
            "ye_gufangzishang":{
                nobracket:true,
                trigger:{
                    player:"phaseJudgeBegin",
                },
                filter:function(misuzu){
        return misuzu.player.countCards('j')>0;
    },
                check:function(event,player){
        return get.attitude(player,event.player)>1;
    },
                logTarget:"player",
                content:function(){
  player.gain(trigger.player.getCards('j'),trigger.player,'give');
    },
                ai:{
                    effect:{
                        target:function(card){
                if(get.type(card)=='delay') return 'zerotarget';
            },
                    },
                },
            },
            "ye_shixie":{
                trigger:{
                    source:"damageSource",
                },
                forced:true,
                init:function(player){
        player.storage.ye_shixie=0;
    },
                intro:{
                    content:"已造成#点伤害",
                },
                content:function(){
                'step 0'
        event.count=trigger.num;
        'step 1'
        event.count--;
        player.recover();
        player.storage.ye_shixie+=1;
        if(player.hasSkill('ye_shixie')){
            player.markSkill('ye_shixie');
            player.syncStorage('ye_shixie');
        }
        player.update();
        if(event.count<=0) event.finish();
        'step 2'
            event.goto(1);
    },
                group:["ye_shixie_1","ye_shixie_2"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"recoverBefore",
                        },
                        filter:function(event,player){
        return event.getParent().name!='ye_shixie'&&!_status.dying.length;
    },
                        forced:true,
                        content:function(){
        trigger.cancel();
        player.draw(2);
    },
                        sub:true,
                    },
                    "2":{
                        enable:"phaseUse",
                        filter:function(event,player){
                return player.storage.ye_shixie>=2;
            },
                        content:function(){
            player.storage.ye_shixie-=2;
                player.draw();
            },
                        ai:{
                            order:99,
                            result:{
                                player:1,
                            },
                        },
                        sub:true,
                    },
                },
            },
            "ye_ziye":{
                derivation:["ye_anyue"],
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                popup:false,
                init:function(player){
        player.storage.ye_ziye=0;
    },
                intro:{
                    content:"已造成#点伤害",
                },
                unique:true,
                juexingji:true,
                content:function(){
        player.storage.ye_ziye+=trigger.num;
        if(player.hasSkill('ye_ziye')){
            player.markSkill('ye_ziye');
            player.syncStorage('ye_ziye');
        }
        if(player.storage.ye_ziye>=3){
            event.trigger('ye_ziyeAwaken');
        }
    },
                group:["ye_ziye_awaken","ye_ziye_awaken2"],
                subSkill:{
                    awaken:{
                        trigger:{
                            player:"ye_ziyeAwaken",
                        },
                        forced:true,
                        skillAnimation:true,
                        animationColor:"gray",
                        content:function(){
            player.loseMaxHp();
        player.addSkill('ye_anyue');
        game.log(player,'获得了技能','#g【暗月】')
        player.awakenSkill('ye_ziye');
            },
                        sub:true,
                    },
                    "awaken2":{
                        trigger:{
                            source:"damageBegin",
                        },
                        filter:function(event,player){
        return event.player.hp<=event.num;
    },
                        forced:true,
                        skillAnimation:true,
                        animationColor:"gray",
                        content:function(){
            player.loseMaxHp();
        player.addSkill('ye_anyue');
        game.log(player,'获得了技能','#g【暗月】')
        player.awakenSkill('ye_ziye');
            },
                        sub:true,
                    },
                },
                markimage:"extension/OLUI/image/player/marks/juexingji.png",
            },
            "ye_anyue":{
                trigger:{
                    global:"recoverEnd",
                },
                direct:true,
                filter:function(event,player){
        return event.player!=player&&!event.player.isMinHp()&&event.player.isAlive()&&lib.filter.targetEnabled({name:'sha'},player,event.player);
    },
                content:function(){
        'step 0'
player.chooseBool('是否发动【暗月】，视为对'+get.translation(trigger.player)+'使用一张杀？').set('choice',get.damageEffect(trigger.player,player,player)>0);
        'step 1'
        if(result.bool){
            player.logSkill('ye_anyue');
            player.turnOver();
            player.addTempSkill('unequip','useCardAfter');  
			player.addTempSkill('qinggang_skill','useCardAfter');
				player.useCard({name:'sha',isCard:true},trigger.player,false);
        }
    },
            },
            "ye_dongjie":{
				markimage:"extension/叶原之夜/image/mark/@dong.png",
                marktext:"冻",
                intro:{
                    name:"冻结(冻)",
                    "name2":"冻",
                },
                forced:true,
                trigger:{
                    source:"damageAfter",
                },
                content:function(){
        trigger.player.addMark('ye_dongjie',trigger.num);
    },
                group:["ye_dongjie_1","ye_dongjie_2"],
                subSkill:{
                    "1":{
                        trigger:{
                            global:"phaseUseBegin",
                        },
                        filter:function(event,player){
        return event.player.hasMark('ye_dongjie');
    },
	frequent:true,
                        check:function(event,player){
        return true;
    },
                        content:function(){
							'step 0'
                var choices=[];
                choices.push('摸牌');
                choices.push('弃牌');
                choices.push('cancel2');
                player.chooseControl(choices).set('prompt','冻结：是否令'+get.translation(trigger.player)+'摸牌或弃牌？').set('ai',function(){
                    if(get.attitude(player,trigger.player)<0) return '弃牌';
                    if(get.attitude(player,trigger.player)>0) return '摸牌';
                    return 'cancel2';
                });
                'step 1'
                if(result.control!='cancel2'){
                    if(result.control=='摸牌'){
                        var num=trigger.player.countMark('ye_dongjie');
                    if(num){
                        trigger.player.removeMark('ye_dongjie',num);
						trigger.player.draw(num);
                    }
				}
                    else{
                        var num=trigger.player.countMark('ye_dongjie');
                    if(num){
                        trigger.player.removeMark('ye_dongjie',num);
						trigger.player.chooseToDiscard('he',num,true);
                    }
                }
			}
                else event.finish();
                    }
                        
                    },
                    "2":{
                        trigger:{
                            player:"phaseBegin",
                        },
						forced:true,
                        check:function(event,player){
        return true;
    },
                        content:function(){
        event.list = game.filterPlayer(function(current) {
return true;
});
if(event.list.length>0){
var target = event.list.randomGet();
target.addMark('ye_dongjie',1);
}
    },
                        sub:true,
                    },
                },
            },
            "ye_bingpo":{
                usable:1,
                trigger:{
                    player:"damageBegin",
                },
                filter:function(event,player){
        if(event.num<player.hp) return false;
        if(event.nature=='fire') return false;
        return true;
    },
                forced:true,
                content:function(){
        trigger.cancel();
    },
                group:["ye_bingpo_roundcount"],
            },
            "ye_xunshi":{
                trigger:{
                    global:"useCardToTarget",
                },
                forced:true,
                filter:function(event,player){
        if(!event.targets) return false;
        if(event.player==player) return false;
        if(event.targets.contains(player)) return false;
        var type=get.type(event.card);
		var name=get.name(event.card);
        if(name!='sha'&&type!='trick'&&name!='tao') return false;
  if(event.player.hp>=player.hp&&event.player.countCards('h')>=player.countCards('h')) return true;
    },
                autodelay:true,
                content:function(){
        player.draw();
        trigger.getParent().targets.add(player);
        trigger.player.line(player,'green');
    },
            },
            "ye_jidong":{
                trigger:{
                    target:"useCardToTargeted",
                },
                direct:true,
                logTarget:"player",
                filter:function(event,player){
        if(event.card.name!='sha'&&event.card.name!='juedou') return false;
        if(!player.countCards('h',{type:'basic',})) return false;
        return true;
    },
                content:function(){
        'step 0'
        player.chooseToDiscard('hes','是否弃置一张基本牌，发动【急冻】？',{type:'basic'}).set('ai',function(card){
            if(_status.event.nono) return 0;
            return 7+card.number-get.useful(card);
        });
        'step 1'
        if(result.cards[0]){
        var num=get.number(result.cards[0]);
        if(num>=13||!trigger.player.hasCard(function(card){
            if(_status.connectMode&&get.position(card)=='h') return true;
            return get.number(card)>num;
        },'he')) event._result={bool:false};
        else trigger.player.chooseToDiscard('h',function(card){
            return get.number(card)>_status.event.number;
        },'弃置一张点数大于'+get.cnNumber(num)+'的手牌，或令'+get.translation(trigger.card)+'对其无效').set('number',num).set('ai',function(card){
            if(get.attitude(trigger.targets,player)<0) return false;
            return 6-get.value(card);
        });
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.bool){
            event.finish();
        }
        else{
            trigger.targets.remove(player);
            trigger.getParent().triggeredTargets2.remove(player);
            trigger.untrigger();
        }
    },
                ai:{
                    effect:{
                        target:function(card,player,target,current){
                if(card.name=='sha'&&player.hp>target.hp&&get.attitude(player,target)<0){
                    var num=get.number(card);
                    if(typeof num!='number') return false;
                    var bs=player.getCards('h',function(cardx){
                        return (get.number(cardx)>num&&!['','',''].contains(cardx.name));
                    });
                    if(bs.length<2) return 0;
                    if(player.hasSkill('jiu')||player.hasSkill('tianxianjiu')) return;
                    if(bs.length<=2){
                        for(var i=0;i<bs.length;i++){
                            if(get.value(bs[i])<6){
                                return [1,0,1,-0.5];
                            }
                        }
                        return 0;
                    }
                    return [1,0,1,-0.5];
                }
            },
                    },
                },
            },
            "ye_zhanshu":{
				mod:{
                aiOrder:function(player,card,num){
                    if(num>0&&get.itemtype(card)==='card') return num+0.16;
                },
                aiValue:function(player,card,num){
                    if(num>0&&get.itemtype(card)==='card') return 2*num;
                },
                aiUseful:function(player,card,num){
                    if(num>0&&!player._ye_zhanshu_mod&&get.itemtype(card)==='card'){
                        if(player.canIgnoreHandcard(card)) return Infinity;
                        player._ye_zhanshu_mod=true;
                        if(player.hp<3&&player.needsToDiscard(player.countCards('h',(cardx)=>{
                            if(player.canIgnoreHandcard(cardx)||get.useful(cardx)>6) return true;
                            return false;
                        }))) return num*1.5;
                        return num*10;
                    }
                },
            },
                usable:1,
    trigger:{
                player:["useCardAfter","respondAfter"],
            },
            filter:function(event,player){
				if (get.type(event.card) == 'equip'||get.type(event.card)=='delay') return false;
                return event.card.isCard;
            },
            content:function(){
                'step 0'
                var cards=trigger.cards;
                if(cards.length){
                    player.gain(cards,'gain2').gaintag.addArray(['ye_zhanshu_clear']);
                    player.addTempSkill('ye_zhanshu_clear');
                }
            },
			subSkill:{
        clear:{
            charlotte:true,
            onremove:function(player){
                player.removeGaintag('ye_zhanshu_clear');
            },
            mod:{
                "cardEnabled2":function(card,player){
                    var cards=[];
                    if(card.cards) cards.addArray(cards);
                    if(get.itemtype(card)=='card') cards.push(card);
                    for(var cardx of cards){
                        if(cardx.hasGaintag('ye_zhanshu_clear')) return false;
                    }
                },
                cardRespondable:function(card,player){
                    var cards=[];
                    if(card.cards) cards.addArray(cards);
                    if(get.itemtype(card)=='card') cards.push(card);
                    for(var cardx of cards){
                        if(cardx.hasGaintag('ye_zhanshu_clear')) return false;
                    }
                },
                cardSavable:function(card,player){
                    var cards=[];
                    if(card.cards) cards.addArray(cards);
                    if(get.itemtype(card)=='card') cards.push(card);
                    for(var cardx of cards){
                        if(cardx.hasGaintag('ye_zhanshu_clear')) return false;
                    }
                },
            },
            sub:true,
        },
    },
            },
            "ye_lunhui":{
                trigger:{
                    global:"phaseAfter",
                },
                content:function(){
        player.loseMaxHp();
        player.insertPhase();
    },
            },
            nuoyan:{
                trigger:{
                    player:"phaseBefore",
                },
                limited:true,
                skillAnimation:true,
                animationColor:"fire",
                filter:function(event,player){
        return player.Maxhp<=2;
    },
                content:function(){
        'step 0'
        player.awakenSkill('nuoyan');
        player.removeSkill('ye_lunhui');
        player.recover();
        'step 1'
        if(!player.isDying()&&!game.hasPlayer(function(current){
            return current.name1=='lumuyuan'||current.name2=='lumuyuan';
        })){
            player.chooseTarget(function(card,player,current){
                return current!=player&&current.hasSex('female');
            },'诺言：是否令一名其他女性角色选择是否将其武将牌替换为鹿目圆？').set('ai',function(target){
                return get.attitude(_status.event.player,target)-4;
            });
        }
        else event.finish();
        'step 2'
        if(!result.bool){
            event.finish();
            return;
        }
        var target=result.targets[0];
        event.target=target;
        player.line(target,'fire');
        target.chooseBool('诺言：是否将自己的一张武将牌替换为鹿目圆并令'+get.translation(player)+'？');
        'step 3'
        if(result.bool){
            if(target.name2!=undefined){
                target.chooseControl(target.name1,target.name2).set('prompt','请选择要更换的武将牌');
            }
            else event._result={control:target.name1};
        }
        else event.finish();
        'step 4'
        target.reinit(result.control,'lumuyuan');
        if(_status.characterlist){
            _status.characterlist.add(result.control);
            _status.characterlist.remove('lumuyuan');
            target.gainMaxHp(2);
            target.draw(3);
            player.draw(2);
        }
    },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function(player,skill){
        player.storage[skill]=false;
    },
                markimage:"extension/OLUI/image/player/marks/xiandingji.png",
            },
            "SE_huaxiang8":{
                enable:["chooseToUse","chooseToRespond"],
                position:"h",
                filter:function(event,player){            
        if(player.storage.SE_huaxiang&&player.storage.SE_huaxiang.length>=4) return false;
        return true;
    },
                check:function(card,event){
        return 7-get.value(card);
    },
                filterCard:function(card){    
        for(var i=0;i<_status.event.player.storage.SE_huaxiang.length;i++){
           if(get.suit(card)==get.suit(_status.event.player.storage.SE_huaxiang[i])) return false;
        }
        return true;        
    },
                prompt:"选择1张花色不同于武将牌上的手牌置于你的武将牌上",
                viewAs:{
                    name:"sha",
                    nature:"ice",
                },
                ai:{
                    respondSha:true,
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            var base=0,hit=false;
            if(get.cardtag(card,'yingbian_hit')){
                hit=true;
                if(targets.filter(function(target){
                    return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_all')){
                if(game.hasPlayer(function(current){
                    return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_damage')){
                if(targets.filter(function(target){
                    return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                    },true))&&!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })
                })) base+=5;
            }
            return base;
        },
                    canLink:function(player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
            if(player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))){
                if(game.hasPlayer(function(current){
                    return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                })&&game.countPlayer(function(current){
                    return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                })>1) return 3.1;
                return 3;
            }
            return 3.05;
        },
                    result:{
						player:2,
                        target:function(player,target,card,isLink){
                var eff=function(){
                    if(!isLink&&player.hasSkill('jiu')){
                        if(!target.hasSkillTag('filterDamage',null,{
                            player:player,
                            card:card,
                            jiu:true,
                        })){
                            if(get.attitude(player,target)>0){
                                return -7;
                            }
                            else{
                                return -4;
                            }
                        }
                        return -0.5;
                    }
                    return -1.5;
                }();
                if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                },true)) return eff/1.2;
                return eff;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function(card){
                if(card.nature) return 1;
            },
                        fireDamage:function(card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function(card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function(card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
            },
            "ye_duxing":{
                locked:true,
                ai:{
                    viewHandcard:true,
                    skillTagFilter:function(player,tag,arg){
             if(player==arg) return false;
         },
                },
            },
            "ye_xiangqi":{
                trigger:{
                    global:"damageEnd",
                },
                direct:true,
                filter:function(event,player){
        if(!event.source.countCards('h')||!event.card) return false;
        return event.player.classList.contains('dead')==false&&event.source!=event.player&&(event.player==player||player.inRange(event.player));
    },
                content:function(){
        "step 0"
        var att1=get.attitude(player,trigger.player);
        var att2=get.attitude(player,trigger.source);
        if(trigger.source==player) player.chooseCard('h').set('ai',function(card){
            if(get.type(card)==get.type(trigger.card)&&att1<0) return 100-get.value(card);
            return -2;
        });
        else player.choosePlayerCard('h',trigger.source,'visible').set('ai',function(card){
        if(get.type(card)!=get.type(trigger.card)){
        if(att1>0&&att2<0) return get.value(card);
        }
        if(get.type(card)==get.type(trigger.card)){
        if(att1<0&&att2<0) return get.value(card);
        if(att1<0&&att2>0) return 100-get.value(card);
        }
             if(trigger.player==player) return get.value(card);
            return false;
        });
        "step 1"
        if(result.bool){
        var card=result.cards[0];
        var target=trigger.player;
        player.showCards(card,get.translation(player)+'对'+(player==target?'自己':get.translation(target))+'发动了【想起】');
        if(get.type(card)==get.type(trigger.card)&&target!=player){
        player.logSkill('ye_xiangqi');
            trigger.source.discard(card);
            target.damage();
        }
        else{
        player.logSkill('ye_xiangqi');
        target.gain(card,'gain2');
        }
        }
        else event.finish();
    },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function(card,player,target){
                if(player.countCards('he')>1&&get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-1.5];
                    if(get.attitude(target,player)<0) return [1,1];
                }
            },
                    },
                },
            },
            "ye_qiugaoqishuang":{
               onChooseToUse:function(event){
if(event.type=='phase'&&!game.online){
var evtx=event.getParent('phaseUse');
var list=['basic','trick','equip'],player=event.player;
player.getHistory('lose',function(evt){
var evt2=evt.getParent();
if(evt2.name=='useSkill'&&evt2.skill=='ye_qiugaoqishuang') list.remove(get.type2(evt.cards2[0]));
});
event.set('ye_qiugaoqishuang_type',list);
}
},
    nobracket:true,
    enable:"phaseUse",
    filter:function(event,player){
return player.countCards('he',function(card){
return event['ye_qiugaoqishuang_type'].contains(get.type2(card));
});
},
    filterCard:function(card,player){
return _status.event['ye_qiugaoqishuang_type'].contains(get.type2(card));
},
    check:function(card){
return 6-get.value(card);
},
    position:"he",
    prepare:function(cards,player){
player.$throw(cards,1000);
game.log(player,'将',cards,'置入了弃牌堆');
},
    discard:false,
    loseTo:"discardPile",
    visible:true,
    content:function(){
var list=['basic','trick','equip'];
var type=list[(list.indexOf(get.type2(cards[0])))%3];
var card=get.cardPile2(function(card){
return get.type2(card)==type;
});
if(card){
player.gain(card,'draw');
game.log(player,'获得了一张','#g'+get.translation(type)+'牌');
}
else{
player.log('无牌可得了吗？');
game.log('但是牌堆中已经没有','#g'+get.translation(type)+'牌','了！');
player.addTempSkill('ye_qiugaoqishuang_'+get.type2(cards[0]),'washCard');
}
},
    ai:{
        order:9,
        result:{
            player:1,
        },
    },
    subSkill:{
        basic:{
            charlotte:true,
            sub:true,
        },
        trick:{
            charlotte:true,
            sub:true,
        },
        equip:{
            charlotte:true,
            sub:true,
        },
    },
            },
            "ye_qiankun":{
				charlotte:true,
				forced:true,
                mod:{
					attackFrom:function (from,to,distance){
            return distance-1
        },
                    maxHandcard:function(player,num){
            return 1+num;
        },
                },
            },
            "ye_shende":{
                marktext:"德",
                intro:{
                    name:"神德(德)",
                    "name2":"德",
                },
                onremove:function(player,skill){
        var cards=player.getExpansions(skill);
        if(cards.length) player.loseToDiscardpile(cards);
    },
                trigger:{
                    player:["useCard","respond"],
                },
                frequent:true,
                filter:function (event,player){
        return event.card.name=='sha';
    },
                content:function(){
        'step 0'
        player.draw();
        'step 1'
        player.chooseToDiscard(1,"hes",true);
        player.addMark('ye_shende',1,false);
    },
                group:["ye_shende_1"],
                subSkill:{
                    "1":{
                        enable:"chooseToUse",
                        viewAs:{
                            name:"tao",
                        },
                        prompt:"将一张牌当桃使用并摸一张牌",
                        viewAsFilter:function(player){
        return player.countMark('ye_shende')>=2;
    },
                        filterCard:function(card){
        return true;
    },
                        position:"hes",
                        precontent:function(){
                player.draw();
                player.removeMark('ye_shende',2);
    },
                        check:function(card){return 15-get.value(card)},
                        ai:{
                            respondTao:true,
                            result:{
                                target:2,
                                "target_use":function(player,target){
                // if(player==target&&player.hp<=0) return 2;
                if(player.hasSkillTag('nokeep',true,null,true)) return 2;
                var nd=player.needsToDiscard();
                var keep=false;
                if(nd<=0){
                    keep=true;
                }
                else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
                    keep=true;
                }
                var mode=get.mode();
                if(target.hp>=2&&keep&&target.hasFriend()){
                    if(target.hp>2||nd==0) return 0;
                    if(target.hp==2){
                        if(game.hasPlayer(function(current){
                            if(target!=current&&get.attitude(target,current)>=3){
                                if(current.hp<=1) return true;
                                if((mode=='identity'||mode=='versus'||mode=='chess')&&current.identity=='zhu'&&current.hp<=2) return true;
                            }
                        })){
                            return 0;
                        }
                    }
                }
                if(target.hp<0&&target!=player&&target.identity!='zhu') return 0;
                var att=get.attitude(player,target);
                if(att<3&&att>=0&&player!=target) return 0;
                var tri=_status.event.getTrigger();
                if(mode=='identity'&&player.identity=='fan'&&target.identity=='fan'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'&&tri.source!=target){
                        var num=game.countPlayer(function(current){
                            if(current.identity=='fan'){
                                return current.countCards('h','tao');
                            }
                        });
                        if(num>1&&player==target) return 2;
                        return 0;
                    }
                }
                if(mode=='identity'&&player.identity=='zhu'&&target.identity=='nei'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='zhong'){
                        return 0;
                    }
                }
                if(mode=='stone'&&target.isMin()&&
                player!=target&&tri&&tri.name=='dying'&&player.side==target.side&&
                tri.source!=target.getEnemy()){
                    return 0;
                }
                return 2;
            },
                            },
                            basic:{
                                order:function(card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                                useful:[6.5,4,3,2],
                                value:[6.5,4,3,2],
                            },
                            tag:{
                                recover:1,
                                save:1,
                            },
                        },
                        sub:true,
                    },
                },
            },
            "ye_gongfeng1":{
				subSkill:{
                    "1":{
                        sub:true,
                    },
                },
                enable:"phaseUse",
                discard:false,
                lose:false,
                delay:false,
                line:true,
                direct:true,
                clearTime:true,
                prepare:function(cards,player,targets){
        targets[0].logSkill('ye_gongfeng');
    },
                prompt:function(){
        var player=_status.event.player;
        var list=game.filterPlayer(function(target){
            return target!=player&&target.hasZhuSkill('ye_gongfeng',player);
        });
        var str='将一张【杀】交给'+get.translation(list);
        if(list.length>1) str+='中的一人';
        return str;
    },
                filter:function(event,player){    
        return game.hasPlayer(function(target){
            return player.countCards('h',{name:'sha'})&&target!=player&&target.hasZhuSkill('ye_gongfeng',player)&&!target.hasSkill('ye_gongfeng1_1');
        });
    },
                filterCard:function(card,player){
        return get.name(card,player)=='sha'
    },
                log:false,
                visible:true,
                filterTarget:function(card,player,target){
        return target!=player&&target.hasSkill('ye_gongfeng',player)&&!target.hasSkill('ye_gongfeng1_1');
    },
                content:function(){
        target.gain(cards,player,'giveAuto');
        target.addTempSkill('ye_gongfeng1_1','phaseUseEnd');
    },
                ai:{
                    expose:0.3,
                    order:1,
                    result:{
                        target:5,
                    },
                },
            },
            "ye_gongfeng":{
                unique:true,
                global:"ye_gongfeng1",
                zhuSkill:true,
            },
            "ye_fanhun":{
                trigger:{
                    player:"dying",
                },
                priority:1,
                forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                content:function(){
        "step 0"
        player.gainMaxHp();
        "step 1"
            player.recover(player.maxHp-player.hp);
        player.draw(player.maxHp);
    },
                group:["ye_fanhun_1"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseBegin",
                        },
						forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                        filter:function(event,player){
        return player.maxHp>4;
    },
                        content:function(){
        player.die();
    },
                        sub:true,
                    },
                },
            },
            "ye_yousi":{
                trigger:{
                    player:"phaseBegin",
                },
                charlotte:true,
				forced:true,
                content:function(){
        "step 0"
        event.targets=game.filterPlayer(function(current){
            return current!=player;
        }).sortBySeat();
        if(!event.targets.length) event.finish();
		player.line(event.targets,'green');
        "step 1"
		event.current=event.targets.shift();
        event.current.cyshminhp(player.hp-1); 
        "step 2"
        if(event.targets.length>0) event.goto(1);
    },
                group:["ye_yousi_1"],
                subSkill:{
                    "1":{
                        charlotte:true,
				forced:true,
                        trigger:{
                            player:"phaseAfter",
                        },
                        filter:function(){
                return game.hasPlayer(function(current){
                    return current.hasMark('_cyshminhp');
                });
            },
                        logTarget:function(){
                return game.filterPlayer(function(current){
                    return current.hasMark('_cyshminhp');
                });
            },
                        content:function(){
        game.countPlayer(function(current){
                    var num=current.countMark('_cyshminhp');
                    if(num){
                        current.removeMark('_cyshminhp',num);
						current.removeSkill('_cyshminhp');
                    }
                });
            },
                        sub:true,
                    },
                },
            },
            "ye_huanmeng":{
                group:["ye_huanmeng_1","ye_huanmeng_2"],
                trigger:{
                    player:"phaseDrawBefore",
                },
                content:function() {
        trigger.cancel();
    },
                forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseDiscardBefore",
                        },
                        forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                        content:function() {
                trigger.cancel();
            },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            player:"phaseBegin",
                        },
                        forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                        filter:function(event, player) {
                return player.countCards("h")<=0;
            },
                        content:function() {
                player.die();
            },
                        sub:true,
                    },
                },
                ai:{
                    effect:{
                        target:function(card,player,target,current){               
							if(get.name(card)!='sha'&&get.tag(card,'damage')){
                    return 'zeroplayertarget';
					if(card.name=='sha'){
                    return [0,-10];
                }
                }
            },
                    },
                },
            },
            "ye_cuixiang":{
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                content:function(){
        'step 0'
        event.cards=[];
        event.cards2=[];
        event.targets=game.filterPlayer(function(current){
            return current!=player;
        }).sortBySeat();
        if(!event.targets.length) event.finish();
        'step 1'
		event.current=event.targets.shift();
        if(event.current.countCards('h')) event.current.chooseToDiscard('h',true);
        else {
            event.current.draw();
            event.current.chooseToDiscard(1,'弃置一张手牌','h',true);
        };
        'step 2'
        if(result.bool&&Array.isArray(result.cards)) event.cards.addArray(result.cards);
        if(event.targets.length>0) event.goto(1);
        'step 3'
        event.cards=cards.filter(function(i){
            return get.position(i,true)=='d';
        });
        if(!event.cards.length) event.finish();
        'step 4'
        event.videoId=lib.status.videoId++;
        game.broadcastAll(function(player,id,cards){
            var str;
            if(player==game.me&&!_status.auto){
                str='【萃想】选择获得其中至多两张牌';
            }
            else{
                str='萃想';
            }
            var dialog=ui.create.dialog(str,cards);
            dialog.videoId=id;
        },player,event.videoId,event.cards);
        'step 5'
        var next=player.chooseButton([1,2]);
        next.set('dialog',event.videoId);
        next.set('ai',function(button){
            return get.value(button.link,_status.event.player)+1000;
        });
        "step 6"
        if(result.bool&&result.links){
            event.card2=result.links;
        }
		else event.finish();
        "step 7"
        game.broadcastAll('closeDialog',event.videoId);
        var card2=event.card2;
        player.gain(card2,'gain2');
    },
            },
            "ye_xuying":{
                forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                trigger:{
                    player:["respond","useCard"],
                },
                filter:function(event,player){
        return event.card.name=='shan';
    },
                content:function(){
        player.draw();
    },
                group:["ye_xuying_1"],
                subSkill:{
                    "1":{
                        trigger:{
                            player:"damageEnd",
                        },
                        forced:true,
                fixed:true,
                charlotte:true,
                superCharlotte:true,
				forceunique:true,
                        filter:function(event, player) {
        return event.card.name=='sha'&&player.countCards('h')>0;
            },
                        content:function() {
                var num=Math.max(1,Math.floor(player.countCards('h')/2));
                player.chooseToDiscard(num,"h",true);
            },
                        sub:true,
                    },
                },
            },
            "yangjingxurui_skill":{
                trigger:{
                    player:"phaseJieshuBegin",
                },
                cardSkill:true,
                unique:true,
                silent:true,
                content:function(){
        player.draw(2);
        player.removeSkill('yangjingxurui_skill');
    },
                forced:true,
                popup:false,
            },
            "guojiu_skill":{
             trigger:{
        player:"useCard1",
    },
    filter:function (event, player) {
        return event.card && (get.type(event.card) == 'trick' || get.type(event.card) == 'basic');
    },
    forced:true,
    charlotte:true,
    firstDo:true,
    content:function () {
		"step 0"
		game.broadcastAll(function (player) {
        player.removeSkill('guojiu_skill');
      }, player);
		"step 1"
        trigger.effectCount += player.storage.guojiu;
      trigger.guojiu = true;
      trigger.guojiu_add = player.storage.guojiu;
      game.addVideo('jiuNode', player, false);
    },
    temp:true,
    vanish:true,
    silent:true,
    popup:false,
    nopop:true,
    onremove:function (player) {
      if (player.node.jiu) {
        player.node.jiu.delete();
        player.node.jiu2.delete();
        delete player.node.jiu;
        delete player.node.jiu2;
      }
      delete player.storage.jiu;
    },
    ai:{
        damageBonus:true,
        skillTagFilter:function (player, tag, arg) {
        if (tag === 'damageBonus') return arg && arg.card && arg.card.name === 'sha';
      },
    },
    group:"guojiu2",
    "_priority":1,
			},
			"guojiu2_skill":{
       trigger:{
        player:"useCardAfter",
        global:"phaseAfter",
    },
    priority:2,
    firstDo:true,
    charlotte:true,
    filter:function (event, player) {
    if (player.hasSkillTag('jiuSustain', null, event.name)) return false;
    if (event.name == 'useCard') {
        return event.card && (get.type(event.card) == 'trick' || get.type(event.card) == 'basic');
    }
    return true;
  },
    forced:true,
    popup:false,
    audio:false,
    content:function(){
        game.broadcastAll(function(player){
            player.removeSkill('guojiu_skill');
        },player);
        game.addVideo('jiuNode',player,false);
    },
    "_priority":200,
			},
			"ye_zhengshe":{
                usable:1,
                filter:function(event,player){
        return player.countCards('hes',{suit:'heart'})>0;
    },
                enable:"chooseToUse",
                filterCard:function(card){
        return get.suit(card)=='heart';
    },
                position:"hes",
                viewAs:{
                    name:"yangjingxurui",
                },
                prompt:"将一张红桃牌当养精蓄锐使用",
                check:function(card){return 8-get.value(card)},
                ai:{
                    basic:{
                        order:1,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:3,
                    },
                    tag:{
                        skip:"phaseDiscard",
                        draw:2,
                    },
                },
            },
            "ye_xunfo":{
                trigger:{
                    global:["gainAfter"],
                },
                direct:true,
                filter:function(event,player){
    return event.getParent().name=='draw'&&player.countCards('h')<5&&event.getParent(2).name!='ye_xunfo'&&event.getParent(2).name!='ye_xunfo_1';
    },
                content:function(){
        var zhu=false;
        var target=trigger.player;
        switch(get.mode()){
            case 'identity':{
                zhu=target.isZhu;
                break;
            }
            case 'versus':{
                zhu=target.identity=='zhu';
                break;
            }
            case 'doudizhu':{
                zhu=target==game.zhu;
                break;
            }
        }
        if(zhu){
            player.logSkill('ye_xunfo');
            player.draw();
        }
    },
                group:["ye_xunfo_1"],
                subSkill:{
                    "1":{
                        trigger:{
                            global:["recoverAfter"],
                        },
                        direct:true,
                        filter:function(event,player){
    return player.countCards('h')<5;
    },
                        content:function(){
        var zhu=false;
        var target=trigger.player;
        switch(get.mode()){
            case 'identity':{
                zhu=target.isZhu;
                break;
            }
            case 'versus':{
                zhu=target.identity=='zhu';
                break;
            }
            case 'doudizhu':{
                zhu=target==game.zhu;
                break;
            }
        }
        if(zhu){
        player.logSkill('ye_xunfo');
            player.draw();
        }
    },
                        sub:true,
                    },
                },
            },
            "ye_mizong":{
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                content:function(){
        "step 0"
       player.judge(function (card) {
            return get.color(card)=='red' ? 2 : 1;
          });
        "step 1"
		if(get.position(result.card,true)=='d') player.gain(result.card,'gain2');
        if(result.color=='red'){
        player.addTempSkill('ye_mizong2');
        }
    },
            },
            "ye_mizong2":{
                onremove:true,
                mark:true,
                intro:{
                    content:"计算与其他角色间的距离视为一且使用牌无次数限制",
                },
                mod:{
                    cardUsableTarget:function(card,player,target){
 return true;
        },
                    globalFrom:function(from,to){
                return -Infinity;
        },
                },
            },
            "ye_yinreng":{
                shaRelated:true,
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function(event,player){
        return get.color(event.cards)!='red'&&event.card.name=='sha';
    },
                content:function(){
        var target=trigger.target;
        if(!target.hasSkill('fengyin')){
                target.addTempSkill('fengyin');
            }
        target.addTempSkill('ye_yinreng2');
    },
                ai:{
        skillTagFilter:function(player,tag,arg){
            if(!arg||!arg.card||!arg.target||(arg.card.name!='sha')) return false;
            return get.color(arg.card)!='red';
        },
                    result:{
                        target:function (player,target){     
                return -2;
            },
                    },
                },
            },
            "ye_yinreng2":{
                forced:true,
                mark:true,
                mod:{
                    "cardEnabled2":function(card,player){
            if(get.color(card)=='red') return false;
        },
                },
                intro:{
                    content:function(color){
            return '不能使用或打出红色牌';
        },
                },
            },
            "ye_bangyue":{
                enable:"phaseUse",
                usable:1,
                content:function(){
        'step 0'
        player.chooseTarget([1,3],get.prompt('ye_bangyue'),'令至多3名角色各摸一张牌，然后若此次选择了至少两名角色，你失去1点体力。').set('ai',function(target){
            return Math.sqrt(5-Math.min(4,target.countCards('h')))*get.attitude(_status.event.player,target)*(target.hasSkillTag('nogain')?0.1:1);
        });
        'step 1'
        if(result.bool){
			if(result.targets.length>=2) player.loseHp();
            var targets=result.targets.sortBySeat();
            event.targets=targets;
            player.logSkill('ye_bangyue',targets);
            if(targets.length==1) targets[0].draw();
            else game.asyncDraw(targets);
        }
        else event.finish();
        'step 2'
        if(targets.length>1) game.delayx();
    },
                ai:{
					expose:0.3,
                    order:999,
                    result:{
                        player:function(player){
                return 2;
            },
                    },
                },
            },
            "ye_juxiang":{
                trigger:{
                    player:"dying",
                },
                content:function(){
					"step 0"
					num1=player.countCards('h');
					player.turnOver();
        "step 1"
					if(!player.classList.contains('turnedover')) event.finish();
			'step 2'
event.cards=get.cards(3);
event.videoId=lib.status.videoId++;
game.broadcastAll(function(player,id,cards){
var str;
if(player==game.me&&!_status.auto) str='具现：选择获得一种花色的所有牌';
else str='具现';
var dialog=ui.create.dialog(str,cards);
dialog.videoId=id;
},player,event.videoId,event.cards);
event.time=get.utc();
game.addVideo('showCards',player,['具现',get.cardsInfo(event.cards)]);
game.addVideo('delay',null,2);
'step 3'
var suits=lib.suit.slice(0).filter(function(suit){
return cards.filter(function(card){
return get.suit(card)==suit;
}).length;
});
suits.reverse();
player.chooseControl(suits).set('ai',function(){
var map={};
for(var card of _status.event.cards){
var suit=get.suit(card);
if (!map[suit]) map[suit]=0;
map[suit]++;
}
return Object.keys(map).sort(function(a,b){
return map[b]-map[a];
})[0];
}).set('cards',cards);
'step 4'
event.cards=cards.filter(function(card){
return get.suit(card)==result.control;
});
var time=1000-(get.utc()-event.time);
if(time>0) game.delay(0,time);
'step 5'
game.broadcastAll('closeDialog',event.videoId);
player.gain(cards,'gain2');
"step 6"
         var num2=player.countCards('h');
         var num=3-num2+num1;
         if(num){
              player.recover(num);
                    }
},
                ai:{
                    threaten:function(player,target){   
            if(target.classList.contains('turnedover')) return 0.6;
            return 0.5;
        },
                    result:{
                        player:function (player,target){     
                return 2;
            },
                    },
                },
            },
            "ye_zhushi":{
				zhuSkill:true,
				unique:true,
		trigger:{
        player:"loseAfter",
        global:"loseAsyncAfter",
    },
    filter:function (event, player) {
		if(event.parent.parent.name!='phaseDiscard') return false;
        if (!game.hasPlayer(current => current != player)) return false;
        if (event.type != "discard" || event.getlx === false) return false;
        var evt = event.getl(player);
        if (!evt || !evt.cards2) return false;
        for (var i = 0; i < evt.cards2.length; i++) {
            if (get.position(evt.cards2[i]) == "d") {
                return true;
            }
        }
        return false;
    },
	direct:true,
	preHidden:true,
	content:function () {
        "step 0";
        if (trigger.delay == false) game.delay();
        event.cards = [];
        var cards2 = trigger.getl(player).cards2;
        for (var i = 0; i < cards2.length; i++) {
            if (get.position(cards2[i], true) == "d") {
                event.cards.push(cards2[i]);
            }
        }
        if (_status.connectMode)
            game.broadcastAll(function () {
                _status.noclearcountdown = true;
            });
        event.given_map = {};
        "step 1";
        var goon = false;
        for (var i = 0; i < event.cards.length; i++) {
            if (event.cards[i].name == "du") {
                goon = true;
                break;
            }
        }
        if (!goon) {
            goon = game.hasPlayer(function (current) {
                return player != current && get.attitude(player, current) > 1;
            });
        }
        player
            .chooseButton(["【嘱事】：是否分配本次弃置的牌？", event.cards], [1, event.cards.length])
            .set("ai", function (button) {
                if (_status.event.goon && ui.selected.buttons.length == 0) return 1 + Math.abs(get.value(button.link));
                return 0;
            })
            .set("goon", goon)
            .setHiddenSkill("ye_zhushi");
        "step 2";
        if (result.bool) {
            event.cards.removeArray(result.links);
            event.togive = result.links.slice(0);
            player
                .chooseTarget("选择一名其他角色获得" + get.translation(result.links), true, lib.filter.notMe)
                .set("ai", function (target) {
                    var att = get.attitude(_status.event.player, target);
                    if (_status.event.enemy) {
                        return -att;
                    } else if (att > 0) {
                        return att / (1 + target.countCards("h"));
                    } else {
                        return att / 100;
                    }
                })
                .set("enemy", get.value(event.togive[0], player, "raw") < 0);
        } else event.goto(4);
        "step 3";
        if (result.targets.length) {
            var id = result.targets[0].playerid,
                map = event.given_map;
            if (!map[id]) map[id] = [];
            map[id].addArray(event.togive);
        }
        if (cards.length > 0) event.goto(1);
        "step 4";
        if (_status.connectMode) {
            game.broadcastAll(function () {
                delete _status.noclearcountdown;
                game.stopCountChoose();
            });
        }
        var list = [],
            targets = [];
        for (var i in event.given_map) {
            var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
            list.push([source, event.given_map[i]]);
            targets.push(source);
        }
        if (targets.length) {
            player.logSkill("ye_zhushi", targets);
            game.loseAsync({
                gain_list: list,
                giver: player,
                animate: "gain2",
            }).setContent("gaincardMultiple");
        }
    },
            },
            "ye_moqi":{
                trigger:{
                    global:"useCard",
                },
                usable:1,
                filter:function (event,player){
        if (!event.targets.length) return false;
        var type=get.type(event.card);
        if(type!='trick') return false;
        if(_status.currentPhase!=event.player) return false;
        var card=game.createCard(event.card.name,event.card.suit,event.card.number,event.card.nature);
        var targets=event._targets||event.targets;
        for(var i=0;i<targets.length;i++){
            if(!targets[i].isIn()) return false;
            if(!event.player.canUse({name:event.card.name},targets[i],false,false)){
                return false;
            }
        }
        return true;
    },
           check(event, player) {
        return get.effect(event.targets[0], event.card, event.player, player) > 0;
    },
                content:function (){ 
        trigger.effectCount++;
    },
                ai:{
                    threaten:1.4,
                },
            },
            "ye_shishu":{
                enable:"phaseUse",
                unique:true,
                limited:true,
                skillAnimation:"epic",
                animationColor:"thunder",
                multitarget:true,
                multiline:true,
                content:function(){
        "step 0"
        event.count=player.maxHp-player.hp+1;
      player.awakenSkill('ye_shishu');  
        "step 1"
        event.count--;
        event.card=get.cardPile(function(card){
            if(get.color(card)==result.control) return true;
            if(get.type(card,'trick')=='trick') return true;
            return false;
        },'cardPile');
        if(!event.card){
            event.finish();
            return;
        }
        player.showCards([event.card]);
        "step 2"
        player.chooseTarget(true,'选择一名角色送出'+get.translation(event.card),function(card,player,target){
            return true;
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(_status.event.neg) return -att;
            return att;
        }).set('neg',get.value(event.card,player,'raw')<0);
        "step 3"
        player.line(result.targets,'green');
        result.targets[0].gain(event.card,'gain2');
        if(result.targets[0]!=player){
            player.recover();
        };
        if(event.count>0) event.goto(1);
    },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function(player,skill){
        player.storage[skill]=false;
    },
                ai:{
                    order:10,
                    result:{
                        player:function(player,target){
                if(player.hp<=player.maxHp-2) return 4;
                return 0;
            },
                    },
                },
                markimage:"extension/OLUI/image/player/marks/xiandingji.png",
            },
            "ye_shenpan":{
                trigger:{
                    player:"phaseDrawBegin1",
                },
                direct:true,
                filter:function (event,player){
        return !event.numFixed;
    },
                content:function (){
        'step 0'
  player.chooseTarget(get.prompt2('ye_shenpan'),function(card,player,target){
            return target!=player;
        }).set('ai',function(target){
            var player=_status.event.player
            return get.damageEffect(target,player,player,'thunder')
        });
        'step 1'
        if(result.bool){
            trigger.num--;
            var target=result.targets[0];
            event.target=target;
            player.logSkill('ye_shenpan',result.targets);
            player.line(result.targets,'metal');
            target.damage('nocard','thunder'); 
        }
        else event.finish(); 
        'step 2'
        if(target.countCards('h')>=target.hp||target.isDead()) player.draw(1);
        'step 3'
        if(target.isDead()) event.goto(0);
        else event.finish();
    },
                ai:{
                    expose:0.2,
                },
            },
            "ye_huiwu":{
                audio: 2,
		trigger: { target: "useCardToTargeted" },
               filter: function (event, player) {
			return event.player != player;
		},
		direct:true,
               content:function(){
        "step 0";
			var goon = get.effect(player, trigger.card, trigger.player, trigger.player) <  get.effect(player, { name: "draw" }, player, trigger.player);
			if (goon && !event.isMine() && !event.isOnline()) game.delayx();
			trigger.player
				.chooseBool("是否对" + get.translation(player) + "发动【悔悟】？", "令" + get.translation(trigger.card) + "对其无效，然后其摸一张牌")
				.set("ai", () => {
					return _status.event.goon;
				})
				.set("goon", goon);
			("step 1");
			if (result.bool) {
				trigger.player.logSkill("ye_huiwu", player);
				trigger.excluded.add(player);
				player.draw();
			};
    },
	ai:{
        effect: {
				target_use(card, player, target) {
					if (card && (card.cards || card.isCard) && get.attitude(target, player) > 0) return [0, 0.25, 0, 0.25];
				},
			},
    },
            },
            "ye_huayan":{
                unique:true,
                group:"ye_huayan2",
                zhuSkill:true,
            },
            "ye_huayan2":{
                trigger:{
                    global:"damageSource",
                },
                filter:function(event,player){
					if(player==event.source||!event.source) return false;
        if(event.player.hp<player.hp&&event.player.group!='zhan') return false;
        return player.hasZhuSkill('ye_huayan',event.source);
    },
                direct:true,
                content:function(){
        'step 0'
        event.count=trigger.num;
        'step 1'
        event.count--;
        trigger.source.chooseBool('是否对'+get.translation(player)+'发动【花冢】？').set('choice',get.attitude(trigger.source,player)>0);
        'step 2'
        if(result.bool){
			trigger.source.logSkill("ye_huayan",player);
			trigger.source.line(player, "green");
            trigger.source.judge(function(card){
                if(get.color(card)=='red') return 2;
                return 0;
            }).judge2=function(result){
                return result.bool?true:false;
            };
        }
        else{
            event.finish();
        }
        'step 3'
        if(result.color=='red'){
            player.gain(result.card,'gain2','log')
        }
        if(event.count) event.goto(1);
    },
            },
            "ye_jufengqishi":{
                nobracket:true,
                group:["ye_jufengqishi_suo","ye_jufengqishi_mo","ye_jufengqishi_sha"],
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event, player){
        return event.card&&get.type(event.card)=='trick'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
    },
                content:function (){
              trigger.nature='wind';
    },
                subSkill:{
                    sha:{
                        shaRelated:true,
                        trigger:{
                            player:"phaseJieshu",
                        },
                        filter:function(event,player){
        return game.hasPlayer(function(current){
            return current.isLinked();
        });
    },
                        direct:true,
                        content:function (){
            var next=player.chooseUseTarget({name:'sha',nature:'wind'});
            next.targets=game.filterPlayer(function(current){
                return current.isLinked();
            });
            next.set('addCount',false);
            next.set('nodistance',true);
            next.set('prompt','飓风骑士：对横置角色视为使用一张风【杀】');
            next.set('logSkill','ye_jufengqishi');
            event.finish();
    },
                        sub:true,
                    },
                    mo:{
                        trigger:{
                            player:"phaseBegin",
                        },
                        direct:true,
                        filter:function(event, player) {
                return game.roundNumber%2==0;
            },
                        content:function (){
                 'step 0'
        player.chooseTarget(get.prompt('ye_jufengqishi'),'选择角色并令他们各摸一张牌',[1,1+player.getDamagedHp()],false,function(card,player,target){
            return true;
        }).set('ai',function(target){
            return (get.attitude(player,target)>0);
        });
        'step 1'
                 if(result.bool){
            player.logSkill('ye_jufengqishi',result.targets);
            game.asyncDraw(result.targets);
                    event.finish();
                }
            },
                        sub:true,
                    },
                    suo:{
                        trigger:{
                            player:"phaseBegin",
                        },
                        direct:true,
                        filter:function(event, player) {
                return game.roundNumber%2!=0;
            },
                        content:function (){
                 'step 0'
        player.chooseTarget(get.prompt('ye_jufengqishi'),'选择角色并令他们横置',[1,1+player.getDamagedHp()],false,function(card,player,target){
            return !target.isLinked();
        }).set('ai',function(target){
            return (get.attitude(player,target)<0);
        });
        'step 1'
        if(result.bool){
            player.logSkill('ye_jufengqishi',result.targets);
            event.targets=result.targets;
                        event.num=0;          
        }
		else event.finish();
                "step 2"
                    if(event.num<event.targets.length){
                        event.targets[event.num].link();
                        event.num++;
                        event.redo(true);
                    }
            },
                        sub:true,
                    },
                },
            },
            "_dm_wind":{
                trigger:{
                    player:"damageBegin1",
                },
                forced:true,
                popup:false,
                filter:function (event, player){
        return event.nature&&event.nature=='wind'&&player.countCards('e')>0;
    },
                content:function (){
        player.chooseToDiscard(1,'e',true);
    },
            },
            "ye_leiyu":{
                enable:["chooseToRespond","chooseToUse"],
                filterCard:function(card,player){
        return get.suit(card)=='heart'||get.suit(card)=='spade';
    },
                position:"hes",
                viewAs:{
                    name:"sha",
                    nature:"thunder",
                },
                viewAsFilter:function(player){
        if(get.zhu(player,'shouyue')){
            if(!player.countCards('hes')) return false;
        }
        else{
            if(!player.countCards('hes',{color:'red'})) return false;
        }
    },
                prompt:"将一张红桃或黑桃牌当雷杀使用或打出",
                check:function(card){
        var val=get.value(card);
        if(_status.event.name=='chooseToRespond') return 1/Math.max(0.1,val);
        return 5-val;
    },
                group:["ye_leiyu_1"],
                subSkill:{
                    "1":{
                        direct:true,
                        trigger:{
                            player:"damageBegin4",
                        },
                        filter:function(event){
        return event.nature=='thunder';
    },
                        content:function(){
        trigger.cancel();
                player.draw(2);
                player.logSkill('ye_leiyu');
    },
	ai:{
                effect:{
					nothunder:true,
                    target:function (card, player, target) {
                        if (get.tag(card, 'thunderDamage')) return [0, 1];
                    },
                },
            },
                   sub:true,
                    },
                },
                ai:{
                    yingbian:function(card,player,targets,viewer){
                        if(get.attitude(viewer,player)<=0) return 0;
                        var base=0,hit=false;
                        if(get.cardtag(card,'yingbian_hit')){
                            hit=true;
                            if(targets.filter(function(target){
                                return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                            })) base+=5;
                        }
                        if(get.cardtag(card,'yingbian_all')){
                            if(game.hasPlayer(function(current){
                                return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                            })) base+=5;
                        }
                        if(get.cardtag(card,'yingbian_damage')){
                            if(targets.filter(function(target){
                                return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                                target:target,
                                card:card,
                                },true))&&!target.hasSkillTag('filterDamage',null,{
                                    player:player,
                                    card:card,
                                    jiu:true,
                                })
                            })) base+=5;
                        }
                        return base;
                    },
                    canLink:function(player,target,card){
                        if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
                        if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                            target:target,
                            card:card,
                        },true)) return false;
                        if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
                        return true;
                    },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
                        if(player.hasSkillTag('presha',true,null,true)) return 10;
                        if(lib.linked.contains(get.nature(item))){
                            if(game.hasPlayer(function(current){
                                return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                            })&&game.countPlayer(function(current){
                                return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                            })>1) return 3.1;
                            return 3;
                        }
                        return 3.05;
                    },
                    result:{
                        player:1,
                        target:function(player,target,card,isLink){
                            var eff=function(){
                                if(!isLink&&player.hasSkill('jiu')){
                                    if(!target.hasSkillTag('filterDamage',null,{
                                        player:player,
                                        card:card,
                                        jiu:true,
                                    })){
                                        if(get.attitude(player,target)>0){
                                            return -7;
                                        }
                                        else{
                                            return -4;
                                        }
                                    }
                                    return -0.5;
                                }
                                return -1.5;
                            }();
                            if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                                target:target,
                                card:card,
                            },true)) return eff/1.2;
                            return eff;
                        },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                            if(card.nature=='poison') return;
                            return 1;
                        },
                        natureDamage:function(card){
                            if(card.nature) return 1;
                        },
                        fireDamage:function(card,nature){
                            if(card.nature=='fire') return 1;
                        },
                        thunderDamage:function(card,nature){
                            if(card.nature=='thunder') return 1;
                        },
                        poisonDamage:function(card,nature){
                            if(card.nature=='poison') return 1;
                        },
                    },
                },
            },
            "ye_shizhai":{
                enable:"phaseUse",
                usable:1,
                content:function(){
					'step 0'
        player.judge().set('callback',lib.skill.ye_shizhai.callback);
					'step 1'
					if(get.position(result.card,true)=='d') player.gain(result.card,'gain2');
    },
                callback:function(){
        player.addTempSkill('ye_shizhai2');
        player.storage.ye_shizhai=event.judgeResult.color;
    },
                ai:{
                    order:999,
                    result:{
                        player:function (player,target){     
                return 2;
            },
                    },
                },
            },
            "ye_shizhai2":{
                trigger:{
                    player:"useCard",
                },
                frequent:true,
                filter:function(event,player){
        return get.color(event.card)==player.storage.ye_shizhai;
    },
                content:function(){
        'step 0'
        player.chooseTarget('是否发动【示灾】，横置一名角色？',(card,player,target)=>{
            return !target.isLinked();
        }).set('ai',target=>{
            if(!player.isLinked()) return player;
                return -get.attitude(player,target);
        });
        'step 1'
        if(result.bool){
            player.logSkill('ye_shizhai',result.targets);
              result.targets[0].link(true);
        };
    },
            },
            "ye_chunyi":{
                priority:-15,
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                filter:function(event,player){
        return player.maxHp<6;
    },
                content:function(){
          player.gainMaxHp();
    },
            },
            "ye_baochun":{
                trigger:{
					player:["damageEnd","phaseZhunbeiBegin"],
                },
                direct:true,
                content:function (){
					"step 0"
        event.count=trigger.num;
        "step 1"
        event.count--;
        var num=player.getDamagedHp();
        player.chooseTarget(get.prompt('ye_baochun'),'令一名角色摸牌').set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            var num1=player.getDamagedHp()-target.countCards('h');
            if(num1<=0){
                return att;
            }
            return att*num1;
        });
        "step 2"
        if(result.bool){
            player.logSkill('ye_baochun',result.targets);
            player.line(target,'thunder');
            var num=player.getDamagedHp()-result.targets[0].countCards('h');
            if(num>0) result.targets[0].draw(num);
            if(num<=0) result.targets[0].draw(1);
				if(event.count) event.goto(1);
        }
    },
                ai:{
        maixie:true,
        "maixie_hp":true,
        effect:{
            target:function(card,player,target,current){
                if(get.tag(card,'damage')&&target.hp>1){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    var max=0;
                    var players=game.filterPlayer();
                    for(var i=0;i<players.length;i++){
                        if(get.attitude(target,players[i])>0){
                            max=Math.max(player.getDamagedHp()-players[i].countCards('h'),max);
                        }
                    }
                    switch(max){
                        case 0:return 2;
                        case 1:return 1.5;
                        case 2:return [1,2];
                        default:return [0,max];
                    }
                }
                if((card.name=='tao'||card.name=='caoyao')&&
                    target.hp>1&&target.countCards('h')<=target.hp) return [0,0];
            },
        },
    },
            },
            "ye_fengrang":{
                enable:"phaseUse",
                usable:1,
                content:function(){
         player.chooseUseTarget('wugu',true);
    },
                ai:{
                    order:3,
                    result:{
						  player:function(player,target){
                return 2;
            },
            target:function(player,target){
                var sorter=(_status.currentPhase||player);
                if(get.is.versus()){
                    if(target==sorter) return 1.5;
                    return 1;
                }
                if(player.hasUnknown(2)){
                    return 0;
                }
                return (1-get.distance(sorter,target,'absolute')/game.countPlayer())*get.attitude(player,target)>0?0.5:0.7;
            },
        },
                },
            },
            "ye_shouhuo":{
                frequent:true,
                trigger:{
                    global:"useCard",
                },
                forced:true,
                filter:function(event,player){
        return event.card.name=='wugu';
    },
                content:function (){
       "step 0"
       var cards=get.cards(game.countPlayer()+1);
        event.cards=cards;
        var next=player.chooseCardButton(cards,'选择获得一张牌',[1]).set('ai',function(card){
                return get.value(cards);
            });
        "step 1"
        if(result.bool){
            player.gain(result.links);
            player.$draw(result.links);
            game.delay(2);
        }
        for(var i=event.cards.length-1;i>=0;i--){
            if(!result.bool||!result.links.contains(event.cards[i])){
                ui.cardPile.insertBefore(event.cards[i],ui.cardPile.firstChild);
            }
            event.finish;
        }
    },
            },
            "ye_chongdong":{
                unique:true,
                group:"ye_chongdong2",
                zhuSkill:true,
                "audioname2":{
                    yuanshu:"weidi",
                },
            },
            "ye_chongdong2":{
                trigger:{
                    global:["phaseDrawSkipped","phaseDrawCancelled","phaseJudgeCancelled","phaseUseCancelled","phaseDiscardCancelled","phaseZhunbeiCancelled","phaseJieshuCancelled","phaseJudgeSkipped","phaseUseSkipped","phaseDiscardSkipped","phaseZhunbeiSkipped","phaseJieshuSkipped"],
                },
                filter:function(event,player){
        if(event.player==player||event.player.group!='ye_jiu') return false;
        return player.hasZhuSkill('ye_chongdong',event.player);
    },
                direct:true,
                content:function(){
        'step 0'
        trigger.player.chooseBool('是否发动【虫洞】，令'+get.translation(player)+'摸一张牌？').set('choice',get.attitude(trigger.player,player)>0);
        'step 1'
        if(result.bool){
            player.logSkill('ye_chongdong2');
            trigger.player.line(player,'green');
            player.draw();
        }
    },
                "audioname2":{
                    yuanshu:"weidi",
                },
            },
            "ye_ciyuan":{
              onremove:true,
    forced:true,
    init:function (player) {
        player.storage.ye_ciyuan = [];
    },
    trigger:{
        player:"phaseBegin",
    },
    content:function () {
        'step 0'
        if (player.isUnderControl()) {
            game.swapPlayerAuto(player);
        }
        var chooseButton = function (phases) {
            var event = _status.event;
            if (!event._result) event._result = {};
            event._result.phases = [];
            event._result.phases2 = [];
            var endphases = event._result.phases;
            var rphases = event._result.phases2;
            var dialog = ui.create.dialog('【次元】:你可以掉换执行阶段的顺序</br>执行顺序为由左到右依次执行', 'hidden');
            event.dialog = dialog;
            var table = document.createElement('div');
            table.classList.add('add-setting');
            table.style.margin = '0';
            table.style.width = '100%';
            table.style.position = 'relative';
            var tdList = [];
            var clickHandler = function () {
                if (_status.dragged) return;
                if (_status.justdragged) return;
                _status.tempNoButton = true;
                setTimeout(function () {
                    _status.tempNoButton = false;
                }, 500);
                var link = this.link;
                if (!this.classList.contains('bluebg')) {
                    if (endphases.length >= 2) return;
                    endphases.push(link);
                    this.classList.add('bluebg');
                } else {
                    this.classList.remove('bluebg');
                    endphases.splice(endphases.indexOf(link), 1);
                }
                for (var i = 0; i < tdList.length; i++) {
                    if (tdList[i] !== this) {
                        tdList[i].classList.remove('bluebg');
                    }
                }

                if (endphases.length == 2) {
                    var index1 = phases.indexOf(endphases[0]);
                    var index2 = phases.indexOf(endphases[1]);
                    if (index1 >= 0 && index2 >= 0 && index1 < tdList.length && index2 < tdList.length) {
                        var tempNode = tdList[index1];
                        var tempNode2 = tdList[index2];
                        var tempLink = tempNode.link;
                        var tempIndex = phases.indexOf(tempNode.link);

                        tempNode.link = tempNode2.link;
                        tempNode.innerHTML = '<span>' + get.tranPhase(tempNode2.link) + '</span>';
                        tempNode2.link = tempLink;
                        tempNode2.innerHTML = '<span>' + get.tranPhase(tempLink) + '</span>';

                        phases[index1] = tempNode.link;
                        phases[index2] = tempNode2.link;

                        tempNode.classList.remove('bluebg');
                        tempNode2.classList.remove('bluebg');

                        event._result.phases2 = phases;

                        event._result.phases.length = 0;
                    }
                }
            };
            for (var i = 0; i < phases.length; i++) {
                var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                td.link = phases[i];
                table.appendChild(td);
                td.innerHTML = '<span>' + get.tranPhase(phases[i]) + '</span>';
                tdList.push(td);
                td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickHandler);
            }
            dialog.content.appendChild(table);
            dialog.add('　　');
            dialog.open();

            event.switchToAuto = function () {
                event.dialog.close();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
            };
            event.control = ui.create.control('ok', function (link) {
                event.dialog.close();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
            });
            for (var i = 0; i < event.dialog.buttons.length; i++) {
                event.dialog.buttons[i].classList.add('selectable');
            }
            game.pause();
        };
        var switchToAuto = function () {
            _status.imchoosing = false;
            event._result = {
                bool: true,
                phases2: ['phaseUse', 'phaseDraw', 'phaseDiscard', 'phaseZhunbei', 'phaseJieshu', 'phaseJudge'],
            };
            if (event.dialog) event.dialog.close();
            if (event.control) event.control.close();
        };
        var phase = ['phaseZhunbei', 'phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard', 'phaseJieshu'];
        if (event.isMine()) {
            chooseButton(phase);
        }
        else if (event.isOnline()) {
            event.player.send(chooseButton, phase);
            event.player.wait();
            game.pause();
        }
        else {
            switchToAuto();
        }
        'step 1'
        var map = event.result || result;
        player.storage.ye_ciyuan = map.phases2;
        player.storage.ye_ciyuan2 = ['phaseZhunbei', 'phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard', 'phaseJieshu'];
    },
    group:"ye_ciyuan_phase",
    subSkill:{
        phase:{
            silent:true,
            charlotte:true,
            firstDo:true,
            trigger:{
                player:["phaseZhunbeiBefore","phaseJudgeBefore","phaseDrawBefore","phaseUseBefore","phaseDiscardBefore","phaseJieshuBefore"],
            },
            filter:function (event, player) {
                if (!player.storage.ye_ciyuan2 || !player.storage.ye_ciyuan) return false;
                if (!player.isPhase(player.storage.ye_ciyuan2[0])) return false;
                else player.storage.ye_ciyuan2.shift();
                return player.storage.ye_ciyuan.length > 0;
            },
            content:function () {
                var newPhase = player.storage.ye_ciyuan[0];
                player.storage.ye_ciyuan.shift();
                trigger.cancel();
                var next = trigger.player[newPhase]();
                event.next.remove(next);
                trigger.getParent('phase').next.push(next);

            },
            sub:true,
            forced:true,
            popup:false,
            "_priority":1,
        },
    },
    "_priority":0,
            },
            "ye_shigui":{
                marktext:"时轨",
                intro:{
                    name:"已经过阶段数",
                    "name2":"已经过阶段数",
                },
                trigger:{
                    player:["phaseZhunbeiAfter","phaseJudgeAfter","phaseDrawAfter","phaseUseAfter","phaseDiscardAfter","phaseJieshuAfter"],
                },
                direct:true,
                content:function(){
        player.addMark('ye_shigui',1);
    },
                group:["ye_shigui_use1","ye_shigui_use2","ye_shigui_lose"],
                subSkill:{
                    "use1":{
                        trigger:{
                            player:["phaseDrawAfter","phaseUseAfter"],
                        },
                        usable:1,
                        filter:function (event,player){
        return player.countMark('ye_shigui')-player.countCards('h')>0;
    },
	prompt:function (event,player){
        return '〖时轨〗：是否摸'+(player.countMark('ye_shigui')-player.countCards('h'))+'张牌并失去一点体力？';
    },
                        content:function(){
     var num=player.countMark('ye_shigui')-player.countCards('h');
                    player.draw(num);
                    player.loseHp();
            },
                        ai:{
                            result:{
                                player:function (player,target){     
                if(player.countMark('ye_shigui')-player.countCards('h')>=2&&player.Hp>2) return 2;
                return 0;
            },
                            },
                        },
						"_priority":0,
                        sub:true,
                    },
                    "use2":{
                        trigger:{
                            player:["phaseDrawAfter","phaseUseAfter"],
                        },
                        usable:1,
                        prompt:function (event,player){
							return '〖时轨〗：是否弃'+(player.countCards('h')-player.countMark('ye_shigui'))+'张牌并回复一点体力？';
    },
                        filter:function (event,player){
        return player.countMark('ye_shigui')-player.countCards('h')<0;
    },
                        content:function(){
     var num=player.countMark('ye_shigui')-player.countCards('h');
            player.chooseToDiscard('h',true,-num);
            player.recover();
            },
                        ai:{
                            result:{
                                player:function (player,target){     
                if(player.countCards('h')-player.countMark('ye_shigui')<=2&&player.isDamaged()) return 1;
                return 0;
            },
                            },
                        },
						"_priority":0,
                        sub:true,
                    },
                    lose:{
                        trigger:{
                            player:"phaseAfter",
                        },
                        forced:true,
                        content:function(){              player.removeMark('ye_shigui',player.countMark('ye_shigui'));
            },
			"_priority":99999,
                        sub:true,
                    },
                },
				"_priority":99999,
            },
            "ye_jiyi":{
                trigger:{
                    player:"turnOverEnd",
                },
                content:function (){
        "step 0"
        player.draw(2);
        event.given=0;
        "step 1"
        player.chooseCardTarget({
            filterCard:true,
            selectCard:[1,2-event.given],
            filterTarget:function(card,player,target){
                return player!=target&&target!=event.temp;
            },
            ai1:function(card){
                if(ui.selected.cards.length>0) return -1;
                if(card.name=='du') return 20;
                return (_status.event.player.countCards('h')-_status.event.player.hp);
            },
            ai2:function(target){
                var att=get.attitude(_status.event.player,target);
                if(ui.selected.cards.length&&ui.selected.cards[0].name=='du'){
                    if(target.hasSkillTag('nodu')) return 0;
                    return 1-att;
                }
				if(target.hasSkillTag('nogain')) return 0;
                return att-4;
            },
            prompt:'请选择要送人的卡牌'
        });
        "step 2"
        if(result.bool){
            player.line(result.targets,'green');
            result.targets[0].gain(result.cards,player,'giveAuto');
            event.given+=result.cards.length;
            if(event.given<2){
                event.temp=result.targets[0];
                event.goto(1);
            }
            else event.finish();
        }
        else event.finish();
    },
            },
            "ye_chunmiang":{
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                content:function(){ player.turnOver();
    },
            },
            "ye_buju":{
                usable:1,
                enable:"phaseUse",
                content:function(){
        'step 0'
        var num=Math.min(5,game.countPlayer());
         player.draw(num);
        'step 1'
        player.chooseCard('将牌置于牌堆顶（先选择的在上）',Math.min(4,game.countPlayer()),'he',true);
        'step 2'
        if(result.bool){
            player.lose(result.cards,ui.special);
            event.cards=result.cards;
        }
        else{
            event.finish();
        }
        'step 3'
        game.delay();
        var nodes=[];
        for(var i=0;i<event.cards.length;i++){
            var cardx=ui.create.card();
            cardx.classList.add('infohidden');
            cardx.classList.add('infoflip');
            nodes.push(cardx);
        }
        player.$throw(nodes,700,'nobroadcast');
        game.log(player,'将'+get.cnNumber(event.cards.length)+'张牌置于牌堆顶');
        'step 4'
        for(var i=event.cards.length-1;i>=0;i--){
            ui.cardPile.insertBefore(event.cards[i],ui.cardPile.firstChild);
        }
    },
                ai:{
                    order:99,
                    result:{
                        player:2,
                    },
                },
				group:["ye_buju_damage"],
    subSkill:{
        damage:{
            trigger:{
                player:"damageEnd",
            },
			 check:function(event,player){
        return true;
    },
            content:function(){
              'step 0'
        var num=Math.min(5,game.countPlayer()+1);
         player.draw(num);
        'step 1'
        player.chooseCard('将牌置于牌堆顶（先选择的在上）',Math.min(4,game.countPlayer()),'he',true);
        'step 2'
        if(result.bool){
            player.lose(result.cards,ui.special);
            event.cards=result.cards;
        }
        else{
            event.finish();
        }
        'step 3'
        game.delay();
        var nodes=[];
        for(var i=0;i<event.cards.length;i++){
            var cardx=ui.create.card();
            cardx.classList.add('infohidden');
            cardx.classList.add('infoflip');
            nodes.push(cardx);
        }
        player.$throw(nodes,700,'nobroadcast');
        game.log(player,'将'+get.cnNumber(event.cards.length)+'张牌置于牌堆顶');
        'step 4'
        for(var i=event.cards.length-1;i>=0;i--){
            ui.cardPile.insertBefore(event.cards[i],ui.cardPile.firstChild);
        }
            },
            sub:true,
            sourceSkill:"ye_buju",
            "_priority":0,
			ai:{
        maixie:true,
        "maixie_hp":true,
        effect:{
            target:function (card, player, target) {
                if (get.tag(card, 'damage')) {
                    if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                    if (!target.hasFriend()) return;
                    if (target.hp >= 4) return [0.5, 1];
                    if (target.hp == 3) return [0.5, 0.75];
                    if (target.hp == 2) return [0.5, 0.25];
                }
            },
        },
    },
        },
    },
            },
            "ye_5yu2":{
                mod:{
                    cardUsable:function(card,player,num){
                        if(card.name=='sha') return num+player.countMark('ye_5yu2');
                    },
                },
                onremove:true,
            },
            queyu:{
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                content:function() {
        'step 0'
        event.cards = get.cards(4);
        player.showCards(event.cards);
        game.cardsGotoOrdering(event.cards);
        game.delay(1.5);
        'step 1'
        var list = [];
        for (var i = 0; i < event.cards.length; i++) {
            var suit = get.suit(event.cards[i]);
            if (!list.contains(suit)) list.push(suit);
        }
        if (list.length >= 4) event.goto(7);
        'step 2'
        var list = [],
            list2 = [
                '弃置一张牌，从牌堆顶亮出两张牌并重复此流程',
                '获得数量最多的一种花色的所有牌，然后跳过摸牌阶段',
            ];
        if (player.countCards('he')>0) list.push('选项一');
        list.push('选项二');
        player.chooseControl(list).set('choiceList', list2).set('ai', function() {
            if (_status.event.tot >= 6) return '选项二';
            if (_status.event.num * 2 > _status.event.tot) return '选项二';
            return '选项一';
        }).set('num', list.length).set('tot', event.cards.length);
        'step 3'
        if (result.control == '选项一') {
            player.chooseToDiscard(1, 'he', true);
        } else if (result.control == '选项二') {
            event.goto(5);
        }
        'step 4'
        var cards = get.cards(2);
        game.cardsGotoOrdering(cards);
        event.cards = event.cards.concat(cards);
        player.showCards(event.cards);
        event.goto(1);
        'step 5'
        var cnt = {};
        var vul = {};
        for (var i = 0; i < event.cards.length; i++) {
            var suit = get.suit(event.cards[i]);
            if (!cnt[suit]) cnt[suit] = [];
            cnt[suit].push(event.cards[i]);
            if (!vul[suit]) vul[suit] = 0;
            vul[suit] += get.value(event.cards[i]);
        }
        var num = 0;
        var sit, num2 = 0;
        for (var i in vul) {
            if (num2 < vul[i]) {
                num2 = vul[i];
                sit = i;
            }
        }
        for (var i in cnt) num = Math.max(cnt[i].length, num);
        var list = [];
        for (var i in cnt) {
            if (num == cnt[i].length) list = list.concat(cnt[i]);
        }
        player.chooseButton(['选择数量最多的一种花色的所有牌并获得之', list], [num, num], true, function(button) {
            var suit = _status.event.suit;
            if (get.suit(button) == suit) return 10;
            return -5;
        }, function(button) {
            var suit = get.suit(button);
            for (var i = 0; i < ui.selected.buttons.length; i++) {
                if (suit != get.suit(ui.selected.buttons[i])) return false;
            }
            return true;
        }).set('suit', sit);
        'step 6'
        if (result.bool) {
            player.gain(result.links, 'log', 'gain2');
            player.skip('phaseDraw');
            event.finish();
        }
        'step 7'
        player.addTempSkill('queyu2');
    },
            },
            "queyu2":{
                trigger:{
                    player:["phaseJudgeBefore","phaseDiscardBefore"],
                },
                forced:true,
                popup:false,
                content:function() {
                    trigger.cancel();
                    if (trigger.name == 'phaseJudge') {
                        var next = player.phaseDraw();
                        next.queyu = true;
                        event.next.remove(next);
                        trigger.next.push(next);
                    } else if (trigger.name == 'phaseDiscard') {
                        var next = player.phaseUse();
                        next.queyu = true;
                        event.next.remove(next);
                        trigger.next.push(next);
                    }
                },
            },
            "ye_ruizhi":{
                trigger:{
                    target:"useCardToAfter",
                },
                direct:true,
                filter:function(event,player){
        return get.type(event.card)=='trick';
    },
                check:function(event,player){
        return true;
    },
                content:function(){
        'step 0'
        player.chooseTarget('是否发动【睿智】？',function(card,player,target){
            return true;
        }).set('ai',function(target){
            var player=_status.event.player;
            if(get.attitude(player,target)>0){
                return get.recoverEffect(target,player,player)+1;
            }
            return 0;
        });
        'step 1'
        if(result.bool){
            player.logSkill('ye_ruizhi',result.targets);
            var target=result.targets[0];
            event.target=target;
            target.judge(function(card){
                if(target.hp==target.maxHp){
                    if(get.color(card)=='red') return -1;
                }
                if(get.color(card)=='red') return 1;
                return 0;
            });
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.color){
            if(result.color=='red'){
                if(event.target.hp<event.target.maxHp) event.target.recover();
            }
			else{
                event.target.draw();
            }
        }
    },
                ai:{
                    effect:{
                        target:function(card,player,target,current){
                if(get.type(card,'trick')=='trick') return 'zerotarget';
            },
                    },
                },
            },
            "ye_miyao":{
                enable:"phaseUse",
                usable:1,
                filter:function(event,player){
        return game.hasPlayer((current)=>lib.skill.ye_miyao.filterTarget(null,player,current));
    },
                filterTarget:function(card,player,target){
        return target.countCards('h')>0;
    },
	selectTarget:function(){
        var player=_status.event.player
        return [1,1+player.getDamagedHp()];
    },
			content:function(){
        'step 0'
        target.chooseToDiscard('h',true);
				'step 1'
                target.recover();
    },
                ai:{
                    order:11,
                    expose:0.2,
                    result:{
                        target:function(player,target){
                if(target.isDamaged()){
                    return 1;
                }
                return -1;
            },
                    },
                },
            },
            "ye_yongheng":{
                trigger:{
                    player:"phaseDiscardBefore",
                },
                forced:true,
                content:function(){
                var num=4-player.countCards('h');
if(num>0) player.draw(num);
if(num<0) player.chooseToDiscard('h',true,-num);
                trigger.cancel();
},
                ai:{
                    noh:true,
                    nogain:true,
                },
                group:["ye_yongheng_1"],
                subSkill:{
                    "1":{
                        forced:true,
                        trigger:{
                            player:"loseAfter",
                            global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
                        },
                        filter:function(event,player){
        if(event.name=='gain'&&event.player==player&&_status.currentPhase!=player) return player.countCards('h')>4;
        var evt=event.getl(player);
        if(!evt||!evt.hs||evt.hs.length==0||player.countCards('h')>=4||_status.currentPhase==player) return false;
        var evt=event;
        for(var i=0;i<4;i++){
            evt=evt.getParent('ye_yongheng_1');
            if(evt.name!='ye_yongheng_1') return true;
        }
        return false;
    },
                        content:function(){
        var num=4-player.countCards('h');
        if(num>0) player.draw(num);
        else player.chooseToDiscard('h',true,-num);
    },
                        sub:true,
                    },
                },
            },
            "ye_zhuqu":{
                unique:true,
                group:"ye_zhuqu2",
                zhuSkill:true,
            },
            "ye_zhuqu2":{
                forceaudio:true,
                trigger:{
                    global:"judgeEnd",
                },
                filter:function(event,player){
					if(event.player==player) return false;
        if(event.player.countCards('h')!=player.countCards('h')&&event.player.group!='yong') return false;
        if(event.result.suit!='diamond') return false;
        return player.hasZhuSkill('ye_zhuqu',event.player);
    },
                direct:true,
                content:function(){
        'step 0'
        trigger.player.chooseBool('是否发动【竹取】，令'+get.translation(player)+'摸一张牌？').set('choice',get.attitude(trigger.player,player)>0);
        'step 1'
        if(result.bool){
            player.logSkill('ye_zhuqu2');
            trigger.player.line(player,'green');
            player.draw();
        }
    },
            },
            "ye_chuangshi":{
                frequent:true,
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                content:function(){
        'step 0'
		player.draw();
        player.chooseTarget(get.prompt2('ye_chuangshi'),[1,Infinity],function(card,player,target){
            return target!=player;
        }).set('ai',function(target){
            return get.attitude(player,target);
        });
        'step 1'
        if(result.bool){
            event.targets=result.targets.slice(0).sortBySeat();
            event.list=event.targets.slice(0);
            player.logSkill('ye_chuangshi',event.targets);
        }
        else{
            event.finish();
        }
        'step 2'
        if(event.targets.length){
            var target=event.targets.shift();
            target.draw()
            target.chooseToUse();
            event.redo();
        }
    },
                ai:{
                    expose:0.3,
                },
            },
            "ye_yuanfa":{
                trigger:{
                    global:"useCard",
                },
                direct:true,
                filter:function(event,player){
        return player==_status.currentPhase&&event.player.isIn()&&!event.player.hasMark('ye_yuanfa');
    },
                content:function(){
        trigger.player.addMark('ye_yuanfa',1,false);
    },
                group:["ye_yuanfa_draw","ye_yuanfa_lose"],
                marktext:"法",
                intro:{
                    content:"使用过牌",
                },
                subSkill:{
                    draw:{
						direct:true,
                        trigger:{
                            player:"phaseJieshuBegin",
                        },
                        filter:function(){
                return game.hasPlayer(function(current){
                    return current.hasMark('ye_yuanfa');
                });
            },
                        logTarget:function(){
                return game.filterPlayer(function(current){
                    return current.hasMark('ye_yuanfa');
                });
            },
			content:function(){
        'step 0'
        player.chooseTarget(get.prompt2('ye_yuanfa'),[1,Infinity],function(card,player,target){
            return target.countMark('ye_yuanfa');
        }).set('ai',function(target){
            return get.attitude(player,target);
        });
        'step 1'
        if(result.bool){
            event.targets=result.targets.slice(0).sortBySeat();
            event.list=event.targets.slice(0);
            player.logSkill('ye_chuangshi',event.targets);
        }
        else{
            event.finish();
        }
        'step 2'
        if(event.targets.length){
            var target=event.targets.shift();
            target.draw()
            event.redo();
        }
    },
                        ai:{
                            result:{
                                player:function(player,target){
                return 1;
            },
                            },
                        },
                        sub:true,
                    },
                    lose:{
                        trigger:{
                            player:"phaseJieshuAfter",
                        },
                        direct:true,
                        filter:function(){
                return game.hasPlayer(function(current){
                    return current.hasMark('ye_yuanfa');
                });
            },
                        logTarget:function(){
                return game.filterPlayer(function(current){
                    return current.hasMark('ye_yuanfa');
                });
            },
                        content:function(){
                game.countPlayer(function(current){
                    var num=current.countMark('ye_yuanfa');
                    if(num){
                        current.removeMark('ye_yuanfa',num);
                    }
                });
            },
                        sub:true,
                    },
                },
            },
            "ye_shenwei":{
				unique:true,
                zhuSkill:true,
                trigger:{
                    global:"useCard",
                },
                filter:function(event,player){
                if(!player.hasZhuSkill('ye_shenwei')) return false;
return event.card.name=='shan'&&event.card.suit=='diamond'&&!player.inRange(event.player)&&event.player!=player;
},
                check:function(event,player){
if(get.damageEffect(event.player,event.source,player)>0||(get.attitude(player,event.player)>0&&get.damageEffect(event.player,event.source,event.player)>0)) return true;
        return false;
    },
                content:function(){
                trigger.all_excluded=true;
            },
                ai:{
                    expose:0.5,
                },
            },
            "ye_shuku":{
				ai:{
                    threaten:function(player,target){
            return 1.6;
        },
                },
                trigger:{
                    global:"phaseEnd",
                },
                filter:function(event,player){
                    return event.player!=player&&!event.player.getHistory('sourceDamage',function(evt){
                    return evt.player==player;
                    }).length;
                },
                frequent:true,
                content:function(){
                    'step 0'
                    event.card=get.cards(0);
                    //player.showCards(event.card);
                    var list=[];
                    player.getCards('s',function(card){
                        if(card.hasGaintag('ye_shuku')) list.add(get.name(card));
                    });
                    if(list.contains(event.card.name)){
                        event.finish();
                    }
                    // else{
                    //     player.gain('gain2',event.card);
                    // }
                    'step 1'
                    player.logSkill('ye_shuku');
                    game.log(player,'将',event.card,'放到了武将牌上');
                    player.loseToSpecial([event.card],'ye_shuku').visible=true;
                    'step 2'
                    player.markSkill('ye_shuku');
                },
                group:["ye_shuku_use"],
                subSkill:{
                    use:{
                        trigger:{
                            player:"loseAfter",
                        },
                        forced:true,
                        filter:function(event,player){
                            if(!event.ss||!event.ss.length) return false;
                            for(var i in event.gaintag_map){
                                if(event.gaintag_map[i].contains('ye_shuku')) return true;
                                return false;
                            }
                        },
                        content:function(){
                            'step 0'
                            var num=player.getCards('s',function(card){
                                return card.hasGaintag('ye_shuku');
                            }).length;
                            if(num) player.markSkill('ye_shuku');
                            else player.unmarkSkill('ye_shuku');
                            'step 1'
                            game.updateRoundNumber();
                        },
                        sub:true,
                    },
                },
                marktext:"书",
                intro:{
                    markcount:function(storage,player){
                        return player.getCards('s',function(card){
                            return card.hasGaintag('ye_shuku');
                        }).length;
                    },
                    onunmark:function(storage,player){
                        var cards=player.getCards('s',function(card){
                            return card.hasGaintag('ye_shuku');
                        });
                        if(cards.length){
                            player.lose(cards,ui.discardPile);
                            player.$throw(cards,1000);
                            game.log(cards,'进入了弃牌堆');
                        }
                    },
                },
                mod:{
                    aiOrder:function(player,card,num){
                        if(get.itemtype(card)=='card'&&card.hasGaintag('ye_shuku')) return num+0.5;
                    },
                },
            },
            "ye_kongjian":{
                trigger:{
                    global:"gameDrawBegin",
                    player:"phaseBegin",
                },
                forced:true,
                init:function(player) {
                    if (!player.storage.ye_kongjian) {
                        player.storage.ye_kongjian = [];
                    };
                },
                content:function(){
                    'step 0'
                    if(!_status.spaceskilllist){
                        var list=get.gainableSkills();
                        var skills=[];
                        for(var i of list){
                            var info1=get.translation(i+'_info');
                            var info2=get.info(i);
if(info1&&(info1.indexOf('手牌')!=-1||info1.indexOf('座次')!=-1||info1.indexOf('装备区')!=-1)&&info1.indexOf('武将牌')==-1&&info1.indexOf('身份牌')==-1&&!player.hasSkill(i)&&info2&&!info2.juexingji&&!info2.hiddenSkill&&!info2.zhuSkill&&!info2.charlotte&&!info2.limited) skills.add(i);
                        }
                        _status.spaceskilllist=skills;
                    }
                    'step 1'
                    if(player.storage.ye_kongjian.length){
                        for(var i of player.storage.ye_kongjian){
                            player.removeSkill(i)
                            _status.spaceskilllist.add(i);
                        }
                    }
                    player.storage.ye_kongjian=[];
                    'step 2'
                    if(_status.spaceskilllist.length){
                        event.skills=_status.spaceskilllist;
                        event.skill=event.skills.randomGet();
                        event.goto(3);
                    }
                    else event.goto(5)
                    'step 3'
                    event.skills.remove(event.skill);
                    if(player.awakenedSkills.contains(event.skill)){
                        player.restoreSkill(event.skill);
                        game.log(player,'恢复了技能','【'+get.translation(event.skill)+'】');
                    }
                    else if(!player.hasSkill(event.skill)){
                        player.addSkill(event.skill);
                        player.popup(event.skill);
                        player.storage.ye_kongjian.add(event.skill);
                        player.restoreSkill(event.skill);
                        game.log(player,'获得了技能','【'+get.translation(event.skill)+'】');
                    }
                    'step 4'
                    if(player.storage.ye_kongjian.length<2&&event.skills.length){ 
                        event.skill=event.skills.randomGet();
                        event.goto(3);
                    }
                },
                ai:{
                    threaten:1,
                },
            },
            "ye_shikong":{
                forced:true,
                trigger:{
                    player:"useCard1",
                },
                filter:function(event,player){
        if(event.card.name!='sha') return false;
        var card=event.card;
        var range;
        var select=get.copy(get.info(card).selectTarget);
        if(select==undefined){
            if(get.info(card).filterTarget==undefined) return false;
            range=[1,1];
        }
        else if(typeof select=='number') range=[select,select];
        else if(get.itemtype(select)=='select') range=select;
        else if(typeof select=='function') range=select(card,player);
        game.checkMod(card,player,range,'selectTarget',player);
        return range[1]==-1;
    },
                content:function(){},
                mod:{
                    selectTarget:function(card,player,range){
            if(card.name=='sha'){
                range[0]=-1; range[1]=-1;
            }
        },
                },
            },
            "ye_ronhui":{
                forced:true,
                trigger:{
                    source:"damageAfter",
                },
                filter:function(event,player){
                return player!=event.player&&event.card&&event.card.name=='sha'&&event.player.countCards('e')>0;;
            },
                content:function(){
                var num=trigger.player.countCards('e');
            if(num) player.discardPlayerCard(trigger.player,'e',num,true);
            },
            },
            "ye_jubian":{
                trigger:{
                    player:"useCardAfter",
                },
                filter:function(event,player){
var num=0;
for(var i of event.targets){
i.getHistory('damage',function(evt){
if(evt.getParent(2)==event) num+=1;
});
}
if(!player.isDamaged()) return false;
return num>1;
},
                forced:true,
                content:function(){
player.recover();
},
            },
            "ye_hengxing":{
                forced:true,
                trigger:{
                    player:"phaseJieshuBegin",
                },
                content:function(){
    player.draw(3)
        player.loseHp();
    },
            },
            "ye_dongquchunlai":{
                trigger:{
                    global:"roundStart",
                },
                nobracket:true,
                forced:true,
                content:function(){
                'step 0'
                player.chooseControl('失去体力上限','增加体力上限').set('ai',()=>{
                    if(player.maxHp>=player.hp+2) return 0;
                    return 1;
                }).set('prompt',get.prompt('ye_dongquchunlai')).set('prompt2','选择一项');
                'step 1'
                player.logSkill('ye_dongquchunlai');
                if(result.control=='失去体力上限'){
                    player.loseMaxHp();
                    player.recover();
                }
                else {
                    player.gainMaxHp(true);
                    player.loseHp();
                }
            },
            },
            "ye_aosha":{
	trigger:{
        player:"phaseEnd",
    },
    frequent:true,
    content:function(){
        'step 0'
        player.draw();
        'step 1'
        if(Array.isArray(result)&&result.length){
            var gained=result[0];
            if(lib.filter.cardEnabled(gained,target)){
                var next=player.chooseToUse();
                next.filterCard=function(card){
                    return card==gained;
                };
                next.prompt='是否使用'+get.translation(gained)+'？';
            }
            else{
                event.finish();
            }
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.bool){
            player.draw();
        }
    },
    ai:{
        threaten:1.6,
    },
},
             "ye_shenyingbuff":{
            group:"undist",
			mod:{
				cardEnabled:function(){
            return false;
        },
                    cardSavable:function(){
            return false;
        },
        playerEnabled:function(card,player,target){
             return false;
        },
		targetEnabled:function(card,player,target,now){
         return false;
},
    },
	        unique:true,
    trigger:{
        player:["recoverBefore","damageBefore","loseHpBefore","gainMaxHpEnd","loseMaxHpEnd"],
    },
    content:function(){
      trigger.cancel();
},
            forced:true,
            popup:false,
            charlotte:true,
            mark:true,
            intro:{
                content:"神隐中：不计入距离和座次的计算；不能使用牌且不是牌的合法目标；回复体力/流失体力/受到伤害/体力上限变化时，取消之。",
            },
			ai:{
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'recover')||get.tag(card,'damage')) return 'zeroplayertarget';
            },
                    },
                },
            },
},
        translate:{
			ye_weizheng:"危政",
            "ye_weizheng_info":"<b><font color=orange>主公技</font></b><br>其他角色的结束阶段,若其本回合造成过伤害，其可将一张红色手牌当【远交近攻】对你使用，然后其弃置一张手牌",
			ye_ershi:"二世",
            "ye_ershi_info":"<b><font color=orange>锁定技</font></b><br>游戏开始时，你废除武器栏、坐骑栏和宝物栏,然后视为装备了【飞龙夺凤】、【六龙骖驾】、【玉玺】和【虚妄之冕】。",
			santou:"三骰",
            "santou_info":"回合结束时，你可以将你的手牌数调整至体力上限并展示你的手牌，根据你手牌的点数，你执行以下效果：1.不大于3种点数，你增加1点体力上限；2.不大于2种点数，你回复1点体力并摸2张牌；3.不大于1种点数，你将体力上限调整为3并弃置所有手牌，然后从牌堆或弃牌堆中获得每种牌名的基本牌和普通锦囊牌各一张。",
			ye_feixiang:"绯想",
            "ye_feixiang_info":"当判定牌生效前，你可以观看并选择一名角色的一张牌，令其打出此牌替换之。",
			ye_dizhen:"地震",
            "ye_dizhen_info":"当你使用【杀】指定一名目标后，你可以判定，若结果为红色，你观看其手牌并将其中一张牌置于牌堆顶或弃置之。",
			ye_tianren:"天人",
            "ye_tianren_info":"<b><font color=orange>主公技</font></b><br>当你于回合外需要使用/打出【闪】或【杀】时，你可以令其他战势力或其场上牌数小于等于你的角色选择是否打出之（其打出的牌结算完毕后视为你使用/打出此牌）。",
			jumu:"<span style=\"color:#AA0000\">巨目",
            "jumu_info":"锁定技，你成为其他角色牌的目标时，双方摸1张牌并进行一次拼点(你的拼点牌为目标对你使用的那张牌)，若你赢此牌对你无效。",
			ye_toupai:"偷拍",
            "ye_toupai_info":"摸牌阶段，你可以改为选择至多两名有手牌的其他角色，观看这些角色各手牌并可以弃置各一张基本牌。",
			ye_qucai:"取材",
            "ye_qucai_info":"当其他角色于你的回合内使用红色牌时或因弃置而失去红色牌后，你可以摸一张牌。",
				 ye_dengcha:"等差",
            "ye_dengcha_info":"出牌阶段限一次，你可以弃置三张点数呈等差数列的牌(公差d不为0)，然后执行以下效果：<br><li>①点数同为奇数，你对至多八名角色各造成1点伤害，然后你摸X张牌（X为以此法受到伤害后，体力值为1的角色数+1）；<br><li>②点数同为偶数，你令至多八名已受伤的角色回复1点体力，然后你摸Y张牌（Y为以此法回复体力后未受伤的角色数+1）；<br><li>③点数有奇有偶，你令所有角色失去1点体力，然后你摸四张牌。",
			ye_shengge:"圣格",
            "ye_shengge_info":"<b><font color=orange>觉醒技</font></b><br>准备阶段开始时，若你没有手牌或手牌数唯一最少，你减1点体力上限，摸三张牌。",
			ye_qingting:"倾听",
            "ye_qingting_info":"出牌阶段限一次，你可以令有手牌的所有其他角色各将一张手牌交给你（“圣格”发动后，改为你获得这些角色各一张手牌），然后你交给这些角色各一张手牌。",
			ye_chiling:"敕令",
            "ye_chiling_info":"<b><font color=orange>主公技</font></b><br>当其他角色获得你的手牌后，你可以令其展示之，若其中有【杀】，其可以使用【杀】。",
			ye_xiuye:"朽叶",
            "ye_xiuye_info":"若你的人物牌上没有与之类别相同的“叶”，你可以使用或打出弃牌堆中的♣基本牌或♣普通锦囊牌。以此法使用或打出的牌结算完毕后，你将之置于人物牌上，称为“叶”。",
	        ye_kuanji:"狂季",
            "ye_kuanji_info":"当你使用手牌结算完毕后，或当你受到伤害后，你可以选择一项：将牌堆顶的四张牌置入弃牌堆；或将所有“叶”以任意顺序置于牌堆底。",
	        ye_yibian:"异变",
            "ye_yibian_info":"<b><font color=silver>永久技</font></b><br>身份牌暗置的角色发动或触发其拥有的非永久技时，须明置其身份牌；一名角色准备阶段开始时，你令其选择是否明置其身份牌。",
	        ye_tuizhi:"退治",
            "ye_tuizhi_info":"当你使用♥牌时或成为其他角色使用♥牌的目标后，你可以暗置一名其他角色的身份牌，令其于此回合内不能明置身份牌。",
	        ye_tongjie:"同诘",
            "ye_tongjie_info":"<b><font color=silver>永久技</font></b><br>当其他角色明置身份牌时，若其属于身份牌明置的角色数最多的阵营，你摸一张牌；其他角色不能于你的回合内明置身份牌。",
			ye_huisheng:"回声",
            "ye_huisheng_info":"当你每回合首次成为其他角色的基本牌或非延时锦囊牌的目标后后，你可以视为对其使用同名牌。",
			ye_yexiang:"夜响",
            "ye_yexiang_info":"当延时类锦囊牌从其他角色的判定区移出后，你可以弃置其两张手牌。",
			ye_fandu:"泛读",
            "ye_fandu_info":"准备阶段开始时或当你受到1点伤害后，你可以摸两张牌，然后令一名其他角色弃置你的一张手牌，若为非基本牌，你可对其发动技能【讨还】",
			ye_taohuan:"讨还",
            "ye_taohuan_info":"当其他角色获得你的一张牌后，你可以与其拼点，当你赢后，你获得其一张牌。 ",
			ye_shanxing:"缮形",
            "ye_shanxing_info":"当一名角色失去装备区里的牌后，你可以令其摸一张牌，然后其可以交给你一张手牌。",
			ye_lingshou:"灵守",
            "ye_lingshou_info":"结束阶段开始时，你可以观看一名其他角色的手牌并展示其中一张牌，令其选择将此牌和其装备区里所有同花色的牌当【杀】使用或重铸之。",
			ye_qijue:"祈绝",
            "ye_qijue_info":"<b><font color=orange>主公技</font></b><br>当其他鬼势力或体力上限不小于你当前体力值的角色杀死一名角色后或死亡时，其可以令你回复1点体力。",
			ye_yushou:"狱守",
            "ye_yushou_info":"其他角色的准备阶段开始时，你可以弃置一张牌，若如此做，当其于此回合内使用第一张有点数的基本牌或普通锦囊牌时，若点数小于等于之，此牌无效。",
			ye_lingdu:"灵渡",
            "ye_lingdu_info":"当你于回合外失去了任意区域（手牌/装备/判定区）内的最后一张牌时，你可以摸一张牌。",
			ye_dimai:"地脉",
            "ye_dimai_info":"<b><font color=silver>永久技</font></b><br>一名角色的判定阶段开始时，若其判定区没有牌，其执行一张随机延时锦囊牌的效果。",
			ye_tiandao:"天道",
            "ye_tiandao_info":"当一名角色的判定牌生效后，你可以对其使用此牌（无距离限制）。",
			ye_lingjun:"领军",
            "ye_lingjun_info":"当你于一个回合使用第一张【杀】指定唯一目标时，你可以令除目标外所有角色于此回合可将一张基本牌当【杀】使用，然后当你于此回合使用【杀】对唯一目标结算完毕后，其他角色可以选择对目标使用一张【杀】。",
			ye_ciou:"瓷偶",
            "ye_ciou_info":"一名角色的结束阶段开始时，若你于此回合内受到过属性伤害或由转化牌造成的伤害，你可以回复1点体力。",
		ye_nizhuan:"逆转",
            "ye_nizhuan_info":"每阶段限一次，当你使用【杀】指定第一个目标后/成为【杀】的第一个目标后，你可以与目标/使用者交换手牌。若如此做，此【杀】结算结束后，若你与其皆存活，你与其交换手牌。 ",
		ye_guizha:"诡诈",
            "ye_guizha_info":"当你进入濒死状态时，你可以观看一名其他角色的手牌并可以获得其中的一张【桃】或【酒】。",
			qiuyao:"丘谣",
            "qiuyao_info":"回合开始或回合结束时，你可以从牌堆或弃牌堆中获得一张点数为A的牌，然后令此技能获得牌的点数+1。",
			 "ye_yuangling":"怨灵",
            "ye_yuangling_info":"当你受到伤害后，你可以视为对来源使用一张火【杀】；然后若你的体力值小于等于2，你摸一张牌。",
			 "ye_songzang":"送葬",
			 "ye_songzang_info":"<b><font color=orange>锁定技</font></b><br>①当一名其他角色首次进入濒死时，你从牌堆或弃牌堆中获得一张黑色牌。<br>②当其他角色向你求【桃】时，你可以弃置一张♠牌，令其死亡并视为由你杀死。",
			yingping: "应评",
                        yingping_info: "你于回合<span class='bluetext'>内</span>/<span class='legendtext'>外</span>获得牌后，可以对任意合法目标角色<span class='bluetext'>视为使用其中一张即时牌</span>/<span class='legendtext'>使用其中一张牌</span>。",
			"seer_qinyin":"琴音",
            "seer_qinyin_info":"每回合限两次，当你手牌数变化后，若你的手牌数为宫商角徵羽(12356)中的一个音，你可以选择一名本回合未选择过的知音（手牌数为宫商角徵羽中的一个音的其他角色），然后其与你将手牌数摸至下一个音（手牌数为羽则摸至8张）。",
			 "df_s0501":"禁忌",
            "df_s0501_info":"摸牌阶段,你可以放弃摸牌,改为亮出牌堆顶的六张牌,然后获得其中三张,之后,你可以弃置至多两张手牌,若如此做,本回合其他角色不能使用或打出与你弃置的牌名字相同的牌。",
            "df_s0502":"破灭",
            "df_s0502_info":"每回合每名角色限一次,当你对一名角色造成伤害时,可以弃置其任意一个区域(包括手牌)内X张牌，X为你本次造成的伤害值,若你本次以此法弃置了其一个区域所有牌，则再对其造成一点伤害。",
			"ye_maihuo":"埋火",
            "ye_maihuo_info":"出牌阶段限一次，你可以将一张牌置于牌堆顶，令一名其他角色：亮出牌堆顶的两张牌并获得之，然后若均为红色，你可以摸两张牌或回复1点体力。",
			"ye_wunian":"无念",
            "ye_wunian_info":"<b><font color=orange>锁定技</font></b><br>你即将造成的伤害视为无来源；当你成为其他角色使用锦囊牌的目标时，若你已受伤，你取消你这个目标。 ",
			"ye_jiliao":"寂寥",
            "ye_jiliao_info":"出牌阶段限一次，你可以令一名角色获得其装备区里的所有牌（可以为零），然后若其手牌数大于等于其体力值，你可以弃置其一张手牌。",
			"ye_zhongyan":"终焉",
            "ye_zhongyan_info":"<b>限定技</b><br>当你受到其他角色造成的伤害时，你可以防止此伤害，令其失去X点体力（X为其已损失的体力值且至少为1）。 ",
	"ye_bushu":"不输",
            "ye_bushu_info":"当你或一名在你攻击范围内的角色受到伤害后，若其存活且伤害来源为另一名其他角色，你可以与伤害来源拼点：当你赢后，其回复1点体力；当你没赢后，你获得来源的拼点牌。",
	"ye_chuanchen":"传承",
            "ye_chuanchen_info":"当你死亡时，你可以令一名其他角色获得〖乾坤〗和〖传承〗，然后其获得你区域里所有的牌。",
	"ye_jiyii":"祭仪",
            "ye_jiyii_info":"摸牌阶段结束时，你可以弃置两张牌，若如此做，此回合结束时，你摸三张牌。",
	"ye_qiji":"奇迹",
            "ye_qiji_info":"每阶段限一次,你可以将最后一张手牌当任意基本牌或普通锦囊牌使用或打出。",
			"ye_kuixin":"窥心",
            "ye_kuixin_info":"<b><font color=orange>锁定技</font></b><br>当你使用牌对其他角色或其他角色使用牌对你结算结束后，若此牌目标数为1，且该角色的明置手牌数小于等于你已损失的体力值，你令其随机明置其一张手牌。 ",
			"ye_xinhua":"心花",
            "ye_xinhua_info":"出牌阶段限一次，若场上存在有明置手牌的角色，你可以令这些角色各弃置一张明置手牌，然后你可以依次使用这些牌（无次数限制），若你以此法使用了所有牌，此技能视为未发动过。",
			"ye_shidie":"死蝶",
            "ye_shidie_info":"准备阶段开始时，你摸一张牌并可以视为对一名手牌数小于等于你的角色使用【杀】。 ",
			"ye_yiling":"役灵",
            "ye_yiling_info":"其他角色的回合开始时，你可以弃置装备区里至少一张牌并摸等量的牌，然后令其于本回合内拥有“死蝶”。",
			"ye_morang":"墨染",
            "ye_morang_info":"<b><font color=orange>主公技</font></b><br>当其他妖势力或体力值小于等于你的角色受到一点伤害后，其可以判定，当黑色判定牌生效后，你获得之。",
			"dswn_hualuo":"花落",
            "dswn_hualuo_info":"当你使用牌指定其他角色为目标后，若目标没有【落】标记，你可以令目标获得与此牌花色相对应的【落】标记直至其回合结束。<li>有【落】标记的角色无法使用或打出与【落】标记花色相对应的手牌，且你对拥有【落】标记的角色使用与该角色拥有的【落】标记花色相对应的牌时，没有距离与次数限制。<li>当拥有【落】标记的角色的牌因弃置而进入弃牌堆后，你可以获得这些牌中与该角色的【落】标记花色相对应的牌。",
			"dswn_hualuo2":"花落",
            "dswn_hualuo2_info":"",
			"dswn_canhuang":"残荒",
            "dswn_canhuang_info":"<b><font color=orange>锁定技</font></b><li>你始终视为拥有【荒】标记<li>所有拥有【荒】标记的角色均视为在你使用【杀】时的攻击范围内<li>当你失去体力后，你可以摸X张牌或令至多X名角色获得【荒】标记直至他们首次受到伤害。（X为你已损失的体力且至少为1，摸牌时至多为5）<li>【荒】：你的回合结束时，进行一次判定，若结果不为红桃，你失去一点体力。",
            "dswn_heidie":"黑蝶",
            "dswn_heidie_info":"当你成为一名角色使用【杀】的目标时，你可以令此【杀】不可被响应，若如此做，你视为对该角色使用一张无视防具的【杀】。",
			"hzqeg_mingyun":"命运",
            "hzqeg_mingyun_info":"<b><font color=orange>锁定技</font></b><br>当一名角色使用牌时，若此牌与牌堆顶部的牌花色或点数相同，你将牌堆顶部的牌置入〖命运〗，当一名角色进入濒死时，你获得〖命运〗中所有的牌。",
			"ye_yanmo":"炎魔",
            "ye_yanmo_info":"<b><font color=orange>锁定技</font></b><li>每当你造成或受到以【杀】为来源的伤害后，你获得等同于伤害值的【炎魔】标记。每当一名角色受到一次火焰伤害后，其与伤害来源各获得一枚【炎魔】标记。<li>你与拥有【炎魔】标记的角色的距离视为一。你每次受到的火焰伤害不会超过一点。",
            "ye_zhuolanjiangui":"灼烂歼鬼",
            "ye_zhuolanjiangui_info":"①你使用普【杀】时，你可以为此【杀】赋予火属性。<br>②你的回合结束时，你可以选择一名拥有【炎魔】标记数大于等于其体力值的角色，弃置一名其所有的【炎魔】标记，选择对其造成一点火焰伤害或令其恢复一点体力，然后你摸X张牌。否则你摸一张牌。（X为其拥有的标记数减去其结算效果前当体力值的数量且至多为三）。",
			ye_menfei:"门扉",
            "ye_menfei_info":"出牌阶段，若所有角色均没有【扉】标记，你可以令一名角色获得【扉】标记。当你使用牌结算完毕后，你将【扉】标记转移给拥有该标记的角色的下家。",
			ye_houhu:"后户",
            "ye_houhu_info":"当你使用非装备牌指定角色为目标时，若拥有【扉】标记的角色：是此牌的目标，你可以摸一张牌；不是此牌的目标且此牌不为延时锦囊牌，你可以令其成为额外目标（无距离限制）。",
			ye_qixian:"绮想",
            "ye_qixian_info":"当有牌不因使用、打出或弃置置入弃牌堆后，若其中有♥牌，你可以令一名角色摸一张牌。 ",
			ye_fengmo:"封魔",
            "ye_fengmo_info":"当其他角色于回合内首次使用基本牌时，你可以弃置一张牌并令该角色判定。若结果为红色，此牌无效，否则你摸一张牌。",
			ye_fengmo2:"封魔",
            "ye_fengmo2_info":"",
			ye_boli:"博丽",
            "ye_boli_info":"<b><font color=orange>主公技</font></b><br>当非♥的判定牌生效前，你可以令其他角色选择是否打出♥手牌代替之。",
			yinni:"隐匿",
            "yinni_info":"你的回合结束后，若你这个回合没造成过伤害，则你可以令你不能成为【杀】和【决斗】的目标直到你的下个回合，并摸一张牌。",
            yee_qiji:"奇击",
            "yee_qiji_info":"你的回合外其他角色的【杀】被【闪】抵消时，你可以弃置一张牌并让那张【杀】依然造成伤害。",
            eyinni:"隐匿",
            "eyinni_info":"美游已经悄悄躲进垃圾桶了。(*^▽^*)",
			"ye_shenyingbuff":"神隐",
            "ye_shenyingbuff_info":"不计入距离和座次的计算；不能使用牌且不是牌的合法目标；回复体力/流失体力/受到伤害/体力上限变化时，取消之。",
			"xin_yd":"焰蝶",
            "xin_yd_info":"你的回合开始时，你可以转移1枚“蝶”",
			"xin_jr":"燼染",
            "xin_jr_info":"一名拥有“蝶”标记的其他角色的回合开始时，该角色需弃置一张手牌或令你收回“蝶”并摸一张牌，然后受到你造成一点伤害。",
			"yan_die":"焰蝶",
            "yan_die_info":"<li>游戏开始时，你获得三枚“蝶”标记;<li>你的回合开始时，你可以转移1枚“蝶”;<li>摸牌阶段，若你有“蝶”标记，你额外摸一张牌。<li>其他角色死亡时，若其拥有“蝶”标记，你回收之并摸两张牌。",
            "yd3":" ",
            "yd3_info":"",
            "y_f":" ",
            "y_f_info":"",
            "lishan":"离殇",
            "lishan_info":"<b><font color=orange>锁定技</font></b><br>每两轮限一次，当你进入濒死状态时，你将体力回复至1点并可视为使用一张【杀】",
            "yd_5":" ",
            "yd_5_info":"",
			"xin_daoxi":"刀袭",
            "xin_daoxi_info":"你受到伤害或造成伤害时，获得一枚“刀袭”标记，每有一枚“刀袭”标记，你计算与其他角色距离便-1，手牌上限+1；当“刀袭”标记为3时，重置“刀袭”标记，然后摸一张牌并强化“噬魔”。",
            "xin_sm":"噬魔",
            "xin_sm_info":"当你使用【杀】指定一名角色为目标后，你可以失去一点护甲或失去一点体力令此牌不可被响应并摸一张牌。",
			"ye_zhanxing":"瞻星",
            "ye_zhanxing_info":"<b><font color=orange>锁定技</font></b><br>回合结束后，你亮出牌堆顶的两张牌，然后获得其中花色与你手牌中已有花色均不同的牌，并将其余牌进入弃牌堆",
			"ye_shoushan":"受伤",
            "ye_shoushan_info":"",
			"ye_juji":"狙击",
            "ye_juji_info":"出牌阶段限一次，你可弃置至多三张牌并选择一名你不在其攻击范围内的其他角色，并执行以下等量效果：其受到一点伤害/你摸一张牌/其下一个摸牌阶段少摸一张牌。",
            "ye_yinbi":"隐蔽",
            "ye_yinbi_info":"<b><font color=orange>锁定技</font></b><br><li>当你受到伤害后/游戏开始时，你的防御距离+1。<li>出牌阶段开始时，你可以弃置一张牌并令你的防御距离+1。<li>回合开始时，你将累计的防御距离清零并摸等量的牌。",
            "ye_siji":"四季",
            "ye_siji_info":"<b><font color=orange>锁定技</font></b><br>每回合限一次，当场上有角色回复体力/进入濒死阶段前,你摸一张牌",
            "ye_bianyi":"变异",
            "ye_bianyi_info":"当一名角色死亡时，你可以增加2点体力上限并摸一张牌并获得下列技能中的任意一个：〖却敌〗、 〖秽形〗（若技能全部拥有则改为摸两张牌。）。",
            "ye_fuhuai":"腐坏",
            "ye_fuhuai_info":"<b><font color=orange>锁定技</font></b><br>你的准备阶段开始时，你失去1点体力，然后摸1张牌，加一点体力上限。",
            "ye_huixing":"秽形",
            "ye_huixing_info":"<b><font color=orange>锁定技</font></b><br>你的手牌上限为你的体力上限，你可以多出一张杀。",
            "ye_fusheng":"复生",
            "ye_fusheng_info":"当你进入濒死状态时，你可以失去2点体力上限，然后摸2张牌并将体力回复至1点。",
            "ye_paohuo":"炮火",
            "ye_paohuo_info":"出牌阶段限一次，你可以对一名角色造成一点火焰伤害，然后你弃置X张牌。（X为其已损失的体力值）",
            "ye_hongming0":"轰鸣",
            "ye_hongming0_info":"造成1点火焰伤害",
            "ye_hongming":"轰鸣",
            "ye_hongming_info":"<b>限定技</b><li>当你即将造成火焰伤害时，你可以令此伤害+1，并对目标距离3以内的所有其他角色各造成一点火焰伤害。",
            "ye_gaoge":"高歌",
            "ye_gaoge_info":"<b><font color=orange>锁定技</font></b><br>当场上有角色受到火焰伤害后，你摸一张牌。",
            "ye_qiyue":"契约",
            "ye_qiyue_info":"其他角色的回合结束时，若其本回合内造成过伤害，则你可以选择一项：⒈将一张牌当做【冰杀】对其使用。⒉视为对其使用一张【过河拆桥】。",
            "ye_yinguo":"因果",
            "ye_yinguo_info":"<b><font color=orange>锁定技</font></b><br>当你造成或受到伤害时，你增加一点体力上限。若此次为一名角色首次对你造成伤害，则你额外回复一点体力。",
            "ye_yuanhuan":"圆环",
            "ye_yuanhuan_info":"一名已受伤的角色的回合结束时，若你已损失体力值大于等于3，你可以减少自身2点体力上限，令其回复一点体力并摸一张牌。",
            "ye_kongfu":"空腹",
            "ye_kongfu_info":"<b><font color=orange>锁定技</font></b><li>摸牌阶段，你少摸一张牌；<li>你没有弃牌阶段；<li>结束阶段，你摸一张牌，然后若你手牌数小于你的体力上限，你摸X张牌（X为你已经损失的体力值）。",
            "ye_kaiyan":"开宴",
            "ye_kaiyan_info":"<b><font color=orange>主公技</font></b><br>当你使用或打出一张【桃】或【桃园结义】时，你可以将两张牌交给一名其他角色，然后你摸一张牌。",
            "ye_juhe":"居合",
            "ye_juhe_info":" <b><font color=orange>锁定技</font></b><li>当你使用【杀】指定角色时，若你装备区的牌大于等于【杀】的目标，此【杀】需要连续打出2张闪响应;<li>每回合限一次，你可以令你使用的杀额外结算1次；<li>你使用的杀无视目标防具。",
            "ye_jiangqi":"剑气",
            "ye_jiangqi_info":"当你使用实体【杀】结算结束后，你可摸X张牌（X为你杀死角色数的一半且向上取整）。",
            "ye_luoshuitianyi":"洛水天依",
            "ye_luoshuitianyi_info":"回合开始时选择一项发动。<li><font color=#66CCFF>中华食谱颂</font>：全体角色回复一点体力值。<li><font color=#66CCFF>英雄出征</font>：全体角色流失一点体力。<li><font color=#66CCFF>操戈天下</font>：全体角色摸2张牌。<li><font color=#66CCFF>权御天下</font>：全体角色弃置2张牌",
            "ye_shanliangdengchang":"闪亮登场",
            "ye_shanliangdengchang_info":"<font color=#66CCFF>天依闪亮登场</font>",
            "DALF_jizai":"记载",
            "DALF_jizai_info":"<b><font color=orange>转换技</font></b><br>其他角色摸牌阶段结束时，你可以：<br>①交给其一张手牌并令其摸一张牌，观看其手牌，将其中两张牌置底；<br>②令其摸两张牌，观看其手牌，将其中一张牌置底，再获得其中另一张牌。",
            "DALF_niegao":"嗫告",
            "DALF_niegao_info":"出牌阶段，你可以声明一种牌名（每回合每种类别限两次）并亮出牌堆底的牌。若之牌名与你声明相同，你令一名角色获得之，其可使用之；不同，该技能本阶段失效。若类别相同、且你声明的是即时牌名，你可视为使用声明的牌名牌（不计入次数限制）。",
            "ye_bukeshizhishou":"不可视之手",
            "ye_bukeshizhishou_info":"出牌阶段限一次，你可以失去1点体力，然后摸一张牌并依次视为使用两张【顺手牵羊】。你对手牌大于等于你的角色使用【顺手牵羊】无距离限制。",
            "ye_baizhao":"百招",
            "ye_baizhao_info":"<b><font color=orange>锁定技</font></b><br>当你使用或打出牌时，你摸一张牌然后弃置一张牌。",
            "ye_wuyazuofeiji":"乌鸦坐飞机",
            "ye_wuyazuofeiji_info":"准备阶段，若你没有手牌，你摸四张牌。",
            "SE_xuanlan":"绚烂",
            "SE_xuanlan_info":"<b><font color=orange>锁定技</font></b><br>若你未受伤，你跳过弃牌阶段",
            "SE_caiyu":"彩雨",
            "SE_caiyu_info":"一名角色的结束阶段开始时，若“虹”数为4，则你可以获得所有“虹”并弃置两张牌，然后你可以减1点体力上限并获得1点护甲。 ",
            "SE_huaxiang":"杀",
            "SE_huaxiang_info":"",
            "SE_huaxiang2":"火杀",
            "SE_huaxiang2_info":"",
            "SE_huaxiang3":"雷杀",
            "SE_huaxiang3_info":"",
            "SE_huaxiang4":"无懈可击",
            "SE_huaxiang4_info":"",
            "SE_huaxiang5":"桃",
            "SE_huaxiang5_info":"",
            "SE_huaxiang6":"闪",
            "SE_huaxiang6_info":"",
            "SE_huaxiang7":"华想",
            "SE_huaxiang7_info":"当你需要使用/打出【杀】、【闪】、【桃】或【无懈可击】时，你可以声明之(若你的体力上限大于2/1，则不能声明【桃】/【无懈可击】)并将一张与所有“虹”的花色均不同的牌置于武将牌上，称为“虹”，然后视为使用/打出之。 ",
            "SE_zhouye":"昼夜",
            "SE_zhouye_info":"<b><font color=orange>锁定技</font></b><br>出牌阶段开始时，你弃所有【夜】标记，然后将牌堆顶的一张牌置入弃牌堆，若为黑色，你获得一枚【夜】标记。<br>若你没有【夜】标记，你不能使用【杀】",
            "SE_hongwu":"红雾",
            "SE_hongwu_info":"出牌阶段，若你没有【夜】标记，你可以弃置一张红色牌，获得一枚“夜”标记",
            "SE_shenqiang":"神枪",
            "SE_shenqiang_info":"出牌阶段限两次，若你有【夜】标记，你可以弃置一张红桃牌或武器牌，对一名其他角色造成1点伤害",
            "SE_yewang":"夜王",
            "SE_yewang_info":"若你有【夜】标记，每阶段每项限一次。<br>①你使用指定其他角色为唯一目标的牌结算后可视为对其使用此牌。<br>②其他角色使用指定你为唯一目标的牌结算后，你可以弃置其一张牌。",
            "SE_zhouye2":"昼夜2",
            "SE_zhouye2_info":"",
            "SE_xijian":"隙间",
            "SE_xijian_info":"①1名除你以外的角色回合开始时，若其不再你的攻击范围内，你可以弃置1张方块牌并令其选择：<li>1、交给你1张黑桃牌，<li>2、受到没有来源的1点伤害；<br>②1名除你以外的角色回合结束时，若其在你攻击范围内，你可以弃置1张梅花牌并令其选择：<li>1、交给你1张红桃牌，<li>2、受到没有来源的1点伤害。",
            "SE_jiexian":"界限",
            "SE_jiexian_info":"①当一名角色受到伤害时，你可以弃置一张♥牌，防止此伤害，令其回复1点体力。<br>②当一名角色回复体力时，你可以弃置一张♠牌，防止此体力回复效果，令其受到无来源的1点伤害。 ",
            "SE_jiexian2":"界限",
            "SE_jiexian2_info":"",
            "SE_xijian2":"隙间",
            "SE_xijian2_info":"",
            "SE_zhuoyan":"灼眼",
            "SE_zhuoyan_info":"<li>当你造成非火焰伤害时，你可将你造成的伤害改为火焰伤害;<li>你造成伤害后可弃置受到伤害的角色的一张牌。",
            "SE_shenpan":"断罪",
            "SE_shenpan_info":"出牌阶段限一次，你可以弃置三张不同类别的牌，对至多三名其他角色各造成一点伤害。",
            "SE_duanzui":"审判",
            "SE_duanzui_info":"出牌阶段限一次，你可以获得一名其他角色的所有牌，然后还给其等量的牌，若你归还的牌均为你获得的牌且该角色体力值大于等于你，你对其造成1点伤害",
            "ye_qianbing2":"千兵",
            "ye_qianbing2_info":"",
            "ye_qianbing":"千兵",
            "ye_qianbing_info":"<b><font color=orange>锁定技</font></b><li>你使用装备牌无数量上限。<li>当你失去一张装备区内的牌后，你摸一张牌。",
            "ye_juanxi":"卷袭",
            "ye_juanxi_info":"①<b><font color=orange>锁定技</font></b><br>每当你不因此技能使用一张装备牌后，你随机使用一张牌堆中的装备牌。②每回合限一次。一名角色使用装备牌后，你可选择：<li>⒈弃置此牌。<li>⒉弃置一张手牌并获得此牌。",
            "ye_tungyan":"吞咽",
            "ye_tungyan_info":"<b><font color=orange>觉醒技</font></b><br>准备阶段，若你的手牌数大于5或体力值小于3，你减1点体力上限，并获得技能〖赠礼〗和〖浮沉〗。",
            "ye_zengli":"赠礼",
            "ye_zengli_info":"出牌阶段限一次，你可以弃置至多X张牌(X为你的体力上限)并令一名角色摸等量张牌。",
            "ye_fuchen":"浮沉",
            "ye_fuchen_info":"<b><font color=orange>转换技</font></b>，<b><font color=orange>锁定技</font></b><li>阴：出牌阶段开始时，你加一点体力上限并回复一点体力，然后弃置一张牌。<li>阳：出牌阶段开始时，你流失一点体力并减一点体力上限，然后摸一张牌。",
            "ye_juanxi2":"卷袭",
            "ye_juanxi2_info":"",
            "ye_mowu":"魔武",
            "ye_mowu_info":"<b><font color=orange>转换技</font></b><li>阴：当你使用牌名不为【杀】的牌指定目标后，你摸X张牌。(X为此牌目标数且至多为3)<li>阳：当你使用【杀】指定目标后，你需弃置其一张牌。<li>你的回合开始时，若你的转换技处于阳状态，你反转你的转换技",
            "ye_nuyi":"怒意",
            "ye_nuyi_info":"<b><font color=orange>觉醒技</font></b><br>当你进入濒死状态时，你减1点体力上限，将体力值回复至1点并获得技能〖独裁〗。",
            "ye_ducai":"独裁",
            "ye_ducai_info":"<li>①出牌阶段限一次，你可以弃置一张牌，则本回合内除你外的角色不能使用或打出与该手牌花色不相同的牌。<li>②<b><font color=orange>锁定技</font></b><br>你的手牌上限+2。",
            "ye_ducai1":"独裁",
            "ye_ducai1_info":"",
            "ye_yanzaomonv":"赝造魔女",
            "ye_yanzaomonv_info":"你的回合开始时，你可以弃置一张牌并选择一名角色，获得其除觉醒技和限定技以外的技能并变更性别与其相同直至你的下个回合结束开始时并于你的下个回合结束开始时摸1张牌。",
            kongjianzhen:"空间震",
            "kongjianzhen_info":"<b><font color=orange>锁定技</font></b><br>当你体力值首次减少至一半或更少时，你摸一张牌并令所有其他角色随机弃置一张牌。（没有则不弃）",
            "ye_sifan":"神威灵装·四番",
            "ye_sifan_info":"<b><font color=orange>锁定技</font></b><br>你的首个回合开始时，你从牌堆中随机获得一张【南蛮入侵】或【万箭齐发】，然后你获得相当于当前场上势力数的冰冻值。",
            "ye_bingjiekuilei":"冰结傀儡",
            "ye_bingjiekuilei_info":"<b><font color=orange>锁定技</font></b><br>你使用的带有【伤害】这一标签的牌无视防具，你使用锦囊牌造成的伤害均视为冰属性，你防止你即将受到的冰属性伤害。",
            "ye_dongkai":"冻凯",
            "ye_dongkai_info":" ①<b><font color=orange>锁定技</font></b><br>当其他角色于你的出牌阶段被弃置了牌/你的回合开始时，你获得一点冰冻值。<br>②回合结束时，若你没有护甲，你可以失去两点冰冻值并获得一点护甲。<br>③回合结束时，你可以选择一名角色，弃置X点冰冻值并对其造成一点伤害。（X为其体力值且至多为5）",
            "ye_aoshagong":"鏖杀公",
            "ye_aoshagong_info":"①<b><font color=orange>锁定技</font></b><br>游戏开始时，你获得三枚【鏖】标记，当有角色死亡后，你获得一枚鏖标记，摸一张牌并可再次发动此技能。<br>②出牌阶段限一次，你可以移除一枚【鏖】标记并选择一名其他角色，你对其造成一点伤害并无视其防具且计算与其的距离时视为1直至当前回合结束。<br>③出牌阶段限一次，你可以弃置两张[杀]并获得一枚【鏖】标记。",
            "ye_aoshagong2":"鏖杀公",
            "ye_aoshagong2_info":"",
            "ye_qiannian":"千年",
            "ye_qiannian_info":" <b><font color=orange>锁定技</font></b><li>游戏开始时或牌堆洗牌时，你获得1枚【岁月】标记并增加一点体力上限，回复一点体力；<li>摸牌阶段，你多摸X张牌；<li>你的手牌上限+2X。 （X为【岁月】标记数）",
            "ye_yanzaomonv2":"赝造魔女",
            "ye_yanzaomonv2_info":"每当你使用1张牌，你可以弃置自己区域内1张牌，然后摸1张牌，当你发动此技能次数达到7次时，你摸1张牌。",
            "ye_jingxiang":"镜像",
            "ye_jingxiang_info":"每回合限一次，你的回合外，你成为一张牌的目标时，你可以获得此牌的复制；或弃置一张同名牌令之对你失效。",
            "ye_xijian":"隙间",
            "ye_xijian_info":"结束阶段开始时，你可以选择两名角色，并令其中一者选择获得不为你的另一者的一张牌。",
            "ye_shenying":"神隐",
            "ye_shenying_info":"当你造成或受到伤害后，你可以令受到伤害的角色于此回合神隐。 ",
            "ye_wuyu":"雾雨",
            "ye_wuyu_info":"<b><font color=orange>主公技</font></b><br>其他角色的出牌阶段限一次，其可以将一张♠牌交给你。 ",
            "ye_wuyu1":"雾雨",
            "ye_wuyu1_info":"",
            "ye_mofa":"魔法",
            "ye_mofa_info":"出牌阶段限一次，你可以弃置一张牌,令你于此回合内造成的伤害+1。 ",
			"ye_qinmian":"勤勉",
            "ye_qinmian_info":"每回合限三次，当你失去♠牌时，你可以摸一张牌。",
            "ye_qiuwen":"求闻",
            "ye_qiuwen_info":"出牌阶段限一次，你可以摸X张牌。(X为你的体力上限)",
            "ye_zaocu":"早卒",
            "ye_zaocu_info":"<b><font color=orange>锁定技</font></b><br>①你跳过弃牌阶段。<br>②结束阶段开始时，若你的手牌数大于你的体力上限，你失去1点体力。 ",
            "ye_dangjia":"当家",
            "ye_dangjia_info":"<b><font color=orange>主公技</font></b><br>其他外势力或未受伤的角色的出牌阶段限一次，若你已受伤，其可以与你拼点，当其没赢后，你可以回复1点体力。 ",
            "ye_dangjia1":"当家",
            "ye_dangjia1_info":"",
            "ye_zhenye":"真夜",
            "ye_zhenye_info":"结束阶段开始时，令一名其他角色与你将武将牌翻面，然后你摸一张牌。",
            "ye_anyu":"暗域",
            "ye_anyu_info":"当你受到非红色牌造成的伤害后，你可以选择一项：<li>摸一张牌。<li>翻面 。",
			"ye_weiyi":"伪仪",
            "ye_weiyi_info":"出牌阶段限一次，你可以选择一名有牌的其他角色和另一名角色，令前者选择一项：1.对后者使用【杀】（无距离限制）；2.将一张牌交给你，你获得后，你可以将之当【杀】对其使用（无距离限制且不计入次数限制）。 ",
            "ye_duozhi":"夺志",
            "ye_duozhi_info":"一名角色的准备阶段开始时，若其手牌数不小于你，你可以令一名手牌数小于你的角色摸一张牌，然后令后者于此回合内不能使用或打出【闪】。",
            "ye_fengxiang":"凤翔",
            "ye_fengxiang_info":"出牌阶段限一次，你可以视为对任意合法的其他角色依次使用【火攻】 ",
            "ye_kaifeng":"凯风",
            "ye_kaifeng_info":"<b><font color=orange>锁定技</font></b><li>当你对其他角色造成火焰伤害/你受到其他角色造成的火焰伤害时，若其体力值大于你，你回复至一点体力。<li>你造成火焰伤害后，你摸一张牌",
            "ye_leishi":"雷矢",
            "ye_leishi_info":"出牌阶段限一次，你可以选择一名其他角色，并视为对其使用一张不计入次数限制且无视防具的【雷杀】，若此【杀】被【闪】抵消，你失去一点体力并摸一张牌。",
            "ye_fenyuan":"愤怨",
            "ye_fenyuan_info":"当你于回合外死亡时，你可以令当前回合角色受到无来源的2点雷电伤害。",
            "ye_songjing":"诵经",
            "ye_songjing_info":"当一名角色使用延时类锦囊牌时，你可以摸两张牌。",
            "ye_gongzhen":"共振",
            "ye_gongzhen_info":"当一名角色受到【杀】造成的伤害后，你可以弃置一张牌，对其造成1点伤害。",
            "ye_shicao":"时操",
            "ye_shicao_info":"<b><font color=orange>锁定技</font></b><br>每轮限一次，准备阶段开始时，你获得1枚【时】标记。 ",
            "ye_shiting":"时停",
            "ye_shiting_info":"一名角色的回合结束时，你可以弃1枚【时】标记，获得一个额外的回合。",
            "ye_huanzai":"幻在",
            "ye_huanzai_info":"<b>限定技</b><br>结束阶段开始时，若你没有【时】标记，你可以获得1枚【时】标记。",
            "ye_shanghun":"伤魂",
            "ye_shanghun_info":"<b>限定技</b><br>当你受到伤害后，若你没有【时】标记，你可以获得1枚【时】标记。 ",
            "ye_taotie":"饕餮",
            "ye_taotie_info":"当其他角色使用【闪】时，你可以判定<li>若结果为黑色，你回复1点体力。 <li>若结果为红色，你摸一张牌。",
            "ye_duzhua":"毒爪",
            "ye_duzhua_info":"①出牌阶段限一次，你可以将一张红色手牌当【杀】使用并摸一张牌。 <br>②<b><font color=orange>锁定技</font></b><br>你的手牌上限为你的体力上限，你可以多出一张杀。",
            "ye_siyu":"私欲",
            "ye_siyu_info":"出牌阶段限一次，你可以将一至两张手牌交给一名其他角色。若如此做，此回合结束时，你观看其手牌并获得其中等量的牌。  ",
            "ye_qishu":"奇术",
            "ye_qishu_info":"<b><font color=orange>锁定技</font></b><br>①你使用的手牌无距离限制；<br>②出牌阶段内，你使用基本牌/普通锦囊牌后，若你没有手牌，你可为此牌指定任意名额外目标。 ",
            "ye_zhize":"职责",
            "ye_zhize_info":"<b><font color=orange>锁定技</font></b><br>摸牌阶段，你少摸一张牌并可以选择一名有手牌的其他角色，观看其手牌并获得其中一张牌。",
            "ye_chunxi":"春息",
            "ye_chunxi_info":"当你获得牌后，你可以展示其中一张♥牌并选择一名有手牌的其他角色，获得其一张手牌。  ",
			"ye_5yu5":"色欲",
			"ye_5yu8":"名欲",
			"ye_5yu3":"财欲",
			"ye_5yu4":"睡欲",
			"ye_5yu6":"食欲",
			"ye_5yu7":"色欲",
            "ye_5yu":"五欲",
            "ye_5yu_info":"五欲: 准备阶段开始时，你可以将【欲】标记补至X枚（X为你已损失的体力值+1）；你可以弃1枚【欲】标记或弃置一张牌，发动下列中的一项技能： <li>“名欲”（判定阶段开始时，你跳过判定阶段）。 <li>“财欲”（摸牌阶段开始时，你摸一张牌）。 <li>“色欲”（此回合内使用【杀】的次数上限+1）。 <li>“睡欲”（弃牌阶段开始时，你跳过弃牌阶段）。 <li>“食欲”（将一张牌当【酒】使用）。",
            "ye_jiezou":"借走",
            "ye_jiezou_info":"出牌阶段，你可以将一张牌当【顺手牵羊】使用（以此法使用♠牌无距离限制）。以此法使用非♠牌时，你结束当前阶段。 ",
            "ye_shoucang":"收藏",
            "ye_shoucang_info":"弃牌阶段开始时，你可以展示任意张花色不同的手牌，令你的手牌上限于此回合内等量增加。",
			"ye_shoucang2":"收藏",
            "ye_shoucang2_info":"",
            "ye_qiangyu":"强欲",
            "ye_qiangyu_info":"当你不因此技能从牌堆摸牌时，你可以摸两张牌，然后选择一项：<li>弃置两张手牌。<li>弃置一张♠手牌。",
            "ye_mokai":"魔开",
            "ye_mokai_info":"当你于出牌阶段内使用非转化的非延时性黑色锦囊牌时，若你的装备区内有牌，你可以弃置其中一张装备牌，然后摸两张牌。每阶段限X次（X为你的体力值）。",
            "ye_yuxue":"浴血",
            "ye_yuxue_info":"当你受到伤害后，你可以使用【杀】（无距离限制且伤害值基数+1）。 ",
            "ye_yuxue2":"浴血",
            "ye_yuxue2_info":"",
            "ye_shengyan":"盛宴",
            "ye_shengyan_info":"<b><font color=orange>锁定技</font></b><br>当你造成一点伤害后，你摸一张牌。",
            "ye_pohuai":"破坏",
            "ye_pohuai_info":"<b><font color=orange>锁定技</font></b><br>准备阶段开始时，你判定，若结果为【杀】，你选择距离小于等于1的所有其他角色，对这些角色各造成一点伤害，然后你对自己造成一点伤害。",
            "ye_yindu":"引渡",
            "ye_yindu_info":"①当其他角色死亡时，你可以摸两张牌，然后不执行奖惩。</br>②你对体力值为一的角色造成非传导伤害时，你可令此伤害加一并摸一张牌。",
            "ye_huanming":"换命",
            "ye_huanming_info":"<b>限定技</b><br>当你对一名体力值与你不相同的其他角色造成伤害时，你可以防止此伤害，与其交换体力值。",
            "ye_chuanwu":"川雾",
            "ye_chuanwu_info":"<b><font color=orange>锁定技</font></b><br>你与生命值小于等于2的其他角色的距离为1。",
            "ye_ningshi":"凝视",
            "ye_ningshi_info":"<b><font color=orange>锁定技</font></b><br>当你于出牌阶段内使用牌指定其他角色为唯一目标后，其失去1点体力。 ",
            "ye_gaoao":"高傲",
            "ye_gaoao_info":"<b><font color=orange>锁定技</font></b><br>当你于的回合外获得牌时，立即弃置之。 ",
            "ye_mingyun":"命运",
            "ye_mingyun_info":"<li>当判定开始前，你观看牌堆顶的两张牌，并将其中一张置顶，然后若你的手牌数小于等于你的体力上限，你获得另一张牌。<li>回合结束时，你观看牌堆顶的两张牌，并可以选择获得其中一张。",
            "ye_kexie":"渴血",
            "ye_kexie_info":" 当你进入濒死时，你可以让其他角色依次选择是否令你回复一点体力，然后其失去一点体力并摸两张牌。  ",
            "ye_xueyi":"血裔",
            "ye_xueyi_info":"<b><font color=orange>主公技</font></b><br>当其他红势力或其场上牌数大于等于你的角色回复体力后，其可以令你摸一张牌。 ",
            "ye_jinguo":"禁果",
            "ye_jinguo_info":"<b><font color=orange>锁定技</font></b><br>出牌阶段结束时，你判定，若结果为♠，你跳过弃牌阶段并移去1枚【禁忌】标记；否则若X大于1，你选择一项<li>弃置X张牌<li>失去X/2点体力（向下取整）。（X为【禁忌】标记数）",
            "ye_jinguo2":"禁果",
            "ye_jinguo2_info":"",
            "ye_huimie":"毁灭",
            "ye_huimie_info":"出牌阶段限一次，你可以获得1枚【禁忌】标记并令一名其他角色横置，然后对其造成1点火焰伤害。 ",
            "ye_kuangyan":"狂宴",
            "ye_kuangyan_info":"每回合限一次，当你于回合外进入濒死状态时，你可以获得1枚【禁忌】标记，将体力值回复至1，然后对当前回合的角色造成1点伤害。 ",
            "ye_chaoren":"超人",
            "ye_chaoren_info":"牌堆顶的牌对你可见，且你可以使用或打出此牌。 ",
            "ye_shiyu":"死欲",
            "ye_shiyu_info":"<b><font color=orange>锁定技</font></b><br>当你于回合外进入濒死状态时，你弃置你判定区里的所有牌并复原你的武将牌，然后终止一切结算，结束当前回合，获得一个额外的回合。此额外回合结束时，若你的体力值小于0，你结算濒死状态。",
            "yee_juhe":"居合",
            "yee_juhe_info":"摸牌阶段结束后，你可以多摸三张牌，然后你弃置X张手牌（X为你的体力值）。 ",
            "ye_youyu":"幼羽",
            "ye_youyu_info":"<b><font color=orange>锁定技</font></b><br>当你的弃牌阶段结束后: <li>1.你的手牌数或体力值不是全场最多; <li>2.你的手牌数小于你的体力值; <br>每达成一项，你摸一张牌。",
            "ye_yigou":"异构",
            "ye_yigou_info":"你使用的基本牌或普通锦囊牌结算后进入弃牌堆后，你可以将这些牌置于其中一名目标角色武将牌上，称为“构”，其当拥有两张相同名字的“构”时，移去这两张“构”，然后你视为对其使用一张同名牌。",
            "ye_yigou2":"异构",
            "ye_yigou2_info":"",
            "ye_tabitabi":"旅途",
            "ye_tabitabi_info":"<b><font color=orange>锁定技</font></b><li>①你的摸牌阶段摸牌时，摸牌数-1；<li>②一名角色的回合开始时，你随机获得弃牌堆的4张牌；<li>③一名角色的回合结束时，你弃置所有手牌。",
            "ye_shiying":"喰时之城",
            "ye_shiying_info":"<b><font color=orange>锁定技</font></b><br>游戏开始时，你废除所有装备栏。当你受到或造成1点伤害后，你恢复一个装备栏。",
            "ye_kedi":"刻刻帝",
            "ye_kedi_info":"一名角色回合开始时，若你有未被废除的装备栏，你可以废除你一个装备栏并摸2张牌，令其本回合跳过以下未选择过的一个阶段：判定、摸牌、出牌、弃牌阶段，若所有阶段均选择过，重置此技能。",
            "ye_shifang_debuff":"释放",
            "ye_shifang_debuff_info":"",
            "ye_shifang":"释放",
            "ye_shifang_info":"<b><font color=orange>锁定技</font></b><br>准备阶段，你展示并获得牌堆顶X张牌（X为你已损失体力值加2）,然后本回合你使用牌/造成伤害后，摸一弃二/摸二弃一。",
            "ye_bixin":"彼心",
            "ye_bixin_info":"<b><font color=orange>锁定技</font></b><br>摸牌阶段开始时，若你的体力值为一，你跳过摸牌阶段井恢复一点体力。",
            "ye_gufangzishang":"孤芳自赏",
            "ye_gufangzishang_info":"你的判定阶段开始时，若你判定区有牌，你可以获得你判定区内的所有牌。",
            "ye_shixie":"嗜血",
            "ye_shixie_info":"<b><font color=orange>锁定技</font></b><li>当你造成1点伤害后，你回复1点体力；<li>当你不以此法回复体力时，若你不处于濒死状态，防止此体力回复效果并摸两张牌；<li>出牌阶段，你每累计造成两点伤害，你可摸一张牌。 ",
            "ye_ziye":"子夜",
            "ye_ziye_info":"<b><font color=orange>觉醒技</font></b><br>当你对其他角色造成大于等于其体力的伤害或累计造成3点伤害后，你减1点体力上限，获得“暗月”。 ",
            "ye_anyue":"暗月",
            "ye_anyue_info":"当其他角色回复体力后，若其体力值不是全场最低，你可以翻面，视为对其使用无视距离和防具的【杀】。",
            "ye_dongjie":"冻结",
            "ye_dongjie_info":"<b><font color=orange>锁定技</font></b><br><li>你的回合开始时，你令一名随机角色获得1枚【冰】标记.<li>你对一名角色造成伤害时，你令其获得X枚【冰】标记（x为伤害点数）。<li>一名角色的出牌阶开始时，若其有【冰】标记，你可以令其弃置所有【冰】标记，并选择使其摸或弃置等量牌。",
            "ye_bingpo":"冰魄",
            "ye_bingpo_info":"<b><font color=orange>锁定技</font></b><br>每回合一次，当你受到除火焰伤害外的伤害时，若伤害值大于等于你的体力值，防止此伤害。 ",
            "ye_xunshi":"寻事",
            "ye_xunshi_info":"<b><font color=orange>锁定技</font></b><br>当其他角色使用【杀】或【桃】或普通锦囊牌指定目标时，若其体力值和手牌数均不小于你，你摸一张牌并成为额外目标。",
            "ye_jidong":"急冻",
            "ye_jidong_info":"当你成为【杀】/【决斗】的目标后，你可以弃置一张基本牌，令此牌的使用者选择一项：<li>弃置一张点数大于你弃置的牌的手牌；<li>此牌对你无效。",
            "ye_zhanshu":"战术",
            "ye_zhanshu_info":"每回合限一次，当你使用或打出（为非装备牌和延时锦囊牌的）实体牌结算结束后，你可以获得之，然后你本回合不能再使用或打出之。",
            "ye_lunhui":"轮回",
            "ye_lunhui_info":"任意角色的回合结束时，你可以失去1点体力上限然后你执行1个额外的回合。",
            nuoyan:"诺言",
            "nuoyan_info":"<b>限定技</b><br>准备阶段，若你的体力值上限≤2，你可以回复1点体力并指定一名其他女性角色，令其选择是否将武将牌替换为鹿目圆，然后其增加2点体力上限并摸3张牌，最后你摸2张牌并失去技能轮回。",
            "SE_huaxiang8":"冰杀",
            "SE_huaxiang8_info":"",
            "ye_duxing":"读心",
            "ye_duxing_info":"<b><font color=orange>锁定技</font></b><br>其他角色的手牌对你可见。",
            "ye_xiangqi":"想起",
            "ye_xiangqi_info":"当你或一名在你攻击范围内的角色受到牌造成的伤害后，若其存活且伤害来源为另一名其他角色，你可以展示后者一张手牌：若与造成伤害的牌类别相同且前者不是你，你弃置之，对前者造成1点伤害，否则令前者获得之。 ",
            "ye_qiugaoqishuang":"秋行夏令",
            "ye_qiugaoqishuang_info":"出牌阶段，你可以将一张基本牌/锦囊牌/装备牌置入弃牌堆，然后从牌堆中获得一张相同类型的牌（每回合每种类型限一次）。",
            "ye_qiankun":"乾坤",
            "ye_qiankun_info":"<b><font color=orange>锁定技</font></b><br>你的手牌上限和攻击范围+1。",
            "ye_shende":"神德",
            "ye_shende_info":"当你使用或打出【杀】时，你可以摸一张牌并弃置一张牌，然后获得1枚【神德】标记；若你的【神德】标记大于等于二，你可以将一张牌当【桃】使用，然后摸一张牌并失去2枚【神德】标记。",
            "ye_gongfeng1":"供奉",
            "ye_gongfeng1_info":"",
            "ye_gongfeng":"供奉",
            "ye_gongfeng_info":"<b><font color=orange>主公技</font></b><br>其他角色的出牌阶段限一次，其可以将一张【杀】交给你。 ",
            "ye_fanhun":"反魂",
            "ye_fanhun_info":"<b><font color=silver>永久技</font></b><br>当你进入濒死状态时，加1点体力上限，然后将体力值回复至体力上限，摸X张牌（X为你的体力上限）；回合开始时，若X大于4，你死亡。 ",
            "ye_yousi":"诱死",
            "ye_yousi_info":"<b><font color=orange>锁定技</font></b><br>其他角色的体力下限于你的回合内视为Y（Y为你回合开始时的体力值-1且至少为1）。",
            "ye_huanmeng":"幻梦",
            "ye_huanmeng_info":"<b><font color=silver>永久技</font></b><li>你没有体力和体力上限；<li>你跳过摸牌阶段和弃牌阶段；回合开始时，若你没有手牌，你死亡。 ",
            "ye_cuixiang":"萃想",
            "ye_cuixiang_info":"<b><font color=orange>锁定技</font></b><br>准备阶段开始时，所有其他角色各弃置一张手牌（若其无手牌，则其摸一张牌再弃置），然后你获得零至两张以此法置入弃牌堆的牌。 ",
            "ye_xuying":"虚影",
            "ye_xuying_info":"<b><font color=silver>永久技</font></b><li>当你使用或打出【闪】时，你摸一张牌；<li>当你受到【杀】造成的伤害时，若你有手牌，你弃置一半的手牌（至少一张，向下取整）。 ",
            "yangjingxurui_skill":"养精蓄锐",
            "yangjingxurui_skill_info":"",
            "ye_zhengshe":"镇社",
            "ye_zhengshe_info":"出牌阶段限一次，你可以将一张红桃牌当【养精蓄锐】使用。",
            "ye_xunfo":"寻佛",
            "ye_xunfo_info":"<b><font color=orange>锁定技</font></b><br>当主公摸牌（因此技能而摸牌的除外）或回复体力时，若你的手牌数小于5，你摸一张牌。 ",
            "ye_mizong":"觅踪",
            "ye_mizong_info":"<b><font color=orange>锁定技</font></b><br>出牌阶段开始时，你进行判定并获得判定牌；<br>若判定结果为红色，你于此回合内计算与其他角色间的距离视为一且使用牌无次数限制。 ",
            "ye_mizong2":"觅踪",
            "ye_mizong2_info":"",
            "ye_yinreng":"银刃",
            "ye_yinreng_info":"当你使用非红色【杀】指定一个目标后，你可以令其于此【杀】结算完毕之前不能使用或打出红色牌，且其除永久技外的技能无效。 ",
            "ye_yinreng2":"银刃",
            "ye_yinreng2_info":"",
            "ye_bangyue":"半月",
            "ye_bangyue_info":"出牌阶段限一次，你可以至多三名角色各摸一张牌，然后若此次选择了至少两名角色，你失去1点体力。 ",
            "ye_juxiang":"具现",
            "ye_juxiang_info":"当你进入濒死状态时，你可以翻面，然后若你人物牌正面朝下，则亮出牌堆顶的3张牌，选择并获得1种花色相同的所有牌并弃置其余牌，然后回复等于你弃置牌数的体力值。",
            "ye_zhushi":"嘱事",
            "ye_zhushi_info":"<b><font color=orange>主公技</font></b><br>你于弃牌阶段弃置的牌可以自由分配给其他角色。",
            "ye_moqi":"魔契",
            "ye_moqi_info":"每回合限一次，当一名角色于其出牌阶段内使用有目标的普通锦囊牌时，你可以令此牌额外结算一次。 ",
            "ye_shishu":"司书",
            "ye_shishu_info":"<b>限定技</b><br>出牌阶段，你可以重复以下流程X次（X为你已损失的体力值+1）：你检索一张锦囊牌，然后令一名角色获得之，若其不为你，你回复1点体力。",
            "ye_shenpan":"审判",
            "ye_shenpan_info":"摸牌阶段开始时，你可以少摸一牌并对一名其他角色造成1点雷电伤害，然后：<li>若其手牌数大于等于其体力值，你摸一张牌。<li>若其死亡，你摸一张牌并可以重复此流程。 ",
            "ye_huiwu":"悔悟",
            "ye_huiwu_info":"当其他角色使用牌指定你为目标后，其可以令此牌对你无效，然后令你摸一张牌。 ",
            "ye_huayan":"花冢",
            "ye_huayan_info":"<b><font color=orange>主公技</font></b><br>当其他战势力或体力值大于等于你的角色造成1点伤害后，其可以判定，当红色判定牌生效后，你获得之。 ",
            "ye_huayan2":"花冢",
            "ye_huayan2_info":"",
            "ye_jufengqishi":"飓风骑士",
            "ye_jufengqishi_info":"①<b><font color=orange>锁定技</font></b><br>你使用锦囊造成的伤害均视为风属性伤害。<br>②你的回合开始时，你可以选择至多X名角色(X为你已损失体力值+1)，若此时游戏轮数为奇数，你横置这些角色，否则你令这些角色摸一张牌。<br>③你的回合结束时，若场上有横置的角色，你可视为对一名横置的其他角色使用一张风杀。",
            "_dm_wind":"风杀",
            "_dm_wind_info":"",
            "ye_leiyu":"雷羽",
            "ye_leiyu_info":"①<b><font color=orange>锁定技</font></b><br>当你受雷电伤害时，你防止之并摸两张牌。<br>②你可以将♥或♠牌当雷【杀】使用或打出。",
            "ye_shizhai":"示灾",
            "ye_shizhai_info":"出牌阶段限一次，你可以判定并获得判定牌，然后当你于此回合内使用与判定结果颜色相同的牌时，你可以横置一名角色。 ",
            "ye_shizhai2":"示灾",
            "ye_shizhai2_info":"",
            "ye_chunyi":"春意",
            "ye_chunyi_info":"<b><font color=orange>锁定技</font></b><br>你的回合开始时，若你的体力上限小于6，你加一点体力上限。 ",
            "ye_baochun":"报春",
            "ye_baochun_info":"当你受到伤害后/你的准备阶段开始时，你可以令一名角色摸至X张牌（X为你已损失的体力值），若其手牌数大于X，则改为摸一张牌。 ",
            "ye_fengrang":"丰穰",
            "ye_fengrang_info":"出牌阶段限一次，你可以视为使用【五谷丰登】。",
            "ye_shouhuo":"收获",
            "ye_shouhuo_info":"<b><font color=orange>锁定技</font></b><br>当场上有角色使用【五谷丰登】时，你提前亮出牌堆顶的X张牌,并获得亮出的牌中的一张牌(X为场上角色数+1)。 ",
            "ye_chongdong":"虫洞",
            "ye_chongdong_info":"<b><font color=orange>主公技</font></b><br>当其他旧势力角色跳过一个阶段时，其可令你摸一张牌。",
            "ye_chongdong2":"虫洞",
            "ye_chongdong2_info":"",
            "ye_ciyuan":"次元",
            "ye_ciyuan_info":"<b><font color=orange>锁定技</font></b><br>回合开始时，你选择以任意顺序执行本回合的所有阶段。",
            "ye_shigui":"时轨",
            "ye_shigui_info":"每回合每项限一次,摸牌阶段/出牌阶段结束时，你可以将手牌调整至X张（X为此回合内你已执行的阶段数），若以此法：<li>获得牌，你失去1点体力；<li>弃置牌，你回复1点体力。",
            "ye_jiyi":"记忆",
            "ye_jiyi_info":"当你翻面后，你可以摸两张牌，然后可以将一至两张手牌交给其他角色。 ",
            "ye_chunmiang":"春眠",
            "ye_chunmiang_info":"<b><font color=orange>锁定技</font></b><br>结束阶段开始时，你翻面。 ",
            "ye_buju":"布局",
            "ye_buju_info":"出牌阶段限一次或当你受到伤害后，你可以摸X张牌（X为场上存活角色数且至多为5），然后将X-1张牌以任意顺序置于牌堆顶。 ",
            "ye_5yu2":"五欲",
            "ye_5yu2_info":"",
            queyu:"雀语",
            "queyu_info":"<b><font color=orange>锁定技</font></b><br>准备阶段，你从牌堆顶亮出四张牌。你比对所有亮出的牌，若其含有四种花色，本回合你的判定阶段改为摸牌阶段且弃牌阶段改为出牌阶段，否则，你选择一项：<li>1.弃置一张牌，从牌堆顶亮出两张牌并重复此流程；<li>2.获得数量最多的一种花色的所有牌，然后跳过摸牌阶段。",
            "queyu2":"猫语",
            "queyu2_info":"",
            "ye_ruizhi":"睿智",
            "ye_ruizhi_info":"当普通锦囊牌对你结算结束后，你可以令一名角色判定，若结果为红色，其回复1点体力，否则其摸一张牌 ",
            "ye_miyao":"秘药",
            "ye_miyao_info":"出牌阶段限一次，你可以令至多X名有手牌的角色弃置一张手牌并回复1点体力。(X为你的已损失体力值+1) ",
            "ye_yongheng":"永恒",
            "ye_yongheng_info":"<b><font color=orange>锁定技</font></b><br>你跳过弃牌阶段并将手牌调整至四张；当你于回合外获得或失去手牌后，你将手牌调整至四张。 ",
            "ye_zhuqu":"竹取",
            "ye_zhuqu_info":"<b><font color=orange>主公技</font></b><br>当其他永势力或手牌数与你相同的角色的方块判定牌生效后，其可以令你回复1点体力。 ",
            "ye_zhuqu2":"竹取",
            "ye_zhuqu2_info":"undefined",
            "ye_chuangshi":"创世",
            "ye_chuangshi_info":"准备阶段开始时，你可以摸一张牌并选择任意名其他角色，令这些角色各摸一张牌并可以使用一张牌。 ",
            "ye_yuanfa":"源法",
            "ye_yuanfa_info":"结束阶段开始时，你可以令任意名于此回合内使用过牌的角色摸一张牌。 ",
            "ye_shenwei":"神威",
            "ye_shenwei_info":"<b><font color=orange>主公技</font></b><br>当其他角色使用♦【闪】时，若其不在你的攻击范围内，你可以令此牌无效。 ",
            "ye_shuku":"书库",
            "ye_shuku_info":"一名其他角色回合结束时，若其本回合未对你造成过伤害，你可以发动此技能：若牌堆顶的牌与你的“书库”中的牌牌名均不同，你将其置于武将牌上，称其进入“书库”。你可以如手牌般使用或打出“书库”中的牌。",
            "ye_kongjian":"空间",
            "ye_kongjian_info":"<b><font color=orange>锁定技</font></b><br>游戏开始时或你回合开始时，你失去因此技能获得的技能，获得并恢复2个技能表述包含“装备区”，“手牌”，“座次”之一，且不包含“武将牌”或“身份牌”的技能(主公技，限定技，觉醒技，隐匿技，使命技等特殊技能除外)。",
            "ye_shikong":"失控",
            "ye_shikong_info":"<b><font color=orange>锁定技</font></b><br>当你使用【杀】时，此牌的目标改为你使用此【杀】的合法目标的所有角色。",
            "ye_ronhui":"熔毁",
            "ye_ronhui_info":"<b><font color=orange>锁定技</font></b><br>当你使用【杀】对目标角色造成伤害后，你弃置其装备区里的所有牌。 ",
            "ye_jubian":"聚变",
            "ye_jubian_info":"<b><font color=orange>锁定技</font></b><br>当你使用牌结算结束后，若此牌对至少两名角色造成过伤害(不计连环)，你回复1点体力。 ",
            "ye_hengxing":"恒星",
            "ye_hengxing_info":"<b><font color=orange>锁定技</font></b><br>结束阶段开始时，你摸三张牌并失去1点体力 ",
            "ye_dongquchunlai":"冬去春来",
            "ye_dongquchunlai_info":"<b><font color=orange>锁定技</font></b><br>每轮游戏开始时，你需选择失去/获得一点体力上限并恢复/失去一点体力",
            "ye_aosha":"鏖杀",
            "ye_aosha_info":"结束阶段，你可以摸一张牌并可以使用之，若你使用了此牌，你再摸一张牌",
        },
    },
    intro:"",
    author:"叶原之夜",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}})
