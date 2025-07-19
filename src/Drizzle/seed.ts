// import db from './db';
// import {
//   users,
//   venues,
//   events,
//   bookings,
//   payments,
//   supportTickets,
// } from './schema';

// async function seed() {
//   console.log('🌱 Seeding database...');

//   // Delete existing data (in order to respect FK constraints)
//   await db.delete(payments);
//   await db.delete(bookings);
//   await db.delete(events);
//   await db.delete(supportTickets);
//   await db.delete(users);
//   await db.delete(venues);

//   const plainPassword = 'Password123!';

//   // Insert users
//   const insertedUsers = await db
//     .insert(users)
//     .values([
//       {
//         first_name: 'Alice',
//         last_name: 'Vaughn',
//         email: 'admin@example.com',
//         password: plainPassword,
//         contact_phone: '0700000000',
//         address: 'Admin Street, City',
//         role: 'admin',
//       },
//       {
//         first_name: 'Bob',
//         last_name: 'Myers',
//         email: 'user1@example.com',
//         password: plainPassword,
//         contact_phone: '0711111111',
//         address: 'User 1 Avenue, Town',
//         role: 'user',
//       },
//       {
//         first_name: 'Cathy',
//         last_name: 'Brown',
//         email: 'user2@example.com',
//         password: plainPassword,
//         contact_phone: '0722222222',
//         address: 'User 2 Lane, Town',
//         role: 'user',
//       },
//       {
//         first_name: 'David',
//         last_name: 'Ngugi',
//         email: 'user3@example.com',
//         password: plainPassword,
//         contact_phone: '0733333333',
//         address: 'User 3 Blvd, Town',
//         role: 'user',
//       },
//       {
//         first_name: 'Eva',
//         last_name: 'Mutua',
//         email: 'user4@example.com',
//         password: plainPassword,
//         contact_phone: '0744444444',
//         address: 'User 4 Close, Town',
//         role: 'user',
//       },
//     ])
//     .returning({ user_id: users.user_id });

//   const adminUser = insertedUsers[0];
//   const userList = insertedUsers.slice(1);

//   // Insert venues
//   const insertedVenues = await db
//     .insert(venues)
//     .values([
//       { name: 'Grand Arena', address: '123 Event Rd, Capital City', capacity: 1000 },
//       { name: 'Open Grounds', address: '456 Freedom St, Uptown', capacity: 5000 },
//       { name: 'Tech Hall', address: '789 Innovation Ave', capacity: 800 },
//       { name: 'Sunset Park', address: '321 Sunset Blvd', capacity: 3000 },
//       { name: 'Royal Pavilion', address: '654 Kings Rd', capacity: 1500 },
//     ])
//     .returning({ venue_id: venues.venue_id });

//   // Insert events
//   const insertedEvents = await db
//     .insert(events)
//     .values([
//       {
//         title: 'Rock Concert',
//         description: 'A thrilling rock experience!',
//         venue_id: insertedVenues[0].venue_id,
//         category: 'Music',
//         date: '2025-07-15',
//         time: '19:00',
//         ticket_price: '50.00',
//         tickets_total: 500,
//       },
//       {
//         title: 'Tech Conference',
//         description: 'Cutting-edge tech talks.',
//         venue_id: insertedVenues[1].venue_id,
//         category: 'Technology',
//         date: '2025-08-10',
//         time: '09:00',
//         ticket_price: '150.00',
//         tickets_total: 300,
//       },
//       {
//         title: 'Jazz Night',
//         description: 'Smooth live jazz.',
//         venue_id: insertedVenues[2].venue_id,
//         category: 'Music',
//         date: '2025-07-20',
//         time: '20:00',
//         ticket_price: '75.00',
//         tickets_total: 200,
//       },
//       {
//         title: 'Startup Pitch Day',
//         description: 'Founders pitch to investors.',
//         venue_id: insertedVenues[3].venue_id,
//         category: 'Business',
//         date: '2025-08-01',
//         time: '10:00',
//         ticket_price: '25.00',
//         tickets_total: 100,
//       },
//       {
//         title: 'Cultural Festival',
//         description: 'A celebration of diversity.',
//         venue_id: insertedVenues[4].venue_id,
//         category: 'Culture',
//         date: '2025-09-01',
//         time: '15:00',
//         ticket_price: '40.00',
//         tickets_total: 400,
//       },
//     ])
//     .returning({ event_id: events.event_id });

//   // Insert bookings
//   const insertedBookings = await db
//     .insert(bookings)
//     .values([
//       {
//         user_id: userList[0].user_id,
//         event_id: insertedEvents[0].event_id,
//         quantity: 2,
//         total_amount: '100.00',
//         booking_status: 'Confirmed',
//       },
//       {
//         user_id: userList[1].user_id,
//         event_id: insertedEvents[1].event_id,
//         quantity: 1,
//         total_amount: '150.00',
//         booking_status: 'Confirmed',
//       },
//       {
//         user_id: userList[2].user_id,
//         event_id: insertedEvents[2].event_id,
//         quantity: 3,
//         total_amount: '225.00',
//         booking_status: 'Confirmed',
//       },
//       {
//         user_id: userList[3].user_id,
//         event_id: insertedEvents[3].event_id,
//         quantity: 2,
//         total_amount: '50.00',
//         booking_status: 'Confirmed',
//       },
//       {
//         user_id: userList[0].user_id,
//         event_id: insertedEvents[4].event_id,
//         quantity: 4,
//         total_amount: '160.00',
//         booking_status: 'Confirmed',
//       },
//     ])
//     .returning({ booking_id: bookings.booking_id });

