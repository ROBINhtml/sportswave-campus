import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { PageHero } from "./PageHero";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    alert("Thank you for your message! We'll get back to you soon. (This is a mock implementation)");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {/* Hero Section */}
      <PageHero
        title="Get in Touch"
        subtitle="Have questions about our courses or need support? We're here to help you on your coaching journey and connect you with our community"
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) => updateFormData("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={(e) => updateFormData("message", e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@sportswavecampus.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+233 (0) 20 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      123 Sports Complex Avenue<br />
                      Accra, Ghana
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-muted-foreground">
                      Mon - Fri: 8:00 AM - 6:00 PM<br />
                      Weekend: 9:00 AM - 4:00 PM (GMT)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Stay updated with the latest coaching tips and course announcements
                </p>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Newsletter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Subscribe to our newsletter for coaching insights, new course announcements, and exclusive content.
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="Your email address" />
                    <Button size="sm">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about Sportswave Campus
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">How do I enroll in a course?</h3>
                <p className="text-muted-foreground text-sm">
                  Simply browse our course catalog, select a course that interests you, and click "Enroll Now". 
                  You'll need to create an account and complete the payment process.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">Can I access courses on mobile?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Our platform is fully responsive and works great on all devices. 
                  You can learn on your phone, tablet, or computer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">Do I get a certificate after completion?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you'll receive a verified certificate upon successful completion of any course. 
                  Certificates can be downloaded as PDF and shared on social media.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">How do I become an instructor?</h3>
                <p className="text-muted-foreground text-sm">
                  Click "Join as Instructor" on our homepage, complete the application process, 
                  and our team will review your credentials and get back to you within 48 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}