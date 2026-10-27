(()=>{"use strict";
const TOTAL=30;let level=1,pos=0,points=0,qs=[];const E=id=>document.getElementById(id);
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1}
function lcm(a,b){return Math.abs(a*b)/gcd(a,b)}
function red(n,d){let g=gcd(n,d);return{n:n/g,d:d/g}}
function key(r){r=red(r.n,r.d);return r.n+"/"+r.d}
function F(n,d){return `<span class="frac"><span class="num">${n}</span><span class="den">${d}</span></span>`}
function V(r){r=red(r.n,r.d);if(r.n===0)return"0";if(r.d===1)return""+r.n;if(r.n>r.d){let w=Math.floor(r.n/r.d),m=r.n%r.d;return m?w+" "+F(m,r.d):""+w}return F(r.n,r.d)}
function calc(a,b,c,d,o){let L=lcm(b,d),x=a*(L/b),y=c*(L/d);return red(o==="+"?x+y:x-y,L)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function parseAnswer(s){
 s=s.trim().replace(",",".").replace(/\s+/g," ");
 let m=s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
 if(m){let w=+m[1],n=+m[2],d=+m[3];if(!d)return null;return red(w*d+n,d)}
 m=s.match(/^(\d+)\s*\/\s*(\d+)$/);if(m){let n=+m[1],d=+m[2];if(!d)return null;return red(n,d)}
 m=s.match(/^(\d+)$/);if(m)return {n:+m[1],d:1};return null
}
function make(ix){
 let a,b,c,d,o=Math.random()<.5?"+":"-",story="",isStory=false;
 if(level===1){b=d=pick([3,4,5,6,7,8,9,10,12]);a=1+Math.floor(Math.random()*(b-1));c=1+Math.floor(Math.random()*(d-1));if(o==="-"&&c>a)[a,c]=[c,a]}
 else if(level===2||level===3){[b,d]=pick([[2,4],[3,6],[4,8],[5,10],[6,12],[3,9],[4,12],[5,15],[6,15],[8,12]]);a=1+Math.floor(Math.random()*(b-1));c=1+Math.floor(Math.random()*(d-1));if(o==="-"&&calc(a,b,c,d,o).n<0){[a,c]=[c,a];[b,d]=[d,b]}}
 else{
  [b,d]=pick([[4,6],[6,8],[6,9],[8,12],[10,15],[9,12],[5,8],[7,10],[8,15],[12,15],[7,12],[10,12]]);
  a=1+Math.floor(Math.random()*(b-1));c=1+Math.floor(Math.random()*(d-1));
  if(o==="-"&&calc(a,b,c,d,o).n<0){[a,c]=[c,a];[b,d]=[d,b]}
  if(ix<18){isStory=true;let n=pick(["Maja","Leo","Sam","Nora","Ali","Ella"]);
   let contexts=[
    o==="+"?`${n} går ${a}/${b} km på morgonen och ${c}/${d} km senare. Hur långt går ${n} sammanlagt?`:`${n} har ${a}/${b} liter saft och använder ${c}/${d} liter. Hur mycket är kvar?`,
    o==="+"?`${n} läser ${a}/${b} av en bok på måndagen och ${c}/${d} av boken på tisdagen. Hur stor del av boken läser ${n} sammanlagt?`:`${n} har ${a}/${b} meter tyg och använder ${c}/${d} meter. Hur mycket tyg är kvar?`,
    o==="+"?`Till en maträtt används ${a}/${b} liter av en ingrediens och ${c}/${d} liter av en annan. Hur mycket används sammanlagt?`:`I en flaska finns ${a}/${b} liter. ${c}/${d} liter hälls upp. Hur mycket finns kvar?`
   ];story=pick(contexts)
  }
 }
 let right=calc(a,b,c,d,o),L=lcm(b,d),x=a*(L/b),y=c*(L/d),raw=o==="+"?x+y:x-y;
 let solution=b===d?`${F(a,b)} ${o} ${F(c,d)} = ${F(Math.abs(o==="+"?a+c:a-c),b)} = ${V(right)}`:`${F(a,b)} ${o} ${F(c,d)}. Gemensam nämnare är ${L}: ${F(x,L)} ${o} ${F(y,L)} = ${F(Math.abs(raw),L)} = ${V(right)}.`;
 let candidates=[right,red(Math.max(0,a+c),b+d),red(Math.max(0,raw+1),L),red(Math.max(0,raw-1),L)],seen=new Set(),opts=[];
 for(let r of candidates){let z=key(r);if(!seen.has(z)){seen.add(z);opts.push(r)}}
 while(opts.length<4){let r=red(Math.max(0,right.n+Math.floor(Math.random()*7)-3),right.d),z=key(r);if(!seen.has(z)){seen.add(z);opts.push(r)}}
 return{a,b,c,d,o,story,isStory,right,solution,opts:shuffle(opts.slice(0,4))}
}
function build(){qs=[];let used=new Set(),guard=0;while(qs.length<TOTAL&&guard++<2000){let q=make(qs.length),z=`${q.a}/${q.b}${q.o}${q.c}/${q.d}:${q.isStory}`;if(!used.has(z)){used.add(z);qs.push(q)}}}
function start(l){level=l;pos=0;points=0;build();E("menu").classList.add("hidden");E("result").classList.add("hidden");E("game").classList.remove("hidden");show()}
function show(){
 let q=qs[pos],free=level>=3;
 E("progress").textContent=`Uppgift ${pos+1} av ${TOTAL}`;E("score").textContent=`Rätt: ${points}`;E("fill").style.width=`${pos/TOTAL*100}%`;
 E("instruction").textContent=free?"Räkna ut svaret själv. Förkorta eller skriv i blandad form om det går.":"Förkorta svaret eller skriv i blandad form om det går.";
 E("story").textContent=q.story;
 E("question").innerHTML=(level===4&&q.isStory)?"":`${F(q.a,q.b)} ${q.o} ${F(q.c,q.d)}`;
 E("choices").innerHTML="";E("feedback").textContent="";E("solution").innerHTML="";E("next").classList.add("hidden");
 E("choices").classList.toggle("hidden",free);
 E("freeArea").classList.toggle("hidden",!free);
 if(free){E("freeAnswer").value="";E("freeAnswer").disabled=false;E("check").disabled=false;setTimeout(()=>E("freeAnswer").focus(),0)}
 else {q.opts.forEach(r=>{let b=document.createElement("button");b.className="answer";b.innerHTML=V(r);b.addEventListener("click",()=>checkChoice(key(r)));E("choices").appendChild(b)})}
}
function finish(correct,q){
 if(correct){points++;E("feedback").textContent="✅ Rätt!"}else{E("feedback").innerHTML=`❌ Rätt svar: ${V(q.right)}`;E("solution").innerHTML=(level===4&&q.isStory?`Här behövs ${q.o==="+"?"addition":"subtraktion"}. `:"")+q.solution}
 E("score").textContent=`Rätt: ${points}`;E("next").classList.remove("hidden")
}
function checkChoice(chosen){document.querySelectorAll(".answer").forEach(b=>b.disabled=true);let q=qs[pos];finish(chosen===key(q.right),q)}
function checkFree(){let q=qs[pos],r=parseAnswer(E("freeAnswer").value);if(!r){E("feedback").textContent="Skriv svaret som ett heltal, ett bråk eller i blandad form.";return}E("freeAnswer").disabled=true;E("check").disabled=true;finish(key(r)===key(q.right),q)}
function next(){if(++pos>=TOTAL){E("game").classList.add("hidden");E("result").classList.remove("hidden");E("final").textContent=`${points} av ${TOTAL} rätt`}else show()}
function home(){E("game").classList.add("hidden");E("result").classList.add("hidden");E("menu").classList.remove("hidden")}
document.querySelectorAll("[data-level]").forEach(b=>b.addEventListener("click",()=>start(+b.dataset.level)));
E("next").addEventListener("click",next);E("home").addEventListener("click",home);E("resultHome").addEventListener("click",home);E("again").addEventListener("click",()=>start(level));E("check").addEventListener("click",checkFree);
E("freeAnswer").addEventListener("keydown",e=>{if(e.key==="Enter"&&!E("check").disabled)checkFree()});
})();