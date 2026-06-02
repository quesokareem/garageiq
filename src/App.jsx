import { useState, useRef, useEffect } from "react";

// ─── CONSTANTS ─────────────────────────────────────────────
const C = {
  bg: "#0C0C0E", surface: "#141417", border: "#222228",
  accent: "#C8F135", accentDim: "#C8F13520",
  red: "#FF4D4D", redDim: "#FF4D4D18",
  orange: "#FF9A3C", orangeDim: "#FF9A3C18",
  blue: "#4FC3F7", blueDim: "#4FC3F718",
  green: "#4ADE80", greenDim: "#4ADE8018",
  text: "#F0F0F0", muted: "#666670", faint: "#1E1E24",
};
const LEVEL_COLOR = { critical: C.red, warning: C.orange, info: C.blue };

// ─── DEMO DATA ─────────────────────────────────────────────
const USERS = [
  { id:"m1", role:"mechanic", name:"Jake Torres",    email:"jake@garageiq.com",   password:"mechanic123", shop:"Torres Auto",     specialty:"Engine & Transmission", distance:"0.8 mi", rating:4.9, reviews:47, lat:25.77, lng:-80.19, available:true  },
  { id:"m2", role:"admin",    name:"Sandra Lee",     email:"admin@garageiq.com",  password:"admin123",    shop:"Lee's Auto Care", specialty:"Full Service",          distance:"1.4 mi", rating:4.7, reviews:83, lat:25.78, lng:-80.20, available:true  },
  { id:"m3", role:"mechanic", name:"Carlos Mendez",  email:"carlos@garageiq.com", password:"mechanic123", shop:"Mendez Motors",   specialty:"Electrical & AC",       distance:"2.1 mi", rating:4.6, reviews:31, lat:25.76, lng:-80.21, available:false },
  { id:"c1", role:"customer", name:"Marcus Johnson", email:"marcus@email.com",    password:"customer123", vehicleIds:[1] },
  { id:"c2", role:"customer", name:"Tanya Rivera",   email:"tanya@email.com",     password:"customer123", vehicleIds:[2] },
  { id:"c3", role:"customer", name:"Derek Williams", email:"derek@email.com",     password:"customer123", vehicleIds:[3] },
];

const INIT_VEHICLES = [
  { id:1, customerId:"c1", name:"Marcus Johnson", phone:"555-214-8801", vin:"1HGBH41JXMN109186", vehicle:"2021 Honda Civic",       mileage:42000, lastVisit:"2024-11-10",
    services:[{type:"Oil Change",date:"2024-11-10",mileage:42000,notes:""},{type:"Tire Rotation",date:"2024-09-05",mileage:39500,notes:""}],
    alerts:[{text:"Brake inspection due",level:"warning"},{text:"Air filter replacement recommended",level:"info"}] },
  { id:2, customerId:"c2", name:"Tanya Rivera",   phone:"555-987-3320", vin:"2T1BURHE0JC041234", vehicle:"2018 Toyota Corolla",    mileage:67800, lastVisit:"2024-10-22",
    services:[{type:"Oil Change",date:"2024-10-22",mileage:67800,notes:""},{type:"Brake Pad Replacement",date:"2024-06-15",mileage:63000,notes:""}],
    alerts:[{text:"Oil change due in 1,200 miles",level:"warning"}] },
  { id:3, customerId:"c3", name:"Derek Williams", phone:"555-441-0092", vin:"3VWF17AT4FM123456", vehicle:"2015 Volkswagen Jetta",  mileage:91200, lastVisit:"2024-08-30",
    services:[{type:"Transmission Service",date:"2024-08-30",mileage:91200,notes:""}],
    alerts:[{text:"Brake pads critical — replace immediately",level:"critical"},{text:"Coolant flush overdue",level:"warning"}] },
];

const INIT_MESSAGES = [
  {id:1,from:"m1",to:"c1",text:"Hi Marcus! Your Civic is ready for pickup.",time:"10:30 AM",date:"Today"},
  {id:2,from:"c1",to:"m1",text:"Thanks Jake! I'll swing by around 3pm.",time:"10:45 AM",date:"Today"},
  {id:3,from:"m1",to:"c2",text:"Tanya, just a reminder your oil change is coming up soon.",time:"9:15 AM",date:"Today"},
];

const INIT_POSTS = [
  { id:1, authorId:"c1", authorName:"Marcus Johnson", authorRole:"customer", time:"2h ago",
    text:"Hey! Need my alternator replaced this weekend. Anyone local who can come to my house or tow it? 2021 Honda Civic. Happy to pay fairly.",
    image:null, tag:"Alternator", replies:[
      {id:1,authorId:"m1",authorName:"Jake Torres",authorRole:"mechanic",text:"Hey Marcus! I can come by Saturday morning. DM me your address and we'll get it sorted.",time:"1h ago"},
      {id:2,authorId:"c2",authorName:"Tanya Rivera",authorRole:"customer",text:"Jake did my alternator last month, he's great!",time:"45m ago"},
    ]},
  { id:2, authorId:"m2", authorName:"Sandra Lee", authorRole:"mechanic", time:"5h ago",
    text:"Offering mobile oil changes this weekend in the Miami area — $45 full synthetic. Only 3 slots left! DM me to book.",
    image:null, tag:"Oil Change", replies:[]},
  { id:3, authorId:"c3", authorName:"Derek Williams", authorRole:"customer", time:"1d ago",
    text:"My Jetta is making a loud grinding noise when I brake. Included a pic of the rotor. Any idea what this could be?",
    image:"🔴", tag:"Brakes", replies:[
      {id:1,authorId:"m3",authorName:"Carlos Mendez",authorRole:"mechanic",text:"That's definitely worn brake pads hitting the rotor. Needs immediate attention. I'm available Monday.",time:"20h ago"},
    ]},
];

