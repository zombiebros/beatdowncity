// Initialize Crafty
var Firebase = new Firebase('https://beatdowncity.firebaseIO.com/');
var authClient = new FirebaseAuthClient(Firebase, authClientHandler);

function authClientHandler(error, user){
  console.log("authClientHandler", error, user);
  if (error) {
    authClientError(error, user);
  } else if (user) {
    console.log("auth client success?", user);
    Crafty.player_id = user.id;
    authClientSuccess(user);
  } else {
    authClientLogout();
  }
}

function authClientError(error, user){
  // an error occurred while attempting login
  console.log("login error", error);
}

function startGame(){
  $('#landing').remove();
  var stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 9000;
  document.body.appendChild( stats.domElement );
  Crafty.init().canvas.init();
  Crafty.background("#FFFFFF");
  Crafty.bind("EnterFrame", function(){
    stats.begin();
    stats.end();
  });
  Crafty.scene("main");
}

function authClientSuccess(user){
    // user authenticated with Firebase
    console.log("user authenticated success", user);
    startGame();
}

function authClientLogout(){
  //user loged out
}

function authClientCreateUserHandler(error, user){
  console.log("auth client create user handler", error, user);
  if(!error){
    console.log("user created successfully", user);
    Crafty.player_id = user.id;
    startGame();
  }else{
    console.log("error creating user", error);
  }
}

function signupSubmit(event){
  console.log('signup');
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
