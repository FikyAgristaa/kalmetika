(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const toast=(msg)=>{const el=$('#toast'); if(!el)return; el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1800)};

  const savedTheme=localStorage.getItem('kalmetika-theme');
  if(savedTheme==='dark')document.body.classList.add('dark');
  const themeBtn=$('#themeToggle');
  themeBtn?.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('kalmetika-theme',document.body.classList.contains('dark')?'dark':'light');toast('Tema diperbarui');});
  const menuBtn=$('#menuToggle'), nav=$('.nav-links');
  menuBtn?.addEventListener('click',()=>nav?.classList.toggle('show'));
  $$('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('show')));

  const top=$('#toTop'); window.addEventListener('scroll',()=>top?.classList.toggle('show',window.scrollY>450)); top?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

  $$('.copy-formula').forEach(btn=>btn.addEventListener('click',async()=>{const target=btn.dataset.target, text=$(target)?.textContent?.trim(); if(!text)return; try{await navigator.clipboard.writeText(text);toast('Rumus berhasil disalin');}catch{toast('Gagal menyalin rumus')}}));
  $$('.toggle-solution').forEach(btn=>btn.addEventListener('click',()=>{const box=btn.closest('.example')?.querySelector('.solution'); if(!box)return; box.classList.toggle('show'); btn.textContent=box.classList.contains('show')?'Tutup Pembahasan':'Lihat Pembahasan'}));
  $$('.faq-q').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.faq-item')?.classList.toggle('open')));

  const state={mode:'arith'};
  const modeTabs=$$('.calc-tab'); const arithBox=$('#arithCalc'), geoBox=$('#geoCalc');
  modeTabs.forEach(t=>t.addEventListener('click',()=>{modeTabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');state.mode=t.dataset.mode; if(arithBox)arithBox.style.display=state.mode==='arith'?'block':'none';if(geoBox)geoBox.style.display=state.mode==='geo'?'block':'none';}));

  function num(id){return Number($(id)?.value)}
  function validNumber(v){return Number.isFinite(v)}
  function format(v){return Number.isInteger(v)?String(v):String(Number(v.toFixed(8)))}
  function showError(el,msg){if(el){el.textContent=msg;el.classList.add('show')}} function clearError(el){if(el)el.classList.remove('show')}

  $('#arithForm')?.addEventListener('submit',e=>{
    e.preventDefault(); const err=$('#arithError'); clearError(err);
    const a=num('#a'), b=num('#b'), n=num('#n');
    if([a,b,n].some(v=>!validNumber(v))){showError(err,'Silakan masukkan semua nilai terlebih dahulu.');return}
    if(n<1||!Number.isInteger(n)){showError(err,'Nomor suku harus berupa bilangan bulat minimal 1.');return}
    const un=a+(n-1)*b, sn=n/2*(2*a+(n-1)*b);
    $('#arithUn').textContent=format(un); $('#arithSn').textContent=format(sn);
    $('#arithSteps').innerHTML=`<div class="solution-step">U${n} = a + (n - 1)b</div><div class="solution-step">U${n} = ${format(a)} + (${n} - 1)(${format(b)})</div><div class="solution-step">U${n} = ${format(a)} + ${format((n-1)*b)}</div><div class="solution-step">U${n} = <strong>${format(un)}</strong></div><div class="solution-step">S${n} = n/2 × (2a + (n - 1)b)</div><div class="solution-step">S${n} = ${n}/2 × (2(${format(a)}) + (${n} - 1)${format(b)})</div><div class="solution-step">S${n} = ${format(sn)}</div>`;
    $('#arithResults')?.classList.add('show'); toast('Perhitungan aritmetika selesai');
  });
  $('#arithReset')?.addEventListener('click',()=>{ $('#arithForm')?.reset(); $('#arithResults')?.classList.remove('show');clearError($('#arithError')); });

  $('#geoForm')?.addEventListener('submit',e=>{
    e.preventDefault(); const err=$('#geoError'); clearError(err);
    const a=num('#ga'), r=num('#gr'), n=num('#gn');
    if([a,r,n].some(v=>!validNumber(v))){showError(err,'Silakan masukkan semua nilai terlebih dahulu.');return}
    if(n<1||!Number.isInteger(n)){showError(err,'Nomor suku harus berupa bilangan bulat minimal 1.');return}
    const un=a*Math.pow(r,n-1); const sn=Math.abs(r-1)<1e-12?a*n:a*(Math.pow(r,n)-1)/(r-1); const converges=Math.abs(r)<1;
    $('#geoUn').textContent=format(un); $('#geoSn').textContent=format(sn); $('#geoInf').textContent=converges?format(a/(1-r)):'Tidak konvergen';
    $('#geoSteps').innerHTML=`<div class="solution-step">U${n} = a × r^(n - 1)</div><div class="solution-step">U${n} = ${format(a)} × ${format(r)}^(${n} - 1)</div><div class="solution-step">U${n} = <strong>${format(un)}</strong></div><div class="solution-step">S${n} = a(r^n - 1)/(r - 1)</div><div class="solution-step">S${n} = ${format(sn)}</div><div class="solution-step">S∞ = a/(1-r) hanya berlaku jika |r| &lt; 1 → ${converges?'memenuhi':'tidak memenuhi'}.</div>`;
    $('#geoResults')?.classList.add('show'); toast('Perhitungan geometri selesai');
  });
  $('#geoReset')?.addEventListener('click',()=>{ $('#geoForm')?.reset(); $('#geoResults')?.classList.remove('show');clearError($('#geoError')); });

  $('#infiniteForm')?.addEventListener('submit',e=>{
    e.preventDefault(); const err=$('#infiniteError'); clearError(err); const a=num('#ia'), r=num('#ir');
    if([a,r].some(v=>!validNumber(v))){showError(err,'Silakan masukkan a dan r terlebih dahulu.');return}
    if(Math.abs(r)>=1){showError(err,'Deret tidak memiliki jumlah hingga karena |r| harus kurang dari 1.'); $('#infiniteResult')?.classList.remove('show'); return}
    $('#infValue').textContent=format(a/(1-r)); $('#infiniteSteps').innerHTML=`<div class="solution-step">S∞ = a/(1-r)</div><div class="solution-step">S∞ = ${format(a)}/(1-${format(r)})</div><div class="solution-step">S∞ = <strong>${format(a/(1-r))}</strong></div>`; $('#infiniteResult')?.classList.add('show'); toast('Deret tak hingga berhasil dihitung');
  });

  // Make image paths robust when photos are not yet provided.
  $$('img[data-fallback]').forEach(img=>img.addEventListener('error',()=>{const fallback=img.dataset.fallback; if(img.src!==fallback)img.src=fallback;}));
})();
