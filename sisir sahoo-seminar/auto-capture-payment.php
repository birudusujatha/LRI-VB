<?php
header('Content-Type: application/json');

// Razorpay credentials
$key_id = 'rzp_live_HJl9NwyBSY9rwV';
$key_secret = '1FlerafMmqHMw466ccsDxrhp';

// Firebase credentials (using Firebase PHP SDK)
require 'vendor/autoload.php'; // Include the Firebase PHP SDK (install via Composer)

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

// Initialize Firebase
$serviceAccount = ServiceAccount::fromJsonFile('path/to/your-service-account-key.json');
$firebase = (new Factory)
    ->withServiceAccount($serviceAccount)
    ->withDatabaseUri('https://whatsup-519-default-rtdb.firebaseio.com')
    ->create();
$database = $firebase->getDatabase();

// Get the request data
$input = json_decode(file_get_contents('php://input'), true);
$paymentId = isset($input['paymentId']) ? $input['paymentId'] : null;
$amount = isset($input['amount']) ? $input['amount'] : null;
$submissionId = isset($input['submissionId']) ? $input['submissionId'] : null;

if (!$paymentId || !$amount || !$submissionId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

// Capture the payment using Razorpay API
$api_url = "https://api.razorpay.com/v1/payments/{$paymentId}/capture";
$data = [
    'amount' => $amount, // Amount in paise
    'currency' => 'INR'
];

$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
    'Authorization: Basic ' . base64_encode("{$key_id}:{$key_secret}")
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $responseData = json_decode($response, true);
    // Update Firebase
    $updates = [
        'status' => 'paid',
        'paymentId' => $paymentId,
        'paymentDate' => date('c') // ISO 8601 format
    ];
    $database->getReference("submissions/{$submissionId}")->update($updates);

    echo json_encode(['status' => 'success', 'message' => 'Payment captured and Firebase updated', 'data' => $responseData]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error capturing payment: ' . $response]);
}
?>