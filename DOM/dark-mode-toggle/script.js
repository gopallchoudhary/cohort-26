const toggleBtn = document.getElementById("toggle-btn");

const themeMode = document.body.classList.contains("dark");


function themeModeFn(themeMode) {
    if (themeMode) {
        toggleBtn.innerText = "Switch to Light Mode";
    } else {
        toggleBtn.innerText = "Switch to Dark Mode";
    }
}
themeModeFn(themeMode)

toggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    const themeMode = document.body.classList.contains("dark");

    themeModeFn(themeMode)

});

