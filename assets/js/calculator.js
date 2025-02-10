import { inputField, inputFieldHistory, point } from "./event.js"
// when all is clear, and press number then operator again operator, appending it, like 6+- is 66-
// when we change the sign of ans and do absolute and then press any number then it is appending.
// when user clicks random btn when there is no input number, like pressing log when calc is clear.
// backspace is clearing whole number
// more than one . and 0 are being added
document.addEventListener("DOMContentLoaded", function () {
    // checkHistory();
    // checkMemory();
    // document.getElementById("trigonometry").addEventListener("click", trigo(event))
})

// change buttons normal - when clicking 2nd btn
export const changeButton = function () {
    console.log("in chnage buttons")
    document.querySelectorAll(".btnTd").forEach((ele) => {
        ele.classList.toggle("swap");
    })
}

let operatorsBasic = ["+", "-", "/", "*", "%"];
let twoValue = []
let pow = { "sqr": "2", "cube": "3", "inverse": "-1" }
let basePow = { "2ToX": "2", "10ToX": "10", "eToX": Math.E } //, "yRoot": "1/y"
class Calculator {
    constructor(displayEle, displayExpEle) {
        this.display = displayEle;
        this.displayCurrVal = "";
        this.displayExp = displayExpEle;
        this.currentValue = "";
        this.isAns = false;
        this.isConstant = false;
        this.historyArr = [];
    }
    appendValue(value) {
        // if(Number.isInteger(typeof Number(this.displayCurrVal))){
        //     console.log("set disable",Number.isInteger(typeof Number(this.displayCurrVal)))
        //     // point.setAttribute('disabled')
        // }
        if (value === "(" || value === ")") {
            return this.handleBrackets(value);
        }
        if (this.displayCurrVal === "" && !this.currentValue) {
            console.log("blank")
            // document.getElementById("zero").setAttribute('disabled');
            if (operatorsBasic.includes(value)) {
                this.displayCurrVal = ""
                this.updateTopDisplay(0, value)
            } else if (!isNaN(value)) {
                this.displayCurrVal += value;
                this.updateDisplay()
            } else if (value === "(") {
                this.updateTopDisplay("(", "");
            }
            // else if (value === "(") {
            //     this.updateTopDisplay("(0", "")
            // }
            // else if (this.isConstant) {
            //     console.log("direct constant")
            //     this.displayCurrVal = value;
            //     this.updateDisplay()
            // }
        }
        else if (this.isAns && this.displayCurrVal) {
            console.log("ans")
            if (operatorsBasic.includes(value)) {
                this.updateTopDisplay(this.displayCurrVal, value)
            } else if (!isNaN(value)) {
                this.displayCurrVal = value;
                this.updateDisplay()
            }
            this.isAns = false;
        }
        else if (this.isConstant && this.displayCurrVal) {
            console.log("constant")
            if (operatorsBasic.includes(value)) {
                this.updateTopDisplay(this.displayCurrVal, value)
            } else if (!isNaN(value)) {
                this.displayCurrVal = value;
                this.updateDisplay()
            }
            this.isConstant = false;
        } else {
            console.log("other case")
            if (this.currentValue && operatorsBasic.includes(this.currentValue.toString().at(-1)) && operatorsBasic.includes(value) && !this.displayCurrVal) {
                console.log("in replace", this.currentValue.toString().at(-1), value)
                this.replaceLast(-1, value)
            }
            else if (operatorsBasic.includes(value)) {
                console.log("in here")
                this.updateTopDisplay(this.displayCurrVal, value)
            } else if (!isNaN(value)) {
                this.displayCurrVal += value;
                this.updateDisplay()
            }
        }

        if (value === ".") {
            if (this.displayCurrVal) {
                this.displayCurrVal += ".";
                this.updateDisplay();
            } else {
                this.displayCurrVal = "0.";
                this.updateDisplay();
            }
        }
    }
    updateTopDisplay(value = "", operator = "", ans = false, replace = false) {
        // console.log("in update top display: ", this.currentValue.toString())
        if (this.currentValue.length && !replace) {
            this.currentValue = this.currentValue + value + operator
        } else {
            this.currentValue = value + operator
        }
        // console.log("now: ",this.currentValue)
        this.displayExp.value = this.currentValue;

        if (!ans) {
            this.displayCurrVal = "";
            this.updateDisplay()
        }
    }
    clearDisplay() {
        this.currentValue = "";
        this.displayCurrVal = "";
        this.isAns = false;
        this.isConstant = false;
        this.updateDisplay();
        this.updateTopDisplay();
    }
    deleteLast() {
        // this.currentValue = this.currentValue.slice(0, -1);
        this.displayCurrVal = this.currentValue.slice(0, this.displayCurrVal - 1);
        this.updateDisplay();
    }
    replaceLast(length, operator) {
        let updateStr = this.currentValue.slice(0, length);
        // this.displayCurrVal = this.currentValue.slice(0, length);
        this.updateTopDisplay(updateStr, operator, false, true);
    }
    updateDisplay() {
        this.display.value = this.displayCurrVal;
        // this.displayExp.value = this.currentValue;
        // console.log(this.displayCurrVal, this.currentValue)
    }
    basicOperations() {
        try {
            // Check for unbalanced brackets before evaluation
            if (!this.areBracketsBalanced()) {
                this.display.value = "Error: Unbalanced brackets";
                return;
            }
            let expression = this.currentValue;

            // Handle the case where we're completing a root or log operation
            if (expression.includes('Math.pow') || expression.includes('Math.log')) {
                if (this.displayCurrVal) {
                    // Complete the expression
                    if (expression.includes('Math.pow')) {
                        if (expression.includes('* Math.pow(10,')) {
                            // EXP operation
                            expression = expression + this.displayCurrVal + ')';
                        } else {
                            // yRootX operation
                            expression = expression + this.displayCurrVal + ')';
                        }
                    } else if (expression.includes('Math.log')) {
                        expression = expression + this.displayCurrVal + ')';
                    }
                }
            } else {
                // Normal operation
                expression = expression + this.displayCurrVal;
            }

            let ans = eval(expression);
            this.currentValue = "";
            this.displayCurrVal = ans.toString();
            this.updateDisplay();
            this.isAns = true;
            this.updateTopDisplay("", "", true);
        } catch (error) {
            this.display.value = "Error(In calculation)";
        }
    }
}
Calculator.prototype.handleBrackets = function(bracket) {
    // Opening bracket cases
    if (bracket === "(") {
        // Case 1: Empty calculator
        if (this.displayCurrVal === "" && !this.currentValue) {
            this.updateTopDisplay("(", "");
            return;
        }
        
        // Case 2: After an operator
        if (this.currentValue && operatorsBasic.includes(this.currentValue.slice(-1))) {
            this.currentValue += "(";
            this.updateTopDisplay();
            return;
        }
        
        // Case 3: After a number in displayCurrVal
        if (this.displayCurrVal) {
            this.updateTopDisplay(this.displayCurrVal, "*(");
            return;
        }
        
        // Default case: Just append the opening bracket
        this.currentValue += "(";
        this.updateTopDisplay();
    }
    
    // Closing bracket cases
    if (bracket === ")") {
        // Case 1: No opening bracket exists
        if (!this.currentValue.includes("(")) {
            return;
        }
        
        // Case 2: After a number in displayCurrVal
        if (this.displayCurrVal) {
            this.updateTopDisplay(this.displayCurrVal, ")");
            return;
        }
        
        // Case 3: After an operator (invalid case)
        if (operatorsBasic.includes(this.currentValue.slice(-1))) {
            return;
        }
        
        // Default case: Just append the closing bracket
        this.currentValue += ")";
        this.updateTopDisplay();
    }
};

