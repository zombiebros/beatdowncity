Crafty.c("PlayerControls", {

  init: function() {
    this.requires("Fourway, ViewportConstrain, SpriteAnimation")
    .fourway(4)
    .bind("NewDirection", this.changeDirection);

    this.animate('Walking',2,0,0);
    this.bind("Moved", this.movingAnimation);
  },

  changeDirection: function(direction){
    console.log("changing direction");
    this.flip("X");
  },

  movingAnimation: function(movedata){
    console.log("moving");
    this.animate('Walking',25,-1);
  }

});

