//Simulate 50 virtual users trying to log in concurrently.
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,               
  duration: '10s',       
};

export default function () {
  const loginPayload = JSON.stringify({
    email: 'mike@gmail.com',
    password: 'mike123',
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post('http://localhost:8081/auth/login', loginPayload, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'contains token': (r) => {
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
