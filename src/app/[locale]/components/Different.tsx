import Link from "next/link";

export default function Different() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text Section */}
        <div>
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-purple-700">What Makes Us </span>
            <span className="text-yellow-500">Different</span>
            <span className="text-purple-700">?</span>
          </h2>

          <p className="text-gray-600 mb-4">
            At Q Supply Chain, we provide integrated solutions powered by the
            latest technologies, ensuring enhanced efficiency and minimizing
            errors through our advanced electronic system. We offer cutting-edge
            tools, equipment, and a highly qualified team to deliver top-tier
            services.
          </p>

          <p className="text-gray-600 mb-4">
            Our focus is on maximizing shareholder value by leveraging our deep
            understanding of the fastest-growing global markets. We also possess
            high-value assets through our companies and investment partners in
            emerging markets.
          </p>

          <p className="text-gray-600 mb-8">
            We are committed to sustainability in all our operations and
            prioritize supporting small industries by providing dedicated
            warehouses and facilities that cater to their needs, helping them
            grow and thrive sustainably.
          </p>

          {/* Button */}
          <Link href="/about">
            <button className="bg-purple-700 text-white px-6 py-3 rounded-md hover:bg-purple-800 transition-colors">
              About Us
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src="/different.png" // ضع الصورة في public/different.png
            alt="What makes us different illustration"
            className="w-[400px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}
