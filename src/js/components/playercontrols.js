Crafty.c("PlayerControls", {
  init: function() {
    this.requires("Fourway, Keyboard")
    .fourway(4)
    .bind("KeyDown", $.proxy(this.keyHandler, this));
  },

  keyHandler: function(){
    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick') ||
       this.isPlaying('Jump')){
      return false;
    }

    //Left
    if(this.isDown(37)){
      this.x-=4;
    }

    //Right
    if(this.isDown(39)){
      this.x+=4;
    }

    //Up
    if(this.isDown(38)){
      this.y-=4;
    }

    //Down
    if(this.isDown(40)){
      this.y+=4;
    }

    if(this.isDown(88)){
        this.isPunching = true;
    }

    if(this.isDown(67)){
        this.isKicking = true;
    }

    if(this.isDown(32)){
        this.jump();
    }
  },

  jump: function(){
    if(this.isJumping === true || this.isLanding === true){
      return false;
    }

    this.isJumping = true;
    if(!this.preJumpY){
      this.preJumpY = this.y;
    }
  }

});

