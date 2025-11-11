import { auth } from "@/app/(auth)/auth";
import { ServiceCards } from "@/components/custom/service-cards";
import Hero from "@/components/custom/hero";
import { FeaturesGrid } from "@/components/custom/features-grid";
import { ProcessSection } from "@/components/custom/process-section";
import { RecomendedProcessSection } from "@/components/custom/recomended-process-section";

import { TestimonialsSection } from "@/components/custom/testimonials-section";
import { TechStackSection } from "@/components/custom/tech-stack-section";
import { StatsSection } from "@/components/custom/stats-section";
import { IndustriesSection } from "@/components/custom/industries-section";
import FeaturedProducts from "@/components/custom/featured-products";
import Features from "@/components/custom/features";
import NewsletterSignup from "@/components/custom/newsletter-signup";
import { PortfolioSection } from "@/components/custom/portfolio-section";
import { AboutSection } from "@/components/custom/about-section";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      {/* Hero Section with Background Image */}
      <Hero />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Portfolio Section */}
      <PortfolioSection />
      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-16" id="services">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            שירותים דיגיטליים 360°
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            פלטפורמה אחת מקיפה לכל הצרכים הדיגיטליים שלך. מפיתוח להטמעה,
            אבטחת סייבר לפתרונות ענן - אנו מספקים הכל תחת קורת גג אחת.
          </p>
        </div>

        <ServiceCards />
      </div>

<RecomendedProcessSection />
      


      {/* Featured Products Section */}
      <FeaturedProducts />

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

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            מוכנים לשנות את הנוכחות הדיגיטלית שלכם?
          </h3>
          <p className="text-zinc-300 mb-6">
            הצטרפו לאלפי עסקים ואנשים פרטיים שסומכים על mytx.one לפתרונות דיגיטליים מלאים.
          </p>
          <div className="flex flex-col sm:flex-row-reverse gap-4 justify-center">
            <a 
              href="https://wa.me/972515511581?text=שלום, אני מעוניין ללמוד עוד על השירותים שלכם"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors text-center"
            >
              התחילו היום
            </a>
            <a 
              href="https://wa.me/972515511581?text=שלום, אני זקוק למידע נוסף"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors text-center"
            >
              למידע נוסף
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>
    </div>
  );
}