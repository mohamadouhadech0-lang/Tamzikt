(()=>{
const {LETTERS,WORDS,CATS,AUDIO}=window.DATA;
const $=(s,r=document)=>r.querySelector(s);
const view=$("#view");
const store={get(k,d){try{const v=localStorage.getItem("amz:"+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem("amz:"+k,JSON.stringify(v))}catch(e){}}};
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
const stats=()=>store.get("stats",{points:0,best:0,played:0});
const paintPts=()=>{$("#pts").textContent=stats().points};
const setStatus=t=>{const s=$("#status");if(s)s.textContent=t};

/* ================= الصوت =================
   الترتيب: 1) ملف صوتي audio/<letters|words>/<slug>.mp3 (أو الحقل audio)
            2) نطق آلي SpeechSynthesis بصوت عربي يقرأ كتابة عربية تقريبية مولَّدة من اللاتينية */
const FN={"ḍ":"d2","ṛ":"r2","ṣ":"s2","ṭ":"t2","ẓ":"z2","ḥ":"h2","ɣ":"gh","ɛ":"aa"};
const slug=s=>[...s.normalize("NFC").toLowerCase()].map(c=>FN[c]||c).join("").replace(/[^a-z0-9]/g,"");
const M=Object.fromEntries(Object.entries({b:"ب",c:"ش",d:"د","ḍ":"ض",f:"ف",g:"ج",h:"ه","ḥ":"ح","ɛ":"ع",x:"خ",q:"ق",j:"ج",k:"ك",l:"ل",m:"م",n:"ن",r:"ر","ṛ":"ر","ɣ":"غ",s:"س","ṣ":"ص",t:"ت","ṭ":"ط",w:"و",y:"ي",z:"ز","ẓ":"ظ"}).map(([k,v])=>[k.normalize("NFC"),v]));
const D={a:"\u064E",i:"\u0650",u:"\u064F"},SH="\u0651",SK="\u0652";
function arabize(s,single){
  const out=[];let prev=null;
  for(const c of s.normalize("NFC").toLowerCase()){
    if(c==="e"||c==="ə")continue;
    if("aiu".includes(c)){
      if(prev&&!prev.v&&prev.c!==" ")prev.v=c;
      else{prev={c:c==="i"?"إ":"أ",v:c};out.push(prev)}
      continue;
    }
    if(c===" "){out.push({c:" "});prev=null;continue}
    const L=M[c];if(!L)continue;
    if(prev&&prev.c===L&&!prev.v&&!prev.sh){prev.sh=true;continue}
    prev={c:L};out.push(prev);
  }
  if(single&&out.length===1&&!out[0].v)out[0].v="a";
  return out.map(u=>u.c===" "?" ":u.c+(u.sh?SH:"")+(u.v?D[u.v]:u.sh?"":SK)).join("")||"أَ";
}
let voices=[],cur=null;const tried={};
const loadVoices=()=>{try{voices=speechSynthesis.getVoices()}catch(e){}};
if("speechSynthesis" in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}
const arVoice=()=>voices.find(v=>/^ar-EG/i.test(v.lang))||voices.find(v=>/^ar/i.test(v.lang));
function stop(){if(cur){cur.pause();cur=null}try{speechSynthesis.cancel()}catch(e){}}
function tts(item,kind,slow){
  if(!("speechSynthesis" in window)){setStatus("متصفحك لا يدعم النطق الصوتي. جرّب Chrome أو Safari.");return}
  const v=arVoice();
  const u=new SpeechSynthesisUtterance(v?arabize(item.ph||item.lat,kind==="letters"):item.lat);
  if(v){u.voice=v;u.lang=v.lang}else u.lang="es-ES";
  u.rate=slow?0.5:0.8;
  speechSynthesis.cancel();speechSynthesis.speak(u);
  setStatus(v?"🗣 نطق آلي تقريبي: "+item.lat:"لا يوجد صوت عربي في جهازك، النطق تقريبي جدًا: "+item.lat);
}
function say(item,kind,slow){
  if(!item||!store.get("sound",true))return;
  stop();
  const file=item.audio||AUDIO.dir+kind+"/"+slug(item.lat)+AUDIO.ext;
  if(tried[file]===false)return tts(item,kind,slow);
  const a=new Audio(file);cur=a;a.playbackRate=slow?0.7:1;
  let fell=false;
  const fb=()=>{if(fell)return;fell=true;tried[file]=false;tts(item,kind,slow)};
  a.onerror=fb;
  a.onplaying=()=>{tried[file]=true;setStatus("🔊 "+item.lat)};
  a.play().catch(fb);
}
let qNow=null;
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-say]");if(!b)return;
  const [t,i]=b.dataset.say.split(":");
  const r=t==="letters"?[LETTERS[i],"letters"]:t==="words"?[WORDS[i],"words"]:t==="ex"?[LETTERS[i].ex,"words"]:qNow&&[qNow.item,qNow.kind];
  if(r)say(r[0],r[1],"slow" in b.dataset);
});
const snd=$("#snd");
snd.setAttribute("aria-pressed",store.get("sound",true));
snd.onclick=()=>{const on=!store.get("sound",true);store.set("sound",on);snd.setAttribute("aria-pressed",on);if(!on)stop();setStatus(on?"الصوت مفعّل.":"الصوت متوقف.")};

