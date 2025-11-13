import { Trend } from 'k6/metrics';
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.NEXT_PUBLIC_SUPABASE_URL;
const API_KEY = __ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let createTrend = new Trend('create_piece_duration');
let getTrend = new Trend('get_pieces_duration');
let deleteTrend = new Trend('delete_piece_duration');

export let options = {
    stages: [
        { duration: '30s', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 200 },
        { duration: '1m', target: 150 },
        { duration: '20s', target: 0 },
    ],
    thresholds: {
        'http_req_duration': ['p(95)<800'],
        'create_piece_duration': ['avg<500'],
        'get_pieces_duration': ['avg<400'],
        'delete_piece_duration': ['avg<400'],
    },
};

export default function () {
    const user_id = "00000000-0000-0000-0000-000000000000";

    const piecePayload = JSON.stringify({
        name: `LoadTest Shirt ${__VU}-${Date.now()}`,
        category: 'SHIRT',
        color: 'blue',
        brand: 'TestBrand',
        gender: 'MALE',
        size: 'M',
        price: 10,
        condition: 'LIKE_NEW',
        reason: 'Testing',
        images: [],
        user_id: user_id
    });

    const headers = {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };

    const createRes = http.post(`${BASE_URL}/pieces`, piecePayload, { headers });
    check(createRes, {
        'create status is 201 or 200': (r) => r.status === 201 || r.status === 200,
    });
    createTrend.add(createRes.timings.duration);

    const getRes = http.get(`${BASE_URL}/pieces`, { headers });
    check(getRes, {
        'get status is 200': (r) => r.status === 200,
    });
    getTrend.add(getRes.timings.duration);

    const deleteRes = http.del(`${BASE_URL}/pieces?reason=eq.Testing`, null, { headers });
    check(deleteRes, {
        'delete status is 204 or 200': (r) => r.status === 204 || r.status === 200,
    });
    deleteTrend.add(deleteRes.timings.duration);

    sleep(1);
}