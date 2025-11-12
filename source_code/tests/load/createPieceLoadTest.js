import { Trend } from 'k6/metrics';
import http from 'k6/http';
import { check, sleep } from 'k6';

let myTrend = new Trend('my_trend');

export let options = {
    stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
        'my_trend': ['avg<200'], // Custom threshold for the custom metric
    },
};

export default function () {
    let res = http.get('https://test.k6.io');
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
    myTrend.add(res.timings.duration);
    sleep(1);
}