/* =========================================================
   A LITTLE SOMETHING FOR YOU
   SCRIPT.JS
   ========================================================= */

/* ---------------------------------------------------------
   SCREEN ELEMENTS
--------------------------------------------------------- */

const cover = document.getElementById("cover");
const birthday = document.getElementById("birthday");
const memories = document.getElementById("memories");
const afterMemories = document.getElementById("after-memories");

const openButton = document.getElementById("openButton");
const birthdayInner = document.querySelector(".birthday-inner");

const birthdayMusic = document.getElementById("birthdayMusic");

const birthdayBack = document.getElementById("birthdayBack");
const memoryBack = document.getElementById("memoryBack");
const afterBack = document.getElementById("afterBack");

const memoryBook = document.getElementById("memoryBook");
const memoryPages = Array.from(
  document.querySelectorAll(".memory-page")
);

const memoryCounter = document.getElementById("memoryCounter");
const memoryHint = document.getElementById("memoryHint");
const memoryNext = document.getElementById("memoryNext");

const zoomAreas = Array.from(
  document.querySelectorAll(".memory-zoom-area")
);


/* ---------------------------------------------------------
   SCREEN STATE
--------------------------------------------------------- */

let currentScreen = "cover";
let currentMemory = 0;


/* ---------------------------------------------------------
   SHOW SCREEN
--------------------------------------------------------- */

function showScreen(screen) {
  [cover, birthday, memories, afterMemories].forEach((section) => {
    if (section) {
      section.classList.remove("active");
    }
  });

  if (screen) {
    screen.classList.add("active");
  }

  if (screen === cover) {
    currentScreen = "cover";
  } else if (screen === birthday) {
    currentScreen = "birthday";
  } else if (screen === memories) {
    currentScreen = "memories";
  } else if (screen === afterMemories) {
    currentScreen = "after";
  }
}


/* =========================================================
   PAGE 1 → PAGE 2
========================================================= */

if (openButton) {
  openButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (birthdayMusic) {
      birthdayMusic.volume = 0.7;

      const playPromise = birthdayMusic.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser may block autoplay until another interaction.
        });
      }
    }

    showScreen(birthday);
  });
}


/* =========================================================
   PAGE 2 → MEMORY BOOK
========================================================= */

if (birthdayInner) {
  birthdayInner.addEventListener("click", (event) => {
    /*
      The back button lives inside .birthday-inner,
      so don't let clicking it open the memory book.
    */
    if (event.target.closest("#birthdayBack")) {
      return;
    }

    showScreen(memories);
  });
}


/* =========================================================
   PAGE 2 ← PAGE 1
========================================================= */

if (birthdayBack) {
  birthdayBack.addEventListener("click", (event) => {
    event.stopPropagation();

    showScreen(cover);
  });
}


/* =========================================================
   MEMORY BOOK UI
========================================================= */

function updateMemoryUI() {
  if (!memoryCounter || !memoryHint) {
    return;
  }

  const total = memoryPages.length;

  memoryCounter.textContent =
    `${currentMemory + 1} / ${total}`;

  if (currentMemory === total - 1) {
    memoryHint.textContent =
      "one more thing... ♡";
  } else {
    memoryHint.textContent =
      "click to turn the page →";
  }
}


/* =========================================================
   MEMORY PAGE TURNING
========================================================= */

function turnNextPage() {
  const total = memoryPages.length;

  if (currentMemory < total - 1) {
    /*
      Flip the current page away,
      then move to the next one.
    */
    memoryPages[currentMemory].classList.add("flipped");

    currentMemory++;

    resetAllZoom();

    updateMemoryUI();

    return;
  }

  /*
    We have reached the end of the memory book.
  */
  resetAllZoom();
  showScreen(afterMemories);
}


/* =========================================================
   MEMORY BOOK → BACK
========================================================= */

function goBackMemory() {
  /*
    If we're on the first memory page,
    go back to the birthday page.
  */
  if (currentMemory === 0) {
    resetAllZoom();
    showScreen(birthday);
    return;
  }

  /*
    Move one memory page backward.
  */
  memoryPages[currentMemory - 1].classList.remove("flipped");

  currentMemory--;

  resetAllZoom();
  updateMemoryUI();
}


