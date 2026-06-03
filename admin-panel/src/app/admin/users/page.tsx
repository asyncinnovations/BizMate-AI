"use client";
import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import StatCards from "@/components/ui/StatCards";
import FilterBar, { SearchInput, SelectFilter } from "@/components/ui/FilterBar";

type UserStatus = "active"|"suspended"|"pending";

interface User {
  id:string; name:string; email:string; business:string; role:string;
  status:UserStatus; joined:string; lastLogin:string; plan:string;
}

const MOCK: User[] = [
  {id:"u001",name:"Hassan Al-Rashid",  email:"hassan@alrashid.ae",      business:"Al-Rashid Group",    role:"Owner",  status:"active",    joined:"Jan 12, 2025",lastLogin:"Today, 9:41 AM",  plan:"Enterprise"},
  {id:"u002",name:"Fatima Noor",       email:"fatima@brightfutures.ae",  business:"Bright Futures LLC", role:"Admin",  status:"active",    joined:"Feb 3, 2025", lastLogin:"Yesterday",        plan:"Pro"},
  {id:"u003",name:"Omar Khalid",       email:"omar@alnoor.ae",           business:"Al Noor Trading",    role:"Member", status:"active",    joined:"Mar 7, 2025", lastLogin:"Today, 8:12 AM",   plan:"Pro"},
  {id:"u004",name:"Sarah Mitchell",    email:"sarah@techflow.io",        business:"TechFlow Solutions", role:"Owner",  status:"suspended", joined:"Nov 20, 2024",lastLogin:"Apr 12",           plan:"Starter"},
  {id:"u005",name:"Ahmed Bin Salman",  email:"ahmed@salmangroup.ae",     business:"Salman Group",       role:"Owner",  status:"active",    joined:"Dec 1, 2024", lastLogin:"Today, 11:05 AM",  plan:"Enterprise"},
  {id:"u006",name:"Priya Sharma",      email:"priya@innovate.in",        business:"Innovate Hub",       role:"Admin",  status:"active",    joined:"Apr 1, 2025", lastLogin:"Yesterday",        plan:"Starter"},
  {id:"u007",name:"Khalid Al-Mansouri",email:"khalid@mansouri.ae",       business:"Al-Mansouri LLC",    role:"Owner",  status:"pending",   joined:"May 15, 2025",lastLogin:"Never",            plan:"Pro"},
  {id:"u008",name:"Reem Al-Zaabi",     email:"reem@zaabi.ae",            business:"Zaabi Enterprises",  role:"Member", status:"active",    joined:"Mar 22, 2025",lastLogin:"Today, 7:50 AM",   plan:"Pro"},
];

const STATUS_CFG: Record<UserStatus,{bg:string;color:string}> = {
  active:   {bg:"var(--green-dim)",  color:"var(--green)"},
  suspended:{bg:"var(--red-dim)",    color:"var(--red)"},
  pending:  {bg:"var(--amber-dim)",  color:"var(--amber)"},
};

const PLAN_CFG: Record<string,string> = {
  Starter:"#64748B", Pro:"#3B82F6", Enterprise:"var(--accent)",
};

const AVATAR_HUE = (id:string) => (id.charCodeAt(3)*41)%360;

function Avatar({name,id}:{name:string;id:string}) {
  const hue = AVATAR_HUE(id);
  return (
    <div style={{ width:32,height:32,borderRadius:"50%",flexShrink:0,
      background:`hsl(${hue},55%,90%)`,color:`hsl(${hue},55%,35%)`,
      display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:11,fontWeight:700,fontFamily:"var(--font-display)" }}>
      {name.split(" ").map(n=>n[0]).join("").slice(0,2)}
    </div>
  );
}

function StatusBadge({status}:{status:UserStatus}) {
  const c = STATUS_CFG[status];
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",
      borderRadius:100,fontSize:11,fontWeight:600,
      background:c.bg,color:c.color,whiteSpace:"nowrap" }}>
      <span style={{ width:5,height:5,borderRadius:"50%",background:c.color }}/>
      {status.charAt(0).toUpperCase()+status.slice(1)}
    </span>
  );
}

function PlanBadge({plan}:{plan:string}) {
  const c = PLAN_CFG[plan]??"#94A3B8";
  return (
    <span style={{ display:"inline-flex",alignItems:"center",padding:"3px 8px",
      borderRadius:100,fontSize:11,fontWeight:600,
      background:`${c}15`,color:c,border:`1px solid ${c}22` }}>
      {plan}
    </span>
  );
}

