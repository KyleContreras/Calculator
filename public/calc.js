"use strict";

// TODO: look up binary expression trees

// TODO:
// BIG ERROR: I cannot put in numbers large than 9 into my calculator.
// possible soln: create a var that holds an input, waiting to conat additional numbers to it...
// ... if input is NaN then the input is pushed to the exp and oop objects as needed

var calcObj = {
    // TODO: Should I create a getter/setter for these counters?
    // TODO: How should I handle clearing/resetting these?
    historyCount: 0,
    expressionCount: 0,
    parenthesesCount: 0,
    makeNextNumNeg: 0,

    currentExpression: [],   
    currentOop: [{},[],[]],
    history: {},

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

    checkHistory: function(input) {
        let crntInput = input === '(' ? [] : input;
        let crntInputOop = input === '(' ? [] : input;

        if(this.historyCount === 0) {
            this.historyCount++;
            this.makeObjProp(this.history, 'expression ' + this.historyCount, {})
        }

        this.addToHstry(crntInput);

        if (isNaN(crntInputOop) && crntInputOop !== ')' || Array.isArray(crntInputOop)) {
            this.addToCurrentOop(crntInputOop); 
        }
    },
    
    makeObjProp: function(objName, propName, value) {
        Object.defineProperty(objName, propName, {
            configurable: true,
            enumerable: true,
            writable : true,
            value: value,
        });
    },

    // TODO: Refactor
    addToHstry: function(input) {
        let expCnt = this.expressionCount;
        let crntHstryExp = this.history['expression ' + (this.historyCount)];
        let expProp = crntHstryExp[expCnt];

        if(Array.isArray(input)) {
            this.parenthesesCount++;
        }

        if (input === ')') {
            this.parenthesesCount--;    
        } else if (typeof expProp === 'object') {
            //let crctIndex = crctprnthLvl.length - 1;
            
            if (Array.isArray(input)) {
                let crctprnthLvl = expProp['prnthLvl ' + (this.parenthesesCount - 1)];
                let crctIndex = crctprnthLvl.length - 1;

                crctprnthLvl[crctIndex].push('(');
                
                if (!expProp['prnthLvl ' + this.parenthesesCount]) {
                    this.makeObjProp(expProp, 'prnthLvl ' + this.parenthesesCount, input);
                }

                // TODO: How can I refactor this?
                expProp = crntHstryExp[expCnt];
 
                expProp['prnthLvl ' + this.parenthesesCount].push([]);
            } else {
                let crctNstdArray = expProp['prnthLvl ' + this.parenthesesCount];
                let crctIndex = crctNstdArray.length - 1;
                
                crctNstdArray[crctIndex].push(input);
            }
        } else {
            if (Array.isArray(input) && this.parenthesesCount === 1) {
                this.makeObjProp(crntHstryExp, expCnt, {});

                // TODO: How can I refactor this?
                expProp = crntHstryExp[expCnt];

                this.makeObjProp(expProp, 'prnthLvl ' + this.parenthesesCount, input);
                
                expProp['prnthLvl ' + this.parenthesesCount].push([]);
            } else {
                this.makeObjProp(crntHstryExp, expCnt, input);
            }
        }

        if (this.parenthesesCount === 0) {
                this.expressionCount++;
        }

        this.calcDisplay(input);        
        
        // Test
        console.log(this.history);
    },

    cnvrtHstryToArray: function(exp) {
        this.currentExpression = Object.values(exp);

        // Test
        console.log(this.currentExpression);
    },

    findPrnthLvl: function(obj) {
        let prnthLvl = 'prnthLevel ';
        let prnthCnt = this.parenthesesCount;
        let crctObj = obj[prnthLvl + prnthCnt];

        if (crctObj) {
            prnthCnt--;
        }

        return prnthCnt;
    },

    // Should I compare strings? to see what to set the next appropriate level as?
    findPrnthSetCount: function(obj, crntInput) {
        let prnthSet = 'prnthSet ';
        let nmbrOfProps = this.findObjLength(obj);
        let prnthSetTest = obj[prnthSet + nmbrOfProps];
        //let nmbrOfProps = Object.keys(obj).length

        if (prnthSetTest && nmbrOfProps > 0) {
            if(Array.isArray(crntInput)) {
                nmbrOfProps++;    
            }
        } else if (nmbrOfProps === 0) {
            nmbrOfProps = 1;
        }

        return nmbrOfProps;

        //return (nmbrOfProps ? nmbrOfProps : 1);
    },
    
    findObjLength: function(obj) {
        let objLen = Object.keys(obj).length

        return objLen;
    },

    pushToCrctArray: function(obj, oprtr) {
        let oopObj = obj;
        let oprtrValue = this.oopValues(oprtr);

        oopObj[oprtrValue].push(oprtr);
    },

    addToCurrentOop: function(input) {
        let crntOop = this.currentOop;
        
        if (this.parenthesesCount === 0) {
            this.pushToCrctArray(crntOop, input);
        } else { 
            let indexZero = crntOop[0];
            let prnthCnt = this.parenthesesCount;
            let prnthLvl = 'prnthLevel ' + prnthCnt;
            let oopObj = indexZero[prnthLvl];

            let prnthSetCnt;
            let prnthSet;

            if (Array.isArray(input)) {
                let arrayOop = [[],[],[]];

                if (oopObj) {
                    //let prevPrnthCnt = prnthCnt - 1;
                    //let prevPrnthLvl = 'prnthLevel ' + prnthCnt - 1;
                    let prevPrnthLvl = 'prnthLevel ' + this.findPrnthLvl(indexZero);
                    let oldOopObj = indexZero[prevPrnthLvl];
                    let prevPrnthSetCnt = this.findPrnthSetCount(oldOopObj, input);
                    let prevPrnthSet = 'prnthSet ' + prevPrnthSetCnt;

                    let crctPrevObj = oldOopObj[prevPrnthSet];

                    this.pushToCrctArray(crctPrevObj, '(');
                } else {
                    this.makeObjProp(indexZero, prnthLvl, {});

                    oopObj = indexZero[prnthLvl];
                }
                prnthSetCnt = this.findPrnthSetCount(oopObj, input);
                prnthSet = 'prnthSet ' + prnthSetCnt;
                
                this.makeObjProp(oopObj, prnthSet, arrayOop);
            } else {
                prnthSetCnt = this.findPrnthSetCount(oopObj, input);
                prnthSet = 'prnthSet ' + prnthSetCnt;

                let crctNstdArray = oopObj[prnthSet];
                
                this.pushToCrctArray(crctNstdArray, input);
            }
        }
        //Test
        console.log(this.currentOop);
    },

    oopValues: function(input) {
        switch(input) {
            case '*':
            case '/':
                return 1;
            case '+':
            case '-':
                return 2;
            default:
                return 0;
        }
    },

    // TODO:  
    concatOopArrays: function () {
        let prnthOop = this.currentOop[0];
        let oopKeys = Object.keys(prnthOop);

        // Test
        console.log(this.currentOop);
    },

    // TODO: refactor
    OopCleanUp: function() {
        let operatorArray = this.currentOop;
        operatorArray.splice(0,2);
    },

    // TODO: Refactor 
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
    
    //TODO: Refactor
    operatorReplacer: function(expStart, delCnt, solverAns) {
        var crntExp = this.currentExpression;

        crntExp.splice(expStart, delCnt, solverAns)
    },

    // I put makeHistory() here for now?
    resetCounters: function () {
        this.expressionCount = 0;
        this.parenthesesCount = 0;
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
        //let prnthOop = this.currentOop[0];
        
        this.cnvrtHstryToArray(crntExp);
        
        this.concatOopArrays();
        //this.operatorCompare();
        //this.resetCounters();
    },
};