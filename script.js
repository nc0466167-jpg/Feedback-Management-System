
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("feedbackForm");

    if (!form) {
        console.error("Feedback form not found!");
        return;
    }

    function getFeedback() {
        try {
            return JSON.parse(
                localStorage.getItem("feedbackList") || "[]"
            );
        } catch (error) {
            return [];
        }
    }

    function saveFeedback(feedbackList) {
        localStorage.setItem(
            "feedbackList",
            JSON.stringify(feedbackList)
        );
    }

    // Submit Feedback
    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const moodInput = form.querySelector(
            'input[name="mood"]:checked'
        );

        if (!moodInput) {
            alert("Please select your experience!");
            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const category = document.getElementById("category").value;
        const message = document.getElementById("message").value.trim();
        const rating = Number(
            document.getElementById("rating").value
        );

        if (!name || !email || !category || !message ||
            rating < 1 || rating > 5) {
            alert("Please fill all fields correctly!");
            return;
        }

        const feedback = {
            name: name,
            email: email,
            category: category,
            mood: moodInput.value,
            message: message,
            rating: rating,
            date: new Date().toLocaleDateString()
        };

        try {

            const response = await fetch("submit_feedback.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    name: name,
                    email: email,
                    rating: rating,
                    message: message
                })
            });

            const result = await response.text();

            if (!response.ok || !result.includes("successfully")) {
                alert("Feedback could not be saved: " + result);
                return;
            }

            const feedbackList = getFeedback();
            feedbackList.push(feedback);
            saveFeedback(feedbackList);

            alert("Feedback submitted successfully!");

            form.reset();

            displayFeedback();
            updateStats();

        } catch (error) {

            console.error(error);
            alert("Database connection error!");

        }

    });

    // Display Recent Feedback
    function displayFeedback() {

        const feedbackList = getFeedback();
        const container = document.getElementById("feedbackList");

        if (!container) return;

        container.innerHTML = "";

        if (feedbackList.length === 0) {
            container.textContent = "No feedback available yet.";
            return;
        }

        feedbackList.slice().reverse().forEach(function (item) {

            const card = document.createElement("div");
            card.className = "feedback-card";

            const name = document.createElement("h3");
            name.textContent = item.name || "Anonymous";

            const category = document.createElement("p");
            category.textContent = "Category: " + (item.category || "N/A");

            const mood = document.createElement("p");
            mood.textContent = "Experience: " + (item.mood || "N/A");

            const message = document.createElement("p");
            message.textContent = item.message || "No message";

            const rating = document.createElement("p");
            const stars = "★".repeat(
                Math.min(5, Math.max(0, Number(item.rating) || 0))
            );

            rating.textContent = "Rating: " + stars;
            rating.style.color = "#f5a623";
            rating.style.fontSize = "20px";

            const date = document.createElement("small");
            date.textContent = "Date: " + (item.date || "Earlier");

            card.append(name, category, mood, message, rating, date);
            container.appendChild(card);

        });
    }

    // Dashboard Statistics
    function updateStats() {

        const feedbackList = getFeedback();

        const validRatings = feedbackList
            .map(item => Number(item.rating))
            .filter(rating => rating >= 1 && rating <= 5);

        const total = feedbackList.length;

        const average = validRatings.length > 0
            ? validRatings.reduce((sum, rating) => sum + rating, 0)
                / validRatings.length
            : 0;

        const fiveStar = validRatings.filter(
            rating => rating === 5
        ).length;

        const totalElement = document.getElementById("totalFeedback");
        const averageElement = document.getElementById("averageRating");
        const fiveStarElement = document.getElementById("fiveStar");

        if (totalElement) totalElement.textContent = total;
        if (averageElement) averageElement.textContent = average.toFixed(1);
        if (fiveStarElement) fiveStarElement.textContent = fiveStar;
    }

    displayFeedback();
    updateStats();

});
