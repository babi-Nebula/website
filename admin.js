const sellersBody=document.querySelector("#sellerTableBody"), productsBody=document.querySelector("#productTableBody"), ordersBody=document.querySelector("#orderTableBody");
const feedback=document.querySelector("#adminFeedback"), productForm=document.querySelector("#adminProductForm"), rateInput=document.querySelector("#commissionRate"), spendInput=document.querySelector("#marketingSpend");
const protectedSections=[".admin-page-title",".admin-demo-note",".admin-metrics-section",".admin-workspace"];
const state={sellers:[],products:[],orders:[],settings:{commissionRate:10,marketingSpend:0}};
const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const amount=new Intl.NumberFormat("en-ET",{maximumFractionDigits:0}), dateFormat=new Intl.DateTimeFormat("en",{year:"numeric",month:"short",day:"numeric"}), money=(n)=>`ETB ${amount.format(Number(n)||0)}`;
setProtected(false);
function announce(text){feedback.textContent=text;feedback.hidden=false;window.setTimeout(()=>feedback.hidden=true,4000)}
function setProtected(visible){protectedSections.forEach(s=>document.querySelector(s).hidden=!visible);}
function ensureLogin(){
  const main=document.querySelector(".admin-main");
  const box=document.createElement("section");box.className="admin-login-card";box.innerHTML='<p class="eyebrow eyebrow-dark"><span></span> SECURE ADMIN ACCESS</p><h1>Sign in to manage ENQU MADE</h1><p>Use the admin password configured for this deployment.</p><form id="adminLoginForm"><label>Admin password<input type="password" name="password" autocomplete="current-password" required /></label><button class="button button-dark" type="submit">Sign in</button><p class="form-feedback" role="status" hidden></p></form>';
  main.prepend(box);setProtected(false);
  box.querySelector("form").addEventListener("submit",async e=>{e.preventDefault();const form=e.currentTarget,submit=form.querySelector("button"),msg=form.querySelector("p[role=status]");submit.disabled=true;try{await window.ENQUApi.request("/admin/login",{method:"POST",body:JSON.stringify({password:new FormData(form).get("password")})});box.remove();await initialize();}catch(error){msg.textContent=error.message;msg.hidden=false;}finally{submit.disabled=false;}});
}
function orderDate(o){const d=new Date(o.createdAt);return Number.isNaN(d.getTime())?null:d}
function render(){
 document.querySelector("#sellerNavCount").textContent=state.sellers.length;document.querySelector("#productNavCount").textContent=state.products.length;document.querySelector("#orderNavCount").textContent=state.orders.length;
 document.querySelector("#sellerCount").textContent=`${state.sellers.length} sellers`;document.querySelector("#productCount").textContent=`${state.products.length} products`;document.querySelector("#orderCount").textContent=`${state.orders.length} orders`;
 document.querySelector("#sellerEmpty").hidden=!!state.sellers.length;document.querySelector("#productEmpty").hidden=!!state.products.length;document.querySelector("#orderEmpty").hidden=!!state.orders.length;
 sellersBody.innerHTML=state.sellers.map(s=>`<tr><td><strong>${esc(s.businessName)}</strong><small>${esc(s.contactName)}</small><small>${esc(s.productName)} · ${money(s.productPrice)}</small></td><td><a class="table-link" href="mailto:${esc(s.email)}">${esc(s.email)}</a><small>${esc(s.phone)}</small></td><td>${esc(s.location)}, ${esc(s.country)}</td><td>${s.createdAt?dateFormat.format(new Date(s.createdAt)):"—"}</td><td><select data-seller-status="${esc(s.id)}"><option ${s.status==="Pending"?"selected":""}>Pending</option><option ${s.status==="Approved"?"selected":""}>Approved</option><option ${s.status==="Rejected"?"selected":""}>Rejected</option></select></td></tr>`).join("");
 productsBody.innerHTML=state.products.map(p=>`<tr><td><strong>${esc(p.name)}</strong><small>${esc(p.id)}</small></td><td>${esc(p.seller||p.maker)}</td><td>${esc(p.category)}</td><td>${money(p.price)}</td><td><select data-product-status="${esc(p.id)}"><option value="active" ${(p.status||"active")==="active"?"selected":""}>Active</option><option value="paused" ${p.status==="paused"?"selected":""}>Paused</option></select></td><td><button class="admin-remove-button" data-delete-product="${esc(p.id)}">Remove</button></td></tr>`).join("");
 ordersBody.innerHTML=state.orders.map(o=>`<tr><td><strong>${esc(o.id)}</strong></td><td>${esc(o.customer?.name)}<small>${esc(o.customer?.email)}</small></td><td>${(o.items||[]).map(i=>`${esc(i.name)} × ${Number(i.quantity)||1}`).join("<br>")||"—"}</td><td>${money(o.total)}</td><td>${orderDate(o)?dateFormat.format(orderDate(o)):"—"}</td><td><select data-order-status="${esc(o.id)}"><option ${o.status==="New"?"selected":""}>New</option><option ${o.status==="Processing"?"selected":""}>Processing</option><option ${o.status==="Completed"?"selected":""}>Completed</option><option ${o.status==="Cancelled"?"selected":""}>Cancelled</option></select></td></tr>`).join("");
 renderMetrics();
}
function renderMetrics(){
 const now=new Date(),start=new Date(now.getFullYear(),now.getMonth(),1),next=new Date(now.getFullYear(),now.getMonth()+1,1),prev=new Date(now.getFullYear(),now.getMonth()-1,1);
 const completed=state.orders.filter(o=>o.status==="Completed"),current=completed.filter(o=>orderDate(o)>=start&&orderDate(o)<next),past=completed.filter(o=>orderDate(o)>=prev&&orderDate(o)<start);
 const value=o=>Number(o.total)||0,gmv=current.reduce((s,o)=>s+value(o),0),currentEmails=new Set(current.map(o=>o.customer?.email).filter(Boolean)),allCounts=new Map();completed.forEach(o=>{const e=o.customer?.email;if(e)allCounts.set(e,(allCounts.get(e)||0)+1)});
 const firstTime=[...currentEmails].filter(e=>completed.filter(o=>o.customer?.email===e).every(o=>orderDate(o)>=start)).length,returning=[...currentEmails].filter(e=>(allCounts.get(e)||0)>1).length;
 const active=state.sellers.filter(s=>s.status==="Approved"&&state.products.some(p=>p.status==="active"&&(p.seller===s.businessName||p.maker===s.businessName))).length;
 const currentIncome=current.reduce((s,o)=>s+value(o),0),prevIncome=past.reduce((s,o)=>s+value(o),0),growth=prevIncome?`${((currentIncome-prevIncome)/prevIncome*100).toFixed(1)}%`:currentIncome?"New":"0%";
 const values={registeredSellers:state.sellers.length,activeSellers:active,monthlyTransactions:current.length,gmv:money(gmv),revenue:money(gmv*(Number(rateInput.value)||0)/100),cac:firstTime?money((Number(spendInput.value)||0)/firstTime):"—",retention:`${currentEmails.size?Math.round(returning/currentEmails.size*100):0}%`,averageOrder:money(current.length?gmv/current.length:0),sellerGrowth:growth};
 document.querySelectorAll("[data-metric]").forEach(el=>el.textContent=values[el.dataset.metric]??"—");
}
async function loadData(){
 [state.sellers,state.products,state.orders,state.settings]=await Promise.all(["/admin/sellers","/admin/products","/admin/orders","/admin/settings"].map(path=>window.ENQUApi.request(path)));
 rateInput.value=state.settings.commissionRate;spendInput.value=state.settings.marketingSpend;render();
}
async function initialize(){
  try{await window.ENQUApi.request("/admin/session");await loadData();setProtected(true);document.querySelector(".admin-local-status").innerHTML="<i aria-hidden=\"true\"></i> Connected";document.querySelector("#adminLogout").hidden=false;}
  catch(error){if(error.message.includes("expired")||error.message.includes("Sign in")){ensureLogin();return}ensureLogin();const msg=document.querySelector("#adminLoginForm p[role=status]");if(msg){msg.textContent=error.message;msg.hidden=false}}
}
document.querySelector("#adminDate").textContent=dateFormat.format(new Date());
document.querySelector("#saveMetricSettings").addEventListener("click",async()=>{try{state.settings=await window.ENQUApi.request("/admin/settings",{method:"PUT",body:JSON.stringify({commissionRate:Number(rateInput.value)||0,marketingSpend:Number(spendInput.value)||0})});renderMetrics();announce("Metric assumptions saved.");}catch(e){announce(e.message)}});
productForm.addEventListener("submit",async e=>{e.preventDefault();if(!productForm.reportValidity())return;const d=new FormData(productForm);try{await window.ENQUApi.request("/admin/products",{method:"POST",body:JSON.stringify(Object.fromEntries(d))});productForm.reset();await loadData();announce("Product added to the catalog.")}catch(error){announce(error.message)}});
document.addEventListener("change",async e=>{const t=e.target;if(!(t instanceof HTMLSelectElement))return;let path,body;if(t.matches("[data-seller-status]")){path=`/admin/sellers/${encodeURIComponent(t.dataset.sellerStatus)}`;body={status:t.value}}else if(t.matches("[data-product-status]")){path=`/admin/products/${encodeURIComponent(t.dataset.productStatus)}`;body={status:t.value}}else if(t.matches("[data-order-status]")){path=`/admin/orders/${encodeURIComponent(t.dataset.orderStatus)}`;body={status:t.value}}else return;try{await window.ENQUApi.request(path,{method:"PATCH",body:JSON.stringify(body)});await loadData();announce("Changes saved.")}catch(error){announce(error.message);await loadData()}});
document.addEventListener("click",async e=>{const b=e.target.closest("[data-delete-product]");if(!b)return;try{await window.ENQUApi.request(`/admin/products/${encodeURIComponent(b.dataset.deleteProduct)}`,{method:"DELETE"});await loadData();announce("Product removed.")}catch(error){announce(error.message)}});
initialize();
document.querySelector("#adminLogout").addEventListener("click",async()=>{try{await window.ENQUApi.request("/admin/logout",{method:"POST"})}finally{location.reload()}});
