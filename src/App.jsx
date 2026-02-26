import { useState, useMemo, useEffect } from "react";
import {
  AlertTriangle, CheckCircle2, CircleDot, RotateCcw, Loader2,
  Pencil, Trash2, X, FileText, CheckCheck, ArrowRight, Mail,
  Plus, ChevronDown, ChevronUp, Copy, Check, Eye,
} from "lucide-react";

const T = {
  bg:"#141418", surface:"#1E1E24", raised:"#28282F",
  border:"#40424D", borderSub:"#2A2A32",
  text:"#F4F1ED", sub:"#9DA2B3", muted:"#6E7180",
  lime:"#EEF3AD", limeBg:"#22260F", limeBdr:"#3D4220",
  danger:"#F97066", dangerBg:"#2D1A1A", dangerBdr:"#5C2424",
  warn:"#FDB022", warnBg:"#2D2214", warnBdr:"#5C3D10",
  success:"#6CE9A6", successBg:"#122D1E", successBdr:"#1C5236",
  info:"#60A5FA", infoBg:"#131E30", infoBdr:"#1C3558",
};
const F = "'Manrope', sans-serif";

const STATUSES = {
  suggested:    { label:"Requested",   c:T.warn,    bg:T.warnBg,    bdr:T.warnBdr,    Icon:CircleDot    },
  approved:     { label:"Approved",    c:T.info,    bg:T.infoBg,    bdr:T.infoBdr,    Icon:CheckCircle2 },
  "in-progress":{ label:"In Progress", c:T.lime,    bg:T.limeBg,    bdr:T.limeBdr,    Icon:Loader2      },
  implemented:  { label:"Built",       c:T.success, bg:T.successBg, bdr:T.successBdr, Icon:CheckCheck   },
  verified:     { label:"Live",        c:T.success, bg:T.successBg, bdr:T.successBdr, Icon:CheckCircle2 },
  reversed:     { label:"Reversed",    c:T.danger,  bg:T.dangerBg,  bdr:T.dangerBdr,  Icon:RotateCcw    },
};

const OPEN_STATUSES = ["suggested","approved","in-progress"];
const DONE_STATUSES = ["implemented","verified","reversed"];
const CATS = ["Booking Flow","SEO","CRM / HubSpot","Landing Pages","Analytics","Design","Performance","Other"];
const uid  = () => Math.random().toString(36).slice(2, 9);
const fmt  = d => d ? new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "---";

const VENDORS_DEFAULT = [
  {id:"v1",name:"Captive Demand",  role:"Web Development",                type:"internal"},
  {id:"v2",name:"Lacie Randall",   role:"CMO, Agentis Longevity",         type:"client"},
  {id:"v3",name:"Rachel Scott",    role:"Chief of Staff, Agentis",        type:"client"},
  {id:"v4",name:"Wingman Media",   role:"Paid Advertising Agency",        type:"agency"},
  {id:"v5",name:"SmartBug",        role:"SEO and Content Agency",         type:"agency"},
  {id:"v6",name:"Cody Beck",       role:"Director of Ops, Mantality",     type:"client"},
  {id:"v7",name:"Sang Tang",       role:"Strategist, Wingman Media",      type:"agency"},
  {id:"v8",name:"Brett Riggio",    role:"Account Exec, Wingman Media",    type:"agency"},
  {id:"v9",name:"Julia Yates",     role:"Agentis Longevity",              type:"client"},
];

const PROJECTS_DEFAULT = [
  {id:"p1",name:"Mantality Health",color:T.lime},
  {id:"p2",name:"Agentis",         color:T.info},
  {id:"p3",name:"Arete",           color:"#C084FC"},
];

const SEED = [
  {id:"c1",project:"p1",title:"Full website redesign - homepage, header and footer",description:"Conversion-focused redesign of Mantality Health's WordPress/Elementor site.",suggestedBy:"v2",approvedBy:"v2",implementedBy:"v1",status:"verified",category:"Design",dateSubmitted:"2025-12-19",dateImplemented:"2026-01-14",evidenceNote:"",conflictsWith:[],priority:"high"},
  {id:"c2",project:"p1",title:"Grant Captive Demand HubSpot Super Admin access",description:"Lacie initially invited Zachary to a Developer Sandbox. Rachel Scott granted Super Admin + Core seat on Jan 8.",suggestedBy:"v1",approvedBy:"v2",implementedBy:"v6",status:"verified",category:"CRM / HubSpot",dateSubmitted:"2025-12-19",dateImplemented:"2026-01-08",evidenceNote:"",conflictsWith:[],priority:"high"},
  {id:"c3",project:"p1",title:"Embed calendars in HubSpot landing pages (remove Cal.com redirect)",description:"Update HubSpot landing pages to embed booking calendars directly, removing Cal.com redirect.",suggestedBy:"v1",approvedBy:"v3",implementedBy:"v1",status:"in-progress",category:"Booking Flow",dateSubmitted:"2026-01-14",dateImplemented:null,evidenceNote:"",conflictsWith:[],priority:"high"},
  {id:"c4",project:"p1",title:"Cal.com drop-off tracking and drip workflow",description:"HubSpot workflow for users who reach booking page but do not complete. Trigger automated text/email drip.",suggestedBy:"v3",approvedBy:null,implementedBy:null,status:"approved",category:"CRM / HubSpot",dateSubmitted:"2026-01-08",dateImplemented:null,evidenceNote:"",conflictsWith:[],priority:"high"},
  {id:"c5",project:"p1",title:"Replace Liine auto-call with text + delayed sales call flow",description:"Replace immediate Liine auto-call with: instant text confirming receipt, sales call 30 min later.",suggestedBy:"v3",approvedBy:null,implementedBy:null,status:"approved",category:"CRM / HubSpot",dateSubmitted:"2026-01-08",dateImplemented:null,evidenceNote:"",conflictsWith:[],priority:"high"},
  {id:"c6",project:"p1",title:"Install scroll/header tracker on redesigned site",description:"Header scroll tracker installed for ad tracking per Wingman Media request.",suggestedBy:"v4",approvedBy:"v2",implementedBy:"v1",status:"verified",category:"Analytics",dateSubmitted:"2026-01-13",dateImplemented:"2026-01-14",evidenceNote:"",conflictsWith:[],priority:"medium"},
  {id:"c7",project:"p1",title:"Cloudflare US-only traffic filter (block bot traffic)",description:"Cloudflare geo-filter to allow US-only visitors. Heavy bot traffic flagged post-launch.",suggestedBy:"v7",approvedBy:null,implementedBy:null,status:"suggested",category:"Performance",dateSubmitted:"2026-01-15",dateImplemented:null,evidenceNote:"",conflictsWith:[],priority:"medium"},
  {id:"c8",project:"p1",title:"Fix mobile menu broken after redesign launch",description:"Mobile navigation not working after launch. Resolved same day via cache clear.",suggestedBy:"v6",approvedBy:"v6",implementedBy:"v1",status:"verified",category:"Design",dateSubmitted:"2026-01-14",dateImplemented:"2026-01-14",evidenceNote:"",conflictsWith:[],priority:"high"},
  {id:"c9",project:"p1",title:"Replace Calendly links with Cal.com on location pages",description:"Old Calendly links hardcoded in FAQ text on location pages - updated to Cal.com.",suggestedBy:"v3",approvedBy:"v3",implementedBy:"v1",status:"implemented",category:"Booking Flow",dateSubmitted:"2026-01-15",dateImplemented:"2026-01-15",evidenceNote:"",conflictsWith:[],priority:"high"},
  {id:"c10",project:"p1",title:"Audit old landing pages - unpublish, redirect, or keep",description:"URLs still active: /low-t-quiz/, /book-an-appointment/, /radio/. Core SEO pages must stay.",suggestedBy:"v7",approvedBy:null,implementedBy:null,status:"suggested",category:"SEO",dateSubmitted:"2026-01-15",dateImplemented:null,evidenceNote:"",conflictsWith:[],priority:"medium"},
  {id:"c11",project:"p1",title:"Provide content assets - patient videos, outcome data, clinic photos",description:"Patient testimonial videos, symptom improvement data, clinic photos needed.",suggestedBy:"v1",approvedBy:"v6",implementedBy:null,status:"suggested",category:"Design",dateSubmitted:"2026-01-02",dateImplemented:null,evidenceNote:"",conflictsWith:[],priority:"medium"},
];

