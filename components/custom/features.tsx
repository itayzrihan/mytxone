import { Shield, Clock, Award, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "אבטחה מאומתת",
    description: "אבטחה ברמה ארגונית והגנת מידע מקיפה לכל הפרויקטים שלכם",
  },
  {
    icon: Clock,
    title: "תמיכה 24/7",
    description: "תמיכת מומחים מסביב לשעון כדי לשמור על המערכות שלכם פעילות בצורה חלקה",
  },
  {
    icon: Award,
    title: "מובילים בתעשייה",
    description: "פתרונות עטורי פרסים שמהימנים על ידי אלפי עסקים ברחבי העולם",
  },
  {
    icon: Zap,
    title: "מהירות בזק",
    description: "ביצועים מיטביים וזמני הטמעה מהירים במיוחד",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 md:px-8 lg:px-12" dir="rtl">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            למה לבחור ב-<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">mytx.one</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            היעד המוביל לפתרונות דיגיטליים מקיפים
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
                <h3 className="text-xl font-bold mb-2 text-right">{feature.title}</h3>
                <p className="text-muted-foreground text-sm text-right">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
