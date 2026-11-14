(function(){
  var root=document.querySelector('[data-quiz]');
  if(!root)return;
  var items=[].slice.call(document.querySelectorAll('li.qa')).map(function(li){
    var h=li.querySelector('h3').textContent.replace(/^\d+\.\s*/,'');
    var opts=[].slice.call(li.querySelectorAll('.qa-opts li')).map(function(o){return o.textContent});
    var p=li.querySelector('details p');
    var exp=p?p.textContent.replace(/Kaynak:.*$/,'').trim():'';
    return {q:h,o:opts,a:+li.getAttribute('data-a'),e:exp};
  });
  var start=root.querySelector('[data-start]');
  var cta=document.querySelector('main .badges');
  var ctaHtml=cta?cta.outerHTML:'';
  var N=10,set,i,score;
  function el(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n}
  function shuffle(a){a=a.slice();for(var k=a.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),t=a[k];a[k]=a[j];a[j]=t}return a}
  function begin(){set=shuffle(items).slice(0,N);i=0;score=0;show()}
  function show(){
    var q=set[i];root.textContent='';
    root.appendChild(el('p','quiz-meta','Soru '+(i+1)+' / '+set.length+' · Puan: '+score));
    root.appendChild(el('p','quiz-q',q.q));
    var ul=el('ul','quiz-opts'),btns=[];
    q.o.forEach(function(t,k){
      var li=el('li'),b=el('button','quiz-opt',t);b.type='button';
      b.addEventListener('click',function(){answer(k,btns,q)});
      li.appendChild(b);ul.appendChild(li);btns.push(b);
    });
    root.appendChild(ul);
    var f=btns[0];if(f)f.focus({preventScroll:true});
  }
  function answer(k,btns,q){
    btns.forEach(function(b,x){b.disabled=true;if(x===q.a)b.className+=' ok';else if(x===k)b.className+=' bad'});
    var right=k===q.a;if(right)score++;
    var box=el('div','quiz-exp');
    box.appendChild(el('strong',null,right?'Doğru! ':'Yanlış. Doğru cevap: '+q.o[q.a]+'. '));
    box.appendChild(document.createTextNode(q.e));
    root.appendChild(box);
    var nx=el('button','quiz-btn',i+1<set.length?'Sonraki soru':'Sonucu gör');nx.type='button';
    nx.addEventListener('click',function(){i++;if(i<set.length)show();else finish()});
    root.appendChild(nx);nx.focus({preventScroll:true});
  }
  function finish(){
    root.textContent='';
    var msg=score>=9?'Harika, tam bir bilgi avcısısın!':score>=6?'Güzel sonuç, biraz daha ısınırsan tamamı olur.':'Bu tur ısınma sayılır, bir tur daha dene.';
    root.appendChild(el('p','quiz-meta','Sonuç'));
    root.appendChild(el('p','quiz-score',score+' / '+set.length));
    root.appendChild(el('p',null,msg));
    var again=el('button','quiz-btn','Yeni 10 soru');again.type='button';again.addEventListener('click',begin);root.appendChild(again);
    var c=el('div','quiz-cta');
    c.appendChild(el('h3',null,"Bil At!'ta okla nişan alıp devam et"));
    c.appendChild(el('p',null,'Tahtaya ok at, vurduğun dilim soruyu seçsin. Ücretsiz, hesap gerekmez.'));
    var w=el('div');w.innerHTML=ctaHtml;c.appendChild(w);
    root.appendChild(c);
  }
  start.disabled=false;
  start.addEventListener('click',begin);
})();
