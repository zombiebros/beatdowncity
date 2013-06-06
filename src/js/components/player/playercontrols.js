Crafty.c("PlayerControls", {
  walkSpeed: 1,
  yV: 0,
  gravity: 0.2,
  jumpHeight: 40,
  preJumpY: null,
  jumpV: 4,
  dashLeft: 0,
  dashRight: 0,

  init: function() {
    this.requires("Keyboard")
    .bind("EnterFrame", $.proxy(this.enterFrameHandler, this))
    .bind("KeyDown", $.proxy(this.keyHandler, this));
  },

  enterFrameHandler:function(){
    if(this.isLanding === true){
      if((this.y + this.yV) >= this.preJumpY){
        this.isLanding = false;
        this.y = this.preJumpY;
        this.stop();
        this.isCrouching = true;
        this.yV = 0;
        this.preJumpY = false;
        return;
      }

        this.y += this.yV;
        this.yV += this.gravity;
        return;
    }

    if(this.isJumping === true){
      if((this.y - this.yV) <= (this.preJumpY - this.jumpHeight)){
        this.yV = 0;
        this.isJumping = false;
        this.isLanding = true;
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

    //Left
    if(this.isDown(37)){
      if((this.x + this.w/2) <= 0){
        return this.animate('Walking', 50, 1);
      }
      return this.x-=this.walkSpeed;
    }

    //Right
    if(this.isDown(39)){
      if((this.x + this.w/2) >= Crafty.viewport.width){
        return this.animate('Walking', 50, 1);
      }
      return this.x+=this.walkSpeed;
    }

    //Up
    if(this.isDown(38)){
      return this.y-=this.walkSpeed;
    }

    //Down
    if(this.isDown(40)){
      return this.y+=this.walkSpeed;
    }

    this.dashLeft = 0;
    this.dashRight = 0;
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

  },

  startJump: function(){
    if(this.isJumping === true ||
       this.isLanding === true){
      return false;
    }

    if(!this.preJumpY){
      this.preJumpY = this.y;
    }

    if(this.yV === 0){
      this.yV = this.jumpV;
    }

    this.isJumping = true;
  }

});

