// https://clippingmagic.com/examples
// найденная последняя версия за яннварь 2016 г. Продолжаю 2017г.
//текущая версия: 2017/01/28 17:40:23
    // соглашений по 3D (Z-координате): z=tg(a)*dw; tg(45)==1 => z=dw (разница w0-w родителя)
// breathable => swayable (?)

(function () {
	try{
		var gnum=parseFloat
		,scriptname="lib.js"
		,global={d:document,w:window,c:console,gnum:gnum,gint:parseInt,sign:Math.sign,max:Math.max,min:Math.min,abs:Math.abs,sqrt:Math.sqrt,PI:Math.PI}
		,KEYS={
			SHIFT:16,CTRL:17,ALT:18,ESC:27,WIN:91,TAB:9,CRKEY:10,ENTER:13,SPACE:32,DEL:46,INS:45,CAPS:20,SCRL:145
			,UP:38,DOWN:40,LEFT:37,RIGHT:39,HOME:36,END:35,PGUP:33,PGDN:34,PAUSE:19
			,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123
		}
		,init=eval("{for (let i in KEYS) eval(\"var \"+i+\"=\"+KEYS[i])}")
		,methods=["OPTIONS","GET","HEAD","POST","PUT","PATCH","DELETE","TRACE","CONNECT"]
// 		,jsErrors=["SyntaxError","EvalError","InternalError","RangeError","ReferenceError","TypeError","URIError"]
		,hex='0123456789abcdef',b64sym="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
		,sym=ss(' ',9)+'	'+ss(' ',23)+"!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
		,undef="undefined",del="del",fnul=function(){}
		,ssym="~`!@#$%^&*()_+-=[]{};:'\"\\|/,.<>/?"
		,psym={"{":"}","[":"]","<":">","(":")"}
		,kwheel=10//коеф.прокрутки для scrollbars
		,plnk="__parent__"//спец.имя для временых обратных ссылок (не допускается использование его в иерархии данных (где-то аналог __proto__))
		,nulltxt="**null**"
		,speckeys=["SHIFT","ALT","CTRL","WIN"]//вспомогательные клавиши
		,specsym={smile:"&#9786;",up:"&#9650;",down:"&#9660;",sp:"&nbsp;",close:"⨂",min:"_",max:"□",resize:"◢"}
		,msep="!"
		,specvars=[msep,"date","time"] //спецподстановки
		,rainbow=["#ff00fe #ff0000","#0100ff #ff00ff","#00feff #0000ff","#00ff01 #00ffff","#feff00 #00ff00","#ff0000 #ffff00"]
		,colorsRGB=["#000000 #ff0000","#000000 #00ff00","#000000 #0000ff"]
		,cssall=["he","wi","to","le","bo","ri" //0-5
					,"bgc","co","br" //6-8
					,"fs","lh","ta" //9-11
					,"min-height","max-height","min-width","max-width" //12-15
					,"ro","sh","cu","op","ts"] // 16-19
		,csscut={
			he:"height",wi:"width",to:"top",le:"left",bo:"bottom",ri:"right"
			,sh:"shadow",ro:"round"
		}
		,errors=[
			"loading error"
			,"The url\'s list is empty or wrong"
			,"The callback function is wrong"
			,"while loading object"
			,"Server not responsed. Check URI"
		]
		,names=[] //массив используемых имен
		,step_scaling=.09
		,sbmin=17 //мин. длина скрулбара
		,discrete=333,timeout=3333 //некая общая дискрета и задержка
		,zindexTop=90,zindexMax=zindexTop+9,zindexMin=1
		,maxdeep=100 //ограничитель рекурсии
		,delaylclick=555 //время задержки длинного клика
		,shortdelay=199 //время общей задержки
		,comdelay=555 //время общей задержки
		,longdelay=1234 //время длинной общей анимации
	 	,mdelaym=33 //микрозадержка перед началом движения (для movable & pressable одновременно)
		,mdelayc=99 //задержка (для распознавания двойного клика)
		,fps=1000/30 // "частота кадров анимации"
		,showtime=3333 // время показа тултипа
		,[kmin,kmax]=[1/9,9] //ограничения для масштабирования
		,tasks={} //массив имен задач для iterate() (пара (ключ/значение) <имя задачи>:{данные задачи}))
		,curobj //текущий объект
		,msie
		,cursrsz=msie?"nwse-resize":"se-resize"
// умолчания
		,minsz=[99,133] //минимальные размеры (например, объекта со свойством "resizable")
		,minszico=[39,77]//мин. размеры при сворачивании (объекта, окна)
		,defcss={ov:"hidden",po:"absolute",zi:zindexMin,bgr:"no-repeat",bgs:"cover",fs:12,pa:0,ma:0,fl:"left"}
		,defshad="inset 0 0 99px white, 0 0 1px black"
		,defprops={movable:true,resizable:true,closable:true,maximizable:true,minimizable:true}
// ,randcss1={top:"random",left:"random",height:"random",width:"random",br:"random","background-color":"random",color:"random"}
		,randcss={all:["random","random","random","random",,,"random","random","random"]}
		,defdat={css:clone(defcss),props:{},attrs:{},resizing:[],resizing_all:[],resizing_end:[],resizing_all_end:[]}
		,wAddAttrs=["textShadow","boxShadow","borderRadius"
		,"border","borderLeft","borderTop","borderRight","borderBottom"
		,"backgroundSize","backgroundPosition","lineHeight","fontSize","right","bottom","minHeight","maxHeight","minWidth","maxWidth"] //списка аттрибутов, размеры которых меняются при масштабировании
		,resize_dat={css:{all:[9,9,,,1,1,,,,14,10],cu:cursrsz},attrs:{title:"Resize"}}
		,close_dat={css:{all:[10,10,5,,,5,,,,12,10],cu:"pointer","font-family":"arial"},props:{focusable:true}
			,focus:{over:{"[[name]]":{css:{br:"dotted 1px gray"}}},out:{"[[name]]":{css:{br:"none"}}}}
			,attrs:{title:"Close"}}
			,max_upd={css:{all:[,,,,,19,,,,17,8]},attrs:{title:"Max"}}
		,min_upd={css:{all:[,,,,,33,,,,17,2],bgs:[3,11],bgp: "bottom"},attrs:{title:"Min"}}
		,win_dat={
			hh:19,hf:19,hg:0 //высота header & footer
			,cshad:"inset 0 0 39px 3px #ccf",shad:"0 0 13px 1px gray"
			,htxt:"[[name]]",ftxt:"",ffm:"arial",fs:"eval{min([[hh]]-3,15)}"
			,h:"eval{min(333,app.hw)}",w:"eval{min(533,app.ww)}",t:"eval{(app.hw-[[h]])/2}",l:"eval{(app.ww-[[w]])/2}"
			,bgft:"#bbd #fff",bghd:"#fff #bbd",bgcont:"#def"
			,css:{all:["[[h]]","[[w]]","[[t]]","[[l]]"],br:"gray",ro:5,op:88,sh:"[[shad]]",ff:"[[ffm]]"}
			,resizing_all:["[[nmh]]","[[nmc]]","[[nmf]]"]
//			,resizing:["[[nmh]]","[[nmc]]","[[nmf]]"]
			,onav:{ css:{all:["[[h]]","[[w]]","[[t]]","[[l]]"],br:"gray",ro:5,bgc:"[[bgcont]]"}}
			,props:{movable:true,scalable:true,closable:true,maximizable:true,minimizable:true,resizable:true}
// 			,props:"[[defprops]]"
			,scale:{catchid:"[[nmh]]"}
			,move:{catchid:"[[nmh]]"}
			,nmh:"[[name]]_header",nmc:"[[name]]_cont",nmf:"[[name]]_footer"
			,ch:{
				"[[nmc]]":{props:{stretchable:["eval{[[pname]]_header.h-1}","eval{[[pname]]_footer.h-1}","[[hg]]","[[hg]]"]},css:{bgc:"[[bgcont]]",sh:"[[cshad]]"}}
				,"[[nmh]]":{props:{hstretchable:true},css:{all:["[[hh]]",,,,,," [[bghd]]","#234",,"[[fs]]","[[hh]]","center",,,,,,,"pointer"]},value:"[[htxt]]"}
				,"[[nmf]]":{props:{hstretchable:true},css:{all:["[[hf]]",,,,0,,"[[bgft]]","#234",,"[[fs]]","[[hf]]","center"]},value:"[[ftxt]]"}
			}
		}
		,title_dat={
			css:{he:minsz[0],wi:minsz[1],zi:zindexMax+2,br:"green",bgc:"#aec",ro:"5px",op:69,vi:"hidden"}
			,move:{catchid:"[[name]]_cont"},resizing:["[[name]]_cont"]
			,props:{movable:true,closable:[8,9,1,,,1,,,,11,8],resizable:true}
			,ch:{"[[name]]_cont":{props:{stretchable:[7,9,7,9],focusable:true},css:{br:"dotted 1px gray",bgc:"#aca",co:"#031"}}}
		}
		,ottl,otcnt,oscr
		,appdef={ // def app data
//			name - имя приложения
// 		,rclick - глобальная пользов. обработка правого клика
//			,state - состояние приложения ("ok" - обычное)
//			,id - уникальный ID приложения
			state:"init",states:{}
			,sse:{
				uri:""	// URI для соединения (SSE)
				,flags:{start:0,restart:0} // start=1 - запрос для единоразового запуска sse. restart=1 - бесконечный перезапуск
				,retry:3	// пауза перед пересоединением
				,ka:180000	// keep alive time - "запрос" от браузера к серверу удерживать соединение открытым (SSE)
				,ntime:9	// число попыток пересоединиться, если не было активности (-1 если пересоединение бесконечно)
				,save:{} //для всяких сохранений
				,fmon: function(){if (app.sse.flags.start) app.sse.finit()} // доп. функция мониторинга
				,finit: function(){
					var o=app.sse;o.flags.start=0 //иниц. sse
					if (isES(o.osse)) o.osse.close()
// c.log("finit: sse (re)init")
					o.osse=new EventSource(o.uri+"?id="+app.id+"&name="+app.name+"&retry="+o.retry+"&ka="+o.ka, {withCredentials: true})
					o.osse.onopen=o.fopen
					o.osse.onerror=o.ferr
					o.osse.onmessage=o.fmsg
				}
				,fmsg: function (e){ //раздача сообщений сервера по SSE
// c.log(e)
// e.data содержит объект с такими полями (после convdata в r):
// 	trg_oid - какому объекту предназначено сообщение (id / Array of ids / system / all)
// 	type - тип сообщения (reply, init, msg ... Соответствующий обработчик должен быть установлен (on<type>))
					try {
						var r=convdata(e.data),i,o,nm,t=r.toobj,o=gO(t) //r.dest - object-destination
						if (isO(o)) iff(o["on"+r.type],e,r) //одному
						else if (isA(t)) for (i=0;i<t.length;i++) {if (isH(o=gO(t[i]))) iff(o["on"+r.type],e,r)}
						else if (t=="all" || t=="*") for (i in names) {if (!chkspecobj(nm=names[i]) && isH(o=gO(nm))) iff(o["on"+r.type],e,r)} //всем, у кого (connectable:true)
						else {iff(app["on"+r.type],e,r)} //системе
					} catch(er){c.log("Bad sse message:",er,e)}
// 	c.log("*** type="+e.type,"readyState="+e.currentTarget.readyState,"data:",e.data,"e:",e,"r:",r)
				}
				,ferr:function(e){var o=app.sse
					if (!o.flags.restart && o.osse.readyState!=2) //если !o.flags.restart, то через o.ntry попыток выполнить o.finit() закрываем.
						if (--o.ntry<1) {
							o.ntry=o.ntime
							o.osse.close()
							c.log("connection closed",o.osse.readyState)
						}
				}
// 				,fopen: function(e){c.log("sse open",e)}
			}
			,names:names //словарь используемых имен
			,tasks:tasks //очередь фоновых процессов. Используется iterate
			,undef:undef
			,del:del
			,msep:msep
			,rainbow:rainbow
			,decoranim:function(){ //анимация декорации
				var o=li(app.decors) //анимируем последни элемент
				if (isH(o)) {
					if (!isN(o.op)) o.op=0;if (!isN(o.st)) o.st=1
					if (o.op>19) o.st=-1
					else if (o.op<1) o.st=1
					sopO(o,o.op+=o.st)
				}
			}
			,fmonitor:function(){try{
				let _tn=d.title.split("-") //если имя изменилось, изменим app.id и переоткроем sse (сообщим серверу о новом приложении)
				if (_tn[0]!=app.name) {
c.log("2mon",_tn[0],app.name)
					app.id=md5(app.name+getTime("ms")).substr(0,9)
					d.title=app.name+"-"+app.id
					if (isES(app.sse.osse)) iff(app.sse.finit)
				}
				if (app.flags.torch) {
					if (!isH(app.torch)) app.torch=init_obj(app.torch_dat)
					if (!isV(app.torch)) show(app.torch)
				} else if (isH(app.torch)) hide(app.torch)

				if (app.flags.decor) {//задана декорация body
					if (!isA(app.decors)) app.decors=init_decor(app.decor_dat) //не были созданы объекты украшательств - создаем
					for (let i in app.decors) if (!isV(app.decors[i])) show(app.decors[i]) //если невидимые - покажем
					if (app.flags.decoranim) iff(app.decoranim) //выполнили итерацию анимации
				} else if (isA(app.decors)) for (let i in app.decors) hide(app.decors[i]) //спрятали, если уже есть
				d.title=app.title=app.name+"-"+app.id
				iff(app.sse.fmon)
				}catch(e){c.log("fmonitor:",e);return false}
			}
			,monitor_tick:3333
			,waitbody:33 //время ожидания body (sec)
			,sets:{},msgs:{},imgs:{} //множества, сообщения, картинки
			,worlds:{} //data:{},imgs:{}}
			,flags:{decor:1,decoranim:1}
			,wait_for_start:15 // сек ждать появления стартовой функции
			,specsep:"}|{" //спец.разделитель
			,preftags:["div","span"] //предпочтительные теги (для которых действуют умолчания)
			,formtags:["input","textarea"] //распознаваемые теги форм (для установки dat.value)
			,ninit:9	// число попыток начальной инициализации приложения (ожидания появления <body>)
			,montick0:33	// самый первый тик
			,montick:999	// интервал работы монитора
			,queue:[]   //очередь отложенных вызовов (каждый элемент - имя функции)
			,pref:"" //префикс имен
			,bodycss:{bgc:"#dde"} //,overflow:"auto"} //hidden
			,tmplpref:"tmpl_"
			,errors:errors //список сообщений об ошибках
			,torch_dat:{name:"torch*",css:{all:[1,1],ro:1,op:33,sh:"0 0 19px 13px white",zi:zindexMax+1,vi:"hidden"}} //подсветка курсора
			,decor_dat:[
				{name:"proj*",css:{all:[1,1,0,0],op:13,sh:"0 0 399px 699px #ff0",zi:0}}
				,{name:"proj*",css:{all:[1,1,,"eval{gnum(app.ww/2)}"],op:13,ro:1,sh:"0 0 399px 699px #0ff",zi:0}}
				,{name:"proj*",css:{all:[1,1,0,,,1],op:13,sh:"0 0 399px 699px #f0f",zi:0}}
				,{name:"proj*",css:{all:[1,1],op:0,sh:"0 0 399px 699px #00f",zi:0},props:{aligned:true}}
			]
			,screen_dat:{props:{stretchable:true,focusable:true},css:{bgc:"blue",op:19,zi:zindexMax-1,vi:"hidden"}}
			,funcs:{},mouse:{t:0,l:0,dt:0,dl:0},save:{}
			,disfuncs:["init_func", "init_app", "init_spec"]
			,close_img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAJCAYAAAALpr0TAAAAMElEQVQY02NgYGD4//////8MuAGKPC7FWMXRBfHaBJMk5BzCJpFkIlFuJMrXRIUjAIsyVKy/2cT3AAAAAElFTkSuQmCC"
			,resize_img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAGklEQVQY02NgIAj+/6erAqyKaacAzqZcAQMAcsoj3VWR0nAAAAAASUVORK5CYII="
			,max_img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAMUlEQVQY02NkgID/DDgA4////3FLMjIysMAYDAwMjMiSMI1MDAQA5QpYkK3FqQCfRwDPqw0QGvxANgAAAABJRU5ErkJggg=="
			,min_img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQI12NgYGD4z/T//38GAA8FA/9I5V/EAAAAAElFTkSuQmCC"
			,minus_img:"data:image/gif;base64,R0lGODlhCQAJAKECAAAAAICAgP///////yH5BAEKAAEALAAAAAAJAAkAAAIKjI+py+D/mJyyAAA7"
			,plus_img:"data:image/gif;base64,R0lGODlhCQAJAKECAAAAAICAgP///////yH5BAEKAAEALAAAAAAJAAkAAAIPjAOnuJfNHJh0qtfw0lcVADs="
			,icodown:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAAIElEQVQI12NkYGD4z4ADMEJpbAoYGZE4/7FoQgEoJgAA+twEAum0k4YAAAAASUVORK5CYII="
			,icoup:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAAIUlEQVQI12NgQAX/kTmMOCQYkSX/M2ACRkYcEgwMDAwMAPqFBAJIbLbqAAAAAElFTkSuQmCC"
			,chatico12x10:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wMeDSAj5+GYpQAAAD1JREFUGNNjZECA/wz4ASMDCYrhahihDEYCGuHyLPisxQZYsFlLyP0k+wFZgBGPIYw4TSHSRpKch1UTVo0AIA4QA5BYJxkAAAAASUVORK5CYII="
			,ru_ico:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAgAgMAAAAQ3aLUAAAACVBMVEX/////AAAAAP+3l+0cAAAAGElEQVQY02NgGFxgFQIsGBhOKAIEDDwHAKWCeup3O07DAAAAAElFTkSuQmCC"
			,ua_ico:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAgAQMAAABXfdgEAAAABlBMVEX/zAAAAMz/lJlCAAAAEklEQVQI12P4DwJ/GOhG0RkAAKZ6X3FzAuuxAAAAAElFTkSuQmCC"
			,usa_ico:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAgBAMAAACfnVd0AAAAD1BMVEX/AAD///8AAJkzM5mZmcyA3C3/AAAAS0lEQVQoz2NQQgIKDAigJISAKOJGCIgijqRBURAOgOIIDSjiFJiPKk7YfBRxCszHFT6o5jvBIWo44DAfVzjgiBdB7ACnOLXAMLUXAIcqLA3WXo2iAAAAAElFTkSuQmCC"
			,clrlst:["#000","#f00","#0f0","#00f","#ff0","#f0f","#0ff","#777"] //перебор цветов для монитора
// 			,mondat:{css:{all:[4,4,0,,,0],ro:2,position:"fixed","z-index":999999,opaque:33},props:{scalable:true,movable:true}}
// **************************
			,world_tools:{
				initarea: function() { //имя фоновой картинки должно совпадать с именем мира
					var o,oc,p=args(arguments),[k,u]=[p.N[0],p.O[0]]
					,ow=app.worlds,wn=app.curworld
					,im=ow.imgs[wn]
					,d={kmin:1/11,kmax:11,props:{stretchable:true, scrollable:{
						kp:"[[ [[h]]/[[w]] ]]"
						,props:{movable:true,scalable:true},css:{bgi:"[[bgi]]",all:["[[h]]","[[w]]"]}
					}}}
					if (!isN(k)) k=1
					upd_obj(d,u)
					if (isI(im)) {
						if (!isS(d.bgi)) d.bgi=im.src //; else d.props.scrollable.css.bgi=del
						if (!isN(d.h) || !isN(d.w)) [d.h,d.w]=[im.height,im.width]
					} else d.bgi="none"
					if (!isN(d.h)||!isN(d.w)) [d.h,d.w]=[app.hw*k,app.ww*k]; else {d.h*=k;d.w*=k}
					if (d.h<app.hw) d.h=app.hw;if (d.w<app.ww) d.w=app.ww
					o=init_obj(app.curworld,d)
					oc=gO(o.id+"_container")
						poO(oc,oc.t=(o.h-oc.h)/2,oc.l=(o.w-oc.w)/2) //на середину
						return [o,oc]
				}
				,initnav: function(u,k) {
					var p=args(arguments),[k,u]=[isN(p.N[0])?p.N[0]:10,p.O[0]]
					,ow=app.worlds,wn=app.curworld,oc=gO(wn+"_container"),o=gO(wn)
					,im=ow.imgs[wn]
					,d={
						pname:wn
						,op:100,ofs:33,kmin:1/3,kmax:3
						,h:oc.h/k,w:oc.w/k
						,t:10,l:"[[ [[app.curworld]].w*9/10 + 10 ]]"
						,props:{movable:true,scalable:true}
						,move:{down:{"[[name]]":{css:{op:33,sh:"0 0 199px 33px #0ff"}}},up:	{"[[name]]":{css:{op:"[[op]]",sh:"none"}}}}
						,css:{zi:zindexTop,po:"fixed",cu:"move",op:"[[op]]",br:"solid 0.3px gray"
							,all:["[[h]]","[[w]]","[[ofs]]","[[ [[app.ww]]-[[w]]-[[ofs]] ]]"]
							,bgi:"[[bgi]]",bgs:["[[h]]","[[w]]"]
						}
						,ch:{"[[name]]_ctl":{kmin:o.kmin,kmax:o.kmax,css:{bgc:"yellow",op:33,cu:"pointer",zi:zindexTop-1},props:{movable:true,scalable:true}}}
					}
					upd_obj(d,u)
					d.bgi=isS(d.bgi)?d.bgi:isI(im)?im.src:"none"
					return init_obj(app.curworld+"_nav",d)
				}
				,initgrid: function(u) {
					var ow=app.worlds,wn=app.curworld
					var o,oc,d={css:{bgs:"19%",op:77,zi:zindexTop+1,sh:"inset 0 0 199px 33px #ffd",vi:"hidden"},props:{parallaxable:9,stretchable:true,pressable:true}}
					d.css.bgi=app.worlds.imgs[wn+"_grid"].src
					upd_obj(d,u)
					return init_obj(wn+"_grid",d)
				}
				,select: function([h,w,t,l],os,e) { //выбор  области
					var wn=app.curworld,o=gO(wn),oc=gO(wn+"_container")
					,k=o.w/w,kp=oc.h/oc.w
					oc.w*=k;oc.h=oc.w*kp
					ssO(oc,oc.h,oc.w)
					sbsO(oc,[oc.h,oc.w])
					poO(oc,oc.t=(oc.t-t)*k,oc.l=(oc.l-l)*k)
					reorg_children(oc,k)
					repos_navctl(o)
					corr_scrlarea(o)
				}
				,o_reset_also: function(o){var on=gO(o.id+"_nav")
					if (on.t>o.h-on.h) poO(on,on.t=o.h-on.h)
					if (on.l>o.w-on.w) poO(on,null,on.l=o.w-on.w)
					repos_navctl(o)
					return iff(o.save.reset_also,this,arguments) //выполнили пред. ф-ю
				}
				,oc_move_also: function(){
					var oc=this,o=gO(app.curworld),on=gO(o.id+"_nav")
					,i,oo,_o,kn=oc.w/on.w
					repos_navctl(o)
					for (i in oc.childNodes) { //перебераем все объекты в контейнере, для которых есть двойник в навигаторе
						oo=oc.childNodes[i];_o=gO(oo.id+"_nav")
						if (isH(_o)) poO(_o,_o.t=oo.t/kn,_o.l=oo.l/kn)
					}
					iff(oc.save.move_also,oc,arguments) //выполнили пред. ф-ю
				}
				,onc_before_scale: function(k,Y,X) {
					var o=gO(app.curworld),oc=gO(o.id+"_container"),on=gO(o.id+"_nav")
					if  (orient(this)=="in" || sign(k)<0) {
						var kn=oc.w/on.w,kc=oc.dat.scalable; if (!isN(kc)) kc=step_scaling
						scale_obj(oc,[(Y+this.t)*kn,X+this.l*kn],-kc*sign(k))
					}
					return false
				}
				,oc_scale_also: function(){
					var o=gO(app.curworld);repos_navctl(o)
					return iff(this.save.scale_also,this,arguments) //выполнили пред. ф-ю
				}
				,onc_move_also: function(dt,dl) {
					var o=gO(app.curworld),oc=gO(o.id+"_container"),on=gO(o.id+"_nav")
					move_obj(oc,-dt*oc.h/on.h,-dl*oc.w/on.w)
				}
				,repos_navctl: function(o) { //отражение изменений основной области в навигаторе
					if (!isH(o)) o=this //!= когда это vscroll_also/hscroll_also
					var oc=gO(o.id+"_container"),on=gO(o.id+"_nav"),onc=gO(o.id+"_nav_ctl")
					if (!isH(on)) return //если нет навигатора
					onc.t=-oc.t*on.h/oc.h; onc.l=-oc.l*on.w/oc.w
					onc.w=on.w*o.w/oc.w; onc.h=on.h*o.h/oc.h
					ssO(onc,onc.h,onc.w); poO(onc,onc.t,onc.l)
				}
				,addonav:function(o) {
					var wn=app.curworld,oc=gO(wn+"_container"),on=gO(wn+"_nav")
					if (isO(o.dat.onav) && isH(on)) {
						var kn=oc.w/on.w,_o=init_obj(o.id+"_nav",wn+"_nav",o.dat.onav);reorg_geom_obj(_o,1/kn);reorg_attrs_obj(_o,1/kn)
						o.move_also=function(dt,dl){kn=oc.w/on.w;_o=gO(this.id+"_nav");poO(_o,_o.t+=dt/kn,_o.l+=dl/kn)}
						o.resize_also=function(dh,dw){kn=oc.w/on.w;ssO(_o,_o.h+=dh/kn,_o.w+=dw/kn)}
						o.close_also=function(e,state,co){dO(o.id+"_nav")}
						o.scale_also=function(k,[dh,dw,dt,dl],Y,X){
							kn=oc.w/on.w;var _o=gO(this.id+"_nav")
							poO(_o,_o.t=o.t/kn,_o.l=o.l/kn);ssO(_o,_o.h=o.h/kn,_o.w=o.w/kn)
							for (var i=0;i<wAddAttrs.length;i++) {var at=wAddAttrs[i];_o.style[at]=scale_val(o.style[at],1/kn)}
				}}}
				,addwin:function() {
					var wn=app.curworld,ow=app.worlds,oc=gO(wn+"_container"),on=gO(wn+"_nav")
					,p=args(arguments),[u,us,nm]=[p.O[0],p.O[1],p.S[0]]
					,o,kn=oc.w/on.w
					,d=clone(win_dat,{
						props:{movable:true,pressable:true,closable:true,scalable:true,resizable:true},css:{op:99}
						,press:{catchid:"[[nmh]]"},scale:{catchid:"[[nmh]]"}
						,ch:{"[[nmc]]":{props:{scrollable:isO(us)?us:del}}}
						,sticky:0
					})
					upd_obj(d,u)
					if (!isS(nm)) if (isS(d.name)) nm=d.name; else nm=genname("win_");nm=wn+"_"+nm
					if (!isO(d.onav)) d.onav={css:"[[css]]",value:"[[value]]"}
					o=init_obj(nm,oc.id,d)
					reset_objs(o)
					o.click=function(e,state,co){c.log("clik!",this.id,o.id,"args:",e,state,co.id);o.state=""}
					o.longclick=function(){o.dat.sticky=1;sopO(o,90);o.save.zi=gziO(o);sziO(o,zindexMin)}
					o.ondblclick=function(){o.dat.sticky=0;sopO(o,100);sziO(o,o.save.zi)}
					if (o.dat.onav!="no") app.world_tools.addonav(o)
					return o
				}
				,addobj: function() {
					var wn=app.curworld,oc=gO(wn+"_container"),on=gO(wn+"_nav"),ow=app.worlds
					,p=args(arguments),[u,nm]=[p.O[0],p.S[0]]
					,d={pname:oc.id,z:oc.w,props:{movable:true,scalable:true,pressable:true,sticky:0}}
					,o,z,kn=oc.w/on.w
					upd_obj(d,u)
					if (isS(nm)) d.name=nm; else if (!isS(d.name)) d.name=genname("obj3d_",9999);d.name=wn+"_"+d.name
					if (!isO(d.onav)) d.onav={css:"[[css]]",value:"[[value]]"}
					o=init_obj(d)
					if (o.dat.onav!="no") app.world_tools.addonav(o)
					reset_objs(o)
					o.longclick=function(){o.dat.sticky=1;sopO(o,77);o.movestate=-1;o.save.zi=gziO(o);sziO(o,zindexMin)}
					o.dblclick=function(){o.dat.sticky=0;sopO(o,100);sziO(o,o.save.zi)}
					o.click=function(){o.state="";o.movestate*=-1}
					return o
				}
				,additem: function() { //u,nm,imgs
					var o=gO(app.curworld),oc=gO(o.id+"_container"),on=gO(o.id+"_nav"),ow=app.worlds
					,p=args(arguments),[u,nm,im]=[p.O[0],p.S[0],p.I[0]]
					,d={pname:oc.id,z:oc.w,css:{cu:"pointer",bgi:"[[bgi]]",all:["[[h]]","[[w]]","[[t]]","[[l]]"],bgs:["[[h]]","[[w]]"]},props:{movable:true,scalable:true,pressable:true,focusable:true},sticky:0}
					,_o,oo,kn=oc.w/on.w
					upd_obj(d,u)
					if (!isN(d.dv)||!isN(d.dh)) [d.dv,d.dh]=[grnd(1)*2-1,grnd(1)*2-1] //[-1,+1] - направление движения
					if (!isI(im)) {
						if (isS(d.bgi) && isI(ow.imgs[d.bgi])) {im=ow.imgs[d.bgi];d.bgi=im.src}
						else if (isI(ow.imgs[d.name])) {im=ow.imgs[d.name]}
						else if (isI(ow.imgs[nm])) {im=ow.imgs[nm]}
					}
					if (isI(im)) {
						if (!isN(d.h) || !isN(d.w)) {d.h=im.height;d.w=im.width}//не заданы размеры, но обнаружена картинка с заданным именем - устанавливаем ее размеры
						if (!isS(d.bgi)) d.bgi=im.src;if (!isS(d.css.bgi)) d.css.bgi=im.src
					}
					if (!isN(d.t)) d.t=grnd(oc.h/2-d.h/2) //если не заданы top (и/или left), берем случайно...
					if (!isN(d.l)) d.l=grnd(oc.w/2-d.w/2)
					if (isS(nm)) d.name=nm; d.name=o.id+"_"+nm
					oo=init_obj(d,function(){
						var dc=clone(this);delete dc.props;delete dc.css.sh;delete dc.children; delete dc.ch
						_o=init_obj(dc.name+"_nav",on.id,dc)
					})
					reorg_geom_obj(_o,1/kn);reorg_attrs_obj(_o,1/kn)
					oo.movestate=1 //двигаемся, если запущен итератор
					oo.longclick=function(){var o=this;o.dat.sticky=1;sopO(o,77);o.movestate=-1;o.save.zi=gziO(o);sziO(o,zindexMin)}
					oo.dblclick=function(){var o=this;o.dat.sticky=0;sopO(o,100);sziO(o,o.save.zi)}
					oo.click=function(){this.state="";this.movestate*=-1}
					oo.move_also=function(dt,dl){kn=oc.w/on.w;_o=gO(this.id+"_nav");poO(_o,_o.t+=dt/kn,_o.l+=dl/kn)}
 					oo.scale_also=function(k,[dh,dw,dt,dl],Y,X){kn=oc.w/on.w;var _o=gO(this.id+"_nav")
						poO(_o,_o.t=oo.t/kn,_o.l=oo.l/kn);ssO(_o,_o.h=oo.h/kn,_o.w=oo.w/kn)
						for (var i=0;i<wAddAttrs.length;i++) {var at=wAddAttrs[i];_o.style[at]=scale_val(oo.style[at],1/kn)}
					}
					if (isN(d.k)) {scale_obj(oo,d.k);scale_obj(_o,d.k/kn)}//задан коеф масштабирования
					return oo
				}
				,moving:	function(cnt,ot) {// return false //меняем направление, если облако скрылось из видимой области
					var oc=gO(app.curworld+"_container"),on=gO(app.curworld+"_nav")
					function repos(o){if (o.movestate<0) return
						var _o=gO(o.id+"_nav"),kn=oc.w/on.w,i,[h,w,t,l]=[o.h,o.w,o.t+o.dat.kv*o.dat.dv,o.l+o.dat.kh*o.dat.dh]
							if (t<-h/2) {t=-h/2;o.dat.dv*=-1} else if (t>oc.h-h/2) {t=oc.h-h/2;o.dat.dv*=-1}
						if (l<-w/2) {l=-w/2;o.dat.dh*=-1} else if (l>oc.w-w/2) {l=oc.w-w/2;o.dat.dh*=-1}
						_o.style.transform=o.style.transform=(o.l-l>0)?"scale(-1,1)":"scale(1,1)"
						poO(o,o.t=t,o.l=l)
						poO(_o,_o.t=o.t/kn,_o.l=o.l/kn)
					}
					if (cnt>30*ot.drm) return false //через ~settings.drm сек останавливаем
					for (i in ot.list) repos(ot.list[i])
				}
				,init: function(wn,ow){
					app.curworld=wn;app.worlds=ow
					var i,o=gO(wn),oc=gO(wn+"_container"),on=gO(wn+"_nav"),onc=gO(wn+"_nav_ctl"),og=gO(wn+"_grid")
					for (i in app.world_tools) eval("var "	+i+"="+app.world_tools[i]) //делаем функции локальными
					if (isH(og)) og.click=function(){animate(this,"top",-this.h0,longdelay);fadeout(this,dO,longdelay)}
					o.save.reset_also=o.reset_also //сохранили предустановленные ф-ции
					oc.save.move_also=oc.move_also
					oc.save.scale_also=oc.scale_also
					app.selfunc=select
					o.reset_also=o_reset_also
					oc.move_also=oc_move_also
					if (isH(onc)) {
						onc.before_scale=onc_before_scale
						onc.move_also=onc_move_also
					}
					oc.scale_also=oc_scale_also
					o.hscroll_also=o.vscroll_also=repos_navctl
					repos_navctl(o)
					corr_scrlarea(o)
				}
			}
		}

	function init_func(src,app) {
		var i,j,k,fn,src=src.split("\n")
		if (!app.pref) app.pref=""
		for (i=0;i<src.length;i++) { //делаем все функции глобальными (с префиксом "app.pref")
			j=src[i].indexOf("function"); if (j==-1) continue
			src[i] = src[i].substr(j+8)
			k=src[i].indexOf("(");if (k==-1) continue
			fn=strip(src[i].substr(0, k))
			try {
				if (isF(eval(fn)) && valinobj(fn,app.disfuncs)===false) {
					app.funcs[fn]=eval(fn)
					w[app.pref+fn]=app.funcs[fn]
				}
			} catch(e){}
 		}
	}
// childList, если необходимо наблюдать за добавлением или удалением дочерних элементов (Включая текстовые узлы (text nodes))
// attributes, если необходимо наблюдать за изменениями атрибутов целевого элемента.
// characterData, если необходимо наблюдать за изменениями значения текстового содержимого целевого узла (текстовых узлов дочернего элемента).
// subtree, если необходимо наблюдать за потомками целевого элемента.
// attributeOldValue, если необходимо возвращать предыдущее значение атрибута.
// characterDataOldValue, если необходимо возвращать предыдущее значение Data атрибута.
// attributeFilter Устанавливает массив названий атрибутов (без указания пространства имен), если требуется наблюдать за изменениями конкретных атрибутов.
	function init_mutobs() {
		try{
			app.mutobs=new MutationObserver(function(mr){ //mr - mutation records)
				mr.forEach(function(i){
					iff(i.target.owner.fconnect,i,i.target.data)
				})
			})
			app.connector=ctnO() //создали текстовый узел-коннектор
			app.connector.owner=app //глобальный коннектор (поле target - объект, кому принадлежит коннектор)
			app.mutobs.observe(app.connector, {characterData: true})
			app.fresult=function(res){c.log("app.onresult:",res,"emitter(type):",wisit(this))}//this is "XMLHttpRequest" "MutationRecord" "MessageEvent"
// 			app.fresult=function(res){c.log("app.onresult:",res.data)} //this is "XMLHttpRequest" "MutationRecord" "MessageEvent"
// 			app.fconnect=function(dat){var d,o=this.target.owner
// 				try {eval("d="+dat)} catch(e){try {d=eval(dat)} catch(e){d=dat}}
// 				iff(o.fresult,this,d)
// 			}
			app.fconnect=function(dat){var d,o=this.target.owner
				try {
					dat=fmt(dat)
					if (dat[0]=="{" && li(dat)=="}") {
						eval("dat="+dat) //dat=JSON.stringify(dat)
						jpost(dat,function (dat) {try {dat=JSON.parse(dat)} catch(e){};iff(o.fresult,this,dat)})
						return
					} else eval("d="+dat)
				} catch(e){try {d=eval(dat)} catch(e){d=dat}}
				iff(o.fresult,this,d)
			}
		}catch(e){c.log("init_mutobs: "+isE(e)?e.message:e)}
	}

	function init_app(src) {
		function post(){
			if (!app.name) app.name=genname("app",app.monitor_tick)
			if (!app.id) app.id=md5(app.name+getTime("ms")).substr(0,9)
			if (app.sse.flags.start) {app.sse.ntry=app.sse.ntime;iff(app.sse.finit)}
			d.title=app.name+"-"+app.id
// 			setInterval(function(){console.log(".");if (!isO(app) || !isS(app.id)) app=appdef},999)
        }
		var i,v,n,m,d=document,c=console
//читаем параметры из <meta> из <head> и модифицируем "appdef"
		m=d.head.getElementsByTagName("meta")
		for (i=0;i<m.length;i++) if (isH(m[i]) && m[i].name.substr(0,4)=="app-") {
			v=m[i].getAttribute("content");n=m[i].name.substr(4)
			if (n!="start") try {eval("appdef[n]="+v)}catch(e){appdef[n]=v}
			else appdef[n]=v //запомнили start из <meta>
		}
		m=d.getElementsByTagName("script") //пробуем извлечь start из атрибута "start" объекта "script"
		for (i=0;i<m.length;i++) if (li(m[i].src.split("/"))==scriptname) {v=m[i].getAttribute("start");if (isS(v)) appdef.start=v}
		iterate( //ждем тег <body>, если не дождемся, создадим свой
			function(cnt){
				if (isH(d.body)) {
					upd_obj(appdef,{flags:{decor:0,decoranim:0},bodycss:"del"})
					return false
				}
				if (cnt>=appdef.waitbody*1000/discrete) {acO(cO("body"),d);return false} //не дождались - генерируем свое
			}
			,function(){//end iterate - body is ok, continue init system
				if (global) for (i in global) window[i]=global[i] // делаем заданные имена глобальными
				init_func(src,appdef)
                if (typeof app=="object") upd_obj(appdef,app);app=appdef
				msie=!!d.all //true if IE
				w.onfocus=function(){app.states.focus=1}
				w.onblur=function(){app.states.focus=0}
				init_docintr()
				w.onresize=function(){
					app.hw=hwin();app.ww=wwin()
					reset_objs_all()
				}
				app.ww=wwin();app.hw=hwin()
				iterate("application_monitor",function(c){if (iff(app.fmonitor,app,c)===false) return false},app.monitor_tick) //попытка запустить системную функцию app.fmonitor
				init_mutobs()
				if (isF(app.start)) {iff(app.start);post()}
				else if (isS(app.start)) chk_n_go(app.start,app.wait_for_start,post) //пробуем запустить "start" из app
				else post()
				init_spec()
				app.state="ok"
			}
			,function(e){console.log("Error init system:",e,this)}
		)
// }catch(e){c.log(e)}
	}
	function	chk_n_go(f,n,fn){c.log("chk_n_go:",f)
		if (!isN(n)) n=15 // n - число повторов iterate.
		function fi(cnt){
			try{let ff=eval(f)
				if (ff!=f) return false
				if (isF(ff)) {ff(); return false}
			} catch(e){}} //прекращаем ожидание, если app.start - функция или его значениене равно ему самому.
		if (fi()!==false) iterate("waits_for_start: \""+f+"\"",fi,fn)
		else iff(fn)
	}

	function init_decor(l){var i,r=[] //каждый элемент массива l - это данный для создания объекта
		if (isA(l)) for (i in l)r.push(init_obj(l[i]))
		return r
	}
	function init_spec() {
		css(d.body,app.bodycss)
		ottl=app.otitle=init_obj(clone(title_dat),genname("maintitle"))
		ottl.before_close=ottl.___keydown___=hidetitle
		otcnt=app.otcont=gO(ottl.id+"_cont")
		otcnt.over_also=otcnt.out_also=function(e){if (e.type=="mouseout") ottl.tm=setTimeout(hidetitle,showtime); else clearTimeout(ottl.tm)}
		oscr=app.oscreen=init_obj(app.screen_dat,genname("screen"))
	}
	function docmd(){// выполнить команды на сервере (не требуются объекты-коннекторы)
		var a=args(arguments),[cmd,f]=[a.S[0],a.F[0]]
		jpost({cmd:cmd},function(r){
			if (isR(r)) {c.log("jpost/docmd error",r.message);f(r)}
			else iff(f,r,r.data)
		})
	}
	function send(){
		var a=args(arguments),[cmd,p,f]=[a.S[0],a.O[0],a.F[0]]
		upd_obj(p,{cmd:cmd,fromapp:app.id, toapp:p.toapp,data:p.data,time:getTime("ms")})
		if (isH(this) && !isH(p.fromobj)) p.fromobj=this.id
		jpost(p,function(r){
			if (isR(r)) {c.log("jpost/send error",r.message);f(r)}
			else iff(f,r,r.data)
		})
	}

	function mod(n) {return n*sign(n)}
	function utf8_decode(inp) {var s="",i,c,c1,c2;i=c=c1=c2=0
		while (i < inp.length) {
			c = inp.charCodeAt(i)
			if (c < 128) {s+=String.fromCharCode(c);i++}
			else if ((c > 191) && (c < 224)) {
				c2 = inp.charCodeAt(i+1)
				s+=String.fromCharCode(((c & 31) << 6) | (c2 & 63));i+= 2
			} else {
				c2=inp.charCodeAt(i+1);c3 = inp.charCodeAt(i+2)
				s+=String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
				i+=3
			}
		}
		return s
	}
	function utf8_encode(inp) {var out="",i,c
		for (i=0; i<inp.length; i++) {
			c=inp.charCodeAt(i)
			if (c < 128) out+=String.fromCharCode(c)
			else if ((c > 127) && (c < 2048)) out+=String.fromCharCode((c >> 6) | 192) + String.fromCharCode((c & 63) | 128)
			else out+= String.fromCharCode((c >> 12) | 224) + String.fromCharCode(((c >> 6) & 63) | 128) + String.fromCharCode((c & 63) | 128)
		}
		return out
	}
	function enc64(inp) {inp = escape(inp);var out="",c1,c2,c3,e1,e2,e3,e4,i=0
		do {c1=inp.charCodeAt(i++);c2=inp.charCodeAt(i++);c3=inp.charCodeAt(i++)
	        e1 = c1 >> 2; e2 = ((c1 & 3) << 4) | (c2 >> 4); e3 = ((c2 & 15) << 2) | (c3 >> 6); e4 = c3 & 63
			if (isNaN(c2)) e3=e4=64; else if (isNaN(c3)) e4=64
	        out+=b64sym.charAt(e1)+b64sym.charAt(e2)+b64sym.charAt(e3)+b64sym.charAt(e4);c1=c2=c3=e1=e2=e3=e4=""
	    } while (i<inp.length)
	     return out
	}
	function dec64(inp) {
		var out="",c1,c2,c3,e1,e2,e3,e4,i=0
		do {
			e1=b64sym.indexOf(inp.charAt(i++));e2=b64sym.indexOf(inp.charAt(i++));e3 = b64sym.indexOf(inp.charAt(i++));e4=b64sym.indexOf(inp.charAt(i++))
			c1=(e1 << 2) | (e2 >> 4);c2=((e2 & 15) << 4) | (e3 >> 2);c3 = ((e3 & 3) << 6) | e4; out+=String.fromCharCode(c1)
			if (e3 != 64) out+=String.fromCharCode(c2);if (e4 != 64) out+=String.fromCharCode(c3)
			c1=c2=c3="";e1=e2=e3=e4=""
		} while (i < inp.length)
		return unescape(out)
	}
	function deg2rad(deg) {return deg*PI/180}
	function rad2deg(rad) {rad/PI*180}
	function tan(deg) {return Math.tan(deg2rad(deg))}
	function md5(s) {//~3.5Kb
		return b2h(core_md5(s2b(s),s.length*8))
		function s2b(s){var bin=Array();for(var i=0;i<s.length*8;i+=8)bin[i>>5]|=(s.charCodeAt(i/8)&255)<<(i%32);return bin}
		function b2h(ar){var i,s='';for(i=0;i<ar.length * 4;i++){s+=hex.charAt((ar[i>>2] >> ((i%4)*8+4))&0xF)+hex.charAt((ar[i>>2]>>((i%4)*8))&0xF)}return s}
		function sa(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF),msw=(x>>16)+(y>>16)+(lsw>>16);return (msw<<16)|(lsw&0xFFFF)}
		function bit_rol(num,cnt){return (num<<cnt)|(num>>>(32-cnt))}
		function core_md5(x,l){x[l>>5]|=0x80<<((l)%32);x[(((l+64)>>>9)<<4)+14]=l
			var olda,i,a=1732584193,b=-271733879,c=-1732584194,d=271733878
			for(i=0;i<x.length;i+=16)
			{olda=a,oldb=b,oldc=c,oldd=d
				a=ff(a,b,c,d,x[i+ 0],7,-680876936);d=ff(d,a,b,c,x[i+1],12,-389564586);c=ff(c,d,a,b,x[i+2],17,606105819);b=ff(b,c,d,a,x[i+3],22,-1044525330);a=ff(a,b,c,d,x[i+4],7,-176418897);d=ff(d,a,b,c,x[i+5],12,1200080426);c=ff(c,d,a,b,x[i+6],17,-1473231341);b=ff(b,c,d,a,x[i+7],22,-45705983);a=ff(a,b,c,d,x[i+8],7,1770035416);d=ff(d,a,b,c,x[i+9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,-42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);a=ff(a,b,c,d,x[i+12],7,1804603682);d=ff(d,a,b,c,x[i+13],12,-40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);b=ff(b,c,d,a,x[i+15],22,1236535329)
				a=gg(a,b,c,d,x[i+ 1],5,-165796510);d=gg(d,a,b,c,x[i+ 6],9,-1069501632);c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i+ 0],20,-373897302);a=gg(a,b,c,d,x[i+ 5],5,-701558691);d=gg(d,a,b,c,x[i+10],9,38016083);c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+ 4],20,-405537848);a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14,-187363961);b=gg(b,c,d,a,x[i+8],20,1163531501);a=gg(a,b,c,d,x[i+13],5,-1444681467);d=gg(d,a,b,c,x[i+ 2],9,-51403784);c=gg(c,d,a,b,x[i+7],14,1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734)
				a=hh(a,b,c,d,x[i+ 5],4,-378558);d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16,1839030562);b=hh(b,c,d,a,x[i+14],23,-35309556);a=hh(a,b,c,d,x[i+ 1],4,-1530992060);d=hh(d,a,b,c,x[i+4],11,1272893353);c=hh(c,d,a,b,x[i+ 7],16,-155497632);b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i+ 0],11,-358537222);c=hh(c,d,a,b,x[i+3],16,-722521979);b=hh(b,c,d,a,x[i+ 6],23,76029189);a=hh(a,b,c,d,x[i+ 9],4,-640364487);d=hh(d,a,b,c,x[i+12],11,-421815835);c=hh(c,d,a,b,x[i+15],16,530742520);b=hh(b,c,d,a,x[i+ 2],23,-995338651)
				a=ii(a,b,c,d,x[i+ 0],6,-198630844);d=ii(d,a,b,c,x[i+ 7],10,1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+ 5],21,-57434055);a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8],6,1873313359);d=ii(d,a,b,c,x[i+15],10,-30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21,1309151649);a=ii(a,b,c,d,x[i+ 4],6,-145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,718787259);b=ii(b,c,d,a,x[i+ 9],21,-343485551);
				a=sa(a,olda);b=sa(b,oldb);c=sa(c,oldc);d=sa(d,oldd);}return Array(a,b,c,d)}
		function cmn(q,a,b,x,s,t){return sa(bit_rol(sa(sa(a,q),sa(x,t)),s),b)}
		function ff(a,b,c,d,x,s,t){return cmn((b&c)|((~b)&d),a,b,x,s,t)}
		function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&(~d)),a,b,x,s,t)}
		function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t);}
		function ii(a,b,c,d,x,s,t){return cmn(c^(b|(~d)),a,b,x,s,t);}
	}
	function li(a){if (isA(a)||isS(a)) return a[a.length-1]} //lastitem (послед.элемент в массиве или посл символ в строке)
	function gO(n){return isS(n)&&n!=""?d.all?d.all[n]:d.getElementById(n):null}
	function wisit(o){return {}.toString.call(o).slice(8, -1)}
	function isG(a){return wisit(a)=="Arguments"}
	function isH(o){if (isS(o))o=gO(o); return wisit(o).substr(0,4)=="HTML"}
	function isI(i){return wisit(i)=="HTMLImageElement"}
	function isME(o){return wisit(o)=="MessageEvent"}
	function isES(o){return wisit(o)=="EventSource"}
	function isXHR(o){return wisit(o)=="XMLHttpRequest"}
	function isO(o){return o instanceof Object && !isF(o) && !isA(o) && !isB(o) && !isN(o) && !isS(o)}
	function isE(e){return e instanceof Event}
	function isR(e){return e instanceof Error}
	function isA(a){return a instanceof Array}
	function isF(f){return f instanceof Function}
	function isS(s){return typeof s=="string" || s instanceof String}
	function isN(n){return (typeof n=="number" || n instanceof Number) && n!=Infinity && !isNaN(n) && n!=null} //проверка на строго рациональное число (number)
	function isB(b){return typeof b=="boolean" || b instanceof Boolean}
	function isV(v){if (isS(v)) v=gO(v);if (isH(v)) return v.style.visibility!="hidden"}
