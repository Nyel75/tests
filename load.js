import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 0 },   // Ramp down
  ],

  thresholds: {
    http_req_failed: ['rate<0.01'],      // Less than 1% failures
    http_req_duration: ['p(95)<1000'],   // 95% requests < 1 second
  },
};

const BASE_URL = 'http://172.20.0.121:8001';

const TOKEN = 'f172782e-e202-486b-a714-35ce673eb61c';

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

export default function () {

  const responses = http.batch([
    ['GET', `${BASE_URL}/api/template-manager/dl-types`, null, params],
    ['GET', `${BASE_URL}/api/template-manager/templates`, null, params],
    ['GET', `${BASE_URL}/api/template-manager/clients`, null, params],
    ['GET', `${BASE_URL}/api/template-manager/activity-logs`, null, params],
    ['GET', `${BASE_URL}/api/template-manager/test-values`, null, params],
    ['GET', `${BASE_URL}/api/template-manager/existing-names`, null, params],
  ]);

  responses.forEach((res) => {
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
    });
  });

  sleep(1);
}