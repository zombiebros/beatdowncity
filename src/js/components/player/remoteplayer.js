Crafty.c("RemotePlayer", {
  init: function(){
    this.remote.on('value', $.proxy(this.updateFromRemote, this));
  },

  updateFromRemote: function(snapshot){
    var state = snapshot.val();

    // only update x and y if they changed remotely
    // otherwise we will constantly trigger the users 'moved' handler
    // causing unexpected behavior
    if(state.x != this.x){
      this.x = state.x;
    }

    if(state.y != this.y){
      this.y = state.y;
    }

    this.isPunching = state.isPunching;
    this.isKicking = state.isKicking;
    this.isJumping = state.isJumping;
    this.isWalking = state.isWalking;
    this.isStanding = state.isStanding;
    this.isCrouching = state.isCrouching;
    this.isFrontDamageing = state.isFrontDamageing;
    this.isBackDamageing = state.isBackDamageing;
    this.isBackKOing = state.isBackKOing;
    this.isFrontKOing = state.isFrontKOing;
    this.isRecovering = state.isRecovering;
    this.isDowning = state.isDowning;
    this.preJumpy = state.preJumpy;
    this.email = state.email;
    this.stats = state.stats;
    this.player_name.text(this.email.match(/([_a-z0-9-]+(.[_a-z0-9-]+)*)@/)[1]);
  }
});