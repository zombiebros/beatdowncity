Crafty.c("PunchBox", {
  init: function() {
    this.requires("2D, Canvas");

    this.attr({
      w:10,
      h:10,
      z:900
    })
    .addComponent('Collision, WiredHitBox')
    .setName('punchBox');
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

