// change buttons normal - when clicking 2nd btn
export const changeButton = function () {
    console.log("in chnage buttons")
    document.querySelectorAll(".btnTd").forEach((ele) => {
        ele.classList.toggle("swap");
    })
}

let operatorsBasic = ["+", "-", "/", "*", "%"];
class Calculator {
    constructor(displayEle, displayExpEle) {
        this.display = displayEle;
        this.displayCurrVal = "";
        this.displayExp = displayExpEle;
        this.currentValue = "";
        this.isAns = false;
        this.isConstant = false;
        this.addpoint = true;
        this.historyArr = [];
    }
    appendValue(value) {
        console.log(value)
        if (value === ".") {
            if (!this.displayCurrVal) {
                this.displayCurrVal = "0.";
                this.updateDisplay();
                return;
            } else if (!this.displayCurrVal.includes('.')) {
                console.log("in point: ", value)
                this.displayCurrVal += ".";
                this.updateDisplay();
                return;
            }
            return;
        }
        if (value === "(" || value === ")") {
            return this.handleBrackets(value);
        }
        if (value === "0" && this.displayCurrVal === "") {
            return;
        }
        if (this.displayCurrVal === "" && !this.currentValue) {
            console.log("blank")
            if (operatorsBasic.includes(value)) {
                this.displayCurrVal = ""
                this.updateTopDisplay(0, value)
            } else if (!isNaN(value)) {
                this.displayCurrVal += value;
                this.updateDisplay()
            } else if (value === "(") {
                this.updateTopDisplay("(", "");
            }
        }
        else if (this.isAns && this.displayCurrVal) {
            console.log("ans")
            if (operatorsBasic.includes(value)) {
                this.updateTopDisplay(this.displayCurrVal, value)
                this.isAns = false;
            } else if (!isNaN(value)) {
                console.log("in here: ", this.isAns)
                this.displayCurrVal = value;
                this.updateDisplay()
                this.isAns = false;
            }
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

    }
    updateTopDisplay(value = "", operator = "", ans = false, replace = false) {
        if (this.currentValue.length && !replace) {
            this.currentValue = this.currentValue + value + operator
        } else {
            this.currentValue = value + operator
        }
        this.displayExp.value = this.currentValue;

        if (!ans) {
            this.displayCurrVal = "";
            this.updateDisplay()
        }
    }
    clearDisplay() {
        if (this.displayCurrVal) {
            this.displayCurrVal = "";
            this.updateDisplay();
        } else if (this.displayCurrVal === "" && this.currentValue !== "") {
            this.currentValue = "";
            this.updateTopDisplay();
        }
        this.isAns = false;
        this.isConstant = false;
    }
    deleteLast() {
        this.displayCurrVal = this.displayCurrVal.slice(0, - 1);
        this.updateDisplay();
    }
    replaceLast(length, operator) {
        let updateStr = this.currentValue.slice(0, length);
        this.updateTopDisplay(updateStr, operator, false, true);
    }
    updateDisplay() {
        this.display.value = this.displayCurrVal;
    }
    basicOperations() {
        try {
            // Check for unbalanced brackets before evaluation
            if (!this.areBracketsBalanced()) {
                this.display.value = "Error: Unbalanced brackets";
                return;
            }
            let expression = this.currentValue;

            // completing a root or log operation
            if (expression.includes('Math.pow') || expression.includes('Math.log')) {
                if (this.displayCurrVal) {
                    // Complete the expression
                    if (expression.includes('Math.pow')) {
                        expression = expression + this.displayCurrVal + ')';
                    } else if (expression.includes('Math.log')) {
                        expression = expression + this.displayCurrVal + ')';
                    }
                }
            }
            else {
                // Normal operation
                if (!this.displayCurrVal) {
                    expression = expression + expression.substring(0, expression.length - 1);
                } else {
                    expression = expression + this.displayCurrVal;
                }
            }

            let ans = eval(expression);
            this.currentValue = "";
            this.displayCurrVal = (ans !== 0) ? ans.toString() : "";
            this.updateDisplay();
            this.isAns = true;
            this.updateTopDisplay("", "", true);
        } catch (error) {
            this.display.value = "Error(In calculation)";
        }
    }
}
Calculator.prototype.handleBrackets = function (bracket) {
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
Calculator.prototype.areBracketsBalanced = function () {
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
        this.updateDisplay();
    }
};

Calculator.prototype.addConstants = function (value) {
    if (value) {
        this.displayCurrVal = value;
        if (operatorsBasic.includes(this.currentValue.toString().at(-1))) { this.currentValue += this.displayCurrVal; }
        else { this.currentValue = this.displayCurrVal }
        this.isConstant = true;
        this.updateDisplay();
    }
}

Calculator.prototype.absolute = function () {
    if (this.displayCurrVal !== "") {
        this.displayCurrVal = Math.abs(this.displayCurrVal);
        this.updateDisplay();
    }
}

// root x, log, ln
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
    if ((typeof eval(`Math.${method}`) === "function") && num) {
        this.displayCurrVal = eval(`Math.${method}(${num})`);
        this.updateDisplay();
    }
}

Calculator.prototype.mathPowValue = function (power) {
    let num = this.displayCurrVal;
    if (num) {
        this.displayCurrVal = Math.pow(num, power);
    }
    this.updateDisplay();
}

Calculator.prototype.basePowValue = function (base) {
    let power = this.displayCurrVal;
    if (power) {
        this.displayCurrVal = Math.pow(base, power);
        this.updateDisplay();
    }
}

Calculator.prototype.basicTrigoFunc = function (method, isIns = false, degree = false) {
    let disValue = this.displayCurrVal;
    if (disValue === "") return;
    let value = degree ? (disValue * Math.PI) / 180 : disValue;
    if (!isIns) { this.displayCurrVal = eval(`Math.${method}(${value})`); }
    else { this.displayCurrVal = 1 / eval(`Math.${method}(${value})`); }
    this.updateDisplay();
}

export { Calculator };