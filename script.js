document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // ELEMENTS
  // =====================================================

  const cover = document.getElementById("cover");
  const page2 = document.getElementById("page2");
  const memoryBook = document.getElementById("memoryBook");
  const letterSection = document.getElementById("letterSection");
  const videoSection = document.getElementById("videoSection");
  const finalSection = document.getElementById("finalSection");

  const music = document.getElementById("birthdayMusic");


  // =====================================================
  // BUTTONS
  // =====================================================

  const openButton = document.getElementById("openButton");

  const continueButton = document.getElementById("continueButton");

  const birthdayBackButton =
    document.getElementById("birthdayBackButton");

  const memoryBackButton =
    document.getElementById("memoryBackButton");

  const memoryNextButton =
    document.getElementById("memoryNextButton");

  const memorySectionBackButton =
    document.getElementById("memorySectionBackButton");

  const memoryLetterButton =
    document.getElementById("memoryLetterButton");

  const letterBackButton =
    document.getElementById("letterBackButton");

  const letterVideoButton =
    document.getElementById("letterVideoButton");

  const videoBackButton =
    document.getElementById("videoBackButton");


  // =====================================================
  // MEMORY ELEMENTS
  // =====================================================

  const memoryPages =
    document.querySelectorAll(".memory-page");

  const memoryCounter =
    document.getElementById("memoryCounter");

  const memoryHint =
    document.getElementById("memoryHint");

  const zoomAreas =
    document.querySelectorAll(".memory-zoom-area");


  // =====================================================
  // STATE
  // =====================================================

  let currentMemoryPage = 0;

  let currentScreen = "cover";


  // =====================================================
  // STARTING STATE
  // =====================================================

  function hideAllScreens() {

    const screens = [
      cover,
      page2,
      memoryBook,
      letterSection,
      videoSection,
      finalSection
    ];

    screens.forEach((screen) => {

      if (!screen) return;

      screen.classList.remove("show");

      screen.setAttribute(
        "aria-hidden",
        "true"
      );

      screen.style.display = "none";

    });

  }


  function showScreen(screen, screenName) {

    if (!screen) return;

    hideAllScreens();

    screen.style.display = "flex";

    screen.setAttribute(
      "aria-hidden",
      "false"
    );

    requestAnimationFrame(() => {

      screen.classList.add("show");

    });

    currentScreen = screenName;

  }


  // Start on Page 1

  hideAllScreens();

  if (cover) {

    cover.style.display = "flex";

    cover.classList.add("show");

    cover.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  // =====================================================
  // MUSIC
  // =====================================================

  async function startMusic() {

    if (!music) return;

    try {

      music.volume = 0.65;

      await music.play();

    } catch (error) {

      console.log(
        "Music playback was blocked until another interaction."
      );

    }

  }


  function stopMusic() {

    if (!music) return;

    music.pause();

  }


  // =====================================================
  // PAGE 1 → PAGE 2
  // =====================================================

  if (openButton) {

    openButton.addEventListener(
      "click",
      async () => {

        await startMusic();

        if (cover) {

          cover.classList.add("leaving");

        }

        setTimeout(() => {

          showScreen(
            page2,
            "page2"
          );

        }, 650);

      }
    );

  }


  // =====================================================
  // PAGE 2 → MEMORY BOOK
  // =====================================================

  if (continueButton) {

    continueButton.addEventListener(
      "click",
      () => {

        resetMemoryBook();

        showScreen(
          memoryBook,
          "memoryBook"
        );

      }
    );

  }


  // =====================================================
  // PAGE 2 → PAGE 1
  // =====================================================

  if (birthdayBackButton) {

    birthdayBackButton.addEventListener(
      "click",
      () => {

        showScreen(
          cover,
          "cover"
        );

      }
    );

  }


  // =====================================================
  // MEMORY BOOK
  // =====================================================

  function showMemoryPage(index) {

    if (!memoryPages.length) return;


    // Keep the number within the available pages

    if (index < 0) {

      index = 0;

    }

    if (index >= memoryPages.length) {

      index = memoryPages.length - 1;

    }


    currentMemoryPage = index;


    memoryPages.forEach(
      (page, pageIndex) => {

        if (pageIndex === currentMemoryPage) {

          page.classList.add("active");

        } else {

          page.classList.remove("active");

        }

      }
    );


    // Every time we change memory,
    // return the image to normal zoom.

    resetAllMemoryZoom();


    updateMemoryControls();

  }


  // =====================================================
  // MEMORY NEXT
  // =====================================================

  if (memoryNextButton) {

    memoryNextButton.addEventListener(
      "click",
      () => {

        if (
          currentMemoryPage <
          memoryPages.length - 1
        ) {

          showMemoryPage(
            currentMemoryPage + 1
          );

        } else {

          // At Memory 8:
          // the next button becomes the way
          // to continue to the letter.

          openLetterPage();

        }

      }
    );

  }


  // =====================================================
  // MEMORY BACK
  // =====================================================

  if (memoryBackButton) {

    memoryBackButton.addEventListener(
      "click",
      () => {

        if (currentMemoryPage > 0) {

          showMemoryPage(
            currentMemoryPage - 1
          );

        }

      }
    );

  }


  // =====================================================
  // MEMORY BOOK → PAGE 2
  // =====================================================

  if (memorySectionBackButton) {

    memorySectionBackButton.addEventListener(
      "click",
      () => {

        showScreen(
          page2,
          "page2"
        );

      }
    );

  }


  // =====================================================
  // MEMORY BOOK → LETTER
  // =====================================================

  if (memoryLetterButton) {

    memoryLetterButton.addEventListener(
      "click",
      () => {

        openLetterPage();

      }
    );

  }


  function openLetterPage() {

    if (!letterSection) return;


    // Only allow this naturally after Memory 8

    if (
      currentMemoryPage <
      memoryPages.length - 1
    ) {

      return;

    }


    showScreen(
      letterSection,
      "letter"
    );


    prepareLetterPage();

  }


  // =====================================================
  // MEMORY CONTROLS
  // =====================================================

  function updateMemoryControls() {

    if (memoryCounter) {

      memoryCounter.textContent =
        `${currentMemoryPage + 1} / ${memoryPages.length}`;

    }


    // Previous button

    if (memoryBackButton) {

      if (currentMemoryPage === 0) {

        memoryBackButton.style.visibility =
          "hidden";

      } else {

        memoryBackButton.style.visibility =
          "visible";

      }

    }


    // Next button

    if (memoryNextButton) {

      if (
        currentMemoryPage ===
        memoryPages.length - 1
      ) {

        memoryNextButton.innerHTML =
          "→";

      } else {

        memoryNextButton.innerHTML =
          "→";

      }

    }


    // Memory hint

    if (memoryHint) {

      if (
        currentMemoryPage ===
        memoryPages.length - 1
      ) {

        memoryHint.textContent =
          "one more thing...";

      } else {

        memoryHint.textContent =
          "click to turn the page";

      }

    }


    // Continue-to-letter button

    if (memoryLetterButton) {

      if (
        currentMemoryPage ===
        memoryPages.length - 1
      ) {

        memoryLetterButton.classList.add(
          "visible"
        );

      } else {

        memoryLetterButton.classList.remove(
          "visible"
        );

      }

    }

  }


  // =====================================================
  // RESET MEMORY BOOK
  // =====================================================

  function resetMemoryBook() {

    currentMemoryPage = 0;

    memoryPages.forEach(
      (page, index) => {

        page.classList.toggle(
          "active",
          index === 0
        );

      }
    );

    resetAllMemoryZoom();

    updateMemoryControls();

  }


  // =====================================================
  // MEMORY IMAGE ZOOM
  //
  // Supports:
  //
  // - double tap
  // - pinch zoom
  // - mouse wheel on desktop
  //
  // The zoom only affects the memory image.
  // It does NOT zoom the entire website.
  // =====================================================

  const zoomState = new Map();


  function createZoomState(area) {

    if (!zoomState.has(area)) {

      zoomState.set(
        area,
        {
          scale: 1,
          x: 0,
          y: 0,
          startDistance: 0,
          startScale: 1,
          lastTap: 0,
          dragging: false,
          startX: 0,
          startY: 0,
          startPanX: 0,
          startPanY: 0
        }
      );

    }

    return zoomState.get(area);

  }


  function clamp(value, min, max) {

    return Math.max(
      min,
      Math.min(max, value)
    );

  }


  function applyZoom(area) {

    const state =
      createZoomState(area);

    const image =
      area.querySelector(".memory-image");

    if (!image) return;


    const scale =
      clamp(
        state.scale,
        1,
        3
      );


    state.scale = scale;


    // When completely zoomed out,
    // return the image to its natural position.

    if (scale === 1) {

      state.x = 0;
      state.y = 0;

    }


    image.style.transform =
      `translate(${state.x}px, ${state.y}px) scale(${scale})`;

  }


  function resetMemoryZoom(area) {

    if (!area) return;

    const state =
      createZoomState(area);

    state.scale = 1;

    state.x = 0;

    state.y = 0;

    state.startDistance = 0;

    state.startScale = 1;

    state.dragging = false;

    applyZoom(area);

  }


  function resetAllMemoryZoom() {

    zoomAreas.forEach(
      (area) => {

        resetMemoryZoom(area);

      }
    );

  }


  function getTouchDistance(
    touch1,
    touch2
  ) {

    const dx =
      touch2.clientX -
      touch1.clientX;

    const dy =
      touch2.clientY -
      touch1.clientY;

    return Math.sqrt(
      dx * dx +
      dy * dy
    );

  }


  // =====================================================
  // SET UP EACH MEMORY ZOOM AREA
  // =====================================================

  zoomAreas.forEach(
    (area) => {

      const image =
        area.querySelector(".memory-image");

      if (!image) return;


      const state =
        createZoomState(area);


      // -----------------------------------------------
      // DOUBLE TAP
      // -----------------------------------------------

      area.addEventListener(
        "touchend",
        (event) => {

          if (
            event.changedTouches.length !== 1
          ) {
            return;
          }


          const now =
            Date.now();


          const timeSinceLastTap =
            now - state.lastTap;


          if (
            timeSinceLastTap < 300 &&
            timeSinceLastTap > 0
          ) {

            event.preventDefault();


            if (state.scale > 1) {

              resetMemoryZoom(area);

            } else {

              state.scale = 2;

              applyZoom(area);

            }

          }


          state.lastTap = now;

        },
        {
          passive: false
        }
      );


      // -----------------------------------------------
      // PINCH START
      // -----------------------------------------------

      area.addEventListener(
        "touchstart",
        (event) => {

          if (
            event.touches.length === 2
          ) {

            event.preventDefault();

            state.startDistance =
              getTouchDistance(
                event.touches[0],
                event.touches[1]
              );

            state.startScale =
              state.scale;

          }

        },
        {
          passive: false
        }
      );


      // -----------------------------------------------
      // PINCH MOVE
      // -----------------------------------------------

      area.addEventListener(
        "touchmove",
        (event) => {

          if (
            event.touches.length === 2
          ) {

            event.preventDefault();


            const currentDistance =
              getTouchDistance(
                event.touches[0],
                event.touches[1]
              );


            if (
              state.startDistance <= 0
            ) {
              return;
            }


            const ratio =
              currentDistance /
              state.startDistance;


            state.scale =
              clamp(
                state.startScale * ratio,
                1,
                3
              );


            applyZoom(area);

          }

        },
        {
          passive: false
        }
      );


      // -----------------------------------------------
      // MOUSE WHEEL ZOOM
      // Desktop / laptop
      // -----------------------------------------------

      area.addEventListener(
        "wheel",
        (event) => {

          if (
            !event.ctrlKey &&
            !event.metaKey
          ) {

            return;

          }


          event.preventDefault();


          const amount =
            event.deltaY < 0
              ? 0.2
              : -0.2;


          state.scale =
            clamp(
              state.scale + amount,
              1,
              3
            );


          applyZoom(area);

        },
        {
          passive: false
        }
      );


      // -----------------------------------------------
      // DOUBLE CLICK DESKTOP
      // -----------------------------------------------

      area.addEventListener(
        "dblclick",
        (event) => {

          event.preventDefault();


          if (state.scale > 1) {

            resetMemoryZoom(area);

          } else {

            state.scale = 2;

            applyZoom(area);

          }

        }
      );


      // -----------------------------------------------
      // MOUSE DRAG WHEN ZOOMED
      // -----------------------------------------------

      area.addEventListener(
        "mousedown",
        (event) => {

          if (
            state.scale <= 1
          ) {
            return;
          }


          state.dragging = true;

          state.startX =
            event.clientX;

          state.startY =
            event.clientY;

          state.startPanX =
            state.x;

          state.startPanY =
            state.y;


          area.classList.add(
            "is-dragging"
          );

        }
      );


      window.addEventListener(
        "mousemove",
        (event) => {

          if (
            !state.dragging
          ) {
            return;
          }


          const dx =
            event.clientX -
            state.startX;

          const dy =
            event.clientY -
            state.startY;


          state.x =
            state.startPanX + dx;

          state.y =
            state.startPanY + dy;


          applyZoom(area);

        }
      );


      window.addEventListener(
        "mouseup",
        () => {

          state.dragging = false;

          area.classList.remove(
            "is-dragging"
          );

        }
      );


    }
  );


  // =====================================================
  // LETTER
  // =====================================================

  const closedLetter =
    document.getElementById("closedLetter");

  const openLetter =
    document.getElementById("openLetter");

  const letterScrollArea =
    document.getElementById("letterScrollArea");


  function prepareLetterPage() {

    if (!closedLetter) return;

    if (openLetter) {

      openLetter.classList.remove(
        "letter-visible"
      );

    }

    closedLetter.classList.remove(
      "letter-opening"
    );

    if (letterScrollArea) {

      letterScrollArea.scrollTop = 0;

    }

  }


  // -----------------------------------------------
  // OPEN FOLDED LETTER
  // -----------------------------------------------

  if (closedLetter) {

    closedLetter.addEventListener(
      "click",
      () => {

        closedLetter.classList.add(
          "letter-opening"
        );


        setTimeout(
          () => {

            closedLetter.style.display =
              "none";


            if (openLetter) {

              openLetter.classList.add(
                "letter-visible"
              );

            }

          },
          850
        );

      }
    );

  }


  // =====================================================
  // LETTER → MEMORY BOOK
  // =====================================================

  if (letterBackButton) {

    letterBackButton.addEventListener(
      "click",
      () => {

        showScreen(
          memoryBook,
          "memoryBook"
        );


        // Return to Memory 8

        showMemoryPage(
          memoryPages.length - 1
        );

      }
    );

  }


  // =====================================================
  // LETTER → VIDEO
  // =====================================================

  if (letterVideoButton) {

    letterVideoButton.addEventListener(
      "click",
      () => {

        openVideoPage();

      }
    );

  }


  function openVideoPage() {

    // Letter music stops when entering video.

    stopMusic();


    showScreen(
      videoSection,
      "video"
    );


    // If a video exists later,
    // we'll start it here.

    const memoryVideo =
      document.getElementById(
        "memoryVideo"
      );


    if (memoryVideo) {

      memoryVideo.currentTime = 0;

      memoryVideo.play().catch(
        () => {
          console.log(
            "Video requires user interaction."
          );
        }
      );

    }

  }


  // =====================================================
  // VIDEO → LETTER
  // =====================================================

  if (videoBackButton) {

    videoBackButton.addEventListener(
      "click",
      () => {

        showScreen(
          letterSection,
          "letter"
        );

      }
    );

  }


  // =====================================================
  // KEYBOARD NAVIGATION
  // =====================================================

  document.addEventListener(
    "keydown",
    (event) => {

      // -----------------------------------------------
      // MEMORY BOOK
      // -----------------------------------------------

      if (
        currentScreen === "memoryBook"
      ) {


        if (
          event.key === "ArrowRight"
        ) {

          if (
            currentMemoryPage <
            memoryPages.length - 1
          ) {

            showMemoryPage(
              currentMemoryPage + 1
            );

          } else {

            openLetterPage();

          }

        }


        if (
          event.key === "ArrowLeft"
        ) {

          if (
            currentMemoryPage > 0
          ) {

            showMemoryPage(
              currentMemoryPage - 1
            );

          } else {

            showScreen(
              page2,
              "page2"
            );

          }

        }

      }


      // -----------------------------------------------
      // PAGE 2
      // -----------------------------------------------

      if (
        currentScreen === "page2" &&
        event.key === "ArrowLeft"
      ) {

        showScreen(
          cover,
          "cover"
        );

      }

    }
  );


  // =====================================================
  // PREVENT ACCIDENTAL BODY SCROLLING
  // =====================================================

  document.addEventListener(
    "touchmove",
    (event) => {

      // Allow scrolling only inside the letter.

      if (
        currentScreen === "letter" &&
        letterScrollArea &&
        letterScrollArea.contains(
          event.target
        )
      ) {

        return;

      }


      // Everything else stays fixed.

      if (
        !(
          currentScreen === "letter" &&
          letterScrollArea &&
          letterScrollArea.contains(
            event.target
          )
        )
      ) {

        event.preventDefault();

      }

    },
    {
      passive: false
    }
  );


  // =====================================================
  // INITIAL MEMORY STATE
  // =====================================================

  resetMemoryBook();


  // =====================================================
  // END
  // =====================================================

});
