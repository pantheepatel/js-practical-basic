// theme changing function : light/dark
function changeTheme() {
    let main = document.getElementById("main");

    if (main.classList.contains("theme_light")) {
        main.classList.replace("theme_light", "theme_dark"); // dark mode
    } else {
        main.classList.replace("theme_dark", "theme_light"); // light mode
    }
}
// keyboard input function