function ActionDots({user,onAction}:{user:User;onAction:(a:string,u:User)=>void}) {
  const [open,setOpen]=useState(false);
  const items = [
    {label:"View Profile",key:"view"},
    {label:"Reset Password",key:"reset"},
    {label:user.status==="suspended"?"Activate User":"Suspend User",key:user.status==="suspended"?"activate":"suspend",danger:user.status!=="suspended"},
    {label:"View Activity",key:"activity"},
  ];
  return (
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(v=>!v)}
        style={{width:28,height:28,borderRadius:7,border:`1.5px solid ${open?"var(--border-mid)":"transparent"}`,
          background:open?"var(--bg-hover)":"transparent",
          display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
          color:"var(--text-muted)",transition:"all 0.12s"}}
        onMouseEnter={e=>{e.currentTarget.style.background="var(--bg-hover)";e.currentTarget.style.borderColor="var(--border)";}}
        onMouseLeave={e=>{if(!open){e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent";}}}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="2.5" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="8" cy="13.5" r="1.3"/>
        </svg>
      </button>
      {open&&(<>
        <div style={{position:"fixed",inset:0,zIndex:40}} onClick={()=>setOpen(false)}/>
        <div style={{position:"absolute",right:0,top:32,width:170,borderRadius:10,zIndex:50,
          background:"var(--bg-panel)",border:"1.5px solid var(--border)",boxShadow:"var(--shadow-lg)",
          overflow:"hidden",animation:"scale-in 0.15s cubic-bezier(0.16,1,0.3,1)"}}>
          {items.map(a=>(
            <button key={a.key} onClick={()=>{onAction(a.key,user);setOpen(false);}}
              style={{width:"100%",padding:"8px 12px",textAlign:"left",fontSize:12.5,fontWeight:500,
                background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-body)",
                color:a.danger?"var(--red)":"var(--text-secondary)",transition:"background 0.1s"}}
              onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-hover)")}
              onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
              {a.label}
            </button>
          ))}
        </div>
      </>)}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [planF, setPlanF] = useState("all");

  const filtered = users.filter(u=>{
    const q=search.toLowerCase();
    return (!q||u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q)||u.business.toLowerCase().includes(q))
      && (statusF==="all"||u.status===statusF)
      && (planF==="all"||u.plan===planF);
  });

  const handleAction = (action:string, user:User) => {
    if(action==="suspend")  setUsers(us=>us.map(u=>u.id===user.id?{...u,status:"suspended" as UserStatus}:u));
    if(action==="activate") setUsers(us=>us.map(u=>u.id===user.id?{...u,status:"active" as UserStatus}:u));
  };

  const stats = {
    total:users.length,
    active:users.filter(u=>u.status==="active").length,
    suspended:users.filter(u=>u.status==="suspended").length,
    pending:users.filter(u=>u.status==="pending").length,
  };

  const UserIcon = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 18c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  const CheckIcon= () => <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  const BanIcon  = () => <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M4.5 4.5l11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  const ClockIcon= () => <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;

  return (
    <div className="page-enter">
      <PageHeader
        title="User Management"
        subtitle="Manage all users across registered businesses"
        action={
          <button className="btn btn-primary">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Invite User
          </button>
        }
      />

      <StatCards items={[
        {label:"Total Users",      value:stats.total,     color:"var(--blue)",   icon:<UserIcon/>,  trend:8.3},
        {label:"Active",           value:stats.active,    color:"var(--green)",  icon:<CheckIcon/>, sub:"Currently active"},
        {label:"Suspended",        value:stats.suspended, color:"var(--red)",    icon:<BanIcon/>,   sub:"Requires review"},
        {label:"Pending Verify",   value:stats.pending,   color:"var(--amber)",  icon:<ClockIcon/>, sub:"Awaiting verification"},
      ]}/>

      <FilterBar right={<span style={{fontSize:12,color:"var(--text-muted)"}}>{filtered.length} of {users.length} users</span>}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search users, email, business…"/>
        <SelectFilter value={statusF} onChange={setStatusF} options={[
          {label:"All Status",value:"all"},{label:"Active",value:"active"},
          {label:"Suspended",value:"suspended"},{label:"Pending",value:"pending"},
        ]}/>
        <SelectFilter value={planF} onChange={setPlanF} options={[
          {label:"All Plans",value:"all"},{label:"Starter",value:"Starter"},
          {label:"Pro",value:"Pro"},{label:"Enterprise",value:"Enterprise"},
        ]}/>
      </FilterBar>

      <div style={{background:"var(--bg-surface)",border:"1.5px solid var(--border)",
        borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow-sm)",overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table className="data-table">
            <thead>
              <tr>
                {["User","Business","Plan","Role","Status","Joined","Last Login",""].map(h=>(
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user=>(
                <tr key={user.id}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <Avatar name={user.name} id={user.id}/>
                      <div>
                        <div style={{fontWeight:600,fontSize:13,color:"var(--text-primary)",lineHeight:1.3}}>{user.name}</div>
                        <div style={{fontSize:11.5,color:"var(--text-muted)",lineHeight:1.3}}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{color:"var(--text-primary)",fontWeight:500}}>{user.business}</td>
                  <td><PlanBadge plan={user.plan}/></td>
                  <td style={{textTransform:"capitalize"}}>{user.role}</td>
                  <td><StatusBadge status={user.status}/></td>
                  <td style={{fontSize:12,color:"var(--text-muted)",whiteSpace:"nowrap"}}>{user.joined}</td>
                  <td style={{fontSize:12,color:"var(--text-muted)",whiteSpace:"nowrap"}}>{user.lastLogin}</td>
                  <td style={{textAlign:"right",paddingRight:10}}>
                    <ActionDots user={user} onAction={handleAction}/>
                  </td>
                </tr>
              ))}
              {filtered.length===0&&(
                <tr><td colSpan={8} style={{textAlign:"center",padding:"48px 0",color:"var(--text-muted)",fontSize:13}}>
                  No users match your filters.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination hint */}
        <div style={{padding:"10px 14px",borderTop:"1.5px solid var(--border)",display:"flex",
          justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:"var(--text-muted)"}}>
            Showing {filtered.length} of {users.length} users
          </span>
          <div style={{display:"flex",gap:4}}>
            {[1,2,3].map(p=>(
              <button key={p} style={{width:28,height:28,borderRadius:6,fontSize:12,fontWeight:p===1?600:400,
                border:`1.5px solid ${p===1?"var(--accent-border)":"var(--border)"}`,
                background:p===1?"var(--accent-dim)":"transparent",
                color:p===1?"var(--accent)":"var(--text-secondary)",cursor:"pointer"}}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
