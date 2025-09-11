import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, MapPin, AlertTriangle } from "lucide-react";

interface SafetyModeCardProps {
  mode: "solo" | "group";
  title: string;
  description: string;
  features: string[];
  onClick: () => void;
  icon: React.ReactNode;
  imageSrc: string;
}

export const SafetyModeCard = ({ 
  mode, 
  title, 
  description, 
  features, 
  onClick, 
  icon,
  imageSrc 
}: SafetyModeCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-2 hover:border-primary/50 hover:shadow-primary transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-safety/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </div>
        <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-safety rounded-full" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onClick}
          variant={mode === "solo" ? "hero" : "safety"}
          className="w-full"
          size="lg"
        >
          {mode === "solo" ? "Start Guardian Mode" : "Create/Join Group"}
        </Button>
      </CardContent>
    </Card>
  );
};