/* =======================================================
   EmailJS SETUP INSTRUCTIONS
   -------------------------------------------------------
   1. Go to https://www.emailjs.com/ and create a free account
   2. Add an Email Service (e.g. Gmail) → note your SERVICE ID
   3. Create an Email Template with these variables:
        {{user_name}}   — sender's name
        {{user_email}}  — sender's email
        {{message}}     — the message body
      Note your TEMPLATE ID
   4. Go to Account → API Keys → copy your PUBLIC KEY
   5. Replace the three placeholder strings below with your real values
   ======================================================= */

const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // ← replace
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // ← replace
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // ← replace

// Initialise EmailJS
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/* ============================
   NAVBAR — scroll shadow
   ============================ */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

/* ============================
   SCROLL ANIMATIONS
   ============================ */
const animateEls = document.querySelectorAll("[data-animate]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
animateEls.forEach((el) => observer.observe(el));

/* ============================
   CONTACT FORM
   ============================ */
const form       = document.getElementById("contact-form");
const submitBtn  = document.getElementById("submit-btn");
const btnText    = submitBtn.querySelector(".btn-text");
const btnLoading = submitBtn.querySelector(".btn-loading");
const formStatus = document.getElementById("form-status");

const nameInput    = document.getElementById("user-name");
const emailInput   = document.getElementById("user-email");
const messageInput = document.getElementById("user-message");

const nameError    = document.getElementById("name-error");
const emailError   = document.getElementById("email-error");
const messageError = document.getElementById("message-error");

// Real-time inline validation
nameInput.addEventListener("input",    () => validateField(nameInput,    nameError,    "Please enter your name."));
emailInput.addEventListener("input",   () => validateEmail());
messageInput.addEventListener("input", () => validateField(messageInput, messageError, "Please enter your message."));

function validateField(input, errorEl, msg) {
  if (input.value.trim() === "") {
    errorEl.textContent = msg;
    return false;
  }
  errorEl.textContent = "";
  return true;
}

function validateEmail() {
  const val = emailInput.value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (val === "") {
    emailError.textContent = "Please enter your email.";
    return false;
  }
  if (!emailRe.test(val)) {
    emailError.textContent = "Please enter a valid email address.";
    return false;
  }
  emailError.textContent = "";
  return true;
}

function validateAll() {
  const n = validateField(nameInput, nameError, "Please enter your name.");
  const e = validateEmail();
  const m = validateField(messageInput, messageError, "Please enter your message.");
  return n && e && m;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formStatus.textContent = "";
  formStatus.className = "form-status";

  if (!validateAll()) return;

  // Loading state
  submitBtn.disabled = true;
  btnText.hidden     = true;
  btnLoading.hidden  = false;

  try {
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
    formStatus.textContent = "✓ Message sent! I'll be in touch soon.";
    formStatus.classList.add("success");
    form.reset();
    nameError.textContent = emailError.textContent = messageError.textContent = "";
  } catch (err) {
    console.error("EmailJS error:", err);
    formStatus.textContent = "Something went wrong. Please try again or email me directly.";
    formStatus.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    btnText.hidden     = false;
    btnLoading.hidden  = true;
  }
});
