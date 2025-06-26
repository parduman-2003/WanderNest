let generatedCaptcha = "";

function generateCaptcha(length = 6) {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    generatedCaptcha = result;
    document.getElementById("captchaDisplay").innerText = result;
}

window.onload = generateCaptcha;

document.getElementById("signupForm").addEventListener("submit", function (e) {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const userInput = document.getElementById("captchaInput").value.trim();
    let hasError = false;

    if (password !== confirmPassword) {
        document.getElementById("confirmError").style.display = "block";
        document.getElementById("confirmPassword").classList.add("is-invalid");
        hasError = true;
    } else {
        document.getElementById("confirmError").style.display = "none";
        document.getElementById("confirmPassword").classList.remove("is-invalid");
    }

    if (userInput !== generatedCaptcha) {
        document.getElementById("captchaError").style.display = "block";
        document.getElementById("captchaInput").classList.add("is-invalid");
        hasError = true;
    } else {
        document.getElementById("captchaError").style.display = "none";
        document.getElementById("captchaInput").classList.remove("is-invalid");
    }

    if (hasError) e.preventDefault();
});

function sendOtp() {
    const email = document.getElementById("email").value;
    if (!email) {
        alert("Please enter your email before requesting OTP.");
        return;
    }

    fetch('/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}`
    })
        .then(res => res.text())
        .then(data => alert(data))
        .catch(err => console.error("Failed to send OTP:", err));
}

function verifyOtp() {
    const userOtp = document.getElementById("otp").value;
    fetch('/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `userOtp=${encodeURIComponent(userOtp)}`
    })
        .then(res => res.text())
        .then(msg => {
            document.getElementById("otpMessage").innerText = msg;
        })
        .catch(err => {
            document.getElementById("otpMessage").innerText = "❌ Failed to verify OTP.";
            console.error(err);
        });
}

function verifyCaptcha() {
    const userCaptcha = document.getElementById("captchaInput").value.trim();
    const captchaError = document.getElementById("captchaError");
    const captchaMessage = document.getElementById("captchaMessage");

    if (userCaptcha === generatedCaptcha) {
        captchaError.style.display = "none";
        captchaMessage.innerText = "✅ Captcha verified!";
    } else {
        captchaError.style.display = "block";
        captchaMessage.innerText = "❌ Invalid captcha.";
    }
}