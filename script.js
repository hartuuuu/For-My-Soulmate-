/* =========================================================
   NICOLE'S BIRTHDAY WEBSITE
   MAIN SCRIPT
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const cover =
  document.getElementById("cover");

const birthday =
  document.getElementById("birthday");

const memories =
  document.getElementById("memories");

const afterMemories =
  document.getElementById("after-memories");

const openButton =
  document.getElementById("openButton");

const birthdayMusic =
  document.getElementById("birthdayMusic");

const birthdayInner =
  document.querySelector(".birthday-inner");

const birthdayBack =
  document.getElementById("birthdayBack");

const memoryBook =
  document.getElementById("memoryBook");

const memoryPages =
  document.querySelectorAll(".memory-page");

const memoryImages =
  document.querySelectorAll(".memory-image");

const memoryCounter =
  document.getElementById("memoryCounter");

const memoryHint =
  document.getElementById("memoryHint");

const memoryNext =
  document.getElementById("memoryNext");

const memoryBack =
  document.getElementById("memoryBack");

const afterBack =
  document.getElementById("afterBack");


/* =========================================================
   SCREEN NAVIGATION
   ========================================================= */

let currentScreen = "cover";


function showScreen(screen) {

  if (!screen) {
    return;
  }

  document
    .querySelectorAll(".screen")
    .forEach((element) => {
      element.classList.remove("active");
    });

  screen.classList.add("active");

  currentScreen =
    screen.id;
}


/* =========================================================
   PAGE 1 → PAGE 2
   ========================================================= */

if (openButton) {

  openButton.addEventListener(
    "click",
    async (event) => {

      event.stopPropagation();

      /*
       * Start the music from the user's button click.
       * This keeps the browser's autoplay rules happy.
       */

      if (birthdayMusic) {

        try {

          await birthdayMusic.play();

        } catch (error) {

          console.log(
            "Music playback was blocked."
          );

        }

      }

      showScreen(birthday);

    }
  );

}


/* =========================================================
   PAGE 2 → PAGE 1
   ========================================================= */

if (birthdayBack) {

  birthdayBack.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      showScreen(cover);

    }
  );

}


/* =========================================================
   PAGE 2 → MEMORY BOOK
   ========================================================= */

if (birthdayInner) {

  birthdayInner.addEventListener(
    "click",
    (event) => {

      /*
       * Clicking the back button should NOT
       * open the memory book.
       */

      if (
        event.target.closest(
          "#birthdayBack"
        )
      ) {

        return;

      }

      showScreen(memories);

    }
  );

}


/* =========================================================
   MEMORY BOOK
   ========================================================= */

let currentMemory = 0;


/* =========================================================
   UPDATE MEMORY UI
   ========================================================= */

function updateMemoryUI() {

  if (!memoryCounter) {
    return;
  }

  memoryCounter.textContent =
    `${currentMemory + 1} / ${memoryPages.length}`;


  if (
    currentMemory ===
    memoryPages.length - 1
  ) {

    if (memoryHint) {

      memoryHint.textContent =
        "one more click... ♡";

    }

    if (memoryNext) {

      memoryNext.textContent =
        "FINISH →";

    }

  } else {

    if (memoryHint) {

      memoryHint.textContent =
        "click to turn the page ♡";

    }

    if (memoryNext) {

      memoryNext.textContent =
        "NEXT →";

    }

  }

}


/* =========================================================
   RESET ALL MEMORY PAGES
   ========================================================= */

function resetMemoryPages() {

  memoryPages.forEach(
    (page) => {

      page.classList.remove(
        "flipped"
      );

    }
  );

}


/* =========================================================
   RESET MEMORY ZOOM
   ========================================================= */

function resetAllMemoryZoom() {

  memoryImages.forEach(
    (image) => {

      const state =
        imageZoomStates.get(image);

      if (!state) {
        return;
      }

      state.scale = 1;

      state.x = 0;

      state.y = 0;

      state.dragging = false;

      state.lastX = 0;

      state.lastY = 0;

      state.startX = 0;

      state.startY = 0;

      state.startDistance = 0;

      state.startScale = 1;

      image.classList.remove(
        "is-zoomed",
        "is-dragging"
      );

      image.style.transform =
        "translate3d(0, 0, 0) scale(1)";

    }
  );

}


