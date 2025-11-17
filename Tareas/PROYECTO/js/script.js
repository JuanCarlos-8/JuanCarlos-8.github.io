(function(){
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');
  const themeToggle = document.getElementById('themeToggle');

  let expr = '';
  let lastResult = null;

  function render(){
    display.textContent = expr === '' ? '0' : expr;
  }

  function append(value){
    if(value === '×') value='*';
    if(value === '÷') value='/';
    if(value === '.' && /\.[0-9]*$/.test(expr)) return;
    expr += value;
    render();
  }

  function clearAll(){ expr = ''; render(); }
  function backspace(){ expr = expr.slice(0, -1); render(); }

  function safeEvaluate(input){
    const cleaned = input.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
    if(!/^[0-9+\-*/().% \t]+$/.test(cleaned)){
      throw new Error('Expresión inválida');
    }
    const withPercent = cleaned.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    const result = Function('return ' + withPercent)();
    if(!isFinite(result)) throw new Error('Resultado no finito');
    return result;
  }

  function calculate(){
    try{
      if(expr.trim() === '') return;
      const value = safeEvaluate(expr);
      lastResult = value;
      expr = String(value);
      render();
    }catch(e){
      display.textContent = 'Error';
      expr = '';
      setTimeout(render, 900);
    }
  }

  keys.addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const action = btn.dataset.action;
    const val = btn.dataset.value;

    if(action === 'clear') return clearAll();
    if(action === 'back') return backspace();
    if(action === 'equals') return calculate();
    if(action === 'paren'){
      if(expr.slice(-1) === '(') append(')'); else append('(');
      return;
    }

    append(val || btn.textContent);
  });

  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === '='){
      e.preventDefault(); calculate();
      return;
    }
    if(e.key === 'Backspace'){
      e.preventDefault(); backspace(); return;
    }
    if(e.key === 'Escape'){
      e.preventDefault(); clearAll(); return;
    }
    if(/^[0-9+\-*/().%]$/.test(e.key)){
      append(e.key);
      e.preventDefault();
      return;
    }
  });

  function setTheme(light){
    if(light){
      document.documentElement.classList.add('light');
      themeToggle.textContent = '🌤️';
      themeToggle.setAttribute('aria-pressed','true');
    }else{
      document.documentElement.classList.remove('light');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed','false');
    }
  }

  themeToggle.addEventListener('click', ()=>{
    const isLight = document.documentElement.classList.toggle('light');
    setTheme(isLight);
    try{ localStorage.setItem('calc_theme_light', isLight ? '1' : '0'); }catch(e){}
  });

  try{ if(localStorage.getItem('calc_theme_light') === '1') setTheme(true); }catch(e){}
  render();
})();