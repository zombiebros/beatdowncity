Crafty.c("Jump", {
  yV: 0,
  gravity: 0.2,
  jumpHeight: 40,
  preJumpY: null,
  jumpV: 4,
  isRising: false,
  isFalling: false,

  init: function(){
    this.bind("EnterFrame", $.proxy(this.enterFrameHandler, this));
  },

  enterFrameHandler: function(){
    if(this.isFalling === true){
      if((this.y + this.yV) >= this.preJumpY){
        this.isFalling = false;
        this.y = this.preJumpY;
        this.stop();
        //Triggers animation
        this.isJumping = false;
        if(this.isFrontKOing || this.isBackKOing){
          console.log("OMG LETS DOWN");
          this.isFrontKOing = false;
          this.isBackKOing = false;
          this.isDowning = true;
        }else{
          this.isCrouching = true;
        }

        this.yV = 0;
        this.preJumpY = false;
        return;
      }

        this.y += this.yV;
        this.yV += this.gravity;
        return;
    }

    if(this.isRising === true){
      if(this.yV < 0 || // inverse velocity we are falling
         ((this.y - this.yV) <= (this.preJumpY - this.jumpHeight))){
        this.yV = 0;
        this.isRising = false;
        this.isFalling = true;
        return;
      }

      this.y -= this.yV;
      this.yV -= this.gravity;
      return;
    }

    if(this.isPlaying('Punch') ||
     this.isPlaying('Kick')){
     return false;
    }
  },

  startJump: function(jumpHeight){
    if(this.isRising === true ||
       this.isFalling === true){
      return false;
    }

    if(typeof jumpHeight != 'undefined'){
      this.jumpHeight = jumpHeight;
    }else{
      this.jumpHeight = 40;
    }

    if(!this.preJumpY){
      this.preJumpY = this.y;
    }

    if(this.yV === 0){
      this.yV = this.jumpV;
    }

    this.isRising = true;
  }
});