/* =========================================================
   GO TO MEMORY PAGE
   ========================================================= */

function goToMemory(index) {

  if (
    index < 0 ||
    index >= memoryPages.length
  ) {

    return;

  }

  currentMemory =
    index;

  resetAllMemoryZoom();

  /*
   * Pages before the current page
   * are flipped.
   *
   * Current and future pages
   * remain unflipped.
   */

  memoryPages.forEach(
    (page, pageIndex) => {

      if (
        pageIndex <
        currentMemory
      ) {

        page.classList.add(
          "flipped"
        );

      } else {

        page.classList.remove(
          "flipped"
        );

      }

    }
  );

  updateMemoryUI();

}


/* =========================================================
   NEXT MEMORY PAGE
   ========================================================= */

function turnNextPage() {

  if (
    currentMemory <
    memoryPages.length - 1
  ) {

    goToMemory(
      currentMemory + 1
    );

    return;

  }


  /*
   * After Memory 8,
   * show the temporary page.
   */

  resetAllMemoryZoom();

  showScreen(afterMemories);

}


/* =========================================================
   PREVIOUS MEMORY PAGE
   ========================================================= */

function turnPreviousPage() {

  if (
    currentMemory > 0
  ) {

    goToMemory(
      currentMemory - 1
    );

  }

}


/* =========================================================
   MEMORY BOOK CLICK
   ========================================================= */

if (memories) {

  memories.addEventListener(
    "click",
    (event) => {

      /*
       * Buttons have their own handlers.
       */

      if (
        event.target.closest(
          "#memoryNext"
        )
      ) {

        return;

      }

      if (
        event.target.closest(
          "#memoryBack"
        )
      ) {

        return;

      }


      /*
       * If the image is currently zoomed,
       * clicking it should NOT turn the page.
       */

      const clickedImage =
        event.target.closest(
          ".memory-image"
        );

      if (clickedImage) {

        const state =
          imageZoomStates.get(
            clickedImage
          );

        if (
          state &&
          state.scale > 1
        ) {

          return;

        }

      }


      /*
       * Normal click:
       * turn to the next page.
       */

      turnNextPage();

    }
  );

}


/* =========================================================
   NEXT BUTTON
   ========================================================= */

if (memoryNext) {

  memoryNext.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      turnNextPage();

    }
  );

}


/* =========================================================
   MEMORY BACK BUTTON
   ========================================================= */

if (memoryBack) {

  memoryBack.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      /*
       * If we're on Memory 1,
       * go back to Page 2.
       */

      if (
        currentMemory === 0
      ) {

        resetAllMemoryZoom();

        showScreen(birthday);

        return;

      }

      /*
       * Otherwise go to the
       * previous memory.
       */

      turnPreviousPage();

    }
  );

}


/* =========================================================
   AFTER MEMORIES → MEMORY 8
   ========================================================= */

