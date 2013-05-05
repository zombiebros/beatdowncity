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
   this.requires("2D, Canvas, player1, SpriteAnimation, remoteATTR");
   this.animate('Walking',2,0,0);
   this.animate("Standing", 0,0,0);
   this.animate("Punch", 0,1,2);
   this.animate("Kick", 0,2,2);
   this.animate('Jump',5,0,5);
   this.animate('Land',6,0,6);
   this.bind("Move", $.proxy(this.changeDirection, this));
   this.bind("Move", $.proxy(this.movingAnimation, this));
   this.bind('EnterFrame', $.proxy(this.enterFrameHandler, this));
   this.animate("Standing",25,0);
 },


   movingAnimation: function(old_pos){
    if(this.isJumping){ return;}

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

  enterFrameHandler: function(){
    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick') ||
       this.isPlaying('Jump') ||
       this.isPlaying('Walking') ||
       this.isPlaying('Land')){
      return false;
    }

    if(this.isJumping){
        this.animate('Jump',1,0);
        if(this.y - this.jumpSpeed <= (this.preJumpY - this.jumpHeight)){
          this.isJumping = false;
          this.isLanding = true;
          return;
        }
        return this.y-= this.jumpSpeed;
    }

    if(this.isPunching && !this.isPlaying('Punch')){
      this.animate('Punch',15,0).bind("AnimationEnd", function(reel){
        this.isPunching = false;
      });
      return;
    }

    if(this.isKicking){
      this.animate('Kick',15,0).bind('AnimationEnd', function(reel){
        this.isKicking = false;        
      });
      return;
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
  }
});