if (memoryBack) {
  memoryBack.addEventListener("click", (event) => {
    event.stopPropagation();

    goBackMemory();
  });
}


/* =========================================================
   MEMORY NEXT BUTTON
========================================================= */

if (memoryNext) {
  memoryNext.addEventListener("click", (event) => {
    event.stopPropagation();

    turnNextPage();
  });
}


/* =========================================================
   MEMORY BOOK CLICK → NEXT
========================================================= */

/*
  Clicking the memory book turns the page.

  The zoom area gets special handling below so that
  zooming / dragging doesn't accidentally turn the page.
*/

let pendingMemoryClick = null;

if (memoryBook) {
  memoryBook.addEventListener("click", (event) => {
    /*
      Don't treat buttons as page-turn clicks.
    */
    if (
      event.target.closest("#memoryNext") ||
      event.target.closest("#memoryBack")
    ) {
      return;
    }

    const zoomArea = event.target.closest(".memory-zoom-area");

    /*
      If the user clicked inside a zoomed image,
      don't turn the page.
    */
    if (zoomArea) {
      const state = zoomStates.get(zoomArea);

      if (state && state.scale > 1) {
        return;
      }
    }

    /*
      Slight delay allows double-click / double-tap
      zoom gestures to cancel the page turn.
    */
    clearTimeout(pendingMemoryClick);

    pendingMemoryClick = setTimeout(() => {
      turnNextPage();
    }, 220);
  });
}


/* =========================================================
   ZOOM SYSTEM
========================================================= */

const zoomStates = new Map();


function createZoomState() {
  return {
    scale: 1,

    x: 0,
    y: 0,

    startX: 0,
    startY: 0,

    dragStartX: 0,
    dragStartY: 0,

    startDistance: 0,
    startScale: 1,

    dragging: false,

    lastTap: 0,

    movedDuringTouch: false
  };
}


zoomAreas.forEach((area) => {
  zoomStates.set(area, createZoomState());

  setupZoom(area);
});


/* ---------------------------------------------------------
   GET IMAGE
--------------------------------------------------------- */

function getZoomImage(area) {
  return area.querySelector(".memory-image");
}


/* ---------------------------------------------------------
   CLAMP
--------------------------------------------------------- */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}


/* ---------------------------------------------------------
   LIMIT IMAGE DRAG
--------------------------------------------------------- */

function clampPan(area, state) {
  const image = getZoomImage(area);

  if (!image) {
    return;
  }

  const baseWidth = image.offsetWidth;
  const baseHeight = image.offsetHeight;

  /*
    How far the image can move while zoomed.
  */
  const maxX =
    Math.max(0, (baseWidth * state.scale - baseWidth) / 2);

  const maxY =
    Math.max(0, (baseHeight * state.scale - baseHeight) / 2);

  state.x = clamp(state.x, -maxX, maxX);
  state.y = clamp(state.y, -maxY, maxY);
}


/* ---------------------------------------------------------
   APPLY ZOOM
--------------------------------------------------------- */

function applyZoom(area) {
  const image = getZoomImage(area);
  const state = zoomStates.get(area);

  if (!image || !state) {
    return;
  }

  clampPan(area, state);

  image.style.transform =
    `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`;

  if (state.scale > 1) {
    area.classList.add("is-zoomed");
  } else {
    area.classList.remove("is-zoomed");
  }
}


/* ---------------------------------------------------------
   RESET ONE IMAGE
--------------------------------------------------------- */

function resetZoom(area) {
  const state = zoomStates.get(area);

  if (!state) {
    return;
  }

  state.scale = 1;
  state.x = 0;
  state.y = 0;

  state.dragging = false;
  state.movedDuringTouch = false;

  applyZoom(area);
}


/* ---------------------------------------------------------
   RESET ALL IMAGES
--------------------------------------------------------- */

function resetAllZoom() {
  zoomAreas.forEach((area) => {
    resetZoom(area);
  });
}


