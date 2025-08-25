let res = document.getElementById("result");
// const limit = 12;


function getNum(num) {
    let lastChar = res.value.slice(-1);

    // if (res.value.length >= limit) return;

    if (res.value === "" || res.value === "0") {
        res.value = num;
        
    }  
    else if (lastChar === "π" || lastChar === "e" || lastChar === ")") {
        // implicit multiplication
        res.value += "*" + num;
    }

    else {
        if (lastChar === "0" && "+-*/^(".includes(res.value.slice(-2, -1))) {
            res.value = res.value.slice(0, -1) + num;
        }
        else {
            res.value += num;
        }
    }
}


function clearScr() {
    res.value = "";
}



function removeNum() {
    res.value = res.value.slice(0, -1);
}



function getOp(op) {

    let lastChar = res.value.slice(-1);

    if (res.value === "" || res.value === "0") {
        if (op === "-") {
            res.value = "-";
        }
        return;
    }
    if ("+-*/^".includes(lastChar)) {
        return;
    }
    res.value += op;
}



function getAns() {
    try {
        if (res.value === "") {
            return;
        }

        let expr = res.value;

        expr = expr.replace(/π/g, "Math.PI");
        expr = expr.replace(/e/g, "Math.E");

        expr = expr.replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)");

        expr = expr.replace(/sin\(/g, "customSin(");
        expr = expr.replace(/cos\(/g, "customCos(");
        expr = expr.replace(/tan\(/g, "customTan(");

        expr = expr.replace(/log\(/g, "Math.log10(");
        expr = expr.replace(/ln\(/g, "Math.log(");
        expr = expr.replace(/exp\(/g, "Math.exp(");

        expr = expr.replace(/\^/g, "**");
        expr = expr.replace(/(\d+(\.\d+)?)%/g, "($1/100)");



        expr = expr.replace(/(\d+)!/g, "factorial($1)");
        expr = expr.replace(/\(([^()]+)\)!/g, "factorial($1)");

         // ✅ Auto-close brackets if not balanced
        let openCount = (expr.match(/\(/g) || []).length;
        let closeCount = (expr.match(/\)/g) || []).length;
        while (closeCount < openCount) {
            expr += ")";
            closeCount++;
        }




        let originalExpr = res.value;
        let result = eval(expr);

        // if (!isFinite(result)) {
        //     res.value = "";
        //     return;
        // }


        res.value = result;


        addToHistory(originalExpr, result);


    } catch {
        res.value = "";
    }
}



function getDot() {
    let lastChar = res.value.slice(-1);

    if (res.value === "" || "+-*/^(".includes(lastChar)) {
        res.value += "0.";
    }
    else if (/\.\d*$/.test(res.value)) {
        return;
    }
    else {
        res.value += ".";
    }
}

function getFunc(func) {
    let last = res.value.slice(-1);

    if (func === "√") {

        if (last === "√") {
            return;
        }

        if (last && "0123456789πe)".includes(last)) {
            res.value += "*√";
        } else {
            res.value += "√";
        }
        return;
    }

    if (["sin(", "cos(", "tan(", "log(", "ln(", "exp("].includes(func)) {
        if (last && "0123456789πe)".includes(last)) {
            res.value += "*" + func;
        } else {
            res.value += func;
        }
        return;
    }

    res.value += func;
}


function getFactorial() {
    let lastChar = res.value.slice(-1);
    if (/\d|\)/.test(lastChar)) {
        res.value += "!";
    }
}

let angleMode = "DEG"; // default

function toggleAngleMode() {
    if (angleMode === "DEG") {
        angleMode = "RAD";
        document.getElementById("angleModeBtn").innerText = "RAD";
    } else {
        angleMode = "DEG";
        document.getElementById("angleModeBtn").innerText = "DEG";
    }
}

function customSin(x) {
    return angleMode === "DEG" ? Math.sin(x * Math.PI / 180) : Math.sin(x);
}
function customCos(x) {
    return angleMode === "DEG" ? Math.cos(x * Math.PI / 180) : Math.cos(x);
}
function customTan(x) {
    return angleMode === "DEG" ? Math.tan(x * Math.PI / 180) : Math.tan(x);
}


function square() {
    try {
        if (res.value !== "") {
            res.value  = Math.pow(eval(res.value), 2);
            // res.value = isFinite(result) ? result : "";
        }
    } catch {
        res.value = "";
    }
}

function cube() {
    try {
        if (res.value !== "") {
            res.value = Math.pow(eval(res.value), 3);
            // res.value = isFinite(result) ? result : "";
        }
    } catch {
        res.value = "";
    }
}
function percentage() {
    try {
        if (res.value !== "") {
            res.value = eval(res.value) / 100;
        }
    } catch {
        res.value = "";
    }
}




document.addEventListener("keydown",

    function (event) {
        let key = event.key;

        if ("0123456789".includes(key)) {
            getNum(key);
        }

        if ("+-*/^".includes(key)) {
            getOp(key);
        }
        else if (key === ".") {
            getDot();
        }

        if (key === "Enter" || key === "=") {
            event.preventDefault();
            getAns();
        }

        if (key === "Backspace") {
            removeNum();
        }
        if (key === "Escape") {
            clearScr();
        }
    });


function getConst(constant) {
    let last = res.value.slice(-1);

    if (res.value === "" || "+-*/^(".includes(last)) {
        res.value += constant; // no multiplication needed
    } else if (/\d|\)|π|e/.test(last)) {
        // implicit multiplication
        res.value += "*" + constant;
    } else {
        res.value += constant;
    }
}


function factorial(n) {
    n = Math.floor(n);
    if (n < 0) return;
    if (n === 0) return 1;
    return n * factorial(n - 1);
}


function getInv() {
    if (res.value === "" || res.value === "0") {
        return;
    }

    try {
        let expr = res.value;
        let num = eval(expr);
        let result = 1 / num;

        res.value = isFinite(result) ? result : "";
    } catch {
        res.value = "";
    }
}


function getBracket(br) {
    let expr = res.value;
    let last = expr.slice(-1);

    if (br === "(") {
        if (expr === "" || "+-*/^(".includes(last)) {
            res.value += "(";
        }
    } else if (br === ")") {
        let openCount = (expr.match(/\(/g) || []).length;
        let closeCount = (expr.match(/\)/g) || []).length;

        if (openCount > closeCount && !"+-*/^(".includes(last)) {
            res.value += ")";
        }
    }
}
// Reference to history list
const historyList = document.getElementById("historyList");
let lastResult = null; // store last result

// Function to add history item
function addToHistory(expression, result) {
    // ✅ Prevent duplicate if same result as last
    if (result === lastResult) return;
    lastResult = result;

    let li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
        <span>${expression} = <strong>${result}</strong></span>
        <button class="btn btn-sm btn-outline-secondary">Use</button>
    `;

    // "Use" button → set result back to input
    li.querySelector("button").addEventListener("click", function () {
        res.value = result;
    });

    // Add to top
    historyList.prepend(li);

    // ✅ Limit to 5 items
    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Function to clear history
function clearHistory() {
    historyList.innerHTML = "";
    lastResult = null;
}
