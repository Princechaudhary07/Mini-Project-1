// ================= PASSWORD VISIBILITY TOGGLE =================
// Toggles password input visibility between text and password type
function togglePassword(id) {
  let input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}


// ================= SIGNUP FORM HANDLER =================
// Handles user registration with validation and localStorage storage
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


// ================= LOGIN FORM HANDLER =================
// Handles user authentication by validating email and password against stored users
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


// ================= USER SESSION CHECK =================
// Verifies user is logged in and displays user email on dashboard
let userEmail = document.getElementById("userEmail");

if (userEmail) {
  let user = localStorage.getItem("loggedInUser");

  if (!user) {
    window.location = "login.html";
  } else {
    userEmail.innerText = user;
  }
}

// ================= LOGOUT FUNCTION =================
// Clears user session and redirects to login page
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location = "login.html";
}

// ================= BACK BUTTON FUNCTION =================
// Navigates back to the previous page
function goBack() {
  window.history.back();
}


// ================= NAVIGATION FUNCTIONS =================
// Handles navigation between different pages with data passing
function selectCompany(company) {
  localStorage.setItem("company", company);
  window.location = "assessment.html";
}

function goToResume() {
  window.location = "resume.html";
}



// ================= RESUME UPLOAD AND ANALYSIS =================
// Uploads resume file to backend API for analysis and displays feedback
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


// ================= TEST NAVIGATION =================
// Redirects to appropriate test page based on test type
function startTest(type) {
  if (type === "aptitude") {
    window.location = "aptitude.html";
  } else if (type === "coding") {
    window.location = "coding.html";
  }
}

// ================= INITIALIZATION ON PAGE LOAD =================
// Sets company name from localStorage when page loads
// ================= COMPANY NAME =================
window.onload = function () {
  let company = localStorage.getItem("company");

  let companyName = document.getElementById("companyName");
  if (companyName && company) {
    companyName.innerText = company + " Assessment";
  }
};

