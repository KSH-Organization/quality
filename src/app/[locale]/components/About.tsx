import Image from "next/image";
export default function About() {
  return (
    <section id="about" className="bg-white max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-bold text-purple-700 mb-6">
          Welcome to <span className="text-yellow-500">Q</span> Supply Chain
        </h2>
        <p className="text-gray-600">
          At Q Supply Chain, we believe that supply chains are more than just pathways for goods to travel –
          they are bridges connecting the world to endless opportunities and challenges.
          Through our integrated logistics solutions, we help turn ideas and ambitions into reality.
        </p>
      </div>
      <Image src="/Illustration.png" alt="About illustration" className="rounded-lg shadow-lg" width={500} height={300} />
    </section>
  );
}