if (afterBack) {

  afterBack.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      /*
       * Restore the memory book
       * to Memory 8.
       */

      goToMemory(
        memoryPages.length - 1
      );

      showScreen(memories);

    }
  );

}


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    /*
     * Don't hijack typing into anything.
     */

    if (
      event.target.tagName ===
      "INPUT" ||
      event.target.tagName ===
      "TEXTAREA"
    ) {

      return;

    }


    /* -----------------------------------------
       ENTER / SPACE
       ----------------------------------------- */

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();


      if (
        currentScreen ===
        "cover"
      ) {

        if (openButton) {
          openButton.click();
        }

      }

      else if (
        currentScreen ===
        "birthday"
      ) {

        showScreen(memories);

      }

      else if (
        currentScreen ===
        "memories"
      ) {

        turnNextPage();

      }

      return;

    }


    /* -----------------------------------------
       RIGHT ARROW
       ----------------------------------------- */

    if (
      event.key ===
      "ArrowRight"
    ) {

      event.preventDefault();


      if (
        currentScreen ===
        "cover"
      ) {

        if (openButton) {
          openButton.click();
        }

      }

      else if (
        currentScreen ===
        "birthday"
      ) {

        showScreen(memories);

      }

      else if (
        currentScreen ===
        "memories"
      ) {

        turnNextPage();

      }

      return;

    }


    /* -----------------------------------------
       LEFT ARROW
       ----------------------------------------- */

    if (
      event.key ===
      "ArrowLeft"
    ) {

      event.preventDefault();


      if (
        currentScreen ===
        "birthday"
      ) {

        showScreen(cover);

      }

      else if (
        currentScreen ===
        "memories"
      ) {

        if (
          currentMemory === 0
        ) {

          showScreen(birthday);

        } else {

          turnPreviousPage();

        }

      }

      else if (
        currentScreen ===
        "after-memories"
      ) {

        goToMemory(
          memoryPages.length - 1
        );

        showScreen(memories);

      }

    }

  }
);


/* =========================================================
   MEMORY IMAGE ZOOM
   ========================================================= */


/*
 * Every memory image gets its own zoom state.
 *
 * The website itself NEVER zooms.
 *
 * Only the memory image changes scale.
 */

const imageZoomStates =
  new Map();


memoryImages.forEach(
  (image) => {

    imageZoomStates.set(
      image,
      {
        scale: 1,

        x: 0,
        y: 0,

        dragging: false,

        lastX: 0,
        lastY: 0,

        startX: 0,
        startY: 0,

        startDistance: 0,
        startScale: 1,

        lastTapTime: 0

      }
    );

  }
);


/* =========================================================
   ZOOM CONSTANTS
   ========================================================= */

const MIN_ZOOM =
  1;

const MAX_ZOOM =
  4;

const DOUBLE_TAP_ZOOM =
  2;


/* =========================================================
   UPDATE IMAGE TRANSFORM
   ========================================================= */

function updateImageTransform(
  image
) {

  const state =
    imageZoomStates.get(
      image
    );

  if (!state) {
    return;
  }

  image.style.transform =
    `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`;


  if (
    state.scale > 1
  ) {

    image.classList.add(
      "is-zoomed"
    );

  } else {

    image.classList.remove(
      "is-zoomed"
    );

  }

}


/* =========================================================
   LIMIT IMAGE DRAGGING
   ========================================================= */

function clampImagePosition(
  image
) {

  const state =
    imageZoomStates.get(
      image
    );

  if (!state) {
    return;
  }

  /*
   * Don't let the image be dragged
   * ridiculously far away.
   */

  const rect =
    image.getBoundingClientRect();

  const maxX =
    Math.max(
      0,
      (rect.width * (state.scale - 1)) / 2
    );

  const maxY =
    Math.max(
      0,
      (rect.height * (state.scale - 1)) / 2
    );


  /*
   * Use a generous limit.
   *
   * This works better for portrait
   * collage images.
   */

  const limitX =
    Math.max(
      80,
      maxX
    );

  const limitY =
    Math.max(
      80,
      maxY
    );


  state.x =
    Math.max(
      -limitX,
      Math.min(
        limitX,
        state.x
      )
    );

  state.y =
    Math.max(
      -limitY,
      Math.min(
        limitY,
        state.y
      )
    );

}


/* =========================================================
   SET IMAGE ZOOM
   ========================================================= */

function setImageZoom(
  image,
  scale
) {

  const state =
    imageZoomStates.get(
      image
    );

  if (!state) {
    return;
  }

  state.scale =
    Math.max(
      MIN_ZOOM,
      Math.min(
        MAX_ZOOM,
        scale
      )
    );


  /*
   * When returning to 1x,
   * put the image back in its
   * original position.
   */

  if (
    state.scale === 1
  ) {

    state.x = 0;
    state.y = 0;

  }


  clampImagePosition(
    image
  );

  updateImageTransform(
    image
  );

}


