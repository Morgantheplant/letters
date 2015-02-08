define(function(require, exports, module) {

  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var GridLayout = require("famous/views/GridLayout");
  var Transitionable = require('famous/transitions/Transitionable');
  var SpringTransition = require('famous/transitions/SpringTransition');
  var Flipper = require('famous/views/Flipper');
  var Timer = require('famous/utilities/Timer');

  Transitionable.registerMethod('spring', SpringTransition);

  var spring = {
    method: 'spring',
    period: 500,
    dampingRatio: 0.3
  };
  


  function LetterView() {

    View.apply(this, arguments);
     this.dotHash = {}
    
    _createDots.call(this)

    this._eventInput.on('show_letter', function(data){
      console.log(data.letter)
      this.displayLetter(data.letter)
    }.bind(this))

    this.timeBetweenEvents = 600;


   // Timer.setTimeout(function(){
   //    this.readWord('BADEDAAD') 
   // }.bind(this),1000)

  }


  LetterView.prototype = Object.create(View.prototype);
  LetterView.prototype.constructor = LetterView;

  LetterView.DEFAULT_OPTIONS = {};
  
  


  function _createDots(){

    var grid = new GridLayout({
      dimensions: [20, 7],
      gutterSize:[1,1]
    });
    
    this.letterHash = {
      A:['0111111','1000100','1000100','1000100','0111111'],
      B:['0110110','1001001','1001001','1001001','1111111'],
      C:['0100010','1000001','1000001','1000001','0111110'],
      D:['0111110','1000001','1000001','1000001','1111111'],
      E:['1000001','1001001','1001001','1001001','1111111'],
      F:['1000000','1001000','1001000','1001000','1111111'],
      G:['1001110','1001001','1001001','1000001','0111110'],
      H:['1111111','0001000','0001000','0001000','1111111'],
      I:['1000001','1000001','1111111','1000001','1000001'],
      J:['0000110','0000001','0000001','1111110','0000000'],
      K:['1000001','0100010','0010100','0001000','1111111'],
      L:['0000001','0000001','0000001','0000001','1111111'],
      M:['1111111','0100000','0011000','0100000','1111111'],
      N:['1111111','0000100','0001000','0010000','1111111'],
      O:['0111110','1000001','1000001','1000001','0111110'],
      P:['0110000','1001000','1001000','1001000','1111111'],
      Q:['0111111','1000011','1000101','1000001','0111110'],
      R:['0110001','1001010','1001100','1001000','1111111'],
      S:['1000110','1001001','1001001','1001001','0111001'],
      T:['1000000','1000000','1111111','1000000','1000000'],
      U:['1111110','0000001','0000001','0000001','1111110'],
      V:['1111100','0000010','0000001','0000010','1111100'],
      W:['1111111','0000010','0001100','0000010','1111111'],
      X:['1100011','0010100','0001000','0010100','1100011'],
      Y:['1100000','0010000','0001111','0010000','1100000'],
      Z:['1100001','1010001','1001001','1000101','1000011'],
      " ":['0000000','0000000','0000000','0000000','0000000']
    }
    
   

    //keep track of content so we can newBoard/reassign blocks later
   
    this.dots = [];

    grid.sequenceFrom(this.dots);

    for(var i = 0, row=0, col=0; i < 140; i++){
      
      var key = col + 'key'+ row 

      var flipper = new Flipper({
        origin:[0.5,0.5]
      })
  

      var turnOn =  new Surface({
        size: [undefined, undefined],
        properties: {
          backgroundColor: "#8BD843",
        }
      })

      var turnOff =  new Surface({
        size: [undefined, undefined],
        properties: {
          backgroundColor: "#222A1E"
        }
      })

      flipper.setFront(turnOn)
      flipper.setBack(turnOff)
      
      this.dotHash[key]= {
        flipper: flipper,
        on: false,
        key: key
      }
      
      if(col===19){
        col = -1;
        row++
      }
      
      col++;


      this.dots.push(flipper);
      flipper.flip()
    }

    var gridMod = new StateModifier({
      size:[600,350]
    })
    
    this.add(gridMod).add(grid)
  }
  



  LetterView.prototype.displayLetter = function(word){
    var letterArray = word.split('');
    var letterCounter = letterArray.length;
    var letterChunks;
    var shift = false;
    var buffer = ['0000000']
    this.stepTracker = 0;
    initNextLetter.call(this)
    
    function initNextLetter(){
      Timer.clear(this.startTimer)
      Timer.clear(this.endTimer)
      this.bufferCount = 0;
      this.bufferSize = 1;
      this.endBufferCount = 0;
      letterCounter--;
      if(letterCounter>=0){
        letterChunks = this.letterHash[letterArray[letterCounter]];
        this.step = 0;
        bufferStart.call(this, this.bufferCount)
      }
    }
    
    function bufferStart(count){
      
      this.startTimer = Timer.setTimeout(function(){
        if(this.bufferCount === this.bufferSize){
          nextStep.call(this)
          return;
        }
        if(this.bufferCount < this.bufferSize){
          callColumn.call(this, buffer[0], 20)
          bufferStart.call(this)
          this.bufferCount++
        }
      }.bind(this), this.timeBetweenEvents)
    }
    
    function nextStep(){

      this.chunkTimer = Timer.setTimeout(function(){         
        if(this.step === 5){
          bufferEnd.call(this)
        }

         this.stepTracker = (this.stepTracker < 5) ? this.stepTracker : 4;
        
        console.log(letterChunks[this.stepTracker])


        if(this.step < 5){
          callColumn.call(this, letterChunks[this.stepTracker], shift)
          nextStep.call(this)
          this.stepTracker++
          this.step++;
          if(shift){
            shift--;
          }
        }


      }.bind(this), this.timeBetweenEvents)
    }
  


      function bufferEnd(){

       this.endTimer = Timer.setTimeout(function(){
        if(this.endBufferCount === this.bufferSize){
          console.log(this.endBufferCount)
          initNextLetter.call(this)
          return;
        }
        if(this.endBufferCount < this.bufferSize){
          console.log('callingaasd', this.endBufferCount)
          callColumn.call(this, buffer[0], 20)
          this.endBufferCount++;
          bufferEnd.call(this)
        }
      }.bind(this), this.timeBetweenEvents) 
    }



  }
  



  function callColumn(str, shift){
    var shift = shift || 20
    var letterChunk = str.split('');
    var column = 0
    
    eachColumn.call(this, column, shift, 'shift')
   
    function eachColumn(col){

      this.shiftTimer = Timer.setTimeout(function(){
        if(+col < shift){  
          var column = '' + col
          letterChunk.forEach(function(item, index){
            var dot = this.dotHash[column+'key'+index]
            
            if(item==='1' && !dot.on){
              dot.flipper.flip()
              dot.on = true
            } 
            if(item==='0' && dot.on){
              dot.flipper.flip()
              dot.on = false;
            }
          }.bind(this))
          
          col++;
        

          eachColumn.call(this, col)
          
        }

      }.bind(this), this.timeBetweenEvents)
    }
  }  


  module.exports = LetterView;

});
