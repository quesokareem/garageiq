import { useState, useRef, useEffect } from "react";

const C = {
  bg:"#0C0C0E",surface:"#141417",border:"#222228",
  accent:"#C8F135",accentDim:"#C8F13520",
  red:"#FF4D4D",redDim:"#FF4D4D18",
  orange:"#FF9A3C",orangeDim:"#FF9A3C18",
  blue:"#4FC3F7",blueDim:"#4FC3F718",
  green:"#4ADE80",greenDim:"#4ADE8018",
  purple:"#C084FC",purpleDim:"#C084FC18",
  text:"#F0F0F0",muted:"#666670",faint:"#1E1E24",
};
const LEVEL_COLOR={critical:C.red,warning:C.orange,info:C.blue};

const INIT_USERS=[
  {id:"m1",role:"mechanic",name:"Jake Torres",email:"jake@garageiq.com",password:"mechanic123",shop:"Torres Auto",specialty:"Engine & Transmission",rating:4.9,reviews:47,available:true,bio:"ASE certified, 12 years exp.",photo:"🧑‍🔧",logo:"🔧",signature:"Jake Torres",city:"Miami, FL",lat:25.7617,lng:-80.1918},
  {id:"m2",role:"admin",name:"Sandra Lee",email:"admin@garageiq.com",password:"admin123",shop:"Lee's Auto Care",specialty:"Full Service",rating:4.7,reviews:83,available:true,bio:"Family owned since 2005.",photo:"👩‍🔧",logo:"⭐",signature:"Sandra Lee",city:"Miami, FL",lat:25.7745,lng:-80.2100},
  {id:"m3",role:"mechanic",name:"Carlos Mendez",email:"carlos@garageiq.com",password:"mechanic123",shop:"Mendez Motors",specialty:"Electrical & AC",rating:4.6,reviews:31,available:false,bio:"Electrical & AC specialist.",photo:"👨‍🔧",logo:"⚡",signature:"Carlos Mendez",city:"Hialeah, FL",lat:25.8576,lng:-80.2781},
  {id:"c1",role:"customer",name:"Marcus Johnson",email:"marcus@email.com",password:"customer123",vehicleIds:[1],bio:"Car enthusiast.",photo:"😎",city:"Miami, FL",lat:25.7617,lng:-80.1918},
  {id:"c2",role:"customer",name:"Tanya Rivera",email:"tanya@email.com",password:"customer123",vehicleIds:[2],bio:"Just need reliable wheels.",photo:"👩",city:"Miami Beach, FL",lat:25.7907,lng:-80.1300},
  {id:"c3",role:"customer",name:"Derek Williams",email:"derek@email.com",password:"customer123",vehicleIds:[3],bio:"Weekend driver.",photo:"🧑",city:"Coral Gables, FL",lat:25.7215,lng:-80.2684},
];

const INIT_VEHICLES=[
  {id:1,customerId:"c1",name:"Marcus Johnson",phone:"555-214-8801",vin:"1HGBH41JXMN109186",vehicle:"2021 Honda Civic",mileage:42000,lastVisit:"2024-11-10",carPhoto:null,
   services:[{type:"Oil Change",date:"2024-11-10",mileage:42000,notes:"",status:"confirmed"},{type:"Tire Rotation",date:"2024-09-05",mileage:39500,notes:"",status:"confirmed"}],
   alerts:[{text:"Brake inspection due",level:"warning"},{text:"Air filter recommended",level:"info"}],pendingServices:[]},
  {id:2,customerId:"c2",name:"Tanya Rivera",phone:"555-987-3320",vin:"2T1BURHE0JC041234",vehicle:"2018 Toyota Corolla",mileage:67800,lastVisit:"2024-10-22",carPhoto:null,
   services:[{type:"Oil Change",date:"2024-10-22",mileage:67800,notes:"",status:"confirmed"}],
   alerts:[{text:"Oil change due in 1,200 miles",level:"warning"}],pendingServices:[]},
  {id:3,customerId:"c3",name:"Derek Williams",phone:"555-441-0092",vin:"3VWF17AT4FM123456",vehicle:"2015 Volkswagen Jetta",mileage:91200,lastVisit:"2024-08-30",carPhoto:null,
   services:[{type:"Transmission Service",date:"2024-08-30",mileage:91200,notes:"",status:"confirmed"}],
   alerts:[{text:"Brake pads critical",level:"critical"},{text:"Coolant flush overdue",level:"warning"}],
   pendingServices:[{id:99,type:"Brake Pad Replacement",date:"2024-11-15",mileage:91500,notes:"Replaced all four brake pads.",mechanicName:"Jake Torres",mechanicShop:"Torres Auto"}]},
];

const INIT_LISTINGS=[
  {id:1,sellerId:"m1",sellerName:"Jake Torres",sellerPhoto:"🧑‍🔧",verified:true,
   year:2019,make:"Ford",model:"Mustang",trim:"GT",color:"Race Red",mileage:38000,price:32500,
   condition:"Excellent",description:"Well maintained Mustang GT. Recent full service, new tires, no accidents.",
   photos:["🚗"],city:"Miami, FL",lat:25.7617,lng:-80.1918,
   features:["V8 Engine","6-Speed Manual","Leather Seats","Backup Camera"],offers:[],listed:"2024-11-10"},
  {id:2,sellerId:"c2",sellerName:"Tanya Rivera",sellerPhoto:"👩",verified:false,
   year:2017,make:"Honda",model:"Accord",trim:"EX",color:"Lunar Silver",mileage:62000,price:16900,
   condition:"Good",description:"Reliable Accord, regularly serviced. One owner, clean title.",
   photos:["🚙"],city:"Miami Beach, FL",lat:25.7907,lng:-80.1300,
   features:["Honda Sensing","Sunroof","Apple CarPlay"],offers:[],listed:"2024-11-08"},
  {id:3,sellerId:"c3",sellerName:"Derek Williams",sellerPhoto:"🧑",verified:false,
   year:2015,make:"Volkswagen",model:"Jetta",trim:"SE",color:"Platinum Gray",mileage:91200,price:9500,
   condition:"Fair",description:"Solid commuter. Needs some TLC but runs great. Priced to sell.",
   photos:["🚘"],city:"Coral Gables, FL",lat:25.7215,lng:-80.2684,
   features:["Turbocharged","Bluetooth","Heated Seats"],offers:[],listed:"2024-11-05"},
  {id:4,sellerId:"m2",sellerName:"Sandra Lee",sellerPhoto:"👩‍🔧",verified:true,
   year:2020,make:"Toyota",model:"Camry",trim:"XSE",color:"Midnight Black",mileage:29000,price:26800,
   condition:"Excellent",description:"One owner, garage kept. Full service history. Mechanic owned.",
   photos:["🚗"],city:"Miami, FL",lat:25.7745,lng:-80.2100,
   features:["V6 Engine","Sport Package","JBL Audio"],offers:[],listed:"2024-11-12"},
];

const INIT_MESSAGES=[
  {id:1,from:"m1",to:"c1",text:"Hi Marcus! Your Civic is ready.",time:"10:30 AM",date:"Today"},
  {id:2,from:"c1",to:"m1",text:"Thanks Jake! I'll swing by around 3pm.",time:"10:45 AM",date:"Today"},
];
const INIT_QUOTES=[
  {id:1,mechanicId:"m1",customerId:"c1",vehicleId:1,status:"pending",date:"2024-11-12",vehicle:"2021 Honda Civic",
   mechanicName:"Jake Torres",mechanicShop:"Torres Auto",mechanicSig:"Jake Torres",
   items:[{description:"Brake Pads (Front)",parts:89,labor:120},{description:"Brake Rotors",parts:145,labor:60}],
   notes:"Recommended replacing front brakes asap.",counterOffer:null},
];
const INIT_POSTS=[
  {id:1,authorId:"c1",authorName:"Marcus Johnson",authorRole:"customer",time:"2h ago",text:"Need my alternator replaced this weekend. Anyone local?",tag:"Alternator",replies:[{id:1,authorId:"m1",authorName:"Jake Torres",authorRole:"mechanic",text:"I can come by Saturday morning!",time:"1h ago"}]},
  {id:2,authorId:"m2",authorName:"Sandra Lee",authorRole:"mechanic",time:"5h ago",text:"Offering mobile oil changes this weekend — $45 full synthetic.",tag:"Oil Change",replies:[]},
];
const INIT_REVIEWS=[
  {id:1,mechanicId:"m1",authorName:"Tanya Rivera",rating:5,text:"Jake fixed my alternator in 2 hours. Super professional.",time:"2 weeks ago",verified:true},
  {id:2,mechanicId:"m2",authorName:"Marcus Johnson",rating:5,text:"Sandra's shop is spotless.",time:"3 weeks ago",verified:true},
];

const SERVICE_TYPES=["Oil Change","Tire Rotation","Brake Pad Replacement","Air Filter","Transmission Service","Coolant Flush","Battery Replacement","Wheel Alignment","Spark Plugs","Full Inspection"];
const JOB_TAGS=["Oil Change","Brakes","Alternator","AC","Transmission","Electrical","Tires","Engine","Battery","Other"];
const CAR_MAKES=["Any","Ford","Toyota","Honda","Chevrolet","GMC","RAM","Jeep","Dodge","Nissan","Hyundai","Kia","Subaru","Mazda","Volkswagen","BMW","Mercedes-Benz","Lexus","Audi","Cadillac","Buick","Lincoln","Acura","Infiniti","Volvo","Tesla","Genesis","Mitsubishi","Other"];

const CAR_MODELS={
  Ford:["F-150","F-250","F-350","Mustang","Explorer","Escape","Edge","Bronco","Bronco Sport","Ranger","Maverick","Expedition","Transit","Transit Connect","EcoSport","Fusion","Taurus","Focus","Fiesta"],
  Toyota:["Camry","Corolla","RAV4","Tacoma","Tundra","Highlander","4Runner","Sienna","Prius","Venza","Avalon","C-HR","Sequoia","Land Cruiser","GR86","Supra","bZ4X","Yaris"],
  Honda:["Civic","Accord","CR-V","Pilot","Odyssey","HR-V","Passport","Ridgeline","Fit","Insight","Element","Prologue","Jazz"],
  Chevrolet:["Silverado 1500","Silverado 2500","Equinox","Tahoe","Suburban","Traverse","Colorado","Blazer","Trax","Malibu","Camaro","Corvette","Trailblazer","Express","Spark","Sonic"],
  GMC:["Sierra 1500","Sierra 2500","Yukon","Yukon XL","Acadia","Terrain","Canyon","Envoy","Safari"],
  RAM:["1500","2500","3500","ProMaster","ProMaster City"],
  Jeep:["Wrangler","Grand Cherokee","Cherokee","Compass","Gladiator","Renegade","Wagoneer","Grand Wagoneer"],
  Dodge:["Challenger","Charger","Durango","Journey","Grand Caravan","Dart","Viper"],
  Nissan:["Altima","Rogue","Sentra","Frontier","Pathfinder","Murano","Titan","Kicks","Armada","Maxima","Versa","370Z","GT-R","Leaf"],
  Hyundai:["Elantra","Tucson","Santa Fe","Sonata","Kona","Palisade","Ioniq 5","Ioniq 6","Venue","Accent","Veloster","Genesis Coupe"],
  Kia:["Sorento","Sportage","Forte","Telluride","Soul","Carnival","Stinger","EV6","Niro","Seltos","K5","Rio","Cadenza"],
  Subaru:["Outback","Forester","Crosstrek","Impreza","Legacy","Ascent","WRX","BRZ","Solterra"],
  Mazda:["CX-5","Mazda3","CX-30","CX-50","CX-90","Mazda6","MX-5 Miata","CX-9","CX-3"],
  Volkswagen:["Jetta","Tiguan","Atlas","Passat","Golf","GTI","Taos","ID.4","Touareg","Arteon"],
  BMW:["3 Series","5 Series","7 Series","X1","X3","X5","X7","4 Series","2 Series","M3","M5","i4","iX","Z4"],
  "Mercedes-Benz":["C-Class","E-Class","S-Class","GLC","GLE","GLS","A-Class","CLA","GLA","GLB","AMG GT","EQS","EQE"],
  Lexus:["RX","ES","NX","GX","IS","UX","LX","LS","LC","RC","TX"],
  Audi:["A4","A6","Q5","Q7","Q3","A3","A8","Q8","TT","R8","e-tron","Q4 e-tron"],
  Cadillac:["Escalade","XT5","CT5","XT4","CT4","Lyriq","Celestiq"],
  Buick:["Enclave","Encore","Encore GX","Envision","LaCrosse"],
  Lincoln:["Navigator","Nautilus","Corsair","Aviator","Continental"],
  Acura:["MDX","RDX","TLX","ILX","NSX","Integra"],
  Infiniti:["QX60","QX80","QX50","Q50","QX55","Q60"],
  Volvo:["XC90","XC60","XC40","S90","S60","V90","V60","C40"],
  Tesla:["Model 3","Model Y","Model S","Model X","Cybertruck"],
  Genesis:["GV80","GV70","G80","GV60","G70","G90"],
  Mitsubishi:["Outlander","Eclipse Cross","Outlander Sport","Galant","Lancer","Mirage"],
  Other:[],
};