const INIT_REVIEWS = [
  {id:1,mechanicId:"m1",authorName:"Tanya Rivera",rating:5,text:"Jake fixed my alternator in 2 hours. Super professional, fair price. Will definitely use again!",time:"2 weeks ago",verified:true,image:null},
  {id:2,mechanicId:"m1",authorName:"Derek Williams",rating:4,text:"Good work on the transmission. Took a bit longer than expected but quality was great.",time:"1 month ago",verified:true,image:null},
  {id:3,mechanicId:"m2",authorName:"Marcus Johnson",rating:5,text:"Sandra's shop is spotless and she explains everything clearly. Best mechanic I've had.",time:"3 weeks ago",verified:true,image:null},
  {id:4,mechanicId:"m3",authorName:"Tanya Rivera",rating:4,text:"Carlos fixed my AC quickly. Knowledgeable guy, good prices.",time:"2 months ago",verified:false,image:null},
];

const SERVICE_TYPES = ["Oil Change","Tire Rotation","Brake Pad Replacement","Air Filter","Transmission Service","Coolant Flush","Battery Replacement","Wheel Alignment","Spark Plugs","Full Inspection"];
const JOB_TAGS = ["Oil Change","Brakes","Alternator","AC","Transmission","Electrical","Tires","Engine","Battery","Other"];

