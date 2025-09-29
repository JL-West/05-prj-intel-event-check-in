// Store attendees in an array
const attendees = [];
const maxAttendees = 50;

// Team counts
const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

// Get DOM elements
const checkInForm = document.getElementById("checkInForm");
const attendeeCountSpan = document.getElementById("attendeeCount");
const waterCountSpan = document.getElementById("waterCount");
const zeroCountSpan = document.getElementById("zeroCount");
const powerCountSpan = document.getElementById("powerCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const waterList = document.getElementById("waterList");
const zeroList = document.getElementById("zeroList");
const powerList = document.getElementById("powerList");

function updateDisplay() {
  attendeeCountSpan.textContent = attendees.length;
  waterCountSpan.textContent = teamCounts.water;
  zeroCountSpan.textContent = teamCounts.zero;
  powerCountSpan.textContent = teamCounts.power;
  // Update progress bar width
  const percent = (attendees.length / maxAttendees) * 100;
  progressBar.style.width = `${percent}%`;

  // Clear lists
  waterList.innerHTML = "";
  zeroList.innerHTML = "";
  powerList.innerHTML = "";

  // Add attendee names to each team list
  attendees.forEach(function (att) {
    const li = document.createElement("li");
    li.textContent = att.name;
    if (att.team === "water") {
      waterList.appendChild(li);
    } else if (att.team === "zero") {
      zeroList.appendChild(li);
    } else if (att.team === "power") {
      powerList.appendChild(li);
    }
  });
}

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const nameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (name === "" || team === "") {
    greeting.textContent = "Please enter your name and select a team.";
    return;
  }

  if (attendees.length >= maxAttendees) {
    greeting.textContent = "Check-in is full!";
    return;
  }

  // Prevent duplicate check-in by name (case-insensitive)
  const alreadyCheckedIn = attendees.some(function (att) {
    return att.name.toLowerCase() === name.toLowerCase();
  });
  if (alreadyCheckedIn) {
    greeting.textContent = `Welcome back, ${name}! You are already checked in.`;
    return;
  }

  // Add attendee
  attendees.push({ name: name, team: team });
  teamCounts[team]++;
  updateDisplay();
  greeting.textContent = `Thank you for checking in, ${name}!`;
  // Reset form
  nameInput.value = "";
  teamSelect.value = "";
});

// Initialize display
updateDisplay();
