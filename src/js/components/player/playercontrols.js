Crafty.c("PlayerControls", {
  xV:0,

  init: function() {
    this.requires("Keyboard")
    .bind("EnterFrame", $.proxy(this.enterFrameHandler, this))
    .bind("KeyDown", $.proxy(this.keyHandler, this));
  },

  enterFrameHandler:function(){
    if((this.x + this.w/2) + this.xV <= 0){
      return;
    }

    if((this.x + this.w/2) + this.xV >= Crafty.viewport.width){
      return;
    }

    this.x += this.xV;

    //Left
    if(this.isDown(37)){
      this.isWalking = true;
      this.xV = -1;
      return;
    }

    //Right
    if(this.isDown(39)){
      this.isWalking = true;
      this.xV = 1;
      return;
    }

    //Up
    if(this.isDown(38)){
      this.isWalking = true;
      return this.y-=this.xV;
    }

    //Down
    if(this.isDown(40)){
      this.isWalking = true;
      return this.y+=this.xV;
    }

    this.xV = 0;
    this.isWalking = false;
    this.isStanding = true;
  },

  keyHandler: function(){
    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick')){
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
        console.log("Dashing left!");
        this.dashLeft = 0;
      }
    }

    //Right
    if(this.isDown(39)){
      this.dashRight += 1;
      if(this.dashRight === 2){
        console.log("Dashing Right!");
        this.dashRight = 0;
      }
    }

  }

});

