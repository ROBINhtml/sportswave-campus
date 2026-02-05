import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  User, 
  Settings, 
  CreditCard, 
  LogOut, 
  Camera,
  Edit3,
  BookOpen
} from "lucide-react";

interface UserProfileDropdownProps {
  user: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isTransparent?: boolean;
}

export function UserProfileDropdown({
  user,
  onNavigate,
  onLogout,
  isTransparent = false,
}: UserProfileDropdownProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarUrl = () => {
    // In a real app, this would come from user data
    return user?.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`;
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    console.log("Saving profile:", editedUser);
    setIsProfileOpen(false);
  };

  const updateField = (field: string, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className={`h-10 w-10 rounded-full p-0 hover:bg-transparent cursor-pointer transition-all duration-200 ${
              isTransparent ? "ring-2 ring-white/30 hover:ring-white/50" : "ring-2 ring-white/30 hover:ring-white/50"
            }`}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={getAvatarUrl()} alt={editedUser.name} />
              <AvatarFallback className="bg-primary text-white text-sm">
                {getInitials(editedUser.name)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64 mr-4" align="end">
          <DropdownMenuLabel className="pb-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getAvatarUrl()} alt={editedUser.name} />
                <AvatarFallback className="bg-primary text-white">
                  {getInitials(editedUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{editedUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{editedUser.email}</p>
                <p className="text-xs text-primary capitalize">{user?.role || 'Student'}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => onNavigate(user?.role === "instructor" ? "instructor-dashboard" : "student-dashboard")}
            className="cursor-pointer"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={getAvatarUrl()} alt={editedUser.name} />
                <AvatarFallback className="bg-primary text-white text-lg">
                  {getInitials(editedUser.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mb-2">
                  <Camera className="mr-2 h-4 w-4" />
                  Change Photo
                </button>
                <p className="text-xs text-muted-foreground">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editedUser.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={editedUser.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedUser.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editedUser.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setIsProfileOpen(false)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveProfile}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}