const MODEL_TYPES={
  // Sedans
  "Camry":"Sedan","Corolla":"Sedan","Civic":"Sedan","Accord":"Sedan","Altima":"Sedan","Sentra":"Sedan","Maxima":"Sedan","Elantra":"Sedan","Sonata":"Sedan","Malibu":"Sedan","Fusion":"Sedan","Taurus":"Sedan","Passat":"Sedan","Jetta":"Sedan","A4":"Sedan","A6":"Sedan","3 Series":"Sedan","5 Series":"Sedan","7 Series":"Sedan","C-Class":"Sedan","E-Class":"Sedan","S-Class":"Sedan","ES":"Sedan","IS":"Sedan","LS":"Sedan","RX":"Sedan","CT5":"Sedan","CT4":"Sedan","Forte":"Sedan","K5":"Sedan","Rio":"Sedan","Impreza":"Sedan","Legacy":"Sedan","Mazda3":"Sedan","Mazda6":"Sedan","Q50":"Sedan","Stinger":"Sedan","TLX":"Sedan","ILX":"Sedan","G80":"Sedan","G70":"Sedan","G90":"Sedan","S90":"Sedan","S60":"Sedan","Model 3":"Sedan","Model S":"Sedan","LaCrosse":"Sedan","Continental":"Sedan","Cadenza":"Sedan","Versa":"Sedan","Accent":"Sedan","Dart":"Sedan","Lancer":"Sedan","Galant":"Sedan","Mirage":"Sedan","Avalon":"Sedan",
  // SUVs / Crossovers
  "CR-V":"SUV","RAV4":"SUV","Rogue":"SUV","Equinox":"SUV","Explorer":"SUV","Escape":"SUV","Tiguan":"SUV","Tucson":"SUV","Santa Fe":"SUV","Sorento":"SUV","Sportage":"SUV","Outlander":"SUV","Forester":"SUV","Outback":"SUV","Crosstrek":"SUV","CX-5":"SUV","CX-30":"SUV","CX-50":"SUV","CX-90":"SUV","CX-9":"SUV","CX-3":"SUV","Pilot":"SUV","HR-V":"SUV","Passport":"SUV","Atlas":"SUV","Taos":"SUV","ID.4":"SUV","Kona":"SUV","Venue":"SUV","Seltos":"SUV","Niro":"SUV","Soul":"SUV","Edge":"SUV","Bronco Sport":"SUV","EcoSport":"SUV","Terrain":"SUV","Acadia":"SUV","Trax":"SUV","Blazer":"SUV","Trailblazer":"SUV","Traverse":"SUV","Highlander":"SUV","4Runner":"SUV","Venza":"SUV","C-HR":"SUV","Sequoia":"SUV","Tahoe":"SUV","Suburban":"SUV","Expedition":"SUV","Yukon":"SUV","Yukon XL":"SUV","Escalade":"SUV","Navigator":"SUV","Aviator":"SUV","Corsair":"SUV","Nautilus":"SUV","GX":"SUV","NX":"SUV","UX":"SUV","LX":"SUV","RX":"SUV","TX":"SUV","Q5":"SUV","Q7":"SUV","Q3":"SUV","Q8":"SUV","e-tron":"SUV","Q4 e-tron":"SUV","X1":"SUV","X3":"SUV","X5":"SUV","X7":"SUV","GLC":"SUV","GLE":"SUV","GLS":"SUV","GLA":"SUV","GLB":"SUV","EQS":"SUV","EQE":"SUV","Murano":"SUV","Pathfinder":"SUV","Armada":"SUV","Kicks":"SUV","QX60":"SUV","QX80":"SUV","QX50":"SUV","QX55":"SUV","XC90":"SUV","XC60":"SUV","XC40":"SUV","C40":"SUV","V90":"SUV","V60":"SUV","MDX":"SUV","RDX":"SUV","Enclave":"SUV","Encore":"SUV","Encore GX":"SUV","Envision":"SUV","XT5":"SUV","XT4":"SUV","Lyriq":"SUV","Palisade":"SUV","Ioniq 5":"SUV","Ioniq 6":"SUV","EV6":"SUV","GV80":"SUV","GV70":"SUV","GV60":"SUV","Model Y":"SUV","Model X":"SUV","Bravada":"SUV","Envoy":"SUV","Wagoneer":"SUV","Grand Wagoneer":"SUV","Grand Cherokee":"SUV","Cherokee":"SUV","Compass":"SUV","Renegade":"SUV","Durango":"SUV","Journey":"SUV","Subaru XV":"SUV","Ascent":"SUV","Eclipse Cross":"SUV","Outlander Sport":"SUV","Solterra":"SUV","Prologue":"SUV","bZ4X":"SUV","Ioniq":"SUV",
  // Trucks
  "F-150":"Truck","F-250":"Truck","F-350":"Truck","Silverado 1500":"Truck","Silverado 2500":"Truck","Sierra 1500":"Truck","Sierra 2500":"Truck","RAM 1500":"Truck","1500":"Truck","2500":"Truck","3500":"Truck","Tacoma":"Truck","Tundra":"Truck","Ranger":"Truck","Maverick":"Truck","Colorado":"Truck","Canyon":"Truck","Frontier":"Truck","Titan":"Truck","Ridgeline":"Truck","Gladiator":"Truck","Cybertruck":"Truck",
  // Minivans
  "Odyssey":"Minivan","Sienna":"Minivan","Carnival":"Minivan","Grand Caravan":"Minivan","Pacifica":"Minivan","Transit Connect":"Minivan","ProMaster City":"Minivan",
  // Vans
  "Transit":"Van","ProMaster":"Van","Express":"Van","Sprinter":"Van","Safari":"Van","Savana":"Van",
  // Sports/Coupes
  "Mustang":"Coupe","Camaro":"Coupe","Challenger":"Coupe","Charger":"Coupe","Corvette":"Coupe","Supra":"Coupe","GR86":"Coupe","BRZ":"Coupe","MX-5 Miata":"Convertible","Z4":"Convertible","370Z":"Coupe","GT-R":"Coupe","WRX":"Sedan","Impreza":"Sedan","A3":"Sedan","CLA":"Sedan","A-Class":"Sedan","4 Series":"Coupe","2 Series":"Coupe","AMG GT":"Coupe","M3":"Sedan","M5":"Sedan","LC":"Coupe","RC":"Coupe","TT":"Coupe","R8":"Coupe","NSX":"Coupe","Integra":"Sedan","Veloster":"Hatchback","Golf":"Hatchback","GTI":"Hatchback","Focus":"Hatchback","Fiesta":"Hatchback","Fit":"Hatchback","Jazz":"Hatchback","Spark":"Hatchback","Sonic":"Hatchback","Yaris":"Hatchback","Prius":"Hatchback","Insight":"Hatchback","Leaf":"Hatchback",
  // SUV/Luxury
  "Bronco":"SUV","Wrangler":"SUV","Jeep":"SUV",
};

const BODY_TYPES=["Any","Sedan","SUV","Truck","Minivan","Van","Coupe","Convertible","Hatchback"];
const CAR_COLORS=["Any","Black","White","Silver","Gray","Red","Blue","Green","Orange","Yellow","Brown","Beige","Gold","Purple","Other"];

function Av({name,size=36,color=C.accent,emoji=null}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:color+"22",color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:emoji?size*0.55:size*0.46,flexShrink:0}}>{emoji||name?.[0]?.toUpperCase()}</div>;
}
function Stars({rating,size=14}){return <span style={{fontSize:size,color:C.accent}}>{"★".repeat(Math.round(rating))}{"☆".repeat(5-Math.round(rating))}</span>;}
function Pill({level}){const col=LEVEL_COLOR[level]||C.blue;return <span style={{background:col+"18",color:col,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 9px"}}>{level?.toUpperCase()}</span>;}
function Badge({count}){if(!count)return null;return <span style={{background:C.red,color:"#000",borderRadius:99,fontSize:10,fontWeight:800,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{count}</span>;}

function distanceMiles(lat1,lng1,lat2,lng2){
  const R=3958.8,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function LocationBar({location,onUpdate}){
  const [editing,setEditing]=useState(false);
  const [input,setInput]=useState(location?.city||"");
  const [detecting,setDetecting]=useState(false);
  const detect=()=>{setDetecting(true);navigator.geolocation.getCurrentPosition(pos=>{onUpdate({lat:pos.coords.latitude,lng:pos.coords.longitude,city:"Current Location"});setDetecting(false);setEditing(false);},()=>{setDetecting(false);alert("Location denied. Please type your city.");},{timeout:8000});};
  const cityCoords={"miami":{lat:25.7617,lng:-80.1918,city:"Miami, FL"},"miami fl":{lat:25.7617,lng:-80.1918,city:"Miami, FL"},"miami beach":{lat:25.7907,lng:-80.1300,city:"Miami Beach, FL"},"coral gables":{lat:25.7215,lng:-80.2684,city:"Coral Gables, FL"},"hialeah":{lat:25.8576,lng:-80.2781,city:"Hialeah, FL"},"new york":{lat:40.7128,lng:-74.0060,city:"New York, NY"},"los angeles":{lat:34.0522,lng:-118.2437,city:"Los Angeles, CA"},"chicago":{lat:41.8781,lng:-87.6298,city:"Chicago, IL"},"houston":{lat:29.7604,lng:-95.3698,city:"Houston, TX"},"atlanta":{lat:33.7490,lng:-84.3880,city:"Atlanta, GA"}};
  const save=()=>{const found=cityCoords[input.toLowerCase().trim()];onUpdate(found||{lat:25.7617,lng:-80.1918,city:input||"Miami, FL"});setEditing(false);};
  if(editing)return(<div style={{display:"flex",gap:8,alignItems:"center",padding:"8px 14px",background:C.faint,borderBottom:`1px solid ${C.border}`}}>
    <input style={{...S.input,margin:0,flex:1,padding:"6px 10px",fontSize:12}} placeholder="Enter city (e.g. Miami, FL)" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} autoFocus/>
    <button style={{...S.btnSecondary,padding:"6px 10px",fontSize:12}} onClick={detect} disabled={detecting}>{detecting?"...":"📍 Auto"}</button>
    <button style={{...S.btnPrimary,padding:"6px 12px",fontSize:12}} onClick={save}>Set</button>
    <button onClick={()=>setEditing(false)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>✕</button>
  </div>);
  return(<div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 14px",background:C.faint,borderBottom:`1px solid ${C.border}`,cursor:"pointer"}} onClick={()=>setEditing(true)}>
    <span style={{fontSize:13}}>📍</span>
    <span style={{fontSize:12,color:C.muted}}>{location?.city||"Set your location"}</span>
    <span style={{fontSize:11,color:C.accent,marginLeft:4}}>Change</span>
  </div>);
}

function SignaturePad({onChange}){
  const canvasRef=useRef();const drawing=useRef(false);
  const gp=(e,r)=>({x:(e.touches?.[0]?.clientX||e.clientX)-r.left,y:(e.touches?.[0]?.clientY||e.clientY)-r.top});
  const start=(e)=>{drawing.current=true;const ctx=canvasRef.current.getContext("2d");const p=gp(e,canvasRef.current.getBoundingClientRect());ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.strokeStyle=C.accent;ctx.lineWidth=2;ctx.lineCap="round";};
  const draw=(e)=>{if(!drawing.current)return;const ctx=canvasRef.current.getContext("2d");const p=gp(e,canvasRef.current.getBoundingClientRect());ctx.lineTo(p.x,p.y);ctx.stroke();};
  const stop=()=>{drawing.current=false;onChange(canvasRef.current.toDataURL());};
  const clear=()=>{canvasRef.current.getContext("2d").clearRect(0,0,300,80);onChange("");};
  return(<div><canvas ref={canvasRef} width={300} height={80} style={{background:"#080808",border:`1px solid ${C.border}`,borderRadius:8,cursor:"crosshair",touchAction:"none",display:"block",maxWidth:"100%"}} onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}/><button onClick={clear} style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",marginTop:4}}>Clear</button></div>);
}

function CarPhotoPicker({current,onSave,onClose}){
  const [preview,setPreview]=useState(current||null);const [mode,setMode]=useState("choose");
  const fileRef=useRef();const videoRef=useRef();const streamRef=useRef();
  const handleFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setPreview(ev.target.result);r.readAsDataURL(f);};
  const startCam=async()=>{setMode("camera");try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});streamRef.current=s;if(videoRef.current)videoRef.current.srcObject=s;}catch{alert("Camera denied.");setMode("choose");}};
  const takePhoto=()=>{const c=document.createElement("canvas");c.width=videoRef.current.videoWidth;c.height=videoRef.current.videoHeight;c.getContext("2d").drawImage(videoRef.current,0,0);setPreview(c.toDataURL("image/jpeg",0.8));streamRef.current?.getTracks().forEach(t=>t.stop());setMode("choose");};
  useEffect(()=>()=>streamRef.current?.getTracks().forEach(t=>t.stop()),[]);
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:420}}>
    <div style={S.modalHead}><span style={S.modalTitle}>Car Photo</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    {mode==="camera"
      ?<div><video ref={videoRef} autoPlay playsInline style={{width:"100%",borderRadius:10,marginBottom:10,background:"#000"}}/><div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>{streamRef.current?.getTracks().forEach(t=>t.stop());setMode("choose");}}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={takePhoto}>📸 Take Photo</button></div></div>
      :<>{preview?<div style={{marginBottom:10,borderRadius:10,overflow:"hidden",height:160}}><img src={preview} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>:<div style={{height:120,background:C.faint,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,border:`1px dashed ${C.border}`,color:C.muted,fontSize:13}}>No photo yet</div>}
      <div style={{display:"flex",gap:8,marginBottom:10}}><button style={{...S.btnSecondary,flex:1}} onClick={()=>fileRef.current.click()}>📁 Upload</button><button style={{...S.btnSecondary,flex:1}} onClick={startCam}>📷 Camera</button></div>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={onClose}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={()=>{onSave(preview);onClose();}}>Save</button></div></>}
  </div></div>);
}

function Corner({pos}){
  const m={tl:{top:10,left:10},tr:{top:10,right:10},bl:{bottom:10,left:10},br:{bottom:10,right:10}};
  const b={tl:{borderTop:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`},tr:{borderTop:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`},bl:{borderBottom:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`},br:{borderBottom:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`}};
  return <div style={{position:"absolute",width:18,height:18,...m[pos],...b[pos]}}/>;
}

