import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
  duration: '15s',
};

//  Login and return token
export function setup() {
  const loginPayload = JSON.stringify({
    email: 'mike@gmail.com',
    password: 'mike123',
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const loginRes = http.post('http://localhost:8081/auth/login', loginPayload, { headers });

  console.log('Login response status:', loginRes.status);
  console.log('Login response body:', loginRes.body);

  if (loginRes.status !== 200) {
    throw new Error(`Login failed: ${loginRes.status}`);
  }

  const body = JSON.parse(loginRes.body as string);
  const token = body.token;

  if (!token) {
    throw new Error('Login failed: No token returned');
  }

  return { token };
}

//  Main test logic
export default function (data: { token: string }) {
  const url = 'http://localhost:8081/users';

  const headers = {
    Authorization: `Bearer ${data.token}`,
  };

  const res = http.get(url, { headers });

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

