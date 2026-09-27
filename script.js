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
