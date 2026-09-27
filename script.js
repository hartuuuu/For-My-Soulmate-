const openButton = document.getElementById("openButton");
const cover = document.getElementById("cover");
const page2 = document.getElementById("page2");
const music = document.getElementById("birthdayMusic");

openButton.addEventListener("click", async () => {
  cover.classList.add("leaving");

  // Start loading the song as the scrapbook page comes in.
  try {
    await music.play();
  } catch (error) {
    // Some browsers block playback until another interaction; the click above normally counts as one.
    console.log("Music playback was blocked by the browser.");
  }

  setTimeout(() => {
    cover.style.display = "none";
    page2.classList.add("show");
    page2.setAttribute("aria-hidden", "false");
  }, 850);
});
