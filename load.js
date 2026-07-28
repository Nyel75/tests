import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,          // 10 users at the same time
  iterations: 30,   // 30 iterations total

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

export default function () {
  const responses = http.batch([
    ['GET', `${BASE_URL}/api/template-manager/dl-types`, null, params],
    ['GET', `${BASE_URL}/api/template-manager/templates`, null, params],
    ['GET', `${BASE_URL}/api/template-manager/clients`, null, params],
    ['GET', `${BASE_URL}/api/template-manager/activity-logs`, null, params],
    // Add the required query parameters below
    ['GET', `${BASE_URL}/api/template-manager/test-values?folder_name=YOUR_FOLDER&template_name=YOUR_TEMPLATE&template_type=YOUR_TYPE`, null, params],
    ['GET', `${BASE_URL}/api/template-manager/existing-names`, null, params],
  ]);

  responses.forEach((res) => {
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  });
}