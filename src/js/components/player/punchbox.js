Crafty.c("PunchBox", {
  hitAnimation: "Punch",
  hitFrame: 3,

  init: function() {
    this.requires("2D, Canvas");

    this.attr({
      w:10,
      h:10,
      z:900
    })
    .addComponent('Collision, WiredHitBox')
    .onHit("Player", $.proxy(this.hitPlayerHandler, this))
    .setName('punchBox');
  },

  hitPlayerHandler: function(players){
    var player;

    for(i=0; i<players.length; i++){ // iterate over what players we are hitting
      player = players[i].obj;

      //Ignore when our hitbox is touching our self
      if(player === this._parent){
        continue;
      }

      try{
        console.log("touching a dood thats not me",
          this._parent._currentReelId,
          this._parent._frame.currentSlideNumber);
      }catch(ex){
        console.log("Exception:",ex.message);
      }

      console.log("lol wtf where am I", this._parent.frame, this._parent.isPlaying);

      if(typeof this._parent._frame != 'undefined' &&  //For some reason frame isnt gauranteed? wtf
         this._parent.isPlaying(this.hitAnimation) &&
         this._parent._frame.currentSlideNumber == this.hitFrame){
        console.log("LETS RIP");
        player.applyDamage();
      }
    }
  },

  mirror: function(){
    var _self = this;
    this.attr({
      x:_self._parent.x+5
    });
  },

  unmirror: function(){
    var _self = this;
    this.attr({
      x:_self._parent.x+25
    });
  }
});

