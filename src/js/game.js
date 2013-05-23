if(typeof forge !== 'undefined'){
  forge.logging.info("app starting !");

  window.onerror = function(message, url, linenumber){
    forge.logging.debug("JavaScript error: " + message + " on line " + linenumber + " for " + url+":"+linenumber);
  };

  console.log = function(){
    var  args_array = Array.prototype.slice.call(arguments);
    forge.logging.debug("Console.log: " + args_array.toString());
  };
}


// Initialize Crafty
var Firebase = new Firebase('https://beatdowncity.firebaseIO.com/');
var authClient = new FirebaseAuthClient(Firebase, authClientHandler);


var boundsWidth = 200;
var boundsHeight = 200;
var baseWidth = window.innerWidth * (boundsHeight / window.innerHeight); //864
var baseHeight = boundsHeight; //576
var scale = window.innerHeight / baseHeight; //1
Crafty.scale = scale;

// console.log("whats the window sizes",
//   window.innerHeight, window.innerWidth,
//   window.clientHeight, window.clientWidth);

// console.log("whats the generated sizes",
//   boundsWidth, boundsHeight,
//   baseWidth, baseHeight);

// console.log("view scale", scale);

function authClientHandler(error, user){
  if (error) {
    authClientError(error, user);
  } else if (user) {
    Crafty.player_id = user.id;
    authClientSuccess(user);
  } else {
    authClientLogout();
  }
}

function authClientError(error, user){
  // an error occurred while attempting login
  alert(" an error occured while logging in");
}

function setScale(){
  console.log("setting scale");
  scale = window.innerWidth / Crafty.stage.elem.clientWidth;
    //make sure it's not bigger than the height

    console.log("scale height check", Crafty.stage.elem.clientHeight,
      window.innerHeight, window.clientHeight,
      scale * Crafty.stage.elem.clientHeight);

    if (scale * Crafty.stage.elem.clientHeight > window.innerHeight) {
      scale = window.innerHeight / Crafty.stage.elem.clientHeight;
    }

    Crafty.scale = scale;
    console.log("scale ==", scale);

    var stageStyle = Crafty.stage.elem.style;
    stageStyle.transformOrigin = stageStyle.webkitTransformOrigin = stageStyle.mozTransformOrigin = "0 0";
    stageStyle.transform = stageStyle.webkitTransform = stageStyle.mozTransform = "scale("+scale+")";
}

function startGame(){
  $('#landing').remove();
  var stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 9000;
  document.body.appendChild( stats.domElement );
  Crafty.init(200, 200).canvas.init();
  //setScale();
  //Crafty.addEvent(this, window, "resize", setScale);
  Crafty.background("#FFFFFF");
  Crafty.bind("EnterFrame", function(){
    stats.begin();
    stats.end();
  });
  Crafty.scene("main");
}

function authClientSuccess(user){
    // user authenticated with Firebase
    startGame();
}

function authClientLogout(){
  //user loged out
}

function authClientCreateUserHandler(error, user){
  if(!error){
    Crafty.player_id = user.id;
    startGame();
  }else{
    alert("Error creating usere");
  }
}

function signupSubmit(event){
  event.preventDefault();
  var $form = $(event.target),
      $email = $form.find('#email'),
      $password = $form.find('#password');

  authClient.createUser($email.val(), $password.val(), authClientCreateUserHandler);
  return false;
}

function loginSubmit(event){
  event.preventDefault();
  var $form = $(event.target),
      $email = $form.find('#email'),
      $password = $form.find('#password');

  authClient.login('password', {
    email: $email.val(),
    password: $password.val()
  });
  return false;
}

$(function(){
  $('#signup').submit(signupSubmit);
  $('#login').submit(loginSubmit);
});