// ── localStorage ──────────────────────────────────────────────────
const LS = { changes:"cd_changes", vendors:"cd_vendors", projects:"cd_projects", brief:"cd_brief" };
function loadLS(key, fallback) {
  try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; } catch { return fallback; }
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Helpers ───────────────────────────────────────────────────────
function extractJSON(raw) {
  if(!raw)return null;
  const c=raw.replace(/```json|```/gi,"").trim();
  try{const r=JSON.parse(c);if(Array.isArray(r))return r;}catch{}
  const s=c.indexOf("["),e2=c.lastIndexOf("]");
  if(s>-1&&e2>s){try{const r=JSON.parse(c.slice(s,e2+1));if(Array.isArray(r))return r;}catch{}}
  const objs=[];let depth=0,start=-1;
  for(let i=0;i<c.length;i++){
    if(c[i]==="{"){if(depth===0)start=i;depth++;}
    else if(c[i]==="}"){depth--;if(depth===0&&start>-1){try{objs.push(JSON.parse(c.slice(start,i+1)));}catch{}start=-1;}}
  }
  return objs.length?objs:null;
}

// ── Atoms ─────────────────────────────────────────────────────────
const Badge = ({status}) => {
  const s=STATUSES[status]||STATUSES.suggested;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:3,color:s.c,background:s.bg,border:"1px solid "+s.bdr,whiteSpace:"nowrap",letterSpacing:"0.04em",textTransform:"uppercase"}}><s.Icon size={9} strokeWidth={2.5}/>{s.label}</span>;
};
const Chip = ({name}) => name
  ?<span style={{fontSize:11,fontWeight:500,padding:"2px 9px",borderRadius:3,background:T.raised,color:T.sub,border:"1px solid "+T.border,whiteSpace:"nowrap"}}>{name}</span>
  :<span style={{color:T.muted,fontSize:11}}>—</span>;
const PTag = ({name,color}) => <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:3,background:color+"22",color,border:"1px solid "+color+"44",whiteSpace:"nowrap"}}>{name}</span>;
const Lbl = ({children}) => <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{children}</div>;
const HR = () => <div style={{height:1,background:T.borderSub}}/>;
const GhostBtn = ({onClick,children,danger}) => (
  <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:4,border:"1px solid "+(danger?T.dangerBdr:T.border),background:danger?T.dangerBg:T.raised,cursor:"pointer",fontSize:11,fontWeight:600,color:danger?T.danger:T.sub,fontFamily:F}}>
    {children}
  </button>
);

