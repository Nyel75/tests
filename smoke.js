import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
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
  '/api/template-manager/dl-types',
  '/api/template-manager/ftp-templates',
  '/api/template-manager/existing-names',
  '/api/template-manager/clients',
  '/api/template-manager/import-clients',
  '/api/template-manager/incomplete-configurations',
  '/api/template-manager/incomplete-configurations/letterheads',
  '/api/template-manager/templates',
  '/api/template-manager/test-values/defaults',
  '/api/template-manager/test-values',
  '/api/template-manager/activity-logs',
];

export default function () {
  endpoints.forEach((endpoint) => {
    const res = http.get(`${BASE_URL}${endpoint}`, params);

    check(res, {
      [`${endpoint} status is 200`]: (r) => r.status === 200,
      [`${endpoint} response time < 1000ms`]: (r) =>
        r.timings.duration < 1000,
    });

    console.log(`${endpoint} -> ${res.status}`);
  });
}