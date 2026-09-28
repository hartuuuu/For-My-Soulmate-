// ========================================
// NICOLE'S BIRTHDAY WEBSITE
// FULL PAGE NAVIGATION SCRIPT
// ========================================

const cover = document.getElementById("cover");
const page2 = document.getElementById("page2");
const music = document.getElementById("birthdayMusic");

// Buttons
const openButton = document.getElementById("openButton");
const continueButton = document.getElementById("continueButton");

// Memory book
const memoryBook = document.getElementById("memoryBook");
const memoryPages = document.querySelectorAll(".memory-page");
const memoryNextButton = document.getElementById("memoryNextButton");
const memoryBackButton = document.getElementById("memoryBackButton");


// ========================================
// STARTING STATE
// ========================================

// Everything starts hidden except the cover.

if (cover) {
  cover.style.display = "flex";
}

if (page2) {
  page2.classList.remove("show");
  page2.style.display = "none";
}

if (memoryBook) {
  memoryBook.classList.remove("show");
  memoryBook.style.display = "none";
}

// Hide every memory page except the first one
memoryPages.forEach((page, index) => {
  page.classList.remove("active");

  if (index === 0) {
    page.classList.add("active");
  }
});


// ========================================
// PAGE 1 → PAGE 2
// ========================================

if (openButton) {
  openButton.addEventListener("click", async () => {

    // Start the music from the button click
    if (music) {
      try {
        await music.play();
      } catch (error) {
        console.log("Music playback was blocked.");
      }
    }

    // Fade the cover away
    if (cover) {
      cover.classList.add("leaving");
    }

    // Wait for the transition
    setTimeout(() => {

      // Completely hide Page 1
      if (cover) {
        cover.style.display = "none";
      }

      // Show Page 2
      if (page2) {
        page2.style.display = "flex";

        // Small delay so the transition works properly
        requestAnimationFrame(() => {
          page2.classList.add("show");
          page2.setAttribute("aria-hidden", "false");
        });
      }

      // Make sure memory book is NOT showing yet
      if (memoryBook) {
        memoryBook.style.display = "none";
        memoryBook.classList.remove("show");
      }

    }, 850);
  });
}


// ========================================
// PAGE 2 → MEMORY BOOK
// ========================================

if (continueButton) {
  continueButton.addEventListener("click", () => {

    // Hide Page 2
    if (page2) {
      page2.classList.remove("show");
      page2.setAttribute("aria-hidden", "true");
    }

    setTimeout(() => {

      if (page2) {
        page2.style.display = "none";
      }

      // Show the memory book
      if (memoryBook) {
        memoryBook.style.display = "flex";

        requestAnimationFrame(() => {
          memoryBook.classList.add("show");
          memoryBook.setAttribute("aria-hidden", "false");
        });
      }

      // Always start memory book at page 1
      memoryPages.forEach((page, index) => {
        page.classList.toggle("active", index === 0);
      });

      currentMemoryPage = 0;
      updateMemoryButtons();

    }, 400);
  });
}


// ========================================
// MEMORY BOOK
// ========================================

let currentMemoryPage = 0;


// Show only the current memory page
function showMemoryPage(index) {

  if (memoryPages.length === 0) return;

  // Keep the number inside the valid range
  if (index < 0) {
    index = 0;
  }

  if (index >= memoryPages.length) {
    index = memoryPages.length - 1;
  }

  currentMemoryPage = index;

  memoryPages.forEach((page, pageIndex) => {

    if (pageIndex === currentMemoryPage) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }

  });

  updateMemoryButtons();
}


// ========================================
// NEXT MEMORY PAGE
// ========================================

if (memoryNextButton) {

  memoryNextButton.addEventListener("click", () => {

    if (currentMemoryPage < memoryPages.length - 1) {

      // Move to next page
      showMemoryPage(currentMemoryPage + 1);

    } else {

      // If this is the LAST memory page,
      // you can connect this later to the next section.
      console.log("End of memory book.");
    }

  });

}


// ========================================
// PREVIOUS MEMORY PAGE
// ========================================

if (memoryBackButton) {

  memoryBackButton.addEventListener("click", () => {

    if (currentMemoryPage > 0) {
      showMemoryPage(currentMemoryPage - 1);
    }

  });

}


// ========================================
// MEMORY BUTTON STATE
// ========================================

function updateMemoryButtons() {

  if (memoryBackButton) {

    if (currentMemoryPage === 0) {
      memoryBackButton.style.visibility = "hidden";
    } else {
      memoryBackButton.style.visibility = "visible";
    }

  }


  if (memoryNextButton) {

    if (currentMemoryPage === memoryPages.length - 1) {

      // Still show the button on the final page
      // so we can connect the next section later.
      memoryNextButton.innerHTML = "♡";

    } else {

      memoryNextButton.innerHTML = "→";

    }

  }

}


// ========================================
// KEYBOARD SUPPORT
// ========================================

// This lets you use the keyboard on a laptop,
// but it doesn't affect the phone experience.

document.addEventListener("keydown", (event) => {

  // Don't do anything if memory book isn't visible
  if (
    !memoryBook ||
    memoryBook.style.display === "none"
  ) {
    return;
  }


  if (event.key === "ArrowRight") {

    if (currentMemoryPage < memoryPages.length - 1) {
      showMemoryPage(currentMemoryPage + 1);
    }

  }


  if (event.key === "ArrowLeft") {

    if (currentMemoryPage > 0) {
      showMemoryPage(currentMemoryPage - 1);
    }

  }

});


// ========================================
// PREVENT ACCIDENTAL PAGE SCROLLING
// ========================================

document.body.addEventListener(
  "touchmove",
  (event) => {

    // Don't allow the website to become a
    // giant vertically scrolling page.
    if (memoryBook && memoryBook.classList.contains("show")) {
      event.preventDefault();
    }

  },
  { passive: false }
);


// ========================================
// INITIALIZE
// ========================================

updateMemoryButtons();