function VINModal({onClose,onAdd}){
  const [vin,setVin]=useState("");const [name,setName]=useState("");const [phone,setPhone]=useState("");
  const [vehicleInfo,setVehicleInfo]=useState(null);const [scanning,setScanning]=useState(false);
  const [loading,setLoading]=useState(false);const [step,setStep]=useState(1);const [error,setError]=useState("");
  const videoRef=useRef();const streamRef=useRef();
  const lookupVIN=async(v)=>{if(v.length<11){setError("VIN must be at least 11 characters.");return;}setLoading(true);setError("");
    try{const res=await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`);const data=await res.json();
      const get=variable=>data.Results?.find(r=>r.Variable===variable)?.Value||"";
      const make=get("Make");const model=get("Model");const year=get("Model Year");
      if(!make||make==="null"){setError("VIN not found.");setLoading(false);return;}
      setVehicleInfo({vin:v.toUpperCase(),make,model,year,engine:get("Engine Configuration"),trim:get("Trim"),vehicle:`${year} ${make} ${model}`});setStep(2);
    }catch{setError("Lookup failed.");}setLoading(false);};
  const startCam=async()=>{setScanning(true);try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});streamRef.current=s;if(videoRef.current)videoRef.current.srcObject=s;}catch{setError("Camera denied.");setScanning(false);}};
  const stopCam=()=>{streamRef.current?.getTracks().forEach(t=>t.stop());setScanning(false);};
  useEffect(()=>()=>stopCam(),[]);
  const save=()=>{if(!name||!phone||!vehicleInfo)return;onAdd({name,phone,...vehicleInfo});onClose();};
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:440}}>
    <div style={S.modalHead}><span style={S.modalTitle}>New Client — VIN</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    {step===1&&<>{!scanning
      ?<div style={{height:120,background:"#080808",borderRadius:10,marginBottom:12,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,position:"relative"}}>
         {["tl","tr","bl","br"].map(p=><Corner key={p} pos={p}/>)}
         <div style={{color:C.muted,fontSize:11,fontWeight:700,letterSpacing:2}}>CAMERA INACTIVE</div>
         <button style={{...S.btnPrimary,fontSize:12,padding:"6px 14px"}} onClick={startCam}>📷 Start Camera</button>
       </div>
      :<div style={{position:"relative",height:150,background:"#000",borderRadius:10,marginBottom:12,overflow:"hidden",border:`1px solid ${C.accent}`}}>
         <video ref={videoRef} autoPlay playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/>
         {["tl","tr","bl","br"].map(p=><Corner key={p} pos={p}/>)}
         <div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:7}}>
           <button style={{...S.btnSecondary,fontSize:11,padding:"4px 9px"}} onClick={stopCam}>Stop</button>
           <button style={{...S.btnPrimary,fontSize:11,padding:"4px 9px"}} onClick={()=>{stopCam();setVin("1HGBH41JXMN109186");}}>Simulate</button>
         </div>
       </div>}
    <label style={S.label}>VIN</label>
    <input style={S.input} placeholder="17-char VIN" value={vin} onChange={e=>setVin(e.target.value.toUpperCase())} maxLength={17}/>
    {error&&<div style={{color:C.red,fontSize:12,marginBottom:10}}>{error}</div>}
    <button style={{...S.btnPrimary,width:"100%"}} onClick={()=>lookupVIN(vin)} disabled={loading}>{loading?"Looking up…":"🔍 Look Up VIN"}</button></>}
    {step===2&&vehicleInfo&&<>
      <div style={{background:C.accentDim,border:`1px solid ${C.accent}30`,borderRadius:8,padding:"10px 12px",marginBottom:12}}>
        <div style={{color:C.accent,fontSize:11,fontWeight:700,marginBottom:4}}>✓ VEHICLE IDENTIFIED</div>
        {[["Vehicle",vehicleInfo.vehicle],["VIN",vehicleInfo.vin],["Engine",vehicleInfo.engine]].filter(([,v])=>v&&v!=="null"&&v!=="Not Applicable").map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.muted,fontSize:11}}>{l}</span><span style={{color:C.text,fontSize:12,fontFamily:l==="VIN"?"monospace":"inherit"}}>{v}</span></div>
        ))}
      </div>
      <label style={S.label}>Customer Name</label><input style={S.input} placeholder="Full name" value={name} onChange={e=>setName(e.target.value)}/>
      <label style={S.label}>Phone</label><input style={S.input} placeholder="555-000-0000" value={phone} onChange={e=>setPhone(e.target.value)}/>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>{setStep(1);setVehicleInfo(null);}}>← Back</button><button style={{...S.btnPrimary,flex:1}} onClick={save} disabled={!name||!phone}>Create Client</button></div>
    </>}
  </div></div>);
}

function QuoteBuilder({mechanic,vehicle,onClose,onSend}){
  const [items,setItems]=useState([{id:1,description:"",parts:0,labor:0}]);
  const [notes,setNotes]=useState("");const [sig,setSig]=useState(mechanic.signature||"");const [sigMode,setSigMode]=useState("text");
  const addItem=()=>setItems(p=>[...p,{id:Date.now(),description:"",parts:0,labor:0}]);
  const updateItem=(id,field,val)=>setItems(p=>p.map(i=>i.id===id?{...i,[field]:val}:i));
  const removeItem=(id)=>setItems(p=>p.filter(i=>i.id!==id));
  const totalParts=items.reduce((a,i)=>a+Number(i.parts),0);
  const totalLabor=items.reduce((a,i)=>a+Number(i.labor),0);
  const total=totalParts+totalLabor;
  const send=()=>{onSend({items,notes,totalParts,totalLabor,total,vehicle:vehicle.vehicle,vehicleId:vehicle.id,customerId:vehicle.customerId,mechanicName:mechanic.name,mechanicShop:mechanic.shop,mechanicSig:sig,date:new Date().toLocaleDateString(),status:"pending"});onClose();};
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:500}}>
    <div style={S.modalHead}><span style={S.modalTitle}>Build Quote</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    <div style={{background:C.faint,borderRadius:8,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:600,fontSize:14}}>{vehicle.vehicle}</div><div style={{color:C.muted,fontSize:12}}>{vehicle.name}</div></div><div style={{textAlign:"right",color:C.muted,fontSize:11}}>{mechanic.shop}<br/>{new Date().toLocaleDateString()}</div></div>
    <div style={{marginBottom:10}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 75px 75px 26px",gap:5,marginBottom:5}}>{["Description","Parts","Labor",""].map(h=><div key={h} style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
      {items.map(item=><div key={item.id} style={{display:"grid",gridTemplateColumns:"1fr 75px 75px 26px",gap:5,marginBottom:5}}>
        <input style={{...S.input,margin:0,fontSize:12}} placeholder="e.g. Brake Pads" value={item.description} onChange={e=>updateItem(item.id,"description",e.target.value)}/>
        <input style={{...S.input,margin:0,fontSize:12}} type="number" placeholder="0" value={item.parts||""} onChange={e=>updateItem(item.id,"parts",e.target.value)}/>
        <input style={{...S.input,margin:0,fontSize:12}} type="number" placeholder="0" value={item.labor||""} onChange={e=>updateItem(item.id,"labor",e.target.value)}/>
        <button onClick={()=>removeItem(item.id)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.red,cursor:"pointer",fontSize:14}}>×</button>
      </div>)}
      <button style={{...S.btnSecondary,fontSize:11,padding:"5px 10px"}} onClick={addItem}>+ Add Line</button>
    </div>
    <div style={{background:C.faint,borderRadius:8,padding:"8px 12px",marginBottom:10}}>
      {[["Parts Total",`$${totalParts.toFixed(2)}`],["Labor Total",`$${totalLabor.toFixed(2)}`]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.muted,fontSize:12}}>{l}</span><span style={{fontSize:12}}>{v}</span></div>)}
      <div style={{display:"flex",justifyContent:"space-between",borderTop:`1px solid ${C.border}`,paddingTop:5,marginTop:3}}><span style={{fontWeight:700,fontSize:13}}>Total</span><span style={{fontWeight:700,fontSize:13,color:C.accent}}>${total.toFixed(2)}</span></div>
    </div>
    <label style={S.label}>Notes</label><textarea style={{...S.input,height:48,resize:"none"}} value={notes} onChange={e=>setNotes(e.target.value)}/>
    <label style={S.label}>Signature</label>
    <div style={{display:"flex",gap:7,marginBottom:8}}>{["text","draw"].map(m=><button key={m} onClick={()=>setSigMode(m)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${sigMode===m?C.accent:C.border}`,background:sigMode===m?C.accentDim:"transparent",color:sigMode===m?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>{m==="text"?"Text":"Draw"}</button>)}</div>
    {sigMode==="text"?<input style={{...S.input,fontFamily:"cursive",fontSize:18,color:C.accent}} value={sig} onChange={e=>setSig(e.target.value)}/>:<SignaturePad onChange={setSig}/>}
    <div style={{display:"flex",gap:8,marginTop:10}}><button style={S.btnSecondary} onClick={onClose}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={send} disabled={items.every(i=>!i.description)}>Send Quote</button></div>
  </div></div>);
}

function LogCompletedService({mechanic,vehicle,onClose,onSend}){
  const [type,setType]=useState(SERVICE_TYPES[0]);const [date,setDate]=useState(new Date().toISOString().split("T")[0]);const [mileage,setMileage]=useState(vehicle.mileage||"");const [notes,setNotes]=useState("");
  const send=()=>{if(!mileage)return;onSend(vehicle.id,{id:Date.now(),type,date,mileage:Number(mileage),notes,mechanicName:mechanic.name,mechanicShop:mechanic.shop});onClose();};
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:390}}>
    <div style={S.modalHead}><span style={S.modalTitle}>Log Completed Service</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    <div style={{background:C.accentDim,border:`1px solid ${C.accent}22`,borderRadius:8,padding:"8px 12px",marginBottom:10,color:C.muted,fontSize:12}}>ℹ️ Sent to <strong style={{color:C.text}}>{vehicle.name}</strong> for approval.</div>
    <label style={S.label}>Service Type</label><select style={S.input} value={type} onChange={e=>setType(e.target.value)}>{SERVICE_TYPES.map(t=><option key={t}>{t}</option>)}</select>
    <label style={S.label}>Date</label><input style={S.input} type="date" value={date} onChange={e=>setDate(e.target.value)}/>
    <label style={S.label}>Mileage</label><input style={S.input} type="number" value={mileage} onChange={e=>setMileage(e.target.value)}/>
    <label style={S.label}>Notes</label><textarea style={{...S.input,height:60,resize:"none"}} value={notes} onChange={e=>setNotes(e.target.value)}/>
    <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={onClose}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={send} disabled={!mileage}>📤 Send for Approval</button></div>
  </div></div>);
}

