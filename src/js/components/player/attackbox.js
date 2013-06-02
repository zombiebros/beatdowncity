Crafty.c("AttackBox", {
  hitAnimation: "Punch",
  hitFrame: 3,
  mirror_x: 5,
  unmirror_x: 25,

  init: function() {
    this.requires("2D, Canvas");
    //.onHit("Player", $.proxy(this.hitPlayerHandler, this));
  },

  hitPlayerHandler: function(players){
    var player;

    for(i=0; i<players.length; i++){ // iterate over what players we are hitting
      player = players[i].obj;

      //Ignore when our hitbox is touching our self
      if(player === this._parent){
        continue;
      }

      if(typeof this._parent._frame != 'undefined' &&  //For some reason frame isnt gauranteed? wtf
         this._parent.isPlaying(this.hitAnimation) &&
         this._parent._frame.currentSlideNumber == this.hitFrame){
        player.applyDamage();
      }
    }
  },

  mirror: function(){
    var _self = this;
    this.attr({
      x:_self._parent.x+_self.mirror_x
    });
  },

  unmirror: function(){
    var _self = this;
    this.attr({
      x:_self._parent.x+_self.unmirror_x
    });
  }
});
