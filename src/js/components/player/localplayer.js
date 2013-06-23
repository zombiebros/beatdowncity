Crafty.c("LocalPlayer",{
  init: function(){
    // update remote animation states on every frame
    this.bind('EnterFrame', $.proxy(this.updateRemote, this));

    var amOnline = new Firebase("https://beatdowncity.firebaseio.com/.info/connected");
    this.presenceRef = new Firebase("https://beatdowncity.firebaseio.com/users/"+Crafty.player_id+"/presence");
    amOnline.on('value', $.proxy(this.presenceHandler, this));
  }, 

  presenceHandler: function(snapshot){
    var _self = this;
    console.log("presence handler");
    if(snapshot.val()){
      this.presenceRef.onDisconnect().set('offline', function(success){
        _self.presence = 'offline';
      });

      this.presenceRef.set('online', function(){
        _self.presence = 'online';
      });
    }
  },

  updateRemote: function(){
      this.remote.set({
        x: this.x,
        y: this.y,
        dir: this.dir,
        email: Crafty.player_email,
        isPunching: this.isPunching,
        isKicking: this.isKicking,
        isJumping: this.isJumping,
        isCrouching: this.isCrouching,
        isFrontKOing: this.isFrontKOing,
        isBackKOing: this.isBackKOing,
        isDowning: this.isDowning,
        isWalking: this.isWalking,
        isStanding: this.isStanding,
        isFrontDamageing: this.isFrontDamageing,
        isBackDamageing: this.isBackDamageing,
        isRecovering: this.isRecovering,
        preJumpY: this.preJumpY,
        presence: 'online',
        stats: this.stats
      });
    }
});