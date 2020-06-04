// (function(){

const calcKeys = document.getElementsByClassName("calc-key"); 
const resultField = document.getElementById("result"); 
const allDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const allOperators = ["+", "*", "/", "-"];
const allOperatorsExcludeMinus = ["+", "*", "/"];

for (let calcKey of calcKeys) {
    calcKey.addEventListener("click", buttonClick);
}

function buttonClick() {
    switch (this.getAttribute("name")) {
        case "num-char":
            digitKeysClick(this);
            break;
        case "math-char":
            operatorKeysClick(this);
            break;
        case "dot-char":
            decimalPointKeyClick(this);
            break;
        case "op-char":
            switch (this.id) {
                case "clear-key":
                    resultField.textContent = clearKeysClick(this);
                    break;
                case "clear-one-key":
                    resultField.textContent = clearKeysClick(this);
                    break;
                case "equal-key":
                    resultField.textContent = printResult();
                    break;                    
            }     
            break;
    }
}



//////////////////////////
// MULTI-KEY FUNCTIONS //
////////////////////////

function digitKeysClick(keyElement) {
    let resultFieldText = resultField.textContent;

    let lastChar = resultFieldText.charAt(resultFieldText.length - 1);
    let charBeforeLast = resultFieldText.charAt(resultFieldText.length - 2);    
    let thisKeyElementText = keyElement.firstElementChild.textContent;

    if (keyElement.id === "zero-key") {
        if (lastChar === "0" && resultFieldText.length === 1) {
            return;
        }
        else if (lastChar === "0" && resultFieldText.length === 2 && resultFieldText.charAt(0) === "-") {
            return;
        }
        else if (lastChar === "0" && allOperators.includes(charBeforeLast)) {
            return;
        }
        else {
            resultField.textContent += thisKeyElementText;
        }
    }
    else {
        if (lastChar === "0" && resultFieldText.length === 1) {
            resultField.textContent = thisKeyElementText;
        }
        else if (lastChar === "0" && allOperators.includes(charBeforeLast)) {
            resultField.textContent = resultFieldText.slice(0, resultFieldText.length - 1) + thisKeyElementText;
        }
        else {
            resultField.textContent += thisKeyElementText;
        }
    }
}

function operatorKeysClick(keyElement) {
    let resultFieldText = resultField.textContent;
    let lastChar = resultFieldText.charAt(resultFieldText.length - 1);
    let charBeforeLast = resultFieldText.charAt(resultFieldText.length - 2);
    let thisKeyElementText = keyElement.firstElementChild.textContent;

    if (allOperators.includes(lastChar) || (lastChar === "." && allOperators.includes(charBeforeLast)) || (resultFieldText === "" && allOperatorsExcludeMinus.includes(thisKeyElementText))) {
        return;
    }
    else if (lastChar === "." && !allOperators.includes(charBeforeLast)) {
        resultField.textContent = resultFieldText.slice(0, resultFieldText.length - 1) + thisKeyElementText;
    }
    else {
        resultField.textContent += thisKeyElementText;
    }
}

function decimalPointKeyClick(keyElement) {
    let lastChar = resultField.textContent.charAt(resultField.textContent.length - 1);
    let thisKeyElementText = keyElement.firstElementChild.textContent;    

    if (lastChar === "." || decimalPointFinder()) {
        return;
    }
    else {
        resultField.textContent += thisKeyElementText;
    }
}

function decimalPointFinder() {
    let indexOfDot;
    let indexOfMathChar;

    for (let i = 0; i < resultField.textContent.length; i++) {        
        if (allOperators.includes(resultField.textContent[i])) {
            indexOfMathChar = i;
        }
        if (resultField.textContent[i] === ".") {
            indexOfDot = i;
        }
    }

    if (indexOfDot !== undefined && indexOfMathChar === undefined) {
        return true;
    }
    else if (indexOfDot > indexOfMathChar) {
        return true;
    }
    else {
        return false;
    }
}

function clearKeysClick(keyElement) {
    let resultFieldText = resultField.textContent;

    if (keyElement.id === "clear-key") {
        resultFieldText = "";
    }
    else {
        resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1);
    }

    return resultFieldText;
}



///////////////////////////
// SINGLE-KEY FUNCTIONS //
/////////////////////////

function printResult() {
    let resultFieldText = resultField.textContent;
    let lastChar = resultFieldText.charAt(resultFieldText.length - 1);
    let charBeforeLast = resultFieldText.charAt(resultFieldText.length - 2);  

    if (resultFieldText !== "") {
        if (!allOperators.includes(lastChar) && lastChar !== ".") {
            resultFieldText = eval(resultFieldText);
        }
        else if (allOperators.includes(lastChar) || (lastChar === "." && allDigits.includes(charBeforeLast))) {
            resultFieldText = eval(resultFieldText.slice(0, resultFieldText.length - 1));
        }
        else if (resultFieldText.length > 2 && lastChar === "." && allOperators.includes(charBeforeLast)) {
            resultFieldText = eval(resultFieldText.slice(0, resultFieldText.length - 2));
        }
        else {
            resultFieldText = "";
        }
    }

    return resultFieldText;
}



///////////////////////////
// CALCULATION FUNCTION //
/////////////////////////

// function calc(content) {
//     let result = "";
//     let nums = [];
//     let mathSigns = [];
//     let resultWindowContent = content;
//     let counter = 0;

//     for (let i  = 0; i < resultWindowContent.length; i++) {
//         if (resultWindowContent[i] === "+" || resultWindowContent[i] === "-" || resultWindowContent[i] === "*" || resultWindowContent[i] === "/") {
//             mathSigns[counter] = resultWindowContent[i];
//             counter++;
//         }
//         else {
//             nums[counter] += resultWindowContent[i];
//         }
//     }

//     for (let i = 0; i < nums.length; i++) {
//         nums[i] = Number(nums[i].slice(9, nums[i].length));
//     }

//     for (let i = 0; i < nums.length; i++) {
//         if (mathSigns[i] !== undefined) {
//             result += nums[i] + mathSigns[i];
//         }
//         else {
//             result += nums[i];
//         }
//     }

//     console.log(nums);
//     console.log(mathSigns);
//     console.log(result);
//     console.log(typeof(result));

//     return result;
// }

// })();