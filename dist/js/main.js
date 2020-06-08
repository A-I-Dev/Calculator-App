(function(){

const calcKeys = document.getElementsByClassName("calc-key"); 
const resultField = document.getElementById("result"); 
const allDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const allOperators = ["/", "*", "+", "-"];

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
                    if (resultField.textContent !== "") {
                        resultField.textContent = printResult();
                    }
                    break;                    
            }     
            break;
    }
}

function digitKeysClick(keyElement) {
    let 
        resultFieldText = resultField.textContent,
        lastCharacter = resultFieldText.charAt(resultFieldText.length - 1),
        characterBeforeLast = resultFieldText.charAt(resultFieldText.length - 2),
        thisKeyElementText = keyElement.firstElementChild.textContent
    ;

    if (keyElement.id === "zero-key") {
        if (
            (resultFieldText === "0") 
            || (lastCharacter === "0" && allOperators.includes(characterBeforeLast))
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
        else if (
            lastCharacter === "0" 
            && allOperators.includes(characterBeforeLast)
        ) {
            resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1) + thisKeyElementText;
        }
        else {
            resultFieldText += thisKeyElementText;
        }
    }

    return resultFieldText;
}

function operatorKeysClick(keyElement) {
    let 
        resultFieldText = resultField.textContent,
        lastCharacter = resultFieldText.charAt(resultFieldText.length - 1),
        characterBeforeLast = resultFieldText.charAt(resultFieldText.length - 2),
        thisKeyElementText = keyElement.firstElementChild.textContent,
        firstCharacterIsMinus = (resultFieldText.charAt(0) === "-"),
        thereIsAnOperator = false
    ;

    for (let i = 0; i < resultFieldText.length; i++) {
        if (firstCharacterIsMinus) {
            firstCharacterIsMinus = false;
            continue;
        }
        else {
            if (allOperators.includes(resultFieldText[i])) {
                thereIsAnOperator = true;
                break;
            }
            else {
                continue;
            }
        } 
    }

    if (thereIsAnOperator) {
        resultFieldText = resultFieldText;
    }
    else {
        if (
            allOperators.includes(lastCharacter) 
            || (lastCharacter === "." && allOperators.includes(characterBeforeLast)) 
            || (resultFieldText === "" && thisKeyElementText !== "-")
        ) {
            resultFieldText = resultFieldText;
        }
        else if (
            lastCharacter === "." 
            && !allOperators.includes(characterBeforeLast)
        ) {
            resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1) + thisKeyElementText;
        }
        else {
            resultFieldText += thisKeyElementText;
        }
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
        resultFieldText = 0;
    }
    else {
        resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1);
        if (resultFieldText === "") {
            resultFieldText = 0;
        }
    }

    return resultFieldText;
}

function printResult() {
    let 
        resultFieldText = resultField.textContent,
        lastCharacter = resultFieldText.charAt(resultFieldText.length - 1),
        characterBeforeLast = resultFieldText.charAt(resultFieldText.length - 2)
    ;

    if (
        !allOperators.includes(lastCharacter) 
        && lastCharacter !== "."
    ) {
        resultFieldText = calculate(resultFieldText);
    }
    else if (
        allOperators.includes(lastCharacter) 
        || (lastCharacter === "." && allDigits.includes(characterBeforeLast))
    ) {
        resultFieldText = calculate(resultFieldText.slice(0, resultFieldText.length - 1));
    }
    else if (
        lastCharacter === "." 
        && allOperators.includes(characterBeforeLast)
    ) {
        resultFieldText = calculate(resultFieldText.slice(0, resultFieldText.length - 2));
    }
    else {
        resultFieldText = resultFieldText;
    }

    return resultFieldText;
}



//////////////////
// CALCULATION //
////////////////

function calculate(resultFieldText) {
    let 
        nums = numbersCollector(resultFieldText),
        inputOperators = operatorsCollector(resultFieldText),
        result = resultFieldText,
        power = 0,
        thereIsOneOrMoreFloatingPointNumbers = false
    ;

    if (nums[0] !== undefined && nums[1] !== undefined) {
        for (num of nums) {
            if (num.indexOf(".") !== -1) {
                if (power < (num.length - 1) - num.indexOf(".")) {
                    power = (num.length - 1) - num.indexOf(".");
                }
            }
        }

        if (nums[0].indexOf(".") !== -1 || nums[1].indexOf(".") !== -1) {
            thereIsOneOrMoreFloatingPointNumbers = true;
            nums[0] = Math.floor(parseFloat(nums[0]) * (Math.pow(10, power)));
            nums[1] = Math.floor(parseFloat(nums[1]) * (Math.pow(10, power)));
        }
        else {
            nums[0] = parseInt(nums[0]);
            nums[1] = parseInt(nums[1]);
        }

        switch (inputOperators[0]) {
            case "/":
                result = nums[0] / nums[1];
                break;
            case "*":
                result = nums[0] * nums[1];
                if (thereIsOneOrMoreFloatingPointNumbers) {
                    result /= Math.pow(10, power * 2);
                }
                break;
            case "+":
                result = nums[0] + nums[1];
                if (thereIsOneOrMoreFloatingPointNumbers) {
                    result /= Math.pow(10, power);
                }
                break;
            case "-":
                result = nums[0] - nums[1];
                if (thereIsOneOrMoreFloatingPointNumbers) {
                    result /= Math.pow(10, power);
                }
                break;
        }
    }

    return result;
}

function numbersCollector(resultFieldText) {
    let collectorsCounter = 0;
    let nums = ["", ""];

    for (let i  = 0; i < resultFieldText.length; i++) {
        if (resultFieldText[i] === "-" && i === 0) {
            nums[collectorsCounter] += resultFieldText[i];
        }
        else {
            if (allOperators.includes(resultFieldText[i])) {
                collectorsCounter++;
            }
            else {
                nums[collectorsCounter] += resultFieldText[i];
            }
        }
    }

    return nums;
}

function operatorsCollector(resultFieldText) {
    let collectorsCounter = 0;
    let inputOperators = [];

    for (let i  = 0; i < resultFieldText.length; i++) {
        if (resultFieldText[i] === "-" && i === 0) {
            continue;
        }
        else {
            if (allOperators.includes(resultFieldText[i])) {
                inputOperators[collectorsCounter] = resultFieldText[i];
                collectorsCounter++;
            }
        }
    }

    return inputOperators;
}

})();