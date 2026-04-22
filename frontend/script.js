function togglePassword(id) {
  let input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
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

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let exists = users.some(user => user.email === email);

    if (exists) {
      error.innerText = "User already exists";
      return;
    }

    users.push({ name, email, password });
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

    let found = users.find(
      user => user.email === email && user.password === password
    );

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
  localStorage.setItem("company", company);
  window.location = "assessment.html";
}

function goToResume() {
  window.location = "resume.html";
}

function goBack() {
  window.location = "dashboard.html";
}



async function uploadResume() {
  let file = document.getElementById("file").files[0];

  if (!file) {
    alert("Select a file");
    return;
  }

  let form = new FormData();
  form.append("resume", file);

  document.getElementById("score").innerText = "Analyzing...";

  let res = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: form
  });

  let data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  document.getElementById("score").innerText = "Score: " + data.score;

  let strengths = document.getElementById("strengths");
  let weaknesses = document.getElementById("weaknesses");
  let suggestions = document.getElementById("suggestions");

  strengths.innerHTML = "";
  weaknesses.innerHTML = "";
  suggestions.innerHTML = "";

  data.strengths.forEach(item => {
    let li = document.createElement("li");
    li.innerText = item;
    strengths.appendChild(li);
  });

  data.weaknesses.forEach(item => {
    let li = document.createElement("li");
    li.innerText = item;
    weaknesses.appendChild(li);
  });

  data.suggestions.forEach(item => {
    let li = document.createElement("li");
    li.innerText = item;
    suggestions.appendChild(li);
  });
}

