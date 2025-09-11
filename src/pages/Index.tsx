import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  MapPin, 
  AlertTriangle, 
  ArrowRight,
  Smartphone,
  Eye,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-safety.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Real-time Safety Tracking",
      description: "Live location monitoring with intelligent risk detection and emergency alerts"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Group Coordination",
      description: "Keep your team connected with proximity alerts and leader dashboards"
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Event Alerts",
      description: "Instant notifications about local risks, weather, and safety concerns"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Offline Support", 
      description: "Works even without internet - location cached and synced when connected"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Family Visibility",
      description: "Give peace of mind to families with controlled location sharing"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant SOS",
      description: "One-tap emergency alerts to authorities, guides, and emergency contacts"
    }
  ];

  const useCases = [
    "Solo bike tours and treks",
    "Group expeditions and adventures", 
    "Large events (Kumbh Mela, marathons)",
    "Tourist group coordination",
    "Emergency response scenarios"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-safety/5">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-hero text-primary-foreground">
                  SIH 2024 Innovation
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Tourist Group
                  <span className="bg-gradient-hero bg-clip-text text-transparent block">
                    Safety & Tracking
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Revolutionary safety platform combining real-time tracking, community coordination, and emergency response for adventurers across India.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={() => navigate('/mode-selection')}
                  className="text-lg px-8 py-6"
                >
                  Start Your Adventure
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="text-lg px-8 py-6"
                >
                  View Demo Dashboard
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-safety" />
                  <span>10,000+ Safe Adventures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>500+ Tour Groups</span>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-12">
              <img 
                src={heroImage} 
                alt="Tourist Safety Tracking"
                className="w-full rounded-2xl shadow-2xl shadow-primary/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Safety Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with practical safety measures to protect every type of adventure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-primary transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-safety/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">Perfect For Every Adventure</h2>
                <p className="text-xl text-muted-foreground">
                  From solo expeditions to large-scale events, our platform adapts to provide the right level of safety and coordination.
                </p>
              </div>
              
              <div className="space-y-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-safety rounded-full" />
                    <span className="text-lg">{useCase}</span>
                  </div>
                ))}
              </div>
              
              <Button variant="safety" size="lg" onClick={() => navigate('/mode-selection')}>
                Explore Safety Modes
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-safety/10 border-safety/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-safety">
                    <MapPin className="w-5 h-5" />
                    Real Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-4">
                    "During our Manali-Leh expedition, this app helped us locate a teammate who had bike trouble 2 hours behind the group. The real-time tracking was a lifesaver!"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    - Adventure Tours India
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-hero/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Shield className="w-5 h-5" />
                    Family Peace of Mind
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-4">
                    "As a mother, being able to track my son's trekking group gave me such relief. The app's alerts kept me informed without being intrusive."
                  </p>
                  <p className="text-sm text-muted-foreground">
                    - Parent Testimonial
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Make Your Adventures Safer?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of adventurers who trust our platform for their safety. Start your protected journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/mode-selection')}
              className="bg-background/10 border-primary-foreground/20 text-primary-foreground hover:bg-background/20 text-lg px-8 py-6"
            >
              Choose Your Mode
            </Button>
            <Button 
              variant="safety" 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="text-lg px-8 py-6"
            >
              Try Demo Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
