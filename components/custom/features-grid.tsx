import { CheckCircle, Clock, Users, Award, ShieldCheck, Rocket } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "End-to-End Solutions",
    description: "Complete project lifecycle management from concept to deployment and maintenance."
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock technical support and monitoring for all your digital services."
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Highly skilled professionals with years of experience in diverse technologies."
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Rigorous testing and quality control processes for reliable deliverables."
  },
  {
    icon: ShieldCheck,
    title: "Security First",
    description: "Enterprise-grade security measures and compliance with industry standards."
  },
  {
    icon: Rocket,
    title: "Scalable Solutions",
    description: "Future-proof architectures that grow with your business needs."
  }
];

export function FeaturesGrid() {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Why Choose mytx.one?
        </h2>
        <p className="text-zinc-300 max-w-2xl mx-auto">
          We combine expertise, innovation, and reliability to deliver exceptional digital solutions
          that drive your business forward.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}