function QuoteCard({quote,isCustomer,onRespond}){
  const [showCounter,setShowCounter]=useState(false);const [counterNote,setCounterNote]=useState("");
  const statusColors={pending:C.orange,accepted:C.green,declined:C.red,countered:C.blue};
  const col=statusColors[quote.status]||C.muted;
  return(<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:10}}>
    <div style={{padding:"10px 13px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontWeight:700,fontSize:13}}>{quote.vehicle}</div><div style={{color:C.muted,fontSize:12}}>{isCustomer?`From ${quote.mechanicShop}`:`For ${quote.name||"Customer"}`} · {quote.date}</div></div>
      <span style={{background:col+"18",color:col,borderRadius:99,fontSize:11,fontWeight:700,padding:"2px 8px"}}>{quote.status?.toUpperCase()}</span>
    </div>
    <div style={{padding:"10px 13px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 70px 70px",gap:5,marginBottom:5}}>{["Service","Parts","Labor"].map(h=><div key={h} style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
      {quote.items?.map((item,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 70px 70px",gap:5,marginBottom:4}}><span style={{fontSize:12}}>{item.description}</span><span style={{fontSize:12}}>${Number(item.parts).toFixed(2)}</span><span style={{fontSize:12}}>${Number(item.labor).toFixed(2)}</span></div>)}
      <div style={{borderTop:`1px solid ${C.border}`,marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted,fontSize:11}}>Parts: ${quote.totalParts?.toFixed(2)} · Labor: ${quote.totalLabor?.toFixed(2)}</span><span style={{fontWeight:700,fontSize:13,color:C.accent}}>Total: ${quote.total?.toFixed(2)}</span></div>
      {quote.notes&&<div style={{color:C.muted,fontSize:11,marginTop:4,fontStyle:"italic"}}>{quote.notes}</div>}
      {quote.mechanicSig&&<div style={{marginTop:7,borderTop:`1px solid ${C.border}`,paddingTop:6}}><div style={{color:C.muted,fontSize:10,marginBottom:2}}>SIGNED BY</div><div style={{fontFamily:"cursive",fontSize:17,color:C.accent}}>{quote.mechanicSig}</div></div>}
      {quote.counterOffer&&<div style={{background:C.blueDim,border:`1px solid ${C.blue}30`,borderRadius:6,padding:"5px 9px",marginTop:6}}><div style={{color:C.blue,fontSize:10,fontWeight:700,marginBottom:1}}>COUNTER</div><div style={{fontSize:12}}>{quote.counterOffer}</div></div>}
    </div>
    {isCustomer&&quote.status==="pending"&&<div style={{padding:"8px 13px",borderTop:`1px solid ${C.border}`,display:"flex",gap:6,flexWrap:"wrap"}}>
      <button style={{...S.btnSecondary,borderColor:C.green+"40",color:C.green,fontSize:12,padding:"5px 11px"}} onClick={()=>onRespond(quote.id,"accepted","")}>✓ Accept</button>
      <button style={{...S.btnSecondary,borderColor:C.red+"40",color:C.red,fontSize:12,padding:"5px 11px"}} onClick={()=>onRespond(quote.id,"declined","")}>✕ Decline</button>
      <button style={{...S.btnSecondary,borderColor:C.blue+"40",color:C.blue,fontSize:12,padding:"5px 11px"}} onClick={()=>setShowCounter(!showCounter)}>↔ Counter</button>
    </div>}
    {showCounter&&<div style={{padding:"0 13px 10px"}}><textarea style={{...S.input,height:48,resize:"none",fontSize:12}} placeholder="Suggest different terms…" value={counterNote} onChange={e=>setCounterNote(e.target.value)}/><button style={{...S.btnPrimary,fontSize:12}} onClick={()=>{onRespond(quote.id,"countered",counterNote);setShowCounter(false);}}>Send Counter</button></div>}
  </div>);
}

function PendingServiceCard({service,onAccept,onDecline}){
  return(<div style={{background:C.surface,border:`2px solid ${C.orange}44`,borderRadius:10,overflow:"hidden",marginBottom:9}}>
    <div style={{background:C.orangeDim,padding:"6px 11px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>🔔</span><span style={{color:C.orange,fontSize:11,fontWeight:700}}>MECHANIC COMPLETED — CONFIRM TO ADD TO HISTORY</span></div>
    <div style={{padding:"10px 13px"}}>
      <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{service.type}</div>
      <div style={{color:C.muted,fontSize:12}}>{service.date} · {Number(service.mileage).toLocaleString()} mi · By {service.mechanicName}</div>
      {service.notes&&<div style={{color:C.text,fontSize:12,marginTop:5,padding:"6px 9px",background:C.faint,borderRadius:5,fontStyle:"italic"}}>"{service.notes}"</div>}
      <div style={{display:"flex",gap:7,marginTop:9}}>
        <button style={{...S.btnSecondary,flex:1,borderColor:C.red+"40",color:C.red,fontSize:12}} onClick={onDecline}>✕ Decline</button>
        <button style={{...S.btnPrimary,flex:1,background:C.green,color:"#000",fontSize:12}} onClick={onAccept}>✓ Add to History</button>
      </div>
    </div>
  </div>);
}

function ProfilePage({user,users,setUsers,onClose}){
  const [editing,setEditing]=useState(false);const [form,setForm]=useState({bio:user.bio||"",photo:user.photo||"",logo:user.logo||"",signature:user.signature||""});const [sigMode,setSigMode]=useState("text");
  const isMech=user.role==="mechanic"||user.role==="admin";
  const emojis=["😎","👩","🧑","👨","👩‍🔧","🧑‍🔧","👨‍🔧","🙂","😊","🤙"];const logoEmojis=["🔧","⭐","⚡","🚗","🏎","🔩","🛞","🛠","🔑","🏆"];
  const save=()=>{setUsers(prev=>prev.map(u=>u.id===user.id?{...u,...form}:u));setEditing(false);};
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:440}}>
    <div style={S.modalHead}><span style={S.modalTitle}>{editing?"Edit Profile":"My Profile"}</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    {!editing?<>
      <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:14}}><div style={{fontSize:48}}>{user.photo||"😎"}</div><div><div style={{fontWeight:700,fontSize:16}}>{user.name}</div><div style={{color:C.muted,fontSize:12,textTransform:"capitalize"}}>{user.role}</div>{isMech&&<div style={{color:C.muted,fontSize:12}}>{user.shop} · {user.specialty}</div>}</div></div>
      {isMech&&user.logo&&<div style={{fontSize:28,marginBottom:7}}>{user.logo} <span style={{color:C.muted,fontSize:12}}>Shop Logo</span></div>}
      <div style={{color:C.text,fontSize:13,lineHeight:1.6,marginBottom:11}}>{user.bio||"No bio yet."}</div>
      {isMech&&user.signature&&<div style={{background:C.faint,borderRadius:7,padding:"6px 11px",marginBottom:11}}><div style={{color:C.muted,fontSize:10,marginBottom:2}}>SIGNATURE</div><div style={{fontFamily:"cursive",fontSize:19,color:C.accent}}>{user.signature}</div></div>}
      {isMech&&<div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}><Stars rating={user.rating}/><span style={{fontSize:12}}>{user.rating} ({user.reviews} reviews)</span></div>}
      <button style={S.btnPrimary} onClick={()=>setEditing(true)}>Edit Profile</button>
    </>:<>
      <label style={S.label}>Profile Photo</label>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>{emojis.map(e=><button key={e} onClick={()=>setForm(p=>({...p,photo:e}))} style={{fontSize:20,background:form.photo===e?C.accentDim:"none",border:`1px solid ${form.photo===e?C.accent:C.border}`,borderRadius:7,padding:"3px 6px",cursor:"pointer"}}>{e}</button>)}</div>
      {isMech&&<><label style={S.label}>Shop Logo</label><div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>{logoEmojis.map(e=><button key={e} onClick={()=>setForm(p=>({...p,logo:e}))} style={{fontSize:20,background:form.logo===e?C.accentDim:"none",border:`1px solid ${form.logo===e?C.accent:C.border}`,borderRadius:7,padding:"3px 6px",cursor:"pointer"}}>{e}</button>)}</div></>}
      <label style={S.label}>Bio</label><textarea style={{...S.input,height:58,resize:"none"}} value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))}/>
      {isMech&&<><label style={S.label}>Signature</label>
        <div style={{display:"flex",gap:7,marginBottom:7}}>{["text","draw"].map(m=><button key={m} onClick={()=>setSigMode(m)} style={{padding:"3px 9px",borderRadius:6,border:`1px solid ${sigMode===m?C.accent:C.border}`,background:sigMode===m?C.accentDim:"transparent",color:sigMode===m?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>{m==="text"?"Text":"Draw"}</button>)}</div>
        {sigMode==="text"?<input style={{...S.input,fontFamily:"cursive",fontSize:17,color:C.accent}} value={form.signature} onChange={e=>setForm(p=>({...p,signature:e.target.value}))}/>:<SignaturePad onChange={v=>setForm(p=>({...p,signature:v}))}/>}
      </>}
      <div style={{display:"flex",gap:8,marginTop:9}}><button style={S.btnSecondary} onClick={()=>setEditing(false)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={save}>Save</button></div>
    </>}
  </div></div>);
}

function Marketplace({user,listings,setListings,onDM,userLocation}){
  const [filters,setFilters]=useState({make:"Any",model:"Any",bodyType:"Any",color:"Any",condition:"Any",minPrice:"",maxPrice:"",minMiles:"",maxMiles:"",maxDist:50});
  const [sort,setSort]=useState("newest");const [selected,setSelected]=useState(null);const [showCreate,setShowCreate]=useState(false);
  const [offerTarget,setOfferTarget]=useState(null);const [offerAmt,setOfferAmt]=useState("");const [offerMsg,setOfferMsg]=useState("");const [offerSent,setOfferSent]=useState(false);
  const [customMake,setCustomMake]=useState(false);const [customModel,setCustomModel]=useState(false);
  const setF=(k,v)=>setFilters(p=>({...p,[k]:v}));
  const availableModels=(CAR_MODELS[filters.make]||[]);
  const filtered=listings.filter(l=>{
    if(filters.make!=="Any"&&l.make!==filters.make)return false;
    if(filters.model&&!l.model.toLowerCase().includes(filters.model.toLowerCase()))return false;
    if(filters.bodyType!=="Any"&&MODEL_TYPES[l.model]!==filters.bodyType)return false;
    if(filters.color!=="Any"&&l.color!==filters.color)return false;
    if(filters.condition!=="Any"&&l.condition!==filters.condition)return false;
    if(filters.minPrice&&l.price<Number(filters.minPrice))return false;
    if(filters.maxPrice&&l.price>Number(filters.maxPrice))return false;
    if(filters.minMiles&&l.mileage<Number(filters.minMiles))return false;
    if(filters.maxMiles&&l.mileage>Number(filters.maxMiles))return false;
    if(userLocation){const d=distanceMiles(userLocation.lat,userLocation.lng,l.lat,l.lng);if(d>Number(filters.maxDist))return false;}
    return true;
  }).sort((a,b)=>{
    if(sort==="price_asc")return a.price-b.price;
    if(sort==="price_desc")return b.price-a.price;
    if(sort==="miles")return a.mileage-b.mileage;
    if(sort==="distance"&&userLocation)return distanceMiles(userLocation.lat,userLocation.lng,a.lat,a.lng)-distanceMiles(userLocation.lat,userLocation.lng,b.lat,b.lng);
    return 0;
  });
  const sendOffer=()=>{if(!offerAmt)return;setListings(prev=>prev.map(l=>l.id===offerTarget.id?{...l,offers:[...l.offers,{id:Date.now(),buyerId:user.id,buyerName:user.name,amount:Number(offerAmt),message:offerMsg,status:"pending",time:"Just now"}]}:l));setOfferSent(true);};
  return(<div style={{display:"flex",height:"calc(100vh - 56px)",overflow:"hidden"}}>
    <div style={{width:218,borderRight:`1px solid ${C.border}`,padding:"14px 12px",overflow:"auto",flexShrink:0,background:C.surface}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,letterSpacing:2,color:C.accent,marginBottom:12}}>FILTERS</div>

      {/* Body Type */}
      <label style={S.label}>Body Type</label>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
        {BODY_TYPES.map(t=><button key={t} onClick={()=>setF("bodyType",t)} style={{padding:"3px 8px",borderRadius:99,border:`1px solid ${filters.bodyType===t?C.accent:C.border}`,background:filters.bodyType===t?C.accentDim:"transparent",color:filters.bodyType===t?C.accent:C.muted,fontSize:10,fontWeight:600,cursor:"pointer"}}>{t}</button>)}
      </div>

      {/* Distance */}
      {userLocation&&<><label style={S.label}>Max Distance</label><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}><input type="range" min={5} max={200} value={filters.maxDist} onChange={e=>setF("maxDist",e.target.value)} style={{flex:1,accentColor:C.accent}}/><span style={{fontSize:11,color:C.text,minWidth:44}}>{filters.maxDist} mi</span></div></>}

      {/* Make */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <label style={{...S.label,marginBottom:0}}>Make</label>
        <button onClick={()=>{setCustomMake(!customMake);setF("make","Any");}} style={{background:"none",border:"none",color:C.accent,fontSize:10,cursor:"pointer"}}>{customMake?"Use List":"Type It In"}</button>
      </div>
      {customMake
        ? <input style={{...S.input,marginBottom:8}} placeholder="e.g. Porsche, Volvo..." value={filters.make==="Any"?"":filters.make} onChange={e=>setF("make",e.target.value||"Any")}/>
        : <select style={{...S.input,marginBottom:8}} value={filters.make} onChange={e=>{setF("make",e.target.value);setF("model","Any");}}>
            {CAR_MAKES.map(m=><option key={m}>{m}</option>)}
          </select>
      }

      {/* Model — only shown when make is selected */}
      {filters.make!=="Any"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <label style={{...S.label,marginBottom:0}}>Model</label>
          <button onClick={()=>setCustomModel(!customModel)} style={{background:"none",border:"none",color:C.accent,fontSize:10,cursor:"pointer"}}>{customModel?"Use List":"Type It In"}</button>
        </div>
        {customModel||availableModels.length===0
          ? <input style={{...S.input,marginBottom:8}} placeholder="e.g. Civic, Accord..." value={filters.model==="Any"?"":filters.model} onChange={e=>setF("model",e.target.value||"Any")}/>
          : <select style={{...S.input,marginBottom:8}} value={filters.model} onChange={e=>setF("model",e.target.value)}>
              <option value="Any">Any Model</option>
              {availableModels.map(m=><option key={m}>{m}</option>)}
            </select>
        }
      </>}

      <label style={S.label}>Color</label>
      <select style={{...S.input,marginBottom:8}} value={filters.color} onChange={e=>setF("color",e.target.value)}>{CAR_COLORS.map(c=><option key={c}>{c}</option>)}</select>
      <label style={S.label}>Condition</label>
      <select style={{...S.input,marginBottom:8}} value={filters.condition} onChange={e=>setF("condition",e.target.value)}>{["Any","Excellent","Good","Fair","Poor"].map(c=><option key={c}>{c}</option>)}</select>
      <label style={S.label}>Price ($)</label>
      <div style={{display:"flex",gap:5,marginBottom:8}}><input style={{...S.input,margin:0,fontSize:11,padding:"5px 7px"}} placeholder="Min" value={filters.minPrice} onChange={e=>setF("minPrice",e.target.value)}/><input style={{...S.input,margin:0,fontSize:11,padding:"5px 7px"}} placeholder="Max" value={filters.maxPrice} onChange={e=>setF("maxPrice",e.target.value)}/></div>
      <label style={S.label}>Mileage</label>
      <div style={{display:"flex",gap:5,marginBottom:10}}><input style={{...S.input,margin:0,fontSize:11,padding:"5px 7px"}} placeholder="Min" value={filters.minMiles} onChange={e=>setF("minMiles",e.target.value)}/><input style={{...S.input,margin:0,fontSize:11,padding:"5px 7px"}} placeholder="Max" value={filters.maxMiles} onChange={e=>setF("maxMiles",e.target.value)}/></div>
      <button onClick={()=>{setFilters({make:"Any",model:"Any",bodyType:"Any",color:"Any",condition:"Any",minPrice:"",maxPrice:"",minMiles:"",maxMiles:"",maxDist:50});setCustomMake(false);setCustomModel(false);}} style={{...S.btnSecondary,width:"100%",fontSize:11,padding:"5px 0"}}>Clear All</button>
    </div>
    <div style={{flex:1,overflow:"auto",padding:"16px 18px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}}>MARKETPLACE</span><span style={{color:C.muted,fontSize:12,marginLeft:8}}>{filtered.length} listings</span></div>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          <select style={{...S.input,margin:0,fontSize:11,padding:"5px 9px",width:"auto"}} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">Newest</option><option value="price_asc">Price Low-High</option><option value="price_desc">Price High-Low</option><option value="miles">Lowest Miles</option>{userLocation&&<option value="distance">Nearest</option>}
          </select>
          <button style={S.btnPrimary} onClick={()=>setShowCreate(true)}>+ List a Car</button>
        </div>
      </div>
      {filtered.length===0&&<div style={{textAlign:"center",padding:"36px 16px",color:C.muted}}><div style={{fontSize:44,marginBottom:10}}>🔍</div><div>No listings match your filters</div></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
        {filtered.map(l=>{const dist=userLocation?distanceMiles(userLocation.lat,userLocation.lng,l.lat,l.lng):null;return(
          <div key={l.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,overflow:"hidden",cursor:"pointer"}} onClick={()=>setSelected(l)}>
            <div style={{height:135,background:C.faint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:56,borderBottom:`1px solid ${C.border}`}}>{l.photos[0]}</div>
            <div style={{padding:"10px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><div style={{fontWeight:700,fontSize:14}}>{l.year} {l.make} {l.model}</div><div style={{fontWeight:700,fontSize:14,color:C.accent}}>${l.price.toLocaleString()}</div></div>
              <div style={{color:C.muted,fontSize:11,marginBottom:4}}>{l.trim} · {l.color} · {l.condition}</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.muted,fontSize:11}}>🔢 {l.mileage.toLocaleString()} mi</span>{dist!=null&&<span style={{color:C.muted,fontSize:11}}>📍 {dist<1?"<1":dist.toFixed(1)} mi</span>}</div>
              <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{fontSize:14}}>{l.sellerPhoto}</div><span style={{fontSize:11,color:C.muted}}>{l.sellerName}</span>{l.verified&&<span style={{background:C.greenDim,color:C.green,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:99}}>✓ MECH</span>}</div>
            </div>
          </div>
        );})}
      </div>
    </div>
    {selected&&<div style={{position:"fixed",inset:0,background:"#00000099",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,width:"100%",maxWidth:520,maxHeight:"90vh",overflow:"auto"}}>
        <div style={{height:190,background:C.faint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:70,borderBottom:`1px solid ${C.border}`,position:"relative"}}>
          {selected.photos[0]}<button onClick={()=>setSelected(null)} style={{position:"absolute",top:10,right:10,background:"#000000aa",border:"none",color:"#fff",borderRadius:99,width:27,height:27,cursor:"pointer",fontSize:14}}>✕</button>
        </div>
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1}}>{selected.year} {selected.make} {selected.model}</div><div style={{color:C.muted,fontSize:12}}>{selected.trim} · {selected.color} · {selected.condition}</div></div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.accent}}>${selected.price.toLocaleString()}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:11}}>{[["Mileage",selected.mileage.toLocaleString()+" mi"],["Location",selected.city],["Listed",selected.listed],["Condition",selected.condition]].map(([l,v])=><div key={l} style={{background:C.faint,borderRadius:6,padding:"6px 8px"}}><div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:1}}>{l}</div><div style={{fontSize:12}}>{v}</div></div>)}</div>
          {userLocation&&<div style={{color:C.muted,fontSize:12,marginBottom:8}}>📍 {distanceMiles(userLocation.lat,userLocation.lng,selected.lat,selected.lng).toFixed(1)} miles away</div>}
          <div style={{color:C.text,fontSize:13,lineHeight:1.6,marginBottom:11}}>{selected.description}</div>
          {selected.features?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:11}}>{selected.features.map(f=><span key={f} style={{background:C.accentDim,color:C.accent,borderRadius:99,fontSize:11,padding:"2px 8px"}}>{f}</span>)}</div>}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:C.faint,borderRadius:8,marginBottom:11}}><div style={{fontSize:24}}>{selected.sellerPhoto}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{selected.sellerName}</div><div style={{color:C.muted,fontSize:11}}>{selected.verified?"Verified Mechanic":"Private Seller"}</div></div>{selected.verified&&<span style={{background:C.greenDim,color:C.green,fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:99}}>✓ VERIFIED</span>}</div>
          {selected.offers.filter(o=>o.buyerId===user.id).length>0&&<div style={{background:C.accentDim,border:`1px solid ${C.accent}22`,borderRadius:7,padding:"6px 10px",marginBottom:9}}><div style={{color:C.accent,fontSize:10,fontWeight:700,marginBottom:1}}>YOUR OFFER</div>{selected.offers.filter(o=>o.buyerId===user.id).map(o=><div key={o.id} style={{fontSize:12}}>${o.amount.toLocaleString()} — <span style={{color:o.status==="pending"?C.orange:C.green}}>{o.status.toUpperCase()}</span></div>)}</div>}
          {selected.sellerId!==user.id&&<div style={{display:"flex",gap:8}}><button style={{...S.btnSecondary,flex:1}} onClick={()=>{onDM(selected.sellerId);setSelected(null);}}>💬 Message</button><button style={{...S.btnPrimary,flex:1}} onClick={()=>{setOfferTarget(selected);setOfferSent(false);}}>💰 Make Offer</button></div>}
          {selected.sellerId===user.id&&<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:"6px 0"}}>Your listing · {selected.offers.length} offer{selected.offers.length!==1?"s":""}</div>}
        </div>
      </div>
    </div>}
    {offerTarget&&<div style={S.overlay}><div style={{...S.modal,maxWidth:380}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Make an Offer</span><button onClick={()=>{setOfferTarget(null);setOfferSent(false);}} style={S.iconBtn}>✕</button></div>
      {!offerSent?<><div style={{background:C.faint,borderRadius:7,padding:"8px 10px",marginBottom:10}}><div style={{fontWeight:600,fontSize:13}}>{offerTarget.year} {offerTarget.make} {offerTarget.model}</div><div style={{color:C.muted,fontSize:12}}>Listed at <strong style={{color:C.accent}}>${offerTarget.price.toLocaleString()}</strong></div></div>
      <label style={S.label}>Your Offer ($)</label><input style={S.input} type="number" placeholder={offerTarget.price} value={offerAmt} onChange={e=>setOfferAmt(e.target.value)}/>
      <label style={S.label}>Message (optional)</label><textarea style={{...S.input,height:55,resize:"none"}} placeholder="Hi! I am interested..." value={offerMsg} onChange={e=>setOfferMsg(e.target.value)}/>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setOfferTarget(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={sendOffer} disabled={!offerAmt}>Send Offer</button></div></>
      :<div style={{textAlign:"center",padding:"16px 0"}}><div style={{fontSize:42,marginBottom:8}}>🎉</div><div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Offer Sent!</div><div style={{color:C.muted,fontSize:13,marginBottom:14}}>Your offer of <strong style={{color:C.accent}}>${Number(offerAmt).toLocaleString()}</strong> was sent to {offerTarget.sellerName}.</div><button style={S.btnPrimary} onClick={()=>{setOfferTarget(null);setSelected(null);}}>Done</button></div>}
    </div></div>}
    {showCreate&&<CreateListing user={user} onClose={()=>setShowCreate(false)} onSave={l=>{setListings(p=>[{...l,id:Date.now(),sellerId:user.id,sellerName:user.name,sellerPhoto:user.photo||"😎",verified:user.role==="mechanic"||user.role==="admin",offers:[],listed:new Date().toLocaleDateString(),lat:userLocation?.lat||25.7617,lng:userLocation?.lng||-80.1918,city:userLocation?.city||user.city||"Miami, FL"},...p]);setShowCreate(false);}}/>}
  </div>);
}