/* ---------------------------------------------------------
   DOUBLE TAP / DOUBLE CLICK
--------------------------------------------------------- */

function toggleZoom(area) {
  const state = zoomStates.get(area);

  if (!state) {
    return;
  }

  if (state.scale > 1) {
    state.scale = 1;
    state.x = 0;
    state.y = 0;
  } else {
    state.scale = 2;
  }

  applyZoom(area);
}


/* ---------------------------------------------------------
   TOUCH DISTANCE
--------------------------------------------------------- */

function getTouchDistance(touch1, touch2) {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;

  return Math.sqrt(dx * dx + dy * dy);
}


/* ---------------------------------------------------------
   SETUP ZOOM
--------------------------------------------------------- */

function setupZoom(area) {
  const image = getZoomImage(area);

  if (!image) {
    return;
  }

  const state = zoomStates.get(area);

  /* -------------------------------------------------------
     DOUBLE CLICK — DESKTOP
  ------------------------------------------------------- */

  area.addEventListener("dblclick", (event) => {
    event.preventDefault();
    event.stopPropagation();

    clearTimeout(pendingMemoryClick);

    toggleZoom(area);
  });


  /* -------------------------------------------------------
     CTRL / CMD + MOUSE WHEEL
  ------------------------------------------------------- */

  area.addEventListener(
    "wheel",
    (event) => {
      /*
        Only zoom when Ctrl / Cmd is held.
        Normal scrolling isn't used by the site anyway,
        but this keeps the zoom gesture intentional.
      */
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      clearTimeout(pendingMemoryClick);

      const zoomAmount = event.deltaY < 0 ? 0.25 : -0.25;

      state.scale = clamp(
        state.scale + zoomAmount,
        1,
        3
      );

      if (state.scale === 1) {
        state.x = 0;
        state.y = 0;
      }

      applyZoom(area);
    },
    { passive: false }
  );


  /* -------------------------------------------------------
     MOUSE DRAG
  ------------------------------------------------------- */

  area.addEventListener("mousedown", (event) => {
    /*
      Only allow dragging while zoomed.
    */
    if (state.scale <= 1) {
      return;
    }

    /*
      Left mouse button only.
    */
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    state.dragging = true;

    state.dragStartX = event.clientX - state.x;
    state.dragStartY = event.clientY - state.y;

    area.classList.add("is-dragging");
  });


  window.addEventListener("mousemove", (event) => {
    if (!state.dragging) {
      return;
    }

    state.x = event.clientX - state.dragStartX;
    state.y = event.clientY - state.dragStartY;

    applyZoom(area);
  });


  window.addEventListener("mouseup", () => {
    if (!state.dragging) {
      return;
    }

    state.dragging = false;

    area.classList.remove("is-dragging");
  });


  /* -------------------------------------------------------
     TOUCH START
  ------------------------------------------------------- */

  area.addEventListener(
    "touchstart",
    (event) => {
      clearTimeout(pendingMemoryClick);

      /*
        PINCH
      */
      if (event.touches.length === 2) {
        event.preventDefault();

        state.startDistance = getTouchDistance(
          event.touches[0],
          event.touches[1]
        );

        state.startScale = state.scale;

        state.dragging = false;

        return;
      }


      /*
        SINGLE TOUCH
      */
      if (event.touches.length === 1) {
        const touch = event.touches[0];

        state.startX = touch.clientX;
        state.startY = touch.clientY;

        state.dragStartX =
          touch.clientX - state.x;

        state.dragStartY =
          touch.clientY - state.y;

        state.movedDuringTouch = false;

        /*
          If already zoomed, this starts a drag.
        */
        if (state.scale > 1) {
          state.dragging = true;
          area.classList.add("is-dragging");
        }
      }
    },
    { passive: false }
  );


  /* -------------------------------------------------------
     TOUCH MOVE
  ------------------------------------------------------- */

  area.addEventListener(
    "touchmove",
    (event) => {
      /*
        PINCH ZOOM
      */
      if (event.touches.length === 2) {
        event.preventDefault();

        const currentDistance = getTouchDistance(
          event.touches[0],
          event.touches[1]
        );

        if (state.startDistance > 0) {
          const ratio =
            currentDistance / state.startDistance;

          state.scale = clamp(
            state.startScale * ratio,
            1,
            3
          );

          if (state.scale === 1) {
            state.x = 0;
            state.y = 0;
          }

          applyZoom(area);
        }

        return;
      }


      /*
        DRAG WHILE ZOOMED
      */
      if (
        event.touches.length === 1 &&
        state.scale > 1 &&
        state.dragging
      ) {
        event.preventDefault();

        const touch = event.touches[0];

        const dx =
          touch.clientX - state.startX;

        const dy =
          touch.clientY - state.startY;

        if (
          Math.abs(dx) > 5 ||
          Math.abs(dy) > 5
        ) {
          state.movedDuringTouch = true;
        }

        state.x =
          touch.clientX - state.dragStartX;

        state.y =
          touch.clientY - state.dragStartY;

        applyZoom(area);
      }
    },
    { passive: false }
  );


  /* -------------------------------------------------------
     TOUCH END
  ------------------------------------------------------- */

  area.addEventListener(
    "touchend",
    (event) => {
      area.classList.remove("is-dragging");

      state.dragging = false;


      /*
        If this was the end of a pinch,
        don't interpret it as a tap.
      */
      if (event.touches.length > 0) {
        return;
      }


      /*
        If the image was dragged,
        don't trigger double tap / page turn.
      */
      if (state.movedDuringTouch) {
        state.movedDuringTouch = false;
        return;
      }


      /*
        DOUBLE TAP
      */
      const now = Date.now();
      const timeSinceLastTap =
        now - state.lastTap;

      if (timeSinceLastTap < 300) {
        clearTimeout(pendingMemoryClick);

        toggleZoom(area);

        state.lastTap = 0;

        return;
      }


      state.lastTap = now;

      /*
        Delay slightly so a second tap can cancel
        the normal page-turn click.
      */
      pendingMemoryClick = setTimeout(() => {
        /*
          If zoomed, tapping shouldn't turn the page.
        */
        if (state.scale > 1) {
          return;
        }

        turnNextPage();
      }, 220);
    },
    { passive: false }
  );
}


