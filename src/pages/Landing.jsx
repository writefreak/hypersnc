import "../styles/landing.css";
import Navbar from "../components/landing/Navbar.jsx";
import Hero from "../components/landing/Hero.jsx";
import FileTypes from "../components/landing/FileTypes.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import Benefits from "../components/landing/Benefits.jsx";
import Limits from "../components/landing/Limits.jsx";
import Faq from "../components/landing/Faq.jsx";
import CtaBand from "../components/landing/CtaBand.jsx";
import Footer from "../components/landing/Footer.jsx";

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FileTypes />
        <HowItWorks />
        <Benefits />
        <Limits />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
