import { Shield, Clock, Award, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Verified Security",
    description: "Enterprise-grade security and comprehensive data protection for all your projects",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock expert support to keep your systems running smoothly",
  },
  {
    icon: Award,
    title: "Industry Leading",
    description: "Award-winning solutions trusted by thousands of businesses worldwide",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance and lightning-fast deployment times",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 md:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">mytx.one</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The premier destination for comprehensive digital solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 border-border bg-card hover:bg-card/80 hover:shadow-lg transition-all duration-500 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
