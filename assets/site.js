/* ====== Pousada La Luna — lógica compartida ====== */

/* >>> LINK DEL BOTÓN RESERVAR (confirmá el link completo) <<< */
const RESERVE_URL = "https://sbreserva.silbeck.com.br/lalunavillage";

const WHATS = "https://wa.me/554791724701";

/* ---- textos header/footer (PT / ES) ---- */
const LANGS = ["pt","es","en"];
const T = {
  oHotel:{pt:"O Hotel",es:"El Hotel",en:"The Hotel"},
  acom:{pt:"Acomodações",es:"Alojamiento",en:"Accommodations"},
  gal:{pt:"Galerias",es:"Galería",en:"Gallery"},
  dep:{pt:"Depoimentos",es:"Reseñas",en:"Reviews"},
  contato:{pt:"Contato",es:"Contacto",en:"Contact"},
  reservar:{pt:"Reserve agora",es:"Reservar ahora",en:"Book now"},
  ends:{pt:"Rua Maria Testoni, 136, Praia de Itajuba — Barra Velha, Santa Catarina, Brasil — CEP: 88390-000",
        es:"Rua Maria Testoni, 136, Praia de Itajuba — Barra Velha, Santa Catarina, Brasil — CP: 88390-000",
        en:"Rua Maria Testoni, 136, Praia de Itajuba — Barra Velha, Santa Catarina, Brazil — ZIP: 88390-000"}
};

const PAGES = [
  {href:"o-hotel.html", key:"oHotel", id:"o-hotel"},
  {href:"acomodacoes.html", key:"acom", id:"acomodacoes"},
  {href:"galerias.html", key:"gal", id:"galerias"},
  {href:"depoimentos.html", key:"dep", id:"depoimentos"},
];

function getLang(){ return localStorage.getItem("laluna_lang") || "pt"; }
function setLang(l){ localStorage.setItem("laluna_lang", l); applyLang(l); }

function buildHeader(){
  const page = document.body.dataset.page || "index";
  let links = PAGES.map(p=>`<a href="${p.href}" data-i18n="${p.key}" ${p.id===page?'class="active"':''}></a>`).join("");
  links += `<a class="nl-contato" href="contato.html" data-i18n="contato" ${page==='contato'?'class="active"':''}></a>`;
  return `
  <header class="site-header">
    <div class="wrap nav">
      <a class="brand" href="index.html"><img class="logo-blue" src="assets/img/logo-azul.webp" alt="Pousada La Luna"><img class="logo-white" src="assets/img/logo-blanco.png" alt="Pousada La Luna"></a>
      <button class="hamb" aria-label="Menu">☰</button>
      <nav class="nav-links">${links}</nav>
      <div class="nav-right">
        <a class="contato" href="contato.html" data-i18n="contato" ${page==='contato'?'style="opacity:1"':''}></a>
        <a class="btn-nav-reserve js-reserve" data-i18n="reservar"></a>
        <div class="lang" id="langBtn">
          <button data-l="pt">PT</button><button data-l="es">ES</button><button data-l="en">EN</button>
        </div>
        <select class="lang-select" id="langSelect" aria-label="Idioma / Language">
          <option value="pt">PT</option><option value="es">ES</option><option value="en">EN</option>
        </select>
      </div>
    </div>
  </header>`;
}

function buildFooter(){
  return `
  <footer class="site-footer">
    <div class="wrap foot-grid">
      <div>
        <h4>POUSADA LA LUNA</h4>
        <div class="cnpj">CNPJ: 04.238.256/0001-92</div>
        <div class="stars">★★★★☆</div>
        <div class="socials">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Instagram">◎</a>
          <a href="#" aria-label="TripAdvisor">✈</a>
        </div>
      </div>
      <div>
        <div class="foot-row">📞 +55 (47) 9172-4701</div>
        <div class="foot-row">💬 <a href="${WHATS}" target="_blank">WhatsApp: +55 (47) 9172-4701</a></div>
        <div class="foot-row">✉️ pousadalaluna1@gmail.com</div>
      </div>
      <div><div class="foot-row" data-i18n="ends"></div></div>
    </div>
    <div class="creditbar">Pousada La Luna © 2026</div>
  </footer>
  <a class="wa" href="${WHATS}" target="_blank" aria-label="WhatsApp">💬</a>`;
}

