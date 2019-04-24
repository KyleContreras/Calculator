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
    },

    makeExpHistory: function (objName, propName, value) {
        Object.defineProperty(objName, propName, {
            value: value,
            configurable: true,
            enumerable: true,
            writable : true,
        });
    },
    
    // TODO: little difference between this and nAR. How do I get rid of one?
    findDpstNstdArray: function (anArray) {
        if (Array.isArray(anArray[anArray.length - 1])) {
            let newNstdArray = anArray[anArray.length - 1];
    
            return this.findDpstNstdArray(newNstdArray);
        }

        return anArray;
    },

    // Called while parenthesesCount === closedParenthesesCount
    nestedArrayCheck: function (anArray, input) {
        let clsdPrnthCnt = this.closedPrnthCnt;

        if (this.parenthesesCount > clsdPrnthCnt) {
            let newNstdArray = this.nstdArrayRef(anArray, clsdPrnthCnt)
            newNstdArray.push(input);
        } else {
            let crntArray = this.findDpstNstdArray(anArray);
            crntArray.push(input);
        }
    },

    // TODO: little difference between this and fLA. How do I get rid of one?
    nstdArrayRef: function (anArray, clsdPrnth) {
        let crntArray = anArray[anArray.length - 1];

        if (clsdPrnth > 1 && Array.isArray(crntArray)) {
            let newClsdPrnthCnt = --clsdPrnth;

            return this.nstdArrayRef(crntArray, newClsdPrnthCnt);
        }

        return anArray;
    },

    addHstryAndOop: function(input) {
        let expCnt = this.expressionCount;
        let crntHstryExp = this.history['expression ' + (this.historyCount)];
        let expProp = crntHstryExp[expCnt];
        let crntInput = input === '(' ? [] : input;

        if(Array.isArray(crntInput)) {
            this.parenthesesCount++;
            this.closedPrnthCnt++;
        }

        if (crntInput === ')') {
            this.closedPrnthCnt--;

            if(this.closedPrnthCnt === 0) {
                this.parenthesesCount = 0;
                this.expressionCount++;
            }
        } else if (this.parenthesesCount === 0) {
            this.makeExpHistory(crntHstryExp, expCnt, crntInput)
            this.expressionCount++;
        } else if (Array.isArray(expProp)) {
            this.nestedArrayCheck(expProp, crntInput);
        } else {
            // TODO: How can I get rid of this?
            // Only works when first set of () is added. prnthCnt is incremented before the check
            this.makeExpHistory(crntHstryExp, expCnt, crntInput)
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
    
    // TODO
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