// Reset button logic
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', function () {
    if (confirm('Are you sure you want to reset all attendance data?')) {
      attendees = [];
      teamCounts = { water: 0, zero: 0, power: 0 };
      localStorage.removeItem('attendees');
      localStorage.removeItem('teamCounts');
      updateDisplay();
      greeting.textContent = 'Attendance has been reset.';
      greeting.style.display = 'block';
    }
  });
}
// Store attendees in an array
let attendees = [];

// Try to load from localStorage
if (localStorage.getItem('attendees')) {
  try {
    attendees = JSON.parse(localStorage.getItem('attendees'));
  } catch (e) {
    attendees = [];
  }
}

// Get celebration element
const celebration = document.getElementById('celebration');
const maxAttendees = 50;

// Team counts
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

if (localStorage.getItem('teamCounts')) {
  try {
    teamCounts = JSON.parse(localStorage.getItem('teamCounts'));
  } catch (e) {
    teamCounts = { water: 0, zero: 0, power: 0 };
  }
}

// Get DOM elements
const checkInForm = document.getElementById('checkInForm');
const attendeeCountSpan = document.getElementById('attendeeCount');
const waterCountSpan = document.getElementById('waterCount');
const zeroCountSpan = document.getElementById('zeroCount');
const powerCountSpan = document.getElementById('powerCount');
const progressBar = document.getElementById('progressBar');
const greeting = document.getElementById('greeting');
const waterList = document.getElementById('waterList');
const zeroList = document.getElementById('zeroList');
const powerList = document.getElementById('powerList');
const waterCard = document.querySelector('.team-card.water');
const zeroCard = document.querySelector('.team-card.zero');
const powerCard = document.querySelector('.team-card.power');

function updateDisplay() {
  // Save to localStorage
  localStorage.setItem('attendees', JSON.stringify(attendees));
  localStorage.setItem('teamCounts', JSON.stringify(teamCounts));
  // Hide celebration by default
  if (celebration) {
    celebration.style.display = 'none';
    celebration.innerHTML = '';
    celebration.classList.remove('celebration-message');
  }
  attendeeCountSpan.textContent = attendees.length;
  // Update progress bar width
  const percent = (attendees.length / maxAttendees) * 100;
  progressBar.style.width = `${percent}%`;

  // If goal reached, show celebration
  if (attendees.length === maxAttendees) {
    // Find winning team
    let winner = 'No team';
    let winnerCount = 0;
    let winnerClass = '';
    if (
      teamCounts.water >= teamCounts.zero &&
      teamCounts.water >= teamCounts.power
    ) {
      winner = 'Team Water Wise';
      winnerCount = teamCounts.water;
      winnerClass = 'water';
    }
    if (
      teamCounts.zero > teamCounts.water &&
      teamCounts.zero >= teamCounts.power
    ) {
      winner = 'Team Net Zero';
      winnerCount = teamCounts.zero;
      winnerClass = 'zero';
    }
    if (
      teamCounts.power > teamCounts.water &&
      teamCounts.power > teamCounts.zero
    ) {
      winner = 'Team Renewables';
      winnerCount = teamCounts.power;
      winnerClass = 'power';
    }
    if (celebration) {
      celebration.innerHTML = `🎉 <span class="winner ${winnerClass}">${winner}</span> wins with ${winnerCount} check-ins! 🎉`;
      // Force reflow to restart animation
      void celebration.offsetWidth;
      celebration.classList.add('celebration-message');
      celebration.style.display = 'block';
    }
  }

  // Clear lists
  waterList.innerHTML = '';
  zeroList.innerHTML = '';
  powerList.innerHTML = '';

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
    { team: 'water', list: waterList },
    { team: 'zero', list: zeroList },
    { team: 'power', list: powerList },
  ].forEach(function (obj) {
    teamAttendees[obj.team].forEach(function (name, idx) {
      const li = document.createElement('li');
      li.textContent = `${idx + 1}. ${name}`;
      obj.list.appendChild(li);
    });
  });
}

checkInForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const nameInput = document.getElementById('attendeeName');
  const teamSelect = document.getElementById('teamSelect');
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  // Animate only the selected team card
  [waterCard, zeroCard, powerCard].forEach(function (card) {
    if (card) {
      card.classList.remove('animate');
    }
  });
  let cardToAnimate = null;
  if (team === 'water') {
    cardToAnimate = waterCard;
  } else if (team === 'zero') {
    cardToAnimate = zeroCard;
  } else if (team === 'power') {
    cardToAnimate = powerCard;
  }
  if (cardToAnimate) {
    // Force reflow to restart animation
    void cardToAnimate.offsetWidth;
    cardToAnimate.classList.add('animate');
  }

  if (name === '' || team === '') {
    greeting.textContent = 'Please enter your name and select a team.';
    greeting.style.display = 'block';
    return;
  }

  if (attendees.length >= maxAttendees) {
    greeting.textContent = 'Check-in is full!';
    greeting.style.display = 'block';
    return;
  }

  // Prevent duplicate check-in by name (case-insensitive)
  const alreadyCheckedIn = attendees.some(function (att) {
    return att.name.toLowerCase() === name.toLowerCase();
  });
  if (alreadyCheckedIn) {
    greeting.textContent = `Welcome back, ${name}! You are already checked in.`;
    greeting.style.display = 'block';
    return;
  }

  // Add attendee
  attendees.push({ name: name, team: team });
  teamCounts[team]++;
  updateDisplay();
  // Save to localStorage after update
  localStorage.setItem('attendees', JSON.stringify(attendees));
  localStorage.setItem('teamCounts', JSON.stringify(teamCounts));
  // Personalized greeting
  let teamLabel = '';
  if (team === 'water') {
    teamLabel = 'Team Water Wise';
  } else if (team === 'zero') {
    teamLabel = 'Team Net Zero';
  } else if (team === 'power') {
    teamLabel = 'Team Renewables';
  }
  greeting.textContent = `Thank you for checking in, ${name}! You are now part of ${teamLabel}.`;
  greeting.style.display = 'block';
  // Reset form
  nameInput.value = '';
  teamSelect.value = '';
});

// Initialize display
updateDisplay();