// ── Import Modal ──────────────────────────────────────────────────
function ImportModal({ onAdd, onClose }) {
  const [paste,setPaste]=useState("");
  const [step,setStep]=useState("input");
  const [parsed,setParsed]=useState(null);
  const [loading,setLoad]=useState(false);
  const [error,setError]=useState("");

  async function run() {
    if(!paste.trim())return;
    setLoad(true);setError("");setParsed(null);
    const SYS=`Extract website change requests from email content. Return ONLY a JSON array, no other text. Each item: {"title":"...","description":"...","suggestedBy":"name","projectName":"...","status":"suggested|approved|implemented|verified","category":"Booking Flow|SEO|CRM / HubSpot|Landing Pages|Analytics|Design|Performance|Other","dateSubmitted":"YYYY-MM-DD","evidenceNote":"key quote","priority":"high|medium|low"}`;
    try {
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3000,system:SYS,messages:[{role:"user",content:"Extract all website change requests:\n\n"+paste.slice(0,8000)}]})});
      const data=await res.json();
      const text=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text||"").join("\n");
      const arr=extractJSON(text);
      if(!arr||!arr.length)throw new Error("none");
      setParsed(arr);setStep("preview");
    } catch{setError("Could not extract requests. Make sure the text contains change requests.");}
    finally{setLoad(false);}
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:300,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 20px",overflowY:"auto"}} onClick={onClose}>
      <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:10,padding:26,width:"100%",maxWidth:540,boxShadow:"0 24px 64px rgba(0,0,0,0.5)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <div style={{fontWeight:800,fontSize:15,color:T.text,display:"flex",alignItems:"center",gap:8}}><Mail size={15} color={T.lime}/>Import from email</div>
            <div style={{fontSize:11,color:T.muted,marginTop:3}}>Paste email text and Claude will extract the requests</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:0}}><X size={16}/></button>
        </div>
        {step==="input"&&(<>
          <textarea value={paste} onChange={e=>setPaste(e.target.value)} placeholder="Paste email text here..." rows={8} style={{background:T.bg,border:"1px solid "+T.border,color:T.text,borderRadius:5,padding:"10px 12px",fontFamily:F,fontSize:12,outline:"none",width:"100%",boxSizing:"border-box",resize:"vertical",lineHeight:1.6}}/>
          {error&&<div style={{background:T.dangerBg,border:"1px solid "+T.dangerBdr,borderRadius:5,padding:"9px 11px",marginTop:10,fontSize:11,color:T.danger}}>{error}</div>}
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:12,gap:8}}>
            <GhostBtn onClick={onClose}>Cancel</GhostBtn>
            <button onClick={run} disabled={loading||!paste.trim()} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:5,border:"none",background:T.lime,cursor:(loading||!paste.trim())?"not-allowed":"pointer",fontSize:12,fontWeight:700,color:"#1a1d0a",fontFamily:F,opacity:(loading||!paste.trim())?0.5:1}}>
              {loading?"Extracting...":"Extract changes"}
            </button>
          </div>
        </>)}
        {step==="preview"&&parsed&&(<>
          <div style={{background:T.successBg,border:"1px solid "+T.successBdr,borderRadius:5,padding:"9px 12px",marginBottom:12,display:"flex",gap:7,alignItems:"center"}}>
            <CheckCircle2 size={13} color={T.success}/>
            <span style={{fontSize:12,color:T.success,fontWeight:600}}>Found {parsed.length} request{parsed.length>1?"s":""} — review before adding</span>
          </div>
          <div style={{maxHeight:240,overflowY:"auto",border:"1px solid "+T.border,borderRadius:6,marginBottom:14}}>
            {parsed.map((e,i)=>(
              <div key={i} style={{padding:"10px 13px",borderBottom:i<parsed.length-1?"1px solid "+T.borderSub:"none",background:i%2===0?T.surface:T.raised}}>
                <div style={{fontWeight:600,fontSize:12,color:T.text,marginBottom:5}}>{e.title}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Chip name={e.suggestedBy}/><Chip name={e.projectName}/><Badge status={e.status||"suggested"}/></div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <GhostBtn onClick={()=>{setStep("input");setParsed(null);}}>Back</GhostBtn>
            <button onClick={()=>onAdd(parsed)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:5,border:"none",background:T.lime,cursor:"pointer",fontSize:12,fontWeight:700,color:"#1a1d0a",fontFamily:F}}>
              <Plus size={12}/>Add all {parsed.length}
            </button>
          </div>
        </>)}
      </div>
    </div>
  );
}

