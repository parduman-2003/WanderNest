function sendOtp() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;

  fetch('/forgot-password/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`
  })
    .then(res => res.text())
    .then(msg => alert(msg))
    .catch(err => alert("Error sending OTP"));
}

function verifyOtp() {
  const otp = document.getElementById("otp").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;

  fetch('/forgot-password/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `otp=${encodeURIComponent(otp)}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("otpMessage").innerText = data.message;
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    });
}