Crafty.scene("main",(function() {
	//Crafty.scene only takes a function parameter. I've wrapped an object for our scene in a closure.
	//This gives us more state to work with. Returns an init function at the bottom.

	var scene = {

    renderOtherUsers: function(otherUsers){
      for(var user_id in otherUsers.val()){
        if(user_id != Crafty.player_id){
          this.renderUserSnapshot(otherUsers.child(user_id));
        }
      }
      // Render any new users who join in the future
      Firebase.child('users').on("child_added", $.proxy(this.renderUserSnapshot, this));
    },

    renderLocalPlayer: function(snapshot){
      this.renderUserSnapshot(snapshot);
      Firebase.child('users').once("value", $.proxy(this.renderOtherUsers, this));
    },


    renderUserSnapshot: function(snapshot){
      var remoteUser = Firebase.child('users').child(snapshot.name());
      if(Crafty('user_'+snapshot.name()).length === 0){ //only render the player once
        var player = Crafty.e("Player, Collision, WiredhitBox")
        .attr({
          w:140,
          h:138,
          z: 2
        })
        .collision([60,200], [140,200], [110,0], [80,0])
        .addComponent('user_'+snapshot.name());
        player.remote = remoteUser;

        //if its the local player publish events to remote
        if(snapshot.name() == Crafty.player_id){
          player.addComponent('PlayerControls');

          // update remote animation states on every frame
          player.bind('EnterFrame', function(){
            remoteUser.set({
              x: this.x,
              y: this.y,
              isPunching: this.isPunching,
              isKicking: this.isKicking,
              isJumping: this.isJumping,
              preJumpy: false
            });
          });

        }else{// its a remote user just listen and update locally
          remoteUser.on('value', function(snapshot){
            var state = snapshot.val();
            // only update x and y if they changed remotely
            // otherwise we will constantly trigger the users 'moved' handler
            // causing unexpected behavior
            if(state.x != player.x){
              player.x = state.x;
            }

            if(state.y != player.y){
              player.y = state.y;
            }

            var state = snapshot.val();
            player.isPunching = state.isPunching;
            player.isKicking = state.isKicking;
            player.isJumping = state.isJumping;
            player.preJumpy = state.preJumpy;
          });
        }
      }
    },

		init: function(){
      var remote = Firebase.child('users').child(Crafty.player_id);
      remote.once("value", $.proxy(this.renderLocalPlayer, this));
		}
	};

	return $.proxy(scene.init, scene); //Pass our scene.init function to crafty.scene
})());