// 		return typeof v=="object" && typeof v.style=="object" && typeof }
	function isOA(o){return isO(o)||isA(o)}
	function cnvt(t) {try {if (eval("typeof "+t)=="number" || eval("typeof "+t)=="boolean") return eval(t);return t}catch(e){return t}} //if (!isNaN(t) && ()
	function rnkey(o,onm,nnm){o[nnm]=o[onm];delete o[onm]}
	function getvar(v){try {return eval(v)}catch(e){}}
	function setvar(v,vl){eval("var "+v+"="+val)}
	function setvar(v,val){try {eval(v+"=val")} catch(e){}}
	function getvars(ar){var r=[],i;for (i=0;i<ar.length;i++) try{r.push(eval(ar[i]))}catch(e){if (e.name=="ReferenceError") r.push(null); else r.push(e)}return r}
	function setvars(ar){var i;for (i in ar) try{eval(i+"="+ar[i])}catch(e){}}
	function gofO(o) {return o.style.overflow}
	function gfsO(o) {return o.style.fontSize}
	function sofO(o,v) {if (isH(o)) {let cv=gofO(o);if (cv!=o.save.overflow) o.save.overflow=cv} else o=d.body;o.style.overflow=isS(v)?v:"hidden"}
	function rofO(o) {o.style.overflow=o.save.overflow}
	function sofhpO(o) {//set overflow hidden parent object (return op)
		if (!isO(o.save)) o.save={};var op=o.parentNode,cv=gofO(op)
		if (cv!=o.save.poverflow) o.save.poverflow=cv; op.style.overflow="hidden"
		return op
	}
	function rofhpO(o) {o.parentNode.style.overflow=o.save.overflow} //restore after sofhpO
	function sbiO(o,i) {o.style.backgroundImage=(i!="none")?'url("'+i+'")':"none"}
	function gbiO(o) {
		var bgi=o.style.backgroundImage,a=sepstr(bgi,"url(",")"),a1=sepstr(bgi,"url(\"","\")")
		if (a==null && a1==null) return bgi
		return a1!=null?a1[1]:a!=null?a[1]:bgi
	}
	function sbsO(o,s) {o.style.backgroundSize=isA(s)?s[1]+"px "+s[0]+"px":s}
	function gbsO(o) {var ar,s=o.style.backgroundSize;if (s!="" &&s.indexOf("px")!=-1) {ar=s.split(" ");return [gnum(ar[1]),gnum(ar[0])]}else return s}
	function sbpO(o,p) {o.style.backgroundPosition=isA(p)?p[1]+"px "+p[0]+"px":p}
	function gbpO(o) {var ar,s=o.style.backgroundPosition;if (s!="" &&s.indexOf("px")!=-1) {ar=s.split(" ");return [gnum(ar[1]),gnum(ar[0])]}else return s}
	function gbrO(o) {return o.style.backgroundRepeat}
	function sbrO(o,p) {o.style.backgroundRepeat=p}
	function gbcO(o) {return o.style.backgroundColor}
	function sbcO(o,b) {o.style.backgroundColor=b}
	function sbO(o,b) {o.style.background=b}
	function gmsO(o){var [h,w]=[gnum(o.style.minHeight),gnum(o.style.minWidth)];return [max(0,isNaN(h)?0:h),max(0,isNaN(w)?0:w)]}
	function gsO(o){
		var h=gnum(o.style.height),w=gnum(o.style.width)
		return o==d.body?[hwin(),wwin()]:[h>=0?h:o.clientHeight,w>=0?w:o.clientWidth]
	}
// function gsO(o){return o==d.body?[hwin(),wwin()]:[o.clientHeight,o.clientWidth]} //возвращает целыее значение

	function gpsO(o){return gsO(o.parentNode)}
	function gpO(o){
// 		if (o==d.body) return [0,0];
		var t=gnum(o.style.top),l=gnum(o.style.left)
		return [t>=0?t:o.offsetTop,l>=0?l:o.offsetLeft]
	}
	function gppO(o){return o.parentNode==d.body?[0,0]:[o.parentNode.offsetTop,o.parentNode.offsetLeft]}
	function cpO(o,o1){while(o.parentNode!==d.body) {if (o.parentNode===o1) return true;o=o.parentNode} return false} //проверяет родительство o1 над o
	function gbcrO(o){return o.getBoundingClientRect()}
	function gapO(o){if(isS(o)) o=gO(o);if(isH(o)){var r=o.getBoundingClientRect();return [r.top, r.left]}}
	function grO(o){if (o.parentNode==d.body) return o;return grO(o.parentNode)}//возвращает самого верхнего родителя
	function sfcO(o,c) {o.style.color=c}
	function sfsO(o,c) {o.style.fontSize=c}
	function scO(o,r) {o.style.cursor=r}
// 	function stO(o,t,s,c){if (t==null)o.innerHTML="";else o.innerHTML=t;if (isO(s)) css(o,s); else {if (s) o.style.fontSize=s+"px"; if (c) o.style.color=c}}
	function stO(o,t,s,c){if (isS(o)) o=gO(o); if (isH(o)) {if (t==null)o.innerHTML="";else o.innerHTML=t;if (isO(s)) css(o,s); else {if (s) o.style.fontSize=s+"px"; if (c) sfcO(o,c)};return o}}
	function gtO(o){return o.innerHTML}
	function ctnO(t) {return d.createTextNode(!t?"":t)}
	function stnO(o,t){var ot=ctnO(t);acO(ot,o);return ot}
	function gtnO(o){return o.nodeinnerHTML}
	function gziO(o){var z=gint(o.style.zIndex); return isN(z)?z:""}
	function sziO(o,z){o.style.zIndex=z}
	function atO(o,t,s,c,tg,ocss){var oo=cO(tg?tg:"span");stO(oo,t,s,c);acO(oo,o);if (isO(ocss)) css(oo,ocss);return oo}

	function ssO(o,h,w){if (isS(o))o=gO(o);if (!isH(o)) return
		if (h!=null) {if (isN(h)) h+="px";o.style.height=h}
		if (w!=null) {if (isN(w)) w+="px";o.style.width=w}
	}
	function poO(o,t,l){if (isS(o))o=gO(o);if (!isH(o)) return
		if (t!=null) {if (isN(t)) t+="px";o.style.top=t}
		if (w!=null) {if (isN(l)) l+="px";o.style.left=l}
	}
	function sshO(o,l){if (isH(o)) o.style.boxShadow=o.style.WebkitBoxShadow=o.style.MozBoxShadow=o.style.KhtmlBoxShadow=l}
	function sroO(o,l){if (isS(o)) o=gO(o)
		if (isH(o)) o.style.borderRadius=o.style.MozBorderRadius=o.style.WebkitBorderRadius=o.style.KhtmlBorderRadius=isN(l)?l+"px":isA(l)?l[0]+"px "+l[1]+"px "+l[2]+"px "+l[3]+"px":l
	}
	function sopO(o,v){if (msie){o.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+v+")";o.style.zoom=1}
		else o.style.MozOpacity=o.style.KhtmlOpacity=o.style.opacity=v/100
	}
	function sgrO(o,v) {v+=""
		var i,s=o.style.background,C=fmt(v).split(" ",2),t="linear-gradient(top, ",p=["","-ms-", "-moz-", "-o-", "-webkit-"]
		if (C.length==2) {
			try{C[0]=hex6(C[0]);C[1]=hex6(C[1])}catch(e){c.log(e)}
			if (C[0].length==7 && C[1].length==7) {for (i in p) sbO(o,p[i]+t+C[1]+","+C[0]+")");return}
		} else if (C.length==1) {C[0]=hex6(C[0]);if (C[0].length==7) {sbO(o,v);return}}
		C=v.split("-gradient(",2)
		if (C[1]) for (i in p) sbO(o,p[i]+C[0]+"-gradient("+C[1])
	}

