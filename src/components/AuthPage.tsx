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

interface AuthPageProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  // Instructor-specific form data
  const [instructorData, setInstructorData] = useState({
    phone: "",
    yearsExperience: "",
    specialization: "",
    qualifications: "",
    motivation: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, this would call an API
    const mockUser = {
      id: "1",
      name: formData.name || "John Doe",
      email: formData.email,
      role: userType,
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`,
    };
    
    onLogin(mockUser);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions!");
      return;
    }

    // Additional validation for instructors
    if (userType === "instructor") {
      if (!instructorData.phone || !instructorData.yearsExperience || 
          !instructorData.specialization || !instructorData.qualifications || 
          !instructorData.motivation) {
        alert("Please fill in all instructor fields!");
        return;
      }
    }
    
    // Mock signup - in real app, this would call an API
    const mockUser = {
      id: "1",
      name: formData.name,
      email: formData.email,
      role: userType,
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`,
      ...(userType === "instructor" && { instructorData }),
    };
    
    if (userType === "instructor") {
      alert("Application submitted successfully! We'll contact you about uploading your CV and supporting documents.");
    }
    
    onLogin(mockUser);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateInstructorData = (field: string, value: any) => {
    setInstructorData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={sportswaveLogo} 
              alt="Sportswave Logo" 
              className="h-8 w-auto mr-3" 
            />
            <div>
              <div className="text-xl font-bold text-foreground">Sportswave</div>
              <div className="text-xs text-muted-foreground -mt-1">CAMPUS</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Sportswave Campus</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our community of passionate coaches
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard
                </CardDescription>
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
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>I am a:</Label>
                    <RadioGroup value={userType} onValueChange={setUserType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="login-student" />
                        <Label htmlFor="login-student">Student</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="instructor" id="login-instructor" />
                        <Label htmlFor="login-instructor">Instructor</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" className="w-full">
                    Login
                  </Button>

                  <div className="text-center">
                    <Button variant="link" size="sm">
                      Forgot your password?
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                  Join thousands of coaches improving their skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Basic Information */}
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
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
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

                  <div className="space-y-3">
                    <Label>I want to join as:</Label>
                    <RadioGroup value={userType} onValueChange={setUserType}>
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

                  {/* Instructor-specific fields */}
                  {userType === "instructor" && (
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-medium text-lg">Instructor Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+27 123 456 789"
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
                          placeholder="e.g., Football, Athletics, Youth Development"
                          value={instructorData.specialization}
                          onChange={(e) => updateInstructorData("specialization", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="qualifications">Qualifications & Certifications *</Label>
                        <Textarea
                          id="qualifications"
                          placeholder="List your coaching qualifications, certifications, and relevant education..."
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
                          placeholder="Tell us about your motivation to teach and what you hope to achieve..."
                          className="min-h-24"
                          value={instructorData.motivation}
                          onChange={(e) => updateInstructorData("motivation", e.target.value)}
                          required
                        />
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          After submitting this form, we'll contact you about uploading your CV and supporting documents.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        Terms and Conditions
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        Privacy Policy
                      </Button>
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