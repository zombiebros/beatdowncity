Crafty.c("KickBox", {
  init: function() {
    console.log("kickbox parent?", this._parent);
   this.requires("2D, Canvas")
   .attr({
    w:13,
    h:10,
    x:25,
    y:22,
    z:900
  })
   .addComponent('Collision, WiredHitBox')
   .setName('kickBox');

  },

  mirror: function(){
    var _self = this;
    this.attr({
      x:_self._parent.x+3
    });
  },

  unmirror: function(){
    var _self = this;
    this.attr({
      x:_self._parent.x+25
    });
  }
});

