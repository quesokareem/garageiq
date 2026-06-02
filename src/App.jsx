
import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0C0C0E", surface: "#141417", border: "#222228",
  accent: "#C8F135", accentDim: "#C8F13520",
  red: "#FF4D4D", redDim: "#FF4D4D18",
  orange: "#FF9A3C", orangeDim: "#FF9A3C18",
  blue: "#4FC3F7", blueDim: "#4FC3F718",
  green: "#4ADE80", greenDim: "#4ADE8018",
  purple: "#C084FC", purpleDim: "#C084FC18",
  text: "#F0F0F0", muted: "#666670", faint: "#1E1E24",
};
const LEVEL_COLOR = { critical: C.red, warning: C.orange, info: C.blue };

// ─── DEMO DATA ─────────────────────────────────────────────
const INIT_USERS = [
  { id:"m1", role:"mechanic", name:"Jake Torres",    email:"jake@garageiq.com",   password:"mechanic123", shop:"Torres Auto",     specialty:"Engine & Transmission", distance:"0.8 mi", rating:4.9, reviews:47, available:true,  bio:"ASE certified mechanic with 12 years experience. Specializing in Honda, Toyota and domestic vehicles.", photo:"🧑‍🔧", logo:"🔧", signature:"Jake Torres" },
  { id:"m2", role:"admin",    name:"Sandra Lee",     email:"admin@garageiq.com",  password:"admin123",    shop:"Lee's Auto Care", specialty:"Full Service",          distance:"1.4 mi", rating:4.7, reviews:83, available:true,  bio:"Family owned shop since 2005. We treat every car like our own.", photo:"👩‍🔧", logo:"⭐", signature:"Sandra Lee" },
  { id:"m3", role:"mechanic", name:"Carlos Mendez",  email:"carlos@garageiq.com", password:"mechanic123", shop:"Mendez Motors",   specialty:"Electrical & AC",       distance:"2.1 mi", rating:4.6, reviews:31, available:false, bio:"Electrical and AC specialist. 8 years in the field.", photo:"👨‍🔧", logo:"⚡", signature:"Carlos Mendez" },
  { id:"c1", role:"customer", name:"Marcus Johnson", email:"marcus@email.com",    password:"customer123", vehicleIds:[1], bio:"Car enthusiast. I like keeping my Civic in top shape.", photo:"😎" },
  { id:"c2", role:"customer", name:"Tanya Rivera",   email:"tanya@email.com",     password:"customer123", vehicleIds:[2], bio:"Just need my car to get me to work reliably!", photo:"👩" },
  { id:"c3", role:"customer", name:"Derek Williams", email:"derek@email.com",     password:"customer123", vehicleIds:[3], bio:"Weekend driver. My Jetta has seen better days.", photo:"🧑" },
];

const INIT_VEHICLES = [
  { id:1, customerId:"c1", name:"Marcus Johnson", phone:"555-214-8801", vin:"1HGBH41JXMN109186", vehicle:"2021 Honda Civic",      mileage:42000, lastVisit:"2024-11-10",
    services:[{type:"Oil Change",date:"2024-11-10",mileage:42000,notes:""},{type:"Tire Rotation",date:"2024-09-05",mileage:39500,notes:""}],
    alerts:[{text:"Brake inspection due",level:"warning"},{text:"Air filter replacement recommended",level:"info"}] },
  { id:2, customerId:"c2", name:"Tanya Rivera",   phone:"555-987-3320", vin:"2T1BURHE0JC041234", vehicle:"2018 Toyota Corolla",   mileage:67800, lastVisit:"2024-10-22",
    services:[{type:"Oil Change",date:"2024-10-22",mileage:67800,notes:""},{type:"Brake Pad Replacement",date:"2024-06-15",mileage:63000,notes:""}],
    alerts:[{text:"Oil change due in 1,200 miles",level:"warning"}] },
  { id:3, customerId:"c3", name:"Derek Williams", phone:"555-441-0092", vin:"3VWF17AT4FM123456", vehicle:"2015 Volkswagen Jetta", mileage:91200, lastVisit:"2024-08-30",
    services:[{type:"Transmission Service",date:"2024-08-30",mileage:91200,notes:""}],
    alerts:[{text:"Brake pads critical — replace immediately",level:"critical"},{text:"Coolant flush overdue",level:"warning"}] },
];

const INIT_MESSAGES = [
  {id:1,from:"m1",to:"c1",text:"Hi Marcus! Your Civic is ready for pickup.",time:"10:30 AM",date:"Today"},
  {id:2,from:"c1",to:"m1",text:"Thanks Jake! I'll swing by around 3pm.",time:"10:45 AM",date:"Today"},
];

const INIT_QUOTES = [
  { id:1, mechanicId:"m1", customerId:"c1", vehicleId:1, status:"pending",
    date:"2024-11-12", vehicle:"2021 Honda Civic",
    mechanicName:"Jake Torres", mechanicShop:"Torres Auto", mechanicSig:"Jake Torres",
    items:[
      {description:"Brake Pads (Front)",parts:89,labor:120},
      {description:"Brake Rotors (Front)",parts:145,labor:60},
    ],
    notes:"Recommended replacing front brakes asap. Parts are OEM quality.",
    counterOffer:null },
];

const INIT_POSTS = [
  { id:1, authorId:"c1", authorName:"Marcus Johnson", authorRole:"customer", time:"2h ago",
    text:"Need my alternator replaced this weekend. Anyone local who can come to my house? 2021 Honda Civic.",
    image:null, tag:"Alternator",
    replies:[{id:1,authorId:"m1",authorName:"Jake Torres",authorRole:"mechanic",text:"Hey Marcus! I can come by Saturday morning. DM me your address.",time:"1h ago"}]},
  { id:2, authorId:"m2", authorName:"Sandra Lee", authorRole:"mechanic", time:"5h ago",
    text:"Offering mobile oil changes this weekend in the Miami area — $45 full synthetic. Only 3 slots left!",
    image:null, tag:"Oil Change", replies:[]},
];

const INIT_REVIEWS = [
  {id:1,mechanicId:"m1",authorName:"Tanya Rivera",rating:5,text:"Jake fixed my alternator in 2 hours. Super professional, fair price.",time:"2 weeks ago",verified:true},
  {id:2,mechanicId:"m2",authorName:"Marcus Johnson",rating:5,text:"Sandra's shop is spotless and she explains everything clearly.",time:"3 weeks ago",verified:true},
];

const SERVICE_TYPES = ["Oil Change","Tire Rotation","Brake Pad Replacement","Air Filter","Transmission Service","Coolant Flush","Battery Replacement","Wheel Alignment","Spark Plugs","Full Inspection"];
const JOB_TAGS = ["Oil Change","Brakes","Alternator","AC","Transmission","Electrical","Tires","Engine","Battery","Other"];

