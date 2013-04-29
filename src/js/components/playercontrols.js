Crafty.c("PlayerControls", {
  isPuncthing: false,
  isKicking: false,
  isRunning: false,
  isJumping: false,
  jumpHeight: 150,
  jumpSpeed: 10,
  preJumpY: null,

  init: function() {
    this.requires("Fourway, ViewportConstrain, SpriteAnimation, Keyboard")
    .fourway(4)
    .bind("NewDirection", $.proxy(this.changeDirection, this))
    .bind("KeyDown", $.proxy(this.keyHandler, this));

    this.animate('Walking',2,0,0);
    this.animate("Standing", 0,0,0);
    this.animate("Punch", 0,1,2);
    this.animate("Kick", 0,2,2);
    this.animate('Jump',5,0,5);
    this.animate('Land',6,0,6);
    this.bind("Moved", this.movingAnimation);
    this.bind('EnterFrame', $.proxy(this.enterFrameHandler, this));
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

  enterFrameHandler: function(){
    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick') ||
       this.isPlaying('Jump') ||
       this.isPlaying('Walking') ||
       this.isPlaying('Land')){
      return false;
    }

    if(this.isJumping){
        if(this.y - this.jumpSpeed <= (this.preJumpY - this.jumpHeight)){
          this.isJumping = false;
          this.isLanding = true;
          return;
        }
        return this.y-= this.jumpSpeed;
    }

    if(this.isLanding){
      if(this.y + this.jumpSpeed >= this.preJumpY){
        this.animate('Land', 2, 0);
        this.isLanding = false;
        this.y = this.preJumpY;
        this.preJumpY = null;
        return;
      }else{
        return this.y+= this.jumpSpeed;
      }
    }

    this.stop().animate("Standing",25,0);
  },

  movingAnimation: function(movedata){
    this.animate('Walking',15,-1);
  },

  keyHandler: function(){
    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick') ||
       this.isPlaying('Jump')){
      return false;
    }

    if(this.isDown(88)){
        this.animate('Punch',15,0);
    }

    if(this.isDown(67)){
        this.animate('Kick',15,0);
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
    this.animate('Jump',1,0);
  }

});

