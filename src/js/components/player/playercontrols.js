Crafty.c("PlayerControls", {
  dashLeft:0,
  dashRight:0,

  init: function() {
    this.requires("Keyboard")
    .bind("EnterFrame", $.proxy(this.enterFrameHandler, this))
    .bind("KeyDown", $.proxy(this.keyHandler, this));
  },

  enterFrameHandler:function(){
    if(this.isStaticAnimating()){
      return true;
    }

    //Left
    if(this.isDown(37)){
      if(!this.isRising && !this.isFalling){ // Can only flip once in air
        this.isWalking = true;
        this.xV = -1;
      }
      this.dir = -1;
    }

    //Right
    if(this.isDown(39)){
      if(!this.isRising && !this.isFalling){ // Can only flip once in air
        this.isWalking = true;
        this.xV = 1;
      }
      this.dir = 1;
    }

    //Up
    if(this.isDown(38) && !this.isRising && !this.isFalling){
      this.isWalking = true;
      this.yV = -1;
    }

    //Down
    if(this.isDown(40) && !this.isRising && !this.isFalling){
      this.isWalking = true;
      this.yV = 1;
    }

    // Not moving on the x reset it
    if(!this.isDown(37) && !this.isDown(39) && !this.isRising && !this.isFalling){
      this.xV = 0;
    }

    // Not moving on the y reset it
    if(!this.isDown(38) && !this.isDown(40) &&
      !this.isRising && !this.isFalling){
      this.yV = 0;
    }

    // Not moving any direction reset animations
    if(!this.isDown(37) && !this.isDown(39) &&
      !this.isDown(38) && !this.isDown(40)){
        this.isWalking = false;
        this.isStanding = true;
    }
  },

  keyHandler: function(){
    if(this.isStaticAnimating()){
      return false;
    }

    if(this.isDown(88)){
        this.isPunching = true;
    }

    if(this.isDown(67)){
        this.isKicking = true;
    }

    if(this.isDown(32)){
        this.isJumping = true;
        this.startJump();
    }

    //Left
    if(this.isDown(37)){
      this.dashLeft += 1;
      if(this.dashLeft === 2){
        this.dashLeft = 0;
      }
    }

    //Right
    if(this.isDown(39)){
      this.dashRight += 1;
      if(this.dashRight === 2){
        this.dashRight = 0;
      }
    }

  }

});

