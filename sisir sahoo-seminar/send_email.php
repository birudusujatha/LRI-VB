<?php
// Load Google API Client Library manually
require_once __DIR__ . '/google/Google/Client.php';
require_once __DIR__ . '/google/Google/Service/Gmail.php';

// Google API credentials
$clientId = '87423465122-q727t5p8iknlb36281t08l7h143vf871.apps.googleusercontent.com';
$clientSecret = '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';
$redirectUri = 'https://aiconclave2025.in/send_email.php'; // Replace with your InfinityFree URL
$senderEmail = 'conferences@ggu.edu.in';
$tokenFile = __DIR__ . '/token.json'; // File to store tokens

// Initialize Google Client
$client = new Google_Client();
$client->setClientId($clientId);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope('https://www.googleapis.com/auth/gmail.send');
$client->setAccessType('offline'); // Ensures refresh token is returned
$client->setApprovalPrompt('force');

// Handle OAuth flow
if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    file_put_contents($tokenFile, json_encode($token));
    header('Location: ' . filter_var($redirectUri, FILTER_SANITIZE_URL));
    exit;
}

// Load or obtain token
if (file_exists($tokenFile)) {
    $token = json_decode(file_get_contents($tokenFile), true);
    $client->setAccessToken($token);
} else {
    $authUrl = $client->createAuthUrl();
    echo json_encode(['error' => 'Authentication required', 'authUrl' => $authUrl]);
    exit;
}

// Refresh token if expired
if ($client->isAccessTokenExpired()) {
    $refreshToken = $client->getRefreshToken();
    $client->fetchAccessTokenWithRefreshToken($refreshToken);
    file_put_contents($tokenFile, json_encode($client->getAccessToken()));
}

// Process email sending
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['to']) || !isset($data['id'])) {
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

$toEmail = filter_var($data['to'], FILTER_SANITIZE_EMAIL);
$uniqueId = filter_var($data['id'], FILTER_SANITIZE_STRING);

try {
    $service = new Google_Service_Gmail($client);

    $email = [
        "To: $toEmail",
        "Subject: ICAI25 Paper Submission Confirmation",
        "From: $senderEmail",
        "",
        "Dear Author,",
        "",
        "Thank you for submitting your paper to ICAI25. Your submission has been received successfully.",
        "Your unique submission ID is: $uniqueId",
        "Please keep this ID for tracking your submission status.",
        "",
        "Best regards,",
        "ICAI25 Organizing Committee"
    ];

    $mime = rtrim(strtr(base64_encode(implode("\r\n", $email)), '+/', '-_'), '=');
    $msg = new Google_Service_Gmail_Message();
    $msg->setRaw($mime);

    $service->users_messages->send('me', $msg);
    echo json_encode(['success' => 'Email sent successfully']);
} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to send email: ' . $e->getMessage()]);
}