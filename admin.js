document.addEventListener("DOMContentLoaded", function () {
        if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }

    const container = document.getElementById("adminFeedbackList");
    const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("adminLoggedIn");
    window.location.href = "login.html";
});

    // Get feedback from LocalStorage
    function getFeedback() {
        try {
            const data = JSON.parse(
                localStorage.getItem("feedbackList") || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {
            console.error("Error reading feedback:", error);
            return [];
        }
    }

    // Display all feedback
    function displayAdminFeedback() {

        const feedback = getFeedback();

        container.innerHTML = "";

        if (feedback.length === 0) {
            container.innerHTML = "<p>No feedback available.</p>";
            return;
        }

        feedback.forEach(function (item, index) {

            const card = document.createElement("div");
            card.className = "feedback-card";

            const name = document.createElement("h3");
            name.textContent = item.name || "Anonymous";

            const category = document.createElement("p");
            category.textContent = "Category: " + (item.category || "N/A");

            const mood = document.createElement("p");
            mood.textContent = "Experience: " + (item.mood || "N/A");

            const message = document.createElement("p");
            message.textContent = "Message: " + (item.message || "");

            const rating = document.createElement("p");
            rating.textContent =
                "Rating: " + "★".repeat(
                    Math.min(5, Math.max(0, Number(item.rating) || 0))
                );

            rating.style.color = "#f5a623";

            const date = document.createElement("small");
            date.textContent = "Date: " + (item.date || "Earlier");

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", function () {

                const confirmDelete = confirm(
                    "Are you sure you want to delete this feedback?"
                );

                if (!confirmDelete) {
                    return;
                }

                const updatedFeedback = getFeedback();

                updatedFeedback.splice(index, 1);

                localStorage.setItem(
                    "feedbackList",
                    JSON.stringify(updatedFeedback)
                );

                displayAdminFeedback();
            });

            card.append(
                name,
                category,
                mood,
                message,
                rating,
                date,
                deleteButton
            );

            container.appendChild(card);
        });
    }

    // Load feedback when admin page opens
    displayAdminFeedback();

});
