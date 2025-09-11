import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  Shield, 
  AlertTriangle, 
  Battery, 
  Signal,
  Navigation,
  Clock,
  Phone
} from "lucide-react";

interface GroupMember {
  id: string;
  name: string;
  status: "safe" | "warning" | "emergency";
  location: string;
  battery: number;
  signal: number;
  lastSeen: string;
}

const mockGroupMembers: GroupMember[] = [
  { id: "1", name: "Rahul", status: "safe", location: "Manali Highway", battery: 85, signal: 4, lastSeen: "2 mins ago" },
  { id: "2", name: "Priya", status: "warning", location: "Rohtang Pass", battery: 32, signal: 2, lastSeen: "5 mins ago" },
  { id: "3", name: "Arjun", status: "safe", location: "Keylong", battery: 67, signal: 3, lastSeen: "1 min ago" },
  { id: "4", name: "Sneha", status: "emergency", location: "Last seen: Leh Road", battery: 12, signal: 0, lastSeen: "15 mins ago" },
];

export const TrackingDashboard = () => {
  const [activeAlerts, setActiveAlerts] = useState(2);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "bg-safety text-safety-foreground";
      case "warning": return "bg-warning text-warning-foreground";
      case "emergency": return "bg-emergency text-emergency-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return <Shield className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "emergency": return <Phone className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Tracking Dashboard</h1>
            <p className="text-muted-foreground">Manali to Leh Bike Tour - Group Alpha</p>
          </div>
          <Button variant="emergency" size="lg">
            <Phone className="w-4 h-4" />
            Emergency SOS
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <Shield className="w-8 h-8 text-safety" />
              <div>
                <p className="text-2xl font-bold text-safety">2</p>
                <p className="text-sm text-muted-foreground">Safe</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <AlertTriangle className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">1</p>
                <p className="text-sm text-muted-foreground">Warning</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <Phone className="w-8 h-8 text-emergency" />
              <div>
                <p className="text-2xl font-bold text-emergency">1</p>
                <p className="text-sm text-muted-foreground">Emergency</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        {activeAlerts > 0 && (
          <Card className="border-warning bg-gradient-alert/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                Active Alerts ({activeAlerts})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-warning text-warning">WARNING</Badge>
                  <span>Priya - Low battery (32%)</span>
                </div>
                <Button variant="warning" size="sm">Contact</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-emergency/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="destructive">EMERGENCY</Badge>
                  <span>Sneha - No signal for 15 minutes</span>
                </div>
                <Button variant="emergency" size="sm">Send Help</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Group Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Group Members
            </CardTitle>
            <CardDescription>
              Real-time status and location of all tour members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGroupMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(member.status)}>
                        {getStatusIcon(member.status)}
                        {member.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {member.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Battery className="w-4 h-4" />
                      <span className={member.battery < 30 ? "text-warning" : "text-foreground"}>
                        {member.battery}%
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Signal className="w-4 h-4" />
                      <span className={member.signal === 0 ? "text-emergency" : "text-foreground"}>
                        {member.signal}/4
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {member.lastSeen}
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4" />
                      Locate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="safety" size="lg" className="h-16">
            <Shield className="w-5 h-5" />
            Safety Check-in
          </Button>
          <Button variant="hero" size="lg" className="h-16">
            <Users className="w-5 h-5" />
            Group Chat
          </Button>
          <Button variant="outline" size="lg" className="h-16">
            <MapPin className="w-5 h-5" />
            Share Location
          </Button>
        </div>
      </div>
    </div>
  );
};