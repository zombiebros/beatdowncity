Crafty.c("PlayerControls", {
  walkSpeed: 1,
  jumpHeight: 50,
  jumpSpeed: 2,
  preJumpY: null,

  init: function() {
    this.requires("Keyboard")
    .bind("EnterFrame", $.proxy(this.enterFrameHandler, this))
    .bind("KeyDown", $.proxy(this.keyHandler, this));
  },

  enterFrameHandler:function(){
    if(this.isPlaying('Punch') ||
     this.isPlaying('Kick')){
     return false;
    }

    if(this.isLanding === true){
      if((this.y + this.jumpSpeed) >= this.preJumpY){
        this.isLanding = false;
        this.y = this.preJumpY;
        this.preJumpY = false;
        return;
      }else{
        return this.y+= this.jumpSpeed;
      }
    }

    if(this.isJumping === true){
      if((this.y - this.jumpSpeed) <= (this.preJumpY - this.jumpHeight)){
        this.isJumping = false;
        this.isLanding = true;
      }
      return this.y-= this.jumpSpeed;
    }

    //Left
    if(this.isDown(37)){
      return this.x-=this.walkSpeed;
    }

    //Right
    if(this.isDown(39)){
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
    if(this.isJumping === true ||
       this.isLanding === true){
      return false;
    }

    if(!this.preJumpY){
      this.preJumpY = this.y;
    }
    this.isJumping = true;
  }

});