function CreateListing({user,onClose,onSave}){
  const [form,setForm]=useState({year:new Date().getFullYear(),make:"Toyota",model:"",trim:"",color:"Black",mileage:"",price:"",condition:"Good",description:"",features:""});
  const [customMake,setCustomMake]=useState(false);const [customModel,setCustomModel]=useState(false);
  const setF=(k,v)=>setForm(p=>({...p,[k]:v}));
  const availableModels=CAR_MODELS[form.make]||[];
  const bodyType=MODEL_TYPES[form.model]||"";
  const save=()=>{if(!form.model||!form.price||!form.mileage)return;onSave({...form,mileage:Number(form.mileage),price:Number(form.price),year:Number(form.year),photos:["🚗"],features:form.features.split(",").map(f=>f.trim()).filter(Boolean)});};
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:480}}>
    <div style={S.modalHead}><span style={S.modalTitle}>List Your Car</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
      <div><label style={S.label}>Year</label><input style={{...S.input,marginBottom:0}} type="number" value={form.year} onChange={e=>setF("year",e.target.value)}/></div>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
          <label style={{...S.label,marginBottom:0}}>Make</label>
          <button onClick={()=>{setCustomMake(!customMake);setF("make","");setF("model","");}} style={{background:"none",border:"none",color:C.accent,fontSize:10,cursor:"pointer"}}>{customMake?"Use List":"Type It In"}</button>
        </div>
        {customMake
          ? <input style={{...S.input,marginBottom:0}} placeholder="e.g. Porsche..." value={form.make} onChange={e=>setF("make",e.target.value)}/>
          : <select style={{...S.input,marginBottom:0}} value={form.make} onChange={e=>{setF("make",e.target.value);setF("model","");}}>{CAR_MAKES.filter(m=>m!=="Any").map(m=><option key={m}>{m}</option>)}</select>
        }
      </div>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
          <label style={{...S.label,marginBottom:0}}>Model</label>
          {availableModels.length>0&&<button onClick={()=>setCustomModel(!customModel)} style={{background:"none",border:"none",color:C.accent,fontSize:10,cursor:"pointer"}}>{customModel?"Use List":"Type It In"}</button>}
        </div>
        {customModel||availableModels.length===0
          ? <input style={{...S.input,marginBottom:0}} placeholder="e.g. Civic..." value={form.model} onChange={e=>setF("model",e.target.value)}/>
          : <select style={{...S.input,marginBottom:0}} value={form.model} onChange={e=>setF("model",e.target.value)}>
              <option value="">Select model...</option>
              {availableModels.map(m=><option key={m}>{m}</option>)}
            </select>
        }
      </div>
      <div><label style={S.label}>Trim</label><input style={{...S.input,marginBottom:0}} placeholder="e.g. EX, Sport..." value={form.trim} onChange={e=>setF("trim",e.target.value)}/></div>
      <div>
        <label style={S.label}>Color</label>
        <select style={{...S.input,marginBottom:0}} value={form.color} onChange={e=>setF("color",e.target.value)}>{CAR_COLORS.filter(c=>c!=="Any").map(c=><option key={c}>{c}</option>)}</select>
      </div>
      <div><label style={S.label}>Mileage</label><input style={{...S.input,marginBottom:0}} type="number" placeholder="e.g. 45000" value={form.mileage} onChange={e=>setF("mileage",e.target.value)}/></div>
      <div><label style={S.label}>Price ($)</label><input style={{...S.input,marginBottom:0}} type="number" placeholder="e.g. 18500" value={form.price} onChange={e=>setF("price",e.target.value)}/></div>
      <div><label style={S.label}>Condition</label><select style={{...S.input,marginBottom:0}} value={form.condition} onChange={e=>setF("condition",e.target.value)}>{["Excellent","Good","Fair","Poor"].map(c=><option key={c}>{c}</option>)}</select></div>
    </div>
    {bodyType&&<div style={{background:C.accentDim,border:`1px solid ${C.accent}22`,borderRadius:6,padding:"5px 10px",marginBottom:10,fontSize:12,color:C.accent}}>Body type: <strong>{bodyType}</strong> (auto-detected)</div>}
    <label style={S.label}>Description</label><textarea style={{...S.input,height:58,resize:"none"}} placeholder="Describe your car..." value={form.description} onChange={e=>setF("description",e.target.value)}/>
    <label style={S.label}>Features (comma separated)</label><input style={S.input} placeholder="e.g. Sunroof, Leather Seats, Backup Camera" value={form.features} onChange={e=>setF("features",e.target.value)}/>
    <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={onClose}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={save} disabled={!form.model||!form.price||!form.mileage}>Publish Listing</button></div>
  </div></div>);
}

function Messages({user,vehicles,users,initContact=null}){
  const contacts=user.role==="customer"?users.filter(u=>u.role!=="customer"):users.filter(u=>u.role==="customer");
  const [active,setActive]=useState(initContact?users.find(u=>u.id===initContact)||contacts[0]:contacts[0]);
  const [msgs,setMsgs]=useState(INIT_MESSAGES);const [draft,setDraft]=useState("");const bottomRef=useRef();
  const thread=msgs.filter(m=>(m.from===user.id&&m.to===active?.id)||(m.from===active?.id&&m.to===user.id));
  const send=()=>{if(!draft.trim()||!active)return;setMsgs(p=>[...p,{id:Date.now(),from:user.id,to:active.id,text:draft.trim(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:"Today"}]);setDraft("");};
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[thread.length,active?.id]);
  const getV=(id)=>vehicles.find(v=>v.customerId===id);
  return(<div style={{display:"flex",height:"calc(100vh - 56px)"}}>
    <div style={{width:205,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
      <div style={{padding:"10px 12px 7px",borderBottom:`1px solid ${C.border}`}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,color:C.accent}}>MESSAGES</div></div>
      <div style={{flex:1,overflow:"auto"}}>{contacts.map(c=>{const v=getV(c.id);const unread=msgs.filter(m=>m.from===c.id&&m.to===user.id).length;return <div key={c.id} onClick={()=>setActive(c)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 11px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,background:active?.id===c.id?C.faint:"transparent"}}><div style={{fontSize:22}}>{c.photo||"😎"}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div><div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.shop||v?.vehicle||""}</div></div>{unread>0&&<Badge count={unread}/>}</div>;})}
      </div>
    </div>
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      {active?<><div style={{padding:"9px 13px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}><div style={{fontSize:22}}>{active.photo||"😎"}</div><div><div style={{fontWeight:600,fontSize:13}}>{active.name}</div><div style={{color:C.muted,fontSize:11}}>{active.shop||getV(active.id)?.vehicle||""}</div></div></div>
      <div style={{flex:1,overflow:"auto",padding:"12px 13px",display:"flex",flexDirection:"column",gap:7}}>{thread.length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",marginTop:32}}>No messages yet 👋</div>}{thread.map(m=>{const mine=m.from===user.id;return <div key={m.id} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start"}}><div style={{maxWidth:"68%",background:mine?C.accent:C.surface,color:mine?"#000":C.text,borderRadius:mine?"14px 14px 3px 14px":"14px 14px 14px 3px",padding:"7px 11px",fontSize:13,border:mine?"none":`1px solid ${C.border}`}}><div>{m.text}</div><div style={{fontSize:10,marginTop:2,opacity:0.5,textAlign:"right"}}>{m.time}</div></div></div>;})}
      <div ref={bottomRef}/></div>
      <div style={{padding:"9px 11px",borderTop:`1px solid ${C.border}`,display:"flex",gap:7}}><input style={{...S.input,margin:0,flex:1}} placeholder="Type a message..." value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button style={S.btnPrimary} onClick={send}>Send</button></div>
      </>:<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Select a conversation</div>}
    </div>
  </div>);
}

