(function(){

const calcKeys = document.getElementsByClassName("calc-key"); 
const resultField = document.getElementById("result"); 
const allDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const allOperators = ["+", "*", "/", "-"];

for (calcKey of calcKeys) {
    calcKey.addEventListener("click", calcKeysClick);
}

function calcKeysClick() {
    switch (this.getAttribute("name")) {
        case "digit-keys":
            resultField.textContent = digitKeysClick(this);
            break;
        case "operator-keys":
            resultField.textContent = operatorKeysClick(this);
            break;
        case "decimal-point-key":
            resultField.textContent = decimalPointKeyClick(this);
            break;
        case "special-keys":
            switch (this.id) {
                case "clear-key":
                    resultField.textContent = clearKeysClick(this);
                    break;
                case "clear-one-key":
                    resultField.textContent = clearKeysClick(this);
                    break;
                case "equal-key":
                    let resultFieldText = resultField.textContent;
                    if (resultFieldText !== "") {
                        resultField.textContent = printResult();
                    }
                    break;                    
            }     
            break;
    }
}

function digitKeysClick(keyElement) {
    let resultFieldText = resultField.textContent;

    let lastCharacter = resultFieldText.charAt(resultFieldText.length - 1);
    let characterBeforeLast = resultFieldText.charAt(resultFieldText.length - 2);    
    let thisKeyElementText = keyElement.firstElementChild.textContent;

    if (keyElement.id === "zero-key") {
        if (
            (resultFieldText === "0") 
            ||  
            (lastCharacter === "0" && allOperators.includes(characterBeforeLast))
        ) {
            resultFieldText = resultFieldText;
        }
        else {
            resultFieldText += thisKeyElementText;
        }
    }
    else {
        if (resultFieldText === "0") {
            resultFieldText = thisKeyElementText;
        }
        else if (lastCharacter === "0" && allOperators.includes(characterBeforeLast)) {
            resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1) + thisKeyElementText;
        }
        else {
            resultFieldText += thisKeyElementText;
        }
    }

    return resultFieldText;
}

function operatorKeysClick(keyElement) {
    let resultFieldText = resultField.textContent;
    let lastCharacter = resultFieldText.charAt(resultFieldText.length - 1);
    let characterBeforeLast = resultFieldText.charAt(resultFieldText.length - 2);
    let thisKeyElementText = keyElement.firstElementChild.textContent;

    if (
        allOperators.includes(lastCharacter) 
        || 
        (lastCharacter === "." && allOperators.includes(characterBeforeLast)) 
        ||
        (resultFieldText === "" && thisKeyElementText !== "-")
    ) {
        resultFieldText = resultFieldText;
    }
    else if (
        lastCharacter === "." 
        && 
        !allOperators.includes(characterBeforeLast)
    ) {
        resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1) + thisKeyElementText;
    }
    else {
        resultFieldText += thisKeyElementText;
    }

    return resultFieldText;
}

function decimalPointKeyClick(keyElement) {
    let resultFieldText = resultField.textContent;
    let thisKeyElementText = keyElement.firstElementChild.textContent;    

    if (lastNumberHasDecimalPoint()) {
        resultFieldText = resultFieldText;
    }
    else {
        resultFieldText += thisKeyElementText;
    }

    return resultFieldText;    
}

function lastNumberHasDecimalPoint() {
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

function printResult() {
    let resultFieldText = resultField.textContent;
    let lastCharacter = resultFieldText.charAt(resultFieldText.length - 1);
    let characterBeforeLast = resultFieldText.charAt(resultFieldText.length - 2);  

    if (
        !allOperators.includes(lastCharacter) 
        && 
        lastCharacter !== "."
    ) {
        resultFieldText = eval(resultFieldText);
    }
    else if (
        allOperators.includes(lastCharacter) 
        || 
        (lastCharacter === "." && allDigits.includes(characterBeforeLast))
    ) {
        resultFieldText = eval(resultFieldText.slice(0, resultFieldText.length - 1));
    }
    else if (
        resultFieldText.length > 2 
        && 
        lastCharacter === "." 
        && 
        allOperators.includes(characterBeforeLast)
    ) {
        resultFieldText = eval(resultFieldText.slice(0, resultFieldText.length - 2));
    }
    else {
        resultFieldText = "";
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

})();