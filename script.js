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
const waterCard = document.querySelector(".team-card.water");
const zeroCard = document.querySelector(".team-card.zero");
const powerCard = document.querySelector(".team-card.power");

function updateDisplay() {
  attendeeCountSpan.textContent = attendees.length;
  // Update progress bar width
  const percent = (attendees.length / maxAttendees) * 100;
  progressBar.style.width = `${percent}%`;

  // Clear lists
  waterList.innerHTML = "";
  zeroList.innerHTML = "";
  powerList.innerHTML = "";

  // Group attendees by team
  const teamAttendees = {
    water: [],
    zero: [],
    power: [],
  };
  attendees.forEach(function (att) {
    teamAttendees[att.team].push(att.name);
  });

  // Add numbered attendee names to each team list
  [
    { team: "water", list: waterList },
    { team: "zero", list: zeroList },
    { team: "power", list: powerList },
  ].forEach(function (obj) {
    teamAttendees[obj.team].forEach(function (name, idx) {
      const li = document.createElement("li");
      li.textContent = `${idx + 1}. ${name}`;
      obj.list.appendChild(li);
    });
  });
}

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const nameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  // Animate the selected team card (after team is defined and validated)
  let cardToAnimate = null;
  if (team === "water") {
    cardToAnimate = waterCard;
  } else if (team === "zero") {
    cardToAnimate = zeroCard;
  } else if (team === "power") {
    cardToAnimate = powerCard;
  }
  if (cardToAnimate) {
    cardToAnimate.classList.remove("animate");
    // Force reflow to restart animation
    void cardToAnimate.offsetWidth;
    cardToAnimate.classList.add("animate");
  }

  if (name === "" || team === "") {
    greeting.textContent = "Please enter your name and select a team.";
    greeting.style.display = "block";
    return;
  }

  if (attendees.length >= maxAttendees) {
    greeting.textContent = "Check-in is full!";
    greeting.style.display = "block";
    return;
  }

  // Prevent duplicate check-in by name (case-insensitive)
  const alreadyCheckedIn = attendees.some(function (att) {
    return att.name.toLowerCase() === name.toLowerCase();
  });
  if (alreadyCheckedIn) {
    greeting.textContent = `Welcome back, ${name}! You are already checked in.`;
    greeting.style.display = "block";
    return;
  }

  // Add attendee
  attendees.push({ name: name, team: team });
  teamCounts[team]++;
  updateDisplay();
  // Personalized greeting
  let teamLabel = "";
  if (team === "water") {
    teamLabel = "Team Water Wise";
  } else if (team === "zero") {
    teamLabel = "Team Net Zero";
  } else if (team === "power") {
    teamLabel = "Team Renewables";
  }
  greeting.textContent = `Thank you for checking in, ${name}! You are now part of ${teamLabel}.`;
  greeting.style.display = "block";
  // Reset form
  nameInput.value = "";
  teamSelect.value = "";
});

// Initialize display
updateDisplay();
