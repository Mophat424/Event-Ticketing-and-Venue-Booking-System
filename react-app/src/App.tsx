// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Nav from "./components/Nav/Nav";
// import Home from "./components/Home/Home";
// import About from "./components/About/About";
// import AdminDashboard from "./dashboard/AdminDashboard";
// import UserDashboard from "./dashboard/UserDashboard";
// import Landing from "./pages/Landing";
// import Error from "./components/Error/Error";
// import Dashboard from "./dashboards/Dashboard";

// const App = () => {
//   return (
//     <Router>
//       <Nav />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/landing" element={<Landing />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/dashboard/admin" element={<AdminDashboard />} />
//         <Route path="/dashboard/user" element={<UserDashboard />} />
//         <Route path="*" element={<Error />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import AdminDashboard from "./dashboard/AdminDashboard";
import UserDashboard from "./dashboard/UserDashboard";
import Landing from "./pages/Landing";
import Error from "./components/Error/Error";
import Dashboard from "./dashboards/Dashboard";

const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;
