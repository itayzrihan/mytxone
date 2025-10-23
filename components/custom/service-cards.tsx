import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Smartphone, Shield, HardDrive, Cloud, Cpu, Code, Database, Globe, Zap } from "lucide-react";

const services = [
  {
    icon: Video,
    title: "Video Production",
    description: "Professional video editing, motion graphics, and multimedia production services.",
    color: "text-cyan-400"
  },
  {
    icon: Smartphone,
    title: "App Development",
    description: "Native and cross-platform mobile apps, web applications, and software solutions.",
    color: "text-blue-400"
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Advanced security solutions, penetration testing, and threat protection services.",
    color: "text-red-400"
  },
  {
    icon: HardDrive,
    title: "Hardware Solutions",
    description: "Custom hardware design, IoT devices, and embedded systems development.",
    color: "text-orange-400"
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Scalable cloud solutions, DevOps, and infrastructure as code services.",
    color: "text-purple-400"
  },
  {
    icon: Cpu,
    title: "AI & Machine Learning",
    description: "Intelligent solutions, data analytics, and automated systems development.",
    color: "text-green-400"
  },
  {
    icon: Code,
    title: "Software Development",
    description: "Custom software, API development, and enterprise solutions.",
    color: "text-yellow-400"
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Database design, optimization, and big data solutions.",
    color: "text-pink-400"
  },
  {
    icon: Globe,
    title: "Web Development",
    description: "Modern websites, e-commerce platforms, and web applications.",
    color: "text-indigo-400"
  },
  {
    icon: Zap,
    title: "Digital Consulting",
    description: "Strategic digital transformation and technology consulting services.",
    color: "text-emerald-400"
  }
];

export function ServiceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <Card key={index} className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                <Icon className={`w-8 h-8 ${service.color}`} />
              </div>
              <CardTitle className="text-white text-lg">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-zinc-400 text-center leading-relaxed">
                {service.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}