// 	function poOr(o,t,r){if (isH(o)) {if (t!=null)o.style.top=t+"px";if (r!=null)o.style.right=r+"px"}}
// 	function ssO(o,h,w){if (h=="")o.style.height=h;else if (h!=null && !isNaN(h))o.style.height=h+"px";if (w=="")o.style.width=w ;else if (w!=null && !isNaN(w))o.style.width=w+"px"}
	function d2x(d) {var d0,d1;d1=d>>4;d0=d-d1*16;return hex.charAt(d1) + hex.charAt(d0)} // dec 2 hex
	function x2d(n) {return hex.indexOf(n.substr(0,1))*16+hex.indexOf(n.substr(1,1))}
	function c2b(c) {var i,r='';for (i=7;i>-1;i--) {r+= (c & 1<<i)>>>i}return r} // code 2 bin
	function b2c(b) {var r=0,i;for (i=0;i<8;i++) r+=(1<<(7-i))*b.substring(i,i+1);return r}
	function c2s(c) {return String.fromCharCode(c)} //code 2 byte (symbol)
	function s2c(c,i) {if (i==null)i=0;return c.charCodeAt(i)}
	function cO(o){return d.createElement(!o?"div":o)}
	function acO(o,p){if (!isH(p)) p=d.body; p.appendChild(o);return o}
	function ibO(o,p,bo){p.insertBefore(o,bo)}
	function iaO(o,p,bo){p.insertAfter(o,bo)}
	function dO(o){if (isS(o)) o=gO(o); if (isH(o)) {
		var i=valinobj(o.id,names),j;if(i!==false) names.splice(i,1)
		try{o.parentNode.removeChild(o)}catch(e){};delete o
// 		iff(o.parentNode.removeChild,o,o);delete o

	}}
	function arg2ar(p) {return [].slice.call(p)} //возвращаеет массив параметров вместо псевдомассива
	function iff(){var p=arg2ar(arguments) //1 - ф-я, 2 - context, 3,4,5... arguments (or 3 is arguments)
		if (isF(p[0])) try{
			if (isG(p[2])) return p[0].apply(p[1],p[2])
			return p.shift().apply(p.shift(),p)
		}catch(e){return e}
		if (isS(p[0])) {var rc;try{eval("rc="+p[0]);if (typeof rc=="function") return rc();else return rc}catch(e){return e}}
	}
	function show(o){showhide(arguments,"")}
	function hide(o){showhide(arguments,"hidden")}
	function showhide(p,s){for (var i in p) {if (isS(p[i])) p[i]=gO(p[i]);if (isH(p[i])) p[i].style.visibility=s}}
	function strip(s){ try{var r=s.replace(/^\s+|\s+$/g,'');if (r!=s) return r}catch(e){};return s}
	function ss(s,n) {var r='';for (var i=0;i<n;i++) r+=s; return r}
	function sp(n) {return ss("&nbsp;",n)}
	//***** cookie *****
	function dC(n){d.cookie=n+"=; path=/; expires=Thu, 01-Jan-70 00:00:01 GMT"}
	function sC(n,v){exp=new Date();exp.setTime(exp.getTime()+(365*24*3600*1000));d.cookie=n+"="+escape(v)+"; path=/; expires="+exp.toGMTString()}
	function gC(n) {
		var pref=n+"=",st=d.cookie.indexOf(pref);if (st==-1) return ''
		var en=d.cookie.indexOf(";",st+pref.length)
		if (en==-1) en=d.cookie.length
		return strip(unescape(d.cookie.substring(st+pref.length,en)))
	}
	function wwin(){return gnum(w.innerWidth?w.innerWidth:(d.documentElement.clientWidth?d.documentElement.clientWidth:d.body.offsetWidth))}
	function hwin(){return gnum(w.innerHeight?w.innerHeight:(d.documentElement.clientHeight?d.documentElement.clientHeight:d.body.offsetHeight))}
	function round(n,m){return gnum(n).toFixed(m)*1} //для округления

//	function valinarray(v,a){if (isA(a)) for (var i=0;i<a.length;i++) if (a[i]==v) return i;return false} // === false,  значит не найден...
	function valinobj(v,a){if (isOA(a)) for (var i in a) if (a[i]==v) return !isNaN(i)?gnum(i):i;return false}
	function grnd(n){return round((Math.random()*n))}
	function rndset(n,m){return multia([msep+n+"+"+(m==null?0:m)]).sort(function(a,b){return grnd(2)-1})} //генерация случайного множества. n - число элементов
	function clone() { //o,u,rs,rt
		var p=args(arguments),[oa,ua,o,u,rs,rt]=[p.A[0],p.A[1],p.O[0],p.O[1],p.S[0],p.S[1]],oo,s
		if (isO(o)) {
			try {s=JSON.stringify(o)
				if (isS(rs)&&isS(rt)) s=grepl(s,rs,rt)
				oo=JSON.parse(s);if (isO(u)) upd_obj(oo,u)
				return oo
			} catch(e){return o}
		} else if (isA(oa)) {
			try {s=JSON.stringify(oa)
				if (isS(rs)&&isS(rt)) s=grepl(s,rs,rt)
				oo=JSON.parse(s);if (isO(ua)) upd_obj(oo,ua); else if (isO(u)) upd_obj(oo,u)
				return oo
			} catch(e){return oa}
		}
	}
	function grepl(str,ss,ts) { //замена .replace ()
		for (var i=0;i<=str.length-ss.length;i++) if (str.substr(i,ss.length)==ss) { //нашли вхождение
			str = str.substr(0, i) + ts + str.substr(i + ss.length)
			i+=ts.length
		}
		return str
	}
	function keys(o){var i,r=[];for (i in o) r.push(i);return r} //function keys(o){return isO(o)?Object.keys(o):false}
	function lkeys(o){if (isO(o)||isA(o)) return keys(o).length}

	function iterate() {//повторять func() с интервалом disc пока она не возвратит строго false
		var p=args(arguments),[upd,nm,disc,func,fnext,ferr]=[p.O[0],p.S[0],p.N[0],p.F[0],p.F[1],p.F[2]],i,rc
		,clr=function(e){
			if (isO(tasks[nm])) {clearInterval(tasks[nm].tm);delete tasks[nm]} // if (isN(tasks[nm].tm)) clearInterval(tasks[nm].tm)}
			if (isR(e)) iff(ferr,e,e); else iff(fnext)
		}
		if (!isF(func) || isO(tasks[nm])) {clr();return} //существующая, завершаем iterate (т.е. iterate без функции - заершение)
		if (!isS(nm)) nm=gentask("iterate_task_") //новая задача
		tasks[nm]={cnt:0}
		if (isO(upd)) for (i in upd) tasks[nm][i]=upd[i]//модификация контекста задачи
//upd_obj(tasks[nm],upd)
		if (!isN(disc)) disc=discrete //продолжительность интервала по-умолчанию
		tasks[nm].func=func
		tasks[nm].tm=setInterval(function(){try{
// console.log("nm",nm,tasks[nm].func)
				rc=iff(tasks[nm].func,tasks,tasks[nm].cnt++,tasks[nm])
				if (rc===false||isR(rc)) clr(rc)
			}catch(e){clr(e)}
		},disc) //запустили
		return nm
	}

	function cssAttr2styleAttr(s) { //например, z-index -> zIndex
		if (!isS(s)) s=s.toString();if (s.indexOf("-")<0) return s
		var ar=s.split("-"),r=ar[0],i
		for (var i=1;i<ar.length;i++) r+=ar[i].substr(0,1).toUpperCase()+ar[i].substr(1)
		return r
	}
	function css(o,a,fff){
		if (isS(o)) o=gO(o); if (!isH(o)) return; var rnd,i,oi,oi0,nm,j,aa,v,ar={},ps=rndPosNsize(o.parentNode),clr=rndcolor()
		function dl(s){if (o.dat && o.dat.css && defcss[s]!=null) delete o.dat.css[s]} //конфликтные
		function ad(s){if (o.dat && o.dat.css) o.dat.css[s]=v}
		function adbr(){if (v.split(" ").length==1 && v!="none" && v!="random") v="solid 1px "+v}
		function adpx(){if (v>0||v<0) v+="px"}
		rnd={he:ps[0],wi:ps[1],to:ps[2],le:ps[3],bo:ps[2],ri:ps[3],bgc:clr[0],co:clr[1],br:clr[1],gr:clr[1]+" "+clr[0]}
		try {
			for (i in a) {
				v=_eval(a[i]);if (v=="random") v=rnd[i];else if (v==null) continue //del||undef
				if (i=="bgc") {
					if (v.indexOf("rgb(")>-1) v=rgb2hex(v)
					else if (v.split(" ").length>1) {sgrO(o,v);continue}
				}
				switch (i) {//нестандартные аттрибуты (без try для IE - ошибка)
					case "bg":	ad("background");o.style.background=v;break
					case "bgc":	ad("background-color");o.style.backgroundColor=v;break
					case "bgi":	if (v!="none") v="url(\""+v+"\")";ad("background-image");o.style.backgroundImage=v;break
					case "bgp":	ad("background-position");o.style.backgroundPosition=v;break
					case "bgr":	ad("background-repeat");o.style.backgroundRepeat=v;break
					case "bgs":	if (isA(v))v=v[1]+"px "+v[0]+"px"; ad("background-size");o.style.backgroundSize=v;break
					case "bo":	adpx(); ad("bottom");o.style.bottom=v;break
					case "br":	adbr();ad("border");o.style.border=v;break
					case "brb":	adbr();dl("bo");ad("border-bottom");o.style.borderBottom=v;break
					case "brl":	adbr();dl("bo");ad("border-left");o.style.borderLeft=v;break
					case "brr":	adbr();dl("bo");ad("border-right");o.style.borderRight=v;break
					case "brt":	adbr();dl("bo");ad("border-top");o.style.borderTop=v;break
					case "co":	ad("color");sfcO(o,v);break
					case "cu":	ad("cursor");o.style.cursor=v;break
					case "di":	ad("display");o.style.display=v;break
					case "ff":	ad("font-family");o.style.fontFamily=v;break
					case "fl":	ad("float");o.style.float=v;break
					case "fs":	adpx(); ad("font-size");o.style.fontSize=v;break
					case "fw":	ad("font-weight");o.style.fontWeight=v;break
					case "gr": case "gradient": sgrO(o,v);break //тоже, что и bgc с 2мя цветами (диапазоном)
					case "he":	adpx(); ad("height");o.style.height=v;break
					case "le":	adpx(); ad("left");o.style.left=v;break
					case "lh":	adpx(); ad("line-height");o.style.lineHeight=v;break
					case "ma":	adpx(); ad("ma");o.style.margin=v;break
					case "mab":	adpx(); dl("ma"); ad("margin-bottom");o.style.marginBottom=v;break
					case "mal":	adpx(); dl("ma"); ad("margin-left");o.style.marginLeft=v;break
					case "mar":	adpx(); dl("ma"); ad("margin-right");o.style.marginRight=v;break
					case "mat":	adpx(); dl("ma"); ad("margin-top");o.style.marginTop=v;break
					case "op": ad("opaque");case "opaque": sopO(o,v);break
					case "ov":	ad("overflow");o.style.overflow=v;break
					case "pa":	adpx(); ad("padding");o.style.padding=v;break
					case "pab":	adpx(); dl("pa"); ad("padding-bottom");o.style.paddingBottom=v;break
					case "pal":	adpx(); dl("pa"); ad("padding-left");o.style.paddingLeft=v;break
					case "par":	adpx(); dl("pa"); ad("padding-right");o.style.paddingRight=v;break
					case "pat":	adpx(); dl("pa"); ad("padding-top");o.style.paddingTop=v;break
					case "po":	ad("position");o.style.position=v;break
					case "ri":	adpx();;delete a.le; ad("right");o.style.right=v;break
					case "ro": case "round": sroO(o,v);break
					case "sh": case "shadow": sshO(o,v);break
					case "ta":	ad("text-align");o.style.textAlign=v;break
					case "to":	adpx(); ad("top");o.style.top=v;break
					case "ts":	ad("text-shadow");o.style.textShadow=v;break
					case "vi":	ad("visibility");o.style.visibility=v;break
					case "wi":	adpx(); ad("width");o.style.width=v;break
					case "ws":	ad("white-space");o.style.whiteSpace=v;break
					case "zi":	ad("z-index");o.style.zIndex=v;break
					case "all":
						for (j=0;j<a[i].length;j++) {
							nm=cssall[j];oi=_eval(a[i][j]) //nm - имя аттрибута, oi - значение j-го элемента массива all
							ar[nm]=oi
						}
						css(o,ar,"from css recurs")
						break
					default: //обычные аттрибуты
						if (v==null) delete o.style[cssAttr2styleAttr(i)]; else o.style[cssAttr2styleAttr(i)]=v
				}
			}
		} catch(e){c.error("css error:",oi,wisit(oi),e)}
		return o
	}

	function setlangmsg(s,m){ if (!m) m=app.msgs //рекурсивно просматривает строку и подменяет языковые вставки
		var a,r=s,i=0;
		while (++i<maxdeep) {
			a=sepstr(_eval(r),"{{","}}")
			if (a==null) break
			if (a[1]=="") r=a[0]+a[2]
			else r=a[0]+_eval(m[a[1]])+a[2]
		}
		return r
	}

	function setlang(o,m){
		if (!m) m=app.msgs
		lookout_domObjs(function(){var r,o=this;
			if (o.dat && o.dat.value){r=setlangmsg(o.dat.value,m);stO(o,r)}
		},o) //if (o.dat.value!=r) stO(o,r)
	}
	function checkParent(o,op) {if (o.parentNode==op) return true;if (o.parentNode==d.body) return false;return checkParent(o.parentNode,op)}
	function isover(o,o1) {
		var po=gapO(o),po1=gapO(o1)
		return po[0]+o.h>=po1[0] && po1[0]+o1.h>po[0] && po[1]+o.w>=po1[1] && po1[1]+o1.w>po[1]
	}
	function upd_obj(o,o1) { //объединение деревьев
		if (isOA(o1)) {
			for (i in o1) {
				if (isO(o1[i])) {if (!isO(o)) o={}; if (!isO(o[i])) o[i]={}}
				else if (isA(o1[i]) && !isA(o[i])) o[i]=[]
// else if (isA(o1[i])) {if (!isA(o)) o=[]; if (!isA(o[i])) o[i]=[]}
				if (isOA(o1[i]) && isOA(o[i])) upd_obj(o[i],o1[i])
				else
					if (o1[i]!=null && o!=null)
						if (o1[i]==undef) o[i]=undefined
						else if (o1[i]==del) delete o[i]
						else if (isOA(o1[i])) if (!isH(o1[i])) o[i]=clone(o1[i]); else o[i]=o1[i]
						else o[i]=o1[i]
			}
		}
	}

	function lookout_brothers(f,o){
		var i,oo;if (isF(o)) {i=o;o=f;f=i}
		for (i in o.parentNode.childNodes) {oo=o.parentNode.childNodes[i];if (oo.nodeType==1 && o!==oo) if (iff(f,oo,oo)===false) break}
	}
	function lookout_domObjs(f,o,l){var i,oo //,p=args(arguments),[f,o,l]=[p.F[0],p.H[0],p.N[0]]
// 		,a=args(arguments),[f,o,l]=[a.F[0],a.O[0],a.N[0]]
		if (!isN(l)) {l=0;if (!isH(o)) o=d.body}
		if (o.nodeType==1) {
			if (iff(f,o,l)===false) return false
			oo=o.childNodes
			for (i=0;i<oo.length;i++) {
				if (oo[i].nodeType==1) if (lookout_domObjs(f,oo[i],l+1)===false) return false
			}
		}
	}
	function transpose(m){
		if (!isA(m)) return false
		var mt=[],i,j
		for (i=0;i<m.length;i++)
			if (isA(m[i]))
				for (j=0;j<m[i].length;j++) {
					if (!isA(mt[j])) mt[j]=[]
					mt[j][i]=m[i][j]
				}
		return mt
	}
	function o2t(o){return st(o,0) //возвращает форматировнную копию объекта
		function st(o,l) { //рекурсивно форматирует object
			var i,lst=[],txt="",sp=l==0?"\t":ss("\t",l+1)
			for (i in o) {
				if (isO(o[i]) && ckpr(o[i])) lst.push(sp+i+' : '+st(o[i],l+1)) //сам object и есть потомки
				else if(isOA(o[i])) if (lkeys(o[i])>0) lst.push(sp+i+" : "+JSON.stringify(o[i])); else continue //потомков нет - переводим в текст, пустые игнорируем
				else if (o[i]) lst.push(sp+i+' : "'+grepl(o[i],"\n","\\n")+'"') //простое поле
			}
			for (i=0;i<lst.length;i++) {txt+=lst[i];if (i<lst.length-1) txt+=",";txt+="\n"}
			var ret="{\n"+txt+ss("\t",l)+"}"
			return "{\n"+txt+ss("\t",l)+"}"
		}
		function ckpr(o){for (var i in o) if (isO(o[i])) return true; return false}
	}
	function lookout_obj() {var n,ll=0,p=[]
		var a=args(arguments),[f,o,dbg]=[a.F[0],a.O[0],a.N[0]]
		n=0;st(f,o,0);return [p,n,ll+1]
		function st(f,o,l) {var i,rc
			if (ll<l) ll=l
			for (i in o) {
				if (!isA(p[n])) p[n]=[]
				p[n][l]=[i,o[i]]
				rc=iff(f,o,i,l,p,n++,ll)
				if (rc instanceof Error) {c.log("lookout_obj error:",rc);c.log(o);return rc}
				if (rc=="cancel") return "cancel";if (rc=="break") break;
				if (rc!="continue" && isO(o[i]) && st(f,o[i],l+1)=="cancel") return "cancel" //||isA(o[i])
			}
		}
	}
	function lookoutOn(o){for (var i in o) if (i!="children" && i!=plnk && isO(o[i]) && lkeys(o[i])>0 && o[i][plnk]==null) {o[i][plnk]=o;lookoutOn(o[i])}}

	function lookoutOff(o){for (var i in o) if (isO(o[i]) && o[i][plnk]!=null) {delete o[i][plnk];lookoutOff(o[i])}}
	function templating(dat) {var rc,ex=["mcount"] //обходим данные и делаем подстановки
		function chk(o,n){return valinobj(n,o.skip)!==false || n==plnk || n=="children" || n=="ch"}
		function proc(p){
			var rc,i,o=this,n
			if (p.indexOf("[[mcount]]")>=0) n=_eval(repl_tmpl(p,o,ex)); else n=_eval(repl_tmpl(p,o))
			if (p!=n) { //имя изменилось
				o[n]=o[p]; delete o[p]
				templating(dat);return "cancel" //сначала
			}
			if (chk(o,n)) return "continue"
			if (!isOA(o[n])) {
				if (isS(o[n])) if (o[n].indexOf("[[mcount]]")>=0) o[n]=repl_tmpl(o[n],o,ex); else  o[n]=repl_tmpl(o[n],o)
				o[n]=cnvt(o[n])
			}
			else if (isA(o[n])) for (i in o[n]) o[n][i]=repl_tmpl(o[n][i],o)
		}
		lookoutOn(dat)
		rc=lookout_obj(proc,dat)
		if (rc instanceof Error) {c.log(rc)}
		lookoutOff(dat)
		lookout_obj(function(p){var o=this
				if (isA(o[p])) o[p]=multia(o[p])
				else if (isO(o[p])) multio(p,o) //templating(dat);return "cancel" //сначала
				else if (isS(o[p])) o[p]=_eval(o[p],"EVAL")
		},dat)
		ex=null
		rc=lookout_obj(proc,dat)
		if (rc instanceof Error) {c.log(rc)}
	}

	function srch(name,o){var i=0,oo=o,f,r //поиск объекта с именем "name" от текущего (oo) наверх
		if (isO(o) && lkeys(o)>0) {
			while (isO(oo) && ++i<maxdeep) {
				if (oo[name]!=null && (!isS(oo[name]) || oo[name].indexOf("[["+name+"]]")==-1)) {r=oo[name];break} //found
				if (isO(oo[plnk])) {oo=oo[plnk];continue} //найдена ссылка на родителя, ищем у него рекурсивно
				oo=gO(oo.pname)
				if (!isH(oo) || !isO(oo.dat)) break
				oo=oo.dat
			}
		}
// 		if (r==null) try{r=eval(name)}catch(e){c.log(name,o,e.message); return}
		if (r==null) try{r=eval(name)}catch(e){}
		return r
	}

	function repl_tmpl(s,o,ex) {if (!isS(s)) return s
		var i,a,aa,r=s,fl,sep1="_[!{{|(_",sep2="-)|}}!]-"
		i=0; while (++i<maxdeep) { //поиск подстановок (текст, заключенный в спецсимволы
			a=sepstr(r,"[[","]]")
			if (!isA(a)) break //нет больше подстановок
			if (valinobj(a[1],ex)!==false) {r=a[0]+sep1+a[1]+sep2+a[2];fl=1;continue} //подмена
			if (a[1]==null) c.log(r)
			aa=srch(a[1],o)
			if (aa==null) {r=a[0]+sep1+a[1]+sep2+a[2];fl=1;continue}
			if (isOA(aa)) if (a[0]=="" && a[2]=="") return aa; else r=a[0]+JSON.stringify(aa)+a[2]
			else r=a[0]+aa+a[2]
		}
		if (fl){ //была подмена - восстанавливаем.
			i=0; while (++i<maxdeep) {
				a=sepstr(r,sep1,sep2); if (!a) break //нет больше подстановок
				r=a[0]+"[["+a[1]+"]]"+a[2]
			}
		}
// 		return r=="true"?true: r=="false"?false: !isNaN(r)?gnum(r):r //r=="NaN"?NaN:
		return r
	}

	function setdefdat(dat,def,l) {var i
		if (!l) {
			if (!dat.css) {dat.css={sh:defshad}}
			if (dat.def=="def") def=clone(defdat) //??
			if (!dat.props) dat.props={}
			if (!dat.children) if (isO(dat.ch)) dat.children=dat.ch; else dat.children={}
			if(!dat.tag) dat.tag="div"
			if (valinobj(dat.tag,app.preftags)!==false) {
				if (dat.props=="def") {dat.props=clone(defprops);if (!dat.css) dat.css=clone(randcss)} //как один из вариантов
				if (dat.css=="random") dat.css=clone(randcss)
				else if (!dat.css) {dat.css={};if (!lkeys(dat.props)>0) upd_obj(dat.css,randcss); else dat.css=clone(defcss)}
			}
			if (!def) def=isO(dat.def)?dat.def:clone(defdat)
			if (!dat.catchers) dat.catchers=[]; if (!dat.emitters) dat.emitters=[]
			if (isO(dat.css) && isA(dat.css.all)) for (i in cssall)	if (isA(dat.css.all) && dat.css.all[i]!=null && def.css[cssall[i]]!=dat.css.all[i]) delete def.css[cssall[i]]
		}
		for (i in def) {
			if (isO(def[i]) && isO(dat[i])) setdefdat(dat[i],def[i],1) //если оба объекты - вызываем рекурсивно
			else if (isO(def[i]) || dat[i]==null) dat[i]=def[i]
		}
	}
	function sepstr(s,dl1,dl2) {//возвращает массив: [<до dl1>,<между dl1-dl2(самые внутренние)>,<после dl2>]
		if (!isS(s)) return
		var i1=s.lastIndexOf(dl1),i2=s.substr(i1+dl1.length).indexOf(dl2)
		if (i1!=-1&&i2!=-1) return [s.substr(0,i1),s.substr(i1+dl1.length,i2),s.substr(i1+dl1.length+i2+dl2.length)]
	}
	function subst(s,v,s1,s2){var i,r=s,a //подмена подстроки МЕЖДУ разделителей (s1,s2) (извлекает имя из разделителей (s1,s2) и подставляет из словаря (v) значение)
		i=0; while (++i<maxdeep) {
			a=sepstr(r,s1,s2)
			if(a==null) break //больше нет разделителей
			r=a[0]+v[a[1]]+a[2]
		}
		return r
	}
	function init_obj(){
try{ // отладка
		var i,j,d0,op
		,p=args(arguments),[o,name,pname,fupd,finit,dat]=[p.H[0],p.S[0],p.S[1],p.F[0],p.F[1],p.O[0]]
		if (!isO(dat)) dat={props:"def",css:"random"}
		if (!isS(name)) { //name не задано
			if (isS(dat.name)) name=dat.name //но задано dat.name - используем его
				else if (isH(o) && o.id!="") name=o.id //не задано и dat.name, но объект существующий с "id", используем его id
		}
		if (!name) name=dat.name; if (!name) name=genname(); else if (name.indexOf("*")>-1) {
			let i,_s=name.split("*"),_n=_s.shift()
			for (i in _s) _n+="_"+genname(_s[i])
			name=_n
		} 
		name=_eval(name)
//имя уже задано, проверям объект
		while (valinobj(name,names)!==false) { //есть в словаре
			if (!isH(o) && !isH(gO(name))) break
			name=incstr(name) //не допускаем объектов с одинаковыми "id"
		}
// 		while (isH(gO(name))) name=incstr(name) //не допускаем объектов с одинаковыми "id", если он уже существует
		if (!isH(o)) o=gO(name)
		if (valinobj(name,names)===false) names.push(name)
		if (isS(pname)) dat.pname=pname; dat.pname=_eval(dat.pname)
		
		dat.name=name

		if (dat.replaceby) {
			dat.replaceby=repl_tmpl(dat.replaceby,dat)
			d0=clone(eval(dat.replaceby))
			upd_obj(d0,dat);dat=d0
		} else if (dat.clone) {
			dat.clone=repl_tmpl(dat.clone,dat)
			d0=clone(srch(dat.clone,dat))
			upd_obj(d0,dat);dat=d0
		}
		templating(dat) //шаблонизация
		if (isH(o)) {
			o.id=name
			if (!dat.css) {
				let [h,w]=gsO(o),[t,l]=gapO(o),bgc=gbcO(o)
				dat.css={all:[h,w,t,l,,,bgc]}
			}
			if (isO(o.dat)) upd_obj(o.dat,dat)
		} else setdefdat(dat) //установка умолчаний для несуц. объекта
			
		if (dat.sticky==null) dat.sticky=1
		if (iff(fupd,dat,dat)===false) return false

		dat.orig=clone(dat)
		if (!isH(o)) o=cO(dat.tag)

		op=gO(dat.pname)
		
		if(!isH(op)) {op=d.body;delete dat.pname}
		if (iff(finit,o,o,op)===false) return false
		acO(o,op)
		o.id=dat.name
		o.dat=dat;o.save={};o.state="";o.click=null //убираем нативный код
		o.kmin=isN(dat.kmin)?dat.kmin:kmin; o.kmax=isN(dat.kmax)?dat.kmax:kmax
		o.scaling_factor=1
		for (i in dat.attrs) o.setAttribute(i,dat.attrs[i])
		css(o,dat.css)
		o.caught=[]
		if (dat.value) if (valinobj(dat.tag,app.formtags)!==false) o.value=_eval(dat.value); else stO(o,_eval(dat.value))
		setgeom(o);reset_obj(o) //;setgeom(o)
		for (i in dat.children) {  //ii=_eval(i) //предобработка имен потомков, чтобы развернуть множ. поля и отформатировать имена
			j=repl_tmpl(_eval(i),dat)
			if (j!=i) {dat.children[j]=dat.children[i];delete dat.children[i]}
			multio(j,dat.children)
		}
		for (i in dat.children) init_obj(dat.children[i],i,o.id,fupd,finit) //2 прохода!
		if (dat.props.scrollable) set_scrlarea(o,fupd,finit)
		set_events(o,fupd,finit)
		if (isO(dat.func)) for (i in dat.func) if (isS(dat.func[i])) eval("o[\""+i+"\"]="+dat.func[i]); else if (isF(dat.func[i])) o[i]=dat.func[i]
// 		for (i in dat.func) o[i]=dat.func[i]
		setgeom(o)
		if (isN(o.dat.k0)) {o.w0*=o.dat.k0;o.h0*=o.dat.k0}
		return o
}catch(e){c.log("init_obj:",e)}
	}
	function setgeom(o) {//коррекция неправильной геометии if (isS(o)) o=gO(o)
		if (isH(o) && (o.style.position=="absolute" || o.style.position=="fixed")){
			var ms=gmsO(o),s=gsO(o),p=gpO(o)
			if (s[1]<=0) {css(o,{wi:"random"});o.w0=o.w=gnum(o.style.width)} else if (!isN(o.w0)) o.w0=o.w=s[1]
			if (o.dat.kp) o.h0=o.h=o.w*o.dat.kp; else if (s[0]<=0) {css(o,{he:"random"});o.h0=o.h=gnum(o.style.height)} else if (!isN(o.h0)) o.h0=o.h=s[0]
			if (!isN(o.t0))  {o.t0=o.t=gnum(o.style.top);if (!isN(o.t)) o.t0=o.t=p[0]}
			if (!isN(o.l0))  {o.l0=o.l=gnum(o.style.left);if (!isN(o.l)) o.l0=o.l=p[1]}
			if (ms[1]>o.w) ssO(o,null,o.w=ms[1])
			if (ms[0]>o.h) ssO(o,o.h=ms[0])
		}
	}
	function multia(o) {var st=0
	if (isA(o)) {
			var i,j,a,a1,s,n,r=[],f,f1,v,vs
			for (i=0;i<o.length;i++) {
				f1=0
				s=_eval(o[i])
				if (isS(s)) {
					a=s.split(msep)
					if (a.length==2) {
						a1=a[1].split("+");if (a1.length==2) st=gint(a1[1])
						a[1]=gint(a[1])
						if (a[1]>0) {for (j=st;j<a[1]+st;j++) {
							vs=v=a[0]+alnum(j,a[1])
							try {v=eval(v); if (!isN(v)) v=vs}catch(e){v=vs}
							r.push(v);f1=1}}
					}
				}
				if (f1==1) f=1; else r.push(o[i])
			}
			if (f) {
				o.splice(0,o.length)
				for (i=0;i<r.length;i++) o.push(r[i])
			}
		}
		return o
	}

	function multioo(o) {for (var i in o) multio(i,o)}
	function multio(n,o) {var i,nn,a
		if (isO(n)) {i=o;o=n;n=i}
		a=n.split(msep)
		if (a.length==2) {
			a[0]=_eval(a[0])
			a[1]=_eval(a[1])
			if (isN(a[1])) for (i=1;i<a[1]+1;i++) {
				nn=a[0]+alnum(i,a[1]) //имя
					o[nn]=clone(o[n])
					o[nn].mcount=i
			}
			delete o[n]
			return true
		}
	}

	function _eval(s,se,l) {if (!isS(s)||strip(s)=="") return s
		if (l==null) l=0;else l+=1
		if (se==null) se="eval"
		var i,a,sp1,sp2,__,_=s
		i=0; while (++i<maxdeep) {
			if (!isS(_) || _.indexOf(se)<0) break
			sp1=_.substr(_.indexOf(se)+se.length,1) //было 4
			if (ssym.indexOf(sp1)==-1) break
			sp2=!psym[sp1]?sp1:psym[sp1]
			a=sepstr(_,se+sp1,sp2); if (a==null) break
			if (!isS(a[1]) || a[1].indexOf(se)<0) {
				try {__=eval(a[1])}catch(e){break}
				if (!isO(__)) {
					if ((a[0]+__+a[2]).indexOf(_)>-1) {_=a[0]+"** "+a[1].toString()+" **"+a[2];break} //зацикливание
					else _=a[0]+__+a[2]
				} else {//eval вернул объект
					if (a[0]=="" && a[2]=="") return __
					else return a[0]+JSON.stringify(__)+a[2]
				}
			} else return eval(a[0]+_eval(a[1],se,l)+a[2])
		}
		return _=="true"?true: _=="false"?false: !isNaN(_)?gnum(_):_ //_=="NaN"?NaN:
	}
	function msg2catchers(o){var i,pco,po=gO(o.dat.pname),cid,co,ns,cau //вызывается после move_obj или resize_obj
//~ overlapping - перекрывающий, overlapped=перекрываемый
		for (i in o.dat.catchers) {
			cid=o.dat.catchers[i];co=gO(cid);pco=gO(co.dat.pname);cau=valinobj(co.id,co.caught)
			if (isH(co)) {
				ns=isover(o,co)
				if (co.stateover==null) co.stateover=ns //если 1 раз или ничего не изменилось, просто запоминаем состояние и уходим
				else if (co.stateover!=ns) {
					co.stateover=ns
					if(!ns && isN(cau)) {
						co.caught.splice(cau)
						iff(o.caughtoff,o,co)
						iff(co.catchoff,co,o)
						setattr(co,"catch","out")
						setattr(o,"caught","out")
					} else if (	ns && !isN(cau) &&
							o.id!=co.id && // исходный объект и catcher не один и тот же
							(!isH(po) || isH(po) && o.dat.pname!=co.id) && // родитель исходного не может быть catcher
							(!isH(pco) || isH(pco) && co.dat.pname!=o.id )) { // исходный не может быть родителем catcher
							co.caught.push(co.id)
							iff(o.caughton,o,co)
							iff(co.catchon,co,o)
							setattr(co,"catch","over")
							setattr(o,"caught","over")
					}
				}
			}
		}
	}
	function move_obj(o,dt,dl,e) {
// 		if (!e) e={ctrlKey:false}
		if (!isN(o.t) || !isN(o.l)) [o.t,o.l]=gpO(o)
		var ps=gpsO(o),lim,p=o.dat.props,t0=o.t,l0=o.l,t=o.t+dt,l=o.l+dl
		function vcorr(l1,l2){if (!e || !e.ctrlKey) if (o.h<ps[0]) {if (t<l1) t=l1; else if (t>ps[0]-o.h-l2) t=ps[0]-o.h-l2} else {if (t>l1) t=l1; else if (t+o.h<ps[0]-l2) t=ps[0]-o.h-l2}}
		function hcorr(l1,l2){if (!e || !e.ctrlKey) if (o.w<ps[1]) {if (l<l1) l=l1; else if (l>ps[1]-o.w-l2)l=ps[1]-o.w-l2} else{if(l>l1) l=l1; else if(l+o.w<ps[1]-l2) l=ps[1]-o.w-l2}}
		if (p.movable) {
			lim=isA(p.movable)?[_eval(p.movable[0]),_eval(p.movable[1]),_eval(p.movable[2]),_eval(p.movable[3])]:[0,0,0,0]
			if (o.h!=ps[0]) {vcorr(lim[0],lim[1]); if (t0!=t) poO(o,o.t=t)}
			if (o.w!=ps[1]) {hcorr(lim[2],lim[3]); if (l0!=l) poO(o, null, o.l=l)}
			if (t0==t && l0==l) return
		} else if (p.vmovable) {
			lim=isA(p.vmovable)?[_eval(p.vmovable[0]),_eval(p.vmovable[1])]:[0,0]
			if (o.h!=ps[0]){vcorr(lim[0],lim[1]); if (t0!=t) poO(o,o.t=t)}
			if (t0==t) return
		} else if (p.hmovable) {
			lim=isA(p.hmovable)?[_eval(p.hmovable[0]),_eval(p.hmovable[1])]:[0,0]
			if (o.w!=ps[1]) {hcorr(lim[0],lim[1]); if (l0!=l) poO(o, null, o.l=l)}
			if (l0==l) return
		} else return false //p.movable===false (временно отключен)
		if (t==t0 && l==l0) return //или положение не изменилось просто уходим
		msg2catchers(o)
		iff(o.move_also,o,t-t0,l-l0,e)
	}
	function resize_obj(o,dt,dl,e) {
		var ps=gpsO(o),i,p=o.dat.props
		,[h,w,h0,w0]=[o.h+dt,o.w+dl,o.h,o.w]
		,mh=gnum(o.style.minHeight),mw=gnum(o.style.minWidth)
		if (!isN(mh)) mh=minsz[0]; if (!isN(mw)) mw=minsz[1]
		if (o.kp>0) h=w*o.kp //пропорциональный resize (с соотношением o.kp)
		if (h<=ps[0]-o.t && h>=mh && (p.resizable || p.vresizable)) ssO(o,o.h=h)
		if (w<=ps[1]-o.l && w>=mw && (p.resizable || p.hresizable)) ssO(o,null,o.w=w)
		for (i in o.dat.resizing) reset_obj(o.dat.resizing[i])
		for (i in o.dat.resizing_all) reset_objs(o.dat.resizing_all[i])
		msg2catchers(o)
		iff(o.resize_also,o,o.h-h0,o.w-w0,e,o)
	}
	function args(p) {
		var i,r={F:[],N:[],S:[],B:[],A:[],I:[],H:[],E:[],O:[]} //Function, Number, Array, Object, String, HTML, Boolean, Event
		for (i in p) //порядок важен
				  if(isF(p[i])) r.F.push(p[i]) //Function
			else	if(isN(p[i]))r.N.push(p[i]) //Number
			else	if(isS(p[i]))r.S.push(p[i]) //String
			else	if(isB(p[i]))r.B.push(p[i]) //Boolean
			else	if(isA(p[i]))r.A.push(p[i]) //Array
			else	if(isI(p[i]))r.I.push(p[i]) //html <img>
			else	if(isH(p[i]))r.H.push(p[i]) //any html
			else	if(isE(p[i]))r.E.push(p[i]) //Error
			else	if(isO(p[i]))r.O.push(p[i]) //any Object
		return r
	}

	 function getTime(p) { //возвращает время в формате: ЧЧ/ММ/СС.ms
		var dt=new Date(),h=dt.getHours(),m=dt.getMinutes(),s=dt.getSeconds(),ms=dt.getMilliseconds()
		if (h<10) h="0"+h;if (m<10) m="0"+m; if (s<10) s="0"+s;
		return h+":"+m+":"+s+(p=="ms"?"."+ms:"")
	 }
	 function getDateYMD() { //возвращает время в формате: ГГГГ/ММ/ДД
		var d1900=(msie)?0:1900,dt=new Date(), y=dt.getYear()+d1900, m=dt.getMonth()+1, d=dt.getDate()
		if (d<10) d="0"+d;if (m<10) m="0"+m
		return gnum(y+""+m+""+d)
	 }
	 function getScrollPos() {
		if (w.pageYOffset||w.pageXOffset) return [w.pageYOffset,w.pageXOffset]
		if (d.documentElement && d.documentElement.scrollTop)return [d.documentElement.scrollTop,d.documentElement.scrollLeft]
		return [d.body.scrollTop,d.body.scrollLeft]
	 }
	function rgb2hex(rgb){var c=sepstr(rgb,"rgb(",")")[1].split(",");return "#"+d2x(c[0])+d2x(c[1])+d2x(c[2])} // rgb(r,g,b)-> #hhhhhh

	function setsel(o,v) {var s=o.style;s.userSelect=s.MozUserSelect=s.KhtmlUserSelect=s.WebkitUserSelect=s.MsUserSelect=s.OUserSelect=v}
	function fmt(s,p) {if (!isS(s)) return s;var ss="",C=[],D=[],R="",tab="	",sep=(p==null)?" ":p //форматирует строку, убирая внешние пробелы и лишние внутри
		for (var i=0;i<s.length;i++) if (s[i]==="	") ss+=" "; else ss+=s[i] //убираем табуляцию
		C=ss.split(sep)
		for (var i in C) if (C[i]!="") D.push(C[i])
		for (var i in D) {if (R!=="") R+=sep;R+=strip(D[i])}
		return R
	}
	function break_breath(o){ if (msie) return
		if (o.breath.h.state=="" && o.breath.w.state=="") return
		clearTimeout(o.breath.w.tm)
		clearTimeout(o.breath.h.tm)
		ssO(o,o.breath.h.height,o.breath.w.width)
		poO(o,o.breath.h.top,o.breath.w.left)
		o.breath.h.state="";o.breath.w.state=""
	}

	function stop_breath(o){
// 		clearInterval(o.tm.height)
// 		clearInterval(o.tm.width)
// 		o.h=o.h0;o.w=o.w0;o.t=o.t0;o.l=o.l0;ssO(o,o.h,o.w);poO(o,o.t,o.l) // restore geom
		o.state=""
	}
	function start_breath(o){ //if (msie) return
		o.state="breath"
		o.save.breath={h:o.h,w:o.w}
		breathing(o,"height",999,9) //,123,3
		breathing(o,"width",777,7) //,123,3
	}

	function breathing(o,pr,tm,dh){ f()
		function f(){animate(o,pr,dh=-dh,tm,f,function(){if (o.state!="breath") {var s=o.save.breath,[h,w,t,l]=[s.h,s.w,s.t,s.l];poO(o,o.t=t,o.l=l);ssO(o,o.h=h,o.w=w);return false}})}
	}

