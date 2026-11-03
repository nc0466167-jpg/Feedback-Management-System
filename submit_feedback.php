<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $rating = $_POST['rating'];
    $message = $_POST['message'];

    $stmt = $conn->prepare(
        "INSERT INTO feedbacks (name, email, rating, message)
         VALUES (?, ?, ?, ?)"
    );

    $stmt->bind_param("ssis", $name, $email, $rating, $message);

    if ($stmt->execute()) {
        echo "Feedback submitted successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>