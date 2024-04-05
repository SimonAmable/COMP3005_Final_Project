function registerUser() {
    var firstName = document.getElementById('first_name').value
    var lastName = document.getElementById('last_name').value
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    var username = document.getElementById('username').value
    var phoneNumber = document.getElementById('phone_number').value

    //Create a data object to convert to a JSON string. It can then be sent as the request body
    var data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        username: username,
        phone_number: phoneNumber
    };

    //fetch API - send network request from the BROWSER! 
    //This sends a POST request to the server
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) //Turn object to JSON String
    })
    .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error:', error)
      });
}

function loginUser(event) {
    event.preventDefault()

    console.log("IN LOGIN USER")
    var email = document.getElementById('email_login').value
    var password = document.getElementById('password_login').value

    console.log('Client-side email:', email)
    console.log('Client-side password:', password)

    var data = {
        email: email,
        password: password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) //Turn object to JSON String
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else if (!response.ok) {
            throw new Error('Network response was not ok');
        } else {
            return response.text();
        }
    })
    .then(data => {      console.log('Success:', data)  })
    .catch((error) => {  console.error('Error:', error) });
}