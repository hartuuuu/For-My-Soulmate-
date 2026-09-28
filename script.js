document.addEventListener("DOMContentLoaded", () => {
  // --- DOM ELEMENTS ---
  const bgMusic = document.getElementById("bg-music");

  // Pages
  const page1 = document.getElementById("page-1");
  const page2 = document.getElementById("page-2");
  const pageMemory = document.getElementById("page-memory-book");
  const pageLetter = document.getElementById("page-letter");
  const pageVideo = document.getElementById("page-video");
  const pageFinal = document.getElementById("page-final");

  // Buttons & Navigation
  const btnStart = document.getElementById("btn-start");
  const p2BackBtn = document.getElementById("p2-back-btn");
  const p2MainContent = document.getElementById("p2-main-content");

  const memBackBtn = document.getElementById("mem-back-btn");
  const memNextBtn = document.getElementById("mem-next-btn");
  const memoryCounter = document.getElementById("memory-counter");
  const memoryImage = document.getElementById("memory-image");
  const memoryImageUnder = document.getElementById("memory-image-under");
  const scrapbookPage = document.getElementById("scrapbook-page");
  const flipCard = document.getElementById("flip-card");

  const letterBackBtn = document.getElementById("letter-back-btn");
  const letterNextBtn = document.getElementById("letter-next-btn");

  const cardTop = document.getElementById("card-top");
  const cardBottom = document.getElementById("card-bottom");
  const clickPrompt = document.getElementById("click-prompt");
  const letterScrollArea = document.getElementById("letter-scroll-area");

  // Video Page Elements
  const videoBackBtn = document.getElementById("video-back-btn");
  const videoScrollArea = document.getElementById("video-scroll-area");
  const video1 = document.getElementById("video-1");
  const video2 = document.getElementById("video-2");
  const replayV1 = document.getElementById("replay-v1");
  const replayV2 = document.getElementById("replay-v2");
  const videoFooterTrigger = document.getElementById("video-footer-trigger");

  // Final Page Elements
  const finalClickArea = document.getElementById("final-click-area");
  const confettiCanvas = document.getElementById("confetti-canvas");

  // --- STATE ---
  let currentPageState = "page1";
  let currentMemoryIndex = 1;
  const totalMemories = 8;
  let isFlipping = false;

  // Zoom / Drag State
  let scale = 1;
  let pointX = 0, pointY = 0, startX = 0, startY = 0;
  let isDragging = false;
  let lastTapTime = 0;

  // --- PAGE NAVIGATION ---
  function showPage(pageToShow) {
    [page1, page2, pageMemory, pageLetter, pageVideo, pageFinal].forEach((p) => {
      p.classList.add("hidden");
      p.classList.remove("active");
    });

    pageToShow.classList.remove("hidden");
    pageToShow.classList.add("active");
  }

  // --- TURN.JS STYLE PAGE TURN ANIMATION ---
  function changeMemoryWithFlip(newIndex, direction = "next") {
    if (isFlipping) return;
    isFlipping = true;

    resetZoom();
    memoryImageUnder.src = `assets/memory-${newIndex}.png`;

    const flipClass = direction === "next" ? "turn-next" : "turn-prev";
    flipCard.classList.add(flipClass);

    setTimeout(() => {
      currentMemoryIndex = newIndex;
      memoryImage.src = `assets/memory-${newIndex}.png`;
      memoryImage.alt = `Memory ${newIndex}`;
      memoryCounter.textContent = `${newIndex} / ${totalMemories}`;

      const nextUnder = newIndex < totalMemories ? newIndex + 1 : totalMemories;
      memoryImageUnder.src = `assets/memory-${nextUnder}.png`;

      flipCard.classList.remove(flipClass);
      isFlipping = false;
    }, 400);
  }

  function resetZoom() {
    scale = 1;
    pointX = 0;
    pointY = 0;
    applyTransform();
  }

  function applyTransform() {
    scale = Math.min(Math.max(1, scale), 4);
    if (scale === 1) { pointX = 0; pointY = 0; }
    memoryImage.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
  }

  // --- SPLIT CARD COVER TOGGLE ---
  function openLetterCard() {
    pageLetter.classList.add("open");
    if (cardTop) cardTop.classList.add("slide-up");
    if (cardBottom) cardBottom.classList.add("slide-down");
  }

  if (cardTop) cardTop.addEventListener("click", openLetterCard);
  if (cardBottom) cardBottom.addEventListener("click", openLetterCard);
  if (clickPrompt) clickPrompt.addEventListener("click", openLetterCard);

  if (letterScrollArea) {
    letterScrollArea.addEventListener("scroll", () => {
      const scrollPosition = letterScrollArea.scrollTop + letterScrollArea.clientHeight;
      const totalHeight = letterScrollArea.scrollHeight;
      if (scrollPosition >= totalHeight - 15) {
        letterNextBtn.classList.add("visible");
      }
    });
  }

  // --- ROUTING / FLOW CONTROLS ---
  function startExperience() {
    if (bgMusic) bgMusic.play().catch(() => {});
    currentPageState = "page2";
    showPage(page2);
  }

  function goToMemoryBook() {
    currentPageState = "memory";
    currentMemoryIndex = 1;
    memoryImage.src = `assets/memory-1.png`;
    memoryImageUnder.src = `assets/memory-2.png`;
    memoryCounter.textContent = `1 / ${totalMemories}`;
    resetZoom();
    showPage(pageMemory);
  }

  function nextMemoryOrPage() {
    if (isFlipping) return;
    if (currentMemoryIndex < totalMemories) {
      changeMemoryWithFlip(currentMemoryIndex + 1, "next");
    } else {
      goToLetterPage();
    }
  }

  function goToLetterPage() {
    currentPageState = "letter";
    showPage(pageLetter);
    pageLetter.classList.remove("open");
    if (cardTop) cardTop.classList.remove("slide-up");
    if (cardBottom) cardBottom.classList.remove("slide-down");
    letterNextBtn.classList.remove("visible");
    if (letterScrollArea) letterScrollArea.scrollTop = 0;
  }

  function goToVideoPage() {
    currentPageState = "video";
    showPage(pageVideo);
    if (videoScrollArea) videoScrollArea.scrollTop = 0;
    
    // Play videos
    if (video1) { video1.currentTime = 0; video1.play().catch(() => {}); }
    if (video2) { video2.currentTime = 0; video2.play().catch(() => {}); }
  }

  function goToFinalPage() {
    currentPageState = "final";
    showPage(pageFinal);
    startSimpleConfetti();
  }

  function restartWebsite() {
    stopConfetti();
    currentPageState = "page1";
    showPage(page1);
  }

  // --- EVENT LISTENERS ---
  btnStart.addEventListener("click", startExperience);
  p2BackBtn.addEventListener("click", (e) => { e.stopPropagation(); showPage(page1); });
  p2MainContent.addEventListener("click", goToMemoryBook);

  memNextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextMemoryOrPage(); });
  memBackBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentMemoryIndex > 1) {
      changeMemoryWithFlip(currentMemoryIndex - 1, "prev");
    } else {
      showPage(page2);
    }
  });

  scrapbookPage.addEventListener("click", () => {
    if (scale === 1 && !isFlipping) nextMemoryOrPage();
  });

  letterBackBtn.addEventListener("click", () => {
    currentMemoryIndex = totalMemories;
    memoryImage.src = `assets/memory-${totalMemories}.png`;
    memoryCounter.textContent = `${totalMemories} / ${totalMemories}`;
    showPage(pageMemory);
  });

  letterNextBtn.addEventListener("click", goToVideoPage);

  videoBackBtn.addEventListener("click", goToLetterPage);

  if (replayV1) replayV1.addEventListener("click", () => { video1.currentTime = 0; video1.play(); });
  if (replayV2) replayV2.addEventListener("click", () => { video2.currentTime = 0; video2.play(); });

  videoFooterTrigger.addEventListener("click", goToFinalPage);
  finalClickArea.addEventListener("click", restartWebsite);

  // --- SIMPLE FALLING CONFETTI ANIMATION ---
  let confettiAnimationId = null;
  let particles = [];

  function startSimpleConfetti() {
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = pageFinal.clientWidth;
    confettiCanvas.height = pageFinal.clientHeight;

    const colors = ["#ff71ce", "#01cdfe", "#05ffa1", "#b967ff", "#fffb96"];
    particles = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 2 + 1.5,
        speedX: Math.random() * 1 - 0.5
      });
    }

    function render() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > confettiCanvas.height) {
          p.y = -10;
          p.x = Math.random() * confettiCanvas.width;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      confettiAnimationId = requestAnimationFrame(render);
    }

    render();
  }

  function stopConfetti() {
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
  }
});
