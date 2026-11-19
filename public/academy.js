'use strict';
/* Springy Academy: separate module from legacy ESP32 and simulation. */
(() => {
const el=id=>document.getElementById(id);
const PI=Math.PI;
const fmt=(v,n=3)=>Number(v.toFixed(n)).toString().replace('.',',');
const topicNames={spring:'Con lắc lò xo',kinematics:'Li độ · vận tốc · gia tốc',energy:'Năng lượng',period:'Chu kỳ · tần số',damping:'Dao động tắt dần'};
const questions=[];let qid=0;
function add(topic,type,difficulty,question,answer,explanation,unit='',choices=null,hint=''){questions.push({id:'shm-'+(++qid),topic,type,difficulty,question,answer,explanation,unit,choices,hint});}
function mcq(topic,difficulty,question,answer,options,explanation,hint){add(topic,'mcq',difficulty,question,String(answer),explanation,'',options,hint);}
function short(topic,difficulty,question,answer,unit,explanation,hint){add(topic,'short',difficulty,question,answer,explanation,unit,null,hint);}
// All values are calculated from symbolic relations: no fabricated experiments.
for(const m of [50,100,200,250,400]){
 const k= m===50?20:m===100?40:m===200?50:m===250?100:160;
 const omega=Math.sqrt(k/(m/1000)),T=2*PI/omega;
 short('spring','easy',`Một con lắc lò xo có m = ${m} g, k = ${k} N/m. Tính tần số góc ω (rad/s), làm tròn 2 chữ số thập phân.`,Number(omega.toFixed(2)),'rad/s',`Đổi m = ${fmt(m/1000,3)} kg. ω = √(k/m) = √(${k}/${fmt(m/1000,3)}) = ${fmt(omega,2)} rad/s.`,'Dùng ω = √(k/m), nhớ đổi g sang kg.');
 short('period','medium',`Con lắc lò xo có m = ${m} g và k = ${k} N/m. Chu kỳ T bằng bao nhiêu giây? Làm tròn 3 chữ số thập phân.`,Number(T.toFixed(3)),'s',`T = 2π√(m/k) = 2π√(${fmt(m/1000,3)}/${k}) ≈ ${fmt(T,3)} s.`,'T = 2π√(m/k).');
 const opts=[T, T*2,T/2, T*Math.sqrt(2)].map(v=>`${fmt(v,3)} s`);
 mcq('period','easy',`Vật có m = ${m} g, k = ${k} N/m. Chu kỳ gần nhất là giá trị nào?`,0,opts,`T = 2π√(m/k) = ${fmt(T,3)} s.`,'Đổi m ra kg rồi tính T.');
}
for(const A of [2,4,5,8,10]){
 const w= [5,10,4,8,20][[2,4,5,8,10].indexOf(A)];
 mcq('kinematics','medium',`Dao động x = ${A}cos(${w}t) cm. Vận tốc cực đại có độ lớn bằng bao nhiêu?`,0,[`${A*w} cm/s`,`${A*w*w} cm/s`,`${A} cm/s`,`${w} cm/s`],`v_max = ωA = ${w} × ${A} = ${A*w} cm/s.`,'Dùng v_max = Aω, không nhầm với gia tốc cực đại.');
 short('kinematics','medium',`Dao động x = ${A}cos(${w}t) cm. Tính độ lớn gia tốc cực đại a_max (cm/s²).`,A*w*w,'cm/s²',`a_max = ω²A = ${w}² × ${A} = ${A*w*w} cm/s².`,'a_max = ω²A.');
 mcq('kinematics','easy',`Dao động x = ${A}cos(${w}t) cm. Biên độ là bao nhiêu?`,0,[`${A} cm`,`${w} cm`,`${A*w} cm`,`${A/2} cm`],`Trong x = Acos(ωt + φ), biên độ là hệ số trước cos: A = ${A} cm.`,'Đọc hệ số trước hàm cos.');
}
for(const [m,k,A] of [[.1,40,.05],[.2,50,.04],[.25,100,.02],[.05,20,.1],[.4,160,.03]]){
 const E=.5*k*A*A;
 short('energy','medium',`Con lắc có k = ${k} N/m, biên độ A = ${Math.round(A*100)} cm. Tính cơ năng E (J).`,Number(E.toFixed(5)),'J',`Đổi A = ${fmt(A,3)} m. E = 1/2·kA² = 0,5 × ${k} × ${fmt(A,3)}² = ${fmt(E,5)} J.`,'Cơ năng E = kA²/2, nhớ đổi cm sang m.');
 mcq('energy','medium',`Nếu biên độ tăng gấp đôi mà k không đổi thì cơ năng dao động thay đổi thế nào?`,2,['Tăng 2 lần','Không đổi','Tăng 4 lần','Giảm 2 lần'],`E = kA²/2 nên khi A → 2A, E → 4E.`,'Cơ năng tỉ lệ với bình phương biên độ.');
 mcq('energy','easy',`Ở vị trí biên của con lắc lò xo lý tưởng có biên độ ${Math.round(A*100)} cm, động năng bằng bao nhiêu?`,1,[`${fmt(E,3)} J`,'0 J',`${fmt(E/2,3)} J`,'Không xác định'],`Tại vị trí biên, vận tốc v = 0 nên động năng bằng 0.`,'Tại biên, vật có vận tốc bao nhiêu?');
}
for(const factor of [2,3,4,9,16]){
 const ratio=Math.sqrt(factor);
 mcq('period','medium',`Giữ độ cứng lò xo không đổi. Nếu khối lượng tăng ${factor} lần thì chu kỳ thay đổi thế nào?`,0,[`Tăng ${fmt(ratio,3)} lần`,`Tăng ${factor} lần`,`Giảm ${fmt(ratio,3)} lần`,'Không đổi'],`T ∝ √m ⇒ T'/T = √${factor} = ${fmt(ratio,3)}.`,'Chu kỳ tỉ lệ căn bậc hai khối lượng.');
 short('period','medium',`Chu kỳ ban đầu T = 0,8 s. Giữ k không đổi, tăng khối lượng ${factor} lần. Tính chu kỳ mới (s).`,Number((.8*ratio).toFixed(3)),'s',`T' = T√${factor} = 0,8 × ${fmt(ratio,3)} ≈ ${fmt(.8*ratio,3)} s.`,'Tỉ số T′/T bằng √(m′/m).');
}
for(const beta of [.05,.1,.15,.2,.25]){
 const A0=20,t=2,At=A0*Math.exp(-beta*t);
 short('damping','hard',`Bao biên độ A(t) = 20e^(−${fmt(beta,2)}t) mm. Sau 2 giây, biên độ bằng bao nhiêu mm? Làm tròn 2 chữ số.`,Number(At.toFixed(2)),'mm',`A(2) = 20e^(−${fmt(beta,2)} × 2) ≈ ${fmt(At,2)} mm.`,'Thay trực tiếp t = 2 vào biểu thức hàm mũ.');
 mcq('damping','easy',`Trong A(t) = A₀e^(−${fmt(beta,2)}t), sau một thời gian dài biên độ sẽ thế nào (theo mô hình)?`,0,['Giảm dần về 0','Tăng vô hạn','Giữ nguyên','Đổi dấu qua từng chu kỳ'],`Với β > 0, e^(−βt) giảm theo thời gian, nên bao biên độ suy giảm.`,'Xét tính chất của e^(−βt).');
}
const KEY='shm-academy-progress-v2';let progress={answered:0,correct:0,wrong:[]};try{progress={...progress,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{};
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress))}catch{};stats()}
function stats(){el('practiceStats').textContent=`Đã làm ${progress.answered} câu · Đúng ${progress.correct} · Cần ôn ${new Set(progress.wrong).size}`;el('bankCount').textContent=questions.length;}
stats();let queue=[],at=0,quizScore=0,checked=false,hintViewed=false;
function filterBank(){return questions.filter(q=>(el('practiceTopic').value==='all'||el('practiceTopic').value===q.topic)&&(el('practiceType').value==='all'||el('practiceType').value===q.type)&&(el('practiceDifficulty').value==='all'||el('practiceDifficulty').value===q.difficulty));}
function start(wrongOnly=false){let base=wrongOnly?questions.filter(q=>progress.wrong.includes(q.id)):filterBank();if(!base.length){alert(wrongOnly?'Chưa có câu sai để ôn lại.':'Không có câu nào phù hợp bộ lọc này.');return;}queue=[...base].sort(()=>Math.random()-.5).slice(0,10);at=0;quizScore=0;el('practiceQuiz').hidden=false;el('practiceWelcome').hidden=true;showQ();el('practiceQuiz').scrollIntoView({behavior:'smooth',block:'start'});}
function showQ(){if(at>=queue.length){finish();return;}let q=queue[at];checked=false;hintViewed=false;el('quizCount').textContent=`Câu ${at+1}/${queue.length}`;el('quizScore').textContent=`Đúng: ${quizScore}`;el('quizProgressFill').style.width=(at/queue.length*100)+'%';el('quizMeta').textContent=`${topicNames[q.topic]} · ${q.type==='mcq'?'Trắc nghiệm':'Trả lời ngắn'} · ${{easy:'Nhận biết',medium:'Thông hiểu',hard:'Vận dụng'}[q.difficulty]}`;el('quizQuestion').textContent=q.question;el('quizFeedback').hidden=true;el('quizNext').hidden=true;el('quizCheck').disabled=false;let ans=el('quizAnswers');ans.replaceChildren();if(q.type==='mcq'){q.choices.forEach((c,i)=>{let label=document.createElement('label');label.className='quiz-option';let input=document.createElement('input');input.type='radio';input.name='shmAnswer';input.value=String(i);let span=document.createElement('span');span.textContent='ABCD'[i]+'. '+c;label.append(input,span);ans.append(label)})}else{let input=document.createElement('input');input.type='text';input.className='quiz-short';input.id='shortAnswer';input.placeholder='Nhập đáp án dạng số';input.autocomplete='off';ans.append(input);let unit=document.createElement('p');unit.className='academy-muted';unit.textContent=`Đơn vị: ${q.unit} · Dùng dấu chấm hoặc phẩy thập phân`;ans.append(unit);}}
function userAnswer(){let q=queue[at];if(q.type==='mcq')return document.querySelector('input[name=shmAnswer]:checked')?.value;return el('shortAnswer')?.value.trim();}
function check(){if(checked)return;let answer=userAnswer();if(!answer){alert('Bạn chưa nhập đáp án.');return;}let q=queue[at];let right=q.type==='mcq'?answer===q.answer:(()=>{let v=Number(answer.replace(',','.'));return Number.isFinite(v)&&Math.abs(v-q.answer)<=Math.max(.0005,Math.abs(q.answer)*.002)})();checked=true;progress.answered++;if(right){progress.correct++;quizScore++;progress.wrong=progress.wrong.filter(id=>id!==q.id)}else if(!progress.wrong.includes(q.id))progress.wrong.push(q.id);save();let f=el('quizFeedback');f.hidden=false;f.textContent=(right?'✓ Chính xác!':'✕ Chưa chính xác.')+'\n'+(q.type==='mcq'?`Đáp án: ${q.choices[Number(q.answer)]}`:`Đáp án: ${fmt(q.answer,5)} ${q.unit}`)+'\nGiải thích: '+q.explanation;f.className='quiz-feedback '+(right?'academy-right':'academy-wrong');el('quizCheck').disabled=true;el('quizNext').hidden=false;el('quizNext').textContent=at===queue.length-1?'Xem kết quả →':'Câu tiếp theo →';}
function finish(){el('quizAnswers').replaceChildren();el('quizQuestion').textContent=`Đã hoàn thành! Đúng ${quizScore}/${queue.length} câu ♡`;el('quizMeta').textContent='Cùng xem lại những câu sai nhé!';el('quizCount').textContent='Hoàn thành';el('quizProgressFill').style.width='100%';el('quizFeedback').hidden=false;el('quizFeedback').textContent=`Điểm: ${Math.round(100*quizScore/queue.length)}/100. Câu sai đã được lưu để ôn tập. Bấm "Bắt đầu đề 10 câu" để luyện tiếp.`;el('quizCheck').disabled=true;el('quizNext').hidden=true;}
el('practiceStart').onclick=()=>start();el('practiceWrong').onclick=()=>start(true);el('practiceReset').onclick=()=>{if(confirm('Xóa toàn bộ tiến độ và lịch sử câu sai trên thiết bị này?')){progress={answered:0,correct:0,wrong:[]};save();}};el('quizCheck').onclick=check;el('quizNext').onclick=()=>{at++;showQ()};el('quizEnd').onclick=()=>{el('practiceQuiz').hidden=true;el('practiceWelcome').hidden=false;};el('quizShowHint').onclick=()=>{let q=queue[at];if(!q)return;let f=el('quizFeedback');f.hidden=false;f.textContent='♡ Gợi ý: '+(q.hint||'Xác định đại lượng đã cho và công thức liên quan.');hintViewed=true;};
// Navigation is additive: do not modify the original setMode() or ESP32 handlers.
function navigate(section){const legacy=section==='real'||section==='sim';el('legacyLabArea').hidden=!legacy;el('academyPractice').hidden=section!=='practice';el('academyTutor').hidden=section!=='tutor';document.querySelectorAll('[data-lab-nav],[data-academy-nav]').forEach(c=>{let value=c.dataset.labNav||c.dataset.academyNav;c.classList.toggle('selected',value===section);c.setAttribute('aria-pressed',String(value===section));});if(legacy)el(section==='real'?'modeReal':'modeSim').click();(legacy?document.querySelector('.layout'):el(section==='practice'?'academyPractice':'academyTutor')).scrollIntoView({behavior:'smooth',block:'start'});}
document.querySelectorAll('[data-academy-nav]').forEach(b=>b.onclick=()=>navigate(b.dataset.academyNav));document.querySelectorAll('[data-lab-nav]').forEach(b=>b.addEventListener('click',()=>{el('legacyLabArea').hidden=false;el('academyPractice').hidden=true;el('academyTutor').hidden=true;document.querySelectorAll('[data-academy-nav]').forEach(c=>c.classList.remove('selected'));}));
// Tutor: API service when configured, offline concept tutor is openly labeled as a limited fallback.
let latestParams=null;let imgData=null;
el('tutorImage').addEventListener('change',async e=>{const file=e.target.files[0];imgData=null;if(!file){el('tutorFileName').textContent='';return;}if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>4*1024*1024){e.target.value='';el('tutorFileName').textContent='Vui lòng chọn ảnh PNG/JPEG/WEBP dưới 4 MB.';return;}imgData=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file);});el('tutorFileName').textContent='Đã chọn: '+file.name;});
function offlineSolve(problem,mode){
 const lower=problem.toLowerCase().replace(/\u00a0/g,' ');
 const m=lower.match(/(?:\bm\b|khối lượng)\s*(?:=|là|:)\s*(\d+(?:[.,]\d+)?)\s*(kg|g)\b/i);
 const k=lower.match(/(?:\bk\b|độ cứng)\s*(?:=|là|:)\s*(\d+(?:[.,]\d+)?)\s*(n\s*\/\s*m)\b/i);
 if(m&&k){
  const mass=Number(m[1].replace(',','.'))/(m[2]==='g'?1000:1);
  const stiff=Number(k[1].replace(',','.'));
  if(mass<=0||stiff<=0){latestParams=null;return 'Khối lượng m và độ cứng k phải lớn hơn 0.';}
  const T=2*Math.PI*Math.sqrt(mass/stiff),w=Math.sqrt(stiff/mass),f=1/T;
  latestParams={mass:mass*1000,k:stiff};
  if(mode==='guide')return `♡ Gợi ý:\n1. Đổi ${fmt(mass*1000,2)} g = ${fmt(mass,4)} kg.\n2. Tính ω = √(k/m).\n3. Từ ω, suy ra T = 2π/ω và f = 1/T.\nHãy thử làm rồi chuyển sang “Giải chi tiết” để đối chiếu.`;
  if(mode==='check')return `Bạn chưa cung cấp lời giải của mình để Springy kiểm tra. Hãy dán thêm từng bước làm bài.\nKết quả kiểm chứng bằng công thức: ω ≈ ${fmt(w,4)} rad/s; T ≈ ${fmt(T,4)} s; f ≈ ${fmt(f,4)} Hz.`;
  return `TÓM TẮT: m = ${fmt(mass,4)} kg, k = ${fmt(stiff,3)} N/m; bỏ qua ma sát.\nBƯỚC 1 – Công thức: ω = √(k/m); T = 2π/ω; f = 1/T.\nBƯỚC 2 – Tần số góc: ω = √(${fmt(stiff,3)}/${fmt(mass,4)}) ≈ ${fmt(w,4)} rad/s.\nBƯỚC 3 – Chu kỳ: T = 2π/${fmt(w,4)} ≈ ${fmt(T,4)} s.\nBƯỚC 4 – Tần số: f = 1/${fmt(T,4)} ≈ ${fmt(f,4)} Hz.\nGIẢI THÍCH: Cùng độ cứng, m tăng thì chu kỳ tăng; cùng m, k tăng thì chu kỳ giảm.\nĐây là bộ giải công thức OFFLINE, không phải AI ngôn ngữ; muốn giải bài nâng cao/đọc ảnh cần API.`;
 }
 latestParams=null;
 if(/(?:\bk\b|độ cứng)\s*(?:=|là|:)\s*\d+(?:[.,]\d+)?\s*\/\s*m\b/i.test(lower))return 'Mình thấy bạn nhập k = 50/m, bị thiếu đơn vị N. Hãy sửa thành k = 50 N/m rồi bấm “Hỏi Springy” lại nhé. Khi chưa bật AI, chế độ offline chỉ giải những dạng công thức được lập trình sẵn.';
 return `Chế độ offline chỉ giải tự động được bài con lắc lò xo có cả m (g/kg) và k (N/m), ví dụ: “m = 200 g, k = 50 N/m. Tính T, f, ω.”\nBài phức tạp hoặc ảnh đề cần AI: cấu hình GEMINI_API_KEY trong Vercel (hoặc môi trường Node.js khi chạy trên máy). Không nhập API key vào website.`;
}

