document.addEventListener('DOMContentLoaded', function() {
  var registerButton = document.getElementById('register_button');
  var loginButton = document.getElementById('login_button');

  if (registerButton) {
      registerButton.addEventListener('click', registerUser);
  }

  if (loginButton) {
      loginButton.addEventListener('click', loginUser);
  }
});