/* =========================================================
   AFTER MEMORIES → BACK
========================================================= */

if (afterBack) {
  afterBack.addEventListener("click", (event) => {
    event.stopPropagation();

    /*
      Restore the memory book to its final page.
    */
    currentMemory = memoryPages.length - 1;

    memoryPages.forEach((page, index) => {
      if (index < currentMemory) {
        page.classList.add("flipped");
      } else {
        page.classList.remove("flipped");
      }
    });

    resetAllZoom();
    updateMemoryUI();

    showScreen(memories);
  });
}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener("keydown", (event) => {
  /*
    Don't interfere while typing into an input,
    textarea, etc.
  */
  const tag = event.target.tagName;

  if (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT"
  ) {
    return;
  }


  /* -------------------------------------------------------
     RIGHT / ENTER / SPACE
  ------------------------------------------------------- */

  if (
    event.key === "ArrowRight" ||
    event.key === "Enter" ||
    event.key === " "
  ) {
    event.preventDefault();

    if (currentScreen === "cover") {
      if (openButton) {
        openButton.click();
      }

      return;
    }

    if (currentScreen === "birthday") {
      showScreen(memories);
      return;
    }

    if (currentScreen === "memories") {
      turnNextPage();
      return;
    }

    return;
  }


  /* -------------------------------------------------------
     LEFT
  ------------------------------------------------------- */

  if (event.key === "ArrowLeft") {
    event.preventDefault();

    if (currentScreen === "birthday") {
      showScreen(cover);
      return;
    }

    if (currentScreen === "memories") {
      goBackMemory();
      return;
    }

    if (currentScreen === "after") {
      if (afterBack) {
        afterBack.click();
      }

      return;
    }
  }
});


/* =========================================================
   INITIAL STATE
========================================================= */

memoryPages.forEach((page) => {
  page.classList.remove("flipped");
});

currentMemory = 0;

resetAllZoom();
updateMemoryUI();

showScreen(cover);
