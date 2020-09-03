(() => {

    class Calculation {

        calculate(resultFieldText) {
            let 
                nums = this.numbersCollector(resultFieldText),
                inputOperators = this.operatorCollector(resultFieldText),
                result = resultFieldText,
                power = 0
            ;
        
            for (let num of nums) {
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
        
        numbersCollector(resultFieldText) {
            const ui = new UI();
            let collectorsCounter = 0;
            let nums = ["", ""];
        
            for (let i  = 0; i < resultFieldText.length; i++) {
                if (resultFieldText[i] === "-" && i === 0) {
                    nums[collectorsCounter] += resultFieldText[i];
                }
                else {
                    if (ui.allOperatorsRegEx.test(resultFieldText[i])) {
                        collectorsCounter++;
                    }
                    else {
                        nums[collectorsCounter] += resultFieldText[i];
                    }
                }
            }
        
            return nums;
        }
        
        operatorCollector(resultFieldText) {
            const ui = new UI();
            let collectorsCounter = 0;
            let inputOperators = [];
        
            for (let i  = 0; i < resultFieldText.length; i++) {
                if (resultFieldText[i] === "-" && i === 0) {
                    continue;
                }
                else {
                    if (ui.allOperatorsRegEx.test(resultFieldText[i])) {
                        inputOperators[collectorsCounter] = resultFieldText[i];
                        collectorsCounter++;
                    }
                }
            }
        
            return inputOperators;
        }
    
    }
    
    class UI {
        constructor() {
            this.calcKeys = document.getElementsByClassName("calc-key");
            this.resultField = document.getElementById("result");
            this.allOperatorsArray = ["/", "*", "+", "-"];
            this.allDigitsRegEx = /[0-9]/;   
            this.allOperatorsRegEx = /[/*+-]/;
            this.aloneNumberRegEx = /^[-]?[0-9.?]+$/;
            this.twoNumbersRegEx = /^[-]?[0-9.?]+[/*+-][0-9.?]+$/;        
        }
    
        addingEndResultToResultField(e) {
            this.resultField.textContent = this.calcKeysClickDistributer(e);
        }
    
        calcKeysClickDistributer(key) {
            let clickEndResult;
            switch (key.path[1].getAttribute("name")) {
                case "digit-keys":
                    clickEndResult = this.digitKeysClick(key.path[1]);
                    break;
                case "operator-keys":
                    clickEndResult = this.operatorKeysClick(key.path[1]);
                    break;
                case "decimal-point-key":
                    clickEndResult = this.decimalPointKeyClick(key.path[1]);
                    break;
                case "special-keys":
                    switch (key.path[1].id) {
                        case "clear-key":
                            clickEndResult = this.clearKeysClick(key.path[1]);
                            break;
                        case "clear-one-key":
                            clickEndResult = this.clearKeysClick(key.path[1]);
                            break;
                        case "equal-key":
                            clickEndResult = this.generateResult();
                            break;                    
                    }     
                    break;
            }
            return clickEndResult;
        }
    
        digitKeysClick(keyElement) {
            let 
                resultFieldText = this.resultField.textContent,
                lastCharacter = resultFieldText.charAt(resultFieldText.length - 1),
                characterBeforeLast = resultFieldText.charAt(resultFieldText.length - 2),
                thisKeyElementText = keyElement.firstElementChild.textContent
            ;
        
            if (resultFieldText.toString() !== 'NaN' 
                && resultFieldText.toString() !== 'Infinity'
                && resultFieldText.toString() !== '-Infinity') {
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
            }
    
            return resultFieldText;
        }
    
        operatorKeysClick(keyElement) {
            let 
                resultFieldText = this.resultField.textContent,
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
                    if (this.allOperatorsRegEx.test(resultFieldText[i])) {
                        thereIsAnOperator = true;
                        break;
                    }
                } 
            }
        
            if (resultFieldText.toString() !== 'NaN' 
                && resultFieldText.toString() !== 'Infinity'
                && resultFieldText.toString() !== '-Infinity') {
                    if (!thereIsAnOperator) {
                        if (
                            (lastCharacter === "." 
                            && !this.allOperatorsRegEx.test(characterBeforeLast)) || this.allOperatorsRegEx.test(lastCharacter)
                        ) {
                            resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1) + thisKeyElementText;
                        }
                        else {
                            resultFieldText += thisKeyElementText;
                        }
                    }
                    else {
                        resultFieldText = this.generateResult();
                        if (!this.allOperatorsRegEx.test(lastCharacter)
                            && resultFieldText.toString() !== 'NaN' 
                            && resultFieldText.toString() !== 'Infinity'
                            && resultFieldText.toString() !== '-Infinity') {
                            resultFieldText += thisKeyElementText;
                        }
                    }
            }
        
            return resultFieldText;
        }
    
        decimalPointKeyClick(keyElement) {
            let 
                resultFieldText = this.resultField.textContent,
                thisKeyElementText = keyElement.firstElementChild.textContent
            ;    
        
            if (resultFieldText.toString() !== 'NaN' 
            && resultFieldText.toString() !== 'Infinity'
            && resultFieldText.toString() !== '-Infinity') {
                if (this.lastNumberHasDecimalPoint()) {
                    resultFieldText = resultFieldText;
                }
                else {
                    resultFieldText += thisKeyElementText;
                }
            }
        
            return resultFieldText;    
        }
    
        lastNumberHasDecimalPoint() {
            let indexOfDot, indexOfMathChar;
        
            for (let i = 0; i < this.resultField.textContent.length; i++) {        
                if (this.allOperatorsRegEx.test(this.resultField.textContent[i])) {
                    indexOfMathChar = i;
                }
                if (this.resultField.textContent[i] === ".") {
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
    
        clearKeysClick(keyElement) {
            let 
                resultFieldText = this.resultField.textContent,
                lastCharacter = resultFieldText.charAt(resultFieldText.length - 1)
            ;
        
            if (resultFieldText === 'NaN' 
                || resultFieldText === 'Infinity'
                || resultFieldText === '-Infinity') {
                resultFieldText = 0;
            }
            else {
                if (keyElement.id === "clear-key") {
                    resultFieldText = 0;
                }
                else {
                    if (!this.allOperatorsRegEx.test(lastCharacter)) {
                        if (this.aloneNumberRegEx.test(resultFieldText)) {
                            resultFieldText = 0;
                        }
                        else {
                            let 
                                instanceOfResultFieldText, 
                                additionalPosition,
                                positionOneIsMinus = resultFieldText.charAt(0) === '-'
                            ;
            
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
                                for(let i in this.allOperatorsArray) {
                                    if (instanceOfResultFieldText.indexOf(this.allOperatorsArray[i]) > 0) {
                                        positionOfOperator = instanceOfResultFieldText.indexOf(this.allOperatorsArray[i]) + additionalPosition;
                                    }
                                }
                                return positionOfOperator;
                            })());
                        }
                    }
                    else {
                        resultFieldText = resultFieldText.slice(0, resultFieldText.length - 1);
                    }
                }
            }
        
            return resultFieldText;
        }
    
        generateResult() {
            const calc = new Calculation();
            let 
                resultFieldText = this.resultField.textContent,
                lastCharacter = resultFieldText.charAt(resultFieldText.length - 1),
                indexOfLastOperator = 0,
                indexOfLastNumber = 0
            ;
        
            for (let i = 0; i < resultFieldText.length; i++) {
                if (this.allOperatorsRegEx.test(resultFieldText[i])) {
                    indexOfLastOperator = i;
                }
                if (this.allDigitsRegEx.test(resultFieldText[i])) {
                    indexOfLastNumber = i;
                }
            }
        
            if (indexOfLastNumber > indexOfLastOperator && indexOfLastOperator !== 0) {
                if (lastCharacter !== "." || !this.allOperatorsRegEx.test(lastCharacter)){
                    resultFieldText = calc.calculate(resultFieldText);
                }
            }
        
            return resultFieldText;
        }
    
    }
    
    const ui = new UI();
    
    for (calcKey of ui.calcKeys) {
        calcKey.addEventListener("click", ui.addingEndResultToResultField.bind(ui));
    }

})();