document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "admin123") {

            sessionStorage.setItem("adminLoggedIn", "true");

            alert("Login Successful!");
            window.location.href = "admin.html";

        } else {

            document.getElementById("loginMessage").textContent =
                "Invalid Username or Password!";

            document.getElementById("loginMessage").style.color = "red";
        }

    });

});