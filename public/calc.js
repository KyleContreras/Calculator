"use strict";

var calcObj = {
    // Should I move these into history{}?
    historyCount: 0,
    expressionCount: 0,
    
    parenthesesCount: 0,
    closedPrnthCnt: 0,
    
    makeNextNumNeg: 0,

    currentExpression: [],   
    currentOop: [[],[],[]],

    history: {},

    calcDisplay: (input) => {
        let elmnt = document.getElementById('display');
        elmnt.value += input + ' ';

        //elem = document.getElementById('display');
        //elem.value = '';
    },

    checkIfNeg: function(input) {
        if (this.makeNextNumNeg === 0) {
            this.checkHistory(input);
        } else {
            this.nextNumNeg = 0;
            this.checkHistory((Math.abs(input) * -1));
        }
    },

    makeNeg: function () {
        this.makeNextNumNeg = -1;
    },

    checkHistory: function(input) {
        if(this.historyCount === 0) {
            this.historyCount++;
            this.makeExpHistory(this.history, 'expression ' + this.historyCount, {})
        }

        this.addHstryAndOop(input);

        /*
        if(isNaN(input) && input !== ')') {
            this.addToCurrentOop(input)
        }
        */
    },

    makeExpHistory: function (objName, propName, value) {
        Object.defineProperty(objName, propName, {
            value: value,
            configurable: true,
            enumerable: true,
            writable : true,
        });
    },

    // TODO
    nestedArrayCheck: function (crntExpProp, nstdArray, input) {
        let expProp = crntExpProp;
        let isThisNstdArray = nstdArray;
        let crntInput = input === '(' ? [] : input;
        let clsdPrnthCnt = this.closedPrnthCnt;
        let newNstdArray;

        if (Array.isArray(isThisNstdArray[isThisNstdArray.length - 1])) {
            newNstdArray = isThisNstdArray[isThisNstdArray.length - 1];
    
            this.nestedArrayCheck(expProp, newNstdArray, crntInput);
        } else if (Array.isArray(isThisNstdArray) && clsdPrnthCnt > 1) {
            if (newNstdArray = this.nstdArrayRef(expProp, clsdPrnthCnt)) {
                newNstdArray.push(crntInput);
            } else {
                isThisNstdArray.push(crntInput);
            }
            //newNstdArray.push(crntInput);
            //isThisNstdArray.push(crntInput);
        } else {
            expProp.push(crntInput);
        }
    },

    nstdArrayRef: function (expProp, parenthesesCount) {
        let cpyExpProp = expProp;
        let nstdArrayIndex;
        let clsdPrnth = parenthesesCount;

        if (this.parenthesesCount > clsdPrnth && clsdPrnth > 1) {
            nstdArrayIndex = cpyExpProp[cpyExpProp.length - 1];
            clsdPrnth--

            this.nstdArrayRef(nstdArrayIndex, clsdPrnth);
        }

        return nstdArrayIndex;
    },

    // Goal of fx: place input in correct spot of history object
    // Watch out for referencing an undefined property and testing with .isArray()
    addHstryAndOop: function(input) {
        let expCnt = this.expressionCount;
        let crntHstryExp = this.history['expression ' + (this.historyCount)];
        let expProp = crntHstryExp[expCnt];

        // How do I simplify this and '|| Array.isArray(expProp)'
        if (input === '(') {
            this.parenthesesCount++;
            this.closedPrnthCnt++;

            if(Array.isArray(expProp)) {
                let isThisNstdArray;

                // I don't think this is quite right. Can never reference the 0 index
                // Should this if check against 0 instead of 1?
                // Shouldn't parenthesesCount be > 1 as well?
                if (expProp.length - 1 > 1) {
                    isThisNstdArray = expProp[(expProp.length - 1)];
                } else {
                    isThisNstdArray = expProp;
                }
                
                this.nestedArrayCheck(expProp, isThisNstdArray, input);
            } else {
                this.makeExpHistory(crntHstryExp, expCnt, [])
            }
        } else if (input === ')') {
            this.closedPrnthCnt--;

            if(this.closedPrnthCnt === 0) {
                this.expressionCount++;
            }
        } else if (Array.isArray(expProp)) {
            let isThisNstdArray;

            if (expProp.length - 1 > 1) {
                isThisNstdArray = expProp[(expProp.length - 1)];
            } else {
                isThisNstdArray = expProp;
            }
            
            this.nestedArrayCheck(expProp, isThisNstdArray, input);
        } else {
            this.makeExpHistory(crntHstryExp, expCnt, input);
            this.expressionCount++;
        }
        
        this.calcDisplay(input);
        // Test
        console.log(this.history);
    },

    cnvrtHstryToArrayExp: function(exp) {
        this.currentExpression = Object.values(exp);
    },
    
    // TODO
    addToCurrentOop: function(input) {
        let crntOop = this.currentOop;
        /*
        let expCnt = this.expressionCount;
        let crntHstryExp = this.history['expression ' + (this.historyCount)];
        let expProp;

        // Ugly solution
        if (expCnt === 0) {
            expProp = crntHstryExp[expCnt];
        } else {
            expProp = crntHstryExp[expCnt - 1];
        }
        */

        // dupOpCheck = crntExp.length -- Is it necessary now?
        if (Array.isArray(input)) {
            crntOop[0].push([]);
        } else if ((input === '*' || input === '/') /*&& (input !== dupOpCheck)*/) {
            crntOop[1].push(input);
        } else if ((input === '+' || input === '-') /*&& (input !== dupOpCheck)*/) {
            crntOop[2].push(input);
        }

        //Test
        console.log(this.currentOop);
    },
    
    concatOopArrays: function () {
        let crntOop = this.currentOop;
        let OopReplacement = [];

        for (let i = 0; i < crntOop.length; i++) {
            crntOop[i].forEach((element) => {
                OopReplacement.push(element);
            })
        }
        this.currentOop = OopReplacement;
        console.log(this.currentOop);
    },

    // Splice second argument not dynamic to the situation.
    OopCleanUp: function() {
        let operatorArray = this.currentOop;
        operatorArray.splice(0,2);
    },

    // TODO
    operatorCompare: function() {
        let crntOop = this.currentOop;
        let crntExp = this.currentExpression;

        for (let i = 0; i < crntOop.length; i++) {
            for (let j = 0; j < crntExp.length; j++) {   
                if(crntOop[i] === crntExp[j]) {
                    var oprtr = crntOop[i];
                    var numA = crntExp[j-1];
                    var numB = crntExp[j+1];
                    var spliceStart = (j - 1);
                    let crntSolverAns = this.solveExpression(oprtr, numA, numB);

                    // The middle argument might end up being a problem because it is not dynamic.
                    this.operatorReplacer(spliceStart, 3, crntSolverAns)

                    break;
                }
            }
        }
        // Should I add the '=' here?
        // crntExp
        this.calcDisplay(crntExp);
    },

    solveExpression: function(operator, numA, numB) {
        switch(operator) {
            case '*':
                return numA * numB;
            case '/':
                return numA / numB;
            case '+':
                return numA + numB;
            case '-':
                return numA - numB;
        }
    },
    
    // can this be streamlined?
    operatorReplacer: function(expStart, delCnt, solverAns) {
        var crntExp = this.currentExpression;

        crntExp.splice(expStart, delCnt, solverAns)
    },

    // I put makeHistory() here for now?
    resetCounters: function () {
        this.expressionCount = 0;
        this.currentExpression = [];
        this.currentOop = [[],[],[]];

        //this.makeHistory();
    },

    // TODO
    showHistory: function() {},
    
    // Should this only call cnvrtHstryToArrayExp()?
    findAnswer: function() {
        let crntExp = this.history['expression ' + this.historyCount];
        
        this.cnvrtHstryToArrayExp(crntExp);

        this.addToCurrentOop();
        this.concatOopArrays();
        this.operatorCompare();
        this.resetCounters();
    },
    
    // TODO: Make sure everything is reset accordingly.
    clear: function() {
        elem = document.getElementById('display');
        elem.value = '';
        
        this.resetCounters();
    } 
};