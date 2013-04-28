// Initialize Crafty
var global_state = {
  current_level: 0,
  loaded_maps: []
};

var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
stats.domElement.style.zIndex = 9000;
document.body.appendChild( stats.domElement );


$(function(){
	Crafty.init().canvas.init();
  Crafty.bind("EnterFrame", function(){
    stats.begin();
    stats.end();
  });
	Crafty.scene("main");
});
