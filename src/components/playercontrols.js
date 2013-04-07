Crafty.c("PlayerControls", {

  init: function() {

    this.requires("Fourway, ViewportConstrain, MoveByCenter")
    .attr({enteredviewport: true})
    .fourway(4,[0])     // twoway movement for now
    .bind("NewDirection", this.changeDirection);
  },

  changeDirection: function(direction){
    console.log("changing direction");
    this.animate('RunningRight',2,0,0);
    this.animate('RunningLeft',2,0,0);

    if (direction.x < 0) {
      if (!this.isPlaying("RunningLeft"))
        this.stop().animate("RunningLeft", 25, -1);
    }

    if (direction.x > 0) {
      if (!this.isPlaying("RunningRight"))
        this.stop().animate("RunningRight", 25, -1);
    }

    if(!direction.x){
      this.stop().animate("standing",0,0,0).animate("standing",25,0);
    }
  }

});

