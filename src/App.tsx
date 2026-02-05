import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
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
import { AdminDashboard } from "./components/AdminDashboard";


export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  useEffect(() => {
    const restoreSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      if (!session?.user) return;
  
      const enrichedUser = await loadUserProfile(session.user);
  
      if (!enrichedUser) return;
  
      setUser(enrichedUser);
  
      if (enrichedUser.role === "instructor") {
        if (enrichedUser.is_instructor_approved) {
          setCurrentPage("instructor-dashboard");
        } else {
          // not approved yet => keep them student-side (or a “pending approval” page later)
          setCurrentPage("student-dashboard");
        }
      } else {
        setCurrentPage("student-dashboard");
      }
      
    };
  
    restoreSession();
  }, []);
  

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
  const saveUserProfile = async (user: any) => {
    if (!user?.id) return;
  
    // 🔒 Never overwrite existing values with empty ones
    const payload: any = {
      id: user.id,
      email: user.email,
      updated_at: new Date().toISOString(),
    };
  
    if (user.name) payload.name = user.name;
    if (user.role) payload.role = user.role;
  
    const { error } = await supabase.from("profiles").upsert(payload);
  
    if (error) {
      console.error("Profile save error:", error.message);
    }
  };
  
  const loadUserProfile = async (authUser: any) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
  
    if (error) {
      console.error("Profile load error:", error.message);
      return null;
    }
  
    return {
      ...authUser,
      ...data,
    };
  };
  const ensureInstructorApplication = async (user: any) => {
    if (!user?.id) return;
  
    // Only for people who chose instructor role
    if (user.role !== "instructor") return;
  
    // If already approved, no need to apply
    if (user.is_instructor_approved) return;
  
    // Check if application already exists
    const { data: existing, error: checkError } = await supabase
      .from("instructor_applications")
      .select("id,status")
      .eq("user_id", user.id)
      .maybeSingle();
  
    if (checkError) {
      console.warn("Application check failed:", checkError.message);
      return;
    }
  
    // If exists, don't duplicate
    if (existing?.id) return;
  
    // Insert a new pending application (pulls extra details from metadata if present)
    const { error: insertError } = await supabase.from("instructor_applications").insert({
      user_id: user.id,
      full_name: user.name || "",
      email: user.email || "",
      phone: user.user_metadata?.phone || null,
      years_experience: user.user_metadata?.yearsExperience || null,
      specialization: user.user_metadata?.specialization || null,
      qualifications: user.user_metadata?.qualifications || null,
      motivation: user.user_metadata?.motivation || null,
      status: "pending",
    });
  
    if (insertError) {
      console.warn("Application insert failed:", insertError.message);
    }
  };
  
  const handleLogin = async (authUser: any) => {
    // 1️⃣ Load existing profile FIRST
    const existingProfile = await loadUserProfile(authUser);
  
    // 2️⃣ Determine name SAFELY
    const resolvedName =
      existingProfile?.name ||
      authUser.user_metadata?.name ||
      authUser.user_metadata?.full_name ||
      authUser.email?.split("@")[0] ||
      "User";
  
    const normalizedUser = {
      id: authUser.id,
      email: authUser.email,
      role: existingProfile?.role || "student",
      name: resolvedName,
    };
  
    // 3️⃣ Save ONLY if profile is missing or incomplete
    await saveUserProfile(normalizedUser);
  
    // 4️⃣ Reload from DB (single source of truth)
    const enrichedUser = await loadUserProfile(authUser);
  
    if (!enrichedUser) return;
  
    setUser(enrichedUser);
    await ensureInstructorApplication(enrichedUser);

  
    setCurrentPage(
      enrichedUser.role === "instructor"
        ? "instructor-dashboard"
        : "student-dashboard"
    );
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
      case "admin":
        return <AdminDashboard />;
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