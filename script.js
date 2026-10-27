(()=>{"use strict";const TOTAL=30,$=id=>document.getElementById(id);let level=1,pos=0,score=0,tasks=[],locked=false;
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1}function lcm(a,b){return a/gcd(a,b)*b}function red(n,d){let g=gcd(n,d);return{n:n/g,d:d/g}}function key(r){r=red(r.n,r.d);return r.n+"/"+r.d}
function F(n,d){let r=red(n,d);return `<span class="frac"><span class="num">${r.n}</span><span class="den">${r.d}</span></span>`}function V(r){r=red(r.n,r.d);if(r.d===1)return""+r.n;if(r.n>r.d){let w=Math.floor(r.n/r.d),m=r.n%r.d;return m?w+" "+F(m,r.d):""+w}return F(r.n,r.d)}function T(r){r=red(r.n,r.d);if(r.d===1)return""+r.n;if(r.n>r.d){let w=Math.floor(r.n/r.d),m=r.n%r.d;return m?w+" "+m+"/"+r.d:""+w}return r.n+"/"+r.d}
function pick(a){return a[Math.floor(Math.random()*a.length)]}function ri(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function parse(s){s=s.trim().replace(/\s+/g," ");let m=s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);if(m&&+m[3])return red((+m[1])*(+m[3])+(+m[2]),+m[3]);m=s.match(/^(\d+)\s*\/\s*(\d+)$/);if(m&&+m[2])return red(+m[1],+m[2]);if(/^\d+$/.test(s))return{n:+s,d:1};return null}
const pairsEasy=[[2,4],[3,6],[4,8],[5,10],[3,9],[4,12],[6,12]];
const pairsAK8=[[3,4],[2,3],[4,6],[4,8],[5,10],[6,9],[6,12],[5,6],[4,10],[8,12],[3,8],[5,8],[4,9],[5,12],[6,8],[7,10],[5,7],[6,7],[7,8],[7,9]];
function frac(d){return{n:ri(1,d-1),d}}
function calc(a,b,op){return op==="+"?red(a.n*b.d+b.n*a.d,a.d*b.d):red(a.n*b.d-b.n*a.d,a.d*b.d)}
function validSub(a,b){return a.n*b.d>b.n*a.d}
function make(level){
 let q={story:"",expr:"",choices:[]},a,b,op=pick(["+","−"]),p;
 if(level===1){let d=pick([3,4,5,6,8,10,12]);a=frac(d);b=frac(d);if(op==="−"&&!validSub(a,b))[a,b]=[b,a];if(a.n===b.n&&op==="−")a={n:Math.min(d-1,b.n+1),d};q.right=calc(a,b,op);q.expr=`${F(a.n,a.d)} ${op} ${F(b.n,b.d)}`;}
 else{p=pick(pairsAK8);a=frac(p[0]);b=frac(p[1]);if(op==="−"&&!validSub(a,b))[a,b]=[b,a];if(!validSub(a,b)&&op==="−"){op="+"}q.right=calc(a,b,op);q.expr=`${F(a.n,a.d)} ${op} ${F(b.n,b.d)}`;
 if(level===4){q.expr="";let av=V(a),bv=V(b);q.story=op==="+"?pick([
 `På förmiddagen går Ella ${av} km och på eftermiddagen ${bv} km. Hur långt går hon sammanlagt?`,
 `I en kanna finns ${av} liter saft. Sedan hälls ytterligare ${bv} liter i. Hur mycket saft finns i kannan nu?`,
 `Noah använder ${av} meter band till en sak och ${bv} meter till en annan. Hur mycket band använder han sammanlagt?`
 ]):pick([
 `En flaska innehåller ${av} liter vatten. ${bv} liter används. Hur mycket vatten är kvar?`,
 `Ett band är ${av} meter långt. ${bv} meter klipps bort. Hur mycket av bandet är kvar?`,
 `Mira har ${av} kg deg och använder ${bv} kg. Hur mycket deg har hon kvar?`
 ]);}}
 q.mgn=lcm(a.d,b.d);q.solution=`MGN är ${q.mgn}. ${F(a.n,a.d)} ${op} ${F(b.n,b.d)} = ${V(q.right)}.`;return q}
function build(){tasks=[];let seen=new Set(),tries=0;while(tasks.length<TOTAL&&tries<3000){tries++;let q=make(level),k=q.story+"|"+q.expr+"|"+key(q.right);if(!seen.has(k)){seen.add(k);tasks.push(q)}}while(tasks.length<TOTAL)tasks.push(make(level))}
function distract(q){let r=q.right,c=[red(r.n+1,r.d),red(Math.max(1,r.n-1),r.d),red(r.n,r.d+1),red(r.n+2,r.d)];let vals=[r,...c].filter((x,j,a)=>a.findIndex(y=>key(y)===key(x))===j).slice(0,4);while(vals.length<4)vals.push(red(r.n+vals.length,r.d+1));return vals.sort(()=>Math.random()-.5)}
function start(l){level=+l;pos=0;score=0;build();$("menu").classList.add("hidden");$("result").classList.add("hidden");$("game").classList.remove("hidden");render()}
function render(){locked=false;let q=tasks[pos];$("progress").textContent=`Uppgift ${pos+1} av ${TOTAL} · ${score} rätt`;$("bar").style.width=(pos/TOTAL*100)+"%";$("story").innerHTML=q.story;$("question").innerHTML=q.expr;$("feedback").className="feedback hidden";$("solution").innerHTML="";$("next").classList.add("hidden");$("choices").innerHTML="";$("answer").value="";$("answer").disabled=false;$("check").disabled=false;
 $("instruction").textContent=level===1?"Addera eller subtrahera bråk med samma nämnare.":level===2?"Addera eller subtrahera bråken. Hitta en gemensam nämnare.":level===3?"Addera eller subtrahera bråken och skriv ditt svar så enkelt som möjligt.":"Läs textuppgiften och avgör om du ska addera eller subtrahera.";
 let typed=level>=3;$("typed").classList.toggle("hidden",!typed);$("choices").classList.toggle("hidden",typed);if(!typed){distract(q).forEach(r=>{let b=document.createElement("button");b.innerHTML=V(r);b.onclick=()=>judge(r,b);$("choices").appendChild(b)})}else setTimeout(()=>$("answer").focus(),0)}
function judge(r){if(locked)return;locked=true;let q=tasks[pos],ok=key(r)===key(q.right);if(ok){score++;$("feedback").className="feedback ok";$("feedback").textContent="✅ Rätt!"}else{$("feedback").className="feedback bad";$("feedback").innerHTML=`❌ Inte riktigt. Rätt svar är ${V(q.right)}.`;$("solution").innerHTML=q.solution}$("answer").disabled=true;$("check").disabled=true;[...$("choices").children].forEach(b=>b.disabled=true);$("next").classList.remove("hidden")}
$("check").onclick=()=>{let r=parse($("answer").value);if(!r){$("feedback").className="feedback info";$("feedback").textContent="Skriv ett heltal, ett bråk eller blandad form.";return}judge(r)};
$("answer").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("check").click()}});
$("next").onclick=()=>{if(++pos===TOTAL){$("game").classList.add("hidden");$("result").classList.remove("hidden");$("score").textContent=`Du fick ${score} av ${TOTAL} rätt på nivå ${level}.`}else render()};
function home(){$("game").classList.add("hidden");$("result").classList.add("hidden");$("menu").classList.remove("hidden")}
document.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>start(b.dataset.l));$("home").onclick=home;$("choose").onclick=home;$("retry").onclick=()=>start(level);
})();