// try{}catch(e){c.log(e)}
	function animate() {
		var v,v0,N,dv,nm
		,p=args(arguments),[o,prop,dlt,time,next,also]=[p.H[0],p.S[0],p.N[0],p.N[1],p.F[0],p.F[1]] // dlt - величина, на которую надо изменить свойство
			if (!isS(prop) || !isN(dlt) || !isH(o)) return //bad params
			if (!isN(time)) time=comdelay
			N=time/fps //число итераций (с учетом fps... без последней)
			dv=dlt/N //величина изменения за 1 итерацию
			v=v0=gnum(o.style[prop]) //запомнили нач.значение
			nm="animate_"+o.id+"_"+prop
		function step(cnt) {
			if (cnt>=N || v+dv>=v0+dlt && dlt>0 || v+dv<=v0+dlt && dlt<0) {
				iff(also,o,v0+dlt-v,v,N) //остаток
				o.style[prop]=(v0+dlt)+"px" //точно установили
				if (prop=="height") o.h=v0+dlt; else if (prop=="width") o.w=v0+dlt; else if (prop=="top") o.t=v0+dlt; else if (prop=="left") o.l=v0+dlt
				setTimeout(function(){iff(next,o,v0+dlt)})
				return false
			} else {
				v+=dv
				if ((prop=="height" || prop=="width") && v<=0) {c.log("animate error: Iterate task \""+nm+"\": zero size reached. Exiting...");return false}
					o.style[prop]=v+"px"
				if (iff(also,o,dv,v,N)===false) return false
			}
		}
		iterate(nm,step,fps)
		return N
	}

	function anim_obj() { //величина, на которую надо изменить свойство
		c.log("function anim_obj is deprecated")
		var p=arg2ar(arguments);if (isH(gO(p[0])) && valinobj(p[0],names)) p[0]=gO(p[0])
		var v,v0,N,cnt=0,dv,i
			,p=args(p),[o,prop,dlt,time,next,also]=[p.H[0],p.S[0],p.N[0],p.N[1],p.F[0],p.F[1]]
			if (!isS(prop) || !isN(dlt) || !isH(o)) return //bad params
			if (!isN(time)) time=comdelay
// c.log("anim",o.id,prop,dlt,time,next,also)
			N=time/fps //число итераций (с учетом fps... без последней)
			dv=dlt/N //величина изменения за 1 итерацию
// 		if (!o.animstate) o.animstate={}; if (o.animstate[prop]=="busy") return; o.animstate[prop]="busy"
		if (!o.tm) o.tm={} //if (!time) time=comdelay
		if (o.tm[prop] != null) clearInterval(o.tm[prop])
			v=v0=gnum(o.style[prop]) //запомнили нач.значение
		function step() {
		if (cnt>=N || v+dv>=v0+dlt && dlt>0 || v+dv<=v0+dlt && dlt<0) {
				clearInterval(o.tm[prop]) //;o.animstate[prop]=""
				iff(also,o,v0+dlt-v,v,N) //остаток
				o.style[prop]=(v0+dlt)+"px" //точно установили
				if (prop=="height") o.h=v0+dlt; else if (prop=="width") o.w=v0+dlt; else if (prop=="top") o.t=v0+dlt; else if (prop=="left") o.l=v0+dlt
				iff(next,o,v0+dlt)
			} else {cnt++;v+=dv
				if ((prop=="height" || prop=="width") && v<0) v=0
				o.style[prop]=v+"px"
				if (iff(also,o,dv,v,N)===false) {cnt=N;step()}
			}
		}
		o.tm[prop]=setInterval(step,fps)
		return N
	}
	function fadeout() {
		var p=args(arguments),[o,no,time,next]=[p.H[0],p.S[0],p.N[0],p.F[0]]
		if (isS(no)) o=gO(no); if (!isH(o)) return false
		var eo,dlt,nmo=o.id+"_fadeout",nmi=o.id+"_fadein",co=o.dat.css.opaque;if (!co) co=100
		if (isO(tasks[nmo])) iterate(nmo);if (isO(tasks[nmi])) iterate(nmi)
		if (!time) time=comdelay
		dlt=co/time*fps
		sopO(o,co);show(o)
		iterate(nmo,function(){if ((co-=dlt)<0) {sopO(o,0);hide(o);iff(next,o,o);return false}; sopO(o,co)},fps)
	}
	function fadein(){
		var p=args(arguments),[o,no,time,next]=[p.H[0],p.S[0],p.N[0],p.F[0]]
		if (isS(no) && !isH(o)) o=gO(no); if (!isH(o)) return false
		var co,dlt,nmo=o.id+"_fadeout",nmi=o.id+"_fadein",eo=o.dat.css.opaque;if (!eo) eo=100
		if (isO(tasks[nmo])) iterate(nmo);if (isO(tasks[nmi])) iterate(nmi)
		if (!time) time=comdelay
		dlt=eo/time*fps
		sopO(o,co=0);show(o)
		iterate(nmi,function(){if (eo<(co+=dlt)) {sopO(o,eo);iff(next,o,o);return false}; sopO(o,co)},fps)
	}

	function setcurobj(o) {if (isS(o)) o=gO(o)
		if (curobj==o) return true//тот же - ничего не делаем
		if (isH(curobj)) { //есть какой-то текущий. !o
			if (iff(curobj.rstcurobj,curobj,o)===false) return false //пытаемся выполнить "привязанную" rstcurobj
			if (!curobj.dat.sticky && curobj.save.zi>0 && curobj.save.zi<zindexTop) sziO(curobj,curobj.save.zi) //восстановили z-index
		}
		if (isH(o)) {
			if (iff(o.setcurobj,curobj,o)===false) return false //пытаемся выполнить "привязанную" setcurobj
			o.save.zi=o.style.zIndex // запомнили для восстановления
			if (!o.dat.sticky && o.style.zIndex>0 && o.style.zIndex<zindexTop) sziO(o,zindexTop)
			curobj=o
		} //else {curobj=null}
	}

	function tryttlclear(o){try{clearTimeout(o.ttlsmodetm);clearTimeout(tooltip2.showtm)}catch(e){}}
	function hidetitle(){clearTimeout(ottl.tm);fadeout(ottl); fadeout(oscr);ottl.sst="";setcurobj(ottl.save.curobj)} // return false}
	function showtitle() {
		ottl.t=app.mouse.t-ottl.h/2;ottl.l=app.mouse.l-ottl.w/2
		if (ottl.t<0) ottl.t=0; else if (ottl.t>app.hw-ottl.h) ottl.t=app.hw-ottl.h
		if (ottl.l<0) ottl.l=0; else if (ottl.l>app.ww-ottl.w) ottl.l=app.ww-ottl.w
		poO(ottl,ottl.t,ottl.l)
		stretch(otcnt,otcnt.dat.props.stretchable)
		fadein(oscr)
		fadein(ottl)
		ottl.sst="shown";ottl.save.curobj=curobj
		setcurobj(ottl)
		ottl.tm=setTimeout(hidetitle,showtime) //запуск затухания тайтла
	}
	function stopttl(o){
		if(isO(o.dat) && o.dat.ext_title!=null) if (ottl.sst=="start" || ottl.sst=="shown") {clearTimeout(ottl.tm);hide(ottl);ottl.sst=""}
	}
	function tryttlsover(o){
// c.log("tryttlsover",o.id,ottl.id,ottl.sst)
		if (ottl.sst!="start" && ottl.sst!="shown") {
			clearTimeout(ottl.tm)
		   ottl.sst="start"
		   stO(otcnt,setlangmsg(o.dat.ext_title))
		   ottl.tm=setTimeout(function(){showtitle(o)},longdelay)
		}
	}
	function tryttlsout(o){if (!o.dat.ext_title) return
		if (ottl.sst=="start") {ottl.sst="";clearTimeout(ottl.tm)}
	}
	function xchgobjs() {//"o" send "data" to listeners in list "lstn"
		var p=args(arguments),[o,data,lstn]=[p.H[0],p.O[0],p.A[0]]
		,ol, n, eo, j, em
		try {
			for (i in lstn) {ol=gO(lstn[i]) //обходим массив слушателей
				if (isH(ol)) {//есть такой получатель?
                    em=ol.dat.emitters
                    if (valinobj(o.id,keys(em))!==false) {
                        eo = eval(em[o.id])
                        if (isF(eo)) {iff(eo,ol,o,data)}
                        else if (eo instanceof Event) {eo.data=[ol,o,data];ol.dispatchEvent(eo)}
                    }
                }
			}
		}catch(e){c.log("xchgobjs error:",o);c.log(e)} //изолируем ошибку
	}
	function setico(o,p) {
		if (!isN(p.m) || !isN(p.n) || !isN(p.h) && !isN(p.h1) || !isN(p.w) && !isN(p.w1)) {c.log("Some parameters are missing",p);return}
		if (!isN(p.h)) p.h=p.h1*p.m; else if (!isN(p.h1)) p.h1=p.h/p.m  //если не задан размер полотна или картинки - вычисляем
		if (!isN(p.w)) p.w=p.w1*p.n; else if (!isN(p.w1)) p.w1=p.w/p.n
		if (!isN(p.c)) p.c=0;if (!isN(p.r)) p.r=0 //умолчания для rows, cols
		if (!isN(p.tof)) p.tof=0; if (!isN(p.lof)) p.lof=0 //смещения иконки внутри места
		if (!isN(p.h0)) p.h0=p.h1; if (!isN(p.w0)) p.w0=p.w1

		var s=gsO(o), kh=s[0]/p.h0, kw=s[1]/p.w0 //соотношение размера места и размера объекта со знаком
		sbiO(o,p.u);sbrO(o,"no-repeat")
		sbsO(o,[p.h*kh,p.w*kw])
		sbpO(o,[(p.tof-p.r*p.h1)*kh,(p.lof-p.c*p.w1)*kw])
	}

	function setattr(o,t,t1,of){if (!of) of=o
		try{
			for (var ch in of.dat[t][t1]) {
				css(gO(ch),of.dat[t][t1][ch].css) //пока только устанавливаем css
		}}catch(e){}
	}

	function chkspecobj(nm){return valinobj(li(nm.split("_")),["min","max","close","resize","hdr","mnu"])!==false} //проверка, является объект с именем "nm" служебным
	function chktmpl(nm){return nm.indexOf(app.tmplpref)==0 && !chkspecobj(nm)}
	function set_events(o,fupd,finit){// ,fupd,finit - functions from init_obj
		function chkbusy(state,e,co){
			return chkcas(e)!==false // что-то управляющее нажато 
			|| app.state!="ok" // состояние приложения не "ok"
			|| e.button>0  //не левая кнопка мыши
			|| o.state=="process" //объект в состоянии обработки
			|| e.target.id=="" //left obj (no id)
// 		|| !isO(e.target.dat) //чужой объект
			|| e.target!=co 
				&& (!isO(o.dat[state]) || isA(o.dat[state].share) && valinobj(e.target.id,o.dat[state].share)===false) // проверка, что объекту разрешено разделять событие
		}
		var i,om,bs,o4s,n4s,co,p=o.dat.props,nm=o.dat.name,andl=shortdelay,ps,mins=o.dat.icosize,dat
		if (!isA(mins)) mins=minszico
		function getco(o,t){var co;try{co=gO(o.dat[t].catchid);if (isH(co)) return co}catch(e){};return o}
		function free(o,state){setattr(o,state,"up"); o.state=""}
		function reset(e){
			reset_objs(o);
			if (p.resizable || p.vresizable || p.hresizable) {
				for (i in o.dat.resizing) reset_obj(gO(o.dat.resizing[i]))
				for (i in o.dat.resizing_all) reset_objs(gO(o.dat.resizing_all[i]))
				iff(o.after_resize,o,e)
			}
		}

		function setmousedown(state,e,co) {
			if (chkbusy(state,e,co)) return false
			clearTimeout(o.tmup) //отсчет отслеживания двойного клика
			ps=gpsO(o); stopttl(co)
			if (p.breathable===true) stop_breath(o)
			setattr(o,state,"down")
			if (o.state!="longclick" && o.state!="process") o.state=state
			switch (state){
				case "move":
					o.state="down"
					o.tmdown=setTimeout(function(){o.state="longclick";iff(o.longclick,o,e,state,co);o.state=""},longdelay)
					o.tmmidelay=setTimeout(function(){o.state=""},comdelay)
					o.tmmove=setTimeout(function(){//микрозадержка, чтобы начать движение, т.е. присвоить ф-ю движеие
						if(app.state=="ok") {
// 					if (o.dat.sticky!==0)
							setcurobj(o)
							o.mousemove=function(e){ //вызывается d.onmousemove
								if (p.movable===false) return false
								if (o.state=="down") {
									clearTimeout(o.tmmidelay);clearTimeout(o.tmdown) //начали движени - сбрасываем длинный клик и случайное нажатие
									if (iff(o.before_move,o,e)===false) {o.mousemove=null;o.state="";return false}
									scO(d.body,"move");o.state="move" //курсор и state
									setsel(o,'none')
								}
								move_obj(o,app.mouse.dt,app.mouse.dl,e)
//                         return false
							}
						}
					},mdelaym) //если за время mdelaym не начато движение, нажатие расценивается как клик
// 				return false // skip native code
					break
				case "resize":
					o.state="down"
					o.tmmove=setTimeout(function(){//микрозадержка, чтобы начать движение, т.е. присвоить ф-ю движеие
						if (iff(o.before_resize,o,e)===false) return false
						o.mousemove=function(e){scO(d.body,cursrsz);o.state="resize";resize_obj(o,app.mouse.dt,app.mouse.dl,e)}
						setcurobj(o);setsel(o,'none')
					},mdelaym)
					break

			case "press":
				if(isF(o.longclick)) o.tmdown=setTimeout(function(){o.state="longclick";iff(o.longclick,o,e,state,co);o.state=""},delaylclick)
				break
			case "max":
				if (iff(o.before_max,o,e)===false) return false
				om=gO(nm+"_max")
				if (o.ssz=="norm") {
					bs=gbsO(om);sbsO(om,"80%");sbpO(om,"bottom left")
					o.save.geom=[o.h,o.w,o.t,o.l,o.style.minHeight,o.style.minWidth] //сохранили  размеры и положение
					animate(o,"left",-o.l,andl)
					animate(o,"top",-o.t,andl);
					animate(o,"height",ps[0]-o.h-2,andl)
					animate(o,"width",ps[1]-o.w-2,andl,function(){if (iff(o.after_max,o)===false) return false;reset()})
					o.ssz="max"
				} else if (o.ssz=="max") {
					animate(o,"height",o.save.geom[0]-o.h,andl);animate(o,"width",o.save.geom[1]-o.w,andl)
					animate(o,"top",o.save.geom[2],andl);animate(o,"left",o.save.geom[3],andl,function(){if (iff(o.after_max,o)===false) return false;reset()})
					css(om,om.dat.css);o.ssz="norm"
				} else {//из min
					animate(o,"height",o.save.geom[0]-o.h,andl);animate(o,"width",o.save.geom[1]-o.w,andl)
					animate(o,"top",+o.save.geom[2]-o.t,andl);animate(o,"left",o.save.geom[3]-o.l,andl,function(){if (iff(o.after_max,o)===false) return false;reset()})
					o.style.minHeight=o.save.geom[4]; o.style.minWidth=o.save.geom[5]
					css(om,om.dat.css);show(gO(nm+"_min"));setattr(om,"focus","out");o.ssz="norm"
				}
				break

			case "min":
				if (iff(o.before_min,o,e)===false) return false
				if (o.ssz=="norm") o.save.geom=[o.h,o.w,o.t,o.l,o.style.minHeight,o.style.minWidth]
				o.style.minHeight=mins[0]+"px";o.style.minWidth=mins[1]+"px"
				animate(o,"height",mins[0]-o.h,andl)
				animate(o,"width",mins[1]-o.w,andl)
				animate(o,"top",ps[0]-o.t-mins[0]-2,andl,function(){if (iff(o.after_min,o)===false) return false})
				hide(gO(nm+"_min"))
				o.ssz="min"
				break

			case "close":
				if(iff(o.before_close,o,e)===false) return false //false не дает закрыть стандартно
				if (isF(o.close)) {if (iff(o.close,o,e,state,co)===false) return false}
// 				else fadeout(o,o.dat.fadetime,function(){if (iff(o.close_also,o,e)!==false) dO(o)})
				break
			}
			//if (o.dat.tag=="img") return false // если <img> не передавать дальше
			//return false
		}
		function setmouseup(state,e,co) {
			if (chkbusy(state,e,co)) return false
			if (o.state=="move") {let _=e.target; if (!isO(_.save)) _.save={}
				_.save.onclick=_.onclick;_.onclick=()=>false
				setTimeout(()=>_.onclick=_.save.onclick)
			}
			clearTimeout(o.tmmidelay);clearTimeout(o.tmdown);clearTimeout(o.tmmove);o.mousemove=null
			if (o.state=="longclick") {iff(o.pressfree,o);return}
			 if (state=="press" || state=="move" && o.state=="down") { //было нажатие, но не было начато движени
				if (isF(o.click)) {
					if (o.nclick=!o.nclick) { //для различения одинарного и двойного клика!
						o.tmup=setTimeout(function(){
							setattr(o,"press","process");o.state="process"
							o.nclick=0
							if (iff(o.click,o,e,state,co)===false) return false

							if (o.state!="process") iff(o.pressfree,o) //; else c.log(o.pressfree.toString(),free.toString())
						},mdelayc)
					}
					return
				}
			} else if (o.state=="resize") {
				if (p.resizable===false) return false //для временного отключения
				if (iff(o.after_resize,o,e,state,co)===false) return false
				for (var i in o.dat.resizing_end) reset_obj(gO(o.dat.resizing_end[i]))
				for (var i in o.dat.resizing_all_end) reset_objs(gO(o.dat.resizing_all_end[i]))
			} else if (o.state=="move") { //было движение
				if (p.movable===false) return false
				if(iff(o.after_move,o,e,state,co)===false) return false
			}
			setattr(o,state,"up")
			o.state=""
			if (p.focusable) setattr(o,"focus","out")
// 			if (state=="move" || state=="resize") setsel(o,'text')
		}
		function setmouseover(state,e,co){
// 			if (state=="focus" && !p.focusable) return false
			if(o.dat.ext_title) tryttlsover(o)
			if (o.state!="process") {
				setattr(o,state,"over")
				if (iff(o.over_also,o,e,state,co)===false) return false
				if (state=="breath" && o.state!="busy") {
					start_breath(o)
					setattr(o,"breath","over")
				}
			}
		}
		function setmouseout(state,e,co){
			tryttlsout(o) //===false) return false
			if (o.state!="process") {
				setattr(o,state,"out")
				if (iff(o.out_also,o,e,state,co)===false) return false
				if (state=="breath") {
					setattr(o,"breath","out")
					stop_breath(o)
				}
			}
		}
		if (p.movable!=null || p.vmovable!=null || p.hmovable!=null) { // перемещаемый
			co=getco(o,"move")
			co.onmousemove=function(e) {return false} //на случай тега <img> o.tagName="img"
			co.onmousedown=function(e) {return setmousedown("move",e,this)}
			co.onmouseup=  function(e) {return setmouseup("move",e,this)}
		}
 		if (isB(p.pressable) || o.dat.tag=="button") {//нажимаемый
			co=getco(o,"press")
			if (!isF(o.pressfree)) o.pressfree=function(){
				if (isN(co.delayfree)) setTimeout(function(){free(o,"press")},co.delayfree)
				else free(o,"press")
			}
			if (!isF(co.onmouseout)) co.onmouseout=free //чтобы кнопка не осталась нажатой, когда потерян фокус
			if (!p.movable) {
				co.onmousedown=function(e){return setmousedown("press",e,this)}
				co.onmouseup=  function(e){return setmouseup("press",e,this)}
				co.onclick=null
			}
		}
		if (isB(p.maximizable)) {// распахиваемый
			if (o.dat.maximize) co=getco(o,"maximize"); else { //если не задан catcher для изменения размера, создадим свой по-умолчанию
				co=gO(nm+"_max")
				if (co==null) {
					var dat=clone(close_dat);upd_obj(dat,max_upd)
					if (isA(p.maximizable)) upd_obj(dat.css.all,p.maximizable)
					co=init_obj(dat,nm+"_max",nm,fupd,finit)
					o.ssz="norm"
					if (isS(app.max_img) && gbiO(co)=="") sbiO(co,app.max_img);else stO(co,specsym.max)
					if (gnum(o.style.zIndex)>0) co.style.zIndex=gnum(o.style.zIndex)+1
					co.onmousedown=function(e) {return setmousedown("max",e,this)}
					o.dat.children[nm+"_max"]=dat
				}
			}
		}
		if (p.minimizable) {// сворачиваемый
			if (o.dat.minimize) co=getco(o,"minimize");else {
				co=gO(nm+"_min"); if (co==null) {
					var dat=clone(close_dat);upd_obj(dat,min_upd)
					if (isA(p.minimizable)) upd_obj(dat.css.all,p.minimizable)
					co=init_obj(dat,nm+"_min",nm,fupd,finit)
					if (isS(app.min_img) && gbiO(co)=="") sbiO(co,app.min_img);else stO(co,specsym.min)
					if (gnum(o.style.zIndex)>0) co.style.zIndex=gnum(o.style.zIndex)+1
					co.onmousedown=function(e) {return setmousedown("min",e,this)}
					o.dat.children[nm+"_min"]=dat
				}
			}
		}
		if (p.closable) {// закрываемый
			if (o.dat.close) co=getco(o,"close");else {
				co=gO(nm+"_close"); if (co==null) {
					var dat=clone(close_dat)
					if (isA(p.closable)) upd_obj(dat.css.all,p.closable)
					co=init_obj(dat,nm+"_close",nm,fupd,finit)
					if (isS(app.close_img) && gbiO(co)=="") sbiO(co,app.close_img);else stO(co,specsym.close)
					if (gnum(o.style.zIndex)>0) co.style.zIndex=gnum(o.style.zIndex)+1
					co.onmousedown=function(e) {return setmousedown("close",e,this)}
					o.dat.children[nm+"_close"]=dat
					if (!isF(o.close)) o.close=function(){fadeout(o,o.dat.fadetime,function(){if (iff(o.close_also,o)!==false) dO(o)})}
				}
			}
		}
		if (p.resizable || p.vresizable || p.hresizable) {//изменяемый размер
			if (o.dat.resize) co=getco(o,"resize");else {
				co=gO(nm+"_resize"); if (co==null) {
					var dat=clone(resize_dat)
					if (isA(p.resizable)) upd_obj(dat.css.all,p.resizable)
					co=init_obj(dat,nm+"_resize",nm,fupd,finit)
					if (isS(app.resize_img) && gbiO(co)=="") sbiO(co,app.resize_img);else {stO(co,specsym.resize);css(co,{all:[co.h,co.w,,,0,0]})}
					if (o.style.minHeight=="") o.style.minHeight=minsz[0]+"px"
					if (o.style.minWidth=="") o.style.minWidth=minsz[1]+"px"
					if (gnum(o.style.zIndex)>0) co.style.zIndex=gnum(o.style.zIndex)+1
					co.onmousedown=function(e) {return setmousedown("resize",e,this)}
					co.onmouseup=function(e) {return setmouseup("resize",e,this)}
					if (!o.dat.children) o.dat.children={}
					o.dat.children[nm+"_resize"]=dat
				}
			}
		}

		if (p.focusable) {// выделяемый при наведении
			co=getco(o,"focus")
			co.onmouseover=function(e) {return setmouseover("focus",e,this)}
			co.onmouseout=function(e) {return setmouseout("focus",e,this)}
		}
		if (p.breathable) {// воздушный
			co=getco(o,"breath")
			o.breath={"h":{},"w":{}} //;o.ks=1
			sbsO(o,"cover")
			co.onmouseover=function(e) {return setmouseover("breath",e,this)}
			co.onmouseout=function(e) {return setmouseout("breath",e,this)}
		}

		var kp=p.parallaxable
		if (kp) {o.onmousemove=function(e) {// параллаксируемый
				var bp=gbpO(o) // o=this,kp=p.parallaxable
				if (o.state=="" && kp!==false) {
					if (iff(o.before_parallax,o,o,app.mouse.dt,app.mouse.dl,e)===false) return false
					sbpO(o,[bp[0]+app.mouse.dt/kp,bp[1]+app.mouse.dl/kp])
					iff(o.parallax_also,o,o,app.mouse.dt/kp,app.mouse.dl/kp,e) //,"parallax")
				}
			}
		sbpO(o,[0,0]);sbrO(o,"")
		}

		if (p.scalable) { //масштабируемый
			co=getco(o,"scale")
c.log("scal!",co,o)
// c.log("scal!",co,o)
			co.onwheel=function(e){
			if (co!=e.target) return
				var [d,ot]=mwheel(e)
				,k,p=o.dat.props
				if (isO(p)) k=p.scalable;if (!isN(k)) k=step_scaling
				if (isO(ot.dat) && ot.dat.name != o.dat.name && ot.dat.props.scalable) return
				return scale_obj(o,k*d,e)
			}
		}

		if (p.keypressable) {
			o.___keyup___=o.___keydown___=o.___keypress___=keyproceed
			if (!isO(o.dat.keystrokes)) o.dat.keystrokes={list:[],pars:{}}
			o.setcurobj=actlstitem
			o.rstcurobj=function(o){actlstitem(curobj,1)}
		}
		if (p.connectable) {
			if (!isO(o.connector)) o.connector=ctnO()
			if (!isO(o.connector.owner)) o.connector.owner=o
			if (!isF(o.fresult)) o.fresult=function(dat){atO(o,(isS(dat)?dat:JSON.stringify(dat)) + "<br>")}
			if (!isF(o.fconnect)) o.fconnect=app.fconnect
			app.mutobs.observe(o.connector, {characterData: true})  //app.mutobs.disconnect()
		}
	}
	function actlstitem(o,s){var p=o.dat.keystrokes.pars,o0=gO(p.list[0]);css(o0,p[!s?"active":"unactive"].css)} //подсветка или ее снятие 0 элемента
	function keylstchg(o,n) {var i,l=o.dat.keystrokes.pars.list;for (i=0;i<l.length;i++) {if (l[0]==n) break;actlstitem(o,1);l.unshift(l.pop());actlstitem(o)}}
	function mwheel(e){var d,v
		e = e || w.event
		if (e.wheelDelta) v=e.wheelDelta;else v=-e.deltaY
		if (v==120||v==-120) d=v/120;else if (v==80 || v==-80) d=v/80;else d=-e.deltaY/3
		return [d<0?-1:1,msie?e.srcElement:e.target]
	}

	function repleval(p){
		if (!isA(p)) return p==null?true:isB(p)?p:_eval(p)
		var i,r=[]
		for (i=0;i<p.length;i++) r[i]=_eval(p[i])
		return r
	}
	function align(o,p) {
		var ps=gpsO(o) //p - 2 числа смещение сверху и слева
		,p0=repleval(p); if (p0===true) p0=[0,0]
		try {o.t0=o.t=(ps[0]-o.h)/2+p0[0];o.l0=o.l=(ps[1]-o.w)/2+p0[1];poO(o,o.t,o.l)}catch(e){c.log(p);c.log(e)}
		return o
	}
	function valign(o,p) {var ps=gpsO(o) //p - число смещение сверху
		,p0=repleval(p); if (p0===true) p0=0
		try {o.t0=o.t=(ps[0]-o.h)/2+p0;poO(o,o.t)}catch(e){c.log(e)}
		return o
	}
	function halign(o,p) {var ps=gpsO(o) //p - число смещение слева
		,p0=repleval(p); if (p0===true) p0=0
		try {o.l0=o.l=(ps[1]-o.w)/2+p0;poO(o,null,o.l)}catch(e){c.log(e)}
		return o
	}
	function stretch(o,p) {var ps=gpsO(o) //p - 4 числа отступы сверху, снизу, слева, справа
		,p0=repleval(p); if (p0===true) p0=[0,0,0,0]
		o.h0=o.h=ps[0]-p0[0]-p0[1];o.w0=o.w=ps[1]-p0[2]-p0[3];o.t0=o.t=p0[0];o.l0=o.l=p0[2];poO(o,o.t,o.l);ssO(o,o.h,o.w)
		return o
	}
	function vstretch(o,p) {var ps=gpsO(o) // Растягикание по вертикали, p - 2 числа: отступы сверху, снизу
		,p0=repleval(p); if (p0===true) p0=[0,0]
		o.h0=o.h=ps[0]-p0[0]-p0[1];o.t0=o.t=p0[0];poO(o,o.t);ssO(o,o.h)
		return o
	}
	function hstretch(o,p) {var ps=gpsO(o) //Растягикание по горизонтали, p - 2 числа: отступы слева, справа
		,p0=repleval(p); if (p0===true) p0=[0,0]
		o.w0=o.w=ps[1]-p0[0]-p0[1];o.l0=o.l=p0[0];poO(o,null,o.l);ssO(o,null,o.w)
		return o
	}
	function reset_obj(o) {if (isS(o)) o=gO(o); if (!isH(o)) return //|| !isO(o.dat))
		try{
			if (iff(o.before_reset,o,o)===false) return false
			var r,p=o.dat.props
			if (p.aligned) align(o,p.aligned); if (p.valigned) valign(o,p.valigned); if (p.haligned) halign(o,p.haligned)
			if (p.stretchable) stretch(o,p.stretchable);
			if (p.vstretchable) vstretch(o,p.vstretchable)
			if (p.hstretchable) hstretch(o,p.hstretchable)
			if (p.css) {css(o,p.css);o.h0=o.w0=o.t0=o.l0=null}
			if (p.value) {
				o.dat.value=_eval(p.value)
				r=sepstr(o.dat.value,"{{","}}")
				if (r!=null && app.msgs[r[1]]!=null) stO(o,r[0]+app.msgs[r[1]]+r[2])
			}
			setgeom(o)
			return iff(o.reset_also,o,o)
		}catch(e){c.log(o,p);c.log("error reset_obj:",e)}
		return o
	}

	function reset_objs(o){
		if (isS(o)) o=gO(o);if (!isH(o) || !isO(o.dat)) return
		if (reset_obj(o)===false) return false
		for (var i in o.childNodes) reset_objs(o.childNodes[i])
	}
	function reset_objs_all(){var i,oo;for (i in d.body.childNodes) {oo=d.body.childNodes[i];if (oo.nodeType==1 && isO(oo.dat)) reset_objs(oo)}}
	function corr_scrlarea(o) {if (isS(o)) o=gO(o);corrocscrl(o);set_rscrl(o);set_bscrl(o)}
	function chkcont() {
		var p=args(arguments),[s,sc,sl,kp]=[p.A[0],p.A[1],p.A[2],p.N[0]]
		if (!isA(s) || !isA(sc)) return //отсутствуют 2 обязательных набора (массива): [h,w,t,l] окна и [hс,wс,tс,lс] контейнера
		if (!isA(sl)) sl=[0,0,0,0] //лимиты сверху, снизу, слева, справа
		var  [h,w,t,l]=s,[hc,wc,tc,lc]=sc,[lt,lb,ll,lr]=sl
//новые размеры
		if (wc<w) {wc=w;if (kp) hc=wc*kp}
		if (hc<h) {hc=h;if (kp) wc=hc/kp}
//новое положение
		if (lc>ll) lc=ll; else if (lc<w-wc-lr) lc=w-wc-lr
		if (tc>lt) tc=lt; else if (tc<h-hc-lb) tc=h-hc-lb
		return [hc,wc,tc,lc]
	}
	function corrocscrl(o,lim){
		var oc=gO(o.id+"_container"),kp=oc.dat.kp,bs=gbsO(oc)
		var [h,w,t,l]=chkcont([o.h,o.w,o.t,o.l],[oc.h,oc.w,oc.t,oc.l],lim,kp) //оценили
		if (w!=oc.w || h!=oc.h) {
// 			if (oc.dat.z && kp) {reorg_attrs_obj(oc,w/oc.w);reorg_children(oc,w/oc.w)}
			if (isN(kp)) {reorg_attrs_obj(oc,w/oc.w);reorg_children(oc,w/oc.w)}
			if (isA(bs)) sbsO(oc,[h,w])
			ssO(oc,oc.h=h,oc.w=w)
		}
		if (oc.l!=l) poO(oc,null,oc.l=l)
		if (oc.t!=t) poO(oc,oc.t=t)
	}
	function set_rscrl(o){var osr=gO(o.dat.name+"_rscrl"),osra=gO(o.dat.name+"_rscrlarea"),oc=gO(o.dat.name+"_container")
		if (isH(osr) && osr.dat.props.vmovable){
			if(oc.h<=o.h) hide(osra); else {
				show(osra)
				vstretch(osra,osra.dat.props.vstretchable) //растянули область скрулбара
				osr.h=o.h/oc.h*osra.h
				if (osr.h<sbmin) osr.h=sbmin; ssO(osr,osr.h) //размер скрулбара
				osr.t=(osr.h-osra.h)/(oc.h-o.h)*oc.t
				if (osr.t<0) osr.t=0; else if (osr.t>osra.h-osr.h) osr.t=osra.h-osr.h
				poO(osr,osr.t)
			}
		}
	}
	function set_bscrl(o){var osb=gO(o.dat.name+"_bscrl"),osba=gO(o.dat.name+"_bscrlarea"),oc=gO(o.dat.name+"_container")
		if (isH(osb) && osb.dat.props.hmovable){
			if (oc.w<=o.w) hide(osba); else {
				show(osba)
				hstretch(osba,osba.dat.props.hstretchable)
				osb.w=o.w/oc.w*osba.w
				if (osb.w<sbmin) osb.w=sbmin; ssO(osb,null,osb.w)
				osb.l=(osb.w-osba.w)/(oc.w-o.w)*oc.l
				if (osb.l<0) osb.l=0; else if (osb.l>osba.w-osb.w) osb.l=osba.w-osb.w
				poO(osb,null,osb.l)
			}
		}
	}
	function scale_obj() {//точка сжатия/растяжения - либо мышь, либо центр (Если e - не событие). k - коеф.приращение
		var p=args(arguments),[im,o,k,e,ae]=[p.I[0],p.H[0],p.N[0],p.E[0],p.A[0]] //o,k обязательны
		if (isI(im)) o=im
		stop_breath(o)
		var [Y,X]=isE(e)?[e.layerY,e.layerX]:isA(ae)?ae:[o.h/2,o.w/2]
		,[dh,dw,dt,dl]=[o.h*k,o.w*k,-Y*k,-X*k]
//ограничения на предельные значения (как правило, before_scale оценивает можно ли )
		if (iff(o.before_scale,o,k,Y,X)===false || (o.w+dw<o.w0*o.kmin || o.h+dh<o.h0*o.kmin) && sign(k)<0 || (o.w+dw>o.w0*o.kmax || o.h+dh>o.h0*o.kmax) && sign(k)>0 ) return false
		ssO(o,o.h+=dh,o.w+=dw)
		poO(o,o.t+=dt,o.l+=dl)
		reorg_attrs_obj(o,1+k)
		reorg_children(o,1+k)
		reordZi(o.parentNode)
// 		iff(o.scale_also,this,arguments)
		iff(o.scale_also,o,k,[dh,dw,dt,dl],Y,X)
// 		return false
	}
	function set_scrlarea(o,fupd,finit) { //внутри объекта создаем контейнер с правым и нижним скрулом (по-умолчанию, контейнер имеет свойство movable)
		var zi=gziO(o),nm=o.dat.name //префикс имени
		,cd,oc,osra,osba,osr,u=o.dat.props.scrollable
		if (isNaN(zi) || zi<1) {zi=zindexMin;sziO(o,zi)}
		cd={name:nm+"_container",pname:nm,css:{zi:zi-1,all:[o.h,o.w]}}//доп. свойства контейнера (по-умолчанию) ,props:{movable:true,scalable:true}
		upd_obj(cd,u)
		oc=init_obj(cd,fupd,finit)
		osra=init_obj({
			css:{
				all:[,11,,,,0,"gray"],cu:"row-resize",ro:"5px",op:39}
				,props: {vstretchable:[7,11],pressable: true}
				,children:{"[[pname]]_rscrl":{css:{cu:"pointer",bgc:"black",ro:"5px"},props: {vmovable: true, hstretchable:true}}}}
				,nm+"_rscrlarea",nm,fupd,finit)
		osba=init_obj({
			css:{
				all:[11,,,,0,,"gray"],cu:"col-resize",ro:5,op:39}
				,props: {hstretchable:[7,11],pressable: true}
				,children:{"[[pname]]_bscrl":{cu:"pointer",css:{bgc:"black",ro:5},props: {hmovable: true, vstretchable:true}}}}
				,nm+"_bscrlarea",nm,fupd,finit)
		osr=gO(nm+"_rscrl"),osb=gO(nm+"_bscrl"),osra=gO(nm+"_rscrlarea"),osba=gO(nm+"_bscrlarea")
		o.reset_also=o.resize_also=oc.move_also=oc.scale_also=function() {corr_scrlarea(o)}
		oc.before_scale=function(k,Y,X) {//не дает возможность уменьшаться объектам, когда контейнер имеет минимальный размер (уменьшен до размеров окна)
// 			var [dh,dw,dt,dl]=[oc.h*k,oc.w*k,-Y*k,-X*k]
				if (k<0 && (oc.h<=o.h || oc.w<=o.w)) return false
		}
 		oc.move_also=function(dt,dl){
			if ((oc.h>o.h || oc.w>o.w)) {
				var kz,ar=reordZi(oc)
				for (i=0;i<ar.length;i++) {var t,l
					if (!ar[i].dat.sticky) {
// 						kz=oc.w/ar[i].dat.z // /0.3 //0.866 //0.577
						kz=ar[i].w/ar[i].w0

						if (kz!=1) {
							if (oc.h>o.h) {t=ar[i].t+dt*kz;if (t<0) t=0; else if (t>oc.h-ar[i].h) t=oc.h-ar[i].h; poO(ar[i],ar[i].t=t)}
							if (oc.w>o.w) {l=ar[i].l+dl*kz;if (l<0) l=0; else if (l>oc.w-ar[i].w) l=oc.w-ar[i].w; poO(ar[i],null,ar[i].l=l)}
						}
					}
				}
			}
			corr_scrlarea(o)
		}
		o.dat.resizing.splice(0,0,nm+"_rscrlarea",nm+"_bscrlarea") //,nm+"_container")
		if(!o.dat.kwheel)o.dat.kwheel=kwheel //коеф. скролирования для колеса
// 		if (o.parentNode==d.body)
		d.body.style.overflow="hidden"
		corr_scrlarea(o)
		osr.move_also=function(){var t=oc.t;oc.t=-osr.t*(oc.h-o.h)/(osra.h-osr.h);if (iff(o.vscroll_also,o,t-oc.t)!==false) poO(oc,oc.t)}
		osb.move_also=function(){var l=oc.l;oc.l=-osb.l*(oc.w-o.w)/(osba.w-osb.w);if (iff(o.hscroll_also,o,l-oc.l)!==false) poO(oc,null,oc.l)}
		osra.onwheel=function(e) {
				var t,dir=mwheel(e)
				t=osr.t+dir[0]* this.h/o.dat.kwheel * this.h/oc.h
				if (t<0) t=0;else if (t>this.h-osr.h) t=this.h-osr.h
				osr.t=t;poO(osr,t);osr.move_also()
				return false
		}
		osba.onwheel=function(e) {
			var l,dir=mwheel(e)
			l=osb.l+dir[0]* this.w/o.dat.kwheel * this.w/oc.w
			if (l<0) l=0;else if (l>this.w-osb.w) l=this.w-osb.w
			osb.l=l;poO(osb,null,l);osb.move_also()
		}
		osra.click=function(e) {
			osr.t=e.layerY
			if (osr.t>osra.h-osr.h) osr.t=osra.h-osr.h
			poO(osr,osr.t)
			osr.move_also()
			osra.state=""
		}
		osba.click=function(e) {
			osb.l=e.layerX
			if (osb.l>osba.w-osb.w) osb.l=osba.w-osb.w
			poO(osb,null,osb.l)
			osb.move_also()
			osba.state=""
		}
	}
	function orient() { //оценить положение объекта "o" относительно объекта "op". "ed" - края/й (0, число или массив (t,l,b,r))
// try{}catch(e){c.log(e)}
		var i,o,op,ed,p=args(arguments),[o,op,no,nop,eda,edn]=[p.H[0],p.H[1],p.S[0],p.S[1],p.A[0],p.N[0]]
		,[et,el,eb,er]=isN(edn)?[edn,edn,edn,edn]:isA(eda)?eda:[0,0,0,0] //размеры границ (edge top,left,bottom,right)
		if (isS(no) && isH(gO(no)) && !isO(o)) o=gO(no)
		if (isS(nop) && isH(gO(nop)) && !isO(op)) op=gO(nop)
		if (!isH(o) || !isN(et) && !isN(el) && !isN(eb) && !isN(er)) return false //не задан объект
		if (!isH(op)) op=o.parentNode //не задан родитель, тогда "body"
		var [ph,pw]=gsO(op)
		,db=ph-o.t-o.h,dr=pw-o.l-o.w //отступы от границ (b,r), ниже - условия
		,bt=o.t<=et,br=dr<=er,bb=db<=eb,bl=o.l<=el //граничные условия
		if (bl && !bt && br && bb) return "bh" //(t,l,b,r|h,v|)
		if (bl && bt && !br && bb) return "lv"
		if (bl && bt && br && !bb) return "th"
		if (bl && !bt && !br && bb) return "bl"
		if (bl && bt && !br && !bb) return "tl"
		if (bl && !bt && br && !bb) return "h"
		if (bl && !bt && !br && !bb) return "l"
		if (!bl && bt && !br && !bb) return "t"
		if (!bl && !bt && br && !bb) return "r"
		if (!bl && !bt && !br && bb) return "b"
		if (!bl && bt && br && !bb) return "tr"
		if (!bl && !bt && br && bb) return "br"
		if (!bl && bt && !br && bb) return "v"
		if (!bl && bt && br && bb) return "rv"
		if (bl && bt && br && bb) return "max"
		return "in" // bh lv th bl tl h l t r b tr br v rv max in
	}


	function reordZi(o){var i,ar=[],oo,zi
// 		for (i in o.childNodes) {oo=o.childNodes[i];if (isO(oo.dat) && oo.id != o.id+"_container" && isN(oo.dat.z) && !oo.dat.sticky) ar.push(oo)} //все потомки, кроме самого контейнера
		for (i in o.childNodes) {oo=o.childNodes[i];if (isO(oo.dat) && oo.id != o.id+"_container" && !oo.dat.sticky) ar.push(oo)} //все потомки, кроме самого контейнера
// 		ar=ar.sort(function(a,b){return a.dat.z<b.dat.z?-1:a.dat.z>b.dat.z?1:0})
		ar=ar.sort(function(a,b){return a.w/a.w0<b.w/b.w0?1:a.w/a.w0>b.w/b.w0?-1:0})
		for (i=0;i<ar.length;i++) {
			oo=gO(ar[i].id+"_nav");zi=ar.length-i+1
			if (gziO(ar[i])<zindexMax) {sziO(ar[i],zi);if (isH(oo)) sziO(oo,zi)}
		}
		return ar
	}

	function scale_val(v,k) {if (k==1||v.indexOf("px")==-1) return v //масштабируем только значения с 'px'
		var i,r="",ar=v.split(" ")
		for (i=0;i<ar.length;i++) {
			if (r!="") r+=" "
			if (ar[i].indexOf("px")!=-1) r+=(gnum(ar[i])*k)+"px"; else r+=ar[i]
		}
		return r
	}

	function reorg_children(o,k) {var i,oo
		for (var i=0;i<o.childNodes.length;i++) {oo=o.childNodes[i]
			if (oo.nodeType==1                                                                                                ) {
				reorg_attrs_obj(oo,k)
				reorg_geom_obj(oo,k)
				if (isH(oo)) reorg_children(oo,k)
			}
		}
	}

	function reorg_attrs_obj(o,k) {// масштабируем атрибуты
		var i,ar,r,at,v,v0
		o.scaling_factor*=k //текущий масштаб объекта
		for (i=0;i<wAddAttrs.length;i++) {  //масштабируем доп. аттрибуты
			at=wAddAttrs[i] //в wAddAttrs - список атрибутов, которые контролируем
			v=scale_val(o.style[at],k);if (o.style[at]==v) continue
			o.style[at]=v
// 			if (isN(o.dat.z)) o.dat.z/=k
		}
	}
	function reorg_geom_obj(o,k){ //масштабируем все размеры основного объекта + его детей рекурсивно
		var i,sr,sb,sw
		,sr=o.style.right,sb=o.style.bottom //,ss=[null,null]
		ssO(o,o.h*=k,o.w*=k)
		if (sr!="" && sb=="") poO(o,o.t*=k)
		else if (sr=="" && sb!="") poO(o,null,o.l*=k)
		else if (sr=="" && sb=="") poO(o,o.t*=k,o.l*=k)
	}
	function genname(fix,siz){ //генерирует случайное имя, с учетом, что его еще нет в памяти (fix-фикс. часть имени,siz-длина случайной части)
		var o,nn,name,i=0
		if (!isS(fix)) fix="noname";if (!isN(siz) || isNaN(siz) || siz<1) siz=999
		while (++i<maxdeep) {name=fix+alnum(grnd(siz),siz);if (valinobj(name,names)===false) return name}
		return false
	}

	function gentask(pref){if (!pref) pref="task_"
		var i=0,name
		while (++i<maxdeep) {name=pref+alnum(grnd(9999),9999); if (!isO(tasks[name])) return name}
		return false
	}
	function incstr(s){ //инкремент числового окончания строки
		if(!isS(s)) s=s.toString()
		var i,n=0
		for(i=0; i<s.length; i++)  if (isNaN(s[i])) n=0;else n++
		var sf=gint(s.substr(s.length-n));if (isNaN(sf)) sf=0;else sf++
		return s.substr(0,s.length-n) + sf
	}
	function alnum(n,m){return ss(0,m.toString().length-n.toString().length)+n} //дополняет слева 000 к "n" по образцу "m". Т.е. 001,002, 099, 123 и д.}
