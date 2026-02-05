import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { Eye, EyeOff, Info } from "lucide-react";
import sportswaveLogo from "figma:asset/3cd261a4de29af9def91bb4cdb5b0171e98dff81.png";
import { supabase } from "../lib/supabase";

interface AuthPageProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"student" | "instructor">("student");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    agreeToTerms: false,
  });

  const [instructorData, setInstructorData] = useState({
    phone: "",
    yearsExperience: "",
    specialization: "",
    qualifications: "",
    motivation: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateInstructorData = (field: string, value: any) => {
    setInstructorData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔐 LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = formData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    onLogin(data.user);
  };

  // 📝 SIGNUP
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions!");
      return;
    }

    if (
      userType === "instructor" &&
      (!instructorData.phone ||
        !instructorData.yearsExperience ||
        !instructorData.specialization ||
        !instructorData.qualifications ||
        !instructorData.motivation)
    ) {
      alert("Please fill in all instructor fields!");
      return;
    }

    const { email, password } = formData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: formData.name.trim(),
          role: userType,
          ...(userType === "instructor"
            ? {
                phone: instructorData.phone,
                yearsExperience: instructorData.yearsExperience,
                specialization: instructorData.specialization,
                qualifications: instructorData.qualifications,
                motivation: instructorData.motivation,
              }
            : {}),
        },
      },
    });
    
    if (error) {
      alert(error.message);
      return;
    }
    
    // ✅ Try create instructor application (may fail if no session yet — that's OK)
    
    
    alert("Signup successful! Check your email to confirm your account.");
  }; 
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={sportswaveLogo} alt="Sportswave Logo" className="h-8 w-auto mr-3" />
            <div>
              <div className="text-xl font-bold text-foreground">Sportswave</div>
              <div className="text-xs text-muted-foreground -mt-1">CAMPUS</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Sportswave Campus</h2>
          <p className="mt-2 text-sm text-gray-600">Join our community of passionate coaches</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>Enter your credentials to access your dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>Join thousands of coaches improving their skills</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name *</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address *</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password *</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* ✅ ROLE CHOICE (this is what you're missing) */}
                  <div className="space-y-3">
                    <Label>I want to join as:</Label>
                    <RadioGroup value={userType} onValueChange={(v) => setUserType(v as any)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="signup-student" />
                        <Label htmlFor="signup-student">Student - Learn from expert coaches</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="instructor" id="signup-instructor" />
                        <Label htmlFor="signup-instructor">Instructor - Share your expertise</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Instructor-only fields */}
                  {userType === "instructor" && (
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-medium text-lg">Instructor Information</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+254 7xx xxx xxx"
                            value={instructorData.phone}
                            onChange={(e) => updateInstructorData("phone", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience *</Label>
                          <Input
                            id="experience"
                            type="text"
                            placeholder="e.g., 10 years"
                            value={instructorData.yearsExperience}
                            onChange={(e) => updateInstructorData("yearsExperience", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization">Coaching Specialization *</Label>
                        <Input
                          id="specialization"
                          type="text"
                          placeholder="e.g., Football, Athletics"
                          value={instructorData.specialization}
                          onChange={(e) => updateInstructorData("specialization", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="qualifications">Qualifications & Certifications *</Label>
                        <Textarea
                          id="qualifications"
                          placeholder="List your qualifications..."
                          className="min-h-24"
                          value={instructorData.qualifications}
                          onChange={(e) => updateInstructorData("qualifications", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motivation">Why do you want to teach with Sportswave Campus? *</Label>
                        <Textarea
                          id="motivation"
                          placeholder="Tell us your motivation..."
                          className="min-h-24"
                          value={instructorData.motivation}
                          onChange={(e) => updateInstructorData("motivation", e.target.value)}
                          required
                        />
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          After submitting, we’ll contact you about uploading your CV and supporting documents.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the Terms and Conditions and Privacy Policy
                    </Label>
                  </div>

                  <Button type="submit" className="w-full">
                    {userType === "instructor" ? "Submit Application" : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={onBack}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
