import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Smartphone, Shield, HardDrive, Cloud, Cpu, Code, Database, Globe, Zap } from "lucide-react";

const services = [
  {
    icon: Video,
    title: "הפקת וידאו",
    description: "שירותי עריכת וידאו מקצועית, מוצ'ן גרפיקס והפקות מולטימדיה.",
    color: "text-cyan-400"
  },
  {
    icon: Smartphone,
    title: "פיתוח אפליקציות",
    description: "אפליקציות מובייל נייטיב וחוצות פלטפורמות, אפליקציות ווב ופתרונות תוכנה.",
    color: "text-blue-400"
  },
  {
    icon: Shield,
    title: "אבטחת סייבר",
    description: "פתרונות אבטחה מתקדמים, בדיקות חדירה ושירותי הגנה מפני איומים.",
    color: "text-red-400"
  },
  {
    icon: HardDrive,
    title: "פתרונות חומרה",
    description: "עיצוב חומרה מותאם אישית, מכשירי IoT ופיתוח מערכות משובצות.",
    color: "text-orange-400"
  },
  {
    icon: Cloud,
    title: "תשתית ענן",
    description: "פתרונות ענן ניתנים להרחבה, DevOps ושירותי תשתית כקוד.",
    color: "text-purple-400"
  },
  {
    icon: Cpu,
    title: "בינה מלאכותית ולמידת מכונה",
    description: "פתרונות חכמים, אנליטיקת נתונים ופיתוח מערכות אוטומטיות.",
    color: "text-green-400"
  },
  {
    icon: Code,
    title: "פיתוח תוכנה",
    description: "תוכנה מותאמת אישית, פיתוח API ופתרונות ארגוניים.",
    color: "text-yellow-400"
  },
  {
    icon: Database,
    title: "ניהול מידע",
    description: "עיצוב מסדי נתונים, אופטימיזציה ופתרונות ביג דאטה.",
    color: "text-pink-400"
  },
  {
    icon: Globe,
    title: "פיתוח אתרים",
    description: "אתרים מודרניים, פלטפורמות מסחר אלקטרוני ואפליקציות ווב.",
    color: "text-indigo-400"
  },
  {
    icon: Zap,
    title: "ייעוץ דיגיטלי",
    description: "טרנספורמציה דיגיטלית אסטרטגית ושירותי ייעוץ טכנולוגי.",
    color: "text-emerald-400"
  }
];

export function ServiceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6" dir="rtl">
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