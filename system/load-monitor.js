import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    load_test: {
      executor: 'shared-iterations',
      vus: 15,
      iterations: 150,
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
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

const endpoints = [
  '/api/system-monitor',
  '/api/system-monitor/jobs',
  '/api/system-monitor/events',
];

export default function () {

  endpoints.forEach((endpoint) => {

    const res = http.get(BASE_URL + endpoint, params);

    check(res, {
      [`${endpoint} returned 200`]: (r) => r.status === 200,
      [`${endpoint} response < 1000ms`]: (r) =>
        r.timings.duration < 1000,
    });

  });

}