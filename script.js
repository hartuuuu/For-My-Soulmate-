document.addEventListener("DOMContentLoaded", () => {
  // --- DOM ELEMENTS ---
  const bgMusic = document.getElementById("bg-music");

  // Pages
  const page1 = document.getElementById("page-1");
  const page2 = document.getElementById("page-2");
  const pageMemory = document.getElementById("page-memory-book");
  const pageTemp = document.getElementById("page-temp");

  // Buttons & Click Areas
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

  const tempBackBtn = document.getElementById("temp-back-btn");

  // --- STATE ---
  let currentPageState = "page1"; // 'page1', 'page2', 'memory', 'temp'
  let currentMemoryIndex = 1;
  const totalMemories = 8;
  let isFlipping = false;

  // Zoom / Drag State
  let scale = 1;
  let pointX = 0;
  let pointY = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  // Touch State
  let initialPinchDistance = null;
  let initialScale = 1;
  let lastTapTime = 0;

  // --- PAGE NAVIGATION ---
  function showPage(pageToShow) {
    [page1, page2, pageMemory, pageTemp].forEach((p) => {
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

    // Set underlay image to destination page
    memoryImageUnder.src = `assets/memory-${newIndex}.png`;

    const flipClass = direction === "next" ? "turn-next" : "turn-prev";
    flipCard.classList.add(flipClass);

    // Complete the page turn and snap active element to the new image
    setTimeout(() => {
      currentMemoryIndex = newIndex;
      memoryImage.src = `assets/memory-${newIndex}.png`;
      memoryImage.alt = `Memory ${newIndex}`;
      memoryCounter.textContent = `${newIndex} / ${totalMemories}`;

      // Reset underlay for next turn
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
      currentPageState = "temp";
      showPage(pageTemp);
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

  function goBackFromTemp() {
    currentPageState = "memory";
    currentMemoryIndex = totalMemories;
    memoryImage.src = `assets/memory-${totalMemories}.png`;
    memoryImageUnder.src = `assets/memory-${totalMemories}.png`;
    memoryImage.alt = `Memory ${totalMemories}`;
    memoryCounter.textContent = `${totalMemories} / ${totalMemories}`;
    resetZoom();
    showPage(pageMemory);
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

  scrapbookPage.addEventListener("click", (e) => {
    if (scale === 1 && !isFlipping) {
      nextMemoryOrPage();
    }
  });

  tempBackBtn.addEventListener("click", goBackFromTemp);

  // --- KEYBOARD SUPPORT ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      if (currentPageState === "page1") {
        startExperience();
      } else if (currentPageState === "page2") {
        goToMemoryBook();
      } else if (currentPageState === "memory") {
        nextMemoryOrPage();
      }
    } else if (e.key === "ArrowLeft") {
      if (currentPageState === "page2") {
        goBackFromPage2();
      } else if (currentPageState === "memory") {
        previousMemoryOrPage();
      } else if (currentPageState === "temp") {
        goBackFromTemp();
      }
    }
  });

  // --- ZOOM & DRAG IMPLEMENTATION ---
  memoryImage.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.metaKey || scale > 1) {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
        scale *= zoomFactor;
        applyTransform();
      }
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

  function getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
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
            scale = 2;
            applyTransform();
          }
        }
        lastTapTime = now;

        if (scale > 1) {
          isDragging = true;
          startX = e.touches[0].clientX - pointX;
          startY = e.touches[0].clientY - pointY;
        }
      } else if (e.touches.length === 2) {
        e.preventDefault();
        isDragging = false;
        initialPinchDistance = getPinchDistance(e.touches);
        initialScale = scale;
      }
    },
    { passive: false }
  );

  memoryImage.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 1 && isDragging && scale > 1) {
        e.preventDefault();
        pointX = e.touches[0].clientX - startX;
        pointY = e.touches[0].clientY - startY;
        applyTransform();
      } else if (e.touches.length === 2 && initialPinchDistance) {
        e.preventDefault();
        const currentDistance = getPinchDistance(e.touches);
        const factor = currentDistance / initialPinchDistance;
        scale = initialScale * factor;
        applyTransform();
      }
    },
    { passive: false }
  );

  memoryImage.addEventListener("touchend", (e) => {
    if (e.touches.length < 2) {
      initialPinchDistance = null;
    }
    if (e.touches.length === 0) {
      isDragging = false;
    }
  });
});
