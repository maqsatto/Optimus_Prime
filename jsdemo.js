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
});