/* =========================================================
   DOUBLE CLICK — DESKTOP
   ========================================================= */

memoryImages.forEach(
  (image) => {

    image.addEventListener(
      "dblclick",
      (event) => {

        event.preventDefault();

        event.stopPropagation();


        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }


        if (
          state.scale > 1
        ) {

          setImageZoom(
            image,
            1
          );

        } else {

          setImageZoom(
            image,
            DOUBLE_TAP_ZOOM
          );

        }

      }
    );

  }
);


/* =========================================================
   MOUSE WHEEL ZOOM
   Ctrl/Cmd + Wheel
   ========================================================= */

memoryImages.forEach(
  (image) => {

    image.addEventListener(
      "wheel",
      (event) => {

        /*
         * Only zoom with Ctrl/Cmd + wheel.
         *
         * Normal scrolling behavior isn't
         * needed because the site itself
         * doesn't scroll.
         */

        if (
          !event.ctrlKey &&
          !event.metaKey
        ) {

          return;

        }

        event.preventDefault();

        event.stopPropagation();


        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }


        const direction =
          event.deltaY < 0
            ? 1
            : -1;


        const amount =
          direction > 0
            ? 0.25
            : -0.25;


        setImageZoom(
          image,
          state.scale + amount
        );

      },
      {
        passive: false
      }
    );

  }
);


/* =========================================================
   TOUCH / PINCH / DRAG
   ========================================================= */

memoryImages.forEach(
  (image) => {

    /*
     * TOUCH START
     */

    image.addEventListener(
      "touchstart",
      (event) => {

        event.stopPropagation();


        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }


        /* ---------------------------------------
           TWO FINGER PINCH START
           --------------------------------------- */

        if (
          event.touches.length === 2
        ) {

          event.preventDefault();


          const touch1 =
            event.touches[0];

          const touch2 =
            event.touches[1];


          state.startDistance =
            Math.hypot(
              touch2.clientX -
                touch1.clientX,

              touch2.clientY -
                touch1.clientY
            );


          state.startScale =
            state.scale;

          state.dragging = false;

          return;

        }


        /* ---------------------------------------
           ONE FINGER START
           --------------------------------------- */

        if (
          event.touches.length === 1
        ) {

          const touch =
            event.touches[0];


          const now =
            Date.now();


          /*
           * Double tap detection
           */

          const timeSinceLastTap =
            now -
            state.lastTapTime;


          if (
            timeSinceLastTap < 300
          ) {

            event.preventDefault();


            if (
              state.scale > 1
            ) {

              setImageZoom(
                image,
                1
              );

            } else {

              setImageZoom(
                image,
                DOUBLE_TAP_ZOOM
              );

            }


            state.lastTapTime =
              0;

            return;

          }


          state.lastTapTime =
            now;


          /*
           * Start dragging only
           * when zoomed in.
           */

          if (
            state.scale > 1
          ) {

            event.preventDefault();

            state.dragging =
              true;

            state.startX =
              touch.clientX;

            state.startY =
              touch.clientY;

            state.lastX =
              state.x;

            state.lastY =
              state.y;

            image.classList.add(
              "is-dragging"
            );

          }

        }

      },
      {
        passive: false
      }
    );


    /*
     * TOUCH MOVE
     */

    image.addEventListener(
      "touchmove",
      (event) => {

        event.stopPropagation();


        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }


        /* ---------------------------------------
           PINCH
           --------------------------------------- */

        if (
          event.touches.length === 2
        ) {

          event.preventDefault();


          const touch1 =
            event.touches[0];

          const touch2 =
            event.touches[1];


          const currentDistance =
            Math.hypot(
              touch2.clientX -
                touch1.clientX,

              touch2.clientY -
                touch1.clientY
            );


          if (
            state.startDistance > 0
          ) {

            const ratio =
              currentDistance /
              state.startDistance;


            const newScale =
              state.startScale *
              ratio;


            setImageZoom(
              image,
              newScale
            );

          }

          return;

        }


        /* ---------------------------------------
           DRAG
           --------------------------------------- */

        if (
          event.touches.length === 1 &&
          state.dragging &&
          state.scale > 1
        ) {

          event.preventDefault();


          const touch =
            event.touches[0];


          const deltaX =
            touch.clientX -
            state.startX;


          const deltaY =
            touch.clientY -
            state.startY;


          state.x =
            state.lastX +
            deltaX;


          state.y =
            state.lastY +
            deltaY;


          clampImagePosition(
            image
          );

          updateImageTransform(
            image
          );

        }

      },
      {
        passive: false
      }
    );


    /*
     * TOUCH END
     */

    image.addEventListener(
      "touchend",
      (event) => {

        event.stopPropagation();


        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }


        if (
          event.touches.length === 0
        ) {

          state.dragging =
            false;

          state.startDistance =
            0;

          image.classList.remove(
            "is-dragging"
          );

        }

      },
      {
        passive: false
      }
    );


    /*
     * TOUCH CANCEL
     */

    image.addEventListener(
      "touchcancel",
      () => {

        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }

        state.dragging =
          false;

        state.startDistance =
          0;

        image.classList.remove(
          "is-dragging"
        );

      }
    );

  }
);


