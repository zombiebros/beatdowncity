Crafty.c("Player", {
  life: 100,

  init: function(){
   this.requires("2D, Canvas, player1, SpriteAnimation");
   this.animate('Walking',2,0,0);
   this.animate("Standing", 0,0,0);
   this.animate("Punch", 0,1,2);
   this.animate("Kick", 0,2,2);
   this.animate('Jump',5,0,5);
   this.animate('Land',6,0,6);
   this.bind("Move", $.proxy(this.movingAnimation, this));
   this.bind('EnterFrame', $.proxy(this.enterFrameHandler, this));
   this.stop().animate("Standing",25,0);
 },

   movingAnimation: function(old_pos){
    console.log("moving... something", this);
    if(!this.isPlaying('Walking')){
      this.animate('Walking',15, 1);
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
  }
});