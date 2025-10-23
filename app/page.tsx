import { auth } from "@/app/(auth)/auth";
import { ServiceCards } from "@/components/custom/service-cards";
import { HeroSection } from "@/components/custom/hero-section";
import { FeaturesGrid } from "@/components/custom/features-grid";
import { ProcessSection } from "@/components/custom/process-section";
import { TestimonialsSection } from "@/components/custom/testimonials-section";
import { TechStackSection } from "@/components/custom/tech-stack-section";
import { StatsSection } from "@/components/custom/stats-section";
import { IndustriesSection } from "@/components/custom/industries-section";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="h-[20vh] md:hidden" />
      <HeroSection />

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            360° Digital Services
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            One comprehensive platform for all your digital needs. From development to deployment,
            cybersecurity to cloud solutions - we provide everything under one roof.
          </p>
        </div>

        <ServiceCards />
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* Process Section */}
      <ProcessSection />

      {/* Industries Section */}
      <IndustriesSection />

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <FeaturesGrid />
      </div>

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Digital Presence?
          </h3>
          <p className="text-zinc-300 mb-6">
            Join thousands of businesses and individuals who trust mytx.one for their complete digital solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors">
              Get Started Today
            </button>
            <button className="px-8 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="backdrop-blur-md bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-zinc-400 mb-6">
            Get the latest insights on digital transformation, technology trends, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}