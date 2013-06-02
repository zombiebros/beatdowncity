Crafty.c("Player", {
  /*
  * Player Game Stats
  */
  stats:{
    //statname:      [current, max]
    punch:           [15, 63],
    kick:            [15, 63],
    weapon:          [15, 63],
    throwing:        [15, 63],
    agility:         [15, 63],
    defense:         [15, 63],
    strength:        [15, 63],
    will_power:      [15, 63],
    current_life:    [63, 127],
    max_life:        [63, 127]
  },

  /*
  * Player Sprite animations
  */
  animation_map:{
    "Walking":       [2,0,0],
    "Standing":      [0,0,0],
    "Punch":         [0,1,2],
    "Kick":          [0,2,2],
    'Jump':          [5,0,5],
    'Land':          [6,0,6],
    'Damage':        [0,4,0],
    'Recover':       [1,4,0]
  },

  isPunching: false,
  isKicking: false,
  isRunning: false,
  isJumping: false,
  isDamage: false,
  isRecover: false,

  jumpHeight: 150,
  jumpSpeed: 10,
  preJumpY: null,

  init: function(){
   this.requires("2D, Canvas, player1, SpriteAnimation, Collision, WiredHitBox");
   this.collision([10,7], [10,40], [30,40], [30,7]);
   this.bindHitBoxes();
   this.animate('Walking',2,0,0);
   this.animate("Standing", 0,0,0);
   this.animate("Punch", 0,1,2);
   this.animate("Kick", 0,2,2);
   this.animate('Jump',5,0,5);
   this.animate('Land',6,0,6);
   this.animate('Damage',0,4,0);
   this.animate('Recover',1,4,0);
   //this.registerAnimations();
   this.bind("Move", $.proxy(this.changeDirection, this));
   this.bind("Move", $.proxy(this.movingAnimation, this));
   this.bind('EnterFrame', $.proxy(this.enterFrameHandler, this));
   //this.bind("Change", $.proxy(this.animationChange, this));
   this.animate("Standing",1,1).stop();
 },

 /*
 * Iterate over our animation map and call `this.animate` with the name and frames
 */
 // registerAnimations: function(){
 //  var args;
 //  for(var animation in this.animation_map){
 //    args = this.animation_map[animation];
 //    args.unshift(animation);
 //    this.animate.apply(this, args);
 //  }
 // },


 bindHitBoxes: function(){
  var _self = this;
  this.punchbox = Crafty.e('AttackBox');

  this.punchbox.attr({
    x:_self.x+25,
    y:_self.y+16,
    w:10,
    h:10
  })
  .addComponent('Collision, WiredHitBox')
  .onHit("Player", $.proxy(this.punchbox.hitPlayerHandler, this.punchbox));
  this.attach(this.punchbox);


  this.kickbox = Crafty.e('AttackBox');
  this.kickbox.hitAnimation = "Kick";
  this.kickbox.hitFrame = 3;
  this.kickbox.mirror_x = 3;
  this.kickbox.attr({
    x:_self.x+25,
    y:_self.y+22,
    w:13,
    h:10
  })
  .addComponent('Collision, WiredHitBox')
  .onHit("Player", $.proxy(this.kickbox.hitPlayerHandler, this.kickbox));
  this.attach(this.kickbox);
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
        try{
          this.punchbox.unmirror();
          this.kickbox.unmirror();
        }catch(ex){
          console.log("Exception:", ex.message);
          console.log("Couldn't update hitboxes haven't rendered yet");
        }
    }else if(this._x < old_pos._x){
        this.flip("X");
        try{
          this.punchbox.mirror();
          this.kickbox.mirror();
        }catch(ex){
          console.log("Exception:", ex.message);
          console.log("Couldn't update hitboxes haven't rendered yet");
        }
    }
  },

  enterFrameHandler: function(frameNum){
    // for(var animation in this.animation_map){
    //   if(animation != 'Standing' && this.isPlaying(animation)){
    //     return false;
    //   }
    // }

    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick') ||
       this.isPlaying('Jump') ||
       this.isPlaying('Damage') ||
       this.isPlaying('Recover') ||
       this.isPlaying('Land')){
      return false;
    }

    if(this.isRecover && !this.isPlaying('Recover')){
      return this.recover();
    }

    if(this.isDamage && !this.isPlaying('Damage')){
      return this.damage();
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

    if(this.isPunching && !this.isPlaying('Punch')){
      return this.punch();
    }

    if(this.isKicking && !this.isPlaying('Punch')){
      return this.kick();
    }

    if(this.isPlaying('Walking')){
      return;
    }

    if(this._currentReelId !== 'Standing' ){
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
  },

  //Apply damage amount and trigger animation
  applyDamage:function(amount){
    console.log("Applying Damage");
    this.isDamage = true;
  },

  recover: function(){
    this.stop();
    this.animate('Recover', 10, 0).bind('AnimationEnd', function(reel){
      this.isRecover = false;
    });
  },

  // Play damage animation
  damage: function(){
    console.log("playing damage!");
    var _self = this;
    this.stop();
    this.animate('Damage', 10, 0).bind('AnimationEnd', function(reel){
      this.isDamage = false;
      this.isRecover = true;
    });
  }

});