const calcKeys = document.getElementsByClassName("calc-key"); // list of all keys of the calculator
const resWin = document.getElementById("result"); // the field in which everything happens

// Adding the event listener to every button click
for (let i = 0; i < calcKeys.length; i++) {
    calcKeys[i].addEventListener("click", buttonClick);
}

// Adding the event listener for the Numpad
// document.addEventListener('keydown', logKey);

// function logKey(e) {
//     console.log(` ${e.code}`)
// }



// Global button click function and logic
function buttonClick() {
    switch (this.getAttribute("name")) {
        case "num-char":
            numCharFunc(this);
            break;
        case "math-char":
            mathCharFunc(this);
            break;
        case "dot-char":
            dotCharFunc(this);
            break;
        case "op-char":
            switch (this.id) {
                case "clear-key":
                    clearAll();
                    break;
                case "clear-one-key":
                    clearOneChar();
                    break;
                case "equal-key":
                    printResult();
                    break;                    
            }     
            break;
    }
}



/////////////////////////
// MULTI-KEY FUNCTIONS //
///////////////////////

// Numbers function
function numCharFunc(charPar) {
    let lastChar = resWin.innerHTML.charAt(resWin.innerHTML.length - 1);
    let charBeforeLast = resWin.innerHTML.charAt(resWin.innerHTML.length - 2);

    if (charPar.id === "zero-key") {
        if (lastChar === "0" && resWin.innerHTML.length === 1) {
            return;
        }
        else if (lastChar === "0" && resWin.innerHTML.length === 2 && resWin.innerHTML.charAt(0) === "-") {
            return;
        }
        else if (lastChar === "0" && (charBeforeLast === "+" || charBeforeLast === "-" || charBeforeLast === "*" || charBeforeLast === "/")) {
            return;
        }
        else {
            resWin.innerHTML += charPar.firstElementChild.innerHTML;
        }
    }
    else {
        if (lastChar === "0" && resWin.innerHTML.length === 1) {
            resWin.innerHTML = charPar.firstElementChild.innerHTML;
        }
        else if (lastChar === "0" && (charBeforeLast === "+" || charBeforeLast === "-" || charBeforeLast === "*" || charBeforeLast === "/")) {
            resWin.innerHTML = resWin.innerHTML.slice(0, resWin.innerHTML.length - 1) + charPar.firstElementChild.innerHTML;
        }
        else {
            resWin.innerHTML += charPar.firstElementChild.innerHTML;
        }
    }
}

// Math characters function
function mathCharFunc(charPar) {
    let lastChar = resWin.innerHTML.charAt(resWin.innerHTML.length - 1);
    let condLastChar = (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/");

    let charBeforeLast = resWin.innerHTML.charAt(resWin.innerHTML.length - 2);
    let condCharBeforeLast = (charBeforeLast === "+" || charBeforeLast === "-" || charBeforeLast === "*" || charBeforeLast === "/");

    let thisButtonText = charPar.firstElementChild.innerHTML;
    let condButtonText = (thisButtonText === "+" || thisButtonText === "*" || thisButtonText === "/");

    if (resWin.innerHTML === "" && condButtonText) {
        return;
    }
    else if (condLastChar) {
        return;
    }
    else if (lastChar === "." && !condCharBeforeLast) {
        resWin.innerHTML = resWin.innerHTML.slice(0, resWin.innerHTML.length - 1) + charPar.firstElementChild.innerHTML;
    }
    else if (lastChar === "." && condCharBeforeLast) {
        resWin.innerHTML = resWin.innerHTML.slice(0, resWin.innerHTML.length - 2) + charPar.firstElementChild.innerHTML;
    }    
    else {
        resWin.innerHTML += charPar.firstElementChild.innerHTML;
    };
}

// Floating point function
function dotCharFunc(charPar) {
    let lastChar = resWin.innerHTML.charAt(resWin.innerHTML.length - 1);
    let isThereADot;

    if (resWin.innerHTML !== "" && lastChar !== ".") {
        isThereADot = dotFinder();
    }

    if (lastChar === "." || isThereADot) {
        return;
    }
    else {
        resWin.innerHTML += charPar.firstElementChild.innerHTML;
    }
}

// Find a dot
function dotFinder() {
    let indexOfDot;
    let indexOfMathChar;

    for (let i = 0; i < resWin.innerHTML.length; i++) {        
        if (resWin.innerHTML[i] === "+" || resWin.innerHTML[i] === "-" || resWin.innerHTML[i] === "*" || resWin.innerHTML[i] === "/") {
            indexOfMathChar = i;
        }

        if (resWin.innerHTML[i] === ".") {
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



///////////////////////////
// SINGLE-KEY FUNCTIONS //
/////////////////////////

// The logic for printing the result, activated by the EqualSing key
function printResult() {
    let resultWindowContent = resWin.innerHTML;
    let lastChar = resultWindowContent.charAt(resWin.innerHTML.length - 1);
    let condLastChar = (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/");    

    if (resultWindowContent !== "" && !condLastChar) {
        resWin.innerHTML = eval(resultWindowContent);
    }
    else if (resultWindowContent !== "" && condLastChar) {
        resWin.innerHTML = eval(resWin.innerHTML.slice(0, resWin.innerHTML.length - 1));
    }
    else {
        return;
    }
}

// Clear everything function
function clearAll() {
    resWin.innerHTML = "";
}

// Clear only last character function
function clearOneChar() {
    resWin.innerHTML = resWin.innerHTML.slice(0, resWin.innerHTML.length - 1);
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