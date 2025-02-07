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
    let theme = localStorage.getItem('theme');
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
let isInverse = false;
let isHyp = false;
let trigoElements = [];
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

    else if (event.target.tagName === "BUTTON") {
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
        let oneValue = ["sqrt", "cbrt", "log10", "log", "abs", "ceil", "floor"]
        let twoValue = []
        let pow = { "sqr": "2", "cube": "3", "inverse": "-1" }
        let basePow = { "2ToX": "2", "10ToX": "10", "eToX": Math.E } //, "yRoot": "1/y"
        // console.log(Math.abs(-2))
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
        else if (oneValue.includes(buttonValue)) {
            currentValue = updateCurrent(currentValue, lastOperand.length);
            let ans = singleValue(lastOperand, buttonValue)
            console.log("ans is : ", ans)
            inputField.value = currentValue + ans;
        }
        else if (buttonValue in pow) {
            currentValue = updateCurrent(currentValue, lastOperand.length);
            let ans = mathPowValue(lastOperand, pow[buttonValue])
            inputField.value = currentValue + ans;
        }
        else if (buttonValue in basePow) {
            currentValue = updateCurrent(currentValue, lastOperand.length);
            let ans = basePowValue(lastOperand, basePow[buttonValue])
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

        document.getElementById("trigonometry").addEventListener("click", function (event) {
            let trigoNormal = ["sin", "cos", "tan", "sec", "csc", "cot"]
            let trigoHyp = ["sinh", "cosh", "tanh", "sech", "csch", "coth"]
            let trigoIns = ["sin-1", "cos-1", "tan-1", "sec-1", "csc-1", "cot-1"]
            let trigoInsHyp = ["sin-1h", "cos-1h", "tan-1h", "sec-1h", "csc-1h", "cot-1h"]
            let btnVal = event.target.value;
            // let btnId = event.target.id;
            // console.log("button id is : ", event)
            // if (btnId === "trigonometry") {
            trigoElements = Array.from(document.getElementsByClassName("trigoFun"))
            // console.log("trigoElements: ", trigoElements)
            if (btnVal === "changeButtonsIns") {
                isInverse = !isInverse;
                // console.log("isInverse: ", isInverse)
            }
            else if (btnVal === "changeButtonsHyp") {
                isHyp = !isHyp;
                // console.log("isHyp: ", isHyp)
            }
            // console.log("trigoElements: ", trigoElements)
            // if (trigoNormal.includes(btnVal) || trigoHyp.includes(btnVal) || trigoIns.includes(btnVal) || trigoInsHyp.includes(btnVal)) {
            // console.log("in trigo section", event.target.value)

            if (isHyp && isInverse) {
                trigoElements.forEach((ele, index) => {
                    ele.value = trigoInsHyp[index];
                    ele.innerHTML = ele.value;
                })
            } else if (isHyp) {
                trigoElements.forEach((ele, index) => {
                    ele.value = trigoHyp[index];
                    ele.innerHTML = ele.value;
                })
            } else if (isInverse) {
                trigoElements.forEach((ele, index) => {
                    ele.value = trigoIns[index];
                    ele.innerHTML = ele.value;
                })
            } else {
                trigoElements.forEach((ele, index) => {
                    ele.value = trigoNormal[index];
                    ele.innerHTML = ele.value;
                })
            }
            console.log("trigo selected btn : ", btnVal)

            // currentValue = updateCurrent(currentValue, btnVal.length);
            if (trigoNormal.includes(btnVal)) {
                ans = eval(`Math.${btnVal}(${lastOperand})`)
                console.log("this is ans: ", ans)
            }
            inputField.value = currentValue + ans;
            // }
            // }
            // else {
            //     console.error("button not present on trigo.")
            // }
            // }
        })
    }

})

// this replace last oprand to current selected operation like for pi, e, 
const updateCurrent = function (curr, op) {
    return curr.substring(0, curr.length - op);
}
const evaluate = function (spanValue) {
    const ans = eval(spanValue);
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
function mathPowValue(num, power) {
    return Math.pow(num, power);
}
function basePowValue(power, base) {
    return Math.pow(base, power);
}
function singleValue(num, method) {
    if (typeof eval(`Math.${method}`) === "function") {
        return eval(`Math.${method}(${num})`);
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
