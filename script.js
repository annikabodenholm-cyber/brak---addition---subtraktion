(()=>{"use strict";
const TOTAL=30;let level=1,pos=0,points=0,qs=[];const E=id=>document.getElementById(id);
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1}
function lcm(a,b){return Math.abs(a*b)/gcd(a,b)}
function red(n,d){let g=gcd(n,d);return{n:n/g,d:d/g}}
function k(r){r=red(r.n,r.d);return r.n+"/"+r.d}
function F(n,d){return `<span class="frac"><span class="num">${n}</span><span class="den">${d}</span></span>`}
function V(r){r=red(r.n,r.d);if(r.n===0)return"0";if(r.d===1)return""+r.n;if(r.n>r.d){let h=Math.floor(r.n/r.d),m=r.n%r.d;return m?h+" "+F(m,r.d):""+h}return F(r.n,r.d)}
function calc(a,b,c,d,o){let L=lcm(b,d),x=a*(L/b),y=c*(L/d);return red(o==="+"?x+y:x-y,L)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function make(ix){let a,b,c,d,o=Math.random()<.5?"+":"-",story="";
 if(level===1){b=d=pick([3,4,5,6,7,8,9,10,12]);a=1+Math.floor(Math.random()*(b-1));c=1+Math.floor(Math.random()*(d-1));if(o==="-"&&c>a)[a,c]=[c,a]}
 else if(level===2){[b,d]=pick([[2,4],[3,6],[4,8],[5,10],[6,12],[3,9],[4,12],[5,15],[6,15],[8,12]]);a=1+Math.floor(Math.random()*(b-1));c=1+Math.floor(Math.random()*(d-1));if(o==="-"&&calc(a,b,c,d,o).n<0){[a,c]=[c,a];[b,d]=[d,b]}}
 else{[b,d]=pick([[4,6],[6,8],[6,9],[8,12],[10,15],[9,12],[5,8],[7,10],[8,15],[12,15]]);a=1+Math.floor(Math.random()*(b-1));c=1+Math.floor(Math.random()*(d-1));if(o==="-"&&calc(a,b,c,d,o).n<0){[a,c]=[c,a];[b,d]=[d,b]}if(ix<15){let name=pick(["Maja","Leo","Sam","Nora","Ali","Ella"]);story=o==="+"?`${name} använder ${a}/${b} liter färg och sedan ${c}/${d} liter till. Hur mycket används sammanlagt?`:`${name} har ${a}/${b} meter band och använder ${c}/${d} meter. Hur mycket är kvar?`}}
 let right=calc(a,b,c,d,o),L=lcm(b,d),x=a*(L/b),y=c*(L/d),raw=o==="+"?x+y:x-y;
 let solution=b===d?`${F(a,b)} ${o} ${F(c,d)} = ${F(Math.abs(o==="+"?a+c:a-c),b)} = ${V(right)}`:`Gemensam nämnare är ${L}. ${F(a,b)} = ${F(x,L)} och ${F(c,d)} = ${F(y,L)}. Då blir svaret ${F(Math.abs(raw),L)} = ${V(right)}.`;
 let cand=[right,red(Math.max(0,a+c),b+d),red(Math.max(0,raw+1),L),red(Math.max(0,raw-1),L),red(Math.max(0,a*d+(o==="+"?c*b:-c*b)),b*d)],seen=new Set(),opts=[];
 for(let r of cand){let z=k(r);if(!seen.has(z)){seen.add(z);opts.push(r)}}while(opts.length<4){let r=red(Math.max(0,right.n+Math.floor(Math.random()*7)-3),right.d),z=k(r);if(!seen.has(z)){seen.add(z);opts.push(r)}}
 return{a,b,c,d,o,story,right,solution,opts:shuffle(opts.slice(0,4))}
}
function build(){qs=[];let used=new Set(),guard=0;while(qs.length<TOTAL&&guard++<1500){let q=make(qs.length),z=`${q.a}/${q.b}${q.o}${q.c}/${q.d}`;if(!used.has(z)){used.add(z);qs.push(q)}}}
function start(l){level=l;pos=0;points=0;build();E("menu").classList.add("hidden");E("result").classList.add("hidden");E("game").classList.remove("hidden");show()}
function show(){let q=qs[pos];E("progress").textContent=`Uppgift ${pos+1} av ${TOTAL}`;E("score").textContent=`Rätt: ${points}`;E("fill").style.width=`${pos/TOTAL*100}%`;E("story").textContent=q.story;E("question").innerHTML=`${F(q.a,q.b)} ${q.o} ${F(q.c,q.d)}`;E("answers").innerHTML="";E("feedback").textContent="";E("solution").innerHTML="";E("next").classList.add("hidden");q.opts.forEach(r=>{let b=document.createElement("button");b.className="answer";b.innerHTML=V(r);b.addEventListener("click",()=>check(k(r)));E("answers").appendChild(b)})}
function check(chosen){document.querySelectorAll(".answer").forEach(b=>b.disabled=true);let q=qs[pos];if(chosen===k(q.right)){points++;E("feedback").textContent="✅ Rätt!"}else{E("feedback").innerHTML=`❌ Rätt svar: ${V(q.right)}`;E("solution").innerHTML=q.solution}E("score").textContent=`Rätt: ${points}`;E("next").classList.remove("hidden")}
function next(){if(++pos>=TOTAL){E("game").classList.add("hidden");E("result").classList.remove("hidden");E("final").textContent=`${points} av ${TOTAL} rätt`}else show()}
function home(){E("game").classList.add("hidden");E("result").classList.add("hidden");E("menu").classList.remove("hidden")}
document.querySelectorAll("[data-level]").forEach(b=>b.addEventListener("click",()=>start(+b.dataset.level)));E("next").addEventListener("click",next);E("home").addEventListener("click",home);E("resultHome").addEventListener("click",home);E("again").addEventListener("click",()=>start(level));
})();