// 	function alnum(n,m){return ss(0,m+n} //дополняет слева 000. Т.е. 001,002, 099, 123 и д.}

//ф-ции обработки цвета.
	function genclr(gr,N) {var i,d1=[],st=[],res=[] //генерирует последовательность цветов из N элементов из указанного градиента gr
		if (isN(gr)) {i=gr;gr=N;N=i}
		try {
			gr=gr.split(" ");gr[0]=hex6(gr[0]);gr[1]=hex6(gr[1])
			for (i=0;i<3;i++) {
				d1[i]=x2d(gr[0].substr(i*2+1,2))
				st[i]=(x2d(gr[1].substr(i*2+1,2))-d1[i])/N
			}
			for (i=0;i<N-1;i++) res.push(dec2clr(round(d1[0]+i*st[0])*65536 + round(d1[1]+i*st[1])*256 + round(d1[2]+i*st[2])))
			res.push(gr[1])

		}catch(e){c.log("Error genclr:",e);return}
		return res
	}
	function clroff(c,of){var c=hex6(c)
		,R=x2d(c.substr(1,2))+of
		,G=x2d(c.substr(3,2))+of
		,B=x2d(c.substr(5,2))+of
		if (R<0) R=0; else if (R>255) R=255
		if (G<0) G=0; else if (G>255) G=255
		if (B<0) B=0; else if (B>255) B=255
		return "#"+d2x(R)+d2x(G)+d2x(B)
	}

	function invclr(c){var c=hex6(c);return "#"+d2x(x2d(c.substr(1,2))^255)+d2x(x2d(c.substr(3,2))^255)+d2x(x2d(c.substr(5,2))^255)}
	function dec2clr(n){return "#"+d2x(gint(n/65536))+d2x(gint((n&0x00ffff)/256))+d2x(n&0x0000ff)}
	function clr2dec(clr){clr=hex6(clr);return x2d(clr.substr(1,2))*65536+x2d(clr.substr(3,2))*256+x2d(clr.substr(5,2))}
	function bandclr(clr,step,N) {var ar=[];clr=clr2dec(clr)-step;while (N-->0) ar.push(dec2clr(clr+=step));return  ar}
	function hex6(c){var r=c.toString().substr(1);return r.length!=3?"#"+ss("0",6-r.length)+r:"#"+r[0]+r[0]+r[1]+r[1]+r[2]+r[2]}
	function rndcolor(c0,c1){if (c0==null) c0=128; if (c1==null) c1=256-c0;var clr="#"+d2x(grnd(c0)+c1)+d2x(grnd(c0)+c1)+d2x(grnd(c0)+c1);return [clr,invclr(clr)]}
	function rndPosNsize(p){var h0,w0,h,w
		if (!p || !p.clientHeight || p==d.body) {h0=hwin();w0=app.ww}else {h0=p.clientHeight;w0=p.clientWidth}
		h=round(h0/4);h+=grnd(h); w=round(w0/4);w+=grnd(w) //случайные высота 1/4 и ширина 1/4 от родителя
		return [h,w,grnd(h0-h),grnd(w0-w)]
	}
	function chkcas(e) {//возвращает TRUE - все три, FALSE - ни одного, либо сумма кодов нажатых ctrl,shitt,alt
		if (e.altKey===true && e.ctrlKey===true && e.shiftKey===true) return true
		else if (e.altKey===false && e.ctrlKey===false && e.shiftKey===false) return false
		else {var n=0;if (e.altKey===true) n+=ALT;if (e.ctrlKey===true) n+=CTRL;if (e.shiftKey===true) n+=SHIFT;return n}
	}
	function keyproceed(k,e){var kn,o=this,r
		if (!isO(o.dat)) return
		for (i in KEYS) if (KEYS[i]==k) {kn=i;break}; if (!kn) kn="ANY"
		r=fndkey(o);if (!isA(r)) return //fndkey проходит поцепочке связанных объектов
		try{
			var oo,lst,kk=r[1].keys
			,act=kk[r[3]].action
			,func=kk[r[3]].func
			,type=kk[r[3]].type//up,down,press когда обработка: (нажатие, отжатие, клавиша )
			,pp=r[1].pars
		} catch(e){c.log(e);return e}

		if (!isS(type)) type="keyup" //по-умолчанию
		if (type!=e.type) return //не наш тип - уходим
		if (isO(pp) && isA(pp.list)) {lst=pp.list;if (isA(lst)) oo=gO(lst[0])}
		if (isS(act) && e.type==type) return doact()
		else if (isS(func)) return iff(r[2][func],o,r,k,e) //должна возвращать false, чтобы блокировать стандартную обработку

		function fndkey(o){//получает массив параметров, возвращает код действия (вперед, назад, homt, end) или false (рекурсивно опускается до нижнего потомка и отдает ему обработку, если он соотв. настроен)
			var j,a,aa,cnt,key,kd=o.dat.keystrokes
			try{
			for (i in kd.keys) {
				aa=i.split(",") //; jj=valinobj(i,aa); if (jj===false) return
				for (j=0;j<aa.length;j++) if (aa[j].indexOf(kn)>-1) {key=aa[j];break}
				if (key=="ANY") return [key,kd,o,i]
				if (!key) continue
				a=key.split("+")
				if (a[0]==kn && a.length==1 && chkcas(e)===false && valinobj(kn,speckeys)===false) return [key,kd,o,i] //найдена одиночная клавиша
				if (a.length>1) {cnt=0
					for (j=0;j<a.length-1;j++) { //kk=eval(a[j]) //код
						if (valinobj(a[j],speckeys)===false) {cnt=0;break}
						if (a[j]=="CTRL" && e.ctrlKey===true || a[j]=="ALT" && e.altKey===true || a[j]=="SHIFT" && e.shiftKey===true) cnt++
					}
					if (a.length-1==cnt && a[j]==kn) return [key,kd,o,i] //условия нажатия всех клавиш совпали - возвращаем
				}
			}
			try {return fndkey(gO(kd.pars.list[0]))}catch(e){return e}
			} catch(e){return e}
		}
		function doact(){
			if (!isH(oo)) oo=curobj;if (!isH(oo)) oo=e.target;if (!isH(oo)) return
			if (act=="next") {
				actlstitem(r[2],1);lst.push(lst.shift());actlstitem(r[2])
			} //циклически передвигаем 0 элемент в конец, поднимая остальные
			else if (act=="prev") {actlstitem(r[2],1);lst.unshift(lst.pop());actlstitem(r[2])} //циклически передвигаем последний элемент в начало, опуская остальные
			else if (act=="press" && oo.state!="process") {
				setattr(oo,"press","process");oo.state="process"
				iff(oo.click,oo,e)
			}// else return
			return false
		}
	}
	function changitems(l,n){var i,ar;ar=l.splice(0,n);for (i in ar) l.push(ar[i])} //n-элементов с l-позиции вырезали из массива и поместили в его конец
	function txt2cb(txt){ //text to clipboard
		var oi=init_obj({def:"def",tag:"textarea",css:{all:[1,1,-9999]}})
		oi.value=txt
		oi.select();d.execCommand("copy")
		dO(oi)
	}
	// 	*** widgets ***
	function animText(o,txt) {
		clearInterval(o.tmanimText);if (txt==null || txt=="") return //остановка
		o.curAnimSym=0;o.dirAnim=1;o.stepAnim=199
		stO(o,txt)//установили новый текст и сбросили старую анимацию
		o.tmanimText=setInterval(function() {
			var newstr,pos=o.curAnimSym,sym=txt.substr(pos,1).toUpperCase()
			if (sym==".") sym="&bull;"
			if (pos==0) newstr=sym+txt.substr(1)
			else if (pos>0 && pos<txt.length-1) newstr=txt.substr(0,pos)+sym+txt.substr(pos+1)
			else newstr=txt.substr(0,pos)+sym
			stO(o,newstr)
			o.curAnimSym+=o.dirAnim;if (o.curAnimSym==txt.length-1 || o.curAnimSym==0) o.dirAnim*=-1
		},o.stepAnim)
	}
