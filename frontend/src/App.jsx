import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Amount from "./pages/Amount";
import Home from "./pages/Home";
import About from "./pages/About";

const Layout = ({ children }) => {
  const location = useLocation();
  
 
  const hideNavFooter = ["/login", "/register"].includes(location.pathname);
  
 
  const hideFooterOnly = location.pathname === "/amount";

  return (
    <>
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && !hideFooterOnly && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/amount" element={<Amount />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;