document.addEventListener("DOMContentLoaded", () => {
  // --- DOM ELEMENTS ---
  const bgMusic = document.getElementById("bg-music");

  // Pages
  const page1 = document.getElementById("page-1");
  const page2 = document.getElementById("page-2");
  const pageMemory = document.getElementById("page-memory-book");
  const pageLetter = document.getElementById("page-letter");
  const pageVideos = document.getElementById("page-videos");
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

  const videosBackBtn = document.getElementById("videos-back-btn");
  const videoScrollArea = document.getElementById("video-scroll-area");
  const video1 = document.getElementById("video-1");
  const video2 = document.getElementById("video-2");
  const repeatBtns = document.querySelectorAll(".repeat-btn");
  const videoEndTrigger = document.getElementById("video-end-trigger");

  const finalScreenClick = document.getElementById("final-screen-click");
  const confettiCanvas = document.getElementById("confetti-canvas");

  // Letter & Split Cover Elements
  const cardTop = document.getElementById("card-top");
  const cardBottom = document.getElementById("card-bottom");
  const clickPrompt = document.getElementById("click-prompt");
  const letterScrollArea = document.getElementById("letter-scroll-area");

  // --- STATE ---
  let currentPageState = "page1"; // 'page1', 'page2', 'memory', 'letter', 'videos', 'final'
  let currentMemoryIndex = 1;
  const totalMemories = 8;
  let isFlipping = false;
  let isLetterOpen = false;
  let confettiAnimationId = null;

  // Zoom / Drag / Pinch State
  let scale = 1;
  let pointX = 0;
  let pointY = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let initialPinchDistance = 0;
  let initialPinchScale = 1;

  // Touch State
  let lastTapTime = 0;

  // --- PAGE NAVIGATION ---
  function showPage(pageToShow) {
    [page1, page2, pageMemory, pageLetter, pageVideos, pageFinal].forEach((p) => {
      p.classList.add("hidden");
      p.classList.remove("active");
    });

    pageToShow.classList.remove("hidden");
    pageToShow.classList.add("active");
  }

  // --- PAGE TURN ANIMATION ---
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

    if (scale === 1) {
      pointX = 0;
      pointY = 0;
    }

    memoryImage.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
  }

  // --- SPLIT CARD COVER TOGGLE ---
  function openLetterCard() {
    pageLetter.classList.add("open");
    cardTop.classList.add("slide-up");
    cardBottom.classList.add("slide-down");
    isLetterOpen = true;
  }

  if (cardTop) cardTop.addEventListener("click", openLetterCard);
  if (cardBottom) cardBottom.addEventListener("click", openLetterCard);
  if (clickPrompt) clickPrompt.addEventListener("click", openLetterCard);

  // Reveal next button when scrolled to bottom of letter
  if (letterScrollArea) {
    letterScrollArea.addEventListener("scroll", () => {
      const scrollPosition = letterScrollArea.scrollTop + letterScrollArea.clientHeight;
      const totalHeight = letterScrollArea.scrollHeight;

      if (scrollPosition >= totalHeight - 15) {
        letterNextBtn.classList.add("visible");
      }
    });
  }

  // --- NAVIGATION ACTIONS ---
  function startExperience() {
    if (bgMusic) {
      bgMusic.play().catch((err) => console.log("Audio play deferred:", err));
    }
    currentPageState = "page2";
    showPage(page2);
  }

  function goBackFromPage2() {
    currentPageState = "page1";
    showPage(page1);
  }

  function goToMemoryBook() {
    currentPageState = "memory";
    currentMemoryIndex = 1;
    memoryImage.src = `assets/memory-1.png`;
    memoryImageUnder.src = `assets/memory-2.png`;
    memoryImage.alt = `Memory 1`;
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

  function previousMemoryOrPage() {
    if (isFlipping) return;

    if (currentMemoryIndex > 1) {
      changeMemoryWithFlip(currentMemoryIndex - 1, "prev");
    } else {
      currentPageState = "page2";
      showPage(page2);
    }
  }

  function goToLetterPage() {
    currentPageState = "letter";
    showPage(pageLetter);
    pageLetter.classList.remove("open");
    if (cardTop) cardTop.classList.remove("slide-up");
    if (cardBottom) cardBottom.classList.remove("slide-down");
    isLetterOpen = false;
    letterNextBtn.classList.remove("visible");
    if (letterScrollArea) letterScrollArea.scrollTop = 0;
  }

  function goBackFromLetter() {
    currentPageState = "memory";
    currentMemoryIndex = totalMemories;
    memoryImage.src = `assets/memory-${totalMemories}.png`;
    memoryImageUnder.src = `assets/memory-${totalMemories}.png`;
    memoryImage.alt = `Memory ${totalMemories}`;
    memoryCounter.textContent = `${totalMemories} / ${totalMemories}`;
    resetZoom();
    showPage(pageMemory);
  }

  function goToVideosPage() {
    currentPageState = "videos";
    showPage(pageVideos);
    if (videoScrollArea) videoScrollArea.scrollTop = 0;
    if (video1) {
      video1.currentTime = 0;
      video1.play().catch(() => {});
    }
  }

  // Auto-play videos on scroll
  if (videoScrollArea) {
    videoScrollArea.addEventListener("scroll", () => {
      const containerHeight = videoScrollArea.clientHeight;
      const scrollTop = videoScrollArea.scrollTop;

      if (scrollTop < containerHeight * 0.5) {
        if (video1 && video1.paused) video1.play().catch(() => {});
      } else if (scrollTop >= containerHeight * 0.5 && scrollTop < containerHeight * 1.5) {
        if (video2 && video2.paused) video2.play().catch(() => {});
      }
    });
  }

  function goBackFromVideos() {
    if (video1) video1.pause();
    if (video2) video2.pause();
    currentPageState = "letter";
    showPage(pageLetter);
  }

  function goToFinalPage() {
    if (video1) video1.pause();
    if (video2) video2.pause();
    currentPageState = "final";
    showPage(pageFinal);
    startConfetti();
  }

  function restartWebsite() {
    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    currentPageState = "page1";
    showPage(page1);
  }

  // Repeat Video Action
  repeatBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const videoId = btn.getAttribute("data-video");
      const vid = document.getElementById(videoId);
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    });
  });

  // Confetti Animation
  function startConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = confettiCanvas.clientWidth;
    confettiCanvas.height = confettiCanvas.clientHeight;

    const pieces = [];
    const colors = ["#fef5d5", "#eab4b4", "#d1be8e", "#ffffff", "#8c7667"];

    for (let i = 0; i < 60; i++) {
      pieces.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        size: Math.random() * 6 + 4,
        speedY: Math.random() * 2 + 1.5,
        speedX: Math.random() * 1 - 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function render() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      pieces.forEach((p) => {
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

  // --- EVENT LISTENERS ---
  btnStart.addEventListener("click", startExperience);

  p2BackBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goBackFromPage2();
  });

  p2MainContent.addEventListener("click", goToMemoryBook);

  memNextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nextMemoryOrPage();
  });

  memBackBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    previousMemoryOrPage();
  });

  scrapbookPage.addEventListener("click", () => {
    if (scale === 1 && !isFlipping) {
      nextMemoryOrPage();
    }
  });

  letterBackBtn.addEventListener("click", goBackFromLetter);
  letterNextBtn.addEventListener("click", goToVideosPage);

  videosBackBtn.addEventListener("click", goBackFromVideos);
  videoEndTrigger.addEventListener("click", goToFinalPage);

  finalScreenClick.addEventListener("click", restartWebsite);

  // --- KEYBOARD CONTROLS ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      if (currentPageState === "page1") {
        startExperience();
      } else if (currentPageState === "page2") {
        goToMemoryBook();
      } else if (currentPageState === "memory") {
        nextMemoryOrPage();
      } else if (currentPageState === "letter" && letterNextBtn.classList.contains("visible")) {
        goToVideosPage();
      }
    } else if (e.key === "ArrowLeft") {
      if (currentPageState === "page2") {
        goBackFromPage2();
      } else if (currentPageState === "memory") {
        previousMemoryOrPage();
      } else if (currentPageState === "letter") {
        goBackFromLetter();
      } else if (currentPageState === "videos") {
        goBackFromVideos();
      }
    }
  });

  // ==========================================================================
  // FULL ZOOM & DRAG & PINCH IMPLEMENTATION FOR MEMORY IMAGE
  // ==========================================================================
  memoryImage.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      scale *= zoomFactor;
      applyTransform();
    },
    { passive: false }
  );

  memoryImage.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    if (scale > 1) {
      resetZoom();
    } else {
      scale = 2.5;
      applyTransform();
    }
  });

  memoryImage.addEventListener("mousedown", (e) => {
    if (scale > 1) {
      e.stopPropagation();
      isDragging = true;
      startX = e.clientX - pointX;
      startY = e.clientY - pointY;
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      pointX = e.clientX - startX;
      pointY = e.clientY - startY;
      applyTransform();
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch: Pinch-to-zoom and Double Tap
  function getPinchDistance(touches) {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  }

  memoryImage.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastTapTime < 300) {
          e.preventDefault();
          if (scale > 1) {
            resetZoom();
          } else {
            scale = 2.5;
            applyTransform();
          }
        }
        lastTapTime = now;

        if (scale > 1) {
          isDragging = true;
          startX = e.touches[0].clientX - pointX;
          startY = e.touches[0].clientY - startY;
        }
      } else if (e.touches.length === 2) {
        isDragging = false;
        initialPinchDistance = getPinchDistance(e.touches);
        initialPinchScale = scale;
      }
    },
    { passive: false }
  );

  memoryImage.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getPinchDistance(e.touches);
        if (initialPinchDistance > 0) {
          scale = initialPinchScale * (currentDistance / initialPinchDistance);
          applyTransform();
        }
      } else if (isDragging && scale > 1 && e.touches.length === 1) {
        e.preventDefault();
        pointX = e.touches[0].clientX - startX;
        pointY = e.touches[0].clientY - startY;
        applyTransform();
      }
    },
    { passive: false }
  );

  memoryImage.addEventListener("touchend", () => {
    isDragging = false;
    initialPinchDistance = 0;
  });
});