// Add a method to check if brackets are balanced
Calculator.prototype.areBracketsBalanced = function() {
    let count = 0;
    for (let char of this.currentValue) {
        if (char === '(') count++;
        if (char === ')') count--;
        if (count < 0) return false;  // More closing than opening brackets
    }
    return count === 0;  // Should be zero if perfectly balanced
};
Calculator.prototype.toggleSign = function () {
    if (this.displayCurrVal) {
        this.displayCurrVal = (-parseFloat(this.displayCurrVal)).toString();
        console.log("replace dis: ", this.displayCurrVal.length - 1)
        // this.replaceLast(-parseFloat(this.displayCurrVal.length));
        // this.currentValue += this.displayCurrVal
        this.updateDisplay();
    }
};

Calculator.prototype.addConstants = function (value) {
    // console.log(value)
    if (value) {
        this.displayCurrVal = value;
        if (operatorsBasic.includes(this.currentValue.toString().at(-1))) { this.currentValue += this.displayCurrVal; }
        else { this.currentValue = this.displayCurrVal }
        this.isConstant = true;

        this.updateDisplay();
    }
}

Calculator.prototype.absolute = function () {
    if (this.displayCurrVal) {
        this.displayCurrVal = Math.abs(this.displayCurrVal);
        // this.ans = true;
        this.updateDisplay();
    }
}

