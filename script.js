const openButton = document.getElementById("openButton");
const cover = document.getElementById("cover");
const page2 = document.getElementById("page2");
const music = document.getElementById("birthdayMusic");


openButton.addEventListener("click", async () => {

  /* Start the Page 1 transition */
  cover.classList.add("leaving");


  /* Start the music */
  try {

    await music.play();

  } catch (error) {

    console.log(
      "Music playback was blocked by the browser."
    );

  }


  /* Wait for the transition, then reveal Page 2 */
  setTimeout(() => {

    cover.style.display = "none";

    page2.classList.add("show");

    page2.setAttribute(
      "aria-hidden",
      "false"
    );

  }, 850);

});

/* =========================================
   PAGE 3 — MEMORY BOOK
========================================= */

const page3 = document.getElementById("page3");

const memoryBook = document.getElementById("memoryBook");
const memoryImage = document.getElementById("memoryImage");

const memoryPrev = document.getElementById("memoryPrev");
const memoryNext = document.getElementById("memoryNext");

const memoryNumber = document.getElementById("memoryNumber");
const memoryHint = document.getElementById("memoryHint");
const memoryContinue = document.getElementById("memoryContinue");


const memories = [
  "assets/memory-1.png",
  "assets/memory-2.png",
  "assets/memory-3.png",
  "assets/memory-4.png",
  "assets/memory-5.png",
  "assets/memory-6.png",
  "assets/memory-7.png",
  "assets/memory-8.png"
];


let currentMemory = 0;
let isTurning = false;


/* -----------------------------------------
   SHOW PAGE 3
----------------------------------------- */

function showMemoryBook() {
  page3.classList.add("show");
  page3.setAttribute("aria-hidden", "false");
}

/* -----------------------------------------
   UPDATE PAGE
----------------------------------------- */

function updateMemoryPage() {
  memoryImage.src = memories[currentMemory];

  memoryImage.alt =
    `Memory scrapbook page ${currentMemory + 1}`;

  memoryNumber.textContent =
    currentMemory + 1;

  memoryPrev.disabled =
    currentMemory === 0;

  memoryNext.disabled =
    currentMemory === memories.length - 1;


  if (currentMemory === memories.length - 1) {
    memoryHint.textContent =
      "that's the last one... for now ♡";

    memoryContinue.style.display =
      "inline-block";
  } else {
    memoryHint.textContent =
      "click the arrow to turn the page ♡";

    memoryContinue.style.display =
      "none";
  }
}


/* -----------------------------------------
   TURN PAGE
----------------------------------------- */

function turnMemory(direction) {

  if (isTurning) return;

  const nextIndex =
    currentMemory + direction;

  if (
    nextIndex < 0 ||
    nextIndex >= memories.length
  ) {
    return;
  }


  isTurning = true;

  memoryBook.classList.add("flipping");


  setTimeout(() => {

    currentMemory = nextIndex;

    /*
      Change the image while the page
      is turned over so the new page
      appears when it comes back.
    */

    memoryImage.src =
      memories[currentMemory];

    memoryImage.alt =
      `Memory scrapbook page ${currentMemory + 1}`;

    memoryNumber.textContent =
      currentMemory + 1;

  }, 470);


  setTimeout(() => {

    memoryBook.classList.remove("flipping");

    updateMemoryPage();

    isTurning = false;

  }, 950);
}


/* -----------------------------------------
   NEXT / PREVIOUS
----------------------------------------- */

memoryNext.addEventListener("click", () => {
  turnMemory(1);
});

memoryPrev.addEventListener("click", () => {
  turnMemory(-1);
});


/* -----------------------------------------
   LAST PAGE → CONTINUE
----------------------------------------- */

memoryContinue.addEventListener("click", () => {

  /*
    We'll connect this to Page 4
    when we build the next section.
  */

  alert("NEXT PAGE COMING ♡");
});


/* -----------------------------------------
   INITIAL STATE
----------------------------------------- */

updateMemoryPage();

const goToMemories =
  document.getElementById("goToMemories");

goToMemories.addEventListener("click", () => {
  page3.classList.add("show");
  page3.setAttribute("aria-hidden", "false");
});
