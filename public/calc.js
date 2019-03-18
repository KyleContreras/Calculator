var calcObj = {
    // NOTE: All instances of oop is short for 'Order of Operations'
    
    historyCount: 0,
    expressionCount: 0,
    currentExpression: [],
    currentSolverAns: 0,

    // TODO: Is an array that contains an array after condensing. Try and refactor to have a single array.
    // will the flat() method work?
    // OOP: Parentheses > exponents > (divide = multiply) > (add = subtract)
    currentOop: [[],[]],

    history: {},
    
    checkHistory: function(input) {
        if(this.historyCount === 0) {
            // I do not think this should be here
            // this.addToCalcDisplay(input);
            
            this.makeHistory();
            this.pushOopExp(input);
        } else {
            this.pushOopExp(input);
        }
    },

    // Where should this be called?
    addToCalcDisplay: function(input) {
        elmnt = document.getElementById('display');
        elmnt.value += input + ' ';
    },
    
    makeHistory: function() {
        this.historyCount++
        Object.defineProperty(this.history, 'expression' + this.historyCount, {
            value: {},
            configurable: true,
            enumerable: true,
            writable : true,
        });
    },

    pushOopExp: function(input) {
        if (isNaN(input)) {
            this.addToCurrentOop(input);
        }

        this.addExpProp(input);

        this.currentExpression.push(input)
    },

    addToCurrentOop: function(input) {
        let crntOop = this.currentOop;
        let crntExp = this.currentExpression;
        // had to use this. Let's see if this works.
        let crntExpLength = crntExp.length;
        // Is undefined. will point to an item that does not exist, if it is the first item entered.
        let dupOpCheck = crntExpLength;

        // Can I refactor this?
        // Will test for duplicate consecutive operators here since I will know which nested array...
        // ... the operator will be placed in.
        if (input === '*' && input !== dupOpCheck) {
            crntOop[0].push(input);
            this.addToCalcDisplay(input)
        } else if (input === '/' && input !== dupOpCheck) {
            crntOop[0].push(input);
            this.addToCalcDisplay(input)
        } else if (input !== dupOpCheckTwo) {
            crntOop[1].push(input);
            this.addToCalcDisplay(input)
        }
    },
    
    // Test logs here
    addExpProp: function(input) {
        this.history['expression' + (this.historyCount)][this.expressionCount] = input;
        this.expressionCount++;

        this.addToCalcDisplay(input);
        
        // Tests
        console.log(this.history);
        console.log(this.currentExpression);
        console.log(this.currentOop);
    },
    
    // may need to revisit
    concatOopArrays: function() {
        var crntOop = this.currentOop;       
        var cmbndArrays = crntOop[0].concat(crntOop[1]);

        crntOop.push(cmbndArrays);

        this.OopCleanUp(crntOop);
    },

    OopCleanUp: function() {
        var operatorArray = this.currentOop;
        operatorArray.splice(0,2);
    },

    operatorCheck: function() {
        var crntOop = this.currentOop[0];
        var crntExp = this.currentExpression;
        var i, j;

        for (i = 0; i < crntOop.length; i++) {
            for (j = 0; j < crntExp.length; j++) {   
                // NOTE: crntOop is an array that contains an array. Not as intended.
                if(crntOop[i] === crntExp[j]) {
                    var mathOprtr = crntOop[i];
                    var numA = crntExp[j-1];
                    var numB = crntExp[j+1];
                    var spliceStart = (j - 1);

                    // NOTE: this var probably hold up for equations with () or exponents. Works for now.
                    //var crntExpOprtr = crntExp[j-1];
                    
                    this.solver(mathOprtr, numA, numB);

                    var cSA = this.currentSolverAns;
                    // This returns an array of the deleted items. Not sure how long said arrays hang around for.
                    // Not the cleanest solution but it will do for now...
                    this.operatorReplacer(spliceStart, 3, cSA)

                    break;
                }
            }
        }
        this.addToCalcDisplay(this.currentExpression);
    },

    solver: function(symbol, nmbrA, nmbrB) {
        switch(symbol) {
            case '*':
                this.multiply(nmbrA, nmbrB);
                break;
            case '/':
                this.divide(nmbrA, nmbrB);
                break;
            case '+':
                this.add(nmbrA, nmbrB);
                break;
            case '-':
                this.subtract(nmbrA, nmbrB);
                break;
        }
    },
    
    // NOTE: this could be streamlined?
    operatorReplacer: function(expStart, delCnt, addAns) {
        var crntExp = this.currentExpression;

        crntExp.splice(expStart, delCnt, addAns)
    },

    add: function(a, b) {
        var ans = a + b;
        this.currentSolverAns = ans;
    },
    
    subtract: function(a, b) {
        var ans = a - b;
        this.currentSolverAns = ans;
    },
    
    multiply: function(a, b) {
        var ans = a * b;
        this.currentSolverAns = ans;
    },
    
    divide: function(a, b) {
        var ans = a / b;
        this.currentSolverAns = ans;
    },

    // TODO
    showHistory: function() {},
    
    addEqualSign: function() {
        this.addToCalcDisplay('=');
        this.addExpProp('='); 
    },
    
    // TODO: Don't forget to reset currentSolverAns, currentExpression, and currentOop
    // Don't forget to uncomment makeHistory()
    findAnswer: function() {
        this.addEqualSign();
        this.concatOopArrays();
        this.operatorCheck();
        this.expressionCount = 0;
        //this.makeHistory();
    },
    
    // TODO: Make sure everything is reset accordingly.
    clear: function() {
        elem = document.getElementById('display');
        elem.value = '';
        
        this.expressionCount = 0;
        this.currentSolverAns = 0;
        this.currentExpression = [];
        this.currentOop = [[],[]]
        this.makeHistory();
    }, 
}