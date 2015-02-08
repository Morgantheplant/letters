define(function(require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var LetterView = require('views/LetterView');

  function AppView() {
    View.apply(this, arguments);
      this.targetNumber = 200;

     _createLetter.call(this)

  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {};

  
  function _createLetter(){

    var surface = new Surface({
      size:[100,50],
      align:[0.01,0.01],
      content:'CLICK',
      properties:{
        backgroundColor:'gray',
        cursor:'pointer',
        borderRadius:'10px',
        fontSize:'16px',
        textAlign:'center',
        fontFamily:'verdana',
        paddingTop:'15px'
      }
    })
    
    this.add(surface)
    
    surface.on('click', function(){
      var text = 'The quick brown fox jumps OVER the LAZY DOG'
      letterView._eventInput.trigger('show_letter', {letter: text})
      surface.setContent('<div class="message">'+text+'</div>')
    }.bind(this))

    var blockMod = new StateModifier({
      origin:[0.5,0.5],
      align:[0.5,0.5]
    })

    var letterView = new LetterView()
    
    var letter2Mod = new StateModifier({
      transform: Transform.translate(200,0,0)
    })

    var letter3Mod = new StateModifier({
      transform: Transform.translate(400,0,0)
    })

    var letter4Mod = new StateModifier({
      transform: Transform.translate(600,0,0)
    })

    // var letter4Mod = new StateModifier({
    //   transform: Transform.translate(820,0,0)
    // })

    // var letterView2 = new LetterView()
    // var letterView3 = new LetterView()
    // var letterView4 = new LetterView()
    

    var node = this.add(blockMod)
    node.add(letterView)
    
    // node.add(letter2Mod).add(letterView2)
    // node.add(letter3Mod).add(letterView3)
    // node.add(letter4Mod).add(letterView4)

  }

  


  module.exports = AppView;
});
