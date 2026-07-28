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

export default function () {

  console.log('========== SYSTEM MONITOR SMOKE ==========');

  const endpoints = [
    {
      name: 'System Snapshot',
      url: '/api/system-monitor',
    },
    {
      name: 'Jobs',
      url: '/api/system-monitor/jobs',
    },
    {
      name: 'Events',
      url: '/api/system-monitor/events',
    },
  ];

  endpoints.forEach((ep) => {

    const res = http.get(BASE_URL + ep.url, params);

    const pass = check(res, {
      [`${ep.name} status 200`]: (r) => r.status === 200,
      [`${ep.name} <1000ms`]: (r) => r.timings.duration < 1000,
    });

    console.log(
      `${pass ? 'PASS' : 'FAIL'} | ${ep.name} | ${res.status} | ${Math.round(res.timings.duration)}ms`
    );

    if (!pass) {
      console.log(res.body);
    }

  });

  console.log('==========================================');
}