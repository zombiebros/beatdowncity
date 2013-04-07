Crafty.c("Player", {
    life: 100,
	
	init: function(){
     this.requires("2D, Canvas, player1, PlayerControls, SpriteAnimation");

     // this.bind("Damage",function(damage){
     //    if(damage > 0){
     //        Crafty.audio.play('pain',1);
     //    }
     // });
     // this.bind("Dead", this.dieHandler2);
     // this.bind("RestoreHP", this.RestoreHPHandler);
     // this.bind("Grenadecount", this.grenadeCount);
     // this.enteredviewport = true;
    }
});