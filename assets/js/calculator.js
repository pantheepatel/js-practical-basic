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
        // let localTheme = sessionStorage.getItem('theme');
        sessionStorage.setItem('theme', themeClass);
        console.log("theme clas is : ", sessionStorage.getItem('theme'))
    } catch (err) {
        console.error(`error in storing theme: ${err}`)
    }
}
// keyboard input function
function keepFocus() {
    const inputElement = document.getElementById("spanOutput").focus();

    // Keep the input focused even when clicking elsewhere
    inputElement.focus();

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
    let theme = sessionStorage.getItem('theme');
    console.log(`theme class is : ${theme}`)
    main.className = theme ? theme : 'theme_light';
    // keepFocus();
    checkHistory();
    checkMemory();
    document.getElementById("trigonometry").addEventListener("click", trigo(event))
})

let inputField = document.getElementById("spanOutput");
// let inputFieldHistory = document.getElementById("spanOutputHistory");
function getLastOperand(expression) {
    // Split by operators (+, -, *, /) but keep negative numbers intact
    console.log("in last operand ", expression)
    // if (inputFieldHistory.value == 0) {
    //     inputFieldHistory.value = expression;
    // } else {
    //     inputFieldHistory.value = expression;
    // }
    let operands = expression.split(/[\+\-\*\/]/);
    // if (operands.includes(expression[-1])) {
    //     inputField.value = 0;
    // }
    return operands.pop().trim(); // Get last number
}
let isResultDisplayed = false; // Flag to track if = was pressed
// const pi = Math.PI;
document.getElementById("mainTable").addEventListener("click", function (event) {

    // FIXME: this is for removing previous output if = clicked before. 
    // if current btn clicked is other value then replace or else if operand then append with 0.
    if (isResultDisplayed) {
        console.log(isResultDisplayed)
        // if (isResultDisplayed) {
        inputField.value = ""; // Clear previous result if a number is pressed
        isResultDisplayed = false;
        // }
    }

    if (event.target.tagName === "BUTTON") {
        const buttonValue = event.target.value;
        // console.log(buttonValue);
        let currentValue = inputField.value;

        // this is to seperate input from operators
        let lastOperand = getLastOperand(currentValue);
        inputField.value = lastOperand;
        // console.log(lastOperand)
        // let num = parseInt(lastOperand, 10);
        // if (isNaN(num) || num < 0) return "Error";

        if (currentValue === "0") {
            inputField.value = buttonValue;
        } else {
            inputField.value = currentValue + buttonValue;
        }
        let replaceArr = { "pi": Math.PI, "e": Math.E };
        // operations on value after some operator
        if (buttonValue === "=") {
            let returnAns = evaluate(currentValue);
            inputField.value = returnAns;
            isResultDisplayed = true;
            checkHistory();
            checkMemory();
        }
        else if (buttonValue === "clear") {
            inputField.value = "";
        }
        else if (buttonValue === "backspace") {
            currentValue = currentValue.substr(0, currentValue.length - 1);
            inputField.value = currentValue;
        }
        else if (buttonValue === "fact") {
            const factcurrentValue = fact(lastOperand);
            inputField.value = currentValue.substr(0, currentValue.length - lastOperand.length) + factcurrentValue;
        }
        else if (buttonValue === "mod") {
            // let returnAns = evaluate(currentValue);
            inputField.value += "%";
        }
        else if (buttonValue === "+-") {
            lastOperand = (lastOperand < 0 ? lastOperand.slice(1) : "-" + lastOperand)
            console.log(lastOperand, currentValue, inputField.value)
            currentValue = updateCurrent(currentValue, lastOperand.length - 1);
            inputField.value = currentValue + lastOperand;
        }
        else if (buttonValue === "sqrtX") {
            // inputField.value = 0
            currentValue = updateCurrent(currentValue, lastOperand.length);
            let ans = singleValue(lastOperand, "sqrt")
            inputField.value = currentValue + ans;
        }
        else if (buttonValue in replaceArr) {
            if (replaceArr[buttonValue] !== undefined) {
                console.log("Replacing constant", currentValue, lastOperand);
                currentValue = updateCurrent(currentValue, lastOperand.length);
                inputField.value = currentValue.replace(/pi|e/g, lastOperand) + replaceArr[buttonValue];
            } else {
                inputField.value = currentValue + buttonValue;
            }
        }

    }
})

// this replace last oprand to current selected operation like for pi, e, 
const updateCurrent = function (curr, op) {
    return curr.substring(0, curr.length - op);
}
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
// console.log(singleValue(4, "sqrt"))
// console.log(typeof eval(`Math.sqrt`))
// this function is used when we want to perform only one value operation using math library
function singleValue(n, method) {
    if (typeof eval(`Math.${method}`) === "function") {
        return eval(`Math.${method}(${n})`);
    } else {
        throw new Error("Invalid Math function");
    }
}
document.getElementById("nav-history").innerHTML = checkHistory();
document.getElementById("nav-memory").innerHTML = checkMemory();
document.getElementById("offcanvas-history").firstElementChild.innerHTML = checkHistory();
document.getElementById("offcanvas-memory").firstElementChild.innerHTML = checkMemory();
function checkHistory() {
    return "There's no History yet."
}
function checkMemory() {
    return "There's nothing saved in memory."
}
function trigo(event) {
    console.log("this is trigo", event)
}