"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "להפנט את היקום. ספר דיגיטלי",
    category: "Digital Book",
    price: "₪99.00",
    image: "/images/hero.webp",
    type: "virtual",
  },
  {
    id: 2,
    name: "כרטיס כניסה – המסלול למיליון",
    category: "Access Pass",
    price: "₪750.00",
    image: "/images/hero.webp",
    type: "virtual",
  },
  {
    id: 3,
    name: "מיקו סם פאפא וסו",
    category: "Digital Product",
    price: "₪19.90",
    image: "/images/hero.webp",
    type: "virtual",
  },
  {
    id: 4,
    name: "שיטת Sense – לשלוט במציאות",
    category: "Course",
    price: "₪19.90",
    image: "/images/hero.webp",
    type: "virtual",
  },
  {
    id: 5,
    name: "קורס שיווק ומכירות",
    category: "Course",
    price: "₪29.90",
    image: "/images/hero.webp",
    type: "physical",
  },
  {
    id: 6,
    name: "כובע PLER",
    category: "Merchandise",
    price: "₪250.00",
    image: "/images/hero.webp",
    type: "physical",
  },
  {
    id: 7,
    name: "כובע יהלום מיטיקס",
    category: "Merchandise",
    price: "₪250.00",
    image: "/images/hero.webp",
    type: "physical",
  },
  {
    id: 8,
    name: "כובע יהלום PLER",
    category: "Merchandise",
    price: "Contact for Price",
    image: "/images/hero.webp",
    type: "physical",
  },
  {
    id: 9,
    name: "חולצת מיטיקס",
    category: "Merchandise",
    price: "Contact for Price",
    image: "/images/hero.webp",
    type: "physical",
  },
  {
    id: 10,
    name: "חולצת PLER",
    category: "Merchandise",
    price: "Contact for Price",
    image: "/images/hero.webp",
    type: "physical",
  },
  {
    id: 11,
    name: "משתמש Verified",
    category: "Membership",
    price: "Contact for Price",
    image: "/images/hero.webp",
    type: "virtual",
  },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Page Header */}
      <div className="py-16 px-6 md:px-8 lg:px-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">Shop</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore our curated collection of digital products, courses, and exclusive merchandise
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Add to Cart Button on Hover */}
                <Button
                  variant="default"
                  size="sm"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-primary border-primary/50 whitespace-nowrap ml-2"
                  >
                    {product.type === "virtual" ? "Digital" : "Physical"}
                  </Badge>
                </div>
                
                {/* Price */}
                <div className="text-lg font-bold text-primary mb-4">
                  {product.price}
                </div>

                {/* View Details Button */}
                <Button 
                  variant="outline" 
                  className="w-full border-primary/50 text-primary hover:bg-primary/10"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