/* =========================================================
   POINTER / MOUSE DRAG
   ========================================================= */

memoryImages.forEach(
  (image) => {

    image.addEventListener(
      "pointerdown",
      (event) => {

        /*
         * Only mouse dragging is handled here.
         * Touch is handled separately above.
         */

        if (
          event.pointerType !==
          "mouse"
        ) {

          return;

        }


        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }


        if (
          state.scale <= 1
        ) {

          return;

        }


        event.preventDefault();


        state.dragging =
          true;

        state.startX =
          event.clientX;

        state.startY =
          event.clientY;

        state.lastX =
          state.x;

        state.lastY =
          state.y;


        image.classList.add(
          "is-dragging"
        );


        try {

          image.setPointerCapture(
            event.pointerId
          );

        } catch (error) {

          /* Nothing needed here. */

        }

      }
    );


    image.addEventListener(
      "pointermove",
      (event) => {

        if (
          event.pointerType !==
          "mouse"
        ) {

          return;

        }


        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }


        if (
          !state.dragging ||
          state.scale <= 1
        ) {

          return;

        }


        event.preventDefault();


        const deltaX =
          event.clientX -
          state.startX;


        const deltaY =
          event.clientY -
          state.startY;


        state.x =
          state.lastX +
          deltaX;


        state.y =
          state.lastY +
          deltaY;


        clampImagePosition(
          image
        );

        updateImageTransform(
          image
        );

      }
    );


    image.addEventListener(
      "pointerup",
      (event) => {

        if (
          event.pointerType !==
          "mouse"
        ) {

          return;

        }


        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }


        state.dragging =
          false;

        image.classList.remove(
          "is-dragging"
        );


        try {

          image.releasePointerCapture(
            event.pointerId
          );

        } catch (error) {

          /* Nothing needed here. */

        }

      }
    );


    image.addEventListener(
      "pointercancel",
      () => {

        const state =
          imageZoomStates.get(
            image
          );

        if (!state) {
          return;
        }

        state.dragging =
          false;

        image.classList.remove(
          "is-dragging"
        );

      }
    );

  }
);


/* =========================================================
   PREVENT TOUCH SCROLLING
   ========================================================= */

document.body.addEventListener(
  "touchmove",
  (event) => {

    /*
     * This website is intentionally
     * a fixed full-screen experience.
     */

    if (
      currentScreen ===
      "memories"
    ) {

      /*
       * Don't block pinch/drag gestures
       * happening on a memory image.
       */

      if (
        event.target.closest(
          ".memory-image"
        )
      ) {

        return;

      }

      event.preventDefault();

    }

  },
  {
    passive: false
  }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

resetMemoryPages();

resetAllMemoryZoom();

updateMemoryUI();

showScreen(cover);
