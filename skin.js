'use strict'
window.hyyzImport(function (lib, game, ui, get, ai, _status) {
    //势力添加
     var style2=document.createElement('style');
style2.innerHTML+="div[data-nature='yeem'],";
style2.innerHTML+="span[data-nature='yeem'] {text-shadow: black 0 0 1px,rgba(102,204,255,1) 0 0 2px,rgba(102,204,255,1) 0 0 5px,rgba(102,204,255,1) 0 0 5px,rgba(102,204,255,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='yeemm'],";
style2.innerHTML+="span[data-nature='yeemm'] {text-shadow: black 0 0 1px,rgba(102,204,255,1) 0 0 2px,rgba(102,204,255,1) 0 0 2px,rgba(102,204,255,1) 0 0 2px,rgba(102,204,255,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.yee='yee';
lib.group.push('yee');
lib.translate.yee='<span style="color:#66ccffff">叶</span>';
lib.translate.yeeColor="#66ccffff";


style2.innerHTML+="div[data-nature='dim'],";
style2.innerHTML+="span[data-nature='dim'] {text-shadow: black 0 0 1px,rgba(204,61,133,1) 0 0 2px,rgba(204,61,133,1) 0 0 5px,rgba(204,61,133,1) 0 0 5px,rgba(204,61,133,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='dimm'],";
style2.innerHTML+="span[data-nature='dimm'] {text-shadow: black 0 0 1px,rgba(204,61,133,1) 0 0 2px,rgba(204,61,133,1) 0 0 2px,rgba(204,61,133,1) 0 0 2px,rgba(204,61,133,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.di='di';
lib.group.push('di');
lib.translate.di='<span style="color:#cc3d85ff">地</span>';
lib.translate.diColor="#cc3d85ff";



style2.innerHTML+="div[data-nature='ye_jium'],";
style2.innerHTML+="span[data-nature='ye_jium'] {text-shadow: black 0 0 1px,rgba(166,153,204,1) 0 0 2px,rgba(166,153,204,1) 0 0 5px,rgba(166,153,204,1) 0 0 5px,rgba(166,153,204,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='ye_jiumm'],";
style2.innerHTML+="span[data-nature='ye_jiumm'] {text-shadow: black 0 0 1px,rgba(166,153,204,1) 0 0 2px,rgba(166,153,204,1) 0 0 2px,rgba(166,153,204,1) 0 0 2px,rgba(166,153,204,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.ye_jiu='ye_jiu';
lib.group.push('ye_jiu');
lib.translate.ye_jiu='<span style="color:#a699ccff">旧</span>';
lib.translate.ye_jiuColor="#a699ccff";



style2.innerHTML+="div[data-nature='zhangm'],";
style2.innerHTML+="span[data-nature='zhangm'] {text-shadow: black 0 0 1px,rgba(72,209,204,1) 0 0 2px,rgba(72,209,204,1) 0 0 5px,rgba(72,209,204,1) 0 0 5px,rgba(72,209,204,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='zhangmm'],";
style2.innerHTML+="span[data-nature='zhangmm'] {text-shadow: black 0 0 1px,rgba(72,209,204,1) 0 0 2px,rgba(72,209,204,1) 0 0 2px,rgba(72,209,204,1) 0 0 2px,rgba(72,209,204,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.zhang='zhang';
lib.group.push('zhang');
lib.translate.zhang='<span style="color:#48d1ccff">璋</span>';
lib.translate.zhangColor="#48d1ccff";



style2.innerHTML+="div[data-nature='yuem'],";
style2.innerHTML+="span[data-nature='yuem'] {text-shadow: black 0 0 1px,rgba(255,192,203,1) 0 0 2px,rgba(255,192,203,1) 0 0 5px,rgba(255,192,203,1) 0 0 5px,rgba(255,192,203,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='yuemm'],";
style2.innerHTML+="span[data-nature='yuemm'] {text-shadow: black 0 0 1px,rgba(255,192,203,1) 0 0 2px,rgba(255,192,203,1) 0 0 2px,rgba(255,192,203,1) 0 0 2px,rgba(255,192,203,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.yue='yue';
lib.group.push('yue');
lib.translate.yue='<span style="color:#ffc0cbff">约</span>';
lib.translate.yueColor="#ffc0cbff";



style2.innerHTML+="div[data-nature='ye_zhum'],";
style2.innerHTML+="span[data-nature='ye_zhum'] {text-shadow: black 0 0 1px,rgba(133,61,204,1) 0 0 2px,rgba(133,61,204,1) 0 0 5px,rgba(133,61,204,1) 0 0 5px,rgba(133,61,204,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='ye_zhumm'],";
style2.innerHTML+="span[data-nature='ye_zhumm'] {text-shadow: black 0 0 1px,rgba(133,61,204,1) 0 0 2px,rgba(133,61,204,1) 0 0 2px,rgba(133,61,204,1) 0 0 2px,rgba(133,61,204,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.ye_zhu='ye_zhu';
lib.group.push('ye_zhu');
lib.translate.ye_zhu='<span style="color:#853dccff">主</span>';
lib.translate.ye_zhuColor="#853dccff";



style2.innerHTML+="div[data-nature='waim'],";
style2.innerHTML+="span[data-nature='waim'] {text-shadow: black 0 0 1px,rgba(204,112,20,1) 0 0 2px,rgba(204,112,20,1) 0 0 5px,rgba(204,112,20,1) 0 0 5px,rgba(204,112,20,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='waimm'],";
style2.innerHTML+="span[data-nature='waimm'] {text-shadow: black 0 0 1px,rgba(204,112,20,1) 0 0 2px,rgba(204,112,20,1) 0 0 2px,rgba(204,112,20,1) 0 0 2px,rgba(204,112,20,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.wai='wai';
lib.group.push('wai');
lib.translate.wai='<span style="color:#cc7014ff">外</span>';
lib.translate.waiColor="#cc7014ff";


 
style2.innerHTML+="div[data-nature='fengm'],";
style2.innerHTML+="span[data-nature='fengm'] {text-shadow: black 0 0 1px,rgba(204,140,61,1) 0 0 2px,rgba(204,140,61,1) 0 0 5px,rgba(204,140,61,1) 0 0 5px,rgba(204,140,61,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='fengmm'],";
style2.innerHTML+="span[data-nature='fengmm'] {text-shadow: black 0 0 1px,rgba(204,140,61,1) 0 0 2px,rgba(204,140,61,1) 0 0 2px,rgba(204,140,61,1) 0 0 2px,rgba(204,140,61,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.feng='feng';
lib.group.push('feng');
lib.translate.feng='<span style="color:#cc8c3dff">风</span>';
lib.translate.fengColor="#cc8c3dff";


 
style2.innerHTML+="div[data-nature='guim'],";
style2.innerHTML+="span[data-nature='guim'] {text-shadow: black 0 0 1px,rgba(255,128,128,1) 0 0 2px,rgba(255,128,128,1) 0 0 5px,rgba(255,128,128,1) 0 0 5px,rgba(255,128,128,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='guimm'],";
style2.innerHTML+="span[data-nature='guimm'] {text-shadow: black 0 0 1px,rgba(255,128,128,1) 0 0 2px,rgba(255,128,128,1) 0 0 2px,rgba(255,128,128,1) 0 0 2px,rgba(255,128,128,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.gui='gui';
lib.group.push('gui');
lib.translate.gui='<span style="color:#ff8080ff">鬼</span>';
lib.translate.guiColor="#ff8080ff";


 
style2.innerHTML+="div[data-nature='yongm'],";
style2.innerHTML+="span[data-nature='yongm'] {text-shadow: black 0 0 1px,rgba(153,153,153,1) 0 0 2px,rgba(153,153,153,1) 0 0 5px,rgba(153,153,153,1) 0 0 5px,rgba(153,153,153,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='yongmm'],";
style2.innerHTML+="span[data-nature='yongmm'] {text-shadow: black 0 0 1px,rgba(153,153,153,1) 0 0 2px,rgba(153,153,153,1) 0 0 2px,rgba(153,153,153,1) 0 0 2px,rgba(153,153,153,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.yong='yong';
lib.group.push('yong');
lib.translate.yong='<span style="color:#999999ff">永</span>';
lib.translate.yongColor="#999999ff";



style2.innerHTML+="div[data-nature='zhanm'],";
style2.innerHTML+="span[data-nature='zhanm'] {text-shadow: black 0 0 1px,rgba(61,204,61,1) 0 0 2px,rgba(61,204,61,1) 0 0 5px,rgba(61,204,61,1) 0 0 5px,rgba(61,204,61,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='zhanmm'],";
style2.innerHTML+="span[data-nature='zhanmm'] {text-shadow: black 0 0 1px,rgba(61,204,61,1) 0 0 2px,rgba(61,204,61,1) 0 0 2px,rgba(61,204,61,1) 0 0 2px,rgba(61,204,61,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.zhan='zhan';
lib.group.push('zhan');
lib.translate.zhan='<span style="color:#3dcc3dff">战</span>';
lib.translate.zhanColor="#3dcc3dff";


 
style2.innerHTML+="div[data-nature='lingm'],";
style2.innerHTML+="span[data-nature='lingm'] {text-shadow: black 0 0 1px,rgba(102,204,153,1) 0 0 2px,rgba(102,204,153,1) 0 0 5px,rgba(102,204,153,1) 0 0 5px,rgba(102,204,153,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='lingmm'],";
style2.innerHTML+="span[data-nature='lingmm'] {text-shadow: black 0 0 1px,rgba(102,204,153,1) 0 0 2px,rgba(102,204,153,1) 0 0 2px,rgba(102,204,153,1) 0 0 2px,rgba(102,204,153,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.ling='ling';
lib.group.push('ling');
lib.translate.ling='<span style="color:#66cc99ff">灵</span>';
lib.translate.lingColor="#66cc99ff";


 
style2.innerHTML+="div[data-nature='yaom'],";
style2.innerHTML+="span[data-nature='yaom'] {text-shadow: black 0 0 1px,rgba(61,61,204,1,1) 0 0 2px,rgba(61,61,204,1,1) 0 0 5px,rgba(61,61,204,1,1) 0 0 5px,rgba(61,61,204,1,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='yaomm'],";
style2.innerHTML+="span[data-nature='yaomm'] {text-shadow: black 0 0 1px,rgba(61,61,204,1,1) 0 0 2px,rgba(61,61,204,1,1) 0 0 2px,rgba(61,61,204,1,1) 0 0 2px,rgba(61,61,204,1,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.yao='yao';
lib.group.push('yao');
lib.translate.yao='<span style="color:#3d3dccff">妖</span>';
lib.translate.yaoColor="#3d3dccff";


  
style2.innerHTML+="div[data-nature='hongm'],";
style2.innerHTML+="span[data-nature='hongm'] {text-shadow: black 0 0 1px,rgba(204,20,20,1) 0 0 2px,rgba(204,20,20,1) 0 0 5px,rgba(204,20,20,1) 0 0 5px,rgba(204,20,20,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='hongmm'],";
style2.innerHTML+="span[data-nature='hongmm'] {text-shadow: black 0 0 1px,rgba(204,20,20,1) 0 0 2px,rgba(204,20,20,1) 0 0 2px,rgba(204,20,20,1) 0 0 2px,rgba(204,20,20,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.hong='hong';
lib.group.push('hong');
lib.translate.hong='<span style="color:#cc1414ff">红</span>';
lib.translate.hongColor="#cc1414ff";



style2.innerHTML+="div[data-nature='huim'],";
style2.innerHTML+="span[data-nature='huim'] {text-shadow: black 0 0 1px,rgba(170,204,102,1) 0 0 2px,rgba(170,204,102,1) 0 0 5px,rgba(170,204,102,1) 0 0 5px,rgba(170,204,102,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='huimm'],";
style2.innerHTML+="span[data-nature='huimm'] {text-shadow: black 0 0 1px,rgba(170,204,102,1) 0 0 2px,rgba(170,204,102,1) 0 0 2px,rgba(170,204,102,1) 0 0 2px,rgba(170,204,102,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.hui='hui';
lib.group.push('hui');
lib.translate.hui='<span style="color:#AACC66">辉</span>';
lib.translate.huiColor="#AACC66";


  
style2.innerHTML+="div[data-nature='xingm'],";
style2.innerHTML+="span[data-nature='xingm'] {text-shadow: black 0 0 1px,rgba(61,204,204,1) 0 0 2px,rgba(61,204,204,1) 0 0 5px,rgba(61,204,204,1) 0 0 5px,rgba(61,204,204,1) 0 0 5px,black 0 0 1px;}";
style2.innerHTML+="div[data-nature='xingmm'],";
style2.innerHTML+="span[data-nature='xingmm'] {text-shadow: black 0 0 1px,rgba(61,204,204,1) 0 0 2px,rgba(61,204,204,1) 0 0 2px,rgba(61,204,204,1) 0 0 2px,rgba(61,204,204,1) 0 0 2px,black 0 0 1px;}";
document.head.appendChild(style2);
lib.groupnature.xing='xing';
lib.group.push('xing');
lib.translate.xing='<span style="color:#3DCCCC">星</span>';
lib.translate.xingColor="#3DCCCC";
    })