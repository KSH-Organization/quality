import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <main className="flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="grid md:grid-cols-2 gap-12 py-20 px-6 items-center max-w-5xl">
            <div>
              <h2 className="text-4xl font-bold text-purple-700 mb-6">About Us</h2>
              <p className="text-gray-600 leading-relaxed">
                Q Supply Chain is an investment of the Kuwait-Sudan Holding Company,
                established to be the trusted provider of premium logistics solutions in Sudan.
                We are the only company offering comprehensive services in supply chains
                with high professionalism and advanced technology, backed by the largest and most
                advanced storage facilities in the country.
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                With over 20,000 square meters of storage space and stacking heights exceeding
                17 meters, we offer flexible and innovative solutions that cater to every type
                of product in varying sizes, weights, and lengths.
              </p>
            </div>
            <Image
              src="/Illustration.png"
              alt="About illustration"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-gray-50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="bg-purple-700 text-white 
          rounded-tl-3xl rounded-br-3xl rounded-tr-none rounded-bl-none
          shadow-lg 
          max-w-5xl w-full 
          p-12 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <p className="leading-relaxed">
                We aspire to be the leader in the supply chain industry in Sudan,
                offering our local and international clients innovative and
                efficient solutions to streamline the movement of goods and
                distribution. Our vision is to help strengthen the Sudanese
                economy by becoming a trusted partner to our clients, through
                safety, reliability, and excellence in service.
              </p>
            </div>
            <Image
              src="/Rectangle 728-1.png"
              alt="Vision"
              width={400}
              height={280}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="bg-purple-700 text-white 
          rounded-tl-3xl rounded-br-3xl rounded-tr-none rounded-bl-none
          shadow-lg 
          max-w-5xl w-full 
          p-12 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
              <p className="leading-relaxed">
                At Q Supply Chain, our mission is to provide integrated,
                technology-driven solutions in supply chain services that meet
                the needs of our clients across purchasing, shipping, customs
                clearance, storage, distribution, and door-to-door delivery. We
                aim to be the number one choice for all our clients by offering
                unparalleled service while ensuring the highest levels of safety
                and quality.
              </p>
            </div>
            <Image
              src="/Rectangle 728.png"
              alt="Mission"
              width={400}
              height={280}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="text-center max-w-5xl w-full">
            <h3 className="text-3xl font-bold text-purple-700 mb-12">Our Objectives</h3>
            <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Continuous Innovation",
                desc: "We strive to continuously enhance our services by adopting the latest technologies and systems.",
                icon: "/mdi_lightbulb-on-outline.svg",
              },
              {
                title: "Excellence in Quality",
                desc: "Our focus is on delivering top-quality services with meticulous attention to detail.",
                icon: "/mdi_star-check-outline.svg",
              },
              {
                title: "Safety & Reliability",
                desc: "We are committed to providing secure and reliable storage environments, backed by advanced fire suppression systems.",
                icon: "/mdi_shield-check-outline.svg",
              },
              {
                title: "Expansion & Leadership",
                desc: "We aim for sustainable growth and expansion in both the local and regional markets.",
                icon: "/mdi_trending-up.svg",
              },
              {
                title: "Investment in Human Capital",
                desc: "We believe in the power of human resources and are dedicated to training and developing our team.",
                icon: "/oui_users.svg",
              },
              {
                title: "Transfer Our Experience",
                desc: "We aim to transfer our exceptional experience and expand it across Sudan and Africa.",
                icon: "/famicons_earth-outline.svg",
              },
            ].map((obj, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <Image
                  src={obj.icon}
                  alt={obj.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 mx-auto mb-4"
                />
                <h4 className="font-semibold text-lg mb-2 text-gray-800">
                  {obj.title}
                </h4>
                <p className="text-gray-600 text-sm">{obj.desc}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
