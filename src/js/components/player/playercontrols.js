Crafty.c("PlayerControls", {
  walkSpeed: 2,

  init: function() {
    this.requires("Keyboard")
    .bind("EnterFrame", $.proxy(this.enterFrameHandler, this))
    .bind("KeyDown", $.proxy(this.keyHandler, this));
  },

  enterFrameHandler:function(){
    if(this.isPlaying('Punch') ||
     this.isPlaying('Kick') ||
     this.isPlaying('Jump') ||
     this.isPlaying('Land')){
     return false;
    }
    //Left
    if(this.isDown(37)){
      this.x-=this.walkSpeed;
    }

    //Right
    if(this.isDown(39)){
      this.x+=this.walkSpeed;
    }

    //Up
    if(this.isDown(38)){
      this.y-=this.walkSpeed;
    }

    //Down
    if(this.isDown(40)){
      this.y+=this.walkSpeed;
    }
  },

  keyHandler: function(){
    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick') ||
       this.isPlaying('Jump')){
      return false;
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

    if(!this.preJumpY){
      this.preJumpY = this.y;
    }
    this.isJumping = true;
  }

});

