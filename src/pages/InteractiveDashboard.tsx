import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Users, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Battery,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  Send,
  Crown,
  UserCheck,
  Navigation,
  Wifi,
  WifiOff
} from "lucide-react";

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'safe' | 'warning' | 'emergency';
  batteryLevel?: number;
  lastSeen?: Date;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'system' | 'alert';
}

const InteractiveDemo = () => {
  const [activeMode, setActiveMode] = useState<'solo' | 'group' | null>(null);
  const [userRole, setUserRole] = useState<'leader' | 'rider' | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSOS, setShowSOS] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupMembers, setGroupMembers] = useState<Location[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  // Simulated location data for solo mode
  const soloPath = [
    { lat: 28.6139, lng: 77.2090, status: 'safe' as const },
    { lat: 28.6149, lng: 77.2100, status: 'safe' as const },
    { lat: 28.6159, lng: 77.2110, status: 'warning' as const },
    { lat: 28.6169, lng: 77.2120, status: 'safe' as const },
  ];

  // Initialize group members
  useEffect(() => {
    if (activeMode === 'group') {
      setGroupMembers([
        { id: '1', name: 'Leader (You)', lat: 28.6139, lng: 77.2090, status: 'safe' as const, batteryLevel: 85, lastSeen: new Date() },
        { id: '2', name: 'Alex', lat: 28.6145, lng: 77.2095, status: 'safe' as const, batteryLevel: 92, lastSeen: new Date() },
        { id: '3', name: 'Sarah', lat: 28.6142, lng: 77.2088, status: 'safe' as const, batteryLevel: 67, lastSeen: new Date() },
        { id: '4', name: 'Mike', lat: 28.6180, lng: 77.2150, status: 'warning' as const, batteryLevel: 23, lastSeen: new Date() },
      ]);
    }
  }, [activeMode]);

  // GPS Location tracking
  useEffect(() => {
    let watchId: number;
    
    if (gpsEnabled && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsOnline(true);
        },
        (error) => {
          console.error('GPS Error:', error);
          setIsOnline(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [gpsEnabled]);

  // Simulation effect for demo purposes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && activeMode && !gpsEnabled) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1;
          if (activeMode === 'solo' && nextStep >= soloPath.length) {
            setIsRunning(false);
            return 0;
          }
          if (activeMode === 'group' && nextStep >= 8) {
            setIsRunning(false);
            return 0;
          }
          if (nextStep === 2 && activeMode === 'solo') {
            setShowSOS(true);
            setTimeout(() => setShowSOS(false), 3000);
          }
          if (nextStep === 3 && activeMode === 'group') {
            addSystemMessage("⚠️ Mike is moving away from the group! Distance: 150m");
          }
          return nextStep;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeMode, gpsEnabled]);

  // Auto messages for group mode
  useEffect(() => {
    if (activeMode === 'group' && userRole === 'leader') {
      const autoMessages = [
        { delay: 5000, message: "📍 Group check-in reminder: Please confirm your status" },
        { delay: 15000, message: "🔋 Battery levels are being monitored automatically" },
        { delay: 25000, message: "⚠️ Approaching restricted area - please stay together" }
      ];

      autoMessages.forEach(({ delay, message }) => {
        setTimeout(() => {
          if (isRunning) addSystemMessage(message);
        }, delay);
      });
    }
  }, [activeMode, userRole, isRunning]);

  const addSystemMessage = (content: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'System',
      content,
      timestamp: new Date(),
      type: 'system'
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const msg: Message = {
        id: Date.now().toString(),
        sender: userRole === 'leader' ? 'Leader' : 'Member',
        content: newMessage,
        timestamp: new Date(),
        type: 'user'
      };
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    }
  };

  const enableGPS = () => {
    if (navigator.geolocation) {
      setGpsEnabled(true);
    } else {
      alert('GPS is not supported by this browser');
    }
  };

  const startDemo = (mode: 'solo' | 'group', role?: 'leader' | 'rider') => {
    setActiveMode(mode);
    setUserRole(role || null);
    setCurrentStep(0);
    setIsRunning(true);
    setShowSOS(false);
    setMessages([]);
    
    if (mode === 'group' && role === 'leader') {
      addSystemMessage("👑 You are now the group leader. Monitor your team's safety.");
    } else if (mode === 'group' && role === 'rider') {
      addSystemMessage("👥 You've joined the group. Stay connected with your leader.");
    }
  };

  const togglePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setShowSOS(false);
  };

  const triggerSOS = () => {
    setShowSOS(true);
    setTimeout(() => setShowSOS(false), 3000);
  };

  return (
    <section id="demo" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Interactive Live Demo
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience both tracking modes with simulated real-time data. 
            See how our app keeps travelers safe and connected.
          </p>
        </div>

        {/* Mode Selection */}
        {!activeMode && (
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* GPS Setup */}
            <Card className="p-6 card-gradient safety-shadow">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold flex items-center justify-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  GPS Tracking Options
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant={gpsEnabled ? "default" : "outline"}
                    onClick={enableGPS}
                    disabled={gpsEnabled}
                  >
                    {gpsEnabled ? <Wifi className="w-4 h-4 mr-2" /> : <WifiOff className="w-4 h-4 mr-2" />}
                    {gpsEnabled ? "Real GPS Active" : "Enable Real GPS"}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {gpsEnabled ? "Using your device location" : "Or use simulated demo data"}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Solo Mode */}
              <Card className="p-8 card-gradient safety-shadow">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-safety-blue/20 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-safety-blue" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Solo Journey Mode</h3>
                    <p className="text-muted-foreground">
                      Experience individual tracking with guardian features, location sharing, 
                      and emergency SOS capabilities for solo travelers.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">Live Tracking</Badge>
                    <Badge variant="secondary">SOS Alert</Badge>
                    <Badge variant="secondary">Battery Aware</Badge>
                  </div>
                  <Button 
                    className="w-full hero-gradient text-white"
                    onClick={() => startDemo('solo')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Solo Demo
                  </Button>
                </div>
              </Card>

              {/* Group Mode */}
              <Card className="p-8 card-gradient safety-shadow">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-safety-green/20 rounded-2xl flex items-center justify-center">
                    <Users className="w-10 h-10 text-safety-green" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Group Trek Mode</h3>
                    <p className="text-muted-foreground">
                      Experience team tracking with proximity alerts, leader dashboard, 
                      and real-time group coordination features.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">Group Tracking</Badge>
                    <Badge variant="secondary">Proximity Alerts</Badge>
                    <Badge variant="secondary">Leader Dashboard</Badge>
                  </div>
                  
                  {/* Role Selection for Group Mode */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Choose Your Role:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        className="flex flex-col space-y-2 h-auto py-4"
                        onClick={() => startDemo('group', 'leader')}
                      >
                        <Crown className="w-6 h-6 text-safety-green" />
                        <span>Group Leader</span>
                        <span className="text-xs text-muted-foreground">Monitor & Coordinate</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex flex-col space-y-2 h-auto py-4"
                        onClick={() => startDemo('group', 'rider')}
                      >
                        <UserCheck className="w-6 h-6 text-safety-blue" />
                        <span>Group Member</span>
                        <span className="text-xs text-muted-foreground">Stay Connected</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Active Demo */}
        {activeMode && (
          <div className="max-w-6xl mx-auto">
            {/* Demo Controls */}
            <div className="flex flex-wrap items-center justify-between mb-8 p-4 card-gradient rounded-xl safety-shadow">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold">
                  {activeMode === 'solo' ? 'Solo Journey' : 'Group Trek'} Simulation
                </h3>
                <Badge variant={isRunning ? 'default' : 'secondary'}>
                  {isRunning ? 'Live' : 'Paused'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayPause}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetDemo}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveMode(null)}
                >
                  Switch Mode
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Map Simulation */}
              <div className="lg:col-span-2">
                <Card className="p-6 h-96 card-gradient safety-shadow relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-safety-blue/10 to-safety-green/10"></div>
                  
                  {/* Map header */}
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <h4 className="font-semibold flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {gpsEnabled ? 'Real GPS Tracking' : 'Simulated Tracking'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${isOnline ? 'bg-safety-green' : 'bg-warning'}`}></div>
                      <span className="text-sm text-muted-foreground">
                        {gpsEnabled ? (isOnline ? 'GPS Active' : 'GPS Signal Lost') : 'Demo Mode'}
                      </span>
                      {userRole && (
                        <Badge variant={userRole === 'leader' ? 'default' : 'secondary'}>
                          {userRole === 'leader' ? '👑 Leader' : '👤 Member'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Simulated map with tracking dots */}
                  <div className="relative h-full bg-muted/50 rounded-lg flex items-center justify-center">
                    {activeMode === 'solo' && (
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 tracking-dot tracking-dot-solo animate-tracking-move"></div>
                        </div>
                        {currentStep >= 2 && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-warning text-warning-foreground px-2 py-1 rounded animate-pulse">
                            Risk Area Detected
                          </div>
                        )}
                      </div>
                    )}

                    {activeMode === 'group' && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* Leader */}
                        <div className="absolute">
                          <div className="w-6 h-6 tracking-dot tracking-dot-leader"></div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                            Leader
                          </div>
                        </div>
                        
                        {/* Group members */}
                        <div className="absolute -top-4 -left-4">
                          <div className="w-5 h-5 tracking-dot tracking-dot-member"></div>
                        </div>
                        <div className="absolute -bottom-4 right-2">
                          <div className="w-5 h-5 tracking-dot tracking-dot-member"></div>
                        </div>
                        
                        {/* Lost member */}
                        {currentStep >= 3 && (
                          <div className="absolute top-8 right-8">
                            <div className="w-5 h-5 tracking-dot tracking-dot-lost pulse-emergency"></div>
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-emergency-red text-white px-2 py-1 rounded animate-pulse">
                              Member Lost!
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Status Panel */}
              <div className="space-y-6">
                {/* SOS Button */}
                <Card className="p-6 card-gradient safety-shadow">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Emergency Controls
                  </h4>
                  <Button
                    onClick={triggerSOS}
                    className={`w-full ${showSOS ? 'emergency-gradient emergency-shadow pulse-emergency' : 'bg-emergency-red hover:bg-emergency-red/90'} text-white`}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {showSOS ? 'SOS ACTIVE!' : 'Emergency SOS'}
                  </Button>
                  {showSOS && (
                    <div className="mt-4 p-3 bg-emergency-red/10 border border-emergency-red/20 rounded-lg">
                      <div className="text-sm font-medium text-emergency-red">
                        Emergency Alert Sent!
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Notifying emergency contacts and authorities...
                      </div>
                    </div>
                  )}
                </Card>

                {/* Group Chat - Only for Group Mode */}
                {activeMode === 'group' && (
                  <Card className="p-6 card-gradient safety-shadow">
                    <h4 className="font-semibold mb-4 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Group Chat
                    </h4>
                    
                    {/* Messages */}
                    <div className="h-40 overflow-y-auto space-y-2 mb-4 p-2 bg-muted/20 rounded-lg">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">
                          No messages yet. Start chatting with your group!
                        </div>
                      ) : (
                        messages.map(msg => (
                          <div key={msg.id} className={`text-xs p-2 rounded ${
                            msg.type === 'system' ? 'bg-primary/10 text-primary' :
                            msg.type === 'alert' ? 'bg-warning/10 text-warning' :
                            'bg-secondary/50'
                          }`}>
                            <div className="font-medium">{msg.sender}</div>
                            <div>{msg.content}</div>
                            <div className="text-muted-foreground text-xs mt-1">
                              {msg.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Message Input */}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={sendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Status Updates */}
                <Card className="p-6 card-gradient safety-shadow">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {userRole === 'leader' ? 'Leader Dashboard' : 'Live Status'}
                  </h4>
                  <div className="space-y-3 text-sm">
                    {activeMode === 'solo' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Location Status</span>
                          <Badge variant={currentStep >= 2 ? 'destructive' : 'default'}>
                            {currentStep >= 2 ? 'Risk Area' : 'Safe Zone'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Battery Level</span>
                          <span className="flex items-center">
                            <Battery className="w-4 h-4 mr-1" />
                            {gpsEnabled ? '85%' : '78%'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>GPS Signal</span>
                          <Badge variant={isOnline ? 'default' : 'destructive'}>
                            {isOnline ? 'Strong' : 'Weak'}
                          </Badge>
                        </div>
                        {gpsEnabled && currentLocation && (
                          <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/20 rounded">
                            Current: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                          </div>
                        )}
                      </>
                    )}

                    {activeMode === 'group' && userRole === 'leader' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Group Status</span>
                          <Badge variant={currentStep >= 3 ? 'destructive' : 'default'}>
                            {currentStep >= 3 ? '1 Member Lost' : 'All Connected'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Active Members</span>
                          <span>{groupMembers.filter(m => m.status !== 'emergency').length}/{groupMembers.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Proximity Alerts</span>
                          <Badge variant={currentStep >= 3 ? 'destructive' : 'default'}>
                            {currentStep >= 3 ? 'ACTIVE' : 'Normal'}
                          </Badge>
                        </div>
                        
                        {/* Member List for Leaders */}
                        <div className="mt-4 space-y-2">
                          <div className="text-xs font-medium text-muted-foreground uppercase">Team Members</div>
                          {groupMembers.slice(1).map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 bg-muted/20 rounded text-xs">
                              <span className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  member.status === 'safe' ? 'bg-safety-green' :
                                  member.status === 'warning' ? 'bg-warning' : 'bg-emergency-red'
                                }`}></div>
                                {member.name}
                              </span>
                              <span className="flex items-center text-muted-foreground">
                                <Battery className="w-3 h-3 mr-1" />
                                {member.batteryLevel}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {activeMode === 'group' && userRole === 'rider' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Connection Status</span>
                          <Badge variant="default">Connected to Leader</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Group Distance</span>
                          <span>25m</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Battery Level</span>
                          <span className="flex items-center">
                            <Battery className="w-4 h-4 mr-1" />
                            92%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Last Check-in</span>
                          <span className="text-muted-foreground">2 min ago</span>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Privacy Notice */}
                <Card className="p-4 card-gradient safety-shadow">
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center mb-2">
                      <Shield className="w-3 h-3 mr-1" />
                      Privacy Protected
                    </div>
                    <p>All location data is encrypted and anonymized. You control who sees your data.</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InteractiveDemo;