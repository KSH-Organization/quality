import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Clients from "./components/Clients";
import Services from "./components/Services";
import Footer from "./components/Footer";
import Different from "./components/Different";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <Hero />
      <About />
      <Clients />
      <Different />
      <Services />
      <Footer />
    </main>
  );
}
