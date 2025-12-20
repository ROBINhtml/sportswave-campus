import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { CoursesPage } from "./components/CoursesPage";
import { AboutPage } from "./components/AboutPage";
import { InstructorsPage } from "./components/InstructorsPage";
import { AuthPage } from "./components/AuthPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { InstructorDashboard } from "./components/InstructorDashboard";
import { ContactPage } from "./components/ContactPage";
import { CoursePlayer } from "./components/CoursePlayer";
import { BlogPage } from "./components/BlogPage";
import { BlogPostDetail } from "./components/BlogPostDetail";
import { CreateBlogPost } from "./components/CreateBlogPost";
import sportswaveLogo from "figma:asset/3cd261a4de29af9def91bb4cdb5b0171e98dff81.png";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleNavigate = (page: string, courseId?: string) => {
    setCurrentPage(page);
    // Handle additional parameters for specific pages
    if (page === "blog-post-detail" && courseId) {
      setSelectedPostId(courseId);
    } else if (page !== "blog-post-detail") {
      setSelectedPostId(null);
    }
    if (courseId && page !== "blog-post-detail") {
      console.log("Navigate to course:", courseId);
    }
  };

  const handleLogin = (userData: any) => {
    // Add sample profile data for demonstration
    const enhancedUserData = {
      ...userData,
      id: userData.id || `user-${Date.now()}`, // Add user ID for backend authentication
      access_token: userData.access_token || 'demo-access-token-' + Date.now(), // Demo token for material management
      name: userData.name || (userData.role === "instructor" ? "Dr. Sarah Okafor" : "Michael Tettey"),
      email: userData.email || (userData.role === "instructor" ? "sarah.okafor@sportswave.com" : "michael.t@student.com"),
      phone: userData.phone || "+233 20 123 4567",
      location: userData.location || "Accra, Ghana",
      bio: userData.bio || (userData.role === "instructor" 
        ? "Experienced athletics coach with 12+ years in youth development and performance training."
        : "Passionate about learning modern coaching techniques and developing young athletes in my community."),
      avatar: userData.avatar || (userData.role === "instructor" 
        ? "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face")
    };
    
    setUser(enhancedUserData);
    // Redirect to appropriate dashboard based on role
    if (enhancedUserData.role === "instructor") {
      setCurrentPage("instructor-dashboard");
    } else {
      setCurrentPage("student-dashboard");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  const showAuth = () => {
    setCurrentPage("auth");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "about":
        return <AboutPage />;
      case "courses":
        return <CoursesPage onNavigate={handleNavigate} />;
      case "instructors":
        return <InstructorsPage onNavigate={handleNavigate} />;

      case "contact":
        return <ContactPage />;
      case "auth":
        return <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage("home")} />;
      case "blog":
        return <BlogPage onNavigate={handleNavigate} user={user} />;
      case "blog-post-detail":
        return selectedPostId ? (
          <BlogPostDetail postId={selectedPostId} onNavigate={handleNavigate} user={user} />
        ) : (
          <BlogPage onNavigate={handleNavigate} user={user} />
        );
      case "create-blog-post":
        return user?.role === "instructor" ? (
          <CreateBlogPost onNavigate={handleNavigate} user={user} />
        ) : (
          <BlogPage onNavigate={handleNavigate} user={user} />
        );
      case "student-dashboard":
        return user ? (
          <StudentDashboard user={user} onNavigate={handleNavigate} />
        ) : (
          <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage("home")} />
        );
      case "instructor-dashboard":
        return user ? (
          <InstructorDashboard user={user} onNavigate={handleNavigate} />
        ) : (
          <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage("home")} />
        );
      case "course-detail":
        return <CoursePlayer courseId="1" onNavigate={handleNavigate} user={user} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentPage !== "auth" && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={user}
          onLogin={showAuth}
          onLogout={handleLogout}
          isTransparent={currentPage === "home"}
        />
      )}
      <main className={currentPage !== "auth" ? "" : ""}>
        {renderPage()}
      </main>
      
      {/* Footer */}
      {currentPage !== "auth" && (
        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <img 
                    src={sportswaveLogo} 
                    alt="Sportswave Logo" 
                    className="h-6 w-auto mr-3" 
                  />
                  <div>
                    <div className="text-xl font-bold">Sportswave</div>
                    <div className="text-xs text-gray-400 -mt-1">CAMPUS</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Empowering coaches across Africa with world-class education and certification programs.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <button onClick={() => handleNavigate("courses")} className="hover:text-white">
                      All Courses
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate("blog")} className="hover:text-white">
                      Blog
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate("about")} className="hover:text-white">
                      About Us
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate("instructors")} className="hover:text-white">
                      Become Instructor
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate("contact")} className="hover:text-white">
                      Contact
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Categories</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Football Coaching</li>
                  <li>Athletics Training</li>
                  <li>Sports Psychology</li>
                  <li>Youth Coaching</li>
                  <li>Fitness & Conditioning</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Help Center</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Refund Policy</li>
                  <li>Student Support</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 Sportswave Campus. All rights reserved. Empowering Coaches. Elevating African Sport.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}