import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '5s',
};

export default function () {
  const url = 'http://localhost:8081/auth/register';

  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
  const email = `user${uniqueId}@test.com`;

  const payload = JSON.stringify({
    first_name: 'Load',
    last_name: 'Tester',
    email,
    password: 'test123',
    contact_phone: '0700000000',
    address: 'Nairobi',
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post(url, payload, { headers });

  console.log('STATUS:', res.status);
  console.log('BODY:', res.body);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'contains user id': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.user && typeof body.user.id === 'number';
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}