// ─── SHARED COMPONENTS ─────────────────────────────────────
function Av({ name, size=36, color=C.accent }) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:color+"22",color,
    display:"flex",alignItems:"center",justifyContent:"center",
    fontFamily:"'Bebas Neue',sans-serif",fontSize:size*0.46,flexShrink:0}}>{name?.[0]?.toUpperCase()}</div>;
}
function Stars({ rating, size=14 }) {
  return <span style={{fontSize:size,color:C.accent,letterSpacing:1}}>
    {"★".repeat(Math.round(rating))}{"☆".repeat(5-Math.round(rating))}
  </span>;
}
function Pill({ level, text }) {
  const col = LEVEL_COLOR[level] || C.blue;
  return <span style={{background:col+"18",color:col,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 9px",letterSpacing:0.5}}>{(text||level)?.toUpperCase()}</span>;
}
function Badge({ count }) {
  if (!count) return null;
  return <span style={{background:C.red,color:"#000",borderRadius:99,fontSize:10,fontWeight:800,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{count}</span>;
}

// ─── LOGIN ─────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState(""); const [tab,setTab]=useState("mechanic");
  const handle=()=>{ const u=USERS.find(u=>u.email===email&&u.password===pass); if(!u){setErr("Invalid credentials.");return;} const map={mechanic:["mechanic","admin"],customer:["customer"]}; if(!map[tab].includes(u.role)){setErr(`Not a ${tab} account.`);return;} onLogin(u); };
  const hints={ mechanic:[{label:"Mechanic",e:"jake@garageiq.com",p:"mechanic123"},{label:"Admin",e:"admin@garageiq.com",p:"admin123"}], customer:[{label:"Customer",e:"marcus@email.com",p:"customer123"}] };
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{width:"100%",maxWidth:400,animation:"fadeUp 0.4s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:54,lineHeight:1}}><span style={{color:C.accent}}>G</span><span style={{color:C.text}}>ARAGEIQ</span></div>
          <div style={{color:C.muted,fontSize:13,marginTop:4}}>Shop Management & Marketplace</div>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:28}}>
          <div style={{display:"flex",background:C.faint,borderRadius:8,padding:3,marginBottom:22}}>
            {["mechanic","customer"].map(t=>(
              <button key={t} onClick={()=>{setTab(t);setErr("");}} style={{flex:1,padding:"8px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:tab===t?C.accent:"transparent",color:tab===t?"#000":C.muted,transition:"all 0.2s"}}>{t==="mechanic"?"Mechanic / Admin":"Customer"}</button>
            ))}
          </div>
          <label style={S.label}>Email</label>
          <input style={S.input} type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
          <label style={S.label}>Password</label>
          <input style={S.input} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
          {err&&<div style={{color:C.red,fontSize:12,marginBottom:12}}>{err}</div>}
          <button style={{...S.btnPrimary,width:"100%"}} onClick={handle}>Sign In →</button>
        </div>
        <div style={{marginTop:14,background:C.faint,borderRadius:10,padding:"12px 16px"}}>
          <div style={{color:C.muted,fontSize:11,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Demo Accounts</div>
          {hints[tab].map(h=>(
            <button key={h.e} onClick={()=>{setEmail(h.e);setPass(h.p);setErr("");}} style={{display:"block",width:"100%",background:"none",border:"none",textAlign:"left",color:C.accent,fontSize:12,cursor:"pointer",padding:"3px 0"}}>
              {h.label}: {h.e} / {h.p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGES ──────────────────────────────────────────────
function Messages({ user, vehicles, users, initContact=null }) {
  const mechanics = users.filter(u=>u.role!=="customer");
  const customers = users.filter(u=>u.role==="customer");
  const contacts = user.role==="customer" ? mechanics : customers;
  const [active,setActive]=useState(initContact ? users.find(u=>u.id===initContact) : contacts[0]);
  const [msgs,setMsgs]=useState(INIT_MESSAGES);
  const [draft,setDraft]=useState("");
  const bottomRef=useRef();
  const thread=msgs.filter(m=>(m.from===user.id&&m.to===active?.id)||(m.from===active?.id&&m.to===user.id));
  const send=()=>{ if(!draft.trim()||!active)return; setMsgs(p=>[...p,{id:Date.now(),from:user.id,to:active.id,text:draft.trim(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:"Today"}]); setDraft(""); };
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[thread.length,active?.id]);
  const getV=(id)=>vehicles.find(v=>v.customerId===id);
  return (
    <div style={{display:"flex",height:"calc(100vh - 56px)",background:C.bg}}>
      <div style={{width:230,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"14px 16px 10px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,color:C.accent}}>MESSAGES</div>
        </div>
        <div style={{flex:1,overflow:"auto"}}>
          {contacts.map(c=>{
            const v=getV(c.id); const unread=msgs.filter(m=>m.from===c.id&&m.to===user.id).length;
            return (
              <div key={c.id} onClick={()=>setActive(c)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,background:active?.id===c.id?C.faint:"transparent"}}>
                <Av name={c.name} size={32}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
                  <div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.shop||v?.vehicle||c.role}</div>
                </div>
                {unread>0&&<Badge count={unread}/>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        {active ? <>
          <div style={{padding:"11px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
            <Av name={active.name} size={30}/>
            <div><div style={{fontWeight:600,fontSize:14}}>{active.name}</div><div style={{color:C.muted,fontSize:11}}>{active.shop||getV(active.id)?.vehicle||""}</div></div>
          </div>
          <div style={{flex:1,overflow:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:8}}>
            {thread.length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",marginTop:40}}>No messages yet. Say hello! 👋</div>}
            {thread.map(m=>{
              const mine=m.from===user.id;
              return <div key={m.id} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"68%",background:mine?C.accent:C.surface,color:mine?"#000":C.text,borderRadius:mine?"14px 14px 3px 14px":"14px 14px 14px 3px",padding:"9px 13px",fontSize:13,border:mine?"none":`1px solid ${C.border}`}}>
                  <div>{m.text}</div>
                  <div style={{fontSize:10,marginTop:3,opacity:0.5,textAlign:"right"}}>{m.time}</div>
                </div>
              </div>;
            })}
            <div ref={bottomRef}/>
          </div>
          <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
            <input style={{...S.input,margin:0,flex:1}} placeholder="Type a message…" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
            <button style={S.btnPrimary} onClick={send}>Send</button>
          </div>
        </> : <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Select a conversation</div>}
      </div>
    </div>
  );
}

// ─── FIND A MECHANIC ───────────────────────────────────────
function FindMechanic({ user, onDM }) {
  const mechanics = USERS.filter(u=>u.role==="mechanic"||u.role==="admin");
  const [reviewMech,setReviewMech]=useState(null);
  const [reviews,setReviews]=useState(INIT_REVIEWS);
  const [showReviews,setShowReviews]=useState(null);
  const [newReview,setNewReview]=useState({rating:5,text:"",image:null});
  const [filter,setFilter]=useState("all");

  const filtered = filter==="available" ? mechanics.filter(m=>m.available) : mechanics;

  const mechReviews=(id)=>reviews.filter(r=>r.mechanicId===id);
  const avgRating=(id)=>{ const r=mechReviews(id); return r.length?( r.reduce((a,b)=>a+b.rating,0)/r.length ).toFixed(1):null; };

  const submitReview=()=>{
    if(!newReview.text.trim())return;
    setReviews(p=>[...p,{id:Date.now(),mechanicId:reviewMech.id,authorName:user.name,rating:newReview.rating,text:newReview.text,time:"Just now",verified:true,image:newReview.image}]);
    setNewReview({rating:5,text:"",image:null}); setReviewMech(null);
  };

  return (
    <div style={{padding:"26px 28px",maxWidth:780,animation:"fadeUp 0.25s ease"}}>
      <div style={{marginBottom:22}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:2}}>Find a Mechanic</div>
        <div style={{color:C.muted,fontSize:13}}>Local mechanics near you — tap DM to message directly</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["all","available"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 16px",borderRadius:99,border:`1px solid ${filter===f?C.accent:C.border}`,background:filter===f?C.accentDim:"transparent",color:filter===f?C.accent:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
            {f==="all"?"All Mechanics":"Available Now"}
          </button>
        ))}
      </div>

      {filtered.map(m=>{
        const r=mechReviews(m.id); const avg=avgRating(m.id);
        return (
          <div key={m.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <Av name={m.name} size={44}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontWeight:700,fontSize:15}}>{m.name}</span>
                  {m.available
                    ? <span style={{background:C.greenDim,color:C.green,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>● AVAILABLE</span>
                    : <span style={{background:C.faint,color:C.muted,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>BUSY</span>}
                </div>
                <div style={{color:C.muted,fontSize:12,marginTop:2}}>{m.shop} · {m.specialty}</div>
                <div style={{color:C.muted,fontSize:12,marginTop:1}}>📍 {m.distance} away</div>
                {avg&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                  <Stars rating={parseFloat(avg)} size={13}/>
                  <span style={{color:C.text,fontSize:13,fontWeight:600}}>{avg}</span>
                  <span style={{color:C.muted,fontSize:12}}>({r.length} review{r.length!==1?"s":""})</span>
                </div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7,flexShrink:0}}>
                <button style={S.btnPrimary} onClick={()=>onDM(m.id)}>💬 DM</button>
                <button style={S.btnSecondary} onClick={()=>setShowReviews(showReviews===m.id?null:m.id)}>Reviews</button>
                {user.role==="customer"&&<button style={{...S.btnSecondary,borderColor:C.accent+"40",color:C.accent}} onClick={()=>setReviewMech(m)}>✏ Review</button>}
              </div>
            </div>

            {showReviews===m.id&&(
              <div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:14}}>
                {r.length===0&&<div style={{color:C.muted,fontSize:13}}>No reviews yet.</div>}
                {r.map(rv=>(
                  <div key={rv.id} style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${C.faint}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <Av name={rv.authorName} size={26} color={C.blue}/>
                      <div>
                        <span style={{fontSize:13,fontWeight:600}}>{rv.authorName}</span>
                        {rv.verified&&<span style={{background:C.greenDim,color:C.green,fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:99,marginLeft:6}}>✓ VERIFIED</span>}
                      </div>
                      <span style={{marginLeft:"auto",color:C.muted,fontSize:11}}>{rv.time}</span>
                    </div>
                    <Stars rating={rv.rating} size={12}/>
                    <div style={{color:C.text,fontSize:13,marginTop:5}}>{rv.text}</div>
                    {rv.image&&<div style={{marginTop:8,fontSize:32}}>{rv.image}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Review Modal */}
      {reviewMech&&(
        <div style={S.overlay}>
          <div style={{...S.modal,maxWidth:420}}>
            <div style={S.modalHead}>
              <span style={S.modalTitle}>Review {reviewMech.name}</span>
              <button onClick={()=>setReviewMech(null)} style={S.iconBtn}>✕</button>
            </div>
            <div style={{color:C.muted,fontSize:12,marginBottom:16}}>{reviewMech.shop} · {reviewMech.specialty}</div>
            <label style={S.label}>Rating</label>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setNewReview(p=>({...p,rating:n}))} style={{fontSize:24,background:"none",border:"none",cursor:"pointer",color:n<=newReview.rating?C.accent:"#333",transition:"color 0.15s"}}>★</button>
              ))}
            </div>
            <label style={S.label}>Your Review</label>
            <textarea style={{...S.input,height:80,resize:"none"}} placeholder="Share your experience…" value={newReview.text} onChange={e=>setNewReview(p=>({...p,text:e.target.value}))}/>
            <label style={S.label}>Photo (optional)</label>
            <div style={{background:C.faint,border:`1px dashed ${C.border}`,borderRadius:8,padding:"14px",textAlign:"center",marginBottom:14,cursor:"pointer",color:C.muted,fontSize:13}}
              onClick={()=>setNewReview(p=>({...p,image:p.image?"":"📸"}))}>
              {newReview.image ? <span style={{fontSize:32}}>{newReview.image} <span style={{fontSize:13,color:C.green}}>Photo added ✓</span></span> : "📷 Tap to attach photo"}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={S.btnSecondary} onClick={()=>setReviewMech(null)}>Cancel</button>
              <button style={{...S.btnPrimary,flex:1}} onClick={submitReview} disabled={!newReview.text.trim()}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
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

  const filtered = filter==="all" ? posts : posts.filter(p=>p.tag===filter);

  const submit=()=>{
    if(!newPost.text.trim())return;
    setPosts(p=>[{id:Date.now(),authorId:user.id,authorName:user.name,authorRole:user.role,time:"Just now",text:newPost.text,image:newPost.image,tag:newPost.tag,replies:[]}, ...p]);
    setNewPost({text:"",tag:JOB_TAGS[0],image:null}); setShowCompose(false);
  };

  const reply=(postId)=>{
    const txt=replyText[postId];
    if(!txt?.trim())return;
    setPosts(prev=>prev.map(p=>p.id===postId?{...p,replies:[...p.replies,{id:Date.now(),authorId:user.id,authorName:user.name,authorRole:user.role,text:txt.trim(),time:"Just now"}]}:p));
    setReplyText(p=>({...p,[postId]:""}));
  };

  const roleColor=(role)=> role==="mechanic"||role==="admin" ? C.orange : C.blue;
  const roleLabel=(role)=> role==="mechanic"||role==="admin" ? "MECHANIC" : "CUSTOMER";

  return (
    <div style={{padding:"26px 28px",maxWidth:780,animation:"fadeUp 0.25s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:2}}>Community Board</div>
          <div style={{color:C.muted,fontSize:13}}>Post a job request or offer your services</div>
        </div>
        <button style={S.btnPrimary} onClick={()=>setShowCompose(true)}>+ Post</button>
      </div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        {["all",...JOB_TAGS].map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{padding:"5px 13px",borderRadius:99,border:`1px solid ${filter===t?C.accent:C.border}`,background:filter===t?C.accentDim:"transparent",color:filter===t?C.accent:C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>
            {t==="all"?"All":t}
          </button>
        ))}
      </div>

      {filtered.map(post=>(
        <div key={post.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
            <Av name={post.authorName} size={36} color={roleColor(post.authorRole)}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                <span style={{fontWeight:600,fontSize:14}}>{post.authorName}</span>
                <span style={{background:roleColor(post.authorRole)+"18",color:roleColor(post.authorRole),borderRadius:99,fontSize:10,fontWeight:700,padding:"1px 7px"}}>{roleLabel(post.authorRole)}</span>
                <span style={{background:C.accentDim,color:C.accent,borderRadius:99,fontSize:10,fontWeight:700,padding:"1px 7px"}}>{post.tag}</span>
                <span style={{color:C.muted,fontSize:11,marginLeft:"auto"}}>{post.time}</span>
              </div>
              <div style={{color:C.text,fontSize:13,marginTop:7,lineHeight:1.6}}>{post.text}</div>
              {post.image&&<div style={{marginTop:10,fontSize:40,background:C.faint,borderRadius:8,padding:"12px 16px",display:"inline-block"}}>{post.image}</div>}
            </div>
          </div>

          {post.replies.length>0&&(
            <div style={{marginLeft:46,borderLeft:`2px solid ${C.border}`,paddingLeft:14,marginBottom:10}}>
              {post.replies.map(r=>(
                <div key={r.id} style={{marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <Av name={r.authorName} size={24} color={roleColor(r.authorRole)}/>
                    <span style={{fontWeight:600,fontSize:13}}>{r.authorName}</span>
                    <span style={{background:roleColor(r.authorRole)+"18",color:roleColor(r.authorRole),borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 6px"}}>{roleLabel(r.authorRole)}</span>
                    <span style={{color:C.muted,fontSize:11,marginLeft:"auto"}}>{r.time}</span>
                  </div>
                  <div style={{color:C.text,fontSize:13,marginTop:4,marginLeft:31}}>{r.text}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{display:"flex",gap:8,marginLeft:46}}>
            <input style={{...S.input,margin:0,flex:1,fontSize:12,padding:"7px 10px"}} placeholder="Write a reply…"
              value={replyText[post.id]||""} onChange={e=>setReplyText(p=>({...p,[post.id]:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&reply(post.id)}/>
            <button style={{...S.btnPrimary,padding:"7px 14px",fontSize:12}} onClick={()=>reply(post.id)}>Reply</button>
          </div>
        </div>
      ))}

      {showCompose&&(
        <div style={S.overlay}>
          <div style={{...S.modal,maxWidth:460}}>
            <div style={S.modalHead}>
              <span style={S.modalTitle}>New Post</span>
              <button onClick={()=>setShowCompose(false)} style={S.iconBtn}>✕</button>
            </div>
            <label style={S.label}>Category</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {JOB_TAGS.map(t=>(
                <button key={t} onClick={()=>setNewPost(p=>({...p,tag:t}))} style={{padding:"4px 12px",borderRadius:99,border:`1px solid ${newPost.tag===t?C.accent:C.border}`,background:newPost.tag===t?C.accentDim:"transparent",color:newPost.tag===t?C.accent:C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>{t}</button>
              ))}
            </div>
            <label style={S.label}>Your Message</label>
            <textarea style={{...S.input,height:100,resize:"none"}} placeholder="Describe what you need or what you're offering…" value={newPost.text} onChange={e=>setNewPost(p=>({...p,text:e.target.value}))}/>
            <label style={S.label}>Attach Photo (optional)</label>
            <div style={{background:C.faint,border:`1px dashed ${C.border}`,borderRadius:8,padding:"14px",textAlign:"center",marginBottom:14,cursor:"pointer",color:C.muted,fontSize:13}}
              onClick={()=>setNewPost(p=>({...p,image:p.image?"":"📸"}))}>
              {newPost.image?<span><span style={{fontSize:28}}>📸</span> <span style={{color:C.green}}>Photo attached ✓</span></span>:"📷 Tap to attach photo"}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={S.btnSecondary} onClick={()=>setShowCompose(false)}>Cancel</button>
              <button style={{...S.btnPrimary,flex:1}} onClick={submit} disabled={!newPost.text.trim()}>Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CUSTOMER PORTAL ───────────────────────────────────────
function CustomerPortal({ user, vehicles, onLogout }) {
  const myVehicles=vehicles.filter(v=>user.vehicleIds?.includes(v.id));
  const [tab,setTab]=useState("garage");
  const [dmContact,setDmContact]=useState(null);

  const handleDM=(mechId)=>{ setDmContact(mechId); setTab("messages"); };

  const tabs=[{id:"garage",label:"My Garage"},{id:"find",label:"Find Mechanic"},{id:"board",label:"Community"},{id:"messages",label:"Messages"}];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 20px",display:"flex",alignItems:"center",gap:0,height:56}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,marginRight:24}}><span style={{color:C.accent}}>G</span><span>ARAGEIQ</span></div>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>{ setDmContact(null); setTab(t.id); }} style={{padding:"0 14px",height:"100%",border:"none",background:"transparent",color:tab===t.id?C.accent:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",borderBottom:`2px solid ${tab===t.id?C.accent:"transparent"}`,transition:"all 0.15s"}}>{t.label}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          <Av name={user.name} size={28}/>
          <span style={{fontSize:13,color:C.muted}}>{user.name.split(" ")[0]}</span>
          <button onClick={onLogout} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12}}>Sign out</button>
        </div>
      </div>

      {tab==="garage"&&(
        <div style={{padding:"26px 24px",maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
          <div style={{marginBottom:22}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:1}}>My Garage</div>
            <div style={{color:C.muted,fontSize:13}}>Hey {user.name.split(" ")[0]}, here's your vehicle status</div>
          </div>
          {myVehicles.map(v=>(
            <div key={v.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:20}}>
              <div style={{padding:"16px 18px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{fontWeight:700,fontSize:16}}>{v.vehicle}</div>
                <div style={{color:C.muted,fontSize:11,fontFamily:"monospace",marginTop:3}}>VIN: {v.vin}</div>
                <div style={{color:C.muted,fontSize:12,marginTop:2}}>{v.mileage.toLocaleString()} miles · Last visit {v.lastVisit}</div>
              </div>
              {v.alerts.length>0&&(
                <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Alerts</div>
                  {v.alerts.map((a,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                      <span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span>
                      <span style={{fontSize:13}}>{a.text}</span>
                      <Pill level={a.level}/>
                    </div>
                  ))}
                </div>
              )}
              <div style={{padding:"12px 18px"}}>
                <div style={{color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Service History</div>
                {v.services.map((s,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<v.services.length-1?`1px solid ${C.border}`:"none"}}>
                    <span style={{fontSize:13}}>{s.type}</span>
                    <span style={{color:C.muted,fontSize:12}}>{s.date} · {Number(s.mileage).toLocaleString()} mi</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="find"&&<FindMechanic user={user} onDM={handleDM}/>}
      {tab==="board"&&<Community user={user}/>}
      {tab==="messages"&&<Messages user={user} vehicles={vehicles} users={USERS} initContact={dmContact}/>}
    </div>
  );
}

// ─── VIN MODAL ─────────────────────────────────────────────
function VINModal({ onClose, onAdd }) {
  const [vin,setVin]=useState(""); const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [vehicle,setVehicle]=useState(""); const [scanning,setScanning]=useState(false); const [step,setStep]=useState(1);
  const simulateScan=()=>{ setScanning(true); setTimeout(()=>{ setScanning(false); setVin("4T1BF1FK5HU123456"); setVehicle("2017 Toyota Camry"); setStep(2); },2000); };
  const handleManual=()=>{ if(vin.length>=10){setVehicle("Vehicle Identified");setStep(2);} };
  const save=()=>{ if(!name||!phone||!vin)return; onAdd({name,phone,vin,vehicle}); onClose(); };
  return (
    <div style={S.overlay}>
      <div style={{...S.modal,maxWidth:420}}>
        <div style={S.modalHead}><span style={S.modalTitle}>New Client — VIN Scan</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
        {step===1&&<>
          <div style={{position:"relative",height:120,background:"#080808",borderRadius:10,marginBottom:14,overflow:"hidden",border:`1px solid ${scanning?C.accent:C.border}`,transition:"border-color 0.3s"}}>
            {["tl","tr","bl","br"].map(p=><Corner key={p} pos={p}/>)}
            {scanning&&<div style={{position:"absolute",left:"8%",right:"8%",height:2,background:C.accent,boxShadow:`0 0 12px ${C.accent}`,animation:"scanMove 1.1s linear infinite"}}/>}
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:scanning?C.accent:C.muted,fontSize:11,fontWeight:700,letterSpacing:2}}>{scanning?"SCANNING...":"CAMERA PREVIEW"}</div>
          </div>
          <button style={{...S.btnPrimary,width:"100%",marginBottom:12}} onClick={simulateScan} disabled={scanning}>{scanning?"Scanning...":"📷 Scan VIN Barcode"}</button>
          <div style={{textAlign:"center",color:C.muted,fontSize:12,marginBottom:10}}>— or type manually —</div>
          <input style={S.input} placeholder="Enter VIN (min 10 chars)" value={vin} onChange={e=>setVin(e.target.value.toUpperCase())} maxLength={17}/>
          <button style={S.btnSecondary} onClick={handleManual}>Continue</button>
        </>}
        {step===2&&<>
          <div style={{background:C.accentDim,border:`1px solid ${C.accent}30`,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
            <div style={{color:C.accent,fontSize:11,fontWeight:700,marginBottom:3}}>VEHICLE IDENTIFIED</div>
            <div style={{color:C.text,fontSize:14,fontWeight:600}}>{vehicle}</div>
            <div style={{color:C.muted,fontSize:11,fontFamily:"monospace",marginTop:2}}>{vin}</div>
          </div>
          <label style={S.label}>Customer Name</label>
          <input style={S.input} placeholder="Full name" value={name} onChange={e=>setName(e.target.value)}/>
          <label style={S.label}>Phone Number</label>
          <input style={S.input} placeholder="555-000-0000" value={phone} onChange={e=>setPhone(e.target.value)}/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button style={S.btnSecondary} onClick={()=>setStep(1)}>← Back</button>
            <button style={{...S.btnPrimary,flex:1}} onClick={save} disabled={!name||!phone}>Create Client</button>
          </div>
        </>}
      </div>
      <style>{`@keyframes scanMove{0%{top:10%}100%{top:85%}}`}</style>
    </div>
  );
}
function Corner({pos}){const m={tl:{top:10,left:10},tr:{top:10,right:10},bl:{bottom:10,left:10},br:{bottom:10,right:10}};const b={tl:{borderTop:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`},tr:{borderTop:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`},bl:{borderBottom:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`},br:{borderBottom:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`}};return <div style={{position:"absolute",width:18,height:18,...m[pos],...b[pos]}}/>;}

// ─── MECHANIC / ADMIN APP ──────────────────────────────────
export default function GarageIQ() {
  const [user,setUser]=useState(null);
  const [vehicles,setVehicles]=useState(INIT_VEHICLES);
  const [nav,setNav]=useState("dashboard");
  const [selected,setSelected]=useState(null);
  const [modal,setModal]=useState(null);
  const [shareTarget,setShareTarget]=useState(null);
  const [newSvc,setNewSvc]=useState({type:SERVICE_TYPES[0],date:new Date().toISOString().split("T")[0],mileage:"",notes:""});
  const [alertSent,setAlertSent]=useState([]);
  const [search,setSearch]=useState("");

  if(!user) return <Login onLogin={setUser}/>;
  if(user.role==="customer") return <CustomerPortal user={user} vehicles={vehicles} onLogout={()=>setUser(null)}/>;

  const totalAlerts=vehicles.reduce((a,v)=>a+v.alerts.length,0);
  const criticals=vehicles.filter(v=>v.alerts.some(a=>a.level==="critical"));
  const filtered=vehicles.filter(v=>v.name.toLowerCase().includes(search.toLowerCase())||v.vehicle.toLowerCase().includes(search.toLowerCase())||v.vin.toLowerCase().includes(search.toLowerCase()));

  const addVehicle=({name,phone,vin,vehicle})=>{ setVehicles(p=>[{id:Date.now(),customerId:null,name,phone,vin,vehicle,mileage:0,lastVisit:"—",services:[],alerts:[{text:"Schedule first service",level:"info"}]},...p]); };
  const logService=()=>{ if(!selected||!newSvc.mileage)return; const svc={...newSvc,mileage:Number(newSvc.mileage)}; setVehicles(p=>p.map(v=>v.id===selected.id?{...v,services:[svc,...v.services],lastVisit:svc.date,mileage:svc.mileage}:v)); setSelected(p=>({...p,services:[svc,...p.services]})); setModal(null); };

  const navItems=[
    {id:"dashboard",icon:"◈",label:"Dashboard"},
    {id:"customers",icon:"◉",label:"Customers"},
    {id:"alerts",icon:"⚠",label:"Alerts",badge:totalAlerts},
    {id:"board",icon:"◫",label:"Community"},
    {id:"messages",icon:"✉",label:"Messages"},
  ];

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text,overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes scanMove{0%{top:10%}100%{top:85%}}`}</style>

      {/* SIDEBAR */}
      <div style={{width:196,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"18px 0",flexShrink:0}}>
        <div style={{padding:"0 16px 24px",display:"flex",alignItems:"baseline",gap:2}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:C.accent,lineHeight:1}}>G</span>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:3}}>ARAGEIQ</span>
        </div>
        <nav style={{flex:1,padding:"0 10px",display:"flex",flexDirection:"column",gap:2}}>
          {navItems.map(item=>(
            <button key={item.id} onClick={()=>{setNav(item.id);setSelected(null);}} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,background:nav===item.id?C.accentDim:"transparent",color:nav===item.id?C.accent:C.muted,borderLeft:`2px solid ${nav===item.id?C.accent:"transparent"}`,fontWeight:nav===item.id?600:400,transition:"all 0.15s",textAlign:"left"}}>
              <span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {item.badge>0&&<Badge count={item.badge}/>}
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 12px",borderTop:`1px solid ${C.border}`}}>
          <button onClick={()=>setModal("vin")} style={{width:"100%",background:C.accentDim,border:`1px solid ${C.accent}30`,borderRadius:8,color:C.accent,padding:"8px 0",cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:12}}>+ SCAN VIN</button>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Av name={user.name} size={26}/>
            <div style={{minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
              <div style={{fontSize:10,color:C.muted,textTransform:"capitalize"}}>{user.role}</div>
            </div>
            <button onClick={()=>setUser(null)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:10,marginLeft:"auto",flexShrink:0}}>out</button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflow:"auto"}}>

        {nav==="dashboard"&&(
          <div style={{padding:"26px 30px",maxWidth:800,animation:"fadeUp 0.25s ease"}}>
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:2}}>Dashboard</div>
              <div style={{color:C.muted,fontSize:13}}>Welcome back, {user.name.split(" ")[0]}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:28}}>
              {[{label:"Customers",val:vehicles.length,col:C.accent},{label:"Active Alerts",val:totalAlerts,col:C.red},{label:"Critical",val:criticals.length,col:C.orange},{label:"Services",val:vehicles.reduce((a,v)=>a+v.services.length,0),col:C.blue}].map((s,i)=>(
                <div key={i} style={{background:C.surface,borderRadius:10,padding:"16px 14px",borderTop:`3px solid ${s.col}`,border:`1px solid ${C.border}`,borderTopColor:s.col}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:s.col,lineHeight:1}}>{s.val}</div>
                  <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
            {criticals.length>0&&<>
              <div style={S.sectionTitle}>⚠ Needs Attention</div>
              {criticals.map(v=>(
                <div key={v.id} style={{background:C.surface,border:`1px solid ${C.red}22`,borderLeft:`3px solid ${C.red}`,borderRadius:10,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{v.name} <span style={{color:C.muted,fontWeight:400}}>· {v.vehicle}</span></div>
                    {v.alerts.filter(a=>a.level==="critical").map((a,i)=><div key={i} style={{color:C.red,fontSize:12,marginTop:3}}>● {a.text}</div>)}
                  </div>
                  <button style={S.btnPrimary} onClick={()=>{setSelected(v);setModal("alert");}}>Alert</button>
                </div>
              ))}
            </>}
            <div style={S.sectionTitle}>Recent Customers</div>
            {vehicles.slice(0,4).map(v=>(
              <div key={v.id} style={{...S.row,cursor:"pointer"}} onClick={()=>{setSelected(v);setNav("detail");}}>
                <Av name={v.name} size={34}/>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{v.name}</div><div style={{color:C.muted,fontSize:12}}>{v.vehicle} · {v.lastVisit}</div></div>
                <span style={{color:v.alerts.length>0?C.red:C.muted,fontSize:12}}>{v.alerts.length} alert{v.alerts.length!==1?"s":""}</span>
              </div>
            ))}
          </div>
        )}

        {nav==="customers"&&(
          <div style={{padding:"26px 30px",maxWidth:800,animation:"fadeUp 0.25s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:2}}>Customers</div><div style={{color:C.muted,fontSize:13}}>{vehicles.length} vehicles on file</div></div>
              <button style={S.btnPrimary} onClick={()=>setModal("vin")}>+ Scan VIN</button>
            </div>
            <input style={{...S.input,marginBottom:16}} placeholder="Search name, vehicle, VIN…" value={search} onChange={e=>setSearch(e.target.value)}/>
            {filtered.map(v=>(
              <div key={v.id} style={{...S.row,cursor:"pointer"}} onClick={()=>{setSelected(v);setNav("detail");}}>
                <Av name={v.name} size={36}/>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{v.name}</div><div style={{color:C.muted,fontSize:12}}>{v.vehicle} · {v.mileage.toLocaleString()} mi</div><div style={{color:C.muted,fontSize:11,fontFamily:"monospace"}}>{v.vin}</div></div>
                <span style={{background:v.alerts.length?C.red+"18":C.faint,color:v.alerts.length?C.red:C.muted,borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700}}>{v.alerts.length} alert{v.alerts.length!==1?"s":""}</span>
              </div>
            ))}
          </div>
        )}

        {nav==="alerts"&&(
          <div style={{padding:"26px 30px",maxWidth:800,animation:"fadeUp 0.25s ease"}}>
            <div style={{marginBottom:20}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:2}}>Alerts</div><div style={{color:C.muted,fontSize:13}}>{totalAlerts} active</div></div>
            {vehicles.filter(v=>v.alerts.length>0).map(v=>(
              <div key={v.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <Av name={v.name} size={32}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{v.name}</div><div style={{color:C.muted,fontSize:12}}>{v.vehicle} · {v.phone}</div></div>
                  <button style={S.btnPrimary} onClick={()=>{setSelected(v);setModal("alert");}}>Send Texts</button>
                </div>
                {v.alerts.map((a,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:6,background:LEVEL_COLOR[a.level]+"0D",marginBottom:4,border:`1px solid ${LEVEL_COLOR[a.level]}22`}}>
                    <span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span>
                    <span style={{fontSize:13,flex:1}}>{a.text}</span>
                    <Pill level={a.level}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {nav==="board"&&<Community user={user}/>}
        {nav==="messages"&&<Messages user={user} vehicles={vehicles} users={USERS}/>}

        {nav==="detail"&&selected&&(
          <div style={{padding:"26px 30px",maxWidth:800,animation:"fadeUp 0.25s ease"}}>
            <button onClick={()=>setNav("customers")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,padding:0}}>← Back</button>
            <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:22,flexWrap:"wrap"}}>
              <Av name={selected.name} size={50}/>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:1}}>{selected.name}</div>
                <div style={{color:C.muted,fontSize:13}}>{selected.vehicle} · {selected.phone}</div>
                <div style={{color:C.muted,fontSize:11,fontFamily:"monospace"}}>{selected.vin}</div>
              </div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <button style={S.btnSecondary} onClick={()=>{setShareTarget(selected);setModal("share");}}>🔗 Share</button>
                <button style={S.btnSecondary} onClick={()=>setModal("alert")}>📱 Alert</button>
                <button style={S.btnPrimary} onClick={()=>setModal("service")}>+ Service</button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
              <div style={S.card}><div style={S.cardTitle}>Vehicle Info</div>{[["Mileage",selected.mileage.toLocaleString()+" mi"],["Last Visit",selected.lastVisit]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{color:C.muted,fontSize:12}}>{l}</span><span style={{fontSize:13}}>{v}</span></div>)}</div>
              <div style={S.card}><div style={S.cardTitle}>Alerts</div>{selected.alerts.length===0&&<div style={{color:C.muted,fontSize:12}}>No alerts</div>}{selected.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:12}}>{a.text}</span></div>)}</div>
            </div>
            <div style={S.sectionTitle}>Service History</div>
            {selected.services.length===0&&<div style={{color:C.muted,fontSize:13}}>No services yet.</div>}
            {selected.services.map((s,i)=>(
              <div key={i} style={{...S.row,cursor:"default"}}>
                <div style={{width:30,height:30,borderRadius:7,background:C.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🔧</div>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{s.type}</div><div style={{color:C.muted,fontSize:12}}>{s.date} · {Number(s.mileage).toLocaleString()} mi{s.notes?" · "+s.notes:""}</div></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal==="vin"&&<VINModal onClose={()=>setModal(null)} onAdd={addVehicle}/>}

      {modal==="share"&&shareTarget&&(
        <div style={S.overlay}>
          <div style={{...S.modal,maxWidth:360}}>
            <div style={S.modalHead}><span style={S.modalTitle}>Share Profile</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
            <div style={{background:C.faint,borderRadius:8,padding:"10px 12px",marginBottom:14}}><div style={{fontWeight:600,fontSize:14}}>{shareTarget.vehicle}</div><div style={{color:C.muted,fontSize:12,marginTop:2}}>{shareTarget.name} · {shareTarget.phone}</div></div>
            <div style={{color:C.muted,fontSize:12,marginBottom:10}}>Sends the customer a secure link to view their full service history & alerts in GarageIQ.</div>
            <div style={{background:"#080808",borderRadius:6,padding:"8px 12px",fontFamily:"monospace",fontSize:11,color:C.muted,marginBottom:14,wordBreak:"break-all"}}>garageiq://vehicle/{shareTarget.id}</div>
            <div style={{display:"flex",gap:8}}>
              <button style={S.btnSecondary} onClick={()=>setModal(null)}>Cancel</button>
              <button style={{...S.btnPrimary,flex:1}} onClick={()=>setModal(null)}>📱 Send to Customer</button>
            </div>
          </div>
        </div>
      )}

      {modal==="service"&&selected&&(
        <div style={S.overlay}>
          <div style={{...S.modal,maxWidth:390}}>
            <div style={S.modalHead}><span style={S.modalTitle}>Log Service</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
            <div style={{color:C.muted,fontSize:12,marginBottom:14}}>{selected.vehicle} · {selected.name}</div>
            <label style={S.label}>Service Type</label>
            <select style={S.input} value={newSvc.type} onChange={e=>setNewSvc(p=>({...p,type:e.target.value}))}>{SERVICE_TYPES.map(t=><option key={t}>{t}</option>)}</select>
            <label style={S.label}>Date</label>
            <input style={S.input} type="date" value={newSvc.date} onChange={e=>setNewSvc(p=>({...p,date:e.target.value}))}/>
            <label style={S.label}>Mileage</label>
            <input style={S.input} type="number" placeholder="Current mileage" value={newSvc.mileage} onChange={e=>setNewSvc(p=>({...p,mileage:e.target.value}))}/>
            <label style={S.label}>Notes</label>
            <textarea style={{...S.input,height:56,resize:"none"}} value={newSvc.notes} onChange={e=>setNewSvc(p=>({...p,notes:e.target.value}))}/>
            <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setModal(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={logService}>Save</button></div>
          </div>
        </div>
      )}

      {modal==="alert"&&selected&&(
        <div style={S.overlay}>
          <div style={{...S.modal,maxWidth:380}}>
            <div style={S.modalHead}><span style={S.modalTitle}>Send Alert</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
            <div style={{color:C.muted,fontSize:12,marginBottom:14}}>📱 {selected.phone} · {selected.vehicle}</div>
            {selected.alerts.map((a,i)=>{const sent=alertSent.includes(selected.id+i); return(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:LEVEL_COLOR[a.level]+"10",border:`1px solid ${LEVEL_COLOR[a.level]}28`,borderRadius:8,padding:"10px 12px",marginBottom:8,gap:10}}>
                <div><Pill level={a.level}/><div style={{fontSize:13,marginTop:4}}>{a.text}</div>{sent&&<div style={{color:C.blue,fontSize:11,marginTop:3}}>✓ Sent</div>}</div>
                <button style={sent?{...S.btnSecondary,opacity:0.5}:S.btnPrimary} disabled={sent} onClick={()=>setAlertSent(p=>[...p,selected.id+i])}>{sent?"Sent":"Send"}</button>
              </div>
            );})}
            <button style={{...S.btnSecondary,marginTop:6}} onClick={()=>setModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  label:{display:"block",color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:1,marginBottom:5},
  input:{width:"100%",background:"#0A0A0C",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,marginBottom:12,outline:"none",fontFamily:"inherit"},
  btnPrimary:{background:C.accent,color:"#000",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0},
  btnSecondary:{background:C.faint,color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:13,flexShrink:0},
  sectionTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,letterSpacing:2,color:C.accent,marginBottom:10,marginTop:4},
  row:{display:"flex",alignItems:"center",gap:12,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",marginBottom:8},
  card:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"},
  cardTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,letterSpacing:1.5,color:C.accent,marginBottom:10},
  overlay:{position:"fixed",inset:0,background:"#00000099",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20},
  modal:{background:"#141417",border:`1px solid ${C.border}`,borderRadius:14,padding:22,width:"100%",maxHeight:"90vh",overflow:"auto",animation:"fadeUp 0.2s ease"},
  modalHead:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},
  modalTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:1,color:C.accent},
  iconBtn:{background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer"},
};
