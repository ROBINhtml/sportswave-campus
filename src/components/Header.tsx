import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { UserProfileDropdown } from "./UserProfileDropdown";
import sportswaveLogo from "figma:asset/3cd261a4de29af9def91bb4cdb5b0171e98dff81.png";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  isTransparent?: boolean;
}

export function Header({ currentPage, onNavigate, user, onLogin, onLogout, isTransparent = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Home", id: "home" },
    { name: "About Us", id: "about" },
    { name: "All Courses", id: "courses" },
    { name: "Blog", id: "blog" },
    { name: "Instructors", id: "instructors" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isTransparent ? '' : 'top-4 left-4 right-4'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`${isTransparent ? 'bg-transparent px-4 sm:px-6 lg:px-8 py-6' : 'bg-primary/95 backdrop-blur-md rounded-2xl shadow-xl px-6 py-3'}`}>
          <div className={`flex justify-between items-center ${isTransparent ? 'h-16' : 'h-12'}`}>
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate("home")}>
            <img 
              src={sportswaveLogo} 
              alt="Sportswave Logo" 
              className={`h-10 w-auto ${isTransparent ? '' : 'brightness-0 invert'}`}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 ml-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 font-medium transition-all duration-200 ${
                  isTransparent 
                    ? (currentPage === item.id 
                        ? "text-white border-b-2 border-white" 
                        : "text-white/90 hover:text-white")
                    : (currentPage === item.id 
                        ? "text-primary bg-white shadow-sm rounded-lg" 
                        : "text-white/90 hover:text-white hover:bg-white/10 rounded-lg")
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">

              {/* 🔐 ADMIN BUTTON */}
              {user?.email === "robinnjoka3@gmail.com" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigate("admin")}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Admin
                </Button>
              )}
            
              <UserProfileDropdown 
                user={user} 
                onNavigate={onNavigate} 
                onLogout={onLogout} 
                isTransparent={isTransparent}
              />
            </div>
            
            ) : (
              <Button 
                size="sm" 
                className={`${
                  isTransparent
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-white text-primary hover:bg-white/90"
                }`}
                onClick={onLogin}
              >
                Login / Sign Up
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`${
                isTransparent 
                  ? "text-white hover:bg-white/10"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 mt-3 pt-3">
            <div className="px-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 text-base font-medium transition-all duration-200 w-full text-left rounded-lg ${
                    currentPage === item.id 
                      ? "text-primary bg-white" 
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-2 border-t border-white/20 mt-2">
                {user ? (
                  <div className="space-y-1">
                   <div className="space-y-2 px-3 py-2 mb-2">

{/* 🔐 ADMIN BUTTON (MOBILE) */}
{user?.email === "robinnjoka3@gmail.com" && (
  <Button
    size="sm"
    className="w-full bg-white text-primary hover:bg-white/90"
    onClick={() => {
      onNavigate("admin");
      setIsMobileMenuOpen(false);
    }}
  >
    Admin Panel
  </Button>
)}

<div className="flex items-center space-x-3">
  <UserProfileDropdown 
    user={user} 
    onNavigate={onNavigate} 
    onLogout={onLogout} 
    isTransparent={isTransparent}
  />
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
    <p className="text-xs text-white/70 truncate">{user?.email || "user@example.com"}</p>
  </div>
</div>
</div>

                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="w-full bg-white text-primary hover:bg-white/90"
                    onClick={() => {
                      onLogin();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login / Sign Up
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </header>
  );
}