import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
  duration: '15s',
};

export default function () {
  const url = 'http://localhost:8081/auth/register';

  const payload = JSON.stringify({
    first_name: 'Test',
    last_name: 'User',
    email: `testuser_${Date.now()}@example.com`, 
    password: 'test123',
    contact_phone: '123456789',
    address: '123 Test Lane',
    role: 'user',
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post(url, payload, { headers });

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response has token': (r) => {
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
