/* temporary helpers */

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}

function generate_guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}


Crafty.scene("main",(function() {
	//Crafty.scene only takes a function parameter. I've wrapped an object for our scene in a closure.
	//This gives us more state to work with. Returns an init function at the bottom.

	var scene = {

    renderOtherUsers: function(otherUsers){
      for(var user_id in otherUsers.val()){
        if(user_id != global_state.guid){
          var remoteUser = global_state.users.child(user_id);
          var player = Crafty.e("Player, Collision")
          .attr({
            w:140,
            h:138,
            z: 2
          })
          .collision([60,200], [140,200], [110,0], [80,0]);

          remoteUser.on('value', function(snapshot){
            player.attr(snapshot.val());
          });
        }
      }
    },

		init: function(){
      mixpanel.track("New Game");
      Crafty.background("#FFFFFF");

      global_state.guid = generate_guid();
      var remote = global_state.users.child(global_state.guid);

			var player = Crafty.e("Player, PlayerControls, Collision")
			.attr({
        w:140,
        h:138,
				x:Crafty.viewport.width/2-50,
				y: Crafty.viewport.height - 200,
				z: 2
			})
			.collision([60,200], [140,200], [110,0], [80,0])
      .bind('EnterFrame', function(){
        remote.set({
          x: this.x,
          y: this.y
        });
      });

      global_state.users.on("value", this.renderOtherUsers);
		}
	};

	return $.proxy(scene.init, scene); //Pass our scene.init function to crafty.scene
})());
