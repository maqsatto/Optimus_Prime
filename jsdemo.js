// jsdemo.js - Advanced JS concepts demo

document.addEventListener("DOMContentLoaded", () => {
  const demoRoot = document.getElementById("components-list");
  if (!demoRoot) return;

  const AppDemo = {
    name: "Optimus Demo",
    components: [
      { id: 1, name: "CPU", price: 299 },
      { id: 2, name: "GPU", price: 699 },
      { id: 3, name: "RAM", price: 129 },
      { id: 4, name: "SSD", price: 149 },
    ],
    totalPrice() {
      return this.components.reduce((sum, c) => sum + c.price, 0);
    },
    findBy(predicate) {
      return this.components.filter(predicate);
    },
  };

  function renderComponents() {
    demoRoot.innerHTML = "";
    AppDemo.components.forEach((c) => {
      const div = document.createElement("div");
      div.className = "demo-list-item";
      div.textContent = `${c.name} — $${c.price}`;
      demoRoot.appendChild(div);
    });

    const total = document.createElement("div");
    total.className = "mt-2 small";
    total.textContent = `Total: $${AppDemo.totalPrice()}`;
    demoRoot.appendChild(total);
  }

  renderComponents();

  console.log("Expensive parts:", AppDemo.findBy(p => p.price >= 200));

  // sound
  const playBtn = document.getElementById("play-sound-btn");
  function playBeep(){
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.05;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      setTimeout(()=>{ o.stop(); ctx.close(); }, 220);
    }catch(e){ console.warn('Audio not supported', e); }
  }
  if(playBtn) playBtn.addEventListener('click', playBeep);

  // animation
  const animateBtn = document.getElementById('animate-btn');
  const box = document.getElementById('animate-box');
  if(animateBtn && box){
    animateBtn.addEventListener('click', ()=>{
      box.style.transform = 'scale(1.08) translateY(-6px)';
      box.style.boxShadow = '0 12px 30px rgba(255,215,0,0.12)';
      setTimeout(()=>{ box.style.transform=''; box.style.boxShadow=''; }, 600);
    });
  }

  // --- Advanced Interactions wiring ---
  // Rating stars
  const ratingRoot = document.getElementById('rating');
  const ratingValue = document.getElementById('rating-value');
  if (ratingRoot && ratingValue) {
    const stars = Array.from(ratingRoot.querySelectorAll('.star'));
    function setRating(v){
      stars.forEach(s => {
        const val = Number(s.dataset.value || 0);
        if(val <= v) s.classList.add('selected'); else s.classList.remove('selected');
      });
      ratingValue.textContent = v ? `You rated this ${v} / 5` : 'No rating yet';
    }
    stars.forEach(s => {
      s.addEventListener('click', ()=> setRating(Number(s.dataset.value)));
      s.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRating(Number(s.dataset.value)); } });
    });
  }

  // Greeting input
  const nameInput = document.getElementById('name-input');
  const nameSubmit = document.getElementById('name-submit');
  const greetingEl = document.getElementById('greeting');
  if(nameInput && nameSubmit && greetingEl){
    function doGreet(){
      const raw = nameInput.value || '';
      const name = raw.trim() || 'guest';
      greetingEl.textContent = `Hello, ${name}!`;
    }
    nameSubmit.addEventListener('click', doGreet);
    nameInput.addEventListener('keypress', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); doGreet(); } });
  }

  // Demo-scoped theme toggle (simple day/night swap using bootstrap helper classes)
  const themeToggle = document.getElementById('theme-toggle');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const body = document.body;
      const isNight = body.classList.contains('bg-black');
      if(isNight){
        body.classList.remove('bg-black','text-warning');
        body.classList.add('bg-light','text-dark');
      }else{
        body.classList.remove('bg-light','text-dark');
        body.classList.add('bg-black','text-warning');
      }
    });
  }

  // Show current time button
  const showTimeBtn = document.getElementById('show-time');
  const timeDisplay = document.getElementById('time-display');
  if(showTimeBtn && timeDisplay){
    showTimeBtn.addEventListener('click', ()=>{
      timeDisplay.textContent = new Date().toLocaleTimeString();
    });
  }

  // Keyboard navigation for simple menu
  const navMenu = document.getElementById('nav-menu');
  if(navMenu){
    const items = Array.from(navMenu.querySelectorAll('.nav-item'));
    navMenu.addEventListener('keydown', (e)=>{
      const { key } = e;
      if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(key)) return;
      e.preventDefault();
      const active = document.activeElement;
      let idx = items.indexOf(active);
      if(idx === -1) idx = 0;
      if(key === 'ArrowRight' || key === 'ArrowDown') idx = (idx + 1) % items.length;
      if(key === 'ArrowLeft' || key === 'ArrowUp') idx = (idx - 1 + items.length) % items.length;
      if(key === 'Home') idx = 0;
      if(key === 'End') idx = items.length - 1;
      items[idx].focus();
    });
    // make items focusable and give simple active style on focus
    items.forEach(it => it.addEventListener('focus', ()=> it.classList.add('ring')));
    items.forEach(it => it.addEventListener('blur', ()=> it.classList.remove('ring')));
  }

  // Multi-step form controller
  const multiForm = document.getElementById('multi-form');
  if(multiForm){
    const steps = Array.from(multiForm.querySelectorAll('.form-step'));
    let current = 0;
    function showStep(i){
      steps.forEach((s,idx)=>{
        if(idx === i) s.classList.remove('d-none'); else s.classList.add('d-none');
      });
    }
    showStep(current);
    multiForm.addEventListener('click', (e)=>{
      if(e.target.matches('.next-step')){ e.preventDefault(); if(current < steps.length-1){ current++; showStep(current); } }
      if(e.target.matches('.back-step')){ e.preventDefault(); if(current > 0){ current--; showStep(current); } }
      if(e.target.matches('.finish')){ e.preventDefault(); // small finish action
        alert('Form finished (demo).');
      }
    });
  }

  // Time-of-day greeting using switch(true)
  const timeGreetBtn = document.getElementById('time-greet');
  const timeGreeting = document.getElementById('time-greeting');
  if(timeGreetBtn && timeGreeting){
    timeGreetBtn.addEventListener('click', ()=>{
      const h = new Date().getHours();
      let msg = '';
      switch(true){
        case (h >= 5 && h < 12): msg = 'Good morning!'; break;
        case (h >= 12 && h < 17): msg = 'Good afternoon!'; break;
        case (h >= 17 && h < 21): msg = 'Good evening!'; break;
        default: msg = 'Good night!';
      }
      timeGreeting.textContent = msg;
    });
  }
});