import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "CTO, TechStart Inc.",
    company: "SaaS Platform",
    content: "mytx.one transformed our entire digital infrastructure. Their 360° approach covered everything from app development to cloud migration. The results exceeded our expectations.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    position: "CEO, InnovateLabs",
    company: "AI Startup",
    content: "The cybersecurity and AI expertise at mytx.one is unmatched. They secured our platform and implemented cutting-edge ML features that tripled our user engagement.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    position: "Director, GlobalTech Solutions",
    company: "Enterprise Software",
    content: "From hardware prototyping to full-scale deployment, mytx.one handled our complex IoT project flawlessly. Their team's expertise across all domains is incredible.",
    rating: 5,
    avatar: "ER"
  },
  {
    name: "David Park",
    position: "Founder, NextGen Retail",
    company: "E-commerce Platform",
    content: "The video production and web development services created a stunning brand presence. mytx.one's comprehensive approach saved us time and delivered exceptional quality.",
    rating: 5,
    avatar: "DP"
  },
  {
    name: "Lisa Thompson",
    position: "VP Engineering, DataFlow Corp",
    company: "Big Data Analytics",
    content: "Their cloud architecture and data management solutions scaled our platform to handle millions of users. The 24/7 support and optimization services are invaluable.",
    rating: 5,
    avatar: "LT"
  },
  {
    name: "James Wilson",
    position: "Product Manager, HealthTech Pro",
    company: "Healthcare Platform",
    content: "mytx.one delivered a HIPAA-compliant platform with telemedicine features, AI diagnostics, and secure cloud infrastructure. Their healthcare expertise is outstanding.",
    rating: 5,
    avatar: "JW"
  }
];

export function TestimonialsSection() {
  return (
    <div className="py-16 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            Trusted by businesses worldwide for delivering exceptional digital solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-cyan-400 mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-zinc-300 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 font-semibold mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-zinc-400 text-sm">{testimonial.position}</div>
                  <div className="text-cyan-400 text-xs">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-1">
            <span className="text-yellow-400">★★★★★</span>
            <span className="text-zinc-400 ml-2">4.9/5 average rating from 200+ reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}