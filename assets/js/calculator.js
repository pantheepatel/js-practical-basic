// theme changing function : light/dark
// FIXME: set this into localstorage
function changeTheme() {
    let main = document.getElementById("main");
    if (main.classList.contains("theme_light")) {
        main.classList.replace("theme_light", "theme_dark"); // dark mode
    } else {
        main.classList.replace("theme_dark", "theme_light"); // light mode
    }
}
// keyboard input function

// change buttons normal
const changeButton = function () {
    console.log("in chnage buttons")
    document.querySelectorAll(".btnTd").forEach((ele)=>{
        ele.classList.toggle("swap");
    })
}
document.getElementById("changeButtons").addEventListener("click", changeButton)