//*** progressbar ***
	function progressbar(u){ //nall-всего, ncur - текущее значение, текст на весь PB (bgc,frc, текста)
// try {
		var p={ //умолчания
			h:33,w:399,t:33 //размеры и отступ сверху
			,bg:"#0f0 #ff0" //цвет фона всего PB
			,sh:"3px 3px 9px 0 #aaa, -1px -1px 9px 0 #ff0"
			,ro:5
			,active:1
			,shb:"inset 0 0 19px 3px #9c9"
			,lbg:"#ff0 #0ff",shl:"0 0 39px #f37, inset 0 0 33px white" //цвет и тень анимационного шара
			,ts:"-1px -1px 1px #7a7, 1px 1px 1px white" //цвет фона и текста PB
			,fs:15,ff:"arial",ta:"center" //текстовые аттрибуты BP
			,delay:longdelay //общее время для всех анимаций (по-умолчанию)
			,alltime:33 // время заполнения всего progressbar (в сек) (с интервалом в "disc")
			,disc:discrete //скорость анимации продвижения progressbar
			,cur:0 //текущий указатель продвижения pb
			,text:"Working...",textend:"Finished." //текст работы и завершения
			,name:genname("progressbar_") //имя
			,props:{movable:true,closable:true,haligned:true}
		}
		upd_obj(p,u);o=gO(p.name)
		var o,ob,nmb,nml,nmt
		if (!isN(p.hb)) p.hb=p.h*17/19 //размер анимационного шара (если не указан, то это 3/4 часть высоты progressbar)
		,dat={
			nmb:nmb=p.name+"_bar"
			,nml:nml=p.name+"_ball"
			,nmt:nmt=p.name+"_txt"
			,css:{all:[p.h,p.w,p.t,,,,p.bg],sh:p.sh,ro:p.ro}
			,props:p.props
			,ch:{
				[nmb]:{css:{all:[p.h],vi:"hidden",sh:p.shb}} //bar
				,[nml]:{css:{all:[p.hb,p.hb,(p.h-p.hb)/2,(p.h-p.hb)/2],ro:gint(p.hb/2),bgc:p.lbg,vi:"hidden",sh:p.shl}} //ball
				,[nmt]:{css:{ta:p.ta,co:p.bgc,ts:p.ts,ff:p.ff,fs:p.fs},props:{hstretchable:true,aligned:true},value:p.text} //text
			}
			,move:{share:[nmt,nml]}
			,props:p.props
		}
		if (isO(p.css)) upd_obj(dat.css,p.css)
		if (!isH(o)) { // создаем объект, если его еще нет
			o=init_obj(p.name,p.pname,dat)
// c.log(o.id,o.h,o.w,o.dat.css.all) try{}catch(e){c.log(e)}
			o.pars=p //для внешн. доступа
			o.show=function(){var i
				,a=args(arguments),[cur,all,txt,upd]=[a.N[0],a.N[1],a.S[0],a.O[0]] //параметры могут модифицировать установки (менять текст, cur/all)
				if (isN(cur)) p.cur=cur; if (isN(all)) p.all=all
				if (isS(txt)) p.text=txt
				if (isO(upd)) upd_obj(p,upd)
				if (p.cur==0) hide(nmb);else show(nmb)
				stO(nmt,p.text);ssO(nmb,null,p.w*p.cur/p.all)
			}
			o.stop=function(){p.active=0;iterate(nmb)}
			o.close=function(){iterate(nmb);iterate(nml);fadeout(o,dO,p.delay)} //fadeout(o,function(){c.log(o.id);dO(o)},p.delay)
			o.sanim=function(){p.anim=1;fadein(nml);iterate(nml,function(cnt){if(p.anim=!p.anim) fadein(nml);else fadeout(nml)},p.delay)}
			o.eanim=function(){iterate(nml);fadeout(nml)}
			o.start=function(){
				iterate(nmb)
				if (isN(p.alltime) && !isN(p.all)) p.all=gint(p.alltime*1000/p.disc) //общее число шагов полного заполнения progressbarr, в течение "alltime" с интервалом "disc"
				iterate(nmb,o.iterbar,p.disc)
				o.show()
			}
			o.close_also=o.close //function(){c.log("close2");o.close();return false}
			o.iterbar=function(cnt){
				var rc=iff(p.fuser,o,o)
				if (rc===false) return false; if (rc===true) return //nothing do
				p.cur++
				if (p.cur>=p.all) {
					if (iff(p.fend,o,o,p)===false) return false
					p.text=p.textend;o.show();o.close();return
				}
				o.show()
			}

			if (p.active && (p.all||p.alltime)) o.start()
		}
		return o
// }catch(e){c.log(e)}
	}
//*** tabs ***
	function tabs() {
		var lt,clr,la,i,a=args(arguments),[vals,fsel,upd,name,pname]=[a.A[0],a.F[0],a.O[0],a.S[0],a.S[1]],o
		,p={
			ncur:1 //номер закладки поумолчанию при старте.
			,zi:1
			,colors:["#ffc", "#cff","#fcf","#ccf","#fcc","#cfc","#fca","#cfa","#caf","#acf","#afc","#fac","#fea","#fae","#efa","#eaf","#aef","#afe"] //набор цветов по-умолчанию
			,ht:29,wt:79 //размер табов
			,hg0:33,hg:7,vg:13 //отступы (от краев, гриз, верт)
			,fs:17 //размер шрифта табов
			,sh:"0 0 33px -1px #7c7"
			,shsel:"inset 0 0 19px 1px yellow"
			,shou:"0 -1px 3px 0 #7a7"
			,h:app.hw/2,w:app.ww/2,t:app.hw/4,l:app.ww/4
			,lh:13 //высота строки инф. области таба
		}

		upd_obj(p,upd)
		if (isS(name)) p.name=name;if (isS(pname)) p.pname=pname
		vl=vals.length //кол-во закладок (длина массива названий)
		lt="[[name]]_tab"+msep+vl;la="[[name]]_area"+msep+vl;clr="eval{[[pname]].dat.colors[ [[mcount]]-1 ]}"

		//макроподстановки

		if (!isA(vals)) {if (!isA(vals)) vals=["Values","of","tabs","not","found",";)"]}
		if (!isS(p.name)) p.name=genname("tabs")
		if (!isF(fsel)) fsel=function(ot,oa) {stO(this,sp(3)+"You are selected <b>\""+gtO(ot)+"\"</b> tab. No user function for it")}
		o=init_obj({name:p.name,pname:p.pname
			,css:{all:[p.h,p.w,p.t,p.l],cu:"move",sh:p.sh}
			,props:{movable:true,resizable:true,closable:true,keypressable:true}
			,n:vl
			,values:vals
			,msep:msep
			,colors:p.colors
			,tabs:[lt+"+1"]
			,areas:[la+"+1"]
			,resizing_all:"[[areas]]"
			,resizing:"[[tabs]]"
			,keystrokes:{
				pars:{active:{css:{sh:p.shsel}},unactive:{css:{sh:p.shou}},list:[lt]}
				,keys:{
					"UP,DOWN,PGUP,PGDN":{func:"keyarrow"}
					,LEFT:{action:"prev",type:"keydown"}
					,RIGHT:{action:"next",type:"keydown"}
					,ENTER:{action:"press"}
				}
			}
			,ch:{
				[lt]:{
					hg:p.hg,hg0:p.hg0
					,tsho:"1px 1px 1px #111" //...при наведении
					,tsh:"-1px -1px 1px #7a7, 1px 1px 1px white"
					,tc: "#373"
					,clr:clr
					,wc:"eval{ ([[pname]].w-2*[[hg0]])/[[n]] - [[hg]]*([[n]]-1)/[[n]] }"
					,shov:"0 -3px 17px 3px "+clr
					,shou:p.shou
					,shcur:"0 -3px 17px 3px " //"#7a7"
					,shsel:p.shsel
					,css:{
						all:[p.ht,p.wt,p.vg,,,,
						clr,"[[tc]]","green",p.fs,p.ht,"center",,,,,
						"7px 7px 0 0","[[shou]]","pointer",,"[[tsh]]"]
						,brb:"none"
					}
					,value:"eval{[[pname]].dat.values[ [[mcount]]-1 ]}"
					,props:{
						focusable:true,pressable:true
						,css:{all:[,"[[wc]]",,"eval{ [[hg0]]+( [[wc]]+[[hg]] )*([[mcount]]-1)}"]}
					}
					,focus:{
						over:{"[[name]]":{css:{sh:"[[shov]]",br:"none",ts:"[[tsho]]",co:"[[clr]]"}}}
						,out:{"[[name]]":{css:{sh:"[[shou]]",br:"green",brb:"none",ts:"[[tsh]]",co:"[[tc]]"}}}
					}
				}
				,[la]:{
					clr:clr
					,css:{bgc:"[[clr]]",br:"green",sh1:"0 7px 33px -13px #7aa",ro:7,cu:"text"}
					,props:{stretchable:[p.ht+p.vg , p.vg , p.hg ,p.hg+2]}
					,ch:{
						"[[name]]_content":{
							css:{br:"dotted 1px #aaa",sh:"0 0 33px 0 #aaa",ro:5,lh:p.lh}
							,props:{stretchable:[p.vg, p.vg,p.hg ,p.hg+2],scrollable:true}
						}
					}
				}
			}
		})

		o.keyarrow=function(r,k,e){
			var o=this,mc=o.prevtab,nma=o.dat.areas[mc-1]
			,oc=gO(nma+"_content"),occ=gO(nma+"_content_container")
			switch (k) {
				case UP	:poO(occ,occ.t+=p.lh);break
				case DOWN:poO(occ,occ.t-=p.lh);break
				case PGUP:poO(occ,occ.t+=oc.h);break
				case PGDN:poO(occ,occ.t-=oc.h);break
			}
			corr_scrlarea(oc)
		}
		for (i in o.dat.tabs) {
			var ot=gO(o.dat.tabs[i]),oa=gO(o.dat.areas[i]),oc,occ,so
			ot.click=function(){
				setattr(this,"focus","out")
				var co=this,op,mc=co.dat.mcount
				if (o.prevtab==mc) return
				keylstchg(o,co.id)
				if (isN(o.prevtab)) {
					oa=gO(o.dat.areas[o.prevtab-1])
					op=gO(o.dat.tabs[o.prevtab-1])
					ssO(op,op.h=op.h-.5)
					oc=gO(oa.id+"_content")
					occ=gO(oa.id+"_content_container")
					sziO(op,p.zi);sziO(oa,p.zi)
					sshO(op,op.dat.shou)
					stO(occ,"");ssO(occ,"","") //очистили и обнулили размеры
					op.state=""
				}
				oa=gO(o.dat.areas[mc-1])
				oc=gO(oa.id+"_content")
				occ=gO(oa.id+"_content_container")

				sziO(co,p.zi+2);sziO(oa,p.zi+1)

				ssO(co,co.h=co.h+.7)
				o.prevtab=mc
				sshO(co,co.dat.shcur+_eval(co.dat.clr))
				stO(occ,"");ssO(occ,"","") //очистили и обнулили размеры
				iff(fsel,occ,co,oa)
				so=gsO(occ) //новые размеры после добавления
				ssO(occ,occ.h=so[0],occ.w=so[1])
// poO(occ,occ.t=-so[0]+oa.h,oc.l=-so[1]+oa.w)
				poO(occ,occ.t=0,occ.l=0)
				corr_scrlarea(oc)
			}
		}
		o.before_resize=o.before_move=function(){
			var so,oa=gO(o.dat.areas[o.prevtab-1]),oc=gO(oa.id+"_content"),occ=gO(oa.id+"_content_container")
			stO(occ,"");ssO(occ,"","") //очистили и обнулили размеры
			so=gsO(occ) //новые размеры после добавления
			ssO(occ,occ.h=so[0],occ.w=so[1])
			corr_scrlarea(oc)
		}

		o.after_resize=o.after_move=function() {
			var so,oa=gO(o.dat.areas[o.prevtab-1]),ot=gO(o.dat.tabs[o.prevtab-1])
			,oc=gO(oa.id+"_content"),occ=gO(oa.id+"_content_container")
			ssO(occ,"","") //очистили и обнулили размеры
			iff(fsel,occ,ot,oa)
			so=gsO(occ) //новые размеры после добавления
			ssO(occ,occ.h=so[0],occ.w=so[1])
			poO(occ,occ.t=0,occ.l=0)
			corr_scrlarea(oc)
		}


		o.settab=function(n){gO(o.dat.tabs[n-1]).click()}
		o.settab(p.ncur)
		setcurobj(o)
		return o
	}

	//*** menu ***
	function menu() {//func-функция выбора элемента, name - имя всего меню, pos - позиция меню, upd - модификация opts,
		var i,ci,cii,it,o,md,mh,km,nm,mi,oo,chl,val
			,a=args(arguments),[mdat,upd,func,finit,name,hdr,pname,pos]=[a.O[0],a.O[1],a.F[0],a.F[1],a.S[0],a.S[1],a.S[2],a.A[0]]
			,p={
				overout:"no"
				,header:"Root Menu"
 				,name:"menu" //Имя всего меню (В заголовке)
				,fadetime:shortdelay
				,opendelay:comdelay
				,mh:23 //высота строки с элементом menu
				,hh:19 //высота заголовка
				,hdat:{}
				,we:9 // ширина кнопки расширения меню с "..."
				,w:169 // ширина всего окна меню
				,hgap:3,vgap:7 //промежуток между гориз. и вертик. элементами
				,shad:win_dat.shad
				,clri:"#aec #fff" //color item
				,clrti:"#333" //color text item
				,brdi:"solid 1px #777" //border item
				,clrs:"#fee #fff" //color item selected
				,clrh:"#fe7 #fff" //цвет заголовка
				,brdm:"solid 1px #379" // рамка меню
				,bcm:"#cfd" //цвет меню
				,shsel:"inset 0 0 19px 1px yellow"
			}
			,ft=p.fadetime
			,fo
		if (!isA(pos)) pos=[]
		upd_obj(p,upd)
		fo=p.overout=="no"
		if (!isS(name)) name=p.name
		if (!isS(hdr)) hdr=p.header
		if (!isS(pname)) pname=p.pname
		if (!p.fs) p.fs=gint(p.mh*3/4)
		o=gO(name)
		if (!isH(o)) return initmenu() //;return false
		function initmenu(){
			name=!isS(name)?genname("menu"):name
			km=keys(mdat)
// 			upd_obj(opts,upd)
			if (!isN(pos[0])) pos[0]=app.mouse.t ;if (!isN(pos[1])) pos[1]=app.mouse.l
			if (!isN(p.t0)) p.t0=0;if (!isN(p.l0)) p.l0=p.hgap
			mh=p.t0+(isS(hdr)?p.hh:0)+km.length*(p.vgap+p.mh)+p.vgap+2
			md={name:name,pname:pname
				,css:{all:[mh,p.w,pos[0],pos[1],,,p.bcm,,p.brdm,,,"center",p.hh+p.vgap*km.length,,,,3,p.shad]}
				,props:{movable:true,closable:true,resizable:true,keypressable:true} //closable:[7,7,3,,,3] resizable:[7,7,,,1,1] [,,3,,,2]
				,resizing:["[[name]]_header"]
				,ch:{}
				,keystrokes:{
					pars:{active:{css:{sh:p.shsel}},unactive:{css:{sh:"none"}},list:[]}
					,keys:{
						DOWN:{action:"next",type:"keydown"}
						,UP:{action:"prev",type:"keydown"}
						,ESC:{func:"close"}
						,LEFT:{func:"close"}
						,RIGHT:{func:"right"}
						,ENTER:{action:"press"}
					}
				}
			}
			if (isS(hdr)) { //если заголовок
				md.move={catchid:"[[name]]_header",up:{"[[name]]":{css:{sh:p.shad}}},down:{"[[name]]":{css:{sh:"none"}}}}
				md.ch["[[name]]_header"]={props:{hstretchable:true,movable:true},value:hdr,css:{all:[p.hh,,,,,,p.clrh,,,gint(p.hh*5/6),p.hh,"center"],"border-bottom":p.brdm}}
			}
			it=(isS(hdr)?p.hh:0) + p.vgap+p.t0
			for (i=0;i<km.length;i++) {
				chl=mdat[km[i]].children
				val=mdat[km[i]].value
				nm="[[name]]_"+ km[i],mi=mdat[km[i]]
				md.resizing.push(nm)
				md.keystrokes.pars.list.push(nm)
				ci=p.clri,cii=ci.split(" ");cii=cii[1]+" "+cii[0]
				md.ch[nm]={css:{all:[p.mh,,it,,,,ci,p.clrti,p.brdi,p.fs,p.mh,,,,,,3,,"pointer"]}
					,value:val
					,pmenu:md.name,menudat:mi.children
					,props:{hstretchable:[p.hgap,p.hgap+2],focusable:true,pressable:true}
					,nm:nm,ch:{}
					,menudat:chl
					,focus:{over:{"[[nm]]":{css:{bgc:p.clrs}}},out:{"[[nm]]":{css:{bgc:ci}}}}
					,press:{down:{"[[nm]]":{css:{bgc:"yellow"}}},up:{"[[nm]]":{css:{bgc:ci}}}}
				}
				if (isO(chl)) {
					md.ch[nm].props.hstretchable[1]+=p.we
					md.ch[nm+"_"]={
						nm:nm+"_",value:">"
						,css:{all:[p.mh,p.we,it,,,p.hgap,ci,,p.brdi,gint(p.mh*.7),p.mh,,,,,,3,,"pointer"]}
							,props:{focusable:true,pressable:true}
							,focus:{over:{"[[nm]]":{css:{bgc:cii}}},out:{"[[nm]]":{css:{bgc:ci}}}}
							,press:{down:{"[[nm]]":{css:{bgc:"yellow"}}},up:{"[[nm]]":{css:{bgc:ci}}}}
					}
				}
				it+=p.mh+p.vgap
			}
			o=init_obj(md)

//обработчики для всего меню
// o.before_close=o.close_also=clal
			o.close_also=clal; o.move_also=mval; o.right=openmenu
//обработчики для элементов
			for (i=0;i<km.length;i++) {
				nm=name+"_"+km[i];oo=gO(nm)
				oo.enter=func
				if (isO(oo.dat.menudat))
					if (fo) {
						gO(nm+"_").click=function(e,state,o){ //обработчик "..."
							var nm=o.id.substr(0,o.id.length-1)
								,oi=gO(nm),om=gO(oi.dat.pmenu),oc=gO(om.dat.cmenu)
							if (isO(oc)) {
								if (oc.dat.imenu==nm) return
								sellstitem(gO(oc.dat.imenu),1) //unactive
								o.close.call(oc,function(){sellstitem(oi);oc=openmenu(oi)})
							} else {sellstitem(oi);oc=openmenu(oi)}
							o.state=""
						} //func
					} else {
						oo.over_also=function(){overout(this,"over")}
						oo.out_also=function(){overout(this,"out")}
					}
				oo.click=function(e) {
					var o=this,om=gO(o.dat.pmenu)
					sellstitem(o)
					iff(func,o,["click",om.dat.keystrokes,o])
					o.state=""
				}
			}
			setlang(o); setcurobj(o)
			fadein(o,ft)
			o.sellstitem=sellstitem
			return o
		}

		function mval(dt,dl,e) {var i=0,o=this //,sv //move_also
			while (++i<maxdeep) {
				if (o==null) break
				o=gO(o.dat.cmenu)
				o.save.movealso=o.move_also;o.move_also=null //блокируем move_also,чтобы рекурсивно не зациклиться
				move_obj(o,dt,dl,e)
				o.move_also=o.save.movealso
			}
		}
		function clal(){ //close_also
			var i=0,oi,o=this,oo=o,ob=gO(o.dat.imenu+"_"),op=gO(o.dat.pmenu)
			ft=ft>0?ft:comdelay
			if (isH(ob)) { //разблокировали кнопку "..."
				oi=gO((op.dat.keystrokes.pars.list[0]))
				oi.dat.props.hstretchable[1]+=p.we+2
				ssO(oi,null,gsO(oi)[1]-p.we)
				show(ob);setattr(ob,"press","up");ob.state=""
			}
			while (++i<maxdeep) {
				oo=gO(oo.dat.cmenu);if (oo==null) break //закрываем потомков
				fadeout(oo,ft,dO)
			}
// 			fadeout(o,ft,function(){c.log("**");if (isH(op)) op.dat.cmenu=null;dO(o);c.log("!!",o)})
				setcurobj(op)
// 			return false //чтобы не сработал fadeout по-умолчанию
		}

		function openmenu(r){// Если передан r, то меню открывается нажатием "right", иначе, элемент меню
			var o
			if (isA(r)) o=gO(r[2].dat.keystrokes.pars.list[0]); else o=r
			op=gO(o.dat.pmenu);if (!isH(op) || !isO(o.dat.menudat)) return
			om=gO(op.dat.cmenu)
			if (isH(om)) {setcurobj(om);return} //уже открыто - уходим
			hide(gO(o.id+"_"));
			o.dat.props.hstretchable[1]-=p.we
			ssO(o,null,gsO(o)[1]+p.we)
			om=menu(o.dat.menudat,func,genname(name+"_"),[op.t+o.t+o.h/2,op.l+ o.l+ o.w],o.dat.value,p)
			om.dat.pmenu=op.dat.name //в новое подменю - имя родительского меню
			op.dat.cmenu=om.dat.name //в родителя - имя нового подменю-потомка
			om.dat.imenu=o.dat.name //имя элемента, кто создал
			return om
		}
		function overout(o,t) {
			var oo,nm=o.dat.name,oc=gO(gO(o.dat.pmenu).dat.cmenu) // oc - потомок от этого меню
				,op=gO(o.dat.pname)
			if (t=="over") {
				if (isH(oc)) { //есть потомок-открытое подменю ?
					if (oc.dat.imenu==nm) return // есть и был создан этим меню 0 уходим
					oo=gO(oc.dat.imenu) //другой открытый закрываем
					clearTimeout(oo.motm);oo.motm=0
					clal.call(oc)
				}
				if (!o.motm) { // если не был установлен таймаут, устанавливаем
					o.motm=setTimeout(function(){
						sellstitem(o)
						actlstitem(op)
						openmenu(o)
						o.motm=0
					},p.opendelay)
				}
			}
			else if (t=="out" && o.motm) {clearTimeout(o.motm);o.motm=0}
		}
		function sellstitem(o){
			if (isN(o)) {var oo=gO(this.dat.keystrokes.pars.list[o]);sellstitem(oo);return}
			var op=gO(o.dat.pmenu),l,n
			if (isH(op)) try {
				l=op.dat.keystrokes.pars.list;n=valinobj(o.dat.name,l)
				if (n!==false && n>0) {actlstitem(op,1);changitems(l,n);actlstitem(op)}
			}catch(e){c.log("sellstitem:",o);c.log(e)}
		}
	}