function FindMechanic({user,users,onDM,userLocation}){
  const mechanics=users.filter(u=>u.role==="mechanic"||u.role==="admin");
  const [reviews,setReviews]=useState(INIT_REVIEWS);const [showReviews,setShowReviews]=useState(null);const [reviewMech,setReviewMech]=useState(null);const [newReview,setNewReview]=useState({rating:5,text:""});
  const [filter,setFilter]=useState("all");const [maxDist,setMaxDist]=useState(50);
  const filtered=mechanics.filter(m=>{if(filter==="available"&&!m.available)return false;if(userLocation){const d=distanceMiles(userLocation.lat,userLocation.lng,m.lat,m.lng);if(d>maxDist)return false;}return true;})
    .map(m=>({...m,dist:userLocation?distanceMiles(userLocation.lat,userLocation.lng,m.lat,m.lng):null})).sort((a,b)=>a.dist!=null?a.dist-b.dist:0);
  const mechReviews=(id)=>reviews.filter(r=>r.mechanicId===id);
  const avgRating=(id)=>{const r=mechReviews(id);return r.length?(r.reduce((a,b)=>a+b.rating,0)/r.length).toFixed(1):null;};
  const submitReview=()=>{if(!newReview.text.trim())return;setReviews(p=>[...p,{id:Date.now(),mechanicId:reviewMech.id,authorName:user.name,rating:newReview.rating,text:newReview.text,time:"Just now",verified:true}]);setNewReview({rating:5,text:""});setReviewMech(null);};
  return(<div style={{padding:"20px 22px",maxWidth:720}}>
    <div style={{marginBottom:13}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2}}>Find a Mechanic</div><div style={{color:C.muted,fontSize:12}}>Local mechanics near you</div></div>
    <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:11,alignItems:"center"}}>
      {["all","available"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"4px 12px",borderRadius:99,border:`1px solid ${filter===f?C.accent:C.border}`,background:filter===f?C.accentDim:"transparent",color:filter===f?C.accent:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{f==="all"?"All":"Available Now"}</button>)}
      {userLocation&&<div style={{display:"flex",alignItems:"center",gap:7,marginLeft:"auto"}}><span style={{color:C.muted,fontSize:12}}>Within:</span><input type="range" min={1} max={100} value={maxDist} onChange={e=>setMaxDist(Number(e.target.value))} style={{width:70,accentColor:C.accent}}/><span style={{fontSize:12,color:C.text,minWidth:38}}>{maxDist} mi</span></div>}
    </div>
    {filtered.length===0&&<div style={{color:C.muted,fontSize:13,padding:"16px 0"}}>No mechanics within {maxDist} miles. Try increasing distance.</div>}
    {filtered.map(m=>{const r=mechReviews(m.id);const avg=avgRating(m.id);return(
      <div key={m.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"12px 14px",marginBottom:9}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
          <div style={{fontSize:38}}>{m.photo||"🧑‍🔧"}</div>
          <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}><span style={{fontWeight:700,fontSize:14}}>{m.name}</span>{m.available?<span style={{background:C.greenDim,color:C.green,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 7px"}}>● AVAILABLE</span>:<span style={{background:C.faint,color:C.muted,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 7px"}}>BUSY</span>}</div>
          <div style={{color:C.muted,fontSize:12,marginTop:1}}>{m.logo&&<span style={{marginRight:3}}>{m.logo}</span>}{m.shop} · {m.specialty}</div>
          <div style={{color:C.muted,fontSize:12}}>📍 {m.city}{m.dist!=null&&` · ${m.dist<1?"<1":m.dist.toFixed(1)} mi away`}</div>
          {avg&&<div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}><Stars rating={parseFloat(avg)} size={12}/><span style={{fontSize:12,fontWeight:600}}>{avg}</span><span style={{color:C.muted,fontSize:11}}>({r.length} reviews)</span></div>}
          {m.bio&&<div style={{color:C.muted,fontSize:11,marginTop:3,fontStyle:"italic"}}>"{m.bio}"</div>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
            <button style={{...S.btnPrimary,fontSize:12,padding:"6px 11px"}} onClick={()=>onDM(m.id)}>💬 DM</button>
            <button style={{...S.btnSecondary,fontSize:11,padding:"4px 9px"}} onClick={()=>setShowReviews(showReviews===m.id?null:m.id)}>Reviews</button>
            {user.role==="customer"&&<button style={{...S.btnSecondary,borderColor:C.accent+"40",color:C.accent,fontSize:11,padding:"4px 8px"}} onClick={()=>setReviewMech(m)}>✏ Review</button>}
          </div>
        </div>
        {showReviews===m.id&&<div style={{marginTop:9,borderTop:`1px solid ${C.border}`,paddingTop:9}}>{r.length===0&&<div style={{color:C.muted,fontSize:12}}>No reviews yet.</div>}{r.map(rv=><div key={rv.id} style={{marginBottom:7,paddingBottom:7,borderBottom:`1px solid ${C.faint}`}}><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><span style={{fontSize:12,fontWeight:600}}>{rv.authorName}</span>{rv.verified&&<span style={{background:C.greenDim,color:C.green,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:99}}>✓</span>}<span style={{marginLeft:"auto",color:C.muted,fontSize:11}}>{rv.time}</span></div><Stars rating={rv.rating} size={11}/><div style={{color:C.text,fontSize:12,marginTop:2}}>{rv.text}</div></div>)}</div>}
      </div>
    );})}
    {reviewMech&&<div style={S.overlay}><div style={{...S.modal,maxWidth:370}}><div style={S.modalHead}><span style={S.modalTitle}>Review {reviewMech.name}</span><button onClick={()=>setReviewMech(null)} style={S.iconBtn}>✕</button></div><div style={{display:"flex",gap:5,marginBottom:10}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setNewReview(p=>({...p,rating:n}))} style={{fontSize:22,background:"none",border:"none",cursor:"pointer",color:n<=newReview.rating?C.accent:"#333"}}>★</button>)}</div><textarea style={{...S.input,height:70,resize:"none"}} placeholder="Share your experience..." value={newReview.text} onChange={e=>setNewReview(p=>({...p,text:e.target.value}))}/><div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setReviewMech(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={submitReview}>Submit</button></div></div></div>}
  </div>);
}

