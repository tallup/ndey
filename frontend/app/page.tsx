import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="mt-2 text-gray-600">Discover our handpicked selection</p>
          </div>
          <ProductGrid featured={true} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

