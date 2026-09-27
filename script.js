const openButton = document.getElementById("openButton");
const cover = document.getElementById("cover");
const page2 = document.getElementById("page2");

openButton.addEventListener("click", () => {

  // Fade Page 1 out
  cover.classList.add("leaving");

  setTimeout(() => {

    // Hide Page 1
    cover.style.display = "none";

    // Show Page 2
    page2.classList.add("show");
    page2.setAttribute("aria-hidden", "false");

    // MUSIC WILL BE ADDED HERE LATER

  }, 1000);

});
