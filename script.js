/* =========================
   LUXURYSTAY HOTEL WEBSITE
   JavaScript functionality
========================= */

// 1. Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("active");

  const isOpen = navMenu.classList.contains("active");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Close navigation after clicking a link
document.querySelectorAll("#navMenu a").forEach(function (link) {
  link.addEventListener("click", function () {
    navMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// 2. Current year in footer
document.getElementById("currentYear").textContent = new Date().getFullYear();

// 3. Room search and filtering
const roomSearch = document.getElementById("roomSearch");
const roomFilter = document.getElementById("roomFilter");
const roomCards = document.querySelectorAll(".room-card");
const noResults = document.getElementById("noResults");

function filterRooms() {
  const searchText = roomSearch.value.toLowerCase().trim();
  const selectedType = roomFilter.value;

  let visibleRooms = 0;

  roomCards.forEach(function (card) {
    const roomName = card.dataset.name.toLowerCase();
    const roomType = card.dataset.type;

    const matchesSearch = roomName.includes(searchText);
    const matchesType = selectedType === "all" || roomType === selectedType;

    if (matchesSearch && matchesType) {
      card.style.display = "";
      visibleRooms++;
    } else {
      card.style.display = "none";
    }
  });

  noResults.hidden = visibleRooms !== 0;
}

roomSearch.addEventListener("input", filterRooms);
roomFilter.addEventListener("change", filterRooms);

// 4. Select a room from its enquiry button
const roomChoice = document.getElementById("roomChoice");

document.querySelectorAll(".book-room").forEach(function (button) {
  button.addEventListener("click", function () {
    roomChoice.value = button.dataset.room;

    document.getElementById("booking").scrollIntoView({
      behavior: "smooth",
    });

    roomChoice.focus();
  });
});

// 5. Set minimum booking dates
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");

// Use the visitor's local date
function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

checkIn.min = getLocalDate();
checkOut.min = getLocalDate();

// Check-out must be after check-in
checkIn.addEventListener("change", function () {
  if (checkIn.value) {
    checkOut.min = checkIn.value;

    if (checkOut.value && checkOut.value <= checkIn.value) {
      checkOut.value = "";
    }
  } else {
    checkOut.min = getLocalDate();
  }
});

// 6. Booking enquiry form
const bookingForm = document.getElementById("bookingForm");
const formStatus = document.getElementById("formStatus");

// The enquiry recipient
const recipient = "insightwebinar91@gmail.com";

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const guestName = document.getElementById("guestName").value.trim();

  const guestEmail = document.getElementById("guestEmail").value.trim();

  const guestPhone = document.getElementById("guestPhone").value.trim();

  const selectedRoom = roomChoice.value;

  const checkInDate = checkIn.value;
  const checkOutDate = checkOut.value;

  const guests = document.getElementById("guests").value;

  const message = document.getElementById("message").value.trim();

  // Basic validation
  if (
    !guestName ||
    !guestEmail ||
    !guestPhone ||
    !selectedRoom ||
    !checkInDate ||
    !checkOutDate ||
    !guests
  ) {
    formStatus.textContent = "Please complete all required fields.";

    return;
  }

  // Validate the email address
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(guestEmail)) {
    formStatus.textContent = "Please enter a valid email address.";

    return;
  }

  // Validate the dates
  if (checkInDate < getLocalDate()) {
    formStatus.textContent = "Check-in date cannot be in the past.";

    return;
  }

  if (checkOutDate <= checkInDate) {
    formStatus.textContent = "Check-out must be after check-in.";

    return;
  }

  // Prepare email subject
  const subject = "LuxuryStay Hotel Booking Enquiry";

  // Prepare email content
  const emailBody = `LUXURYSTAY HOTEL - BOOKING ENQUIRY

Guest Name: ${guestName}
Guest Email: ${guestEmail}
Guest Phone: ${guestPhone}

Preferred Room: ${selectedRoom}
Check-in Date: ${checkInDate}
Check-out Date: ${checkOutDate}
Number of Guests: ${guests}

Additional Message:
${message || "No additional message."}

IMPORTANT:
This is a booking enquiry only.
Please confirm availability and actual room rates with the guest.

Sent through the LuxuryStay Hotel demonstration website.`;

  // Encode the email details
  const mailtoLink =
    "mailto:" +
    recipient +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(emailBody);

  // Open the visitor's email application
  formStatus.textContent =
    "Opening your email application. Review the enquiry and press Send.";

  window.location.href = mailtoLink;
});

// 7. Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
    const targetId = link.getAttribute("href");

    if (targetId === "#") {
      return;
    }

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});
