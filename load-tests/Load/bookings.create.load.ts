import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
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
  const url = 'http://localhost:8081/bookings';

  const payload = JSON.stringify({
    event_id: 69, 
    quantity: 2,
    total_amount: "50.00",
    booking_status: "Pending"
    
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`,
  };

  const res = http.post(url, payload, { headers });

  console.log(` Booking response status: ${res.status}`);
  console.log(` Booking response body: ${res.body}`);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'booking created': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return typeof body.booking_id === 'number';
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
