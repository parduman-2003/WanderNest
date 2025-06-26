function sendOtp() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;

  fetch('/booking/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`
  })
    .then(res => res.text())
    .then(msg => alert(msg))
    .catch(err => alert("Failed to send OTP."));
}

function verifyOtp() {
  const otp = document.getElementById("otp").value;
  const email = document.getElementById("email").value;

  fetch('/booking/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `otp=${encodeURIComponent(otp)}&email=${encodeURIComponent(email)}`
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("otpMessage").innerText = data.message;
      if (data.success) {
        document.getElementById("finalBtn").style.display = "inline-block";
      }
    });
}