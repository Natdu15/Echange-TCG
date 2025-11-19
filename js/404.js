const container = document.querySelector('.particles');

for (let i = 0; i < 50; i++) {
  const p = document.createElement('div');
  p.classList.add('particle');
  const size = Math.random() * 10 + 5;
  p.style.width = p.style.height = size + 'px';
  p.style.left = Math.random() * 100 + '%';
  p.style.bottom = '0'; // départ en bas
  p.style.animationDuration = (5 + Math.random() * 10) + 's';
  p.style.animationDelay = Math.random() * 5 + 's';
  container.appendChild(p);
}
