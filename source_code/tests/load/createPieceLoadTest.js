import { Trend } from 'k6/metrics';
import http from 'k6/http';
import { check, sleep } from 'k6';

// Base URL and API key are loaded from environment variables for authentication and endpoint access
const BASE_URL = __ENV.NEXT_PUBLIC_SUPABASE_URL;
const API_KEY = __ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Define custom metrics to track the duration of create, get, and delete operations
let createTrend = new Trend('create_piece_duration');
let getTrend = new Trend('get_pieces_duration');
let deleteTrend = new Trend('delete_piece_duration');

// Define k6 test options including load stages and performance thresholds
export let options = {
    stages: [
        { duration: '30s', target: 50 },   // Ramp up to 50 virtual users over 30 seconds
        { duration: '30s', target: 100 },  // Ramp up to 100 virtual users over next 30 seconds
        { duration: '30s', target: 200 },  // Ramp up to 200 virtual users over next 30 seconds
        { duration: '1m', target: 150 },   // Ramp down to 150 virtual users over 1 minute
        { duration: '20s', target: 0 },    // Ramp down to 0 virtual users over 20 seconds
    ],
    thresholds: {
        'http_req_duration': ['p(95)<800'],           // 95% of requests should complete below 800ms
        'create_piece_duration': ['avg<500'],         // Average create operation should be under 500ms
        'get_pieces_duration': ['avg<400'],           // Average get operation should be under 400ms
        'delete_piece_duration': ['avg<400'],         // Average delete operation should be under 400ms
    },
};

export default function () {
    // Use a fixed user ID for testing purposes
    const user_id = "00000000-0000-0000-0000-000000000000";

    // Construct the payload for creating a new piece with dynamic name including VU and timestamp
    const piecePayload = JSON.stringify({
        name: `LoadTest Shirt ${__VU}-${Date.now()}`,
        category: 'SHIRT',
        color: 'blue',
        brand: 'TestBrand',
        gender: 'MALE',
        size: 'MEDIUM',
        price: 10,
        condition: 'LIKE_NEW',
        reason: 'Testing',
        images: [],
        user_id: user_id
    });

    // Set the headers including API key and content type for authentication and JSON data
    const headers = {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };

    // Send POST request to create a new piece and check for successful response
    const createRes = http.post(`${BASE_URL}/pieces`, piecePayload, { headers });
    check(createRes, {
        'create status is 201 or 200': (r) => r.status === 201 || r.status === 200,
    });
    // Record the duration of the create operation
    createTrend.add(createRes.timings.duration);

    // Send GET request to retrieve pieces and verify successful response
    const getRes = http.get(`${BASE_URL}/pieces`, { headers });
    check(getRes, {
        'get status is 200': (r) => r.status === 200,
    });
    // Record the duration of the get operation
    getTrend.add(getRes.timings.duration);

    // Send DELETE request to remove pieces created for testing, filtering by reason
    const deleteRes = http.del(`${BASE_URL}/pieces?reason=eq.Testing`, null, { headers });
    check(deleteRes, {
        'delete status is 204 or 200': (r) => r.status === 204 || r.status === 200,
    });
    // Record the duration of the delete operation
    deleteTrend.add(deleteRes.timings.duration);

    // Pause for 1 second between iterations to simulate realistic user wait time
    sleep(1);
}