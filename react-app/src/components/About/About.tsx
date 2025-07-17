import concertImage from '../../assets/images/concert.jpg';
 
const About = () => {
  return (
    <div className="about-container">
      <h1>About EventMaster</h1>

      <img
        src={concertImage}
        alt="Concert"
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: "12px",
          marginBottom: "1rem",
        }}
      />

      <p>
        EventMaster is your all-in-one solution for discovering, booking, and managing events — whether you're an event-goer or an organizer.
        We've made it simple, secure, and stress-free to connect with events that matter to you.
      </p>

      <h2> For Attendees</h2>
      <p>
        Explore a wide range of events, from concerts and conferences to workshops and festivals. Book your tickets in just a few clicks and access them anytime from your personalized dashboard.
      </p>

      <h2> For Organizers</h2>
      <p>
        Create and manage your events with ease. Track bookings, monitor performance, and communicate with attendees — all in one secure place.
      </p>

      <h2>Why EventMaster?</h2>
      <ul>
        <li>Fast and easy ticket booking</li>
        <li>Secure OTP-based login</li>
        <li>Dashboards tailored for users and admins</li>
        <li>Clean, user-friendly design</li>
      </ul>

      <h2> Our Mission</h2>
      <p>
        We’re here to make event planning and participation effortless.
        Whether you're throwing a party or attending a concert, EventMaster is your trusted companion from start to finish.
      </p>
    </div>
  );
};

export default About;
