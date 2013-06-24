Crafty.c("Shadow", {
  init:function(){
    this.requires('2D, Canvas, Color')
  },

  /*
  * Constructor
  */
  shadow: function(player){
    this.player = player;

    this.attr({
      x: 10,
      y: player.h,
      w: player.w/2,
      h: 3
    }).color('grey');


    this.bind('EnterFrame', $.proxy(this.enterFrameHandler, this));
  },

  enterFrameHandler: function(){
    if(this.player.preJumpY){
      this.y = this.player.preJumpY + this.player.h;
      this.visible = true;
    }else{
      this.visible = false;
      this.y = this.player.y + this.player.h;
    }

    this.x = this.player.x+10;
  }
});