// Springy rich answers: works even if Markdown libraries are unavailable.
// Every part of model text is escaped or sanitized. Math is isolated before Markdown
 // so TeX backslashes and underscores are never eaten by Markdown parsing.
function escapeTutorHTML(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function fallbackTutorMarkdown(text){
 const inline=(s)=>{
  s=escapeTutorHTML(s);
  s=s.replace(/`([^`]+)`/g,'<code>$1</code>');
  s=s.replace(/\*\*([^\n*]+)\*\*/g,'<strong>$1</strong>');
  s=s.replace(/\*([^\n*]+)\*/g,'<em>$1</em>');
  return s;
 };
 const lines=text.replace(/\r\n?/g,'\n').split('\n');let html='',list='',paragraph=[];
 const flushParagraph=()=>{if(paragraph.length){html+='<p>'+paragraph.map(inline).join('<br>')+'</p>';paragraph=[];}};
 const flushList=()=>{if(list){html+='</'+list+'>';list='';}};
 for(const line of lines){
  if(/^\s*$/.test(line)){flushParagraph();flushList();continue;}
  const heading=/^\s{0,3}(#{1,4})\s+(.+)$/.exec(line);
  if(heading){flushParagraph();flushList();const n=heading[1].length;html+='<h'+n+'>'+inline(heading[2])+'</h'+n+'>';continue;}
  if(/^\s*---+\s*$/.test(line)){flushParagraph();flushList();html+='<hr>';continue;}
  const bullet=/^\s*[-*+]\s+(.+)$/.exec(line),number=/^\s*\d+[.)]\s+(.+)$/.exec(line);
  if(bullet||number){flushParagraph();const wanted=bullet?'ul':'ol';if(list!==wanted){flushList();html+='<'+wanted+'>';list=wanted;}html+='<li>'+inline((bullet||number)[1])+'</li>';continue;}
  flushList();paragraph.push(line);
 }
 flushParagraph();flushList();return html;
}
function renderTutorRich(content,target){
 const raw=String(content??'');const math=[];
 const stash=(tex,display)=>{const id='SHMMATHTOKEN'+math.length+'END';math.push({tex,display});return id;};
 // Store code fences as safe HTML tokens before detecting math.
 const code=[];let text=raw.replace(/```([^\n`]*)\n([\s\S]*?)```/g,(_,lang,body)=>{
  const id='SHMCODETOKEN'+code.length+'END';code.push('<pre><code>'+escapeTutorHTML(body)+'</code></pre>');return id;
 });
 // MathJax formats: $$...$$, \\[...\\], \\(...\\), $...$ (single-line).
 text=text.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([^\n]+?)\\\)|(?<!\$)\$([^\n$]+?)\$(?!\$)/g,
 (_,a,b,c,d)=>stash(a??b??c??d,a!==undefined||b!==undefined));
 // These delimiters are already isolated; the outer markup does not get trusted.
 const html=window.marked&&window.DOMPurify
  ?window.DOMPurify.sanitize(window.marked.parse(text,{gfm:true,breaks:true}),{USE_PROFILES:{html:true}})
  :fallbackTutorMarkdown(text);
 target.innerHTML=html;
 const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT);const edits=[];
 while(walker.nextNode())if(/SHM(?:MATH|CODE)TOKEN\d+END/.test(walker.currentNode.nodeValue))edits.push(walker.currentNode);
 for(const node of edits){
  const frag=document.createDocumentFragment();const parts=node.nodeValue.split(/(SHM(?:MATH|CODE)TOKEN\d+END)/g);
  for(const part of parts){let m=/^SHMMATHTOKEN(\d+)END$/.exec(part);
   if(m){const item=math[Number(m[1])];if(item){const span=document.createElement(item.display?'div':'span');span.className=item.display?'shm-math-display':'shm-math-inline';span.textContent=(item.display?'\\[':'\\(')+item.tex+(item.display?'\\]':'\\)');frag.append(span);continue;}}
   m=/^SHMCODETOKEN(\d+)END$/.exec(part);
   if(m){const tpl=document.createElement('template');tpl.innerHTML=code[Number(m[1])]||'';frag.append(tpl.content.cloneNode(true));continue;}
   frag.append(document.createTextNode(part));
  }
  node.replaceWith(frag);
 }
 const mj=window.MathJax;
 if(mj?.typesetPromise){
  Promise.resolve(mj.startup?.promise).then(()=>{
   mj.typesetClear?.([target]);return mj.typesetPromise([target]);
  }).catch(err=>console.warn('Springy MathJax rendering:',err));
 }
}
function putTutor(text,source){let output=el('tutorOutput');output.replaceChildren();let head=document.createElement('p');head.className='ai-warning';head.textContent=source;let response=document.createElement('div');response.className='ai-output-text solution-block';output.append(head,response);renderTutorRich(text,response);}
el('tutorAsk').onclick=async()=>{const problem=el('tutorProblem').value.trim(),mode=el('tutorMode').value;if(!problem&&!imgData){alert('Hãy nhập đề bài hoặc chọn ảnh.');return;}el('tutorAsk').disabled=true;el('tutorStatus').textContent='✦ Springy đang phân tích...';latestParams=null;try{let result=await fetch('/api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({problem,mode,image:imgData})});let body=await result.json();if(!result.ok)throw new Error(body.error||'Lỗi gọi AI');putTutor(body.answer,'✦ Springy AI · Gemini 2.5 Flash-Lite');el('tutorStatus').textContent='AI có thể mắc lỗi. Hãy kiểm tra công thức và kết quả.';if(body.simulation&&Number.isFinite(body.simulation.mass)&&Number.isFinite(body.simulation.k))latestParams=body.simulation;}catch(e){if(imgData){putTutor('Chế độ offline không đọc được ảnh.\nNguyên nhân AI chưa hoạt động: '+e.message,'✦ Gemini API chưa sẵn sàng');}else{putTutor('⚠ Gemini chưa phản hồi: '+e.message+'\n\n--- Bộ giải quy tắc dự phòng ---\n'+offlineSolve(problem,mode),'✦ Chế độ quy tắc offline (KHÔNG phải AI đã huấn luyện)');}el('tutorStatus').textContent='AI chưa khả dụng: '+e.message;}finally{el('tutorAsk').disabled=false;el('tutorSimulate').disabled=!latestParams;}};
el('tutorSimulate').onclick=()=>{if(!latestParams)return;navigate('sim');if(el('mass')){el('mass').value=Math.max(Number(el('mass').min)||10,Math.min(Number(el('mass').max)||1000,latestParams.mass));el('mass').dispatchEvent(new Event('input',{bubbles:true}));}if(el('k')){el('k').value=Math.max(Number(el('k').min)||1,Math.min(Number(el('k').max)||1000,latestParams.k));el('k').dispatchEvent(new Event('input',{bubbles:true}));}el('simControls')?.scrollIntoView({behavior:'smooth',block:'center'});};
el('tutorClear').onclick=()=>{el('tutorProblem').value='';el('tutorImage').value='';imgData=null;latestParams=null;el('tutorSimulate').disabled=true;el('tutorFileName').textContent='';el('tutorOutput').textContent='Springy sẵn sàng nhận câu hỏi mới ♡';};
})();
