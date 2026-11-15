(function(){
  var root=document.querySelector('[data-quiz]');
  var CAT={kultur:'Genel kültür',tarih:'Tarih',cografya:'Coğrafya',bilim:'Bilim',atasozu:'Atasözü'};
  var L='ABCD';
  // Kategori süzgeci
  var fbtns=[].slice.call(document.querySelectorAll('[data-f]'));
  var groups=[].slice.call(document.querySelectorAll('.gx-group'));
  fbtns.forEach(function(b){
    b.addEventListener('click',function(){
      var f=b.getAttribute('data-f');
      fbtns.forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
      groups.forEach(function(g){g.hidden=!(f==='all'||g.getAttribute('data-cat')===f)});
    });
  });
  if(!root)return;
  var items=[].slice.call(document.querySelectorAll('li.gx-qa')).map(function(li){
    var opts=[].slice.call(li.querySelectorAll('.gx-opts li')).map(function(o){return o.lastElementChild.textContent});
    var p=li.querySelector('details p'),a=p&&p.querySelector('.qa-src a');
    var st=p&&p.querySelector('strong'),sr=p&&p.querySelector('.qa-src');
    var exp=p?p.textContent.replace(st?st.textContent:'','').replace(sr?sr.textContent:'','').trim():'';
    return {q:li.querySelector('.gx-qt').textContent,o:opts,a:+li.getAttribute('data-a'),e:exp,c:CAT[li.getAttribute('data-cat')]||'',u:a?a.href:'',s:a?a.textContent:''};
  });
  var start=root.querySelector('[data-start]');
  var tpl=document.getElementById('quiz-cta');
  var N=10,set,i,score,res;
  function el(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n}
  function shuffle(a){a=a.slice();for(var k=a.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),t=a[k];a[k]=a[j];a[j]=t}return a}
  function narrow(){return window.innerWidth<860}
  function toTop(){if(!narrow())return;var y=root.getBoundingClientRect().top+window.scrollY-68;window.scrollTo({top:y,behavior:'smooth'})}
  function begin(){set=shuffle(items).slice(0,N);i=0;score=0;res=[];show();toTop()}
  function dots(){
    var d=el('div','gx-dots');d.setAttribute('aria-hidden','true');
    for(var k=0;k<N;k++){d.appendChild(el('span',k<res.length?(res[k]?'ok':'bad'):(k===i?'cur':'')))}
    return d;
  }
  function show(){
    var q=set[i];root.textContent='';
    var m=el('div','gx-qmeta');
    m.appendChild(el('span',null,'Soru '+(i+1)+' / '+set.length));
    if(q.c)m.appendChild(el('span','gx-cat',q.c));
    m.appendChild(el('span','gx-pts','Puan '+score*10));
    root.appendChild(m);
    root.appendChild(dots());
    root.appendChild(el('p','gx-q',q.q));
    var ul=el('ul','gx-qopts'),btns=[];
    q.o.forEach(function(t,k){
      var li=el('li'),b=el('button','gx-qopt');b.type='button';
      b.appendChild(el('span','gx-L',L[k]));b.appendChild(el('span','gx-t',t));b.appendChild(el('span','gx-tag',''));
      b.addEventListener('click',function(){answer(k,btns,q)});
      li.appendChild(b);ul.appendChild(li);btns.push(b);
    });
    root.appendChild(ul);
    if(btns[0])btns[0].focus({preventScroll:true});
  }
  function answer(k,btns,q){
    var right=k===q.a;if(right)score++;res.push(right);
    btns.forEach(function(b,x){
      b.disabled=true;var tag=b.querySelector('.gx-tag');
      if(x===q.a){b.className+=' ok';tag.textContent=right?'Doğru':'Doğru cevap'}
      else if(x===k){b.className+=' bad';tag.textContent='Senin cevabın'}
      else b.className+=' dim';
    });
    var old=root.querySelector('.gx-dots');if(old)root.replaceChild(dots(),old);
    root.querySelector('.gx-pts').textContent='Puan '+score*10;
    var box=el('div','gx-verdict'+(right?'':' bad'));
    box.appendChild(el('strong',null,right?'Doğru!':'Doğrusu: '+L[q.a]+') '+q.o[q.a]));
    var p=el('p',null,q.e+' ');
    if(q.u){var a=el('a',null,'Kaynak: '+q.s);a.href=q.u;a.target='_blank';a.rel='noopener';p.appendChild(a)}
    box.appendChild(p);root.appendChild(box);
    var nx=el('button','gx-btn gx-next',i+1<set.length?'Sonraki soru':'Sonucu gör');nx.type='button';
    nx.addEventListener('click',function(){i++;if(i<set.length)show();else finish();toTop()});
    root.appendChild(nx);nx.focus({preventScroll:true});
  }
  function finish(){
    root.textContent='';
    var msg=score>=9?'Bilge gibisin!':score>=6?'Çok iyi, okun hedefte.':score>=3?'Fena değil, bir tur daha?':'Isınma turuydu.';
    var r=el('div','gx-result');
    r.appendChild(el('p','gx-muted','Sonuç'));
    var sc=el('p','gx-score',String(score));sc.appendChild(el('span',null,'/'+set.length));r.appendChild(sc);
    r.appendChild(el('p','gx-msg',msg));
    root.appendChild(r);
    var again=el('button','gx-again','Yeni 10 soru');again.type='button';again.addEventListener('click',begin);root.appendChild(again);
    if(tpl&&tpl.content)root.appendChild(tpl.content.cloneNode(true));
    again.focus({preventScroll:true});
  }
  start.disabled=false;
  start.addEventListener('click',begin);
})();
