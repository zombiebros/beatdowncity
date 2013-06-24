Crafty.c("Player", {
  isPunching: false,
  isKicking: false,
  isRunning: false,
  isJumping: false,
  isStanding: false,
  isCrouching: false,
  isFrontDamageing: false,
  isBackDamageing: false,
  isBackKOing: false,
  isFrontKOing: false,
  isRecovering: false,
  isWalking: false,
  isDowning: false,

  // Velocity
  xV:0,
  yV:0,

  // Direction
  dir:1,

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
    ["Stand",0,0,0],
    ["Walk",2,0,0],
    ["FinKick",3,2,3],
    ["FinPunch",6,1,8],
    ['Crouch',6,0,6],
    ['Jump',5,0,5],
    ["Punch",0,1,2],
    ["Kick",0,2,2],
    ['Recover',1,4,1],
    ['FrontKO',3,4,3],
    ['BackKO', 4,4,4],
    ['BackDamage',0,4,0],
    ['FrontDamage',2,4,2],
    ['Down',7,4,7]
  ];

  this.collision_map ={
    "Standing": [[10,7], [10,40], [30,40], [30,7]],
    "Downing": [[0,22], [0,40], [35,40], [35,22]]
  }


   this.requires("2D, Canvas, player1, SpriteAnimation, Collision");
   //this.requires("WiredHitBox");
   this.collision.apply(this, this.collision_map["Standing"]);
   this.bindHitBoxes();
   this.registerAnimations();
   this.bind('EnterFrame', $.proxy(this.enterFrameHandler, this));
   this.animate("Stand",1,1).stop();


   this.player_name = Crafty.e('2D, DOM, Text, PlayerName')
                           .textColor("#000000")
                           .textFont({size: "1px"})
                           .attr({
                            x: this.x,
                            y: (this.y+this.h) + 2,
                            w: this.w*2
                           });
   this.attach(this.player_name);
   this.addComponent('Movement, Jump');
   this.shadow = Crafty.e('Shadow').shadow(this);
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

 /*
 *
 * Convienece function. Returns true if the players in a state where they should
 * Remain stationary 
 *
 */
 isStaticAnimating: function(){
  return this.isPunching       ||
         this.isKicking        ||
         this.isFrontDamageing ||
         this.isBackDamageing  ||
         this.isFrontKOing     ||
         this.isDowning        ||
         this.isRecovering     ||
         this.isBackKOing;
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

  enterFrameHandler: function(frameNum){

    var ani = this.animation_map.length,
        curani;
    for(var i=ani; i--;){ //reverse iterate over the animation map
      curani = this.animation_map[i][0];

      if(curani === 'Standing'){
        continue;
      }

      // If theres an animation playing do return
      if(this.isPlaying(curani)){
        return false;
      }

      // If the user state is set and the animations not playing,
      // call the method to play it
      if(this['is'+curani+'ing'] === true &&
         !this.isPlaying(curani)){
        return this[curani.toLowerCase()]();
      }

    }

  },

  jump: function(){
    return this.animate('Jump', 1, 0);
  },

  stand: function(){
    this.stop();
    return this.animate('Stand', 1, 0);
  },

  down: function(){
    this.animate('Down', 50, 1).bind('AnimationEnd', function(){
      this.isDowning = false;
      this.isRecovering = true;
      this.collision.apply(this, this.collision_map['Standing']);
      this.removeComponent('PickUpable');
    });
    this.addComponent('PickUpable');
    this.collision.apply(this, this.collision_map['Downing']);
    return;
  },

  crouch: function(){
    this.isJumping = false;
    this.stop();
    this.animate('Crouch',1,1).bind('AnimationEnd', function(){
      this.isCrouching = false;
    });
    return;
  },

  kick: function(){
    this.stop();
    var ani = this.animate('Kick',15,0);
        ani.bind('AnimationEnd', function(reel){
          this.isKicking = false;
        });
    return;
  },

  walk: function(){
    this.animate('Walk',15, 0);
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
    if(this.isBackDamageing === true ||
       this.isFrontDamageing === true ||
       this.isFrontKOing === true ||
       this.isBackKOing === true){
      return false;
    }
    this.stats.energy[0] -= amount;
    this["is"+side+"Damageing"] = true;
  },

  recover: function(){
    this.animate('Recover', 20, 0).bind('AnimationEnd', function(reel){
      this.isRecovering = false;
      this.stop();
    });
  },

  frontdamage: function(){
    this.damage('Front');
  },

  backdamage: function(){
    this.damage('Back');
  },

  frontko: function(){
    this.ko('Front');
  },

  backko: function(){
    this.ko('Back');
  },

  ko: function(side){
    if(this.isBackDamageing === true ||
       this.isFrontDamageing === true ||
       this.isFrontKOing === true ||
       this.isBackKOing === true ||
       this.isDowning === true){
      return false;
    }

    var _self = this;
    side = (typeof side === 'undefined') ? 'Front' : side;
    this['is'+side+"KOing"] = true;
    this.animate(side+"KO", 1, -1);
    this.startJump(30, -0.2);
  },

  // Play damage animation
  damage: function(side){
    var _self = this;

    side = (typeof side === 'undefined') ? 'Front' : side;

    this.animate(side+'Damage', 15, 0).bind('AnimationEnd', function(reel){
      this['is'+side+'Damageing'] = false;
      this.stop();
      if(this.stats.energy[0] <= this.stats.max_energy[0] / 2){
        this.isRecovering = true;
      }
    });
  }

});