// ─── HELPERS ───────────────────────────────────────────────
function Av({ name, size=36, color=C.accent, emoji=null }) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:color+"22",color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:emoji?size*0.55:size*0.46,flexShrink:0}}>{emoji||name?.[0]?.toUpperCase()}</div>;
}
function Stars({ rating, size=14 }) {
  return <span style={{fontSize:size,color:C.accent,letterSpacing:1}}>{"★".repeat(Math.round(rating))}{"☆".repeat(5-Math.round(rating))}</span>;
}
function Pill({ level, text }) {
  const col = LEVEL_COLOR[level]||C.blue;
  return <span style={{background:col+"18",color:col,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 9px",letterSpacing:0.5}}>{(text||level)?.toUpperCase()}</span>;
}
function Badge({ count }) {
  if(!count) return null;
  return <span style={{background:C.red,color:"#000",borderRadius:99,fontSize:10,fontWeight:800,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{count}</span>;
}

// ─── SIGNATURE PAD ─────────────────────────────────────────
function SignaturePad({ value, onChange }) {
  const canvasRef = useRef();
  const drawing = useRef(false);
  const draw = (e) => {
    if(!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX||e.clientX) - rect.left;
    const y = (e.touches?.[0]?.clientY||e.clientY) - rect.top;
    ctx.lineTo(x,y); ctx.stroke();
  };
  const start = (e) => {
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo((e.touches?.[0]?.clientX||e.clientX)-rect.left,(e.touches?.[0]?.clientY||e.clientY)-rect.top);
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.lineCap = "round";
  };
  const stop = () => { drawing.current = false; onChange(canvasRef.current.toDataURL()); };
  const clear = () => { const ctx = canvasRef.current.getContext("2d"); ctx.clearRect(0,0,300,80); onChange(""); };
  return (
    <div>
      <canvas ref={canvasRef} width={300} height={80}
        style={{background:"#080808",border:`1px solid ${C.border}`,borderRadius:8,cursor:"crosshair",touchAction:"none",display:"block"}}
        onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}/>
      <button onClick={clear} style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",marginTop:4}}>Clear signature</button>
    </div>
  );
}

// ─── VIN SCANNER WITH REAL LOOKUP ──────────────────────────
function VINModal({ onClose, onAdd }) {
  const [vin,setVin]=useState(""); const [name,setName]=useState(""); const [phone,setPhone]=useState("");
  const [vehicleInfo,setVehicleInfo]=useState(null); const [scanning,setScanning]=useState(false);
  const [loading,setLoading]=useState(false); const [step,setStep]=useState(1); const [error,setError]=useState("");
  const videoRef=useRef(); const streamRef=useRef();

  const lookupVIN = async(v) => {
    if(v.length<11){setError("VIN must be at least 11 characters.");return;}
    setLoading(true); setError("");
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`);
      const data = await res.json();
      const get = (var_) => data.Results?.find(r=>r.Variable===var_)?.Value||"";
      const make=get("Make"); const model=get("Model"); const year=get("Model Year");
      if(!make||make==="null"){setError("VIN not found. Please check and try again.");setLoading(false);return;}
      setVehicleInfo({vin:v.toUpperCase(),make,model,year,engine:get("Engine Configuration"),trim:get("Trim"),vehicle:`${year} ${make} ${model}`});
      setStep(2);
    } catch(e){setError("Lookup failed. Check connection and try again.");}
    setLoading(false);
  };

  const startCamera = async() => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
      streamRef.current = stream;
      if(videoRef.current) videoRef.current.srcObject = stream;
    } catch(e){setError("Camera access denied."); setScanning(false);}
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t=>t.stop());
    setScanning(false);
  };

  useEffect(()=>()=>streamRef.current?.getTracks().forEach(t=>t.stop()),[]);

  const save=()=>{ if(!name||!phone||!vehicleInfo)return; onAdd({name,phone,...vehicleInfo}); onClose(); };

  return (
    <div style={S.overlay}>
      <div style={{...S.modal,maxWidth:440}}>
        <div style={S.modalHead}><span style={S.modalTitle}>New Client — VIN Scan</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
        {step===1&&<>
          {!scanning ? (
            <div style={{position:"relative",height:130,background:"#080808",borderRadius:10,marginBottom:14,overflow:"hidden",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
              {["tl","tr","bl","br"].map(p=><Corner key={p} pos={p}/>)}
              <div style={{color:C.muted,fontSize:11,fontWeight:700,letterSpacing:2}}>CAMERA INACTIVE</div>
              <button style={{...S.btnPrimary,fontSize:12,padding:"6px 14px"}} onClick={startCamera}>📷 Start Camera</button>
            </div>
          ) : (
            <div style={{position:"relative",height:160,background:"#000",borderRadius:10,marginBottom:14,overflow:"hidden",border:`1px solid ${C.accent}`}}>
              <video ref={videoRef} autoPlay playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              {["tl","tr","bl","br"].map(p=><Corner key={p} pos={p}/>)}
              <div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:8}}>
                <button style={{...S.btnSecondary,fontSize:11,padding:"5px 12px"}} onClick={stopCamera}>Stop Camera</button>
                <button style={{...S.btnPrimary,fontSize:11,padding:"5px 12px"}} onClick={()=>{stopCamera();setVin("1HGBH41JXMN109186");}}>Simulate Scan</button>
              </div>
            </div>
          )}
          <label style={S.label}>VIN Number</label>
          <input style={S.input} placeholder="Enter 17-char VIN" value={vin} onChange={e=>setVin(e.target.value.toUpperCase())} maxLength={17}/>
          {error&&<div style={{color:C.red,fontSize:12,marginBottom:10}}>{error}</div>}
          <button style={{...S.btnPrimary,width:"100%"}} onClick={()=>lookupVIN(vin)} disabled={loading}>
            {loading?"Looking up VIN...":"🔍 Look Up VIN"}
          </button>
        </>}
        {step===2&&vehicleInfo&&<>
          <div style={{background:C.accentDim,border:`1px solid ${C.accent}30`,borderRadius:8,padding:"12px 14px",marginBottom:16}}>
            <div style={{color:C.accent,fontSize:11,fontWeight:700,marginBottom:6}}>✓ VEHICLE IDENTIFIED</div>
            {[["Vehicle",vehicleInfo.vehicle],["VIN",vehicleInfo.vin],["Engine",vehicleInfo.engine],["Trim",vehicleInfo.trim]].filter(([,v])=>v&&v!=="null"&&v!=="Not Applicable").map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{color:C.muted,fontSize:11}}>{l}</span>
                <span style={{color:C.text,fontSize:12,fontFamily:l==="VIN"?"monospace":"inherit"}}>{v}</span>
              </div>
            ))}
          </div>
          <label style={S.label}>Customer Name</label>
          <input style={S.input} placeholder="Full name" value={name} onChange={e=>setName(e.target.value)}/>
          <label style={S.label}>Phone Number</label>
          <input style={S.input} placeholder="555-000-0000" value={phone} onChange={e=>setPhone(e.target.value)}/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button style={S.btnSecondary} onClick={()=>{setStep(1);setVehicleInfo(null);}}>← Back</button>
            <button style={{...S.btnPrimary,flex:1}} onClick={save} disabled={!name||!phone}>Create Client</button>
          </div>
        </>}
      </div>
    </div>
  );
}
function Corner({pos}){const m={tl:{top:10,left:10},tr:{top:10,right:10},bl:{bottom:10,left:10},br:{bottom:10,right:10}};const b={tl:{borderTop:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`},tr:{borderTop:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`},bl:{borderBottom:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`},br:{borderBottom:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`}};return <div style={{position:"absolute",width:18,height:18,...m[pos],...b[pos]}}/>;}

// ─── QUOTE BUILDER ─────────────────────────────────────────
function QuoteBuilder({ mechanic, vehicle, onClose, onSend }) {
  const [items,setItems]=useState([{id:1,description:"",parts:0,labor:0}]);
  const [notes,setNotes]=useState("");
  const [sig,setSig]=useState(mechanic.signature||"");
  const [sigMode,setSigMode]=useState("text");

  const addItem=()=>setItems(p=>[...p,{id:Date.now(),description:"",parts:0,labor:0}]);
  const updateItem=(id,field,val)=>setItems(p=>p.map(i=>i.id===id?{...i,[field]:val}:i));
  const removeItem=(id)=>setItems(p=>p.filter(i=>i.id!==id));

  const totalParts=items.reduce((a,i)=>a+Number(i.parts),0);
  const totalLabor=items.reduce((a,i)=>a+Number(i.labor),0);
  const total=totalParts+totalLabor;

  const send=()=>{
    onSend({items,notes,signature:sig,totalParts,totalLabor,total,vehicle:vehicle.vehicle,vehicleId:vehicle.id,customerId:vehicle.customerId,mechanicName:mechanic.name,mechanicShop:mechanic.shop,mechanicSig:sig,date:new Date().toLocaleDateString(),status:"pending"});
    onClose();
  };

  return (
    <div style={S.overlay}>
      <div style={{...S.modal,maxWidth:520}}>
        <div style={S.modalHead}>
          <span style={S.modalTitle}>Build Quote</span>
          <button onClick={onClose} style={S.iconBtn}>✕</button>
        </div>
        <div style={{background:C.faint,borderRadius:8,padding:"10px 12px",marginBottom:16,display:"flex",justifyContent:"space-between"}}>
          <div><div style={{fontWeight:600,fontSize:14}}>{vehicle.vehicle}</div><div style={{color:C.muted,fontSize:12}}>{vehicle.name} · {vehicle.phone}</div></div>
          <div style={{textAlign:"right"}}><div style={{color:C.muted,fontSize:11}}>{mechanic.shop}</div><div style={{color:C.muted,fontSize:11}}>{new Date().toLocaleDateString()}</div></div>
        </div>

        {/* Line items */}
        <div style={{marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 28px",gap:6,marginBottom:6}}>
            {["Description","Parts ($)","Labor ($)",""].map(h=><div key={h} style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}
          </div>
          {items.map(item=>(
            <div key={item.id} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 28px",gap:6,marginBottom:6}}>
              <input style={{...S.input,margin:0,fontSize:12}} placeholder="e.g. Brake Pads (Front)" value={item.description} onChange={e=>updateItem(item.id,"description",e.target.value)}/>
              <input style={{...S.input,margin:0,fontSize:12}} type="number" placeholder="0" value={item.parts||""} onChange={e=>updateItem(item.id,"parts",e.target.value)}/>
              <input style={{...S.input,margin:0,fontSize:12}} type="number" placeholder="0" value={item.labor||""} onChange={e=>updateItem(item.id,"labor",e.target.value)}/>
              <button onClick={()=>removeItem(item.id)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.red,cursor:"pointer",fontSize:14}}>×</button>
            </div>
          ))}
          <button style={{...S.btnSecondary,fontSize:12,padding:"6px 12px"}} onClick={addItem}>+ Add Line Item</button>
        </div>

        {/* Totals */}
        <div style={{background:C.faint,borderRadius:8,padding:"12px 14px",marginBottom:14}}>
          {[["Parts Total",`$${totalParts.toFixed(2)}`],["Labor Total",`$${totalLabor.toFixed(2)}`]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{color:C.muted,fontSize:13}}>{l}</span><span style={{fontSize:13}}>{v}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",borderTop:`1px solid ${C.border}`,paddingTop:8,marginTop:4}}>
            <span style={{fontWeight:700,fontSize:15}}>Total Estimate</span>
            <span style={{fontWeight:700,fontSize:15,color:C.accent}}>${total.toFixed(2)}</span>
          </div>
        </div>

        <label style={S.label}>Notes</label>
        <textarea style={{...S.input,height:60,resize:"none"}} placeholder="Additional notes for the customer…" value={notes} onChange={e=>setNotes(e.target.value)}/>

        {/* Signature */}
        <label style={S.label}>Mechanic Signature</label>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {["text","draw"].map(m=>(
            <button key={m} onClick={()=>setSigMode(m)} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${sigMode===m?C.accent:C.border}`,background:sigMode===m?C.accentDim:"transparent",color:sigMode===m?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>
              {m==="text"?"Text Signature":"Draw Signature"}
            </button>
          ))}
        </div>
        {sigMode==="text"
          ? <input style={{...S.input,fontFamily:"cursive",fontSize:18,color:C.accent}} placeholder="Your signature" value={sig} onChange={e=>setSig(e.target.value)}/>
          : <SignaturePad value={sig} onChange={setSig}/>
        }

        <div style={{display:"flex",gap:8,marginTop:16}}>
          <button style={S.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={{...S.btnPrimary,flex:1}} onClick={send} disabled={items.every(i=>!i.description)}>Send Quote to Customer</button>
        </div>
      </div>
    </div>
  );
}

// ─── QUOTE CARD ────────────────────────────────────────────
function QuoteCard({ quote, isCustomer, onRespond }) {
  const [showCounter,setShowCounter]=useState(false);
  const [counterNote,setCounterNote]=useState("");
  const statusColors={pending:C.orange,accepted:C.green,declined:C.red,countered:C.blue};
  const statusCol=statusColors[quote.status]||C.muted;
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:14}}>
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontWeight:700,fontSize:14}}>{quote.vehicle}</div>
          <div style={{color:C.muted,fontSize:12}}>{isCustomer?`From ${quote.mechanicShop}`:`For ${quote.name||"Customer"}`} · {quote.date}</div>
        </div>
        <span style={{background:statusCol+"18",color:statusCol,borderRadius:99,fontSize:11,fontWeight:700,padding:"3px 10px"}}>{quote.status?.toUpperCase()}</span>
      </div>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:6,marginBottom:8}}>
          {["Service","Parts","Labor"].map(h=><div key={h} style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}
        </div>
        {quote.items?.map((item,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",gap:6,marginBottom:5}}>
            <span style={{fontSize:13}}>{item.description}</span>
            <span style={{fontSize:13,color:C.text}}>${Number(item.parts).toFixed(2)}</span>
            <span style={{fontSize:13,color:C.text}}>${Number(item.labor).toFixed(2)}</span>
          </div>
        ))}
        <div style={{borderTop:`1px solid ${C.border}`,marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between"}}>
          <span style={{color:C.muted,fontSize:13}}>Parts: ${quote.totalParts?.toFixed(2)} · Labor: ${quote.totalLabor?.toFixed(2)}</span>
          <span style={{fontWeight:700,fontSize:15,color:C.accent}}>Total: ${quote.total?.toFixed(2)}</span>
        </div>
        {quote.notes&&<div style={{color:C.muted,fontSize:12,marginTop:8,fontStyle:"italic"}}>Note: {quote.notes}</div>}
        {quote.mechanicSig&&(
          <div style={{marginTop:10,borderTop:`1px solid ${C.border}`,paddingTop:10}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:4}}>SIGNED BY</div>
            <div style={{fontFamily:"cursive",fontSize:18,color:C.accent}}>{quote.mechanicSig}</div>
          </div>
        )}
        {quote.counterOffer&&<div style={{background:C.blueDim,border:`1px solid ${C.blue}30`,borderRadius:6,padding:"8px 10px",marginTop:8}}><div style={{color:C.blue,fontSize:11,fontWeight:700,marginBottom:2}}>COUNTER OFFER</div><div style={{fontSize:13}}>{quote.counterOffer}</div></div>}
      </div>
      {isCustomer&&quote.status==="pending"&&(
        <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8,flexWrap:"wrap"}}>
          <button style={{...S.btnSecondary,borderColor:C.green+"40",color:C.green}} onClick={()=>onRespond(quote.id,"accepted","")}>✓ Accept</button>
          <button style={{...S.btnSecondary,borderColor:C.red+"40",color:C.red}} onClick={()=>onRespond(quote.id,"declined","")}>✕ Decline</button>
          <button style={{...S.btnSecondary,borderColor:C.blue+"40",color:C.blue}} onClick={()=>setShowCounter(!showCounter)}>↔ Counter</button>
        </div>
      )}
      {showCounter&&(
        <div style={{padding:"0 16px 14px"}}>
          <textarea style={{...S.input,height:60,resize:"none",fontSize:12}} placeholder="Suggest a different price or terms…" value={counterNote} onChange={e=>setCounterNote(e.target.value)}/>
          <button style={{...S.btnPrimary,fontSize:12}} onClick={()=>{onRespond(quote.id,"countered",counterNote);setShowCounter(false);}}>Send Counter Offer</button>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE PAGE ──────────────────────────────────────────
function ProfilePage({ user, users, setUsers, onClose }) {
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({bio:user.bio||"",photo:user.photo||"",logo:user.logo||"",signature:user.signature||""});
  const [sigMode,setSigMode]=useState("text");
  const isMech=user.role==="mechanic"||user.role==="admin";

  const save=()=>{
    setUsers(prev=>prev.map(u=>u.id===user.id?{...u,...form}:u));
    setEditing(false);
  };

  const emojis=["😎","👩","🧑","👨","👩‍🔧","🧑‍🔧","👨‍🔧","🙂","😊","🤙"];
  const logoEmojis=["🔧","⭐","⚡","🚗","🏎","🔩","🛞","🛠","🔑","🏆"];

  return (
    <div style={S.overlay}>
      <div style={{...S.modal,maxWidth:480}}>
        <div style={S.modalHead}>
          <span style={S.modalTitle}>{editing?"Edit Profile":"My Profile"}</span>
          <button onClick={onClose} style={S.iconBtn}>✕</button>
        </div>

        {!editing ? (
          <>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:56}}>{user.photo||"😎"}</div>
              <div>
                <div style={{fontWeight:700,fontSize:18}}>{user.name}</div>
                <div style={{color:C.muted,fontSize:13,textTransform:"capitalize"}}>{user.role}</div>
                {isMech&&<div style={{color:C.muted,fontSize:12}}>{user.shop} · {user.specialty}</div>}
              </div>
            </div>
            {isMech&&user.logo&&<div style={{fontSize:36,marginBottom:8}}>{user.logo} <span style={{color:C.muted,fontSize:12}}>Shop Logo</span></div>}
            <div style={{color:C.text,fontSize:13,lineHeight:1.6,marginBottom:16}}>{user.bio||"No bio yet."}</div>
            {isMech&&user.signature&&(
              <div style={{background:C.faint,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
                <div style={{color:C.muted,fontSize:10,marginBottom:4}}>SIGNATURE</div>
                <div style={{fontFamily:"cursive",fontSize:22,color:C.accent}}>{user.signature}</div>
              </div>
            )}
            {isMech&&<div style={{display:"flex",gap:8,marginBottom:12}}><Stars rating={user.rating}/><span style={{fontSize:13}}>{user.rating} ({user.reviews} reviews)</span></div>}
            <button style={S.btnPrimary} onClick={()=>setEditing(true)}>Edit Profile</button>
          </>
        ) : (
          <>
            <label style={S.label}>Profile Photo</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              {emojis.map(e=><button key={e} onClick={()=>setForm(p=>({...p,photo:e}))} style={{fontSize:24,background:form.photo===e?C.accentDim:"none",border:`1px solid ${form.photo===e?C.accent:C.border}`,borderRadius:8,padding:"4px 8px",cursor:"pointer"}}>{e}</button>)}
            </div>
            {isMech&&<>
              <label style={S.label}>Shop Logo</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                {logoEmojis.map(e=><button key={e} onClick={()=>setForm(p=>({...p,logo:e}))} style={{fontSize:24,background:form.logo===e?C.accentDim:"none",border:`1px solid ${form.logo===e?C.accent:C.border}`,borderRadius:8,padding:"4px 8px",cursor:"pointer"}}>{e}</button>)}
              </div>
            </>}
            <label style={S.label}>Bio</label>
            <textarea style={{...S.input,height:70,resize:"none"}} placeholder="Tell customers about yourself…" value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))}/>
            {isMech&&<>
              <label style={S.label}>Signature (used on quotes)</label>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                {["text","draw"].map(m=>(
                  <button key={m} onClick={()=>setSigMode(m)} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${sigMode===m?C.accent:C.border}`,background:sigMode===m?C.accentDim:"transparent",color:sigMode===m?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>
                    {m==="text"?"Text":"Draw"}
                  </button>
                ))}
              </div>
              {sigMode==="text"
                ? <input style={{...S.input,fontFamily:"cursive",fontSize:18,color:C.accent}} placeholder="Type your signature" value={form.signature} onChange={e=>setForm(p=>({...p,signature:e.target.value}))}/>
                : <SignaturePad value={form.signature} onChange={v=>setForm(p=>({...p,signature:v}))}/>
              }
            </>}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button style={S.btnSecondary} onClick={()=>setEditing(false)}>Cancel</button>
              <button style={{...S.btnPrimary,flex:1}} onClick={save}>Save Profile</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MESSAGES ──────────────────────────────────────────────
function Messages({ user, vehicles, users, initContact=null }) {
  const contacts = user.role==="customer" ? users.filter(u=>u.role!=="customer") : users.filter(u=>u.role==="customer");
  const [active,setActive]=useState(initContact?users.find(u=>u.id===initContact):contacts[0]);
  const [msgs,setMsgs]=useState(INIT_MESSAGES);
  const [draft,setDraft]=useState("");
  const bottomRef=useRef();
  const thread=msgs.filter(m=>(m.from===user.id&&m.to===active?.id)||(m.from===active?.id&&m.to===user.id));
  const send=()=>{ if(!draft.trim()||!active)return; setMsgs(p=>[...p,{id:Date.now(),from:user.id,to:active.id,text:draft.trim(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:"Today"}]); setDraft(""); };
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[thread.length,active?.id]);
  const getV=(id)=>vehicles.find(v=>v.customerId===id);
  return (
    <div style={{display:"flex",height:"calc(100vh - 56px)"}}>
      <div style={{width:220,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"12px 14px 8px",borderBottom:`1px solid ${C.border}`}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,color:C.accent}}>MESSAGES</div></div>
        <div style={{flex:1,overflow:"auto"}}>
          {contacts.map(c=>{
            const v=getV(c.id); const unread=msgs.filter(m=>m.from===c.id&&m.to===user.id).length;
            return <div key={c.id} onClick={()=>setActive(c)} style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,background:active?.id===c.id?C.faint:"transparent"}}>
              <Av name={c.name} size={30} emoji={c.photo}/>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div><div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.shop||v?.vehicle||""}</div></div>
              {unread>0&&<Badge count={unread}/>}
            </div>;
          })}
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        {active?<>
          <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9}}>
            <Av name={active.name} size={28} emoji={active.photo}/>
            <div><div style={{fontWeight:600,fontSize:14}}>{active.name}</div><div style={{color:C.muted,fontSize:11}}>{active.shop||getV(active.id)?.vehicle||""}</div></div>
          </div>
          <div style={{flex:1,overflow:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}}>
            {thread.length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",marginTop:40}}>No messages yet. Say hello! 👋</div>}
            {thread.map(m=>{const mine=m.from===user.id; return <div key={m.id} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start"}}><div style={{maxWidth:"68%",background:mine?C.accent:C.surface,color:mine?"#000":C.text,borderRadius:mine?"14px 14px 3px 14px":"14px 14px 14px 3px",padding:"8px 12px",fontSize:13,border:mine?"none":`1px solid ${C.border}`}}><div>{m.text}</div><div style={{fontSize:10,marginTop:3,opacity:0.5,textAlign:"right"}}>{m.time}</div></div></div>;})}
            <div ref={bottomRef}/>
          </div>
          <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
            <input style={{...S.input,margin:0,flex:1}} placeholder="Type a message…" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
            <button style={S.btnPrimary} onClick={send}>Send</button>
          </div>
        </>:<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Select a conversation</div>}
      </div>
    </div>
  );
}

// ─── FIND A MECHANIC ───────────────────────────────────────
function FindMechanic({ user, users, onDM }) {
  const mechanics=users.filter(u=>u.role==="mechanic"||u.role==="admin");
  const [reviews,setReviews]=useState(INIT_REVIEWS);
  const [showReviews,setShowReviews]=useState(null);
  const [reviewMech,setReviewMech]=useState(null);
  const [newReview,setNewReview]=useState({rating:5,text:""});
  const [filter,setFilter]=useState("all");
  const [viewProfile,setViewProfile]=useState(null);
  const filtered=filter==="available"?mechanics.filter(m=>m.available):mechanics;
  const mechReviews=(id)=>reviews.filter(r=>r.mechanicId===id);
  const avgRating=(id)=>{const r=mechReviews(id);return r.length?(r.reduce((a,b)=>a+b.rating,0)/r.length).toFixed(1):null;};
  const submitReview=()=>{if(!newReview.text.trim())return;setReviews(p=>[...p,{id:Date.now(),mechanicId:reviewMech.id,authorName:user.name,rating:newReview.rating,text:newReview.text,time:"Just now",verified:true}]);setNewReview({rating:5,text:""});setReviewMech(null);};
  return (
    <div style={{padding:"24px 26px",maxWidth:760,animation:"fadeUp 0.25s ease"}}>
      <div style={{marginBottom:20}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>Find a Mechanic</div><div style={{color:C.muted,fontSize:13}}>Local mechanics near you</div></div>
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {["all","available"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 14px",borderRadius:99,border:`1px solid ${filter===f?C.accent:C.border}`,background:filter===f?C.accentDim:"transparent",color:filter===f?C.accent:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{f==="all"?"All":"Available Now"}</button>)}
      </div>
      {filtered.map(m=>{const r=mechReviews(m.id);const avg=avgRating(m.id); return(
        <div key={m.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <div style={{fontSize:44}}>{m.photo||"🧑‍🔧"}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontWeight:700,fontSize:15}}>{m.name}</span>
                {m.available?<span style={{background:C.greenDim,color:C.green,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>● AVAILABLE</span>:<span style={{background:C.faint,color:C.muted,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>BUSY</span>}
              </div>
              <div style={{color:C.muted,fontSize:12,marginTop:1}}>{m.logo&&<span style={{marginRight:4}}>{m.logo}</span>}{m.shop} · {m.specialty}</div>
              <div style={{color:C.muted,fontSize:12}}>📍 {m.distance} away</div>
              {avg&&<div style={{display:"flex",alignItems:"center",gap:5,marginTop:5}}><Stars rating={parseFloat(avg)} size={12}/><span style={{fontSize:12,fontWeight:600}}>{avg}</span><span style={{color:C.muted,fontSize:11}}>({r.length} reviews)</span></div>}
              {m.bio&&<div style={{color:C.muted,fontSize:12,marginTop:5,fontStyle:"italic"}}>"{m.bio}"</div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
              <button style={S.btnPrimary} onClick={()=>onDM(m.id)}>💬 DM</button>
              <button style={S.btnSecondary} onClick={()=>setShowReviews(showReviews===m.id?null:m.id)}>Reviews</button>
              {user.role==="customer"&&<button style={{...S.btnSecondary,borderColor:C.accent+"40",color:C.accent}} onClick={()=>setReviewMech(m)}>✏ Review</button>}
            </div>
          </div>
          {showReviews===m.id&&<div style={{marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:12}}>
            {r.length===0&&<div style={{color:C.muted,fontSize:13}}>No reviews yet.</div>}
            {r.map(rv=><div key={rv.id} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${C.faint}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><span style={{fontSize:13,fontWeight:600}}>{rv.authorName}</span>{rv.verified&&<span style={{background:C.greenDim,color:C.green,fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:99}}>✓ VERIFIED</span>}<span style={{marginLeft:"auto",color:C.muted,fontSize:11}}>{rv.time}</span></div>
              <Stars rating={rv.rating} size={11}/><div style={{color:C.text,fontSize:13,marginTop:3}}>{rv.text}</div>
            </div>)}
          </div>}
        </div>
      );})}
      {reviewMech&&<div style={S.overlay}><div style={{...S.modal,maxWidth:400}}>
        <div style={S.modalHead}><span style={S.modalTitle}>Review {reviewMech.name}</span><button onClick={()=>setReviewMech(null)} style={S.iconBtn}>✕</button></div>
        <div style={{display:"flex",gap:6,marginBottom:14}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setNewReview(p=>({...p,rating:n}))} style={{fontSize:24,background:"none",border:"none",cursor:"pointer",color:n<=newReview.rating?C.accent:"#333"}}>★</button>)}</div>
        <textarea style={{...S.input,height:80,resize:"none"}} placeholder="Share your experience…" value={newReview.text} onChange={e=>setNewReview(p=>({...p,text:e.target.value}))}/>
        <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setReviewMech(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={submitReview}>Submit</button></div>
      </div></div>}
    </div>
  );
}

// ─── COMMUNITY BOARD ───────────────────────────────────────
function Community({ user }) {
  const [posts,setPosts]=useState(INIT_POSTS);
  const [newPost,setNewPost]=useState({text:"",tag:JOB_TAGS[0],image:null});
  const [replyText,setReplyText]=useState({});
  const [showCompose,setShowCompose]=useState(false);
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?posts:posts.filter(p=>p.tag===filter);
  const submit=()=>{if(!newPost.text.trim())return;setPosts(p=>[{id:Date.now(),authorId:user.id,authorName:user.name,authorRole:user.role,time:"Just now",text:newPost.text,image:newPost.image,tag:newPost.tag,replies:[]},...p]);setNewPost({text:"",tag:JOB_TAGS[0],image:null});setShowCompose(false);};
  const reply=(postId)=>{const txt=replyText[postId];if(!txt?.trim())return;setPosts(prev=>prev.map(p=>p.id===postId?{...p,replies:[...p.replies,{id:Date.now(),authorId:user.id,authorName:user.name,authorRole:user.role,text:txt.trim(),time:"Just now"}]}:p));setReplyText(p=>({...p,[postId]:""}));};
  const roleColor=(role)=>role==="mechanic"||role==="admin"?C.orange:C.blue;
  return (
    <div style={{padding:"24px 26px",maxWidth:760,animation:"fadeUp 0.25s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>Community Board</div><div style={{color:C.muted,fontSize:13}}>Post a job request or offer your services</div></div>
        <button style={S.btnPrimary} onClick={()=>setShowCompose(true)}>+ Post</button>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:16}}>{["all",...JOB_TAGS].map(t=><button key={t} onClick={()=>setFilter(t)} style={{padding:"4px 11px",borderRadius:99,border:`1px solid ${filter===t?C.accent:C.border}`,background:filter===t?C.accentDim:"transparent",color:filter===t?C.accent:C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>{t==="all"?"All":t}</button>)}</div>
      {filtered.map(post=>(
        <div key={post.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
            <div style={{fontSize:28}}>{INIT_USERS.find(u=>u.id===post.authorId)?.photo||"😎"}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                <span style={{fontWeight:600,fontSize:14}}>{post.authorName}</span>
                <span style={{background:roleColor(post.authorRole)+"18",color:roleColor(post.authorRole),borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 7px"}}>{post.authorRole==="mechanic"||post.authorRole==="admin"?"MECHANIC":"CUSTOMER"}</span>
                <span style={{background:C.accentDim,color:C.accent,borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 7px"}}>{post.tag}</span>
                <span style={{color:C.muted,fontSize:11,marginLeft:"auto"}}>{post.time}</span>
              </div>
              <div style={{color:C.text,fontSize:13,marginTop:6,lineHeight:1.6}}>{post.text}</div>
            </div>
          </div>
          {post.replies.length>0&&<div style={{marginLeft:38,borderLeft:`2px solid ${C.border}`,paddingLeft:12,marginBottom:10}}>
            {post.replies.map(r=><div key={r.id} style={{marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>{INIT_USERS.find(u=>u.id===r.authorId)?.photo||"😎"}</span><span style={{fontWeight:600,fontSize:12}}>{r.authorName}</span><span style={{color:C.muted,fontSize:10,marginLeft:"auto"}}>{r.time}</span></div>
              <div style={{color:C.text,fontSize:12,marginTop:3,marginLeft:22}}>{r.text}</div>
            </div>)}
          </div>}
          <div style={{display:"flex",gap:8,marginLeft:38}}>
            <input style={{...S.input,margin:0,flex:1,fontSize:12,padding:"6px 10px"}} placeholder="Write a reply…" value={replyText[post.id]||""} onChange={e=>setReplyText(p=>({...p,[post.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&reply(post.id)}/>
            <button style={{...S.btnPrimary,padding:"6px 12px",fontSize:12}} onClick={()=>reply(post.id)}>Reply</button>
          </div>
        </div>
      ))}
      {showCompose&&<div style={S.overlay}><div style={{...S.modal,maxWidth:450}}>
        <div style={S.modalHead}><span style={S.modalTitle}>New Post</span><button onClick={()=>setShowCompose(false)} style={S.iconBtn}>✕</button></div>
        <label style={S.label}>Category</label>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>{JOB_TAGS.map(t=><button key={t} onClick={()=>setNewPost(p=>({...p,tag:t}))} style={{padding:"4px 11px",borderRadius:99,border:`1px solid ${newPost.tag===t?C.accent:C.border}`,background:newPost.tag===t?C.accentDim:"transparent",color:newPost.tag===t?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>{t}</button>)}</div>
        <textarea style={{...S.input,height:90,resize:"none"}} placeholder="Describe what you need or what you're offering…" value={newPost.text} onChange={e=>setNewPost(p=>({...p,text:e.target.value}))}/>
        <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setShowCompose(false)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={submit} disabled={!newPost.text.trim()}>Post</button></div>
      </div></div>}
    </div>
  );
}

// ─── CUSTOMER PORTAL ───────────────────────────────────────
function CustomerPortal({ user, users, setUsers, vehicles, quotes, setQuotes, onLogout }) {
  const myVehicles=vehicles.filter(v=>user.vehicleIds?.includes(v.id));
  const myQuotes=quotes.filter(q=>q.customerId===user.id);
  const [tab,setTab]=useState("garage");
  const [dmContact,setDmContact]=useState(null);
  const [showProfile,setShowProfile]=useState(false);
  const handleDM=(id)=>{setDmContact(id);setTab("messages");};
  const respondToQuote=(qid,status,counter)=>setQuotes(p=>p.map(q=>q.id===qid?{...q,status,counterOffer:counter||null}:q));
  const tabs=[{id:"garage",label:"My Garage"},{id:"quotes",label:"Quotes",badge:myQuotes.filter(q=>q.status==="pending").length},{id:"find",label:"Find Mechanic"},{id:"board",label:"Community"},{id:"messages",label:"Messages"}];
  const currentUser=users.find(u=>u.id===user.id)||user;
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 18px",display:"flex",alignItems:"center",height:56,gap:0}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,marginRight:20}}><span style={{color:C.accent}}>G</span><span>ARAGEIQ</span></div>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>{setDmContact(null);setTab(t.id);}} style={{padding:"0 12px",height:"100%",border:"none",background:"transparent",color:tab===t.id?C.accent:C.muted,fontSize:12,fontWeight:600,cursor:"pointer",borderBottom:`2px solid ${tab===t.id?C.accent:"transparent"}`,display:"flex",alignItems:"center",gap:5}}>
            {t.label}{t.badge>0&&<Badge count={t.badge}/>}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setShowProfile(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:28}}>{currentUser.photo||"😎"}</button>
          <button onClick={onLogout} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12}}>Sign out</button>
        </div>
      </div>
      {tab==="garage"&&<div style={{padding:"24px 22px",maxWidth:680,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{marginBottom:20}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:1}}>My Garage</div><div style={{color:C.muted,fontSize:13}}>Hey {user.name.split(" ")[0]}!</div></div>
        {myVehicles.map(v=>(
          <div key={v.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:18}}>
            <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:16}}>{v.vehicle}</div><div style={{color:C.muted,fontSize:11,fontFamily:"monospace",marginTop:2}}>VIN: {v.vin}</div><div style={{color:C.muted,fontSize:12,marginTop:1}}>{v.mileage.toLocaleString()} miles · Last visit {v.lastVisit}</div></div>
            {v.alerts.length>0&&<div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>{v.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:13}}>{a.text}</span><Pill level={a.level}/></div>)}</div>}
            <div style={{padding:"12px 16px"}}><div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Service History</div>{v.services.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<v.services.length-1?`1px solid ${C.border}`:"none"}}><span style={{fontSize:13}}>{s.type}</span><span style={{color:C.muted,fontSize:12}}>{s.date}</span></div>)}</div>
          </div>
        ))}
      </div>}
      {tab==="quotes"&&<div style={{padding:"24px 22px",maxWidth:680,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{marginBottom:20}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>My Quotes</div><div style={{color:C.muted,fontSize:13}}>{myQuotes.length} quotes received</div></div>
        {myQuotes.length===0&&<div style={{color:C.muted,fontSize:13}}>No quotes yet. Find a mechanic and request a quote!</div>}
        {myQuotes.map(q=><QuoteCard key={q.id} quote={q} isCustomer={true} onRespond={respondToQuote}/>)}
      </div>}
      {tab==="find"&&<FindMechanic user={currentUser} users={users} onDM={handleDM}/>}
      {tab==="board"&&<Community user={currentUser}/>}
      {tab==="messages"&&<Messages user={user} vehicles={vehicles} users={users} initContact={dmContact}/>}
      {showProfile&&<ProfilePage user={currentUser} users={users} setUsers={setUsers} onClose={()=>setShowProfile(false)}/>}
    </div>
  );
}

// ─── MAIN MECHANIC APP ─────────────────────────────────────
export default function GarageIQ() {
  const [users,setUsers]=useState(INIT_USERS);
  const [user,setUser]=useState(null);
  const [vehicles,setVehicles]=useState(INIT_VEHICLES);
  const [quotes,setQuotes]=useState(INIT_QUOTES);
  const [nav,setNav]=useState("dashboard");
  const [selected,setSelected]=useState(null);
  const [modal,setModal]=useState(null);
  const [shareTarget,setShareTarget]=useState(null);
  const [newSvc,setNewSvc]=useState({type:SERVICE_TYPES[0],date:new Date().toISOString().split("T")[0],mileage:"",notes:""});
  const [alertSent,setAlertSent]=useState([]);
  const [search,setSearch]=useState("");
  const [showProfile,setShowProfile]=useState(false);
  const [quoteTarget,setQuoteTarget]=useState(null);

  if(!user){
    const Login2=()=>{
      const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState(""); const [tab,setTab]=useState("mechanic");
      const handle=()=>{const u=users.find(u=>u.email===email&&u.password===pass);if(!u){setErr("Invalid credentials.");return;}const map={mechanic:["mechanic","admin"],customer:["customer"]};if(!map[tab].includes(u.role)){setErr(`Not a ${tab} account.`);return;}setUser(u);};
      const hints={mechanic:[{label:"Mechanic",e:"jake@garageiq.com",p:"mechanic123"},{label:"Admin",e:"admin@garageiq.com",p:"admin123"}],customer:[{label:"Customer",e:"marcus@email.com",p:"customer123"}]};
      return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{width:"100%",maxWidth:400,animation:"fadeUp 0.4s ease"}}>
          <div style={{textAlign:"center",marginBottom:30}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,lineHeight:1}}><span style={{color:C.accent}}>G</span><span style={{color:C.text}}>ARAGEIQ</span></div><div style={{color:C.muted,fontSize:13,marginTop:4}}>Shop Management & Marketplace</div></div>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:26}}>
            <div style={{display:"flex",background:C.faint,borderRadius:8,padding:3,marginBottom:20}}>{["mechanic","customer"].map(t=><button key={t} onClick={()=>{setTab(t);setErr("");}} style={{flex:1,padding:"7px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:tab===t?C.accent:"transparent",color:tab===t?"#000":C.muted,transition:"all 0.2s"}}>{t==="mechanic"?"Mechanic / Admin":"Customer"}</button>)}</div>
            <label style={S.label}>Email</label><input style={S.input} type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            <label style={S.label}>Password</label><input style={S.input} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            {err&&<div style={{color:C.red,fontSize:12,marginBottom:12}}>{err}</div>}
            <button style={{...S.btnPrimary,width:"100%"}} onClick={handle}>Sign In →</button>
          </div>
          <div style={{marginTop:12,background:C.faint,borderRadius:10,padding:"10px 14px"}}><div style={{color:C.muted,fontSize:11,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Demo Accounts</div>{hints[tab].map(h=><button key={h.e} onClick={()=>{setEmail(h.e);setPass(h.p);setErr("");}} style={{display:"block",width:"100%",background:"none",border:"none",textAlign:"left",color:C.accent,fontSize:12,cursor:"pointer",padding:"2px 0"}}>{h.label}: {h.e} / {h.p}</button>)}</div>
        </div>
      </div>;
    };
    return <Login2/>;
  }

  const currentUser=users.find(u=>u.id===user.id)||user;
  if(currentUser.role==="customer") return <CustomerPortal user={currentUser} users={users} setUsers={setUsers} vehicles={vehicles} quotes={quotes} setQuotes={setQuotes} onLogout={()=>setUser(null)}/>;

  const totalAlerts=vehicles.reduce((a,v)=>a+v.alerts.length,0);
  const criticals=vehicles.filter(v=>v.alerts.some(a=>a.level==="critical"));
  const myQuotes=quotes.filter(q=>q.mechanicId===user.id);
  const filtered=vehicles.filter(v=>v.name.toLowerCase().includes(search.toLowerCase())||v.vehicle.toLowerCase().includes(search.toLowerCase())||v.vin.toLowerCase().includes(search.toLowerCase()));
  const addVehicle=({name,phone,vin,vehicle,make,model,year})=>{setVehicles(p=>[{id:Date.now(),customerId:null,name,phone,vin,vehicle:vehicle||`${year} ${make} ${model}`,mileage:0,lastVisit:"—",services:[],alerts:[{text:"Schedule first service",level:"info"}]},...p]);};
  const logService=()=>{if(!selected||!newSvc.mileage)return;const svc={...newSvc,mileage:Number(newSvc.mileage)};setVehicles(p=>p.map(v=>v.id===selected.id?{...v,services:[svc,...v.services],lastVisit:svc.date,mileage:svc.mileage}:v));setSelected(p=>({...p,services:[svc,...p.services]}));setModal(null);};
  const sendQuote=(q)=>setQuotes(p=>[{id:Date.now(),mechanicId:user.id,...q},...p]);

  const navItems=[
    {id:"dashboard",icon:"◈",label:"Dashboard"},
    {id:"customers",icon:"◉",label:"Customers"},
    {id:"quotes",icon:"📋",label:"Quotes",badge:myQuotes.filter(q=>q.status==="countered").length},
    {id:"alerts",icon:"⚠",label:"Alerts",badge:totalAlerts},
    {id:"board",icon:"◫",label:"Community"},
    {id:"messages",icon:"✉",label:"Messages"},
  ];

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text,overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes scanMove{0%{top:10%}100%{top:85%}}`}</style>
      <div style={{width:192,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"16px 0",flexShrink:0}}>
        <div style={{padding:"0 14px 20px",display:"flex",alignItems:"baseline",gap:2}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:C.accent,lineHeight:1}}>G</span><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:17,letterSpacing:3}}>ARAGEIQ</span></div>
        <nav style={{flex:1,padding:"0 8px",display:"flex",flexDirection:"column",gap:2}}>
          {navItems.map(item=>(
            <button key={item.id} onClick={()=>{setNav(item.id);setSelected(null);}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,background:nav===item.id?C.accentDim:"transparent",color:nav===item.id?C.accent:C.muted,borderLeft:`2px solid ${nav===item.id?C.accent:"transparent"}`,fontWeight:nav===item.id?600:400,transition:"all 0.15s",textAlign:"left"}}>
              <span style={{fontSize:13,width:16,textAlign:"center"}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {item.badge>0&&<Badge count={item.badge}/>}
            </button>
          ))}
        </nav>
        <div style={{padding:"12px 10px",borderTop:`1px solid ${C.border}`}}>
          <button onClick={()=>setModal("vin")} style={{width:"100%",background:C.accentDim,border:`1px solid ${C.accent}30`,borderRadius:7,color:C.accent,padding:"7px 0",cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:10}}>+ SCAN VIN</button>
          <button onClick={()=>setShowProfile(true)} style={{display:"flex",alignItems:"center",gap:7,background:"none",border:"none",cursor:"pointer",width:"100%",padding:0}}>
            <div style={{fontSize:26}}>{currentUser.photo||"🧑‍🔧"}</div>
            <div style={{minWidth:0,textAlign:"left"}}><div style={{fontSize:11,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{currentUser.name}</div><div style={{fontSize:9,color:C.muted,textTransform:"capitalize"}}>{currentUser.role}</div></div>
            <button onClick={(e)=>{e.stopPropagation();setUser(null);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:9,marginLeft:"auto"}}>out</button>
          </button>
        </div>
      </div>

      <div style={{flex:1,overflow:"auto"}}>
        {nav==="dashboard"&&<div style={{padding:"24px 28px",maxWidth:780,animation:"fadeUp 0.25s ease"}}>
          <div style={{marginBottom:22}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>Dashboard</div><div style={{color:C.muted,fontSize:13}}>Welcome back, {currentUser.name.split(" ")[0]}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:26}}>
            {[{label:"Customers",val:vehicles.length,col:C.accent},{label:"Active Alerts",val:totalAlerts,col:C.red},{label:"Critical",val:criticals.length,col:C.orange},{label:"Quotes Sent",val:myQuotes.length,col:C.purple}].map((s,i)=>(
              <div key={i} style={{background:C.surface,borderRadius:10,padding:"14px 12px",borderTop:`3px solid ${s.col}`,border:`1px solid ${C.border}`,borderTopColor:s.col}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:34,color:s.col,lineHeight:1}}>{s.val}</div>
                <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginTop:3}}>{s.label}</div>
              </div>
            ))}
          </div>
          {criticals.length>0&&<><div style={S.sectionTitle}>⚠ Needs Attention</div>{criticals.map(v=><div key={v.id} style={{background:C.surface,border:`1px solid ${C.red}22`,borderLeft:`3px solid ${C.red}`,borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
            <div><div style={{fontWeight:600,fontSize:14}}>{v.name} <span style={{color:C.muted,fontWeight:400}}>· {v.vehicle}</span></div>{v.alerts.filter(a=>a.level==="critical").map((a,i)=><div key={i} style={{color:C.red,fontSize:12,marginTop:2}}>● {a.text}</div>)}</div>
            <button style={S.btnPrimary} onClick={()=>{setSelected(v);setModal("alert");}}>Alert</button>
          </div>)}</>}
          <div style={S.sectionTitle}>Recent Customers</div>
          {vehicles.slice(0,4).map(v=><div key={v.id} style={{...S.row,cursor:"pointer"}} onClick={()=>{setSelected(v);setNav("detail");}}>
            <Av name={v.name} size={32}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{v.name}</div><div style={{color:C.muted,fontSize:12}}>{v.vehicle} · {v.lastVisit}</div></div>
            <span style={{color:v.alerts.length>0?C.red:C.muted,fontSize:12}}>{v.alerts.length} alert{v.alerts.length!==1?"s":""}</span>
          </div>)}
        </div>}

        {nav==="customers"&&<div style={{padding:"24px 28px",maxWidth:780,animation:"fadeUp 0.25s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
            <div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>Customers</div><div style={{color:C.muted,fontSize:13}}>{vehicles.length} vehicles</div></div>
            <button style={S.btnPrimary} onClick={()=>setModal("vin")}>+ Scan VIN</button>
          </div>
          <input style={{...S.input,marginBottom:14}} placeholder="Search name, vehicle, VIN…" value={search} onChange={e=>setSearch(e.target.value)}/>
          {filtered.map(v=><div key={v.id} style={{...S.row,cursor:"pointer"}} onClick={()=>{setSelected(v);setNav("detail");}}>
            <Av name={v.name} size={34}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{v.name}</div><div style={{color:C.muted,fontSize:12}}>{v.vehicle} · {v.mileage.toLocaleString()} mi</div></div>
            <span style={{background:v.alerts.length?C.red+"18":C.faint,color:v.alerts.length?C.red:C.muted,borderRadius:99,padding:"3px 9px",fontSize:11,fontWeight:700}}>{v.alerts.length} alerts</span>
          </div>)}
        </div>}

        {nav==="quotes"&&<div style={{padding:"24px 28px",maxWidth:780,animation:"fadeUp 0.25s ease"}}>
          <div style={{marginBottom:18}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>Quotes</div><div style={{color:C.muted,fontSize:13}}>{myQuotes.length} quotes sent</div></div>
          {myQuotes.length===0&&<div style={{color:C.muted,fontSize:13}}>No quotes sent yet. Open a customer profile and tap "Quote".</div>}
          {myQuotes.map(q=>{const v=vehicles.find(vv=>vv.id===q.vehicleId);return <QuoteCard key={q.id} quote={{...q,name:v?.name}} isCustomer={false} onRespond={()=>{}}/>;})}
        </div>}

        {nav==="alerts"&&<div style={{padding:"24px 28px",maxWidth:780,animation:"fadeUp 0.25s ease"}}>
          <div style={{marginBottom:18}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>Alerts</div><div style={{color:C.muted,fontSize:13}}>{totalAlerts} active</div></div>
          {vehicles.filter(v=>v.alerts.length>0).map(v=><div key={v.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><Av name={v.name} size={30}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{v.name}</div><div style={{color:C.muted,fontSize:12}}>{v.vehicle}</div></div><button style={S.btnPrimary} onClick={()=>{setSelected(v);setModal("alert");}}>Send Texts</button></div>
            {v.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",borderRadius:5,background:LEVEL_COLOR[a.level]+"0D",marginBottom:4,border:`1px solid ${LEVEL_COLOR[a.level]}22`}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:12,flex:1}}>{a.text}</span><Pill level={a.level}/></div>)}
          </div>)}
        </div>}

        {nav==="board"&&<Community user={currentUser}/>}
        {nav==="messages"&&<Messages user={user} vehicles={vehicles} users={users}/>}

        {nav==="detail"&&selected&&<div style={{padding:"24px 28px",maxWidth:780,animation:"fadeUp 0.25s ease"}}>
          <button onClick={()=>setNav("customers")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:14,padding:0}}>← Back</button>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:20,flexWrap:"wrap"}}>
            <Av name={selected.name} size={48}/>
            <div style={{flex:1}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:1}}>{selected.name}</div><div style={{color:C.muted,fontSize:13}}>{selected.vehicle} · {selected.phone}</div><div style={{color:C.muted,fontSize:11,fontFamily:"monospace"}}>{selected.vin}</div></div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <button style={{...S.btnSecondary,fontSize:12}} onClick={()=>{setShareTarget(selected);setModal("share");}}>🔗 Share</button>
              <button style={{...S.btnSecondary,fontSize:12}} onClick={()=>setModal("alert")}>📱 Alert</button>
              <button style={{...S.btnSecondary,fontSize:12,borderColor:C.purple+"40",color:C.purple}} onClick={()=>{setQuoteTarget(selected);setModal("quote");}}>📋 Quote</button>
              <button style={S.btnPrimary} onClick={()=>setModal("service")}>+ Service</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            <div style={S.card}><div style={S.cardTitle}>Vehicle Info</div>{[["Mileage",selected.mileage.toLocaleString()+" mi"],["Last Visit",selected.lastVisit]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.muted,fontSize:12}}>{l}</span><span style={{fontSize:13}}>{v}</span></div>)}</div>
            <div style={S.card}><div style={S.cardTitle}>Alerts</div>{selected.alerts.length===0&&<div style={{color:C.muted,fontSize:12}}>No alerts</div>}{selected.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:12}}>{a.text}</span></div>)}</div>
          </div>
          <div style={S.sectionTitle}>Service History</div>
          {selected.services.length===0&&<div style={{color:C.muted,fontSize:13}}>No services yet.</div>}
          {selected.services.map((s,i)=><div key={i} style={{...S.row,cursor:"default"}}><div style={{width:28,height:28,borderRadius:6,background:C.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🔧</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{s.type}</div><div style={{color:C.muted,fontSize:12}}>{s.date} · {Number(s.mileage).toLocaleString()} mi{s.notes?" · "+s.notes:""}</div></div></div>)}
        </div>}
      </div>

      {modal==="vin"&&<VINModal onClose={()=>setModal(null)} onAdd={addVehicle}/>}
      {modal==="quote"&&quoteTarget&&<QuoteBuilder mechanic={currentUser} vehicle={quoteTarget} onClose={()=>{setModal(null);setQuoteTarget(null);}} onSend={sendQuote}/>}
      {showProfile&&<ProfilePage user={currentUser} users={users} setUsers={setUsers} onClose={()=>setShowProfile(false)}/>}

      {modal==="share"&&shareTarget&&<div style={S.overlay}><div style={{...S.modal,maxWidth:360}}>
        <div style={S.modalHead}><span style={S.modalTitle}>Share Profile</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
        <div style={{background:C.faint,borderRadius:8,padding:"10px 12px",marginBottom:12}}><div style={{fontWeight:600,fontSize:14}}>{shareTarget.vehicle}</div><div style={{color:C.muted,fontSize:12,marginTop:2}}>{shareTarget.name} · {shareTarget.phone}</div></div>
        <div style={{color:C.muted,fontSize:12,marginBottom:10}}>Sends a secure link for the customer to view their full service history.</div>
        <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setModal(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={()=>setModal(null)}>📱 Send to Customer</button></div>
      </div></div>}

      {modal==="service"&&selected&&<div style={S.overlay}><div style={{...S.modal,maxWidth:380}}>
        <div style={S.modalHead}><span style={S.modalTitle}>Log Service</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
        <div style={{color:C.muted,fontSize:12,marginBottom:12}}>{selected.vehicle} · {selected.name}</div>
        <label style={S.label}>Service Type</label><select style={S.input} value={newSvc.type} onChange={e=>setNewSvc(p=>({...p,type:e.target.value}))}>{SERVICE_TYPES.map(t=><option key={t}>{t}</option>)}</select>
        <label style={S.label}>Date</label><input style={S.input} type="date" value={newSvc.date} onChange={e=>setNewSvc(p=>({...p,date:e.target.value}))}/>
        <label style={S.label}>Mileage</label><input style={S.input} type="number" placeholder="Current mileage" value={newSvc.mileage} onChange={e=>setNewSvc(p=>({...p,mileage:e.target.value}))}/>
        <label style={S.label}>Notes</label><textarea style={{...S.input,height:50,resize:"none"}} value={newSvc.notes} onChange={e=>setNewSvc(p=>({...p,notes:e.target.value}))}/>
        <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setModal(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={logService}>Save</button></div>
      </div></div>}

      {modal==="alert"&&selected&&<div style={S.overlay}><div style={{...S.modal,maxWidth:370}}>
        <div style={S.modalHead}><span style={S.modalTitle}>Send Alert</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
        <div style={{color:C.muted,fontSize:12,marginBottom:12}}>📱 {selected.phone} · {selected.vehicle}</div>
        {selected.alerts.map((a,i)=>{const sent=alertSent.includes(selected.id+i); return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:LEVEL_COLOR[a.level]+"10",border:`1px solid ${LEVEL_COLOR[a.level]}28`,borderRadius:8,padding:"9px 12px",marginBottom:7,gap:8}}>
          <div><Pill level={a.level}/><div style={{fontSize:12,marginTop:3}}>{a.text}</div>{sent&&<div style={{color:C.blue,fontSize:11,marginTop:2}}>✓ Sent</div>}</div>
          <button style={sent?{...S.btnSecondary,opacity:0.5}:S.btnPrimary} disabled={sent} onClick={()=>setAlertSent(p=>[...p,selected.id+i])}>{sent?"Sent":"Send"}</button>
        </div>;})}
        <button style={{...S.btnSecondary,marginTop:6}} onClick={()=>setModal(null)}>Close</button>
      </div></div>}
    </div>
  );
}

const S = {
  label:{display:"block",color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:1,marginBottom:5},
  input:{width:"100%",background:"#0A0A0C",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,marginBottom:12,outline:"none",fontFamily:"inherit"},
  btnPrimary:{background:C.accent,color:"#000",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0},
  btnSecondary:{background:C.faint,color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:13,flexShrink:0},
  sectionTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,color:C.accent,marginBottom:10,marginTop:4},
  row:{display:"flex",alignItems:"center",gap:11,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 13px",marginBottom:7},
  card:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 15px"},
  cardTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:1.5,color:C.accent,marginBottom:9},
  overlay:{position:"fixed",inset:0,background:"#00000099",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20},
  modal:{background:"#141417",border:`1px solid ${C.border}`,borderRadius:14,padding:22,width:"100%",maxHeight:"90vh",overflow:"auto",animation:"fadeUp 0.2s ease"},
  modalHead:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},
  modalTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:1,color:C.accent},
  iconBtn:{background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer"},
};