function Community({user}){
  const [posts,setPosts]=useState(INIT_POSTS);const [newPost,setNewPost]=useState({text:"",tag:JOB_TAGS[0]});const [replyText,setReplyText]=useState({});const [showCompose,setShowCompose]=useState(false);const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?posts:posts.filter(p=>p.tag===filter);
  const submit=()=>{if(!newPost.text.trim())return;setPosts(p=>[{id:Date.now(),authorId:user.id,authorName:user.name,authorRole:user.role,time:"Just now",text:newPost.text,tag:newPost.tag,replies:[]},...p]);setNewPost({text:"",tag:JOB_TAGS[0]});setShowCompose(false);};
  const reply=(postId)=>{const txt=replyText[postId];if(!txt?.trim())return;setPosts(prev=>prev.map(p=>p.id===postId?{...p,replies:[...p.replies,{id:Date.now(),authorId:user.id,authorName:user.name,authorRole:user.role,text:txt.trim(),time:"Just now"}]}:p));setReplyText(p=>({...p,[postId]:""}));};
  const roleColor=(role)=>role==="mechanic"||role==="admin"?C.orange:C.blue;
  return(<div style={{padding:"20px 22px",maxWidth:720}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:11}}><div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2}}>Community Board</div><div style={{color:C.muted,fontSize:12}}>Post requests or offer services</div></div><button style={S.btnPrimary} onClick={()=>setShowCompose(true)}>+ Post</button></div>
    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>{["all",...JOB_TAGS].map(t=><button key={t} onClick={()=>setFilter(t)} style={{padding:"3px 9px",borderRadius:99,border:`1px solid ${filter===t?C.accent:C.border}`,background:filter===t?C.accentDim:"transparent",color:filter===t?C.accent:C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>{t==="all"?"All":t}</button>)}</div>
    {filtered.map(post=>(
      <div key={post.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"11px 13px",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}><div style={{fontSize:22}}>{INIT_USERS.find(u=>u.id===post.authorId)?.photo||"😎"}</div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><span style={{fontWeight:600,fontSize:13}}>{post.authorName}</span><span style={{background:roleColor(post.authorRole)+"18",color:roleColor(post.authorRole),borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 6px"}}>{post.authorRole==="mechanic"||post.authorRole==="admin"?"MECHANIC":"CUSTOMER"}</span><span style={{background:C.accentDim,color:C.accent,borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 6px"}}>{post.tag}</span><span style={{color:C.muted,fontSize:11,marginLeft:"auto"}}>{post.time}</span></div><div style={{color:C.text,fontSize:13,marginTop:5,lineHeight:1.6}}>{post.text}</div></div></div>
        {post.replies.length>0&&<div style={{marginLeft:30,borderLeft:`2px solid ${C.border}`,paddingLeft:10,marginBottom:7}}>{post.replies.map(r=><div key={r.id} style={{marginBottom:6}}><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:12}}>{INIT_USERS.find(u=>u.id===r.authorId)?.photo||"😎"}</span><span style={{fontWeight:600,fontSize:12}}>{r.authorName}</span><span style={{color:C.muted,fontSize:10,marginLeft:"auto"}}>{r.time}</span></div><div style={{color:C.text,fontSize:12,marginTop:2,marginLeft:19}}>{r.text}</div></div>)}</div>}
        <div style={{display:"flex",gap:6,marginLeft:30}}><input style={{...S.input,margin:0,flex:1,fontSize:12,padding:"5px 8px"}} placeholder="Write a reply..." value={replyText[post.id]||""} onChange={e=>setReplyText(p=>({...p,[post.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&reply(post.id)}/><button style={{...S.btnPrimary,padding:"5px 10px",fontSize:12}} onClick={()=>reply(post.id)}>Reply</button></div>
      </div>
    ))}
    {showCompose&&<div style={S.overlay}><div style={{...S.modal,maxWidth:420}}><div style={S.modalHead}><span style={S.modalTitle}>New Post</span><button onClick={()=>setShowCompose(false)} style={S.iconBtn}>✕</button></div><div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>{JOB_TAGS.map(t=><button key={t} onClick={()=>setNewPost(p=>({...p,tag:t}))} style={{padding:"3px 9px",borderRadius:99,border:`1px solid ${newPost.tag===t?C.accent:C.border}`,background:newPost.tag===t?C.accentDim:"transparent",color:newPost.tag===t?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>{t}</button>)}</div><textarea style={{...S.input,height:80,resize:"none"}} placeholder="Describe what you need or offer..." value={newPost.text} onChange={e=>setNewPost(p=>({...p,text:e.target.value}))}/><div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setShowCompose(false)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={submit} disabled={!newPost.text.trim()}>Post</button></div></div></div>}
  </div>);
}

function CustomerPortal({user,users,setUsers,vehicles,setVehicles,quotes,setQuotes,listings,setListings,onLogout}){
  const myVehicles=vehicles.filter(v=>user.vehicleIds?.includes(v.id));const myQuotes=quotes.filter(q=>q.customerId===user.id);
  const totalPending=myVehicles.reduce((a,v)=>a+(v.pendingServices?.length||0),0);
  const [tab,setTab]=useState("garage");const [dmContact,setDmContact]=useState(null);const [showProfile,setShowProfile]=useState(false);const [carPhotoTarget,setCarPhotoTarget]=useState(null);
  const [userLocation,setUserLocation]=useState({lat:user.lat||25.7617,lng:user.lng||-80.1918,city:user.city||"Miami, FL"});
  const handleDM=(id)=>{setDmContact(id);setTab("messages");};
  const respondToQuote=(qid,status,counter)=>setQuotes(p=>p.map(q=>q.id===qid?{...q,status,counterOffer:counter||null}:q));
  const currentUser=users.find(u=>u.id===user.id)||user;
  useEffect(()=>{if(navigator.geolocation){navigator.geolocation.getCurrentPosition(pos=>setUserLocation({lat:pos.coords.latitude,lng:pos.coords.longitude,city:"Current Location"}),()=>{});}},[]);
  const acceptPendingService=(vehicleId,serviceId)=>{setVehicles(prev=>prev.map(v=>{if(v.id!==vehicleId)return v;const svc=v.pendingServices.find(s=>s.id===serviceId);if(!svc)return v;return{...v,services:[{...svc,status:"confirmed"},...v.services],pendingServices:v.pendingServices.filter(s=>s.id!==serviceId),lastVisit:svc.date,mileage:svc.mileage};}));};
  const declinePendingService=(vehicleId,serviceId)=>setVehicles(prev=>prev.map(v=>v.id===vehicleId?{...v,pendingServices:v.pendingServices.filter(s=>s.id!==serviceId)}:v));
  const saveCarPhoto=(vehicleId,photo)=>setVehicles(prev=>prev.map(v=>v.id===vehicleId?{...v,carPhoto:photo}:v));
  const tabs=[{id:"garage",label:"My Garage",badge:totalPending},{id:"quotes",label:"Quotes",badge:myQuotes.filter(q=>q.status==="pending").length},{id:"marketplace",label:"Marketplace"},{id:"find",label:"Find Mechanic"},{id:"board",label:"Community"},{id:"messages",label:"Messages"}];
  return(<div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 12px",display:"flex",alignItems:"center",height:50,overflow:"auto"}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,marginRight:12,flexShrink:0}}><span style={{color:C.accent}}>G</span><span>ARAGEIQ</span></div>
      {tabs.map(t=><button key={t.id} onClick={()=>{setDmContact(null);setTab(t.id);}} style={{padding:"0 9px",height:"100%",border:"none",background:"transparent",color:tab===t.id?C.accent:C.muted,fontSize:11,fontWeight:600,cursor:"pointer",borderBottom:`2px solid ${tab===t.id?C.accent:"transparent"}`,display:"flex",alignItems:"center",gap:4,flexShrink:0,whiteSpace:"nowrap"}}>{t.label}{t.badge>0&&<Badge count={t.badge}/>}</button>)}
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,flexShrink:0}}><button onClick={()=>setShowProfile(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>{currentUser.photo||"😎"}</button><button onClick={onLogout} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:11}}>Sign out</button></div>
    </div>
    {(tab==="marketplace"||tab==="find")&&<LocationBar location={userLocation} onUpdate={setUserLocation}/>}
    {tab==="garage"&&<div style={{padding:"18px 16px",maxWidth:620,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:13}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:1}}>My Garage</div><div style={{color:C.muted,fontSize:12}}>Hey {user.name.split(" ")[0]}!</div></div>
      {myVehicles.map(v=>{const hasPending=(v.pendingServices?.length||0)>0;return(
        <div key={v.id} style={{background:C.surface,border:`1px solid ${hasPending?C.orange+"44":C.border}`,borderRadius:12,overflow:"hidden",marginBottom:15}}>
          <div style={{position:"relative",height:140,background:C.faint,overflow:"hidden",cursor:"pointer"}} onClick={()=>setCarPhotoTarget(v)}>
            {v.carPhoto?<img src={v.carPhoto} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}><div style={{fontSize:40}}>🚗</div><div style={{color:C.muted,fontSize:12}}>Tap to add car photo</div></div>}
            <div style={{position:"absolute",bottom:7,right:7,background:"#000000aa",borderRadius:5,padding:"3px 6px",fontSize:10,color:C.text}}>📷 {v.carPhoto?"Change":"Add"}</div>
          </div>
          <div style={{padding:"10px 13px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:15}}>{v.vehicle}</div><div style={{color:C.muted,fontSize:11,fontFamily:"monospace",marginTop:1}}>VIN: {v.vin}</div><div style={{color:C.muted,fontSize:11,marginTop:1}}>{v.mileage.toLocaleString()} mi · Last visit {v.lastVisit}</div></div>
          {hasPending&&<div style={{padding:"9px 13px",borderBottom:`1px solid ${C.border}`}}><div style={{color:C.orange,fontSize:10,fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:1}}>🔔 Pending Approval</div>{v.pendingServices.map(svc=><PendingServiceCard key={svc.id} service={svc} onAccept={()=>acceptPendingService(v.id,svc.id)} onDecline={()=>declinePendingService(v.id,svc.id)}/>)}</div>}
          {v.alerts.length>0&&<div style={{padding:"9px 13px",borderBottom:`1px solid ${C.border}`}}>{v.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:12}}>{a.text}</span><Pill level={a.level}/></div>)}</div>}
          <div style={{padding:"9px 13px"}}><div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Recent Services</div>{v.services.slice(0,3).map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:i<Math.min(v.services.length,3)-1?`1px solid ${C.border}`:"none"}}><span style={{fontSize:12}}>{s.type}</span><span style={{color:C.muted,fontSize:11}}>{s.date}</span></div>)}</div>
        </div>
      );})}
    </div>}
    {tab==="quotes"&&<div style={{padding:"18px 16px",maxWidth:620,margin:"0 auto",animation:"fadeUp 0.3s ease"}}><div style={{marginBottom:13}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2}}>My Quotes</div></div>{myQuotes.length===0&&<div style={{color:C.muted,fontSize:13}}>No quotes yet.</div>}{myQuotes.map(q=><QuoteCard key={q.id} quote={q} isCustomer={true} onRespond={respondToQuote}/>)}</div>}
    {tab==="marketplace"&&<Marketplace user={currentUser} listings={listings} setListings={setListings} onDM={handleDM} userLocation={userLocation}/>}
    {tab==="find"&&<FindMechanic user={currentUser} users={users} onDM={handleDM} userLocation={userLocation}/>}
    {tab==="board"&&<Community user={currentUser}/>}
    {tab==="messages"&&<Messages user={user} vehicles={vehicles} users={users} initContact={dmContact}/>}
    {carPhotoTarget&&<CarPhotoPicker current={carPhotoTarget.carPhoto} onSave={(photo)=>saveCarPhoto(carPhotoTarget.id,photo)} onClose={()=>setCarPhotoTarget(null)}/>}
    {showProfile&&<ProfilePage user={currentUser} users={users} setUsers={setUsers} onClose={()=>setShowProfile(false)}/>}
  </div>);
}
export default function GarageIQ(){
  const [users,setUsers]=useState(INIT_USERS);const [user,setUser]=useState(null);
  const [vehicles,setVehicles]=useState(INIT_VEHICLES);const [quotes,setQuotes]=useState(INIT_QUOTES);
  const [listings,setListings]=useState(INIT_LISTINGS);
  const [nav,setNav]=useState("dashboard");const [selected,setSelected]=useState(null);const [modal,setModal]=useState(null);
  const [shareTarget,setShareTarget]=useState(null);const [newSvc,setNewSvc]=useState({type:SERVICE_TYPES[0],date:new Date().toISOString().split("T")[0],mileage:"",notes:""});
  const [alertSent,setAlertSent]=useState([]);const [search,setSearch]=useState("");const [showProfile,setShowProfile]=useState(false);
  const [quoteTarget,setQuoteTarget]=useState(null);const [completedTarget,setCompletedTarget]=useState(null);
  const [userLocation,setUserLocation]=useState({lat:25.7617,lng:-80.1918,city:"Miami, FL"});
  useEffect(()=>{if(navigator.geolocation){navigator.geolocation.getCurrentPosition(pos=>setUserLocation({lat:pos.coords.latitude,lng:pos.coords.longitude,city:"Current Location"}),()=>{});}},[]);

  if(!user){
    const LoginScreen=()=>{
      const [email,setEmail]=useState("");const [pass,setPass]=useState("");const [err,setErr]=useState("");const [tab,setTab]=useState("mechanic");
      const handle=()=>{const u=users.find(u=>u.email===email&&u.password===pass);if(!u){setErr("Invalid credentials.");return;}const map={mechanic:["mechanic","admin"],customer:["customer"]};if(!map[tab].includes(u.role)){setErr(`Not a ${tab} account.`);return;}setUser(u);};
      const hints={mechanic:[{label:"Mechanic",e:"jake@garageiq.com",p:"mechanic123"},{label:"Admin",e:"admin@garageiq.com",p:"admin123"}],customer:[{label:"Customer",e:"marcus@email.com",p:"customer123"}]};
      return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{width:"100%",maxWidth:400,animation:"fadeUp 0.4s ease"}}>
          <div style={{textAlign:"center",marginBottom:26}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,lineHeight:1}}><span style={{color:C.accent}}>G</span><span style={{color:C.text}}>ARAGEIQ</span></div><div style={{color:C.muted,fontSize:13,marginTop:3}}>Shop Management & Marketplace</div></div>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:24}}>
            <div style={{display:"flex",background:C.faint,borderRadius:8,padding:3,marginBottom:18}}>{["mechanic","customer"].map(t=><button key={t} onClick={()=>{setTab(t);setErr("");}} style={{flex:1,padding:"7px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:tab===t?C.accent:"transparent",color:tab===t?"#000":C.muted,transition:"all 0.2s"}}>{t==="mechanic"?"Mechanic / Admin":"Customer"}</button>)}</div>
            <label style={S.label}>Email</label><input style={S.input} type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            <label style={S.label}>Password</label><input style={S.input} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            {err&&<div style={{color:C.red,fontSize:12,marginBottom:10}}>{err}</div>}
            <button style={{...S.btnPrimary,width:"100%"}} onClick={handle}>Sign In →</button>
          </div>
          <div style={{marginTop:10,background:C.faint,borderRadius:10,padding:"10px 14px"}}><div style={{color:C.muted,fontSize:11,marginBottom:5,textTransform:"uppercase",letterSpacing:1}}>Demo Accounts</div>{hints[tab].map(h=><button key={h.e} onClick={()=>{setEmail(h.e);setPass(h.p);setErr("");}} style={{display:"block",width:"100%",background:"none",border:"none",textAlign:"left",color:C.accent,fontSize:12,cursor:"pointer",padding:"2px 0"}}>{h.label}: {h.e} / {h.p}</button>)}</div>
        </div>
      </div>;
    };
    return <LoginScreen/>;
  }

  const currentUser=users.find(u=>u.id===user.id)||user;
  if(currentUser.role==="customer") return <CustomerPortal user={currentUser} users={users} setUsers={setUsers} vehicles={vehicles} setVehicles={setVehicles} quotes={quotes} setQuotes={setQuotes} listings={listings} setListings={setListings} onLogout={()=>setUser(null)}/>;

  const totalAlerts=vehicles.reduce((a,v)=>a+v.alerts.length,0);
  const criticals=vehicles.filter(v=>v.alerts.some(a=>a.level==="critical"));
  const myQuotes=quotes.filter(q=>q.mechanicId===user.id);
  const filteredV=vehicles.filter(v=>v.name.toLowerCase().includes(search.toLowerCase())||v.vehicle.toLowerCase().includes(search.toLowerCase())||v.vin.toLowerCase().includes(search.toLowerCase()));
  const addVehicle=({name,phone,vin,vehicle})=>{setVehicles(p=>[{id:Date.now(),customerId:null,name,phone,vin,vehicle,mileage:0,lastVisit:"—",carPhoto:null,services:[],alerts:[{text:"Schedule first service",level:"info"}],pendingServices:[]},...p]);};
  const logService=()=>{if(!selected||!newSvc.mileage)return;const svc={...newSvc,mileage:Number(newSvc.mileage),status:"confirmed"};setVehicles(p=>p.map(v=>v.id===selected.id?{...v,services:[svc,...v.services],lastVisit:svc.date,mileage:svc.mileage}:v));setSelected(p=>({...p,services:[svc,...p.services]}));setModal(null);};
  const sendQuote=(q)=>setQuotes(p=>[{id:Date.now(),mechanicId:user.id,...q},...p]);
  const sendCompletedService=(vehicleId,service)=>{setVehicles(p=>p.map(v=>v.id===vehicleId?{...v,pendingServices:[...(v.pendingServices||[]),service]}:v));if(selected?.id===vehicleId)setSelected(p=>({...p,pendingServices:[...(p.pendingServices||[]),service]}));};

  const navItems=[
    {id:"dashboard",icon:"◈",label:"Dashboard"},
    {id:"customers",icon:"◉",label:"Customers"},
    {id:"quotes",icon:"📋",label:"Quotes",badge:myQuotes.filter(q=>q.status==="countered").length},
    {id:"marketplace",icon:"🏪",label:"Marketplace"},
    {id:"alerts",icon:"⚠",label:"Alerts",badge:totalAlerts},
    {id:"board",icon:"◫",label:"Community"},
    {id:"messages",icon:"✉",label:"Messages"},
  ];

  return(<div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text,overflow:"hidden"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

    <div style={{width:186,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"14px 0",flexShrink:0}}>
      <div style={{padding:"0 12px 18px",display:"flex",alignItems:"baseline",gap:2}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.accent,lineHeight:1}}>G</span><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:3}}>ARAGEIQ</span></div>
      <nav style={{flex:1,padding:"0 7px",display:"flex",flexDirection:"column",gap:1}}>
        {navItems.map(item=><button key={item.id} onClick={()=>{setNav(item.id);setSelected(null);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 9px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,background:nav===item.id?C.accentDim:"transparent",color:nav===item.id?C.accent:C.muted,borderLeft:`2px solid ${nav===item.id?C.accent:"transparent"}`,fontWeight:nav===item.id?600:400,transition:"all 0.15s",textAlign:"left"}}>
          <span style={{fontSize:12,width:15,textAlign:"center"}}>{item.icon}</span>
          <span style={{flex:1}}>{item.label}</span>
          {item.badge>0&&<Badge count={item.badge}/>}
        </button>)}
      </nav>
      <div style={{padding:"10px 9px",borderTop:`1px solid ${C.border}`}}>
        <button onClick={()=>setModal("vin")} style={{width:"100%",background:C.accentDim,border:`1px solid ${C.accent}30`,borderRadius:7,color:C.accent,padding:"6px 0",cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:9}}>+ SCAN VIN</button>
        <button onClick={()=>setShowProfile(true)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",width:"100%",padding:0}}>
          <div style={{fontSize:22}}>{currentUser.photo||"🧑‍🔧"}</div>
          <div style={{minWidth:0,textAlign:"left"}}><div style={{fontSize:11,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{currentUser.name}</div><div style={{fontSize:9,color:C.muted,textTransform:"capitalize"}}>{currentUser.role}</div></div>
          <button onClick={(e)=>{e.stopPropagation();setUser(null);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:9,marginLeft:"auto"}}>out</button>
        </button>
      </div>
    </div>

    <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column"}}>
      {(nav==="marketplace"||nav==="find")&&<LocationBar location={userLocation} onUpdate={setUserLocation}/>}
      <div style={{flex:1,overflow:"auto"}}>

        {nav==="dashboard"&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <div style={{marginBottom:16}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>Dashboard</div><div style={{color:C.muted,fontSize:12}}>Welcome back, {currentUser.name.split(" ")[0]}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:20}}>
            {[{label:"Customers",val:vehicles.length,col:C.accent},{label:"Alerts",val:totalAlerts,col:C.red},{label:"Critical",val:criticals.length,col:C.orange},{label:"Quotes",val:myQuotes.length,col:C.purple}].map((s,i)=>(
              <div key={i} style={{background:C.surface,borderRadius:9,padding:"12px 10px",borderTop:`3px solid ${s.col}`,border:`1px solid ${C.border}`,borderTopColor:s.col}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:s.col,lineHeight:1}}>{s.val}</div>
                <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{s.label}</div>
              </div>
            ))}
          </div>
          {criticals.length>0&&<><div style={S.sectionTitle}>⚠ Needs Attention</div>{criticals.map(v=><div key={v.id} style={{background:C.surface,border:`1px solid ${C.red}22`,borderLeft:`3px solid ${C.red}`,borderRadius:9,padding:"9px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <div><div style={{fontWeight:600,fontSize:13}}>{v.name} <span style={{color:C.muted,fontWeight:400}}>· {v.vehicle}</span></div>{v.alerts.filter(a=>a.level==="critical").map((a,i)=><div key={i} style={{color:C.red,fontSize:11,marginTop:2}}>● {a.text}</div>)}</div>
            <button style={S.btnPrimary} onClick={()=>{setSelected(v);setModal("alert");}}>Alert</button>
          </div>)}</>}
          <div style={S.sectionTitle}>Recent Customers</div>
          {vehicles.slice(0,4).map(v=><div key={v.id} style={{...S.row,cursor:"pointer"}} onClick={()=>{setSelected(v);setNav("detail");}}>
            {v.carPhoto?<img src={v.carPhoto} alt="Car" style={{width:34,height:24,objectFit:"cover",borderRadius:5,flexShrink:0}}/>:<Av name={v.name} size={30}/>}
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{v.name}</div><div style={{color:C.muted,fontSize:11}}>{v.vehicle} · {v.lastVisit}</div></div>
            <span style={{color:v.alerts.length>0?C.red:C.muted,fontSize:11}}>{v.alerts.length} alerts</span>
          </div>)}
        </div>}

        {nav==="customers"&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:13}}>
            <div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>Customers</div><div style={{color:C.muted,fontSize:12}}>{vehicles.length} vehicles</div></div>
            <button style={S.btnPrimary} onClick={()=>setModal("vin")}>+ Scan VIN</button>
          </div>
          <input style={{...S.input,marginBottom:11}} placeholder="Search name, vehicle, VIN…" value={search} onChange={e=>setSearch(e.target.value)}/>
          {filteredV.map(v=><div key={v.id} style={{...S.row,cursor:"pointer"}} onClick={()=>{setSelected(v);setNav("detail");}}>
            {v.carPhoto?<img src={v.carPhoto} alt="Car" style={{width:42,height:30,objectFit:"cover",borderRadius:6,flexShrink:0}}/>:<Av name={v.name} size={32}/>}
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{v.name}</div><div style={{color:C.muted,fontSize:11}}>{v.vehicle} · {v.mileage.toLocaleString()} mi</div></div>
            <span style={{background:v.alerts.length?C.red+"18":C.faint,color:v.alerts.length?C.red:C.muted,borderRadius:99,padding:"2px 8px",fontSize:11,fontWeight:700}}>{v.alerts.length} alerts</span>
          </div>)}
        </div>}

        {nav==="quotes"&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <div style={{marginBottom:13}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>Quotes</div><div style={{color:C.muted,fontSize:12}}>{myQuotes.length} sent</div></div>
          {myQuotes.length===0&&<div style={{color:C.muted,fontSize:13}}>No quotes sent yet. Open a customer and tap Quote.</div>}
          {myQuotes.map(q=>{const v=vehicles.find(vv=>vv.id===q.vehicleId);return <QuoteCard key={q.id} quote={{...q,name:v?.name}} isCustomer={false} onRespond={()=>{}}/>;}) }
        </div>}

        {nav==="marketplace"&&<Marketplace user={currentUser} listings={listings} setListings={setListings} onDM={()=>setNav("messages")} userLocation={userLocation}/>}

        {nav==="alerts"&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <div style={{marginBottom:13}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>Alerts</div><div style={{color:C.muted,fontSize:12}}>{totalAlerts} active</div></div>
          {vehicles.filter(v=>v.alerts.length>0).map(v=><div key={v.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}><Av name={v.name} size={28}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{v.name}</div><div style={{color:C.muted,fontSize:11}}>{v.vehicle}</div></div><button style={S.btnPrimary} onClick={()=>{setSelected(v);setModal("alert");}}>Send Texts</button></div>
            {v.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 7px",borderRadius:5,background:LEVEL_COLOR[a.level]+"0D",marginBottom:3,border:`1px solid ${LEVEL_COLOR[a.level]}22`}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:11,flex:1}}>{a.text}</span><Pill level={a.level}/></div>)}
          </div>)}
        </div>}

        {nav==="board"&&<Community user={currentUser}/>}
        {nav==="messages"&&<Messages user={user} vehicles={vehicles} users={users}/>}
        {nav==="find"&&<FindMechanic user={currentUser} users={users} onDM={()=>setNav("messages")} userLocation={userLocation}/>}

        {nav==="detail"&&selected&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <button onClick={()=>setNav("customers")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,marginBottom:12,padding:0}}>← Back</button>
          {selected.carPhoto&&<div style={{height:145,borderRadius:10,overflow:"hidden",marginBottom:12}}><img src={selected.carPhoto} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>}
          <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:14,flexWrap:"wrap"}}>
            <Av name={selected.name} size={42}/>
            <div style={{flex:1}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:21,letterSpacing:1}}>{selected.name}</div><div style={{color:C.muted,fontSize:12}}>{selected.vehicle} · {selected.phone}</div><div style={{color:C.muted,fontSize:10,fontFamily:"monospace"}}>{selected.vin}</div></div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <button style={{...S.btnSecondary,fontSize:11,padding:"5px 9px"}} onClick={()=>{setShareTarget(selected);setModal("share");}}>🔗</button>
              <button style={{...S.btnSecondary,fontSize:11,padding:"5px 9px"}} onClick={()=>setModal("alert")}>📱</button>
              <button style={{...S.btnSecondary,fontSize:11,padding:"5px 9px",borderColor:C.purple+"40",color:C.purple}} onClick={()=>{setQuoteTarget(selected);setModal("quote");}}>📋 Quote</button>
              <button style={{...S.btnSecondary,fontSize:11,padding:"5px 9px",borderColor:C.green+"40",color:C.green}} onClick={()=>setCompletedTarget(selected)}>✓ Done</button>
              <button style={{...S.btnPrimary,fontSize:11,padding:"5px 9px"}} onClick={()=>setModal("service")}>+ Service</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <div style={S.card}><div style={S.cardTitle}>Vehicle Info</div>{[["Mileage",selected.mileage.toLocaleString()+" mi"],["Last Visit",selected.lastVisit]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:C.muted,fontSize:11}}>{l}</span><span style={{fontSize:12}}>{v}</span></div>)}</div>
            <div style={S.card}><div style={S.cardTitle}>Alerts</div>{selected.alerts.length===0&&<div style={{color:C.muted,fontSize:11}}>No alerts</div>}{selected.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:11}}>{a.text}</span></div>)}</div>
          </div>
          {(selected.pendingServices?.length||0)>0&&<><div style={S.sectionTitle}>⏳ Awaiting Customer Approval</div>{selected.pendingServices.map(svc=><div key={svc.id} style={{background:C.surface,border:`1px solid ${C.orange}33`,borderRadius:7,padding:"8px 11px",marginBottom:5,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,fontSize:12}}>{svc.type}</div><div style={{color:C.muted,fontSize:11}}>{svc.date}</div></div><span style={{background:C.orangeDim,color:C.orange,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 7px"}}>PENDING</span></div>)}</>}
          <div style={S.sectionTitle}>Service History</div>
          {selected.services.length===0&&<div style={{color:C.muted,fontSize:12}}>No services yet.</div>}
          {selected.services.map((s,i)=><div key={i} style={{...S.row,cursor:"default"}}>
            <div style={{width:24,height:24,borderRadius:5,background:C.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🔧</div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12}}>{s.type}</div><div style={{color:C.muted,fontSize:11}}>{s.date} · {Number(s.mileage).toLocaleString()} mi{s.notes?" · "+s.notes:""}</div></div>
            <span style={{background:C.greenDim,color:C.green,borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 5px"}}>✓</span>
          </div>)}
        </div>}
      </div>
    </div>

    {modal==="vin"&&<VINModal onClose={()=>setModal(null)} onAdd={addVehicle}/>}
    {modal==="quote"&&quoteTarget&&<QuoteBuilder mechanic={currentUser} vehicle={quoteTarget} onClose={()=>{setModal(null);setQuoteTarget(null);}} onSend={sendQuote}/>}
    {completedTarget&&<LogCompletedService mechanic={currentUser} vehicle={completedTarget} onClose={()=>setCompletedTarget(null)} onSend={sendCompletedService}/>}
    {showProfile&&<ProfilePage user={currentUser} users={users} setUsers={setUsers} onClose={()=>setShowProfile(false)}/>}

    {modal==="share"&&shareTarget&&<div style={S.overlay}><div style={{...S.modal,maxWidth:340}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Share Profile</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
      <div style={{background:C.faint,borderRadius:7,padding:"8px 10px",marginBottom:10}}><div style={{fontWeight:600,fontSize:13}}>{shareTarget.vehicle}</div><div style={{color:C.muted,fontSize:11,marginTop:1}}>{shareTarget.name} · {shareTarget.phone}</div></div>
      <div style={{color:C.muted,fontSize:12,marginBottom:10}}>Sends the customer a secure link to view their full service history.</div>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setModal(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={()=>setModal(null)}>📱 Send to Customer</button></div>
    </div></div>}

    {modal==="service"&&selected&&<div style={S.overlay}><div style={{...S.modal,maxWidth:370}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Log Service</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
      <div style={{color:C.muted,fontSize:11,marginBottom:10}}>{selected.vehicle} · {selected.name}</div>
      <label style={S.label}>Service Type</label><select style={S.input} value={newSvc.type} onChange={e=>setNewSvc(p=>({...p,type:e.target.value}))}>{SERVICE_TYPES.map(t=><option key={t}>{t}</option>)}</select>
      <label style={S.label}>Date</label><input style={S.input} type="date" value={newSvc.date} onChange={e=>setNewSvc(p=>({...p,date:e.target.value}))}/>
      <label style={S.label}>Mileage</label><input style={S.input} type="number" value={newSvc.mileage} onChange={e=>setNewSvc(p=>({...p,mileage:e.target.value}))}/>
      <label style={S.label}>Notes</label><textarea style={{...S.input,height:46,resize:"none"}} value={newSvc.notes} onChange={e=>setNewSvc(p=>({...p,notes:e.target.value}))}/>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setModal(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={logService}>Save</button></div>
    </div></div>}

    {modal==="alert"&&selected&&<div style={S.overlay}><div style={{...S.modal,maxWidth:350}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Send Alert</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
      <div style={{color:C.muted,fontSize:11,marginBottom:10}}>📱 {selected.phone} · {selected.vehicle}</div>
      {selected.alerts.map((a,i)=>{const sent=alertSent.includes(selected.id+i);return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:LEVEL_COLOR[a.level]+"10",border:`1px solid ${LEVEL_COLOR[a.level]}28`,borderRadius:7,padding:"8px 10px",marginBottom:5,gap:7}}>
        <div><Pill level={a.level}/><div style={{fontSize:12,marginTop:2}}>{a.text}</div>{sent&&<div style={{color:C.blue,fontSize:10,marginTop:2}}>✓ Sent</div>}</div>
        <button style={sent?{...S.btnSecondary,opacity:0.5}:S.btnPrimary} disabled={sent} onClick={()=>setAlertSent(p=>[...p,selected.id+i])}>{sent?"Sent":"Send"}</button>
      </div>;})}
      <button style={{...S.btnSecondary,marginTop:5}} onClick={()=>setModal(null)}>Close</button>
    </div></div>}
  </div>);
}

const S={
  label:{display:"block",color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:1,marginBottom:5},
  input:{width:"100%",background:"#0A0A0C",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,marginBottom:12,outline:"none",fontFamily:"inherit"},
  btnPrimary:{background:C.accent,color:"#000",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0},
  btnSecondary:{background:C.faint,color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:13,flexShrink:0},
  sectionTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,letterSpacing:2,color:C.accent,marginBottom:8,marginTop:4},
  row:{display:"flex",alignItems:"center",gap:10,background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 11px",marginBottom:6},
  card:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 12px"},
  cardTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:1.5,color:C.accent,marginBottom:8},
  overlay:{position:"fixed",inset:0,background:"#00000099",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20},
  modal:{background:"#141417",border:`1px solid ${C.border}`,borderRadius:14,padding:22,width:"100%",maxHeight:"90vh",overflow:"auto",animation:"fadeUp 0.2s ease"},
  modalHead:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14},
  modalTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:1,color:C.accent},
  iconBtn:{background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer"},
};

              
