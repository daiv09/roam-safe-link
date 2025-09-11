import { SafetyModeCard } from "@/components/SafetyModeCard";
import { Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import soloSafetyIcon from "@/assets/solo-safety-icon.png";
import groupTrackingIcon from "@/assets/group-tracking-icon.png";

const ModeSelection = () => {
  const navigate = useNavigate();

  const soloFeatures = [
    "Live location sharing with family/friends",
    "Real-time event & risk alerts",
    "Emergency SOS with auto-alerts",
    "Staff/guide connectivity",
    "Offline location caching",
    "Battery & network monitoring"
  ];

  const groupFeatures = [
    "Real-time group member tracking",
    "Digital group formation with QR/codes", 
    "Group chat & pre-trip planning",
    "Leader dashboard with member status",
    "Proximity alerts for strayed members",
    "Geo-fencing with route boundaries"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-safety/5 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Choose Your Safety Mode
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the protection level that matches your adventure. Whether you're exploring solo or with a group, we've got your safety covered.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <SafetyModeCard
            mode="solo"
            title="Guardian Mode"
            description="Perfect for solo travelers, individual hikers, and independent adventurers who want to stay connected and protected."
            features={soloFeatures}
            onClick={() => navigate('/guardian')}
            icon={<Shield className="w-6 h-6" />}
            imageSrc={soloSafetyIcon}
          />

          <SafetyModeCard
            mode="group"
            title="Team Tracking"
            description="Ideal for group tours, team adventures, and organized expeditions where coordination and collective safety are key."
            features={groupFeatures}
            onClick={() => navigate('/dashboard')}
            icon={<Users className="w-6 h-6" />}
            imageSrc={groupTrackingIcon}
          />
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Trusted by 10,000+ adventurers across India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;