/* ---------- الحروف ---------- */
function letters(){
  let sel=0,typed=[];
  view.innerHTML=`<div class="split"><div class="panel" id="det"></div><div>
    <div class="panel compose"><div class="out tif" id="out"></div><button class="btn alt" id="bk" aria-label="حذف">⌫</button><button class="btn alt" id="clr">مسح</button><div class="lat" id="tr"></div></div>
    <div class="grid">${LETTERS.map((l,i)=>`<button class="key tif" data-i="${i}" data-say="letters:${i}" aria-label="${l.lat}">${l.t}</button>`).join("")}</div></div></div>`;
  const draw=()=>{
    const l=LETTERS[sel];
    $("#det").innerHTML=`<div class="big tif">${l.t}</div><div class="pair"><div><small>لاتينية</small><b class="lat">${l.lat}</b></div><div><small>عربية</small><b>${l.ar}</b></div></div>
      <div class="speak"><button class="btn" data-say="letters:${sel}">🔊 استمع</button><button class="btn alt" data-say="letters:${sel}" data-slow>🐢 ببطء</button></div>
      <div class="ex">${l.ex?`مثال: <span class="tif">${l.ex.t}</span> <span class="lat">${l.ex.lat}</span> — ${l.ex.ar} <button class="icon" data-say="ex:${sel}" aria-label="استمع للمثال">🔊</button>`:"لا يوجد مثال لهذا الحرف بعد."}</div>`;
    view.querySelectorAll(".key").forEach((k,i)=>k.classList.toggle("on",i===sel));
    $("#out").textContent=typed.map(i=>LETTERS[i].t).join("");
    $("#tr").textContent=typed.map(i=>LETTERS[i].lat).join(" ");
  };
  view.onclick=e=>{
    const k=e.target.closest(".key");
    if(k){sel=+k.dataset.i;typed.push(sel);draw()}
    else if(e.target.closest("#bk")){typed.pop();draw()}
    else if(e.target.closest("#clr")){typed=[];draw()}
  };
  draw();
}

/* ---------- الكلمات ---------- */
function words(){
  let cat="all",q="";
  view.onclick=null;
  view.innerHTML=`<input class="search" id="q" type="search" placeholder="ابحث بالأمازيغية أو اللاتينية أو العربية"><div class="chips" id="chips"></div><div class="list" id="list"></div>`;
  const draw=()=>{
    $("#chips").innerHTML=[["all","الكل"],...Object.entries(CATS)].map(([k,v])=>`<button class="chip" data-c="${k}" aria-pressed="${k===cat}">${v}</button>`).join("");
    const n=q.trim().toLowerCase();
    const r=WORDS.filter(w=>(cat==="all"||w.cat===cat)&&(!n||w.t.includes(n)||w.lat.toLowerCase().includes(n)||w.ar.includes(n)));
    $("#list").innerHTML=r.length?r.map(w=>{const i=WORDS.indexOf(w);return `<div class="w"><button class="wmain" data-say="words:${i}"><div class="t tif">${w.t}</div><div class="l lat">${w.lat}</div><div class="a">${w.ar}</div></button><button class="icon" data-say="words:${i}" data-slow aria-label="نطق بطيء">🐢</button></div>`}).join(""):`<p class="mute">لا توجد نتائج.</p>`;
  };
  $("#q").oninput=e=>{q=e.target.value;draw()};
  $("#chips").onclick=e=>{const c=e.target.closest(".chip");if(c){cat=c.dataset.c;draw()}};
  draw();
}