function applyLang(l){
  document.documentElement.lang = l==="pt" ? "pt-BR" : "es";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k=el.getAttribute("data-i18n"); if(T[k]) el.textContent=T[k][l];
  });
  document.querySelectorAll("[data-pt]").forEach(el=>{
    const v=el.getAttribute("data-"+l); if(v!==null) el.innerHTML=v;
  });
  document.querySelectorAll("#langBtn button").forEach(b=>b.classList.toggle("on", b.dataset.l===l));
  const sel=document.getElementById("langSelect"); if(sel) sel.value=l;
}

/* ---- carrusel hero ---- */
function initHero(){
  const hero=document.querySelector(".hero"); if(!hero) return;
  const slides=[...hero.querySelectorAll(".slide")];
  const dotsBox=hero.querySelector(".hero-dots");
  let idx=0;
  slides.forEach((s,i)=>{ s.style.backgroundImage=`url('${s.dataset.img}')`;
    const b=document.createElement("button"); if(i===0)b.className="on";
    b.onclick=()=>go(i); dotsBox.appendChild(b); });
  const dots=[...dotsBox.children];
  function go(n){ slides[idx].classList.remove("on"); dots[idx].classList.remove("on");
    idx=(n+slides.length)%slides.length;
    slides[idx].classList.add("on"); dots[idx].classList.add("on"); }
  slides[0].classList.add("on");
  hero.querySelector(".next").onclick=()=>go(idx+1);
  hero.querySelector(".prev").onclick=()=>go(idx-1);
  // deslizar con el dedo (touch)
  let x0=null;
  hero.addEventListener("touchstart",e=>{x0=e.changedTouches[0].clientX;},{passive:true});
  hero.addEventListener("touchend",e=>{
    if(x0===null)return;
    const dx=e.changedTouches[0].clientX-x0;
    if(Math.abs(dx)>45){ go(dx<0?idx+1:idx-1); }
    x0=null;
  },{passive:true});
  setInterval(()=>go(idx+1),6000);
}

/* ---- mini-carruseles de habitaciones (dinámico) ---- */
function initRoomCarousels(){
  document.querySelectorAll(".room-carousel").forEach(rc=>{
    const imgs=JSON.parse(rc.dataset.imgs||"[]");
    if(!imgs.length) return;
    imgs.forEach((src,i)=>{
      const d=document.createElement("div"); d.className="rc-img"+(i===0?" on":"");
      d.style.backgroundImage=`url('${src}')`; rc.appendChild(d);
    });
    const dotWrap=document.createElement("div"); dotWrap.className="rc-dots";
    imgs.forEach((_,i)=>{const s=document.createElement("i");if(i===0)s.className="on";dotWrap.appendChild(s);});
    rc.appendChild(dotWrap);
    const slides=[...rc.querySelectorAll(".rc-img")], dts=[...dotWrap.children]; let k=0;
    setInterval(()=>{ slides[k].classList.remove("on"); dts[k].classList.remove("on");
      k=(k+1)%slides.length; slides[k].classList.add("on"); dts[k].classList.add("on"); }, 3200+Math.random()*800);
  });
}

