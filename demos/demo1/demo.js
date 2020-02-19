start=async ()=>{
// try {
	let 
	bg_header_img	=	await blob2data(await load(`${app.path}img/bg0.jpg`)),
	bg_body_img		=	await blob2data(await load(`${app.path}img/bg1.jpg`)),
	logo_img			=	await blob2data(await load(`${app.path}img/bmw_small.png`)),
	loading_img		=	await blob2data(await load(`${app.path}img/loading4.gif`)), //если удаленный хостинг медленный, показать ожидание загрузки
	dat						=	await load(`${app.path}data/data.obj`),
	lnames=keys(dat.cars), //объекты слева
	rnames=["titl_detail","pic_detail","desc_detail"], // ... справа
	i,o,attrs,
	hh=99, // высота заголовка
	vgap=33,hgap=25, // промежутки между объектами
	vgi=13,hgi=9, // промежутки между элементами объекта
	hi=33, //высота списковых элементов
	roi=5, //скругление элементов
	path=[], //для запоминания пути движения объекта
	ishad="inset 0 0 13px white, 0 0 1px black", // тень элемента
	ishov= "0 0 9px 1px yellow", //тень элемента при наведении
	tshad="-1px -1px 2px black, 1px 1px 2px white", // тень текст элемента 
	oshad="inset 0 0 99px 9px #77f, 0 0 33px 9px #333" //тень правой и левой области
	
	app.firmname="Super Store"
	
	let page={ //	разметка страницы
		header:{ // header
			css:{all:[hh,,0],bgs:"19%",bgr:"repeat",bgi:bg_header_img},
			props:{hstretchable:true},
			ch:{
				center:{
					value:"[[app.firmname]]",
					props:{haligned:true,hstretchable:true},
					css:{lh:hh,fs:hh,ts:"-2px -2px 5px #777, 2px 2px 5px white",co:"#7af",ta:"center"}
				},
				leftlogo: {
					css:{all:[hh-4,hh-4,2,2],cu:"pointer",
						ro:hh/2,bgc:"#fae #ffe",sh:"0 0 33px 1px yellow",
						bgi:logo_img,bgs:"88%",bgp:"center"
					},
					props:{movable:true}
				}
			}
		},
		footer: {css:{all:[21,,,,0,,"#777 #999","white",,15,21,"center"], po: "fixed"},props:{hstretchable:true},value:"® [[app.firmname]], "+"eval{new Date().getFullYear()}"},
		mainarea: {
			vgap:vgap, hgap:hgap, ro: 13, //гор/верт промежутки, величина 	скругления
			css:{bgs:"25%",bgi:bg_body_img},
			props:{parallaxable:33,stretchable:["[[header.h]]","[[footer.h]]",0,0],keypressable:true},
			resizing_all:["larea","rarea"],
			keystrokes:{ //настроили обработку клавиатуры
				pars:{
					list:[],
					active:{css:{br:"yellow"}},
					unactive:{css:{br:"gray"}},
				},
				keys:{
					UP:{action:"prev",type:"keydown"},
					DOWN:{action:"next",type:"keydown"},
					ENTER:{action:"press",type:"keyup"},
				},
			},
			ch:{
				larea:{
					css:{
						ro:"[[ro]]",op:59,sh:oshad,
						bgc:"#eaa #aae",br:"gray"
					},
					props:{stretchable:["[[vgap]]","[[vgap]]","[[hgap]]","eval{app.ww*2/3 + 2*[[hgap]]}"],movable:true,resizable:true,closable:true}
				},
				rarea:{
					css:{
						ro:"[[ro]]",op:59,sh:oshad,
						bgc:"#eaa #aae",br:"gray"
					},
					props:{stretchable:["[[vgap]]","[[vgap]]","eval{larea.w + 2*[[hgap]]}","[[hgap]]"],movable:true,resizable:true,closable:true}
				},
				
				titl_detail:{ // заголовок области детализации
					hgap:hgap, hgi:hgi,
					css:{
						all:[hi,,vgap+vgi],ro:roi,fs:hi,lh:hi,ta:"center",co:"gray",
						sh:ishad,ts:tshad
					},
					props:{hstretchable:["eval{2*[[hgap]]+[[hgi]]+larea.w}","eval{[[hgap]]+[[hgi]]}"]},
				},
				pic_detail:{ // картинка области детализации
					vgap:vgap,hgap:hgap,vgi:vgi,hgi:hgi,hi:hi,
					css:{ro:roi,sh:ishad, br:"gray",bgs:"100%"},
					props:{
						stretchable:["eval{[[vgap]]+2*[[vgi]]+[[hi]]}","eval{[[vgap]]+[[vgi]]}","eval{2*[[hgap]]+larea.w+[[hgi]]}","eval{rarea.w/2+[[hgap]]}"],

					}
				},
				desc_detail:{ // описание области детализации
					hgap:hgap,vgap:vgap,vgi:vgi,hgi:hgi,hi:hi,
					css:{ro:roi,sh:ishad, br:"gray"},
					props:{
						stretchable:["eval{[[vgap]]+2*[[vgi]]+[[hi]]}","eval{[[vgap]]+[[vgi]]}","eval{2*[[hgap]]+larea.w+rarea.w/2+[[hgi]]}","eval{[[hgi]]+[[hgap]]}"],
					}
				}
			}
		}
	}
	
	for (i in page) init_obj(i,page[i])

	for (i in lnames) { //инициализируем элементы списка
		init_obj(lnames[i],"mainarea",{
				hgap:hgap, hgi:hgi,
				shov:ishov,
				shou:ishad,
			css:{
				all:[hi,,vgap+vgi+i*(hi+vgi)],ro:roi,fs:hi,lh:hi,ta:"center",co:"gray",cu:"pointer",
				sh:ishad,ts:tshad
			},
			focus:{
				over:{"[[name]]":{css:{sh:"[[shov]]",bgc:"#ccc"}}},
				out:{"[[name]]":{css:{sh:"[[shou]]",bgc:""}}} //transparent
			},
			press:{
				process:{"[[name]]":{css:{sh:"",bgc:"#aaf"}}},
				down:{"[[name]]":{css:{sh:"",bgc:"#aaf"}}},
				up:{"[[name]]":{css:{sh:"[[shov]]",bgc:"#ccc"}}} //transparent
			},
			props:{hstretchable:[hgap+hgi,"eval{rarea.w+2*[[hgap]]+[[hgi]]}"],pressable:true,focusable:true},
			value:lnames[i]
		})
		.click= async(...p)=>{
			let i,op,o=args(p).H[0] //наш нажатый объект
			sbiO(pic_detail,loading_img) //сначала картинку загрузки
			for (i in lnames) { //пройдемся по другим
				op=gO(lnames[i])
				if (op.id!=o.id) {op.state="";setattr(op,"focus","out")} //восстановили другие элементы
			}
			stO(titl_detail,dat.cars[o.id].desc) //... и текст заголовка
await delay(555)
			attrs=dat.cars[o.id].attr
			dO(desc_detail.id+"_titl");dO(desc_detail.id+"_vals") //удаляем старые
			
			matrix({ //область названий полей
				pname:desc_detail.id,name:desc_detail.id+"_titl",
				m:keys(attrs).length,n:1,
				props:{hstretchable:[0,"eval{[[pname]].w*2/3}"]},
				txt:keys(attrs)
			},{
				css:{ta:"right",fs:"eval{[[hi]]*.7}",par:5},
				props:{hstretchable:[hgi,hgi]},
				value:"eval{ [[pname]].dat.txt[ [[mcount]] ] }"
			})

			matrix({ //область значений полей
				pname:desc_detail.id,name:desc_detail.id+"_vals",
				m:vals(attrs).length,n:1,
				props:{hstretchable:["eval{[[pname]].w*1/3-5}",0]},
				txt:vals(attrs)
			},{
				css:{ta:	"left",fs:"eval{[[hi]]*.75}",pal:5,co:"#070"},
				props:{hstretchable:[hgi,hgi]},
				value:"eval{ [[pname]].dat.txt[ [[mcount]] ] }"
			})
			sbiO(pic_detail,await blob2data(await load(dat.cars[o.id].urlpic)))
		}
		mainarea.dat.keystrokes.pars.list[i]=lnames[i]
	}

	larea.after_resize=rarea.after_resize=()=>setcurobj(mainarea)
	larea.resize_also=(...p)=>{
		let dw=args(p).N[1],i,o
		for (i in lnames) {
			o=gO(lnames[i]) //анимация для каждого элемента
			ssO(o,null,o.w+=dw) // установили точно
		}
	}

	rarea.resize_also=(...p)=>{p=args(p)
		let [dh,dw]=[p.N[0],p.N[1]],i,o=gO(rnames[0])
		ssO(o,null,o.w+=dw) // установили точно
		o=gO(rnames[1]);ssO(o,o.h+=dh,o.w+=dw/2)
		o=gO(rnames[2]);ssO(o,o.h+=dh,o.w+=dw/2);poO(o,null,o.l+=dw/2)
	}
	larea.before_move=rarea.before_move=(...p)=>path=[] //опустошили
	larea.move_also=rarea.move_also=(...p)=>path.push(args(p).N)
	
	larea.after_move=rarea.after_move=(...p)=>{p=args(p)
		let i,j,o=p.H[0],lst=o==larea?lnames:rnames
		anim(()=>{
			if (path.length==0) return false //путь закончился, завершаем анимацию
			let [dt,dl]=path.shift()
// 			let [dt,dl]=path.pop()
			for (i in lst) {
				op=gO(lst[i]) //анимация для каждого элемента
				poO(op,op.t+=dt,op.l+=dl) // установили точно
			}
		})
		setcurobj(mainarea)
	}
	leftlogo.longclick=()=>!isH(app.clock)?app.clock=clock():fo(app.clock,o=>{dO(o);delete app.clock})
	leftlogo.click=async ()=>{let o=leftlogo
		acO(o)
		await fallout(o)
		clock()
		o.state=""
	}
	
	livemsgs.connector.data=`Приложение "${app.firmname}" стартовало!`
	await delay(777)
	o=gO(lnames[0]);	o.click(o);setattr(o,"press","process")
	
	setsel(mainarea,"none") //блокирование паразитного выделения
	setcurobj(mainarea)
// }catch(e){c.log(e)}
}
start()
