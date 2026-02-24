
const apiKey = "ef98cfca3907e32b98a907f0dcb26183"; 

// Check login on load
window.onload = function() {
  if (localStorage.getItem("user")) {
    showDashboard();
  }
}

// Login
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    localStorage.setItem("user", username);
    showDashboard();
  } else {
    alert("Enter username and password");
  }
}

// Logout
function logout() {
  localStorage.removeItem("user");
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("login").style.display = "block";
}

// Show dashboard
function showDashboard() {
  document.getElementById("login").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  loadHistory();
}

// Get weather
async function getWeather(cityFromHistory) {
  const city = cityFromHistory || document.getElementById("city").value;

  if (!city) {
    alert("Enter city name");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      alert("City not found");
      return;
    }

    document.getElementById("weatherResult").innerHTML = `
      <p><strong>City:</strong> ${data.name}</p>
      <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
      <p><strong>Weather:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    `;

    saveHistory(city);

  } catch (error) {
    alert("Error fetching weather");
  }
}

// Save history
function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("history", JSON.stringify(history));
  }

  loadHistory();
}

// Load history
function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const historyList = document.getElementById("historyList");

  historyList.innerHTML = "";

  history.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => getWeather(city);
    historyList.appendChild(li);
  });
}