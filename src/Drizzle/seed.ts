import  db  from './db';
import {
  users, venues, events, bookings, payments, supportTickets
} from './schema';

async function seed() {
  console.log(' Seeding database...');

  // Delete old data
  await db.delete(payments);
  await db.delete(bookings);
  await db.delete(events);
  await db.delete(supportTickets);
  await db.delete(users);
  await db.delete(venues);

  const plainPassword = 'Password123!';

  // Insert users
  const [adminUser] = await db.insert(users).values({
    first_name: 'Alice',
    last_name: 'Vaughn',
    email: 'admin@example.com',
    password: plainPassword,
    contact_phone: '0700000000',
    address: 'Admin Street, City',
    role: 'admin'
  }).returning({ user_id: users.user_id });

  const [normalUser] = await db.insert(users).values({
    first_name: 'Bob',
    last_name: 'Myers',
    email: 'user@example.com',
    password: plainPassword,
    contact_phone: '0711111111',
    address: 'User Avenue, Town',
    role: 'user'
  }).returning({ user_id: users.user_id });

  // Insert venues
  const [venue1] = await db.insert(venues).values({
    name: 'Grand Arena',
    address: '123 Event Rd, Capital City',
    capacity: 1000
  }).returning({ venue_id: venues.venue_id });

  const [venue2] = await db.insert(venues).values({
    name: 'Open Grounds',
    address: '456 Freedom St, Uptown',
    capacity: 5000
  }).returning({ venue_id: venues.venue_id });

  // Insert events
  const [event1] = await db.insert(events).values({
    title: 'Rock Concert',
    description: 'A thrilling rock experience!',
    venue_id: venue1.venue_id,
    category: 'Music',
    date: '2025-07-15',
    time: '19:00',
    ticket_price: '50.00', 
    tickets_total: 500
  }).returning({ event_id: events.event_id });

  const [event2] = await db.insert(events).values({
    title: 'Tech Conference',
    description: 'Learn about cutting-edge technologies.',
    venue_id: venue2.venue_id,
    category: 'Technology',
    date: '2025-08-05',
    time: '09:00',
    ticket_price: '150.00',
    tickets_total: 300
  }).returning({ event_id: events.event_id });

  // Insert bookings
  const [booking1] = await db.insert(bookings).values({
    user_id: normalUser.user_id,
    event_id: event1.event_id,
    quantity: 2,
    total_amount: '100.00', 
    booking_status: 'Confirmed'
  }).returning({ booking_id: bookings.booking_id });

  // Insert payments
  await db.insert(payments).values({
    booking_id: booking1.booking_id,
    amount: '100.00', // must be string
    payment_status: 'Paid',
    payment_method: 'Stripe',
    transaction_id: 'txn_1234567890'
  });

  // Insert support ticket
  await db.insert(supportTickets).values({
    user_id: normalUser.user_id,
    subject: 'Event Access Issue',
    description: 'I did not receive my ticket after payment.',
    status: 'Open'
  });

  console.log('✅ Database seeded successfully!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
