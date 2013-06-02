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

    createDummy:function(){
        var player = Crafty.e("Player")
        .attr({
          x:50,
          y:0,
          z: 2
        })
        .addComponent('Collision, WiredHitBox')
        .addComponent('user_dummy');
        player.collision([10,7], [10,40], [30,40], [30,7]);

        player.punchbox = Crafty.e('PunchBox');
        player.punchbox.attr({
          x:player.x+25,
          y:player.y+16
        });
        player.attach(player.punchbox);

        player.kickbox = Crafty.e('KickBox');
        player.kickbox.attr({
          x:player.x+25,
          y:player.y+22
        });
        player.attach(player.kickbox);
    },


    renderUserSnapshot: function(snapshot){
      var remoteUser = Firebase.child('users').child(snapshot.name()),
          userState = (snapshot.val() === null) ? {} : snapshot.val();

      if(Crafty('user_'+snapshot.name()).length === 0){ //only render the player once
        var player = Crafty.e("Player")
        .attr({
          x: (typeof userState.x != 'undefined') ? userState.x : 0,
          y: (typeof userState.y != 'undefined') ? userState.y : 0,
          z: 0
        })
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
              isDamage: this.isDamage,
              isRecover: this.isRecover,
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
            player.isDamage = state.isDamagin;
            player.isRecover = state.isRecover;
            player.preJumpy = state.preJumpy;
          });
        }

        var player_name = Crafty.e('2D, DOM, Text, PlayerName')
                                .text("Player Name")
                                .textColor("#000000")
                                .textFont({size: "1px"})
                                .attr({
                                  x: player.x,
                                  y: (player.y+player.h) + 2,
                                  w: player.w*2
                                })
        player.attach(player_name);

      }
    },

		init: function(){
      //Crafty.background('resources/images/RiverCityRansomEX-RiverCity.png');
      var remote = Firebase.child('users').child(Crafty.player_id);
      remote.once("value", $.proxy(this.renderLocalPlayer, this));
//      this.createDummy();
		}
	};

	return $.proxy(scene.init, scene); //Pass our scene.init function to crafty.scene
})());
