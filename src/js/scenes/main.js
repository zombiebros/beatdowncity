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
        if(user_id != Crafty.player_id){
          this.renderUserSnapshot(otherUsers.child(user_id));
        }
      }
    },


    renderUserSnapshot: function(snapshot){
          var remoteUser = Firebase.child('users').child(snapshot.name());
          var player = Crafty.e("Player, Collision")
          .attr({
            w:140,
            h:138,
            z: 2
          })
          .collision([60,200], [140,200], [110,0], [80,0]);

          /* if its the local player */
          if(snapshot.name() == Crafty.player_id){
            player.addComponent('PlayerControls');
            player.bind('EnterFrame', function(){
              remoteUser.set({
                x: this.x,
                y: this.y
              });
            });
          }else{
            remoteUser.on('value', function(snapshot){
              player.attr(snapshot.val());
            });
          }
    },

		init: function(){
      var remote = Firebase.child('users').child(Crafty.player_id);

      Firebase.child('users').once("value", $.proxy(this.renderOtherUsers, this));
      Firebase.child('users').on("child_added", $.proxy(this.renderUserSnapshot, this));
      remote.set({
        x:Crafty.viewport.width/2-50,
        y: Crafty.viewport.height - 200
      });
		}
	};

	return $.proxy(scene.init, scene); //Pass our scene.init function to crafty.scene
})());
