(function(){
    const btn = document.getElementById('changeColorBtn');

    // Palette of backgrounds: some solid colors and gradients
    const palette = [
        'linear-gradient(180deg, #f6f8ff, #eef2ff 60%)',
        '#dfffe2',
        '#fff6e5',
        'linear-gradient(90deg,#fef3c7,#fee2e2)',
        '#e6f7ff',
        'linear-gradient(135deg,#eef2ff,#e0f2fe)'
    ];

    const STORAGE_KEY = 'siteBackgroundIndex';

    function getSavedIndex(){
        const v = localStorage.getItem(STORAGE_KEY);
        return v ? Number(v) : 0;
    }

    function saveIndex(i){
        localStorage.setItem(STORAGE_KEY, String(i));
    }

    function applyBackground(i){
        const value = palette[i % palette.length];
        document.body.style.background = value;
        // update ARIA and button text for clarity
        if(btn){
            btn.setAttribute('aria-pressed', 'false');
            btn.textContent = `Background ${i+1}/${palette.length} — Change`;
        }
    }

    // initialize
    let index = getSavedIndex();
    applyBackground(index);

    // click cycles to next color and persists
    if(btn){
        btn.addEventListener('click', ()=>{
            index = (index + 1) % palette.length;
            applyBackground(index);
            saveIndex(index);
        });
    }
})();

// --- Custom cursor dot (smooth trailing) - Global animation
(function(){
    // don't activate on touch devices
    if(('ontouchstart' in window) || window.matchMedia('(hover: none)').matches) return;

    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);

    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
    let dotX = mouseX, dotY = mouseY;
    const speed = 0.18; // lower is smoother/slower

    function raf(){
        dotX += (mouseX - dotX) * speed;
        dotY += (mouseY - dotY) * speed;
        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.addEventListener('mousemove', (e)=>{
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.opacity = '1';
    });

    window.addEventListener('mouseleave', ()=>{ dot.style.opacity = '0'; });

    // global hover for nav, all links, buttons - anywhere on the website
    const navLinks = document.querySelectorAll('nav a');
    const allInteractive = document.querySelectorAll('a, button, input, [role="button"]');
    
    allInteractive.forEach(el=>{
        el.addEventListener('mouseenter', ()=>{
            dot.classList.add('cursor-hover');
            // apply alt color for buttons specifically
            if(el.tagName.toLowerCase() === 'button'){
                dot.classList.add('cursor-alt');
            }
        });
        el.addEventListener('mouseleave', ()=>{
            dot.classList.remove('cursor-hover');
            dot.classList.remove('cursor-alt');
        });
    });

})();
