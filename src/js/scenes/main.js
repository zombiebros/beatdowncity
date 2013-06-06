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
          player.addComponent('PlayerControls, LocalPlayer');
          player.email = Crafty.player_email;
          player.player_name.text(player.email.match(/([_a-z0-9-]+(.[_a-z0-9-]+)*)@/)[1]);

        }else{// its a remote user just listen and update locally
          player.addComponent('RemotePlayer');
        }
      }
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
    },

		init: function(){
      Crafty.e("FPS").FPS('frame', -1).attr({
        x: 0,
        y: 0
      }).css({
        'color': 'Black'
      });
      //Crafty.background('resources/images/RiverCityRansomEX-RiverCity.png');
      var remote = Firebase.child('users').child(Crafty.player_id);
      remote.once("value", $.proxy(this.renderLocalPlayer, this));
//      this.createDummy();
		}
	};

	return $.proxy(scene.init, scene); //Pass our scene.init function to crafty.scene
})());
