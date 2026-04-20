function togglePassword(id) {
  let input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

let signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.onsubmit = function (e) {
    e.preventDefault();

    let name = document.getElementById("signupName").value;
    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;
    let error = document.getElementById("signupError");

    error.innerText = "";

    if (name === "" || email === "" || password === "") {
      error.innerText = "Fill all fields";
      return;
    }
    if (password.length < 6) {
      error.innerText = "Password too short";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users"));
    if (!users) {
      users = [];
    }

    let exists = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        exists = true;
      }
    }
    if (exists) {
      error.innerText = "User already exists";
      return;
    }
    let user = {
      name: name,
      email: email,
      password: password
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful");
    window.location = "login.html";
  };
}

let loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = function (e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    let error = document.getElementById("loginError");

    error.innerText = "";

    let users = JSON.parse(localStorage.getItem("users"));
    if (!users) {
      error.innerText = "No users found";
      return;
    }
    let found = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email && users[i].password === password) {
        found = true;
      }
    }

    if (found) {
      localStorage.setItem("loggedInUser", email);
      window.location = "dashboard.html";
    } else {
      error.innerText = "Wrong email or password";
    }
  };
}

let userEmail = document.getElementById("userEmail");
if (userEmail) {
  let user = localStorage.getItem("loggedInUser");
  if (!user) {
    window.location = "login.html";
  } else {
    userEmail.innerText = user;
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location = "login.html";
}

function selectCompany(company) {
  alert("Starting preparation for " + company);
}