//*** chat ***
	function chat() {
try{
		var p={//параметры чата (по-умолчанию)
				h:333,w:233 //внешние размеры
				,vg:5,hg:5 //гориз. и вертикальные промежутки
				,hctrl:6 //высота верх упр линии
				,dctrl:6 //высота нижн упр линии
				,cbg:"#777 #fff" //цвет упр линии
				,cbgo:"#aa3 #ff0" //over
				,lmax:333 //максимальное кол-во строк в окне истории
				,icosize:[39,55] //размеры свернутого чата
				,msgwait:"Waiting",msgtyping:"Entering text"
				,infa:{
					bg:"#eaf",lbg:"#fde",vg:5,hg:5 //bg,line bg,gaps
// 					,avatar:chatavatar0 //,avatars:"&#9786;"
// 					,avclr:"#fde"
					,icoup:app.icoup //,icoups:"&#9650;"
					,icodown:app.icodown //,icodowns:"&#9660;"
					,info:[["Name","Jek"],["Second Name","Foxy"],["Position","Programmer"],["Department","Home"]]
				}
				,hist:{//область истории
					bgc:"#eec",css:{fs:11,lh:11}
					,maxline:123
					,line: {
						all:{brb:"dotted 1px #aaa",mab:7,ws:"normal"}
						,timein:{co:"red",mar:5}
						,timeout:{co:"green",mar:5}
						,unamein:{all:[,,,,,,"#fde","blue"],mar:5}
						,unameout:{co:"green",mar:5}
						,icoin:{display:"inline-block",all:[10,12],bgi:app.chatico12x10,sh:"inset 0 0 5px 1px yellow"}
						,icoout:{display:"inline-block",all:[10,12],bgi:app.chatico12x10}
						,textin:{co:"black"}
						,textout:{co:"gray",mr1:"5px"}
						,datatime:{bgc:"#eec #ccc",ta:"center",mat:9,co:"gray"}
					}
				}
				,enta:{
					welc:"Press Ctrl+Enter to send,\nEnter-new line" //welcome text
					,fs:13,tc:"#333",tcb:"#aaa",bg
					:"#cef"
				}
			}
		,i,hinf,hhst,hln,vg,hg,wavt,havt,ar,inf,hctrl,hcnt,tmmsg
		,nms,cdat,up,down,ochat,osh,oic,oi,oav,oec,oe,owc,owh,owf,oftsm,oftst,ohist
		,a=args(arguments),[name,fsend,fpres,upd]=[a.S[0],a.F[0],a.F[1],a.O[0]]
		upd_obj(p,upd)
		if (!isS(name)) name=p.name
		if (!isS(name)) name=genname("chat")
		nms={
			hst:name+"_hist"
			,hstc:name+"_hist_container"
			,hd:name+"_header",ft:name+"_footer",ftsm:name+"_footmsg",ftst:name+"_foottit"
			,sra:name+"_hist_rscrlarea",sba:name+"_hist_bscrlarea"
			,inf:name+"_info",infctl:name+"_infoctl",avtr:name+"_avatar"
			,ent:name+"_entr",entctl:name+"_entctl"
			,chat:name+"_cont"
		}
		inf=p.infa.info

		ochat=win({
			h:p.h,w:p.w,name:name,ffm:p.ffm
//  			,resizing_all:[,,,nms.inf,nms.hst,nms.ent,nms.entctl,nms.infctl]
// 			,htxt:inf[0][1]+" "+inf[1][1]
		})
		owh=gO(nms.hd);owf=gO(nms.ft),owc=nms.chat
		hcnt=ochat.h-owh.h-owf.h //высота основной области (_cont)
		vg=p.infa.vg; hg=p.infa.hg //гориз и верт промежутки
		hinf=isN(p.infa.h)?p.infa.h:gint(hcnt/4) //высота информационной области (по умолч. 1/4 часть всего окна чата)
		havt=hinf-2*vg; wavt=gint(havt*5/6) //высота и ширина аватара
		hln=gint((hinf-5*vg)/4) //высота информационной строки
		if (!isN(p.hist.h)) hhst=gint(hcnt/2) //высота области истории
		hent=hcnt-hinf-hhst-p.hctrl-p.dctrl//высота области ввод
		ochat.dat.maximizable=false
		up=p.infa.icoup
		down=p.infa.icodown
		oi=init_obj(nms.inf,nms.chat,{ //информ. область (имя, аватара...)
			avnm:nms.avtr
			,css:{all:[hinf,,,,,,p.infa.bg]},props:{hstretchable:true}
			,hg:hg
			,hln:hln
			,ch:{
// 				"[[avnm]]":{css:{all:[havt,wavt,vg,hg,,,,p.infa.lbg,,wavt,wavt,"center",,,,,,win_dat.shad]},txtico:specsym.smile}
				"[[avnm]]":{css:{all:[havt,wavt,vg,hg],co:p.infa.lbg,fs:wavt,lh:wavt,ta:"center",sh:win_dat.shad},txtico:specsym.smile}
				,["[[name]]_line"+msep+"4"]:{
					css:{pal:3,all:[hln,,"eval{[[hg]]+([[hln]]+[[hg]])*([[mcount]]-1)}"]
					,bgc:p.infa.lbg,fs:gint(hln*3/4),lh:hln,sh:win_dat.shad}
					,props:{hstretchable:[wavt+2*hg,hg]}
					,ch:{
						"[[name]]_title":{css:{co:"green",po:"relative"}}
						,"[[name]]_sep":{css:{po:"relative"},value:"&nbsp; : &nbsp;"}
						,"[[name]]_value":{css:{co:"blue",po:"relative"}}
					}
				}
			}
		})
		oic=init_obj(nms.infctl,nms.chat,{ //линия сворачивания инф.области
			css:{all:[p.hctrl,,hinf,,,,p.cbg,,,p.hctrl*2,p.hctrl,"center"],cu:"pointer"}
			,props:{hstretchable:true,focusable:true,vmovable:[0,hhst+hent+p.hctrl]}
			,focus:{over:{"[[name]]":{css:{bgc:p.cbgo}}},out:{"[[name]]":{css:{bgc:p.cbg}}}}
			,value:specsym.up
		})
		oav=gO(nms.avtr)
		osh=init_obj(nms.hst,nms.chat,{ //область истории
			css:{all:[hhst,,hinf+p.hctrl],bgc:p.hist.bg}
			,props:{
				scrollable:true,hstretchable:true,keypressable:true
// 				scrollable:{props:{movable:true,scalable:true},scale:{catchid:cname+"_hist"},downshare:cname+"_hist"},hstretchable:true,keypressable:true
			}
			,keystrokes:{keys:{"UP,DOWN,PGUP,PGDN":{func:"keyarrow",type:"keydown"}}}
		})
		oec=init_obj(nms.entctl,nms.chat,{ // область линии упр. над обл. ввода
// 			css:{all:[p.dctrl,,hhst+hinf+p.hctrl,,,,p.cbg,,,,,,,,,,,,"row-resize"]}
			css:{all:[p.dctrl,,hhst+hinf+p.hctrl],bgc:p.cbg,cu:"row-resize"}
			,props:{focusable:true,hstretchable:true,vmovable:[hinf,0]}
			,focus:{over:{"[[name]]":{css:{bgc:p.cbgo}}},out:{"[[name]]":{css:{bgc:p.cbg}}}}
		})

		oe=init_obj(nms.ent,nms.chat,{ //область ввода
			tag:"textarea",css:{resize:"none",all:[hent,,,,0],bgc:p.enta.bg,co:p.enta.tc,br:"none",fs:p.enta.fs}
			,props:{hstretchable:true,keypressable:true} //,vstretchable:[curtop,0]
			,keystrokes:{
				keys:{
					"UP,DOWN,PGUP,PGDN":{func:"keyarrow"}
					,"CTRL+ENTER":{func:"enter"}
					,"ANY":{func:"keyproc",type:"keypress"}
				}
			}
		})
		osh.keyarrow=function(r,k,e){var o=this,lh=p.hist.css.lh
			switch (k) {
				case UP: poO(ohist,ohist.t+=lh);break
				case DOWN:poO(ohist,ohist.t-=lh);break
				case PGUP:poO(ohist,ohist.t+=o.h);break
				case PGDN:poO(ohist,ohist.t-=o.h);break
			}
			corr_scrlarea(o)
// 			setcurobj(o)
		}
		osh.onclick=function(){setcurobj(this)} //;this.state=""

		// поля на футере
		oftst=init_obj(nms.ftst,nms.ft,{css:{all:[owf.h,49,,p.hg]},value:"State:"})
		oftsm=init_obj(nms.ftsm,nms.ft,{css:{mal:9,pal:9,par:9,all:[owf.h,,,49],bgc:ochat.dat.bghd},value:"ready"})
		ohist=gO(nms.hstc) //контейнер истории
		oe.enter=function(){var o=this,rc
			if (!o.statefocus) return false
			rc=iff(fsend,o,o.value);if (rc===false) return false
			if (rc===true) {
				chataddline(o.value,"out")
				o.value=""
				animText(oftsm)
				stO(oftsm,p.msgwait)
				return true
			}
		}
		oe.keyproc=function(r,k,e) {var o=this
			if (!o.statefocus) return
			iff(fpres,r,e.key)
			if (!o.stateanum) {
				o.stateanum=1
				animText(oftsm,p.msgtyping)
			}
			clearTimeout(tmmsg)
			tmmsg=setTimeout(function(){
				animText(oftsm);stO(oftsm,p.msgwait)
				o.stateanum=0
			},showtime)
		}
// 		ochat.stopanim=function(){clearInterval(tmmsg);animText(oftsm)}
		ohist.move_also=function(){corr_scrlarea(osh)}
		oe.onclick=function(e){setcurobj(this)}
		oe.onfocus=function(e){var o=this;o.statefocus=1;if (o.value==p.enta.welc) {o.value="";sfcO(o,p.enta.tc)}}
		oe.onblur=function(e){var o=this;o.statefocus=0;if (strip(o.value)=="") {o.value=p.enta.welc;sfcO(o,p.enta.tcb)}}
		oic.click=function(e){var o=this
			oic.before_move()
			if (o.t<=owh.h) { //опускаем
				animate(oi,"height",oi.h0
					,function(p){
						oic.after_move()
						setattr(oic,"focus","out")
						stO(oic,specsym.up)
					}
					,function(st){poO(oic,oic.t+=st);poO(osh,osh.t+=st);ssO(osh,osh.h-=st)})
			} else { //поднимаем
				animate(oi,"height",-oi.h,function(p){
					oic.after_move()
					setattr(oic,"focus","out")
					stO(oic,specsym.down)
				},function(st){poO(oic,oic.t+=st);poO(osh,osh.t+=st);ssO(osh,osh.h-=st)})
			}
			o.state=""
		}

		ochat.before_resize=ochat.before_move=oic.before_move=oec.before_move=function() {
			if (!isH(osh.animspan))	acO(osh.animspan=cO("span"),osh)
			animText(osh.animspan,"...reordering...");
			css(osh,{lh:osh.h,ta:"center"})
			hide(ohist)
		}

		oic.move_also=function(dt){if (dt!=0) {ssO(oi,oi.h+=dt);ssO(osh,osh.h-=dt);poO(osh,osh.t+=dt)}} //ssO(oi,oi.h+=dt);
		oec.move_also=function(dt){if (dt!=0) {ssO(oe,oe.h-=dt);ssO(osh,osh.h+=dt)}} //poO(oe,oe.t+=dt);
		ochat.resize_also=function(dh){if (dh==0) return
			if (osh.h+dh>sbmin) {
				poO(oec,oec.t+=dh)
				ssO(osh,osh.h+=dh)
				osh.style["line-height"]=osh.h+"px"
			} else ssO(ochat,ochat.h-=dh)
		}
		ochat.after_resize=ochat.after_move=oic.after_move=oec.after_move=function(e){
			animText(osh.animspan);osh.style["line-height"]=osh.style["text-align"]="";stO(osh.animspan,"")
			chatshowhist(ochat)
			corr_scrlarea(osh)
			show(ohist)
		}

		ochat.before_max=ochat.before_min=function(){stO(ohist,"");hide(osh,owh,of,oi,oic,oec,oe)}
		ochat.after_max=ochat.after_min=function() {
			var dlt=ochat.h-owh.h-oi.h-oic.h-oe.h-oec.h-of.h - osh.h
			poO(oec,oec.t+=dlt);ssO(osh,osh.h+=dlt)
			chatshowhist(ochat);show(osh,owh,of,oi,oic,oec,oe)
		}
// ohist.onwheel=function(e){ohist.t+=osh.h/osh.dat.kwheel*mwheel(e)[0];poO(ohist,ohist.t);corr_scrlarea(osh);return false} // не убирать! переключение с масштабирования на перемещение истории
		ochat.chatreset=chatreset; ochat.chataddline=chataddline; ochat.chatshowhist=chatshowhist
		ochat.animTextStop=function(msg){animText(oftsm);stO(oftsm,p.msgwait)}
		ochat.animTextStart=function(msg){animText(oftsm,msg)}
		ochat.lines=[];ochat.pars=p;setsel(ochat,"none")
		css(ohist,p.hist.css)
		chatreset()
// 		oe.focus()
// 		oe.onfocus()
// 		corr_scrlarea(osh)
		return ochat

		function chataddline(){
			var r=arguments,ol=cO(),l=p.hist.line,so
			function fmt(f){
					var otm=cO("span"),oic=cO(),ous=cO("span"),otx=cO("span")
					css(otm,f=="in"?l.timein:l.timeout);stO(otm,getTime())
					css(oic,f=="in"?l.icoin:l.icoout) //; sbiO(oic,l.icosym)
					css(ous,f=="in"?l.unamein:l.unameout);stO(ous,(f=="in" ? (isS(r[2])?r[2]:"unknown") : inf[0][1]) + ":")
					css(otx,f=="in"?l.textin:l.textout);stO(otx,r[0].replace(/\n/g,"<br>"))
					acO(otm,ol);acO(oic,ol);acO(ous,ol);acO(otx,ol)
			}
			if (isS(r[0])) {
				if (r[1]=="in" || r[1]=="out" ) fmt(r[1]) //сообщение
				else if (r[0]=="datatime") {css(ol,l.datatime);stO(ol,"*** " + getDateYMD() +" "+getTime().substr(0,5)+" ***")}
				else if (isO(r[1]) || !r[1]) {if (isO(r[1])) css(ol,r[1]);stO(ol,r[0])} //текстовая строка
			} else if (isH(r[0])) ol=r[0]
			css(ol,l.all)
			ochat.lines.push(ol) //;chatshowhist()
			acO(ol,ohist)
			ssO(ohist,"","") //обнулили размеры
// 			reset_objs(ochat)
			so=gsO(ohist) //новые размеры после добавления объектов
			if (ohist.h<so[0] || ohist.w<so[1]) {
				ssO(ohist,ohist.h=so[0],ohist.w=so[1]);poO(ohist,ohist.t=-so[0]+osh.h,ohist.l=-so[1]+osh.w)
				corr_scrlarea(osh)
			}
		}
		function chatclearhist(){}
		function chatshowhist(){
			ssO(ohist,"","") //обнулили размеры
			stO(ohist,"")
			var a=ochat.lines
			for (i in a) acO(a[i],ohist)
			so=gsO(ohist) //новые размеры после добавления объектов
			ssO(ohist,ohist.h=so[0],ohist.w=so[1]);poO(ohist,ohist.t=-so[0]+osh.h,ohist.l=-so[1]+osh.w)
			corr_scrlarea(osh)
		}
		function chatreset(){ //(пере)установка параметров
			var av=p.infa.avatar
			oe.value=p.enta.welc;sfcO(oe,p.enta.tcb) //welcome text
			var it=p.infa.info,suf
			for (i=0;i<4;i++) {suf=nms.inf+"_line"+(i+1)
				stO(gO(suf+"_title"),it[i][0])
				stO(gO(suf+"_value"),it[i][1])
			}
			if (isS(av) && av.indexOf("data:image")==0) {stO(oav,"");sbiO(oav,av);sbpO(oav,"center center")} else stO(oav,specsym.smile)
			stO(owh,it[0][1]+" "+it[1][1])
			stO(oftsm,p.msgwait)
			corr_scrlarea(osh)
			reset_objs(ochat)
			setcurobj(oe)
			clearInterval(tmmsg);animText(oftsm)
		}
}catch(e){c.log("chat error:",e)}
	}
//*** windows ***
function win(){ //объект параметров окна и необязательно - имя
	var p=args(arguments),[u,n,pn,f]=[p.O[0],p.S[0],p.S[1],p.F[0]]
		var o,wd=clone(win_dat,u) //копия заготовки данных для window
		if (!isS(n) && !isS(wd.name)) n=genname("win_");
		if (!wd.htxt) wd.htxt=wd.name
		o=init_obj(wd,n,pn,f)
		reset_objs(o)
		return o
}
//*** accordeon ***
//аккордеон - это группа элементов, каждый из которых содержит кнопку и область одинаковой ширины,
// при нажатии кнопки происходит открывание/закрывание области. В группе может быть открыт только один элемент.
	function accordion() {
		var a=args(arguments),[name,pname,fsel,finit,vals,upd]=[a.S[0],a.S[1],a.F[0],a.F[1],a.A[0],a.O[0]]
		,i,o,la,lb,blst,alst
		,p={
			ncur:1 //номер закладки поумолчанию при старте.
			,t0:5 //отступ сверху 1 кнопки
			,hb:30 //высота кнопки
			,hmina:99 //мин. высота инф. области аккордиона
			,vg:5 // вертик.промежуток между кнопками
			,hg:15 // вертик.промежуток между кнопками
			,fsb:15 // размер шрифта кнопки
			,brdb:"dotted 1px #cbf",brd2:"solid 1px #9af" //цвета границ кнопки и области
			,bcb:"#9ad #fff",bcbd:"#fff #ddd" //отжатая/нажатая кнопка аккордиона
			,bcbp:"#ccc #eee" // цвет кнопки во время открытия/закрытия элемента аккордеона
			,bca:"#bef #fff" //цвет инф.области элемента
			,shsel:"inset 0 0 19px 1px yellow"
			,delay:comdelay
			,css:{all:["[[h]]","[[w]]"]}
			,props:{keypressable:true} //,pressable:true
		}
		upd_obj(p,upd)
		lb="[[name]]_but"+msep+"[[n]]";la="[[name]]_area"+msep+"[[n]]" //макроподстановки
		if (!isA(vals)) {vals=["Values","of","items","not","found",";)"]}
		if (!isS(p.name)) p.name=genname("acc")
		if (!isF(fsel)) fsel=function(ot,o) {stO(o,sp(3)+"You are selected <b>\""+gtO(ot)+"\"</b> tab. No user function for it")}
		if (!isN(p.hmin)) p.hmin=2*p.t0 + vals.length*(p.hb+p.vg)-p.vg
		if (!isN(p.wmin)) p.wmin=p.hmin
		if (!isN(p.ha)) p.ha=p.hmina
		if (!isN(p.h)) p.h=p.hmin+p.ha
		if (!isN(p.w)) p.w=2*p.hmin
		o=init_obj({name:p.name,pname:p.pname  //данные аккордеона.  Состоят из контейнера, заготовок: кнопки и области.
			,n:vals.length,values:vals
			,blst:lb,alst:la
			,vg:p.vg,hg:p.hg
			,t0:p.t0,hb:p.hb
			,h:p.h,w:p.w
			,keystrokes:{
				pars:{active:{css:{sh:p.shsel}},unactive:{css:{sh:"none"}},list:[lb+"+1"]}
				,keys:{DOWN:{action:"next",type:"keydown"},UP:{action:"prev",type:"keydown"},ENTER:{action:"press"}}
			}
			,css:p.css
			,props:p.props
			,resizing_all:["[[name]]"]
			,ch:{
				"[[blst]]": {
					props:{pressable:true,hstretchable:["[[hg]]","eval{[[hg]]+2}"]}
					,css:{all:[p.hb,,"eval{ [[t0]] + ([[mcount]]-1)*([[hb]]+[[vg]]) }",,,,p.bcb,,p.brdb,p.fsb,p.hb,"center",,,,,3,,"pointer"]}
					,press:{
						down:		{"[[name]]":{css:{bgc:p.bcbd}}}
						,up: 		{"[[name]]": {css: {bgc:p.bcb}}}
						,process:{"[[name]]":{css:{bgc:p.bcbp}}}
					}
					,value:"eval{ [[pname]].dat.values[ [[mcount]]-1 ]}"
				}
				,"[[alst]]": {
					css:{
							vi:"hidden",br:p.brd2,bgc:p.bca
						,all:[p.ha,,"eval{ [[t0]] - [[vg]] + [[mcount]] * ([[hb]]+[[vg]]) }"]
					}
					,props:{hstretchable:["[[hg]]","eval{[[hg]]+2}"]}
				}
			}
		})
		o.pars=p
		blst=multia([o.dat.blst+"+1"]); alst=multia([o.dat.alst+"+1"]) //сгенериров. списки названий кнопок и областей
// o.animstate=0 //для отслеживания завершений анимаций
		for (i=0;i<blst.length;i++) {
			gO(blst[i]).click=function() {
				function checko() {check(1)}
				function check(t) {o.animstate-=1;if (o.animstate==0) {if (t) {o.cur=n; iff(fsel,o,ob,oa)} else o.cur=null;ob.pressfree()}}
				if (o.animstate>0) return
				var ob=this,n=ob.dat.mcount,oa=gO(alst[n-1])
				if (o.cur==null) o.open(n,p.delay,checko) //закрыт - открываем
				else if (o.cur==n) o.close_item(n,p.delay,check) //открыт этот же - закрываем
				else {o.close_item(o.cur,p.delay/2,function(){ //предыдущий закрываем, выбранный открываем
						o.animstate-=1;if (o.animstate>0) return
						o.open(n,p.delay/2,checko)
				})}
			}
		}
		o.open=function(n,t,f) {var oa=gO(alst[n-1])
			o.animstate=blst.length-n+1 //счетчик анимаций
			if (o.h<p.hmin+p.hmina) {p.ha=p.hmina;ssO(o,o.h=p.hmin+p.hmina)} //увелич до мин с area
			else if (o.h>p.hmin+p.ha) p.ha=o.h-p.hmin //увелич область
			for (var i=0;i<blst.length-n;i++) animate(gO(blst[n+i]),"top",p.ha,t,f)
			ssO(oa,0);show(oa);fadein(oa)
			animate(oa,"height",p.ha,t,f)
		}
		o.close_item=function(n,t,f) {var oa=gO(alst[n-1])
			o.animstate=blst.length-n+1 //счетчик анимаций
			for (var i=0;i<blst.length-n;i++) animate(gO(blst[n+i]),"top",-p.ha,t,f)
			fadeout(oa);animate(oa,"height",-p.ha,t,f)
		}
		o.resize_also=function(){
				if (o.cur==null && o.h<p.hmin) ssO(o,o.h=p.hmin)
				else if (isN(o.cur) && o.h<p.hmin+p.ha) ssO(o,o.h=p.hmin+p.ha)
		}
		o.clickitem=function(n) {gO(blst[n]).click()}
		setcurobj(o)
		return o
	}
// *** matrix ***
	function matrix(){
		var a=args(arguments),[u,uc,f]=[a.O[0],a.O[1],a.F[0]]
		var d={
			gap:3,m:3,n:3,hi:33,wi:33 //размерность и размеры
			,css:{all:["eval{([[hi]]+[[gap]])*[[m]]+[[gap]]}","eval{([[wi]]+[[gap]])*[[n]]+[[gap]]}"]}
			,ch:{"[[name]]_item[[msep]]eval{[[n]]*[[m]]}":{
					it:"gint(([[mcount]]-1)/[[n]])",il:"(([[mcount]]-1) - gint(([[mcount]]-1)/[[n]])*[[n]])",ih:"([[hi]]+[[gap]])",iw:"([[wi]]+[[gap]])"
					,css:{all:["[[hi]]","[[wi]]","eval{[[gap]]+[[it]]*[[ih]]}","eval{[[gap]]+[[il]]*[[iw]]}",,,"#ccc",,,,"[[hi]]"],ta:"center"}
					,value:"[[mcount]]"
			}}
		}
		upd_obj(d,u)
		upd_obj(d.ch["[[name]]_item[[msep]]eval{[[n]]*[[m]]}"],uc)
		return init_obj(d,f)
	}
// *** colorpicker ***
	function colorpicker() {
		var a=args(arguments),[name,func,funcstep,upd]=[a.S[0],a.F[0],a.F[1],a.O[0]]
			,wi,hi,vg2,wcb,hbf,of,i
			,p={
				vg:9,hg:5 //промежутки
				,h:399 //320
				,w:133 //размер
				,hh:13,vh:"Colors" //заголовок
				,fh:39 //нижний отступ
			}
//ширина главного colorbar берется как 1/4 ширины окна
//по горизнтали: vg+wcb+vg2+wi+vg
// ,colors=["#ff00fe #ff0000","#0100ff #ff00ff","#00feff #0000ff","#00ff01 #00ffff","#feff00 #00ff00","#ff0000 #ffff00"]
// ,colorsRGB=["#000000 #ff0000","#000000 #00ff00","#000000 #0000ff"]
		upd_obj(p,upd)
		wcb=gint(p.w/4)
		wi=gint(wcb/2) //Элемент colorbar"
		hi=p.h-p.hh-p.vg-p.fh
		vg2=p.w-4*p.vg-wcb-wi*3
		hbf=p.h-p.hh-3*p.vg-hi
		wbf=gint((p.w-4*p.hg)/2)
		of=vg2+wcb+p.vg
		i=hi%6;if (i<3) hi-=i;else hi+=6-i //выравнимаем до кратности 6
		var dat={
			css:{all:[p.h,p.w,,,,,"#eee",,"#aaa",,,,,,,,3,"0 0 3px 1px #aaa","pointer"]}
			,props:{movable:true,closable:[9,10,2,,,1,,,,10,9],keypressable:true,pressable:true}
			,move:{catchid:"[[name]]_hdr"}
			,keystrokes:{
				pars:{active:{css:{sh:"0 0 9px 1px yellow",br:"#aa0"}},unactive:{css:{sh:"none",border:"none"}}
				,list:["[[name]]_cs","[[name]]_RGB"+msep+3+"+1"]}
				,keys:{
					LEFT:{action:"prev"}
					,RIGHT:{action:"next"}
					,ENTER:{func:"finish"}
					,UP:{func:"keyup",type:"keydown"}
					,DOWN:{func:"keydown",type:"keydown"}
				}
			}
			,sels:{"[[name]]_cs":"[[name]]_csl","[[name]]_RGB1":"[[name]]_csl1","[[name]]_RGB2":"[[name]]_csl2","[[name]]_RGB3":"[[name]]_csl3"}
			,hi:hi/6
			,ch:{
				"[[name]]_hdr":{css:{all:[p.hh,p.w,,,,,"#eaf #fff",,,p.hh-1,p.hh,"center",,,,,,,"pointer"]},value:p.vh}
				,"[[name]]_cs":{
					css:{all:[,wcb,,p.hg]}
					,props:{vstretchable:[p.hh+p.vg,p.fh+2],pressable:true}
					,keystrokes:{keys:{UP:{func:"keyup",type:"keydown"},DOWN:{func:"keydown",type:"keydown"}}}
					,ch:{["[[name]]_item"+msep+6]:{clrs:rainbow,css:{all:[hi/6,wcb,"eval{([[mcount]]-1)*[[hi]]}",,,,"eval{[[name]].dat.clrs[ [[mcount]]-1 ]}"]}}}
					,downshare:["[[name]]_item"+msep+6],upshare:["[[name]]_item"+msep+6]
				}
				,"[[name]]_csl": {
					css:{all:[3,wcb+4,p.hh+p.vg-2,p.hg-3],bgc:"#777 #fff",op:77,ro:2,cu:"pointer"},props:{vmovable:[p.hh+p.vg-2,p.fh+2]},type:"selector"
				}
				,["[[name]]_RGB"+msep+3]:{
					wi:wi,vg:p.vg,of:of
					,clrs:colorsRGB
					,css:{all:[hi,wi,,"eval{[[of]]+([[mcount]]-1)*([[vg]]+[[wi]])}",,,"eval{[[name]].dat.clrs[ [[mcount]]-1 ]}"]}
					,props:{vstretchable:[p.hh+p.vg,p.fh],pressable:true}
				}
				,["[[name]]_csl"+msep+3]:{
					wi:wi,vg:p.vg,of:of-3
					,type:"selector"
					,css:{all:[5,wi+4,p.hh+p.vg-2,"eval{[[of]]+([[mcount]]-1)*([[wi]]+[[vg]])}"],ro:2,op:77,bgc:"#777 #fff",cu:"pointer"}
					,props:{vmovable:[p.hh+p.vg-2,p.fh]}
				}
				,"[[name]]_infc":{css:{all:[hbf,wbf-10,,p.hg,p.vg,,"#aee #fff",,"gray",,,,,,,,3,win_dat.shad,"pointer"]},value:"Select",tag:"button"}
				,"[[name]]_inft":{css:{all:[hbf,wbf+10,,,p.vg,p.hg,"#eef",,"gray",14,hbf,"center",,,,,,,"text"]}}
			}
		}
		if (name==null) name=genname("colorpicker",1)
		var o=init_obj(dat,name)

		var ocb=gO(name+"_cs"),ocsl=gO(name+"_csl"),oinfc=gO(name+"_infc"),oinft=gO(name+"_inft")
			,ocbR=gO(name+"_RGB1"),ocslR=gO(name+"_csl1"),ocbG=gO(name+"_RGB2"),ocslG=gO(name+"_csl2"),ocbB=gO(name+"_RGB3"),ocslB=gO(name+"_csl3")
		setsel(o,"none");setsel(oinft,"text")
		oinfc.click=o.finish=function(){var clr=o.color;fadeout(o,function(){dO(o);iff(func,o,clr)})}
		ocsl.after_move=ocslR.after_move=ocslG.after_move=ocslB.after_move=function(){setcurobj(o)}
		function ms(r,d){move_obj(gO(r[2].dat.sels[r[1].pars.list[0]]),d)} //move selector
		o.keyup=function(r){ms(r,-1)}
		o.keydown=function(r){ms(r,1)}
		ocb.click=function(e){var ob=this,ot=e.target
			poO(ocsl,ocsl.t=o.dat.hi*(gint(ot.id[ot.id.length-1])-1)+e.layerY+p.hh+p.vg)
			ocsl.move_also();ob.state=""
		}
		ocbR.click=ocbG.click=ocbB.click=function(e){var ob=this
			,obs=ob==ocbR?ocslR:ob==ocbG?ocslG:ocslB
			poO(obs,obs.t=e.layerY+p.hh+p.vg)
			obs.move_also();ob.state=""
			ob.state=""
		}
		ocb.onwheel=ocbR.onwheel=ocbG.onwheel=ocbB.onwheel=function(e){var dlt=e.deltaY<0?-1:1
			,ob=this,obs=ob==ocb?ocsl:ob==ocbR?ocslR:ob==ocbG?ocslG:ocslB
			if (obs.t+dlt<ob.t0-2 || obs.t+dlt>ob.t0+ob.h0-2) return
			poO(obs,obs.t+=dlt)
			obs.move_also()
			return false
		}
		function calclr(v,gr) { //возвращает цвет из градиента gr, соотв. значению 'v' (положение точки относительно начала области с градиентом)
			var i=-1,hc1=[],hc2=[],nclr=[],rng=gr.split(" ")
			while (++i<3) {
				hc1[i]=x2d(rng[0].substr(i*2+1,2))
				hc2[i]=x2d(rng[1].substr(i*2+1,2))
				if (hc1[i]==hc2[i]) nclr[i]=d2x(hc2[i])
				else if (hc2[i]==255) nclr[i]=d2x(hc2[i]-v)
				else if (hc2[i]==0) nclr[i]=d2x(hc2[i]+v)
			}
			return "#"+nclr[0]+nclr[1]+nclr[2]
		}
		ocsl.move_also=ocslR.move_also=ocslG.move_also=ocslB.move_also=function(dt){
			var os=this,ci,t=os.t-os.t0,h=hi/6, rng, v
			if (os==ocsl) { //главный colorbar
				var ind=gint(t/h),rng
// 				v=round(t*(255/h)-255*ind)
// 				v=round(t*255/h-255*ind)
				v=round(255*(t/h-ind)) // t*255/h-255*ind)
				if (ind==6) {ind-=1;v=255}
				rng=rainbow[ind]
				o.color=calclr(v,rng)
				var cdR=x2d(o.color.substr(1,2))
					,cdG=x2d(o.color.substr(3,2))
					,cdB=x2d(o.color.substr(5,2))
				poO(ocslR,ocslR.t=hi-cdR*hi/255+p.hh+p.vg-2)
				poO(ocslG,ocslG.t=hi-cdG*hi/255+p.hh+p.vg-2)
				poO(ocslB,ocslB.t=hi-cdB*hi/255+p.hh+p.vg-2)
			} else {
				v=255-round(t/hi*256)
				if (v<0) v=0
				if (os==ocslR) o.color="#"+d2x(v)+o.color.substr(3,4)
				else if (os==ocslG) o.color=o.color.substr(0,3)+d2x(v)+o.color.substr(5,2)
				else o.color=o.color.substr(0,5)+d2x(v)
			}
			sbcO(oinft, o.color);stO(oinft, o.color)
			ci=invclr(o.color);
			ocsl.style.border="solid 1px "+ci;

			sfcO(oinft,ci)
			iff(funcstep,o,o.color,invclr(o.color))
		}
		poO(ocsl,ocsl.t=ocb.t+ocb.h/2) //селектор "радуги" установили на середину
		ocsl.move_also();setcurobj(o)
		return o
	}
