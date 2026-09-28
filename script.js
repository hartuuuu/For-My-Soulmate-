// State variables
const pages = ['page-1', 'page-2', 'page-3', 'page-letter', 'page-video', 'page-final'];
let currentPageIndex = 0;

const memories = [
  'assets/memory1.jpg',
  'assets/memory2.jpg',
  'assets/memory3.jpg',
  'assets/memory4.jpg',
  'assets/memory5.jpg'
];
let currentMemoryIndex = 0;

// Navigation
function showPage(pageId) {
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active');
      el.classList.add('hidden');
    }
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
    currentPageIndex = pages.indexOf(pageId);
  }
}

function nextPage() {
  if (currentPageIndex < pages.length - 1) {
    showPage(pages[currentPageIndex + 1]);
  }
}

function prevPage() {
  if (currentPageIndex > 0) {
    showPage(pages[currentPageIndex - 1]);
  }
}

// Memory Flip Logic
function nextMemory() {
  const flipCard = document.getElementById('flip-card');
  const img = document.getElementById('memory-image');
  const counter = document.getElementById('memory-counter');

  if (flipCard) {
    flipCard.classList.add('turn-next');

    setTimeout(() => {
      currentMemoryIndex = (currentMemoryIndex + 1) % memories.length;
      if (img) img.src = memories[currentMemoryIndex];
      if (counter) counter.innerText = `${currentMemoryIndex + 1} / ${memories.length}`;
      flipCard.classList.remove('turn-next');
    }, 200);
  }
}

// Letter Toggle Logic
function toggleLetter() {
  const letterPage = document.getElementById('page-letter');
  const btn = document.getElementById('letter-next-btn');

  if (letterPage) {
    letterPage.classList.toggle('open');
    if (btn) btn.classList.add('visible');
  }
}

// Replay Video Logic
function replayVideo(videoId) {
  const vid = document.getElementById(videoId);
  if (vid) {
    vid.currentTime = 0;
    vid.play();
  }
}

// Final Page Transition & Confetti
function goToFinalPage() {
  showPage('page-final');
  startConfetti();
}

function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const confettiCount = 45;
  const particles = [];
  const colors = ['#fce1e4', '#fcf4dd', '#ddedf8', '#e8dff5', '#ffffff'];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 6 + 4,
      speedY: Math.random() * 2 + 1,
      speedX: Math.random() * 1 - 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y > canvas.height) p.y = -10;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 1.5);
    });
    requestAnimationFrame(render);
  }

  render();
}

// Restart Website Logic
function restartWebsite() {
  const vids = document.querySelectorAll('video');
  vids.forEach(v => {
    v.currentTime = 0;
  });

  const letterPage = document.getElementById('page-letter');
  if (letterPage) {
    letterPage.classList.remove('open');
  }

  showPage('page-1');
}
