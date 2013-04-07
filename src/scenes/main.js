Crafty.scene("main",(function() { 
	//Crafty.scene only takes a function parameter. I've wrapped an object for our scene in a closure.
	//This gives us more state to work with. Returns an init function at the bottom.

	Crafty.viewport.horizonx = Crafty.viewport.height / 4;

	var scene = {
		level: 1,
		enemyspawnrate: 200,
		chancetospawntank: 2,
		maxenemies: 5,

		gameoverHandler: function(){
			Crafty.pause();
			Crafty.audio.stop();
			Crafty.scene("main");
		},

		enterFrameHandler: function(frame){
			// cool
		},

		init: function(){
            mixpanel.track("New Game");
			if(Crafty.isPaused()){Crafty.pause();}

			Crafty.bind("EnterFrame", $.proxy(this.enterFrameHandler, this));

			var player = Crafty.e("Player, Collision")
			.attr({
				x:Crafty.viewport.width/2-50,
				y: Crafty.viewport.height - 200,
				z: 2
			})
			.collision([60,200], [140,200], [110,0], [80,0]);

		}
	};

	return $.proxy(scene.init, scene); //Pass our scene.init function to crafty.scene
})());
