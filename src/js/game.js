// Initialize Crafty
var Firebase = new Firebase('https://beatdowncity.firebaseIO.com/');
var authClient = new FirebaseAuthClient(Firebase, authClientHandler);

console.log("forge.display", forge.display);

var boundsWidth = 1024;
var boundsHeight = 576;
var baseWidth = window.innerWidth * (boundsHeight / window.innerHeight); //864
var baseHeight = boundsHeight; //576
var scale = window.innerHeight / baseHeight; //1


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

function startGame(){
  $('#landing').remove();
  var stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 9000;
  document.body.appendChild( stats.domElement );
  Crafty.init(boundsWidth, boundsHeight).canvas.init();
  Crafty.viewport.scale(scale);
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
