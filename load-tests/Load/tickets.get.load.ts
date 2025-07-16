import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '10s',
};

export function setup() {
  const loginPayload = JSON.stringify({
    email: 'mike@gmail.com',
    password: 'mike123',
  });

  const headers = { 'Content-Type': 'application/json' };
  const res = http.post('http://localhost:8081/auth/login', loginPayload, { headers });

  const body = JSON.parse(res.body as string);
  const token = body.token;

  if (!token) throw new Error('Login failed: no token returned');

  return { token };
}

export default function (data: { token: string }) {
  const headers = { Authorization: `Bearer ${data.token}` };
  const res = http.get('http://localhost:8081/tickets', { headers });

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

