// FEATURE: added event delegation on mainTable.

import { changeTheme } from "./storage.js";
import { main } from "./event.js";
import { changeButton, Calculator } from "./calculator.js";

// changes that are need to be done on page load
document.addEventListener("DOMContentLoaded", () => {
    let theme = localStorage.getItem("theme") || "theme_light";
    main.classList.add(theme);

    const displayEle = document.getElementById("spanOutput");
    const displayExp = document.getElementById("spanOutputHistory");
    const calculator = new Calculator(displayEle, displayExp);


    // all event listners that are importtant
    document.getElementById("changeThemeBtn").addEventListener("click", changeTheme);
    document.getElementById("changeThemeBtnLg").addEventListener("click", changeTheme);
    document.getElementById("changeButtons").addEventListener("click", changeButton)
    // document.getElementById("fixed").addEventListener("click", calculator.fixed)

    document.getElementById("mainTable").addEventListener("click", function (event) {
        let constantsArr = { "pi": Math.PI, "e": Math.E };
        let oneValue = ["sqrt", "cbrt", "log10", "log", "abs", "ceil", "floor"]
        let twoValue = []
        let pow = { "sqr": "2", "cube": "3", "inverse": "-1" }
        let basePow = { "2ToX": "2", "10ToX": "10", "eToX": Math.E } //, "yRoot": "1/y"

        if (event.target.tagName === "BUTTON") {
            const buttonValue = event.target.value;
            // console.log(buttonValue)
            if (buttonValue === "clear") {
                calculator.clearDisplay();
            }
            else if (buttonValue === "backspace") {
                calculator.deleteLast();
            }
            else if (buttonValue === "eq") {
                calculator.basicOperations();
            }
            else if (buttonValue in constantsArr) {
                calculator.addConstants(constantsArr[buttonValue])
            }
            // for btn +/-
            else if (buttonValue === "toggleSign") {
                calculator.toggleSign();
            }
            else if (buttonValue === "absX") {
                calculator.absolute();
            }
            else if (buttonValue === "fact") {
                calculator.factorial();
            }
            else if (buttonValue === "xToY") {
                calculator.xToY();
            }
            else if (buttonValue === "yRootX") {
                calculator.yRootX();
            }
            else if (buttonValue === "logXbaseY") {
                calculator.logXbaseY();
            }
            else if (buttonValue === "exponent") {
                calculator.exp();
            }
            else if (oneValue.includes(buttonValue)) {
                calculator.singleValue(buttonValue);
            }
            else if (buttonValue in pow) {
                calculator.mathPowValue(pow[buttonValue]);
            }
            else if (buttonValue in basePow) {
                calculator.basePowValue(basePow[buttonValue]);
            }
            else {
                console.log(buttonValue)
                calculator.appendValue(buttonValue);
            }
        }
    });

    let degShow = false;
    document.getElementById("fixedDegree").addEventListener("click", function (event) {
        let buttonValue = event.target.id;
        // console.log(buttonValue)
        let deg = document.getElementById("degree");
        let degLable = document.getElementById("degreeLable");
        degLable.innerText = "RAD"
        if (buttonValue === "fixed") {
            calculator.fixed();
        }
        if (deg.checked) {
            degLable.innerText = "DEG"
            degShow = true;
        }
    })
    document.getElementById("mathFunc").addEventListener("click", function (event) {
        let func = ["ceil", "floor"]
        if (event.target.tagName === "BUTTON") {
            const buttonValue = event.target.value;
            if (func.includes(buttonValue)) {
                calculator.mathFunc(buttonValue);
            } else if (buttonValue === "absX") {
                calculator.absolute();
            }
        }
    })
    document.getElementById("trigonometry").addEventListener("click", function (event) {
        let trigoNormal = ["sin", "cos", "tan", "sec", "csc", "cot"]
        let trigoHyp = ["sinh", "cosh", "tanh", "sech", "csch", "coth"]
        let trigoIns = ["sin-1", "cos-1", "tan-1", "sec-1", "csc-1", "cot-1"]
        let trigoInsHyp = ["sin-1h", "cos-1h", "tan-1h", "sec-1h", "csc-1h", "cot-1h"]

        // these 2 arr are for calculation
        let basicTrigo = [
            { "sin": "sin" }, { "cos": "cos" }, { "tan": "tan" },
            { "sinh": "sinh" }, { "cosh": "cosh" }, { "tanh": "tanh" },
            { "sin-1": "asin" }, { "cos-1": "acos" }, { "tan-1": "atan" },
            { "sin-1h": "asinh" }, { "cos-1h": "acosh" }, { "tan-1h": "atanh" }
        ]
        let insTrigo = [
            { "csc": "sin" }, { "sec": "cos" }, { "cot": "tan" },
            { "csc": "sinh" }, { "sech": "cosh" }, { "coth": "tanh" },
            { "csc-1": "asin" }, { "sec-1": "acos" }, { "cot-1": "atan" },
            { "csc-1h": "asinh" }, { "sec-1h": "acosh" }, { "cot-1h": "atanh" }
        ]
        // for below array sin-cosec, cos-sec, tan-cot
        // let insTrigo = ["sin", "cos", "tan", "sinh", "cosh", "tanh", "sin-1", "cos-1", "tan-1", "sin-1h", "cos-1h", "tan-1h"]

        let isInverse = document.getElementById("changeButtonsIns").checked;
        let isHyp = document.getElementById("changeButtonsHyp").checked;
        const buttonValue = event.target.value;
        // console.log(isHyp, isInverse)
        let trigoElements = Array.from(document.getElementsByClassName("trigoFun"))
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
        // console.log("trigo selected btn : ", buttonValue)
        let foundTrigo = basicTrigo.find(obj => Object.keys(obj)[0] === buttonValue);
        let foundInsTrigo = insTrigo.find(obj => Object.keys(obj)[0] === buttonValue);
        if (foundTrigo) {
            let method = Object.values(foundTrigo)[0]; // Extract corresponding function name
            calculator.basicTrigoFunc(method, false, degShow);
        } else if (foundInsTrigo) {
            let method = Object.values(foundInsTrigo)[0]; // Extract corresponding function name
            calculator.basicTrigoFunc(method, true, degShow)
        }
    });

});