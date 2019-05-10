"use strict";

var calcObj = {
    // TODO: Should I create a getter/setter for these counters?
    // TODO: How should I handle clearing/resetting these?
    historyCount: 0,
    expressionCount: 0,
    parenthesesCount: 0,
    closedPrnthCnt: 0,
    
    makeNextNumNeg: 0,

    currentExpression: [],   
    //currentOop: [[],[],[]],

    currentOop: [{},[],[]],

    history: {},

    Oop: {},

    calcDisplay: function(input) {
        let elmnt = document.getElementById('display');
        //let crntInput = input === '(' ? [] : input;


        if (Array.isArray(input)) {
            elmnt.value += '(' + ' ';
        } else if (input === '') {
            elmnt.value = '';
            this.resetCounters();
        } else {
            elmnt.value += input + ' ';
        }
    },

    checkIfNeg: function(input) {
        if (this.makeNextNumNeg === 0) {
            this.checkHistory(input);
        } else {
            this.nextNumNeg = 0;
            this.checkHistory((Math.abs(input) * -1));
        }
    },

    // TODO: How can I better handle this?
    makeNeg: function () {
        this.makeNextNumNeg = -1;
    },

    // Add to calcDisplay here for now
    checkHistory: function(input) {
        let crntInput = input === '(' ? [] : input;

        if(this.historyCount === 0) {
            this.historyCount++;
            this.makeExpHistory(this.history, 'expression ' + this.historyCount, {})
        }

        this.addToHstry(crntInput);

        //this.calcDisplay(crntInput);
    },

    makeExpHistory: function (objName, propName, value) {
        Object.defineProperty(objName, propName, {
            value: value,
            configurable: true,
            enumerable: true,
            writable : true,
        });
    },

    nstdArrayRef: function (anArray, clsdPrnth) {
        let checkForArray = anArray[anArray.length - 1];

        if (Array.isArray(checkForArray) && clsdPrnth > 1) {
            let newClsdPrnthCnt = --clsdPrnth;

            return this.nstdArrayRef(checkForArray, newClsdPrnthCnt);
        } else {
            return anArray;
        }

        //return anArray;
    },

    addToHstry: function(input) {
        let expCnt = this.expressionCount;
        let crntHstryExp = this.history['expression ' + (this.historyCount)];
        let expProp = crntHstryExp[expCnt];

        if(Array.isArray(input)) {
            this.parenthesesCount++;
            this.closedPrnthCnt++;
        }

        if (input === ')') {
            this.closedPrnthCnt--;

            if(this.closedPrnthCnt === 0) {
                this.parenthesesCount = 0;
                this.expressionCount++;
            }
        } else if (Array.isArray(expProp)) {
            let arrayToUse = this.nstdArrayRef(expProp, this.closedPrnthCnt);
            
            arrayToUse.push(input);
        } else {
            this.makeExpHistory(crntHstryExp, expCnt, input);

            if (this.parenthesesCount === 0) {
                this.expressionCount++;
            }
        }

        this.calcDisplay(input);
        
        // Test
        console.log(this.history);
    },

    cnvrtHstryToArray: function(exp) {
        this.currentExpression = Object.values(exp);
        console.log(this.currentExpression);
    },
    
    addToCurrentOop: function(input) {
        let crntOop = this.currentOop;
        let arrayToCheck = crntOop[0];

        if (this.closedPrnthCnt > 0) {
            
        } else if ((input === '*' || input === '/')) {
            crntOop[1].push(input);
        } else if ((input === '+' || input === '-')) {
            crntOop[2].push(input);
        }
        //Test
        console.log(this.currentOop);
    },

    oopSort: function(input) {
        switch(input) {
            case '(':
                return 3;
            case '*':
                return 2;
            case '/':
                return 2;
            case '+':
                return 1;
            case '-':
                return 1;
            default:
                return 3;
        }
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

    // TODO
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
    
    //TODO
    operatorReplacer: function(expStart, delCnt, solverAns) {
        var crntExp = this.currentExpression;

        crntExp.splice(expStart, delCnt, solverAns)
    },

    // I put makeHistory() here for now?
    resetCounters: function () {
        this.expressionCount = 0;
        this.parenthesesCount = 0;
        this.clsdPrnthCnt = 0;
        this.makeNextNumNeg = 0;
        this.currentExpression = [];
        this.currentOop = [[],[],[]];

        //this.makeHistory();
    },

    // TODO
    showHistory: function() {},
    
    // Should this only call cnvrtHstryToArrayExp()?
    findAnswer: function() {
        let crntExp = this.history['expression ' + this.historyCount];
        
        this.cnvrtHstryToArray(crntExp);
        this.concatOopArrays();
        //this.operatorCompare();
        //this.resetCounters();
    },
};