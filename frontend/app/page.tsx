import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryShowcase from "@/components/CategoryShowcase";
import CategorySections from "@/components/CategorySections";
import StatsCounter from "@/components/StatsCounter";


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>
          <ProductGrid featured={true} />
        </div>
      </section>

      {/* Category Sections with Products */}
      <CategorySections />

      <Footer />
    </div>
  );
}