// ── Form Modal ────────────────────────────────────────────────────
function FormModal({ editId, form, setForm, onSave, onClose, projects, vendors, changes }) {
  const inp={background:T.raised,border:"1px solid "+T.border,color:T.text,borderRadius:5,padding:"9px 11px",fontFamily:F,fontSize:12,outline:"none",width:"100%",boxSizing:"border-box"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:300,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 20px",overflowY:"auto"}} onClick={onClose}>
      <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:10,padding:26,width:"100%",maxWidth:580,boxShadow:"0 24px 64px rgba(0,0,0,0.5)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontWeight:800,fontSize:15,color:T.text}}>{editId?"Edit entry":"Log a change"}</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:0}}><X size={16}/></button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}><Lbl>Title *</Lbl><input style={inp} value={form.title} onChange={e=>setForm(v=>({...v,title:e.target.value}))} placeholder="What was requested?"/></div>
          <div><Lbl>Project</Lbl><select style={inp} value={form.project} onChange={e=>setForm(v=>({...v,project:e.target.value}))}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><Lbl>Category</Lbl><select style={inp} value={form.category} onChange={e=>setForm(v=>({...v,category:e.target.value}))}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div><Lbl>Requested by</Lbl><select style={inp} value={form.suggestedBy} onChange={e=>setForm(v=>({...v,suggestedBy:e.target.value}))}><option value="">Select...</option>{vendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
          <div><Lbl>Approved by</Lbl><select style={inp} value={form.approvedBy||""} onChange={e=>setForm(v=>({...v,approvedBy:e.target.value||null}))}><option value="">Select...</option>{vendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
          <div><Lbl>Built by</Lbl><select style={inp} value={form.implementedBy||""} onChange={e=>setForm(v=>({...v,implementedBy:e.target.value||null}))}><option value="">Select...</option>{vendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
          <div><Lbl>Status</Lbl><select style={inp} value={form.status} onChange={e=>setForm(v=>({...v,status:e.target.value}))}>{Object.entries(STATUSES).map(([k,s])=><option key={k} value={k}>{s.label}</option>)}</select></div>
          <div><Lbl>Date submitted</Lbl><input type="date" style={inp} value={form.dateSubmitted} onChange={e=>setForm(v=>({...v,dateSubmitted:e.target.value}))}/></div>
          <div><Lbl>Date completed</Lbl><input type="date" style={inp} value={form.dateImplemented||""} onChange={e=>setForm(v=>({...v,dateImplemented:e.target.value}))}/></div>
          <div style={{gridColumn:"span 2"}}><Lbl>What was asked for</Lbl><textarea style={{...inp,minHeight:64,resize:"vertical"}} value={form.description} onChange={e=>setForm(v=>({...v,description:e.target.value}))} placeholder="Full context of the request..."/></div>
          <div style={{gridColumn:"span 2"}}><Lbl>Evidence</Lbl><textarea style={{...inp,minHeight:60,resize:"vertical"}} value={form.evidenceNote} onChange={e=>setForm(v=>({...v,evidenceNote:e.target.value}))} placeholder="Paste the original email or message..."/></div>
          <div style={{gridColumn:"span 2"}}>
            <Lbl>Conflicts with</Lbl>
            <div style={{fontSize:11,color:T.muted,marginBottom:8}}>Check any requests this one contradicts or pulls against</div>
            <div style={{background:T.bg,border:"1px solid "+T.border,borderRadius:6,maxHeight:160,overflowY:"auto"}}>
              {changes.filter(c=>c.id!==editId).length===0
                ?<div style={{padding:"12px 14px",fontSize:11,color:T.muted}}>No other requests yet.</div>
                :changes.filter(c=>c.id!==editId).map((c,i,arr)=>{
                  const checked=(form.conflictsWith||[]).includes(c.id);
                  return (
                    <label key={c.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:i<arr.length-1?"1px solid "+T.borderSub:"none",background:checked?T.dangerBg:"transparent"}}>
                      <input type="checkbox" checked={checked} onChange={e=>{
                        const cur=form.conflictsWith||[];
                        setForm(v=>({...v,conflictsWith:e.target.checked?[...cur,c.id]:cur.filter(id=>id!==c.id)}));
                      }} style={{marginTop:2,accentColor:T.danger,flexShrink:0,cursor:"pointer"}}/>
                      <div>
                        <div style={{fontSize:12,fontWeight:checked?700:400,color:checked?T.danger:T.sub,lineHeight:1.5}}>{c.title}</div>
                        <div style={{fontSize:10,color:T.muted,marginTop:2}}>{c.status} · {c.category}</div>
                      </div>
                    </label>
                  );
                })
              }
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:18}}>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <button onClick={onSave} style={{padding:"8px 16px",borderRadius:5,border:"none",background:T.lime,cursor:"pointer",fontSize:12,fontWeight:700,color:"#1a1d0a",fontFamily:F}}>{editId?"Save changes":"Log change"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Client View ───────────────────────────────────────────────────
function ClientView({ changes, projects, vendors, conflictSet, brief }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [expanded, setExp] = useState(null);
  const pMap = Object.fromEntries(projects.map(p=>[p.id,p]));

  const open = [...changes].filter(c=>OPEN_STATUSES.includes(c.status)).sort((a,b)=>new Date(a.dateSubmitted)-new Date(b.dateSubmitted));
  const done = [...changes].filter(c=>DONE_STATUSES.includes(c.status)).sort((a,b)=>new Date(b.dateSubmitted)-new Date(a.dateSubmitted));

  const Card = ({c, last}) => {
    const isExp = expanded===c.id;
    const hasConflict = conflictSet.has(c.id);
    const proj = pMap[c.project];
    const conflictTitles = (c.conflictsWith||[]).map(cid=>changes.find(x=>x.id===cid)?.title).filter(Boolean);

    return (
      <div style={{borderBottom:last?"none":"1px solid "+T.borderSub}}>
        <div onClick={()=>setExp(isExp?null:c.id)} style={{padding:"16px 0",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:12}}>
          {/* conflict stripe */}
          <div style={{width:3,borderRadius:2,alignSelf:"stretch",background:hasConflict?T.danger:OPEN_STATUSES.includes(c.status)?T.border:"transparent",flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
              {hasConflict&&<AlertTriangle size={13} color={T.danger}/>}
              <span style={{fontWeight:700,fontSize:14,color:hasConflict?T.danger:T.text,lineHeight:1.4}}>{c.title}</span>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              {proj&&<PTag name={proj.name} color={proj.color}/>}
              <span style={{fontSize:11,color:T.muted}}>{c.category}</span>
              <span style={{fontSize:11,color:T.muted}}>Submitted {fmt(c.dateSubmitted)}</span>
            </div>
            {/* Conflict notice — always visible, no click required */}
            {hasConflict&&conflictTitles.length>0&&(
              <div style={{marginTop:10,display:"inline-flex",alignItems:"flex-start",gap:8,background:T.dangerBg,border:"1px solid "+T.dangerBdr,borderRadius:6,padding:"9px 13px"}}>
                <AlertTriangle size={12} color={T.danger} style={{marginTop:1,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:T.danger,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Conflicts with</div>
                  {conflictTitles.map((t,i)=><div key={i} style={{fontSize:12,color:T.danger,lineHeight:1.6}}>"{t}"</div>)}
                </div>
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <Badge status={c.status}/>
            {isExp?<ChevronUp size={13} color={T.muted}/>:<ChevronDown size={13} color={T.muted}/>}
          </div>
        </div>
        {isExp&&(
          <div style={{paddingBottom:18,paddingLeft:15,paddingRight:4}} onClick={e=>e.stopPropagation()}>
            {c.description&&<div style={{fontSize:13,color:T.sub,lineHeight:1.8}}>{c.description}</div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{fontFamily:F,background:T.bg,color:T.text,minHeight:"100vh",fontSize:13,lineHeight:1.5}}>
      {/* Header */}
      <div style={{borderBottom:"1px solid "+T.border,padding:"24px 40px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:T.lime,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:5}}>Captive Demand</div>
          <div style={{fontSize:22,fontWeight:800,color:T.text,letterSpacing:"-0.02em"}}>Request Overview</div>
        </div>
        <div style={{display:"flex",gap:20}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Open</div>
            <div style={{fontSize:28,fontWeight:800,color:T.warn,lineHeight:1}}>{open.length}</div>
          </div>
          {conflictSet.size>0&&(
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Conflicts</div>
              <div style={{fontSize:28,fontWeight:800,color:T.danger,lineHeight:1}}>{conflictSet.size}</div>
            </div>
          )}
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Total</div>
            <div style={{fontSize:28,fontWeight:800,color:T.sub,lineHeight:1}}>{changes.length}</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"36px 40px"}}>

        {/* Note from Captive Demand */}
        {brief&&brief.trim()&&(
          <div style={{background:T.surface,borderLeft:"3px solid "+T.lime,borderRadius:8,padding:"20px 24px",marginBottom:36}}>
            <div style={{fontSize:10,fontWeight:700,color:T.lime,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Note from Captive Demand</div>
            <div style={{fontSize:14,color:T.sub,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{brief}</div>
          </div>
        )}

        {/* Open requests */}
        <div style={{marginBottom:40}}>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:17,fontWeight:800,color:T.text,marginBottom:4}}>Open Requests</div>
            <div style={{fontSize:12,color:T.muted}}>What has been asked for and hasn't been built yet — oldest first</div>
          </div>
          {open.length===0?(
            <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:8,padding:32,textAlign:"center",color:T.muted,fontSize:13}}>No open requests.</div>
          ):(
            <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:10,padding:"0 24px"}}>
              {open.map((c,i)=><Card key={c.id} c={c} last={i===open.length-1}/>)}
            </div>
          )}
        </div>

        {/* Completed */}
        {done.length>0&&(
          <div>
            <button onClick={()=>setShowCompleted(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",padding:"0 0 20px",fontFamily:F}}>
              <span style={{fontSize:14,fontWeight:700,color:T.muted}}>{showCompleted?"Hide":"Show"} completed</span>
              <span style={{fontSize:11,color:T.muted,background:T.raised,border:"1px solid "+T.border,borderRadius:10,padding:"2px 10px"}}>{done.length}</span>
              {showCompleted?<ChevronUp size={14} color={T.muted}/>:<ChevronDown size={14} color={T.muted}/>}
            </button>
            {showCompleted&&(
              <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:10,padding:"0 24px",opacity:0.6}}>
                {done.map((c,i)=><Card key={c.id} c={c} last={i===done.length-1}/>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────
export default function App() {
  const isClient = new URLSearchParams(window.location.search).get("view")==="client";

  const [tab,      setTab]  = useState("overview");
  const [changes,  setChgs] = useState(()=>loadLS(LS.changes,  SEED));
  const [vendors,  setVends]= useState(()=>loadLS(LS.vendors,  VENDORS_DEFAULT));
  const [projects, setProjs]= useState(()=>loadLS(LS.projects, PROJECTS_DEFAULT));
  const [expanded, setExp]  = useState(null);
  const [showForm, setSF]   = useState(false);
  const [editId,   setEId]  = useState(null);
  const [showImp,  setImp]  = useState(false);
  const [fProj,    setFP]   = useState("all");
  const [fStat,    setFS]   = useState("all");
  const [fVend,    setFV]   = useState("all");
  const [search,   setSrch] = useState("");
  const [brief,    setBrief]= useState(()=>loadLS(LS.brief,""));
  const [briefEdit,setBriefEdit]=useState(false);
  const [copied,   setCopied]=useState(false);

  useEffect(()=>saveLS(LS.changes,  changes),  [changes]);
  useEffect(()=>saveLS(LS.vendors,  vendors),  [vendors]);
  useEffect(()=>saveLS(LS.projects, projects), [projects]);
  useEffect(()=>saveLS(LS.brief,    brief),    [brief]);

  const blank={id:null,project:PROJECTS_DEFAULT[0].id,title:"",description:"",suggestedBy:"",approvedBy:"",implementedBy:"",status:"suggested",category:"Other",dateSubmitted:new Date().toISOString().slice(0,10),dateImplemented:"",evidenceNote:"",conflictsWith:[],priority:"medium"};
  const [form,setForm]=useState(blank);

  const vMap=useMemo(()=>Object.fromEntries(vendors.map(v=>[v.id,v])),[vendors]);
  const pMap=useMemo(()=>Object.fromEntries(projects.map(p=>[p.id,p])),[projects]);

  const conflictSet=useMemo(()=>{
    const s=new Set();
    changes.forEach(c=>{if(c.conflictsWith?.length){s.add(c.id);c.conflictsWith.forEach(id=>s.add(id));}});
    return s;
  },[changes]);

  const filtered=useMemo(()=>changes.filter(c=>{
    if(fProj!=="all"&&c.project!==fProj)return false;
    if(fStat!=="all"&&c.status!==fStat)return false;
    if(fVend!=="all"&&c.suggestedBy!==fVend)return false;
    const q=search.toLowerCase();
    if(q&&!c.title.toLowerCase().includes(q)&&!(c.description||"").toLowerCase().includes(q))return false;
    return true;
  }).sort((a,b)=>new Date(b.dateSubmitted)-new Date(a.dateSubmitted)),[changes,fProj,fStat,fVend,search]);

  function openAdd(){setForm({...blank});setEId(null);setSF(true);}
  function openEdit(ch){setForm({...ch,dateImplemented:ch.dateImplemented||""});setEId(ch.id);setSF(true);}
  function save(){
    if(!form.title.trim())return;
    if(editId)setChgs(cs=>cs.map(c=>c.id===editId?{...form,id:editId}:c));
    else setChgs(cs=>[{...form,id:uid()},...cs]);
    setSF(false);
  }
  function del(id){if(window.confirm("Remove this entry?")){setChgs(cs=>cs.filter(c=>c.id!==id));setExp(null);}}

  function addImported(arr){
    let cv=[...vendors],cp=[...projects];
    const nv=[],np=[],added=[];
    arr.forEach(e=>{
      let vId="";
      const sv=(e.suggestedBy||"").toLowerCase();
      const mv=cv.find(v=>sv&&(v.name.toLowerCase().includes(sv.split(" ")[0])||sv.includes(v.name.toLowerCase().split(" ")[0])));
      if(mv){vId=mv.id;}else if(e.suggestedBy){const nw={id:"v"+uid(),name:e.suggestedBy,role:"Imported",type:"agency"};nv.push(nw);cv=[...cv,nw];vId=nw.id;}
      let pId=projects[0].id;
      const pn=(e.projectName||"").toLowerCase();
      const mp=cp.find(p=>pn&&(p.name.toLowerCase().includes(pn.split(" ")[0])||pn.includes(p.name.toLowerCase().split(" ")[0])));
      if(mp){pId=mp.id;}else if(e.projectName&&e.projectName.length>2){const nw={id:"p"+uid(),name:e.projectName,color:T.info};np.push(nw);cp=[...cp,nw];pId=nw.id;}
      added.push({id:uid(),project:pId,title:e.title||"Untitled",description:e.description||"",suggestedBy:vId,approvedBy:null,implementedBy:null,status:e.status||"suggested",category:CATS.includes(e.category)?e.category:"Other",dateSubmitted:e.dateSubmitted||new Date().toISOString().slice(0,10),dateImplemented:null,evidenceNote:e.evidenceNote||"",conflictsWith:[],priority:e.priority||"medium"});
    });
    if(nv.length)setVends(vs=>[...vs,...nv]);
    if(np.length)setProjs(ps=>[...ps,...np]);
    setChgs(cs=>[...added,...cs]);
    setImp(false);
  }

  function copyLink(){
    navigator.clipboard.writeText(window.location.origin+"?view=client").then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});
  }

  const totalOpen=changes.filter(c=>OPEN_STATUSES.includes(c.status)).length;
  const totalConf=conflictSet.size;

  if(isClient){
    return <ClientView changes={changes} projects={projects} vendors={vendors} conflictSet={conflictSet} brief={brief}/>;
  }

  // ── Overview tab ──────────────────────────────────────────────
  const Overview = () => {
    const flags  =changes.filter(c=>conflictSet.has(c.id));
    const pending=changes.filter(c=>OPEN_STATUSES.includes(c.status));
    const recent =changes.filter(c=>DONE_STATUSES.includes(c.status)).slice(0,6);
    const goTo=id=>{setTab("log");setExp(id);};

    return (
      <div>
        {/* ── Client note editor ── */}
        <div style={{background:T.surface,border:"1px solid "+T.border,borderLeft:"3px solid "+T.lime,borderRadius:8,padding:"18px 20px",marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:T.lime,textTransform:"uppercase",letterSpacing:"0.1em"}}>Client Note</div>
              <div style={{fontSize:11,color:T.muted,marginTop:3}}>This appears at the top of the client view. Write whatever you want them to read first.</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={copyLink} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:5,border:"1px solid "+T.border,background:T.raised,cursor:"pointer",fontSize:11,fontWeight:600,color:copied?T.success:T.sub,fontFamily:F}}>
                {copied?<Check size={11}/>:<Copy size={11}/>}{copied?"Copied!":"Copy client link"}
              </button>
              <a href="?view=client" target="_blank" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:5,border:"1px solid "+T.border,background:T.raised,cursor:"pointer",fontSize:11,fontWeight:600,color:T.sub,fontFamily:F,textDecoration:"none"}}>
                <Eye size={11}/>Preview
              </a>
            </div>
          </div>
          {briefEdit ? (
            <div>
              <textarea
                autoFocus
                value={brief}
                onChange={e=>setBrief(e.target.value)}
                placeholder={"Write a note to your client here. For example:\n\n\"Before we kick off the next sprint, we want to flag something. You've asked us to build a drop-off tracking workflow and also to remove the Cal.com redirect — but these two things depend on each other. Let's get on a call and decide which direction we're going first.\""}
                rows={6}
                style={{background:T.bg,border:"1px solid "+T.limeBdr,color:T.text,borderRadius:6,padding:"12px 14px",fontFamily:F,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box",resize:"vertical",lineHeight:1.8,color:T.sub}}
              />
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:10,gap:8}}>
                <GhostBtn onClick={()=>setBriefEdit(false)}>Done</GhostBtn>
              </div>
            </div>
          ) : (
            <div
              onClick={()=>setBriefEdit(true)}
              style={{minHeight:52,padding:"10px 14px",background:T.bg,border:"1px solid "+(brief?T.border:T.borderSub),borderRadius:6,cursor:"text",fontSize:13,color:brief?T.sub:T.muted,lineHeight:1.8,whiteSpace:"pre-wrap"}}
            >
              {brief||"Click to write a note for your client..."}
            </div>
          )}
        </div>

        {/* Project cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
          {projects.map(proj=>{
            const pc=changes.filter(c=>c.project===proj.id);
            const done=pc.filter(c=>DONE_STATUSES.includes(c.status)).length;
            const pend=pc.filter(c=>OPEN_STATUSES.includes(c.status)).length;
            const disc=pc.filter(c=>conflictSet.has(c.id)).length;
            return (
              <div key={proj.id} onClick={()=>{setFP(proj.id);setTab("log");}} style={{background:T.surface,border:"1px solid "+T.border,borderTop:"3px solid "+proj.color,borderRadius:8,padding:"16px 18px",cursor:"pointer"}}>
                <div style={{fontWeight:700,fontSize:13,color:T.text,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  {proj.name}
                  {disc>0&&<span style={{fontSize:9,fontWeight:700,background:T.dangerBg,color:T.danger,border:"1px solid "+T.dangerBdr,borderRadius:3,padding:"2px 6px"}}>CONFLICT</span>}
                </div>
                <div style={{display:"flex",gap:16}}>
                  {[["Total",pc.length,T.sub],["Done",done,T.success],["Open",pend,T.warn],["Flags",disc,disc>0?T.danger:T.muted]].map(([lbl,num,col])=>(
                    <div key={lbl}><div style={{fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{lbl}</div><div style={{fontSize:21,fontWeight:800,color:col,lineHeight:1}}>{num}</div></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Conflict panel */}
        {flags.length>0&&(
          <div style={{background:T.dangerBg,border:"1px solid "+T.dangerBdr,borderRadius:8,padding:"14px 16px",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <AlertTriangle size={14} color={T.danger}/>
              <span style={{fontWeight:700,fontSize:12,color:T.danger}}>These requests conflict with each other</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {flags.map(c=>(
                <div key={c.id} onClick={()=>goTo(c.id)} style={{background:"#1a0d0d",border:"1px solid "+T.dangerBdr,borderRadius:6,padding:"10px 12px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                  <div><div style={{fontWeight:600,fontSize:11,color:T.text,marginBottom:4}}>{c.title.length>52?c.title.slice(0,52)+"...":c.title}</div><Chip name={vMap[c.suggestedBy]?.name}/></div>
                  <ArrowRight size={12} color={T.danger}/>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:8,padding:18}}>
            <div style={{fontWeight:700,fontSize:12,color:T.text,marginBottom:2}}>Waiting for action</div>
            <div style={{fontSize:11,color:T.muted,marginBottom:14}}>Not built yet</div>
            {pending.length===0?<div style={{color:T.muted,fontSize:12,padding:"14px 0",textAlign:"center"}}>All caught up.</div>
              :pending.map((c,i)=>(<div key={c.id}>{i>0&&<HR/>}<div onClick={()=>goTo(c.id)} style={{padding:"9px 0",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.title}</div><div style={{fontSize:10,color:T.muted,marginTop:2}}>{pMap[c.project]?.name} — {vMap[c.suggestedBy]?.name||"unknown"}</div></div><Badge status={c.status}/></div></div>))}
          </div>
          <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:8,padding:18}}>
            <div style={{fontWeight:700,fontSize:12,color:T.text,marginBottom:2}}>Recently completed</div>
            <div style={{fontSize:11,color:T.muted,marginBottom:14}}>What is live</div>
            {recent.length===0?<div style={{color:T.muted,fontSize:12,padding:"14px 0",textAlign:"center"}}>Nothing yet.</div>
              :recent.map((c,i)=>(<div key={c.id}>{i>0&&<HR/>}<div onClick={()=>goTo(c.id)} style={{padding:"9px 0",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.title}</div><div style={{fontSize:10,color:T.muted,marginTop:2}}>{pMap[c.project]?.name} — {fmt(c.dateImplemented)}</div></div><CheckCircle2 size={14} color={T.success}/></div></div>))}
          </div>
        </div>
      </div>
    );
  };

  // ── Log tab ───────────────────────────────────────────────────
  const Log = () => {
    const ss={background:T.surface,border:"1px solid "+T.border,color:T.sub,borderRadius:5,padding:"8px 10px",fontFamily:F,fontSize:11,outline:"none",cursor:"pointer"};
    return (
      <div>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSrch(e.target.value)} placeholder="Search changes..." style={{...ss,color:T.text,flex:"1 1 140px",minWidth:140}}/>
          <select value={fProj} onChange={e=>setFP(e.target.value)} style={ss}><option value="all">All projects</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select value={fStat} onChange={e=>setFS(e.target.value)} style={ss}><option value="all">All statuses</option>{Object.entries(STATUSES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>
          <select value={fVend} onChange={e=>setFV(e.target.value)} style={ss}><option value="all">Everyone</option>{vendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select>
        </div>
        {filtered.length===0?<div style={{textAlign:"center",color:T.muted,padding:"48px 0",fontSize:12}}>No results.</div>:(
          <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:8,overflow:"hidden"}}>
            {filtered.map((c,i)=>{
              const isOpen=expanded===c.id;
              const hasD=conflictSet.has(c.id);
              const proj=pMap[c.project];
              return (
                <div key={c.id}>
                  {i>0&&<HR/>}
                  <div onClick={()=>setExp(isOpen?null:c.id)} style={{padding:"13px 16px",cursor:"pointer",borderLeft:"3px solid "+(hasD?T.danger:isOpen?T.lime:"transparent"),background:isOpen?T.raised:hasD?"#1a0d0d":"transparent"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:12,color:T.text,display:"flex",gap:6,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>{hasD&&<AlertTriangle size={12} color={T.danger}/>}{c.title}</div>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>{proj&&<PTag name={proj.name} color={proj.color}/>}<span style={{fontSize:10,color:T.muted}}>{c.category}</span><span style={{fontSize:10,color:T.muted}}>{fmt(c.dateSubmitted)}</span>{c.dateImplemented&&<span style={{fontSize:10,color:T.success}}>Live {fmt(c.dateImplemented)}</span>}</div>
                      </div>
                      <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0}}><Chip name={vMap[c.suggestedBy]?.name}/><Badge status={c.status}/>{isOpen?<ChevronUp size={13} color={T.muted}/>:<ChevronDown size={13} color={T.muted}/>}</div>
                    </div>
                  </div>
                  {isOpen&&(
                    <div style={{padding:"16px 20px",borderTop:"1px solid "+T.borderSub,background:T.bg}} onClick={e=>e.stopPropagation()}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>{[["Requested by",c.suggestedBy],["Approved by",c.approvedBy],["Built by",c.implementedBy]].map(([lbl,vid])=>(<div key={lbl}><Lbl>{lbl}</Lbl><Chip name={vMap[vid]?.name}/></div>))}</div>
                      {c.description&&<div style={{marginBottom:12}}><Lbl>What was asked</Lbl><div style={{fontSize:12,color:T.sub,lineHeight:1.7}}>{c.description}</div></div>}
                      {c.evidenceNote&&(<div style={{background:T.raised,border:"1px solid "+T.border,borderRadius:6,padding:"10px 12px",marginBottom:12}}><div style={{display:"flex",gap:5,alignItems:"center",marginBottom:5}}><FileText size={10} color={T.muted}/><Lbl>Evidence</Lbl></div><div style={{fontSize:11,color:T.muted,lineHeight:1.7,fontStyle:"italic"}}>{c.evidenceNote}</div></div>)}
                      {c.conflictsWith?.length>0&&(<div style={{background:T.dangerBg,border:"1px solid "+T.dangerBdr,borderRadius:5,padding:"9px 11px",marginBottom:12}}><div style={{display:"flex",gap:5,alignItems:"center",color:T.danger,fontSize:11,fontWeight:600}}><AlertTriangle size={11}/>Contradicts: {c.conflictsWith.map(cid=>{const f=changes.find(x=>x.id===cid);return f?f.title.slice(0,45)+"...":""}).filter(Boolean).join(", ")}</div></div>)}
                      <div style={{display:"flex",gap:7}}><GhostBtn onClick={()=>openEdit(c)}><Pencil size={10}/>Edit</GhostBtn><GhostBtn danger onClick={()=>del(c.id)}><Trash2 size={10}/>Remove</GhostBtn></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ── Stakeholders tab ──────────────────────────────────────────
  const Stakeholders = () => (
    <div>
      <div style={{fontSize:12,color:T.muted,marginBottom:20,lineHeight:1.6}}>Everyone involved across your projects and what they have contributed.</div>
      {["client","internal","agency"].map(type=>{
        const group=vendors.filter(v=>v.type===type);
        if(!group.length)return null;
        const tc={client:{c:T.info,label:"Client"},internal:{c:T.lime,label:"Your Team"},agency:{c:"#C084FC",label:"Partner Agencies"}}[type];
        return (
          <div key={type} style={{marginBottom:28}}>
            <div style={{marginBottom:12}}><span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:3,background:tc.c+"22",color:tc.c,border:"1px solid "+tc.c+"44",textTransform:"uppercase",letterSpacing:"0.08em"}}>{tc.label}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {group.map(v=>{
                const req=changes.filter(ch=>ch.suggestedBy===v.id).length;
                const app=changes.filter(ch=>ch.approvedBy===v.id).length;
                const blt=changes.filter(ch=>ch.implementedBy===v.id).length;
                const pids=[...new Set(changes.filter(ch=>ch.suggestedBy===v.id||ch.approvedBy===v.id||ch.implementedBy===v.id).map(ch=>ch.project))];
                return (
                  <div key={v.id} style={{background:T.surface,border:"1px solid "+T.border,borderTop:"2px solid "+tc.c,borderRadius:8,padding:"15px 16px"}}>
                    <div style={{fontWeight:700,fontSize:13,color:T.text,marginBottom:2}}>{v.name}</div>
                    <div style={{fontSize:11,color:T.muted,marginBottom:10}}>{v.role}</div>
                    {pids.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{pids.map(pid=>{const p=pMap[pid];return p?<PTag key={pid} name={p.name} color={p.color}/>:null;})}</div>}
                    <div style={{display:"flex",gap:16,paddingTop:10,borderTop:"1px solid "+T.borderSub}}>
                      {[["Requested",req,T.warn],["Approved",app,T.info],["Built",blt,T.success]].map(([lbl,num,col])=>(<div key={lbl}><div style={{fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{lbl}</div><div style={{fontSize:20,fontWeight:800,color:num>0?col:T.muted}}>{num}</div></div>))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  const TABS=[{id:"overview",label:"Overview"},{id:"log",label:"Change Log"},{id:"stakeholders",label:"Stakeholders"}];
  const TITLES={overview:"Overview",log:"Change Log",stakeholders:"Stakeholders"};
  const SUBS={overview:"All projects at a glance",log:"Every request and decision — your paper trail",stakeholders:"Everyone involved and what they have contributed"};

  return (
    <div style={{fontFamily:F,background:T.bg,color:T.text,minHeight:"100vh",display:"flex",fontSize:13,lineHeight:1.5}}>
      <div style={{width:206,background:T.surface,borderRight:"1px solid "+T.border,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,height:"100vh",zIndex:50}}>
        <div style={{padding:"20px 16px 14px",borderBottom:"1px solid "+T.border}}>
          <div style={{fontSize:13,fontWeight:800,color:T.lime}}>Captive Demand</div>
          <div style={{fontSize:9,color:T.muted,marginTop:3,letterSpacing:"0.07em",textTransform:"uppercase"}}>Change Tracker</div>
        </div>
        <div style={{padding:"10px 14px",borderBottom:"1px solid "+T.borderSub,display:"flex",gap:14}}>
          {[["Open",totalOpen,T.warn],["Flags",totalConf,totalConf>0?T.danger:T.muted],["Total",changes.length,T.sub]].map(([lbl,num,col])=>(<div key={lbl}><div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{lbl}</div><div style={{fontSize:17,fontWeight:800,color:col}}>{num}</div></div>))}
        </div>
        <nav style={{padding:"6px 0",flex:1}}>
          {TABS.map(({id,label})=>{
            const active=tab===id;
            return (<button key={id} onClick={()=>setTab(id)} style={{display:"flex",alignItems:"center",width:"calc(100% - 12px)",margin:"1px 6px",padding:"9px 10px",border:"none",borderRadius:5,cursor:"pointer",fontSize:12,fontWeight:active?700:400,color:active?T.lime:T.muted,background:active?T.limeBg:"transparent",textAlign:"left",fontFamily:F}}>{label}{id==="log"&&conflictSet.size>0&&<span style={{marginLeft:"auto",fontSize:9,fontWeight:700,background:T.dangerBg,color:T.danger,border:"1px solid "+T.dangerBdr,borderRadius:3,padding:"1px 5px"}}>{conflictSet.size}</span>}</button>);
          })}
        </nav>
        <div style={{padding:"10px",borderTop:"1px solid "+T.border,display:"flex",flexDirection:"column",gap:6}}>
          <button onClick={()=>setImp(true)} style={{display:"flex",alignItems:"center",gap:7,width:"100%",padding:"8px 10px",borderRadius:5,border:"1px solid "+T.border,background:T.raised,cursor:"pointer",fontSize:11,fontWeight:500,color:T.sub,fontFamily:F}}><Mail size={12} color={T.lime}/>Import from email</button>
          <button onClick={openAdd} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,width:"100%",padding:"8px 10px",borderRadius:5,border:"none",background:T.lime,cursor:"pointer",fontSize:11,fontWeight:700,color:"#1a1d0a",fontFamily:F}}><Plus size={12}/>Log change</button>
        </div>
      </div>

      <div style={{marginLeft:206,flex:1,padding:"24px 28px",minHeight:"100vh",maxWidth:"calc(100vw - 206px)",boxSizing:"border-box"}}>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:19,fontWeight:800,color:T.text,letterSpacing:"-0.02em"}}>{TITLES[tab]}</div>
          <div style={{fontSize:11,color:T.muted,marginTop:3}}>{SUBS[tab]}</div>
        </div>
        {tab==="overview"    &&<Overview/>}
        {tab==="log"         &&<Log/>}
        {tab==="stakeholders"&&<Stakeholders/>}
      </div>

      {showForm&&<FormModal editId={editId} form={form} setForm={setForm} onSave={save} onClose={()=>setSF(false)} projects={projects} vendors={vendors} changes={changes}/>}
      {showImp&&<ImportModal onAdd={addImported} onClose={()=>setImp(false)}/>}
    </div>
  );
}
