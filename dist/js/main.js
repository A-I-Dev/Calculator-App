const 
    calcKeys = document.getElementsByClassName("calc-key"), 
    resultField = document.getElementById("result"), 
    allOperatorsArray = ["/", "*", "+", "-"],
    allDigitsRegEx = /[0-9]/,    
    allOperatorsRegEx = /[/*+-]/,
    aloneNumberRegEx = /^[-]?[0-9.?]+$/,
    twoNumbersRegEx = /^[-]?[0-9.?]+[/*+-][0-9.?]+$/
;

for (calcKey of calcKeys) {
    calcKey.addEventListener("click", calcKeysClickDistributer);
}

function calcKeysClickDistributer() {
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
            || (lastCharacter === "0" && allOperatorsRegEx.test(characterBeforeLast))
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
            && allOperatorsRegEx.test(characterBeforeLast)
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
            if (allOperatorsRegEx.test(resultFieldText[i])) {
                thereIsAnOperator = true;
                break;
            }
        } 
    }

    if (!thereIsAnOperator) {
        if (
            lastCharacter === "." 
            && !allOperatorsRegEx.test(characterBeforeLast)
        ) {
            resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1) + thisKeyElementText;
        }
        else {
            resultFieldText += thisKeyElementText;
        }
    }
    else {
        resultFieldText = printResult();
        if (!allOperatorsRegEx.test(lastCharacter)) {
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
        if (allOperatorsRegEx.test(resultField.textContent[i])) {
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
    let 
        resultFieldText = resultField.textContent,
        lastCharacter = resultFieldText.charAt(resultFieldText.length - 1)
    ;

    if (keyElement.id === "clear-key") {
        resultFieldText = 0;
    }
    else {
        if (!allOperatorsRegEx.test(lastCharacter)) {
            if (aloneNumberRegEx.test(resultFieldText)) {
                resultFieldText = 0;
            }
            else {
                let instanceOfResultFieldText, additionalPosition;
                let positionOneIsMinus = resultFieldText.charAt(0) === '-';

                if (positionOneIsMinus) {
                    instanceOfResultFieldText = resultFieldText.slice(1, resultFieldText.length);   
                    additionalPosition = 2;
                }
                else {
                    instanceOfResultFieldText = resultFieldText;
                    additionalPosition = 1;
                }

                resultFieldText = resultFieldText.slice(0, (()=>{ 
                    let positionOfOperator;
                    for(let i in allOperatorsArray) {
                        if (instanceOfResultFieldText.indexOf(allOperatorsArray[i]) > 0) {
                            positionOfOperator = instanceOfResultFieldText.indexOf(allOperatorsArray[i]) + additionalPosition;
                        }
                    }
                    return positionOfOperator;
                })());
            }
        }
        else {
            resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1);
        }

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
        indexOfLastOperator = 0,
        indexOfLastNumber = 0
    ;

    for (let i = 0; i < resultFieldText.length; i++) {
        if (allOperatorsRegEx.test(resultFieldText[i])) {
            indexOfLastOperator = i;
        }
        if (allDigitsRegEx.test(resultFieldText[i])) {
            indexOfLastNumber = i;
        }
    }

    if (indexOfLastNumber > indexOfLastOperator && indexOfLastOperator !== 0) {
        if (lastCharacter !== "." || !allOperatorsRegEx.test(lastCharacter)){
            resultFieldText = calculate(resultFieldText);
        }
    }

    return resultFieldText;
}



//////////////////
// CALCULATION //
////////////////

function calculate(resultFieldText) {
    let 
        nums = numbersCollector(resultFieldText),
        inputOperators = operatorCollector(resultFieldText),
        result = resultFieldText,
        power = 0
    ;

    for (num of nums) {
        if (num.indexOf(".") !== -1) {
            if (power < (num.length - 1) - num.indexOf(".")) {
                power = (num.length - 1) - num.indexOf(".");
            }
        }
    }

    nums[0] = Math.floor(parseFloat(nums[0]) * (Math.pow(10, power)));
    nums[1] = Math.floor(parseFloat(nums[1]) * (Math.pow(10, power)));

    switch (inputOperators[0]) {
        case "/":
            result = nums[0] / nums[1];
            break;
        case "*":
            result = (nums[0] * nums[1]) / Math.pow(10, power * 2);
            break;
        case "+":
            result = (nums[0] + nums[1]) / Math.pow(10, power);
            break;
        case "-":
            result = (nums[0] - nums[1]) / Math.pow(10, power);
            break;
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
            if (allOperatorsRegEx.test(resultFieldText[i])) {
                collectorsCounter++;
            }
            else {
                nums[collectorsCounter] += resultFieldText[i];
            }
        }
    }

    return nums;
}

function operatorCollector(resultFieldText) {
    let collectorsCounter = 0;
    let inputOperators = [];

    for (let i  = 0; i < resultFieldText.length; i++) {
        if (resultFieldText[i] === "-" && i === 0) {
            continue;
        }
        else {
            if (allOperatorsRegEx.test(resultFieldText[i])) {
                inputOperators[collectorsCounter] = resultFieldText[i];
                collectorsCounter++;
            }
        }
    }

    return inputOperators;
}