/* ---------- الاختبارات ---------- */
function makeQs(mode){
  const pool=[];
  if(mode!=="words")LETTERS.forEach(l=>pool.push({item:l,kind:"letters",big:l.t,ask:"ما نطق هذا الحرف؟",ans:l.lat,all:LETTERS.map(x=>x.lat)}));
  if(mode!=="letters")WORDS.forEach(w=>pool.push({item:w,kind:"words",big:w.t,sub:w.lat,ask:"ما معنى هذه الكلمة؟",ans:w.ar,all:WORDS.map(x=>x.ar)}));
  return shuffle(pool).slice(0,10);
}
function quiz(){
  const s=stats();
  view.innerHTML=`<div class="panel center"><h2>اختر نوع الاختبار</h2><p class="mute">نقاطك: ${s.points} · أفضل نتيجة: ${s.best}/10 · اختبارات مكتملة: ${s.played}</p>
    <div class="opts"><button class="btn" data-m="letters">الحروف</button><button class="btn" data-m="words">الكلمات</button><button class="btn" data-m="mixed">مختلط</button></div></div>`;
  view.onclick=e=>{const b=e.target.closest("[data-m]");if(b)run(b.dataset.m)};
}
function run(mode){
  const qs=makeQs(mode);let i=0,score=0,streak=0,gained=0;
  const show=()=>{
    if(i>=qs.length)return end();
    const q=qs[i];qNow=q;
    const opts=shuffle([q.ans,...shuffle([...new Set(q.all)].filter(x=>x!==q.ans)).slice(0,3)]);
    view.innerHTML=`<div class="panel"><div class="bar"><i style="width:${i/qs.length*100}%"></i></div>
      <p class="mute">سؤال ${i+1} من ${qs.length} · سلسلة: ${streak}</p><p>${q.ask}</p><div class="big tif">${q.big}</div>
      ${q.sub?`<div class="sub lat">${q.sub}</div>`:""}<button class="icon qsay" data-say="q" aria-label="استمع للسؤال">🔊</button>
      <div class="opts">${opts.map(o=>`<button class="opt">${o}</button>`).join("")}</div></div>`;
    say(q.item,q.kind);
    let locked=false;
    view.onclick=e=>{
      const b=e.target.closest(".opt");if(!b||locked)return;locked=true;
      const ok=b.textContent===q.ans;
      if(ok){gained+=10+2*Math.min(streak,5);score++;streak++}else streak=0;
      b.classList.add(ok?"ok":"bad");
      if(!ok)[...view.querySelectorAll(".opt")].find(x=>x.textContent===q.ans).classList.add("ok");
      say(q.item,q.kind);
      setTimeout(()=>{i++;show()},1600);
    };
  };
  const end=()=>{
    const s=stats();s.points+=gained;s.played++;s.best=Math.max(s.best,score);store.set("stats",s);paintPts();
    view.innerHTML=`<div class="panel center"><div class="score">${score}/${qs.length}</div><p>ربحت ${gained} نقطة</p><button class="btn" id="again">اختبار جديد</button></div>`;
    view.onclick=e=>{if(e.target.closest("#again"))quiz()};
  };
  show();
}

const views={letters,words,quiz};
$("#tabs").onclick=e=>{
  const b=e.target.closest("button");if(!b)return;
  stop();
  document.querySelectorAll("#tabs button").forEach(x=>x.setAttribute("aria-selected",x===b));
  views[b.dataset.t]();
};
window.AmzAudio={say,arabize,slug};
paintPts();letters();
})();