//   // Insert payments
//   await db.insert(payments).values([
//     {
//       booking_id: insertedBookings[0].booking_id,
//       user_id: userList[0].user_id,
//       amount: '100.00',
//       payment_status: 'Paid',
//       payment_method: 'Stripe',
//       transaction_id: 'txn_001',
//     },
//     {
//       booking_id: insertedBookings[1].booking_id,
//       user_id: userList[1].user_id,
//       amount: '150.00',
//       payment_status: 'Paid',
//       payment_method: 'Paypal',
//       transaction_id: 'txn_002',
//     },
//     {
//       booking_id: insertedBookings[2].booking_id,
//       user_id: userList[2].user_id,
//       amount: '225.00',
//       payment_status: 'Paid',
//       payment_method: 'M-Pesa',
//       transaction_id: 'txn_003',
//     },
//     {
//       booking_id: insertedBookings[3].booking_id,
//       user_id: userList[3].user_id,
//       amount: '50.00',
//       payment_status: 'Paid',
//       payment_method: 'Card',
//       transaction_id: 'txn_004',
//     },
//     {
//       booking_id: insertedBookings[4].booking_id,
//       user_id: userList[0].user_id,
//       amount: '160.00',
//       payment_status: 'Paid',
//       payment_method: 'Stripe',
//       transaction_id: 'txn_005',
//     },
//   ]);

//   // Insert support tickets
//   await db.insert(supportTickets).values([
//     {
//       user_id: userList[0].user_id,
//       subject: 'Issue with ticket',
//       description: 'Did not receive ticket after payment.',
//       status: 'Open',
//     },
//     {
//       user_id: userList[1].user_id,
//       subject: 'Refund request',
//       description: 'Unable to attend event.',
//       status: 'Open',
//     },
//     {
//       user_id: userList[2].user_id,
//       subject: 'Wrong event details',
//       description: 'Time mentioned is incorrect.',
//       status: 'Resolved',
//     },
//     {
//       user_id: userList[3].user_id,
//       subject: 'Venue confusion',
//       description: 'Venue name not found.',
//       status: 'Pending',
//     },
//     {
//       user_id: userList[0].user_id,
//       subject: 'Discount not applied',
//       description: 'Promo code did not work.',
//       status: 'Open',
//     },
//   ]);

//   console.log('✅ Database seeded successfully!');
// }

// seed().catch((err) => {
//   console.error('❌ Seeding failed:', err);
//   process.exit(1);
// });



import db from './db';
import {
  users,
  venues,
  events,
  bookings,
  payments,
  supportTickets,
} from './schema';

async function seed() {
  try {
    console.log('🌱 Starting seed...');

    // Clear in reverse order due to FK constraints
    console.log('🧹 Clearing existing data...');
    await db.delete(payments);
    await db.delete(bookings);
    await db.delete(supportTickets);
    await db.delete(events);
    await db.delete(users);
    await db.delete(venues);

    console.log('👤 Inserting users...');
    const insertedUsers = await db
      .insert(users)
      .values([
        {
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          password: 'password',
          contact_phone: '0700000000',
          address: '123 Test Lane',
          role: 'user',
        },
      ])
      .returning();

    const user = insertedUsers[0];

    console.log('🏟️ Inserting venues...');
    const insertedVenues = await db
      .insert(venues)
      .values([
        {
          name: 'Test Venue',
          address: '456 Venue St',
          capacity: 1000,
        },
      ])
      .returning();

    const venue = insertedVenues[0];

    console.log('🎤 Inserting events...');
    const insertedEvents = await db
      .insert(events)
      .values([
        {
          title: 'Sample Event',
          description: 'Just for testing.',
          venue_id: venue.venue_id,
          category: 'Test',
          date: '2025-08-01',
          time: '18:00',
          ticket_price: '99.99',
          tickets_total: 100,
        },
      ])
      .returning();

    const event = insertedEvents[0];

    console.log('📦 Inserting bookings...');
    const insertedBookings = await db
      .insert(bookings)
      .values([
        {
          user_id: user.user_id,
          event_id: event.event_id,
          quantity: 2,
          total_amount: '199.98',
          booking_status: 'Confirmed',
        },
      ])
      .returning();

    const booking = insertedBookings[0];

    console.log('💰 Inserting payments...');
    await db.insert(payments).values([
      {
        user_id: user.user_id,
        booking_id: booking.booking_id,
        amount: '199.98',
        payment_status: 'Paid',
        payment_method: 'Stripe',
        transaction_id: 'txn_test_001',
      },
    ]);

    console.log('🛠️ Inserting support tickets...');
    await db.insert(supportTickets).values([
      {
        user_id: user.user_id,
        subject: 'Test Issue',
        description: 'This is a test ticket.',
        status: 'Open',
      },
    ]);

    console.log('✅ Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
