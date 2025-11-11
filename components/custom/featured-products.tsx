import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "פיתוח אתרים",
    category: "תוכנה",
    price: "מותאם אישית",
    specs: "React • Next.js • Full Stack",
  },
  {
    id: 2,
    name: "אפליקציות מובייל",
    category: "פיתוח",
    price: "מותאם אישית",
    specs: "iOS • Android • חוצה פלטפורמות",
  },
  {
    id: 3,
    name: "פתרונות ענן",
    category: "תשתית",
    price: "מותאם אישית",
    specs: "AWS • Azure • ניתן להרחבה",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-24 px-6 md:px-8 lg:px-12" dir="rtl">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            מוצרים דיגיטליים
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            המוצרים הדיגיטליים שלנו
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            פתרונות חדשניים שתוכננו לשנות את הנוכחות הדיגיטלית שלכם
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border bg-card hover:shadow-elegant transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/hero.webp"
                  alt={product.name}
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Button
                  variant="default"
                  size="sm"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
                >
                  <Eye className="ml-2 h-4 w-4" />
                  צפו בפרטים
                </Button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3 flex-row-reverse">
                  <div className="text-right">
                    <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/50">
                    {product.price}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground text-right">{product.specs}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <a href="#tech-stack">
            <Button variant="default" size="lg">
              צפו באוסף המלא
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
