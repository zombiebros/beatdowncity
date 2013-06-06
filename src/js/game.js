// if(typeof forge !== 'undefined'){
//   forge.logging.info("app starting !");

//   window.onerror = function(message, url, linenumber){
//     forge.logging.debug("JavaScript error: " + message + " on line " + linenumber + " for " + url+":"+linenumber);
//   };

//   console.log = function(){
//     var  args_array = Array.prototype.slice.call(arguments);
//     forge.logging.debug("Console.log: " + args_array.toString());
//   };
// }


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
    Crafty.player_email = user.email;
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
  scale = window.innerWidth / Crafty.stage.elem.clientWidth;
    //make sure it's not bigger than the height

    if (scale * Crafty.stage.elem.clientHeight > window.innerHeight) {
      scale = window.innerHeight / Crafty.stage.elem.clientHeight;
    }

    Crafty.scale = scale;

    var stageStyle = Crafty.stage.elem.style;
    stageStyle.transformOrigin = stageStyle.webkitTransformOrigin = stageStyle.mozTransformOrigin = "0 0";
    stageStyle.transform = stageStyle.webkitTransform = stageStyle.mozTransform = "scale("+scale+")";
}

function startGame(){
  $('#landing').remove();
  Crafty.init(200, 200).canvas.init();
  setScale();
  Crafty.addEvent(this, window, "resize", setScale);
  Crafty.background("#FFFFFF");
  Crafty.scene("main");
}

function authClientSuccess(user){
    // user authenticated with Firebase
    startGame();
}

function authClientLogout(){
  Crafty(Crafty('user_'+Crafty.player_id)[0]).loggedin = false;
  //user loged out
}

function authClientCreateUserHandler(error, user){
  if(!error){
    Crafty.player_id = user.id;
    Crafty.player_email = user.email;
    startGame();
  }else{
    alert("Error creating user");
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

// $(window).bind('beforeunload', function(){
//   var answer = confirm("Do you really want to leave Beatdown City?");
//   if(anwser === true){
//      Crafty(Crafty('user_'+Crafty.player_id)[0]).loggedin = false;
//      return true;
//   }
// });
