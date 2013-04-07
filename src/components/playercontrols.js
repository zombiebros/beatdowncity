Crafty.c("PlayerControls", {

  init: function() {
    this.requires("Fourway, ViewportConstrain, SpriteAnimation")
    .fourway(4)
    .bind("NewDirection", this.changeDirection);

    this.animate('Walking',2,0,0);
    this.animate("Standing", 0,0,0);
    this.bind("Moved", this.movingAnimation);
  },

  changeDirection: function(direction){
    if(direction.x > 0){
        this.unflip("X");
    }else if(direction.x < 0){
        this.flip("X");
    }

    if(!direction.x){
      this.stop().animate("Standing",25,0);
    } 
  },

  movingAnimation: function(movedata){
    this.animate('Walking',25,-1);
  }

});

