import { Card } from "@/components/ui/card";
import { Globe, Apple } from "lucide-react";

const portfolioItems = [
  {
    title: "היי בוס",
    subtitle: "אפליקציה לניהול פרודקטיביות",
    description: "אפליקציה חכמה לניהול משימות ופרודקטיביות אישית",
    links: [
      {
        label: "Web",
        url: "https://heybos.me",
        icon: Globe
      },
      {
        label: "iOS",
        url: "https://apps.apple.com/app/id6748549988",
        icon: Apple
      }
    ],
    tech: "React Native • Cross Platform",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "מניין טו גו",
    subtitle: "אפליקציה למציאת מניין קרוב",
    description: "מצאו מניינים קרובים בקלות - פתרון חכם למציאת מקום תפילה",
    links: [
      {
        label: "Website",
        url: "https://minyantogo.com",
        icon: Globe
      }
    ],
    tech: "React Native • Cross Platform",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "משק דניאל",
    subtitle: "חנות אי-קומרס למוצרי חקלאות",
    description: "חנות אלקטרונית חדשנית למכירת ירקות ופרחים מהמשק - סטורי ההצלחה שלי",
    links: [
      {
        label: "Website",
        url: "https://meshekdaniel.shop",
        icon: Globe
      }
    ],
    tech: "WordPress • WooCommerce • E-Commerce",
    color: "from-green-500 to-emerald-500"
  }
];

export function PortfolioSection() {
  return (
    <section className="py-24 px-6 md:px-8 lg:px-12" dir="rtl" id="portfolio">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            פרויקטים שפיתחתי
          </h2>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
            דוגמאות של עבודות שנמסרו בהצלחה ופועלות בשוק היום
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20"
            >
              {/* Header with gradient */}
              <div className={`h-24 bg-gradient-to-r ${item.color} opacity-80 relative`}>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-1 text-right">
                  {item.title}
                </h3>
                <p className="text-cyan-400 text-sm mb-3 text-right font-medium">
                  {item.subtitle}
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4 text-right">
                  {item.description}
                </p>

                {/* Links */}
                <div className="flex gap-3 mb-4 justify-end">
                  {item.links.map((link, linkIndex) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 group/link"
                      >
                        <Icon className="w-4 h-4 text-cyan-400 group-hover/link:scale-110 transition-transform" />
                        <span className="text-sm text-cyan-400 font-medium">
                          {link.label}
                        </span>
                      </a>
                    );
                  })}
                </div>

                {/* Tech */}
                <p className="text-xs text-zinc-400 text-right border-t border-white/10 pt-4">
                  {item.tech}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