// *** tree ***
function tree(){ //eval{[[hl]]*[[scaling_factor]]}
	var p=args(arguments),[tname,rname,tdat,upd,f1,f2]=[p.S[0],p.S[1],p.O[0],p.O[1],p.F[0],p.F[1]]
	,d={
		hl:19 //высота строки с элементом дерева
		,hgap:7,vgap:3 //промежуток между гориз. и вертик. элементами
		,sp:"_"
		,sl:"dotted 1px black" // вид соединит. линий
		,shad0:"0 0 3px 0 #333",shad1:"inset 0 0 3px 0 #333",shad2:"inset 0 0 9px 1px #ccf"
		,ncss:{sh:"[[shad0]]",all:["[[hl]]","[[hl]]",3,3],cu:"pointer",bgi:app.minus_img,bgc:"#ff0",bgp:"center",bgs:"66%"}
		,nmax:maxdeep,delay:shortdelay
	}
	,n=0
	,nodes=[],f1lst=[]
	upd_obj(d,upd)
	if (!isS(rname)) rname=genname("tree");if (!isS(tname)) tname="root";	if (!isS(d.name)) d.name=name
	var otree=init_obj(step_init(tdat,0,tname,rname),rname,d.pname)
// 	otree.dat.tdat=tdat
	if (isO(d.css)) css(otree,d.css)
	for (i in nodes) gO(nodes[i]+"n").click=click
	if (isF(f1)) for (i in f1lst) {gO(f1lst[i]+"t").click=function(){iff(f1,this,this.dat.tdat)}}
// 	stretch(otree)
	return otree
	function click(e,state,o){var i,oo,N,lst,nm,pn=o.dat.pname,op,dlt,ot
		if (pn==otree.id) {op=otree;ot=gO(pn+"_0t")} else {op=gO(pn);ot=gO(pn+"t")}
		if (isF(f2) && iff(f2,this,!ot?tdat:ot.dat.tdat,o.dat.tstate)===false) return false
		if (!o.dat.tstate) {
				o.dat.tstate=1;sbiO(o,app.plus_img)
				op.dat.props.focusable=false
				op.save.h=op.h/op.scaling_factor //orig height
				sshO(o,o.dat.shad1)
				dlt=op.h-ot.h //*o.scaling_factor
				animate(op,"height",-dlt,d.delay,step)
		} else {
			o.dat.tstate=0;sbiO(o,app.minus_img);sshO(o,o.dat.shad0)
			dlt=op.h-op.save.h*o.scaling_factor
			iff(step,op)
			animate(op,"height",-dlt,d.delay)
		}
		o.state=""
		return false
		function step(){var i,oo,lst,o=this,nm=o.id,pnm=o.dat.pname,op=gO(pnm);if (!isH(op)) return // поднимает/опускает поддерево по клику узла
			function up0(n,s){var o=gO(n+s);if (isH(o)) {poO(o,o.t-=dlt);return true}}
			function up(n){var i,s=["v","h","n","t"];if (!up0(n,"")) for (i in s) up0(n,s[i]);else up0(n,"v")}
			oo=gO(pnm);if (isH(oo)) ssO(oo,oo.h-=dlt)
			lst=op.dat.lst;N=lst.length
			up0(nm,"v")
			for (i=0;i<N;i++) if (lst[i]==nm) break
			for (i=i+1;i<N;i++) up(lst[i])
			iff(step,op)
// reset_obj(otree.parentNode)
		}
	} //end click
	function step_init(o,l,pval){ //рекурсивное формироване данных
		var nm,o0,o1,N1,i,oc,nms=keys(o),N=min(nms.length,d.nmax),prf=rname+d.sp,nm=prf+n
		,h0=d.vgap+d.hl/2,h1=d.vgap+d.hl,w0=d.hgap+d.hl/2,w1=d.hgap+d.hl,w2=d.hgap+d.hl*3/2
		,f1upd={css:{cu:"pointer"},props:{focusable:true,pressable:true},focus:{over:{"[[name]]":{css:{sh:d.shad2}}},out:{"[[name]]":{css:{sh:"none"}}}}}
		,dat={lst:[] //поддерево
			,css:{all:["[[h]]",,"[[t]]"]}
			,props:{hstretchable:l==0?true:[w1,0]}
			,ch:{},h:d.hl+d.vgap,t:0,n0:n
			,name:nm
		}
		function setf1(d,n){if (!isF(f1)) return
			var o=dat.ch[nm+"t"]; o.tdat=d
			o.name=nm+"t"

			upd_obj(o,f1upd) //модификация поля для подсветки
			f1lst.push(nm)
		}
		nodes.push(nm)
		dat.ch[nm+"v0"]={css:{all:[h0,1,d.hl,w2],brl:d.sl}}
		dat.ch[nm+"h"]={css:{all:[1,w0,d.hl/2,d.hl/2],brt:d.sl}}
		dat.ch[nm+"t"]={css:{all:[d.hl],lh:d.hl},value:pval,props:{hstretchable:[w1,0]}}
		setf1([pval,o],nm)
		dat.ch[nm+"n"]={hl:d.hl-6,shad0:d.shad0,shad1:d.shad1,css:d.ncss,props:{pressable:true}}
		for (i=0;i<N;i++) {
			nm=prf+(++n)
			o1=(i==d.nmax-1)?{"max items reached":">"+d.nmax}:o[nms[i]]
			N1=lkeys(o1)
			if (N1>0) {
				oc=step_init(o1,l+1,nms[i],nm)
				oc.t=dat.h; dat.h+=oc.h; dat.ch[nm]=oc
				if (i<N-1) {
					dat.ch[nm+"v"]={css:{all:[h0,1,dat.h,w2],brl:d.sl},props:{movable:true}}
					dat.ch[nm].ch[nm+"w"]={css:{all:[oc.h-d.hl,1,d.hl-1,d.hl/2],brl:d.sl}}
				}
			} else {
				if (i<N-1) dat.ch[nm+"v"]={css:{all:[h1,0,dat.h+d.hl/2,w2],brl:d.sl}}
				dat.ch[nm+"h"]={css:{all:[1,w0,dat.h+d.hl/2,w2],brt:d.sl}}
				if (N1==0) dat.ch[nm+"n"]={css:{all:[d.hl/2,d.hl/2,dat.h+d.hl/4,w1+d.hl/4,,,"#ccc",,"gray"],ro:d.hl/2+"px"}}
				dat.ch[nm+"t"]={value:nms[i]+(N1==0?"":":"+o1),css:{all:[d.hl,,dat.h,,,,,,,,d.hl]},props:{hstretchable:[2*w1+2,1]}}
				setf1([nms[i],o1])
				dat.h+=h1
			}
			if (N1>0) dat.h+=d.vgap
			dat.lst.push(nm)
		}
		dat.h-=d.vgap
		return dat
	}
}
// *** end of widgwets **
	function create_tmpl([h,w,t,l],pnm,nm,dat,clr) {
// try{}catch(e){c.log(e)}
		var [h,w]=[max(minsz[0],h),max(minsz[1],w)]
		,p=gapO(pnm);	if (isA(p)) {t-=p[0];l-=p[1]}
		if (!clr) clr=rndcolor()
		if (!dat) dat={
			shad:"3px 3px 19px 3px"
			,props:{connectable:true,movable:true,maximizable:true,resizable:true,closable:true,scalable:true} //,value:"[[name]]"
			,css:{all:[h,w,t,l,,,clr[0],clr[1],clr[1],13,,"center",19,,19,,3,"[[shad]] "+clr[0],"pointer"]}
			,bgc:clr
			,downshare:["[[name]]_hdr"] //за заголовок тоже можно двигать
			,ch:{
				"[[name]]_hdr":{css:{bgc:clr[0]+" #fff",fs:14,lh:15,ta:"center",he:17,cu:"pointer",op:70},props:{hstretchable:true},value:"[[pname]]"}
				,"[[name]]_mnu":{
					css:{bgc:clr[0]+" "+clr[1],cu:"pointer",ro:8,all:[17,17]},props:{pressable:true,focusable:true}
					,focus:{over:{"[[name]]_mnu":{css:{bgc:clr[0]+" "+clr[1]}}},out:{"[[name]]_mnu":{css:{bgc:clr[1]+" "+clr[0]}}}}
					,press:{down:{"[[name]]_mnu":{css:{bgc:clr[1]}}},up:{"[[name]]_mnu":{css:{bgc:clr[1]+" "+clr[0]}}}}
				}
			}
			,resizing:["[[name]]_hdr"]
			,catch:{over:{"[[name]]":{css:{sh:"[[shad]] "+clr[1]}}},out:{"[[name]]":{css:{sh:"eval{[[name]].dat.css.all[17]}"}}}}
		}; else c.log("!!!",dat)
		if (!nm) nm=(isS(pnm) && pnm.indexOf(app.tmplpref)==0)?genname(pnm+"_"):genname(app.tmplpref)
		return init_tmpl(init_obj(nm,pnm,dat),clr)
	}
// Если объект при движении задерживается на longdelay, то, в зависимости от его пропорций и положения относительно родителя он растягивается и приклелеивается к границе родителя
	function init_tmpl(o,clr) { //Здесь функционал шаблона
// try{}catch(e){c.log(e)}
		o.style.minHeight=o.style.minWidth="19px"
		o.click=function(e,state,o) {
			c.log("click state",o.id,state,o.state);o.state="";return false
		}
		o.rclick=function(o) {var bnm=o.id+"_but4copy"
			if (isH(gO(bnm))) return
			var ob=init_obj({ //button for copy
				css:{all:[33,133,,,3,13,clr[0]+" #fff",,"gray",,,,,,,,5,win_dat.shad,"pointer"]}
				,value:"copy to\nclipboard",tag:"button"
				,props:{closable:[,,2,,,1],pressable:true,movable:true}
				,move:{down:{"[[name]]":{css:{sh:"none",br:"none"}}}}
				,name:bnm
				,pname:o.id
			})
			ob.click=function(){
				txt2cb(o2t(o.dat))
				fadeout(ob,dO)
			}
			return false
		}
		o.dblclick=function(e) {
			c.log("ondblclick",this.id,arguments)
		}
		o.longclick=function(e,state,o){
			c.log("longclick",e,state,o.id)
			init_obj(o.id+"_transformed",o.dat.pname,{css:{all:[o.h,o.w,o.t,o.l,,,o.dat.css.all[6]]}}).dblclick=recreate
			dO(o)
		}
		o.caughton=function(po) {var ar=o.save.catchers, n=valinobj(po.id,ar);if (!isN(n)) ar.unshift(po.id)}
		o.caughtoff=function(po) {var ar=o.save.catchers, n=valinobj(po.id,ar);if (isN(n)) ar.splice(n,1)}
		function trytrans(t,l,e){ //попытка трансформировать приклеенный шаблон
			if (!e.ctrlKey) {// try transform
				var ori=orient(o,9);if (ori==o.save.ori) return //нет изменений
				var p=o.dat.props,so=gsO(o),pt={},all=[]
				o.save.ori=ori
				if (ori=="in" || valinobj(ori,["t","r","b","l"])===false) { //по углам и в центре игнорируем
					if (o.oristate==1) {
						var ot=gO(o.id+"_transformed");
						clearTimeout(o.save.oritm);if (isH(ot)) {dO(ot)};o.oristate=0
					}
				} else if (!o.oristate) {o.oristate=1;o.save.oritm=setTimeout(function(){
					if (o.h<o.w) {
						pt.hstretchable=true
						if (ori=="t") all=[o.h,,0]
						else if (ori=="b") all=[o.h,,,,0]
						else all=[o.h,,o.t]
					} else if (o.h>o.w) {
						pt.vstretchable=true
						if (ori=="l") all=[,o.w,,o.l]
						else if (ori=="r") all=[,o.w,,,,0]
						else all=[,o.w,,o.l]
					}
						all[6]=o.dat.css.all[6] //bg color
					init_obj(o.id+"_transformed",o.dat.pname,{css:{all:all},props:pt})
				},longdelay)}
			}
		}
		function recreate(e){var o=this
			var [h,w]=gsO(o),[t,l]=gapO(o)
				,nm=o.id.substr(0,o.id.length-12)
				,pnm=o.dat.pname,clr=rgb2hex(gbcO(o));clr=[clr,invclr(clr)]
				dO(o)
				create_tmpl([h,w,t,l],pnm,nm,null,clr)
		}
o.close_also=function(e){
	c.log(this.id,e)
}
		o.before_move=function(e){//var o=this
// try{}catch(e){c.log(e)}
			sshO(o,"none");sopO(o,50);sofhpO(o)
			if (e.ctrlKey) { //заполняем массив "catchers" других заготовок
				var i,pn=o.dat.pname
				o.dat.catchers=[];o.save.catchers=[]
				o.save.pos=gapO(o) //запомнили абсолютную позицию
				for (i in names) if (chktmpl(names[i]) && names[i]!=o.id && valinobj(names[i],o.dat.catchers)===false) o.dat.catchers.push(names[i])
c.log("!!",pn,o.dat.catchers)
				if (isH(pn)) { //есть родитель
					acO(o,d.body)
					poO(o,o.t=o.save.pos[0],o.l=o.save.pos[1])
					o.save.pname=o.dat.pname
					o.dat.pname=null
// 					return false
				}
			} else {o.save.pos=0;o.dat.catchers=[];o.save.catchers=[]}
		}
		o.resize_also=o.move_also=trytrans
		o.after_move=function(e,state,co) {
			rofhpO(o)
			if (o.oristate==1) { //признак "приклеивания"
				o.oristate=0
				clearTimeout(o.save.oritm)
				var nm=o.id+"_transformed",on=gO(nm)
				if (isH(on)) {
					try{gO(on.dat.pname).dat.resizing.push(nm)}catch(e){}
					on.dblclick=recreate
					dO(o)
				}
				return
			}
			sshO(o,o.dat.css.all[17]);sopO(o,100)
// c.log(o.id,o.dat.css.all[17])
			var ppo,ap=gapO(o),ovid=o.save.catchers[0],opn=gO(ovid),pid=o.dat.pname,op=gO(pid)
			setattr(opn,"catc h","out");setattr(o,"caught","out")
			if (isA(o.save.pos)) {//было нажатие "ctrl" перед движением
				if (!e.ctrlKey) {
					if (isH(gO(o.save.pname))) {o.dat.pname=o.save.pname;o.save.pname=null;pid=o.dat.pname,op=gO(pid)}
					animate(o,"top",o.save.pos[0]-ap[0],shortdelay)
					animate(o,"left",o.save.pos[1]-ap[1],shortdelay+3
					,function(){
						if (isH(op)) {
							ppo=gapO(op);acO(o,op) ;poO(o, o.t-=ppo[0], o.l-=ppo[1])
// c.log(op.id,o.id,ppo,o.save.pos[0],ap[0],o.save.pos[1],ap[1])
						}
					})
				} else if (isH(opn)) { //отдаем другому родителю (opn)
					ppo=gapO(opn);acO(o,opn);o.dat.pname=ovid
					poO(o, o.t-=ppo[0], o.l-=ppo[1])
				} else if (isH(op)) { //выходим от другого родителя (pid)
					ppo=gapO(op);acO(o,d.body);delete o.dat.pname
				}
			}
			o.save.pos=0
		}
	}

	function init_docintr() { //glabal rCtrl
// try{}catch(e){c.log(e)}
		d.oncontextmenu = function(e){
	// Вызывает "app.rclick", если задана
	// Если над объектом и он текущий, выполняется o.rclick
			var o=e.target
 			if (iff(app.rclick,e,o)===false) return false
			if (iff(o.rclick,e,o)===false) return false
		}
		d.ondblclick=function(e){
			var o=e.target
 			if (iff(app.dblclick,o,e)===false) return false
			if (iff(o.dblclick,o,e)===false) return false
		}
		d.onmousedown=function(e) {
			if (app.state=="ok" && chkcas(e)!==true && e.button==0) try {
// c.log("d.onmousedown",e.target)
				if (curobj) return iff(curobj.mousedown,curobj,e); else return
			} catch(e){c.log(e);return}

			if (chkcas(e)===true && e.button==0) {
				if (isO(tasks[app.oscreen.id+"_fadein"])||isO(tasks[app.oscreen.id+"_fadeout"])) return false //не отработала амимация экрана
				var nm=e.target.id
				if (chkspecobj(nm)) return false
				if (isS(nm) && nm.length>0) {nm=nm.split("_");nm=nm[nm.length-1]}
				if (!isF(app.selfunc))app.selfunc=create_tmpl
				app.state="selecting"
				clearTimeout(e.target.tmdown) //ожидание для длинного клика
				app.osel=init_obj({css:{all:[1,1,app.mouse.t,app.mouse.l,,,"white",,"black"],op:33,zi:zindexMax+1}})
				app.tsel=e.target.id
				fadein(oscr,shortdelay)
				return false
			}
		}
		d.onblur=d.onmouseup=function(e) {
			if (app.state=="selecting") {
				if (chkcas(e)===true) {var o=app.osel
					fadeout(oscr,shortdelay)
					dO(o)  //;delete app.selfunc
					app.state="ok"
					iff(app.selfunc,e,[o.h,o.w,o.t,o.l],app.tsel)
				}
				return false
			}
			if (isH(curobj) && curobj.state!=""){ //потерянные отжатия
				if (curobj.state=="move") iff(curobj.after_move,curobj,e)
			}
			scO(d.body,'default') //restore cursor
			try {curobj.mousemove=null;if (curobj.state!="process") curobj.state=""
				if (isH(curobj) && (curobj.dat.props.movable || curobj.dat.props.hmovable || curobj.dat.props.vmovable)) setattr(curobj,"move","up")
			}catch(e){}
			if (isH(curobj)) return iff(curobj.mouseup,curobj,e)
		}
		d.onmousemove=function(e) {var X=e.clientX,Y=e.clientY
// 			if (Y>app.hw || X>app.ww) return
			if (app.state=="selecting") {
				if (chkcas(e)!==true || !isF(app.selfunc)) {
					dO(app.osel);app.osel=null;app.state="ok";hide(oscr)
				} else {
					if (Y<app.osel.t0) {poO(app.osel,app.osel.t=Y); ssO(app.osel,app.osel.h=app.osel.t0-Y)}
					else if (Y>app.osel.t0) {poO(app.osel,app.osel.t=app.osel.t0); ssO(app.osel,app.osel.h=Y-app.osel.t0)}
					if (X<app.osel.l0) {poO(app.osel,null,app.osel.l=X); ssO(app.osel,null,app.osel.w=app.osel.l0-X)}
					else if (X>app.osel.l0) {poO(app.osel,null,app.osel.l=app.osel.l0); ssO(app.osel,null,app.osel.w=X-app.osel.l0)}
				}
				return
			}
			app.mouse.dt=Y-app.mouse.t;app.mouse.dl=X-app.mouse.l
			app.mouse.t=Y;app.mouse.l=X
			if (isV(app.torch)) poO(app.torch,app.mouse.t+1,app.mouse.l+1)
			if (isH(curobj)) return iff(curobj.mousemove,curobj,e)
		}
		d.onkeydown=function(e)	{if (isH(curobj)) return iff(curobj.___keydown___,curobj,e.keyCode,e)}
		d.onkeyup=function(e)	{if (isH(curobj)) return iff(curobj.___keyup___,curobj,e.keyCode,e)}
		d.onkeypress=function(e){if (isH(curobj)) return iff(curobj.___keypress___,curobj,e.keyCode,e)}
	}

	function inittmpl(tmpl) {for (var i in tmpl) if (i=="body") css(d.body,tmpl[i].css); else init_obj(i,tmpl[i])} //для body только css

	function loadImages() { //групповая загрузка картинок из списка "l", по завершению в l[name].o содержат <DOM-объект img>; // формат l = <name>:<url>
		var er,i,im={},tw,ct=clearTimeout,cnt=0
		,p=args(arguments),[fn,fns,l,tm]=[p.F[0],p.F[1],p.O[0],p.N[0]] //fns - функция, которая выполняется после загрузки каждого файла
		,n=lkeys(l)
		function clr(){for (i in im) im[i].src=null}
		if (!n) {er=new Error(errors[0]+": "+errors[1]);iff(fn,im,er);return er} //list empty - синхр.вызываем callback с ошибкой и выходим с ошибкой
		if (!isF(fn)) return new Error(errors[0]+": "+errors[2]) //"The callback function is wrong")
		if (isN(tm)) tw=setTimeout(function(){clr();er=new Error("Timeout");iff(fn,im,er)},tm) //если задано число, запускаем timeout - ограничение по времени выполнения
		for (i in l) {
			im[i]=new Image(); im[i].src=l[i]; im[i].name=i
			im[i].onerror=im[i].onload=function(e){if (er) return //уже была ошибка, ничего не делаем.
				if (e.type=="error") {er=1;ct(tw);clr();iff(fn,this,new Error(errors[0]+" "+errors[3]+": \""+l[this.name]+"\""))}
				if (--n==0) {ct(tw);iff(fn,im,l=im)} //все события для всех картинок из списка обработаны
				if (!er) iff(fns,this,e,++cnt)
			}
		}
		return im
	}

	function loadimage(u,fn) {
		var o=new Image(); o.src=u
		if (isF(fn)) o.onerror=o.onload=fn
		return o
	}

	function convdata(dat) {
		var rс,r,k,s="",j,ar=dat.split("\n") //были получены данные
		for (j=0;j<ar.length;j++){
			ar[j]=strip(ar[j])
			if(ar[j].substr(0,2)=="//") continue //игнорируем коммент в начале
			k=(ar[j].indexOf(" //")>-1)?ar[j].indexOf(" //"):(ar[j].indexOf("\"//")!== -1)?ar[j].indexOf("\"//"):null
			if(k!=null) ar[j]=strip(ar[j].substr(0,k+1))
			if(ar[j].substr(ar[j].length-1,1)=="\\") s+=ar[j].substr(0,ar[j].length-1);else s+=ar[j]+"\n" // если есть многострочные (с символом продолжения в конце) строки - их - в одну (s)
		}
		try {
			r=fmt(s);eval("r="+(r[0]!="{"?"{"+r+"}":r))
			if (!r.init) return r
			ar=iff(r.init,r)
			return (ar==undefined)?r:ar
		} catch(e){return e}
	}
	function loadData() {//групповая загрузка данных из списка "l", по завершению fn; step - fns // формат l = <name>:<url>; формат ld = <name>:<объект>;
		var er,i,n,rq={},ld={}
		,p=args(arguments),[fn,fns,l]=[p.F[0],p.F[1],p.O[0]]
		if (!isO(l)) return new Error(errors[0]+" "+errors[1])
		if (!isF(fn)) return new Error(errors[0]+" "+errors[2])
		function abr(){for (i in rq) rq[i].abort()} //прекращаем запущенные соединения
		n=lkeys(l)
		for (i in l) {
			rq[i]=iff(ajax,"loaddata",l[i],function(r) {if (!er) {if (isR(r)) {er=1;abr();iff(fn,this,r)} else {ld[this.name]=r;iff(fns,this,r);if (--n==0) iff(fn,ld,ld)}}})
			rq[i].name=i
		}
		return ld
	}
	function fetch(){iff(ajax,"loaddata",arguments)}
	function ajax(){var i,o=new w.XMLHttpRequest(),mode=this
		,meth,a=args(arguments),[uri,[s],send,fnext]=[a.S[0],[a.S[1],a.S[2]],a.O[0],a.F[0]] //символьные параметры принимаем отдельным массивом
// 			o.setRequestHeader("mode",'no-cors')
		

		if (!isF(fnext)) fnext=(r)=>{if (isR(r)) exiterr(r)}
		if (isO(send)) send=JSON.stringify(send) //если передан объект - переводим его в строковый эквивалент
		for (i in s) if (valinobj(s[i],methods)!==false) meth=s[i];else if (send) meth=s[i];else send=s[i]
		if (!meth) meth="GET"
		o.uri=uri //мое поле - такого не должно быть в ajax
		o.open(meth,uri,true);o.setRequestHeader("Access-Control-Allow-Origin","*");
		o.withCredentials=true;
		
		o.send(send)
		o.onreadystatechange=function() {var rc
			if (o.readyState==4)
				if (o.status==200)
					if (mode=="loaddata") {rc=convdata(o.response);if (isR(rc)) {rc=new Error(o.uri+": "+rc.message)};iff(fnext,o,rc)} else iff(fnext,o,o.responseText)
				else iff(fnext,o,new Error(o.status==0?errors[4]+" \""+uri+"\"" : "Status: "+o.status+" \""+o.statusText+"\""+"; Uri: \""+uri+"\""))
		}
		return o
	}
	function exiterr(e) { //грубый выход по ошибке
		if (isE(e)) e=e.message
		atO(d.body,"<b>" + e + "</b>",17,"#a33")
		atO(d.body,sp(2)+"Continue not possible<br>",15,"gray")
	}

	function jpost(){ //спец. обмен с сервером
		var a=args(arguments),[data,fnext]=[a.O[0],a.F[0]],o
		if (!isO(data)) return fnext(new Error("No data to send or data is not object"))
		try{data=JSON.stringify(data)}catch(e){iff(fnext,e,e.message);return}
		o=new w.XMLHttpRequest()
		o.open('POST',"",true)
		o.setRequestHeader("Content-Type","application/json") //; charset=utf-8")
		o.send(data)
		o.onreadystatechange=function() {var res
			if (o.readyState!=4) return false
			if (o.status==200) {
			rc=convdata(o.response);if (isR(rc)) rc=new Error(o.uri+": "+rc.message)
			iff(fnext,o,rc)}
			else iff(fnext,o,new Error("Error jpost. Status: "+o.status+" \""+o.statusText+"\""))
		}
		return o
	}
	init_app(arguments.callee.toString())
}catch(e){console.log(e)}
})()
