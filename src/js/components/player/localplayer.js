Crafty.c("LocalPlayer",{
  init: function(){
    // update remote animation states on every frame
    this.bind('EnterFrame', $.proxy(this.updateRemote, this));
  },

  updateRemote: function(){
      this.remote.set({
        x: this.x,
        y: this.y,
        email: Crafty.player_email,
        isPunching: this.isPunching,
        isKicking: this.isKicking,
        isJumping: this.isJumping,
        isLanding: this.isLanding,
        isCrouching: this.isCrouching,
        isFrontKOing: this.isFrontKOing,
        isBackKOing: this.isBackKOing,
        isDowning: this.isDowning,
        isFrontDamageing: this.isFrontDamageing,
        isBackDamageing: this.isBackDamageing,
        isRecovering: this.isRecovering,
        loggedin: true,
        preJumpY: this.preJumpY,
        stats: this.stats
      });
    }
});