Crafty.c("Player", {
  isPunching: false,
  isKicking: false,
  isRunning: false,
  isJumping: false,
  isLanding: false,
  isFrontDamage: false,
  isBackDamage: false,
  isRecover: false,

  init: function(){
  /*
  * Player Game Stats
  */
  this.stats = {
    //statname:      [current, max]
    punch:           [15, 63],
    kick:            [15, 63],
    weapon:          [15, 63],
    throwing:        [15, 63],
    agility:         [15, 63],
    defense:         [15, 63],
    strength:        [15, 63],
    will_power:      [15, 63],
    energy:          [63, 127],
    max_energy:      [63, 127]
  };

  /*
  * Player Sprite animations
  * reverse ordered for priority
  */
  this.animation_map = [
    ["Standing",0,0,0],
    ["Walking",2,0,0],
    ["Punch",0,1,2],
    ["Kick",0,2,2],
    ["FinKick",3,2,3],
    ["FinPunch",6,1,8],
    ['Jump',5,0,5],
    ['Land',6,0,6],
    ['Recover',1,4,1],
    ['BackDamage',0,4,0],
    ['FrontDamage',2,4,2],
    ['Down',7,4,7]
  ];


   this.requires("2D, Canvas, player1, SpriteAnimation, Collision");
//   this.requires("WiredHitBox");
   this.collision([10,7], [10,40], [30,40], [30,7]);
   this.bindHitBoxes();
   this.registerAnimations();
   this.bind("Move", $.proxy(this.changeDirection, this));
   this.bind("Move", $.proxy(this.movingAnimation, this));
   this.bind('EnterFrame', $.proxy(this.enterFrameHandler, this));
   //this.bind("Change", $.proxy(this.animationChange, this));
   this.animate("Standing",1,1).stop();
 },

 /*
 * Iterate over our animation map and call `this.animate` 
 * with the name and frames saves some redundant code
 */
 registerAnimations: function(){
     var ani = this.animation_map.length;
     for(var i=ani; i--;){
        this.animate.apply(this,this.animation_map[i]);
     }
 },


 bindHitBoxes: function(){
  var _self = this;
  this.punchbox = Crafty.e('AttackBox');

  this.punchbox.attr({
    x:_self.x+25,
    y:_self.y+16,
    w:10,
    h:10
  })
  .addComponent('Collision')
//.addComponent('WiredHitBox')
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
  .addComponent('Collision')
//  .addComponent('WiredHitBox')
  .onHit("Player", $.proxy(this.kickbox.hitPlayerHandler, this.kickbox));
  this.attach(this.kickbox);
 },

 movingAnimation: function(old_pos){
  if(!this.isPlaying('Walking') &&
     (!this.isJumping && !this.isLanding)){
    console.log("walkin");
    this.animate('Walking',50, 1);
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
    // var ani = this.animation_map.length;
    // for(var i=ani; i--;){
    //   if(this.animation_map[i][0] === 'Standing'){
    //     continue;
    //   // If theres an animation playing do return
    //   }else if(this.isPlaying(this.animation_map[i][0])){
    //     return false;
    //   // If the user stat is set and the animations not playing,
    //   // call the method to play it
    //   }else if(this['is'+this.animation_map[i][0]] === true &&
    //            !this.isPlaying(this.animation_map[i][0])){
    //     return this[this.animation_map[i][0].toLowerCase()];
    //   }
    // }

    if(this.isPlaying('Punch') ||
       this.isPlaying('Kick') ||
       this.isPlaying('FinPunch') ||
       this.isPlaying('FinKick') ||
       this.isPlaying('FrontDamage') ||
       this.isPlaying('BackDamage') ||
       this.isPlaying('Recover')){
      return false;
    }

    if(this.isRecover === true && !this.isPlaying('Recover')){
      return this.recover();
    }

    if(this.isFrontDamage === true && !this.isPlaying('FrontDamage')){
      return this.frontdamage();
    }

    if(this.isBackDamage === true && !this.isPlaying('BackDamage')){
      return this.backdamage();
    }

    // if(this.isJumping && !this.isPlaying('Jump')){
    //     console.log("should play jump animation");
    //     return this.animate('Jump',1,-1);
    //     // if((this.y - this.jumpSpeed) <= (this.preJumpY - this.jumpHeight)){
    //     //   this.isJumping = false;
    //     //   this.isLanding = true;
    //     // }
    //     // return this.y-= this.jumpSpeed;
    // }

    // if(this.isLanding === true && !this.isPlaying('Land')){
    //   return this.animate('Land', 2, -1);
    // //   if((this.y + this.jumpSpeed) >= this.preJumpY){
    // //     this.animate('Land', 2, -1);
    // //     this.isLanding = false;
    // //     this.y = this.preJumpY;
    // //     this.preJumpY = false;
    // //     return;
    // //   }else{
    // //     return this.y+= this.jumpSpeed;
    // //   }
    // }

    if(this.isPunching === true && !this.isPlaying('Punch')){
      return this.punch();
    }

    if(this.isKicking === true && !this.isPlaying('Punch')){
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
  applyDamage:function(amount, side){
    if(this.isBackDamage === true ||
       this.isFrontDamage === true){
      return false;
    }
    console.log("Applying Damage", this.stats);
    this.stats.energy[0] -= amount;
    this["is"+side+"Damage"] = true;
  },

  recover: function(){
    this.animate('Recover', 20, 0).bind('AnimationEnd', function(reel){
      this.isRecover = false;
      this.stop();
    });
  },

  frontdamage: function(){
    this.damage('Front');
  },

  backdamage: function(){
    this.damage('Back');
  },

  // Play damage animation
  damage: function(side){
    var _self = this;

    side = (typeof side === 'undefined') ? 'Front' : side;

    this.animate(side+'Damage', 10, 0).bind('AnimationEnd', function(reel){
      this['is'+side+'Damage'] = false;
      this.stop();
      if(this.stats.energy[0] <= this.stats.max_energy[0] / 2){
        this.isRecover = true;
      }
    });
  }

});