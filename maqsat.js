validateForm = () => {
    var username = document.getElementById("register").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("pass").value;
    var confirmPassword = document.getElementById("confirm_pass").value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.length < 3) {
        alert("Username must be at least 3 characters long.");
        return false;
    }
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function() {
    var form = document.querySelector("form");
    form.onsubmit = function(event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    };
});

