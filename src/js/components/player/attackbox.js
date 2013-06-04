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
    var player, side;

    for(i=0; i<players.length; i++){ // iterate over what players we are hitting
      player = players[i].obj;

      // Ignore when our hitbox is touching our self
      if(player === this._parent){
        continue;
      }

      /*
      * Mother of god... (⌐■_■)
      * Find what side we are hitting the player on to
      * render appropriate animation
      */
      if(this.x < (player.x + player.w/2) && player._flipX){
        side = 'Front';
      }
      else if((this._parent.x + this._parent.w/2) > (player.x + player.w/2) && player._flipX){
        side = 'Back';
      }else if((this._parent.x + this._parent.w/2) < (player.x + player.w/2) && (player._flipX === false || typeof player._flipX === 'undefined')){
        side = 'Back';
      }else if((this._parent.x + this._parent.w/2) > (player.x + player.w/2) && (player._flipX === false || typeof player._flipX === 'undefined')){
        side = 'Front';
      }else{
        side = 'Front';
      }

      if(typeof this._parent._frame != 'undefined' &&  //For some reason frame isn't gauranteed? wtf
         this._parent.isPlaying(this.hitAnimation) &&
         this._parent._frame.currentSlideNumber == this.hitFrame){
        player.applyDamage(this._parent.stats[this.hitAnimation.toLowerCase()][0], side);
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
