Crafty.c("Player", {
  life: 100,
  isPunching: false,
  isKicking: false,
  isRunning: false,
  isJumping: false,
  jumpHeight: 150,
  jumpSpeed: 10,
  preJumpY: null,

  init: function(){
   this.requires("2D, Canvas, player1, SpriteAnimation");
   this.animate('Walking',2,0,0);
   this.animate("Standing", 0,0,0);
   this.animate("Punch", 0,1,2);
   this.animate("Kick", 0,2,2);
   this.animate('Jump',5,0,5);
   this.animate('Land',6,0,6);
   this.bind("Move", $.proxy(this.changeDirection, this));
   this.bind("Move", $.proxy(this.movingAnimation, this));
   this.bind('EnterFrame', $.proxy(this.enterFrameHandler, this));
   this.bind("Change", $.proxy(this.animationChange, this));
   this.animate("Standing",1,1).stop();
 },

   animationChange: function(anything){
    if(this._currentReelId === 'Punch' && this._frame.currentSlideNumber === 3){
      console.log("punch hit");
    }

    if(this._currentReelId === 'Kick' && this._frame.currentSlideNumber === 3){
      console.log("kick hit");
    }
   },


   movingAnimation: function(old_pos){
    if(this.isJumping || this.isLanding){ return;}

    if(!this.isPlaying('Walking')){
      this.animate('Walking',25, 1);
    }
  },

  changeDirection: function(old_pos){
    if(this._x > old_pos._x){
        this.unflip("X");
    }else if(this._x < old_pos._x){
        this.flip("X");
    }
  },

  enterFrameHandler: function(frameNum){
    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick') ||
       this.isPlaying('Jump') ||
       this.isPlaying('Land')){
      return false;
    }

    if(this.isJumping){
        this.animate('Jump',1,-1);
        if(this.y - this.jumpSpeed <= (this.preJumpY - this.jumpHeight)){
          this.isJumping = false;
          this.isLanding = true;
        }
        return this.y-= this.jumpSpeed;
    }

    if(this.isLanding){
      if(this.y + this.jumpSpeed >= this.preJumpY){
        this.animate('Land', 2, -1);
        this.isLanding = false;
        this.y = this.preJumpY;
        this.preJumpY = false;
        return;
      }else{
        return this.y+= this.jumpSpeed;
      }
    }

    if(this.isPlaying('Punch')){
      console.log("Punching frame?", this._frame);
      return;
    }

    if(this.isPunching && !this.isPlaying('Punch')){
      return this.punch();
    }

    if(this.isKicking){
      return this.kick();
    }

    if(this.isPlaying('Walking')){
      return;
    }

    if(this._currentReelId !== 'Standing' ){
      console.log("stop standing");
      this.stop().animate("Standing",1,-1);
    }
  },

  kick: function(){
    this.stop();
    var ani = this.animate('Kick',15,0);
        ani.bind('AnimationEnd', function(reel){
          this.isKicking = false;
        });
    return;
  },

  punch: function(){
    this.stop();
    var ani = this.animate('Punch',15,0);
        ani.bind("AnimationEnd", function(reel){
          this.isPunching = false;
        });
    return;
  }

});