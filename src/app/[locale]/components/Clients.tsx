import Image from "next/image";
export default function Clients() {
  return (
    <section id="clients" className="bg-white py-16 px-6 text-center">
      {/* Our Clients Section */}
      <div className="mb-[104px]">
        <h2 className="text-3xl font-bold text-purple-700 mb-10">Our Clients</h2>
        <div className="flex flex-wrap justify-center gap-32">
          <Image src="/Logo-5.png" alt="Client 1" className="h-16" width={271} height={70} />
          <Image src="/Logo-1.png" alt="Client 2" className="h-16" width={251} height={70} />
          <Image src="/Logo-3.png" alt="Client 3" className="h-16" width={193} height={116} />
        </div>
      </div>

      {/* Strategic Partners Section */}
      <div>
        <h2 className="text-3xl font-bold text-purple-700 mb-10">Strategic Partners</h2>
        <div className="flex flex-wrap justify-center gap-20">
          <Image src="/Logo-2.png" alt="Partner 1" className="h-16" width={100} height={100} />
          <Image src="/Logo-1.png" alt="Partner 2" className="h-16" width={100} height={100} />
          <Image src="/tad.jpg" alt="Partner 3" className="h-16" width={100} height={100} />
          <Image src="/Logo.png" alt="Partner 4" className="h-16" width={100} height={100} />
        </div>
      </div>
    </section>
  );
}
