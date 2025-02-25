
var slideIndices = {};


document.addEventListener("DOMContentLoaded", function () {
  var slideshows = ["upcoming-slideshow", "workshops-slideshow", "hackathons-slideshow"];
  

  slideshows.forEach(function (id) {
    slideIndices[id] = 1;        
    showSlides(1, id);            
    setInterval(function () {
      changeSlide(1, id);
    }, 5000);
  });
});


function changeSlide(n, slideshowId) {
  showSlides(slideIndices[slideshowId] + n, slideshowId);
}

function currentSlide(n, slideshowId) {
  showSlides(n, slideshowId);
}

function showSlides(n, slideshowId) {
  var container = document.getElementById(slideshowId);
  var slides = container.getElementsByClassName("event-slide");
  
  if (n > slides.length) {
    slideIndices[slideshowId] = 1;
  } else if (n < 1) {
    slideIndices[slideshowId] = slides.length;
  } else {
    slideIndices[slideshowId] = n;
  }
  
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  slides[slideIndices[slideshowId] - 1].style.display = "block";
  
  var dotsId = slideshowId.replace("slideshow", "dots");
  var dotsContainer = document.getElementById(dotsId);
  if (dotsContainer) {
    var dots = dotsContainer.getElementsByClassName("dot");
    for (var i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[slideIndices[slideshowId] - 1].className += " active";
  }
}

// --- Countdown Timer Code --- //


function updateCountdowns() {

    const countdownElements = document.querySelectorAll('.countdown-timer');
  
    countdownElements.forEach(el => {
      const eventDateStr = el.getAttribute('data-event-date');
      const eventDate = new Date(eventDateStr);
      const now = new Date();
      const diff = eventDate - now;
  
      if (diff <= 0) {
        el.innerHTML = "Event started!";
        return;
      }
  
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
      el.innerHTML = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds left!`;
    });
  }
  
  setInterval(updateCountdowns, 1000);
  
  updateCountdowns();

 // --- Gamification: Event Badges (Event Attendance Tracking) --- //

function attendEvent(eventType) {
    let attendedEvents = JSON.parse(localStorage.getItem("attendedEvents")) || {};
  
    if (!attendedEvents[eventType]) {
      attendedEvents[eventType] = 0;
    }

    attendedEvents[eventType]++;
    localStorage.setItem("attendedEvents", JSON.stringify(attendedEvents));
    updateBadges();
  }
  
  function updateBadges() {
    let attendedEvents = JSON.parse(localStorage.getItem("attendedEvents")) || {};

    let badgeContainer = document.getElementById("badge-container");
    if (!badgeContainer) return; 
  
    badgeContainer.innerHTML = "";
  
    if (attendedEvents["hackathon"] && attendedEvents["hackathon"] >= 3) {
      let badge = document.createElement("div");
      badge.className = "badge";
      badge.textContent = "🏆 3 Hackathons Attended!";
      badgeContainer.appendChild(badge);
    }
  

    if (attendedEvents["workshop"] && attendedEvents["workshop"] >= 5) {
      let badge = document.createElement("div");
      badge.className = "badge";
      badge.textContent = "🎖️ 5 Workshops Attended!";
      badgeContainer.appendChild(badge);
    }
  

    let totalEvents = Object.values(attendedEvents).reduce((sum, count) => sum + count, 0);
    if (totalEvents >= 10) {
      let badge = document.createElement("div");
      badge.className = "badge";
      badge.textContent = "🌟 10 Events Attended - Event Pro!";
      badgeContainer.appendChild(badge);
    }
  }
  

  document.addEventListener("DOMContentLoaded", function () {

    let attendButtons = document.querySelectorAll(".attend-btn");
    attendButtons.forEach(function (button) {
      button.addEventListener("click", function () {
 
        let eventType = this.getAttribute("data-event-type");
        attendEvent(eventType);
      });
    });
  

    updateBadges();
  });