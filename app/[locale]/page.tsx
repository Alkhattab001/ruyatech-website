import Hero from '@/components/Hero';
import Services from '@/components/Services';
import HowWeWork from '@/components/HowWeWork';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="overflow-x-hidden relative z-10">
      <Hero />
      <Services />
      <HowWeWork />
      <Contact />
    </main>
  );
}
