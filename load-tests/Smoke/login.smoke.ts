import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
  duration: '15s',
};

export default function () {
  const payload = JSON.stringify({
    email: 'mike@gmail.com',
    password: 'mike123',
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post('http://localhost:8081/auth/login', payload, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'token exists in response': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return typeof body.token === 'string';
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