Calculator.prototype.factorial = function () {
    let n = this.displayCurrVal ? this.displayCurrVal : 0;
    let res = 1;
    for (let i = 1; i <= n; i++) {
        res *= i;
    }
    this.displayCurrVal = res;
    this.updateDisplay();
}

Calculator.prototype.mathFunc = function (method) {
    let value = this.displayCurrVal;
    this.displayCurrVal = eval(`Math.${method}(${value})`);
    this.updateDisplay();
}
Calculator.prototype.fixed = function () {
    let num = this.displayCurrVal;
    this.displayCurrVal = Number(num).toExponential().toString();
    this.updateDisplay();
}
Calculator.prototype.xToY = function () {
    if (this.currentValue) { this.currentValue = this.currentValue.toString() + this.displayCurrVal + "**" }
    else if (this.currentValue === "" && this.displayCurrVal) { this.currentValue = this.displayCurrVal.toString() + "**" }
    this.updateTopDisplay();
}
Calculator.prototype.yRootX = function () {
    if (this.displayCurrVal) {
        // Store the current value as the number to find root of
        let x = this.displayCurrVal;
        this.currentValue = `Math.pow(${x}, 1/`;
        this.displayCurrVal = "";
        this.updateDisplay();
        this.updateTopDisplay();
    }
};


Calculator.prototype.logXbaseY = function () {
    if (this.displayCurrVal) {
        // Store the current value as the number to find log of
        let x = this.displayCurrVal;
        this.currentValue = `Math.log(${x})/Math.log(`;
        this.displayCurrVal = "";
        this.updateDisplay();
        this.updateTopDisplay();
    }
};
Calculator.prototype.exp = function () {
    if (this.displayCurrVal) {
        // Store the current value as the coefficient
        let coefficient = this.displayCurrVal;
        this.currentValue = `${coefficient} * Math.pow(10,`;
        this.displayCurrVal = "";
        this.updateDisplay();
        this.updateTopDisplay();
    }
};
Calculator.prototype.singleValue = function (method) {
    let num = this.displayCurrVal;
    if (typeof eval(`Math.${method}`) === "function") {
        this.displayCurrVal = eval(`Math.${method}(${num})`);
        this.updateDisplay();
    } else {
        throw new Error("Invalid Math function");
    }
}

Calculator.prototype.mathPowValue = function (power) {
    let num = this.displayCurrVal;
    this.displayCurrVal = Math.pow(num, power);
    this.updateDisplay();
}

Calculator.prototype.basePowValue = function (base) {
    let power = this.displayCurrVal;
    this.displayCurrVal = Math.pow(base, power);
    this.updateDisplay();
}

Calculator.prototype.basicTrigoFunc = function (method, isIns = false, degree = false) {
    let disValue = this.displayCurrVal;
    // console.log(value, method)
    if (disValue === "") return;
    let value = degree ? (disValue * Math.PI) / 180 : disValue;
    if (!isIns) { this.displayCurrVal = eval(`Math.${method}(${value})`); }
    else { this.displayCurrVal = 1 / eval(`Math.${method}(${value})`); }

    this.updateDisplay();
}



export { Calculator };







