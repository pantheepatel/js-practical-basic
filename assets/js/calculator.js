// theme changing function : light/dark
// FIXME: set this into localstorage
function changeTheme() {
    let main = document.getElementById("main");
    let themeClass;
    if (main.classList.contains("theme_light")) {
        main.classList.replace("theme_light", "theme_dark"); // dark mode
        themeClass = "theme_dark";
    } else {
        main.classList.replace("theme_dark", "theme_light"); // light mode
        themeClass = "theme_light";
    }

    try {
        // let localTheme = localStorage.getItem('theme');
        localStorage.setItem('theme', themeClass);
        console.log("theme clas is : ", localStorage.getItem('theme'))
    } catch (err) {
        console.error(`error in storing theme: ${err}`)
    }
}
// keyboard input function
function keepFocus() {
    const inputElement = document.getElementById("spanOutput").focus();

    // Keep the input focused even when clicking elsewhere
    // inputElement.focus();

    // Ensure input is focused whenever the page is loaded or focus is lost
    setInterval(() => {
        inputElement.focus();
    }, 100); // Refocus every 100ms
}
// has context menu

// change buttons normal
const changeButton = function () {
    console.log("in chnage buttons")
    document.querySelectorAll(".btnTd").forEach((ele) => {
        ele.classList.toggle("swap");
    })
}
document.getElementById("changeButtons").addEventListener("click", changeButton)

document.addEventListener("DOMContentLoaded", function () {
    let main = document.getElementById("main");
    // main.classList.remove();
    let theme = localStorage.getItem('theme');
    console.log(`theme class is : ${theme}`)
    main.className = theme ? theme : 'theme_light';

    // keepFocus();

})

document.getElementById("mainTable").addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
        const buttonValue = event.target.value;
        // console.log(buttonValue);
        const inputField = document.getElementById("spanOutput");
        let currentValue = inputField.value;
        if (buttonValue === "=") {
            let returnAns = evaluate(currentValue);
            inputField.value = returnAns;
        }
        else if (buttonValue === "clear") {
            inputField.value = 0;
        }
        else if (buttonValue === "backspace") {
            currentValue = currentValue.substr(0, currentValue.length - 1);
            inputField.value = currentValue;
        }
        else if (buttonValue === "fact") {
            const factcurrentValue = fact(currentValue.substr(-1));
            inputField.value = currentValue.substr(0, currentValue.length - 1) + factcurrentValue;
        }else if(buttonValue==="mod"){
            // let returnAns = evaluate(currentValue);
            inputField.value += "%";
        }


        else if (currentValue === "0") {
            inputField.value = buttonValue;
        } else {
            inputField.value = currentValue + buttonValue;
        }
    }
})

const evaluate = function (spanValue) {
    console.log("in eval with exp: ", spanValue)
    const ans = eval(spanValue);
    console.log("this is outpt: ", ans)
    return ans;
}

function fact(n) {
    let res = 1;
    for (let i = 1; i <= n; i++) {
        res *= i;
    }
    return res;
}