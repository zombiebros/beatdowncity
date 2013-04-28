Crafty.c("PlayerControls", {
  isPuncthing: false,
  isKicking: false,
  isRunning: false,

  init: function() {
    this.requires("Fourway, ViewportConstrain, SpriteAnimation, Keyboard")
    .fourway(4)
    .bind("NewDirection", this.changeDirection)
    .bind("KeyDown", this.keyHandler);

    this.animate('Walking',2,0,0);
    this.animate("Standing", 0,0,0);
    this.animate("Punch", 0,1,2);
    this.animate("Kick", 0,2,2);
    this.animate('Jump',5,0,6);
    this.bind("Moved", this.movingAnimation);
    this.bind('EnterFrame', this.enterFrameHandler);
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
       this.isPlaying('Walking')){
      return false;
    }else{
      this.stop().animate("Standing",25,0);
    }
  },

  movingAnimation: function(movedata){
    this.animate('Walking',25,-1);
  },

  keyHandler: function(){
    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick') ||
       this.isPlaying('Jump')){
      return false;
    }

    if(this.isDown(88)){
        this.animate('Punch',10,0);
    }

    if(this.isDown(67)){
        this.animate('Kick',10,0);
    }

    if(this.isDown(32)){
        this.animate('Jump',10,0);
    }
  }

});