// old code, without module and class
// function getLastOperand(expression) {
//     // Split by operators (+, -, *, /) but keep negative numbers intact
//     console.log("in last operand ", expression)
//     // if (inputFieldHistory.value == 0) {
//     //     inputFieldHistory.value = expression;
//     // } else {
//     //     inputFieldHistory.value = expression;
//     // }
//     let operands = expression.split(/[\+\-\*\/]/);
//     // if (operands.includes(expression[-1])) {
//     //     inputField.value = 0;
//     // }
//     return operands.pop().trim(); // Get last number
// }
// let isResultDisplayed = false; // Flag to track if = was pressed
// let isInverse = false;
// let isHyp = false;
// let trigoElements = [];
// // const pi = Math.PI;
// document.getElementById("mainTable").addEventListener("click", function (event) {
//     // FIXME: this is for removing previous output if = clicked before.
//     // if current btn clicked is other value then replace or else if operand then append with 0.
//     if (isResultDisplayed) {
//         console.log(isResultDisplayed)
//         // if (isResultDisplayed) {
//         inputField.value = ""; // Clear previous result if a number is pressed
//         isResultDisplayed = false;
//         // }
//     }

//     else if (event.target.tagName === "BUTTON") {
//         const buttonValue = event.target.value;
//         // console.log(buttonValue);
//         let currentValue = inputField.value;

//         // this is to seperate input from operators
//         let lastOperand = getLastOperand(currentValue);
//         inputField.value = lastOperand;
//         // console.log(lastOperand)
//         // let num = parseInt(lastOperand, 10);
//         // if (isNaN(num) || num < 0) return "Error";

//         if (currentValue === "0") {
//             inputField.value = buttonValue;
//         } else {
//             inputField.value = currentValue + buttonValue;
//         }
//         let replaceArr = { "pi": Math.PI, "e": Math.E };
//         let oneValue = ["sqrt", "cbrt", "log10", "log", "abs", "ceil", "floor"]
//         let twoValue = []
//         let pow = { "sqr": "2", "cube": "3", "inverse": "-1" }
//         let basePow = { "2ToX": "2", "10ToX": "10", "eToX": Math.E } //, "yRoot": "1/y"
//         // console.log(Math.abs(-2))
//         // operations on value after some operator
//         if (buttonValue === "=") {
//             let returnAns = evaluate(currentValue);
//             inputField.value = returnAns;
//             isResultDisplayed = true;
//             checkHistory();
//             checkMemory();
//         }
//         else if (buttonValue === "clear") {
//             inputField.value = "";
//         }
//         else if (buttonValue === "backspace") {
//             currentValue = currentValue.substr(0, currentValue.length - 1);
//             inputField.value = currentValue;
//         }
//         else if (buttonValue === "fact") {
//             const factcurrentValue = fact(lastOperand);
//             inputField.value = currentValue.substr(0, currentValue.length - lastOperand.length) + factcurrentValue;
//         }
//         else if (buttonValue === "mod") {
//             // let returnAns = evaluate(currentValue);
//             inputField.value += "%";
//         }
//         else if (buttonValue === "+-") {
//             lastOperand = (lastOperand < 0 ? lastOperand.slice(1) : "-" + lastOperand)
//             console.log(lastOperand, currentValue, inputField.value)
//             currentValue = updateCurrent(currentValue, lastOperand.length - 1);
//             inputField.value = currentValue + lastOperand;
//         }
//         else if (oneValue.includes(buttonValue)) {
//             currentValue = updateCurrent(currentValue, lastOperand.length);
//             let ans = singleValue(lastOperand, buttonValue)
//             console.log("ans is : ", ans)
//             inputField.value = currentValue + ans;
//         }
//         else if (buttonValue in pow) {
//             currentValue = updateCurrent(currentValue, lastOperand.length);
//             let ans = mathPowValue(lastOperand, pow[buttonValue])
//             inputField.value = currentValue + ans;
//         }
//         else if (buttonValue in basePow) {
//             currentValue = updateCurrent(currentValue, lastOperand.length);
//             let ans = basePowValue(lastOperand, basePow[buttonValue])
//             inputField.value = currentValue + ans;
//         }
//         else if (buttonValue in replaceArr) {
//             if (replaceArr[buttonValue] !== undefined) {
//                 console.log("Replacing constant", currentValue, lastOperand);
//                 currentValue = updateCurrent(currentValue, lastOperand.length);
//                 inputField.value = currentValue.replace(/pi|e/g, lastOperand) + replaceArr[buttonValue];
//             } else {
//                 inputField.value = currentValue + buttonValue;
//             }
//         }

