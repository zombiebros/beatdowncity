Crafty.c("Player", {
  life: 100,

  init: function(){
   this.requires("2D, Canvas, player1, SpriteAnimation");
   this.animate('Walking',2,0,0);
   this.animate("Standing", 0,0,0);
   this.animate("Punch", 0,1,2);
   this.animate("Kick", 0,2,2);
   this.animate('Jump',5,0,5);
   this.animate('Land',6,0,6);
 }
});