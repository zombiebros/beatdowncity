Crafty.c("PlayerControls", {
  isPuncthing: false,
  isKicking: false,
  isRunning: false,
  isJumping: false,
  jumpHeight: 150,
  jumpSpeed: 10,
  preJumpY: null,

  init: function() {
    this.requires("Fourway, ViewportConstrain, Keyboard")
    //.fourway(4)
    //.bind("NewDirection", $.proxy(this.changeDirection, this))
    .bind("KeyDown", $.proxy(this.keyHandler, this));
  },

  // changeDirection: function(direction){
  //   if(direction.x > 0){
  //       this.unflip("X");
  //   }else if(direction.x < 0){
  //       this.flip("X");
  //   }

  //   if(!direction.x){
  //     this.stop().animate("Standing",25,0);
  //   }
  // },

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