//         document.getElementById("trigonometry").addEventListener("click", function (event) {
//             let trigoNormal = ["sin", "cos", "tan", "sec", "csc", "cot"]
//             let trigoHyp = ["sinh", "cosh", "tanh", "sech", "csch", "coth"]
//             let trigoIns = ["sin-1", "cos-1", "tan-1", "sec-1", "csc-1", "cot-1"]
//             let trigoInsHyp = ["sin-1h", "cos-1h", "tan-1h", "sec-1h", "csc-1h", "cot-1h"]
//             let btnVal = event.target.value;
//             // let btnId = event.target.id;
//             // console.log("button id is : ", event)
//             // if (btnId === "trigonometry") {
//             trigoElements = Array.from(document.getElementsByClassName("trigoFun"))
//             // console.log("trigoElements: ", trigoElements)
//             if (btnVal === "changeButtonsIns") {
//                 isInverse = !isInverse;
//                 // console.log("isInverse: ", isInverse)
//             }
//             else if (btnVal === "changeButtonsHyp") {
//                 isHyp = !isHyp;
//                 // console.log("isHyp: ", isHyp)
//             }
//             // console.log("trigoElements: ", trigoElements)
//             // if (trigoNormal.includes(btnVal) || trigoHyp.includes(btnVal) || trigoIns.includes(btnVal) || trigoInsHyp.includes(btnVal)) {
//             // console.log("in trigo section", event.target.value)

//             if (isHyp && isInverse) {
//                 trigoElements.forEach((ele, index) => {
//                     ele.value = trigoInsHyp[index];
//                     ele.innerHTML = ele.value;
//                 })
//             } else if (isHyp) {
//                 trigoElements.forEach((ele, index) => {
//                     ele.value = trigoHyp[index];
//                     ele.innerHTML = ele.value;
//                 })
//             } else if (isInverse) {
//                 trigoElements.forEach((ele, index) => {
//                     ele.value = trigoIns[index];
//                     ele.innerHTML = ele.value;
//                 })
//             } else {
//                 trigoElements.forEach((ele, index) => {
//                     ele.value = trigoNormal[index];
//                     ele.innerHTML = ele.value;
//                 })
//             }
//             console.log("trigo selected btn : ", btnVal)

//             // currentValue = updateCurrent(currentValue, btnVal.length);
//             if (trigoNormal.includes(btnVal)) {
//                 ans = eval(`Math.${btnVal}(${lastOperand})`)
//                 console.log("this is ans: ", ans)
//             }
//             inputField.value = currentValue + ans;
//             // }
//             // }
//             // else {
//             //     console.error("button not present on trigo.")
//             // }
//             // }
//         })
//     }

// })

// // this replace last oprand to current selected operation like for pi, e,
// const updateCurrent = function (curr, op) {
//     return curr.substring(0, curr.length - op);
// }
// const evaluate = function (spanValue) {
//     const ans = eval(spanValue);
//     return ans;
// }

// function fact(n) {
//     let res = 1;
//     for (let i = 1; i <= n; i++) {
//         res *= i;
//     }
//     return res;
// }
// // console.log(singleValue(4, "sqrt"))
// // console.log(typeof eval(`Math.sqrt`))
// // this function is used when we want to perform only one value operation using math library
// function mathPowValue(num, power) {
//     return Math.pow(num, power);
// }
// function basePowValue(power, base) {
//     return Math.pow(base, power);
// }
// function singleValue(num, method) {
//     if (typeof eval(`Math.${method}`) === "function") {
//         return eval(`Math.${method}(${num})`);
//     } else {
//         throw new Error("Invalid Math function");
//     }
// }
// document.getElementById("nav-history").innerHTML = checkHistory();
// document.getElementById("nav-memory").innerHTML = checkMemory();
// document.getElementById("offcanvas-history").firstElementChild.innerHTML = checkHistory();
// document.getElementById("offcanvas-memory").firstElementChild.innerHTML = checkMemory();
// function checkHistory() {
//     return "There's no History yet."
// }
// function checkMemory() {
//     return "There's nothing saved in memory."
// }
// function trigo(event) {
//     console.log("this is trigo", event)
// }