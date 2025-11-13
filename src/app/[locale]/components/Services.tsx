const services = [
  {
    title: "Purchasing and Contracting",
    desc: "We ensure the timely and cost-effective provision of our clients' needs by contracting with suppliers and agents both locally and internationally, ensuring all requirements are met efficiently and effectively.",
    img: "/image-4.png",
  },
  {
    title: "Shipping, Transportation, and Customs Clearance",
    desc: "We rely on a fleet of vehicles that provides full logistical support and door-to-door delivery services. Additionally, we offer cargo tracking services and simplify all customs clearance procedures to ensure timely delivery of goods.",
    img: "/image-2.png",
  },
  {
    title: "Storage",
    desc: `We provide suitable storage environments for various types of goods, offering a wide range of space options (cubic meters, square, linear) and different storage solutions (dry, refrigerated, frozen, indoor, and outdoor). We utilize the latest systems and global quality standards, with 24-hour monitoring and fire suppression systems to ensure both the safety of the goods and the protection of our workforce.
    
Specialized Storage Solutions
We offer integrated storage solutions that include:
- Dry Storage: Suitable for all goods that do not require special conditions.
- Refrigerated and Frozen Storage: For products that need to be kept at low temperatures.
- Outdoor Storage: For large-scale goods or items not affected by weather conditions.
- Indoor Storage: Ensuring safety and protection for valuable or sensitive goods.`,
    img: "/image-5.png",
  },
  {
    title: "Integrated Logistics Solutions (2PL, 3PL, 4PL, 5PL)",
    desc: "We offer a variety of integrated logistics solutions tailored to meet your unique needs, whether under your direct management or through our management on your behalf, we are here to provide solutions tailored to your specific requirements from basic supply chain management to fully comprehensive solutions.",
    img: "/image-1.png",
  },
  {
    title: "Electronic Archiving",
    desc: "Q Company is a leading provider of electronic archiving solutions and digital document management services. The company offers comprehensive services aimed at digitizing and securely archiving documents, making it easier and faster to access and retrieve them.",
    img: "/image-3.png",
  },
  {
    title: "Quality",
    desc: "At Quality Company, we consider quality to be our identity and our motto. Therefore, we ensure global quality standards in all our services, monitoring the flow of supply chain operations and ensuring that all procedures and forms are completed correctly. We provide regular reports, continuously train our team, and maintain an excellent working environment, with a strong focus on customer needs and satisfaction to guarantee complete client satisfaction.",
    img: "/image.png",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-gray-50 py-20 px-6">
      <h2 className="text-3xl font-bold text-[#5F349C] text-center mb-16">
        Our Services
      </h2>

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {services.map((s, i) => (
          <div
            key={i}
            className={`bg-white rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-8 p-8 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="flex-shrink-0 w-full md:w-1/3">
              <img
                src={s.img}
                alt={s.title}
                className="rounded-lg shadow-md w-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-4 text-black">{s.title}</h3>
              <p className="text-gray-600 whitespace-pre-line">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
