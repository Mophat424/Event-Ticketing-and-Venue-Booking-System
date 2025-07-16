import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
  duration: '15s',
};

export default function () {
  const res = http.get('http://localhost:8081/events');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response is array': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return Array.isArray(body);
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