/* ---- galería masonry + filtros + lightbox ---- */
function initGallery(){
  const grid=document.getElementById("masonry"); if(!grid) return;
  const cells=[...grid.querySelectorAll(".cell")];
  const imgs=cells.map(c=>c.querySelector("img").getAttribute("src"));
  document.querySelectorAll(".gal-filters button").forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll(".gal-filters button").forEach(b=>b.classList.remove("on"));
      btn.classList.add("on");
      const cat=btn.dataset.cat;
      cells.forEach(c=>{ c.style.display = (cat==="all"||c.dataset.cat===cat) ? "" : "none"; });
    };
  });
  // lightbox
  const lb=document.getElementById("lb"), lbImg=lb.querySelector("img");
  let cur=0;
  function open(i){ cur=i; lbImg.src=imgs[cur]; lb.classList.add("open"); }
  function move(d){ cur=(cur+d+imgs.length)%imgs.length; lbImg.src=imgs[cur]; }
  cells.forEach((c,i)=>c.onclick=()=>open(i));
  lb.querySelector(".x").onclick=()=>lb.classList.remove("open");
  lb.querySelector(".p").onclick=()=>move(-1);
  lb.querySelector(".n").onclick=()=>move(1);
  lb.onclick=e=>{ if(e.target===lb) lb.classList.remove("open"); };
  document.addEventListener("keydown",e=>{ if(!lb.classList.contains("open"))return;
    if(e.key==="Escape")lb.classList.remove("open"); if(e.key==="ArrowRight")move(1); if(e.key==="ArrowLeft")move(-1); });
}

/* ---- reveal on scroll ---- */
function initReveal(){
  const els=[...document.querySelectorAll(".reveal")];
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce || !("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.08,rootMargin:"0px 0px -5% 0px"});
  els.forEach(el=>io.observe(el));
  // salvaguarda: si por algún motivo no se dispara, mostrar todo
  setTimeout(()=>els.forEach(e=>e.classList.add("in")),2500);
}

/* ---- init ---- */
document.addEventListener("DOMContentLoaded",()=>{
  const h=document.getElementById("site-header"); if(h) h.innerHTML=buildHeader();
  const f=document.getElementById("site-footer"); if(f) f.innerHTML=buildFooter();
  document.querySelectorAll(".js-reserve").forEach(b=>{ b.href=RESERVE_URL; b.target="_blank"; });
  const lb=document.getElementById("langBtn");
  if(lb) lb.querySelectorAll("button").forEach(b=>b.onclick=()=>setLang(b.dataset.l));
  const sel=document.getElementById("langSelect");
  if(sel) sel.onchange=()=>setLang(sel.value);
  const hb=document.querySelector(".hamb"); if(hb) hb.onclick=()=>{
    document.querySelector(".nav-links").classList.toggle("open");
    document.querySelector(".nav").classList.toggle("menu-open");
  };
  applyLang(getLang());
  initHero(); initRoomCarousels(); initGallery(); initReveal();
  // formularios -> Web3Forms
  document.querySelectorAll("form.web3form").forEach(fm=>fm.addEventListener("submit", async e=>{
    e.preventDefault();
    const L=getLang();
    const btn=fm.querySelector("button[type=submit]");
    const orig=btn?btn.textContent:"";
    if(btn){btn.disabled=true; btn.textContent = L==="en"?"Sending…":"Enviando…";}
    try{
      const res=await fetch("https://api.web3forms.com/submit",{method:"POST",body:new FormData(fm)});
      const data=await res.json();
      if(!data.success) throw new Error(data.message||"error");
      alert(L==="pt"?"Mensagem enviada! Em breve entraremos em contato."
          :L==="es"?"¡Mensaje enviado! Pronto nos pondremos en contacto."
          :"Message sent! We'll get back to you soon.");
      fm.reset();
    }catch(err){
      alert(L==="pt"?"Não foi possível enviar agora. Tente novamente ou escreva para pousadalaluna1@gmail.com"
          :L==="es"?"No se pudo enviar ahora. Probá de nuevo o escribí a pousadalaluna1@gmail.com"
          :"Couldn't send right now. Please try again or email pousadalaluna1@gmail.com");
    }finally{
      if(btn){btn.disabled=false; btn.textContent=orig;}
    }
  }));
});
