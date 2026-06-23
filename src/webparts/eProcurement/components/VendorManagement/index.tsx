import { Eye } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import styles from '../EProcurement.module.scss';


export interface Vendor {
  id: string;
  name: string;
  category: string;
  state: string;
  contact: string;
  email: string;
  phone: string;
  turnover: string;
  score: number;
  date: string;
  status: "Approved" | "Pending" | "Under Review" | "Rejected";
  tin: string;
  rcNumber: string;
}

const CATEGORIES: string[] = ["IT Services","General Supplies","Consulting","Engineering","Security Services","Facility Management","Printing & Publishing","Legal Services","Healthcare","Construction","Transportation","Financial Services"];

const statusStyle = (s: Vendor["status"]): string => ({
  Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  "Under Review": "bg-blue-50 text-blue-700 border border-blue-200",
  Rejected: "bg-red-50 text-red-700 border border-red-200",
}[s] || "bg-gray-100 text-gray-600");

const scoreColor = (n: number): string => n >= 85 ? "#16a34a" : n >= 65 ? "#d97706" : "#dc2626";

interface IVendor {
  sampleVendors: Vendor[]; // Optional initial vendors data, can be fetched from an API or passed as props
}


const VendorManagement: React.FC<IVendor> = ({sampleVendors}) => {

    const [search, setSearch] = useState<string>("");
    const [statusF, setStatusF] = useState<string>("All");
    const [catF, setCatF] = useState<string>("All");
    const [page, setPage] = useState<number>(1);
    const [selected, setSelected] = useState<Vendor | null>(null);
    const PER_PAGE = 10;

    const ALL_VENDORS: Vendor[] = sampleVendors;


      const filtered = ALL_VENDORS.filter((v: Vendor) =>
        (statusF === "All" || v.status === statusF) &&
        (catF === "All" || v.category === catF) &&
        (v.name.toLowerCase().includes(search.toLowerCase()) || v.id.includes(search) || v.tin.includes(search) || v.state.toLowerCase().includes(search.toLowerCase()))
      );
      const pages = Math.ceil(filtered.length / PER_PAGE);
      const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="space-y-6">

        {/* Recent Requests Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Vendor Registrations</h3>
            <div className="flex gap-2">

              <div className="flex flex-wrap gap-3">
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="🔍  Search name, ID, TIN, state…"
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64 bg-white"/>
              <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="All">All Statuses</option>
                {["Approved","Pending","Under Review","Rejected"].map(s=><option key={s}>{s}</option>)}
              </select>
              <select value={catF} onChange={e=>{setCatF(e.target.value);setPage(1);}} className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="All">All Categories</option>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} records</span>
            </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">COMPANY NAME</th>
                  <th className="text-left py-3 px-4">CATEGORY</th>
                  <th className="text-left py-3 px-4">STATE</th>
                  <th className="text-left py-3 px-4">TIN</th>
                  <th className="text-left py-3 px-4">SCORE</th>
                  <th className="text-left py-3 px-4">STATUS</th>
                  <th className="text-left py-3 px-4">SUBMISSION DATE</th>
                  <th className="text-left py-3 px-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((request: any) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{request.id}</td>
                    <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 text-sm">{request.name}</p>
                    <p className="text-xs text-gray-400">{request.contact}</p>
                    </td>
                    <td className="py-3 px-4">{request.category}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{request.state}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{request.tin}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${request.score}%`, background: scoreColor(request.score) }}/>
                        </div>
                        <span className="font-bold text-xs" style={{ color: scoreColor(request.score) }}>{request.score}</span>
                      </div>
                    </td>
                  <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${statusStyle(request.status)}`}>{request.status}</span>
                  </td>
                  
                   <td className="px-4 py-3 font-mono text-xs text-gray-500">{request.date}</td>
                  
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 hover:bg-blue-100 rounded text-sm"
                        onClick={() => setSelected(request)}
                        >
                        <Eye className="w-4 h-4" /> 
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visible.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No vendors found</div>}
          </div>

          <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Page {page} of {pages} · {filtered.length} total vendors</p>
          <div className="flex gap-1">
            <button onClick={()=>setPage(1)} disabled={page===1} className="px-2 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50">«</button>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50">‹</button>
            {Array.from({length:Math.min(5,pages)},(_,i)=>{
              const p = page <= 3 ? i+1 : page+i-2;
              if(p<1||p>pages) return null;
              return <button key={p} onClick={()=>setPage(p)} className={`px-3 py-1 text-xs border rounded-lg ${p===page?"bg-green-700 text-white border-green-700":"border-gray-200 hover:bg-gray-50"}`}>{p}</button>;
            })}
            <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} className="px-3 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50">›</button>
            <button onClick={()=>setPage(pages)} disabled={page===pages} className="px-2 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50">»</button>
          </div>
          </div>

        </div>

        {selected && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4" onClick={()=>setSelected(null)}
            style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-800 to-green-600 px-6 py-4 flex items-start justify-between">
              <div>
                <p className="text-green-200 text-xs font-mono">{selected.id} · {selected.rcNumber}</p>
                <h3 className="text-white text-xl font-black serif mt-0.5">{selected.name}</h3>
                <p className="text-green-200 text-sm">{selected.category} · {selected.state}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className={`p-6 grid grid-cols-2 gap-3 ${styles['no-after']} ${styles['no-before']}`}>
              {[["TIN",selected.tin],["Contact",selected.contact],["Email",selected.email],["Phone",selected.phone],["Turnover",selected.turnover],["Registered",selected.date]].map(([k,v])=>(
                <div key={k} className="bg-gray-50 rounded-xl px-3 py-3">
                  <p className="text-xs text-gray-400 font-medium">{k}</p>
                  <p className="font-semibold text-gray-800 text-sm mt-0.5 break-all">{v}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex items-center justify-between">
              <span className={`text-sm px-3 py-2 rounded-full font-bold ${statusStyle(selected.status)}`}>{selected.status}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full" style={{ width:`${selected.score}%`, background: scoreColor(selected.score) }}/>
                </div>
                <span className="font-black text-lg" style={{ color: scoreColor(selected.score) }}>{selected.score}/100</span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>



    </main>
    );
}

export default VendorManagement;