// ================= QUESTIONS =================
let questions = [

  // ===== OOPS (5) =====
  {
    q: "Which principle allows using the same function name with different parameters?",
    options: ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"],
    answer: "Polymorphism"
  },
  {
    q: "Which concept hides internal details and shows only functionality?",
    options: ["Inheritance", "Encapsulation", "Abstraction", "Polymorphism"],
    answer: "Abstraction"
  },
  {
    q: "Which keyword is used to inherit a class in Java?",
    options: ["this", "super", "extends", "implements"],
    answer: "extends"
  },
  {
    q: "Which OOP concept binds data and methods together?",
    options: ["Encapsulation", "Abstraction", "Inheritance", "Overloading"],
    answer: "Encapsulation"
  },
  {
    q: "Which type of inheritance is not supported in Java?",
    options: ["Single", "Multiple", "Multilevel", "Hierarchical"],
    answer: "Multiple"
  },

  // ===== DBMS (5) =====
  {
    q: "What does DBMS stand for?",
    options: ["Data Base Management System", "Database Managing System", "Data Management System", "None"],
    answer: "Data Base Management System"
  },
  {
    q: "Which normal form removes partial dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: "2NF"
  },
  {
    q: "Which SQL command is used to retrieve data?",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    answer: "SELECT"
  },
  {
    q: "Which key uniquely identifies a record?",
    options: ["Foreign Key", "Primary Key", "Candidate Key", "Super Key"],
    answer: "Primary Key"
  },
  {
    q: "Which operation combines rows from two tables?",
    options: ["JOIN", "SELECT", "WHERE", "GROUP BY"],
    answer: "JOIN"
  },

  // ===== OS (5) =====
  {
    q: "Which scheduling algorithm uses time quantum?",
    options: ["FCFS", "SJF", "Round Robin", "Priority"],
    answer: "Round Robin"
  },
  {
    q: "What is the main function of an OS?",
    options: ["Compile programs", "Manage hardware", "Write code", "Design UI"],
    answer: "Manage hardware"
  },
  {
    q: "Which memory is fastest?",
    options: ["RAM", "ROM", "Cache", "Hard Disk"],
    answer: "Cache"
  },
  {
    q: "Deadlock occurs when?",
    options: ["Processes wait indefinitely", "Memory is full", "CPU is idle", "None"],
    answer: "Processes wait indefinitely"
  },
  {
    q: "Which is not an OS?",
    options: ["Linux", "Windows", "Oracle", "MacOS"],
    answer: "Oracle"
  },

  // ===== CN (5) =====
  {
    q: "What does IP stand for?",
    options: ["Internet Protocol", "Internal Protocol", "Input Protocol", "None"],
    answer: "Internet Protocol"
  },
  {
    q: "Which layer handles routing?",
    options: ["Transport", "Network", "Data Link", "Application"],
    answer: "Network"
  },
  {
    q: "Which protocol is used for web browsing?",
    options: ["FTP", "SMTP", "HTTP", "TCP"],
    answer: "HTTP"
  },
  {
    q: "Which device connects networks?",
    options: ["Switch", "Hub", "Router", "Repeater"],
    answer: "Router"
  },
  {
    q: "Which topology has a central node?",
    options: ["Bus", "Ring", "Star", "Mesh"],
    answer: "Star"
  },

  // ===== VERBAL REASONING (5) =====
  {
    q: "Find synonym of 'Happy'",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    answer: "Joyful"
  },
  {
    q: "Choose the correct spelling",
    options: ["Recieve", "Receive", "Receeve", "Recive"],
    answer: "Receive"
  },
  {
    q: "Antonym of 'Fast'",
    options: ["Quick", "Rapid", "Slow", "Swift"],
    answer: "Slow"
  },
  {
    q: "Fill in the blank: She ___ going to school.",
    options: ["is", "are", "am", "be"],
    answer: "is"
  },
  {
    q: "Choose correct sentence",
    options: [
      "He go to school",
      "He goes to school",
      "He going school",
      "He gone school"
    ],
    answer: "He goes to school"
  },

  // ===== QUANT (5) =====
  {
    q: "15 + 25 = ?",
    options: ["30", "35", "40", "45"],
    answer: "40"
  },
  {
    q: "20% of 200 = ?",
    options: ["20", "30", "40", "50"],
    answer: "40"
  },
  {
    q: "Square of 12 = ?",
    options: ["124", "144", "154", "164"],
    answer: "144"
  },
  {
    q: "If x = 5, then 2x + 3 = ?",
    options: ["10", "13", "15", "8"],
    answer: "13"
  },
  {
    q: "50 ÷ 5 = ?",
    options: ["5", "10", "15", "20"],
    answer: "10"
  }

];





// ================= QUIZ STATE VARIABLES =================
// Tracks current question index, accumulated score, and remaining time
let index = 0;
let score = 0;
let time = 1800; // 30 min

// ================= QUIZ FUNCTIONS =================
// Loads and displays current question with options
function loadQuestion() {
  let q = questions[index];

  let questionEl = document.getElementById("question");
  let optionsEl = document.getElementById("options");

  if (!questionEl || !optionsEl) return;

  questionEl.innerText = q.q;

  let optionsHTML = "";
  q.options.forEach(opt => {
    optionsHTML += `
      <div>
        <input type="radio" name="opt" value="${opt}">
        ${opt}
      </div>
    `;
  });

  optionsEl.innerHTML = optionsHTML;
}

// Moves to next question, validates answer, and updates score
function nextQuestion() {
  let selected = document.querySelector('input[name="opt"]:checked');

  if (selected && selected.value === questions[index].answer) {
    score++;
  }

  index++;

  if (index < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

// Displays final score when quiz is completed
function showResult() {
  let quizBox = document.getElementById("quizBox");
  let result = document.getElementById("result");

  if (quizBox) quizBox.style.display = "none";

  if (result) {
    result.style.display = "block";
    result.innerText = `Your Score: ${score}/${questions.length}`;
  }
}

// ================= TIMER FUNCTIONALITY =================
// Countdown timer that updates every second and auto-submits when time runs out
setInterval(() => {
  let timerEl = document.getElementById("timer");

  if (!timerEl) return;

  if (time > 0) {
    time--;

    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    let formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    timerEl.innerText = "Time: " + formatted;
  } else {
    showResult();
  }
}, 1000);


// ================= INITIAL QUIZ SETUP =================
// Loads first question when quiz page is loaded
if (document.getElementById("question")) {
  loadQuestion();
}