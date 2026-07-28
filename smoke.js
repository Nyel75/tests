import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
};

const BASE_URL = (__ENV.BASE_URL || 'http://172.20.0.121:8001').replace(/\/$/, '');
const TOKEN = __ENV.TOKEN || 'f172782e-e202-486b-a714-35ce673eb61c';

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

const endpoints = [
  '/api/template-manager/dl-types',
  '/api/template-manager/templates',
  '/api/template-manager/clients',
  '/api/template-manager/activity-logs',
];

export default function () {
  let lastResponse = null;

  for (const endpoint of endpoints) {
    const res = http.get(`${BASE_URL}${endpoint}`, params);
    lastResponse = res;

    console.log(`${endpoint} -> ${res.status}`);

    if (res.status === 200) {
      check(res, {
        [`${endpoint} returned 200`]: (r) => r.status === 200,
      });
      return;
    }
  }

  check(lastResponse, {
    'at least one smoke endpoint returned 200': (r) => r && r.status === 200,
  });
}