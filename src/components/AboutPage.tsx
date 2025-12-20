import { Card, CardContent } from "./ui/card";
import { Trophy, Target, Users, Globe, Heart, Lightbulb, BookOpen } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PageHero } from "./PageHero";

const values = [
  {
    icon: Trophy,
    title: "Excellence",
    description: "We strive for the highest standards in coaching education and athletic development across Africa."
  },
  {
    icon: Target,
    title: "Innovation",
    description: "Integrating modern technology and teaching methods to create engaging learning experiences."
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a strong network of coaches who support and learn from each other."
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Driven by our love for sport and commitment to developing African coaching talent."
  },
  {
    icon: Globe,
    title: "Impact",
    description: "Creating lasting change in sports coaching standards across the African continent."
  },
  {
    icon: Lightbulb,
    title: "Empowerment",
    description: "Providing coaches with the knowledge and tools they need to transform their communities."
  }
];

const team = [
  {
    name: "Dr. Kwame Asante",
    role: "Founder & CEO",
    bio: "Former Olympic coach with 20+ years in sports development across Africa. Passionate about elevating coaching standards continent-wide.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
  },
  {
    name: "Sarah Okafor",
    role: "Head of Curriculum",
    bio: "International athletics coach and sports education specialist with expertise in youth development and performance coaching.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
  },
  {
    name: "Michael Tettey",
    role: "Technology Director",
    bio: "EdTech innovator focused on making learning accessible across Africa through cutting-edge digital platforms.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
  },
  {
    name: "Dr. Amina Hassan",
    role: "Sports Psychology Lead",
    bio: "Renowned sports psychologist specializing in mental performance training and coach development programs.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&fit=crop&crop=face"
  }
];

export function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <PageHero
        title="About Sportswave Campus"
        subtitle="Transforming African sports through world-class coaching education and community empowerment"
        backgroundImage="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop"
        height="min-h-[70vh]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <section className="py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6 text-muted-foreground leading-relaxed">
                At Sportswave Campus, we are dedicated to revolutionizing sports coaching across Africa by providing accessible, high-quality education that empowers coaches to unlock the potential of every athlete they train.
              </p>
              <p className="text-lg mb-6 text-muted-foreground leading-relaxed">
                We believe that great coaches create great athletes, and great athletes build stronger communities. Our comprehensive programs are designed to bridge the gap between traditional coaching methods and modern sports science, ensuring that every coach has access to the tools, knowledge, and support they need to excel.
              </p>
              <p className="text-lg mb-8 text-muted-foreground leading-relaxed">
                Through innovative online learning, practical workshops, and ongoing mentorship, we're building a new generation of certified coaches who will elevate African sport to unprecedented heights on the global stage.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
                  <div className="text-muted-foreground">Coaches Trained</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">45</div>
                  <div className="text-muted-foreground">Countries Reached</div>
                </div>
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=500&fit=crop"
                alt="Coaches training session"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                To become the leading platform for sports coaching education in Africa, creating a generation of skilled, certified, and passionate coaches who will transform their communities and elevate African sport to new heights on the global stage.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">What We Do</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We provide comprehensive coaching education through multiple channels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Online Courses</h3>
              <p className="text-muted-foreground">
                Comprehensive digital courses covering all aspects of modern coaching methodology
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Workshops</h3>
              <p className="text-muted-foreground">
                Interactive sessions with expert coaches and sports professionals
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Certification</h3>
              <p className="text-muted-foreground">
                Internationally recognized coaching certifications and credentials
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our passionate team of sports professionals and educators are dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16">
          <div className="bg-primary text-white rounded-xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Impact</h2>
              <p className="text-xl opacity-95 max-w-2xl mx-auto">
                Making a measurable difference in sports coaching across Africa
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">95%</div>
                <div className="opacity-90">Course Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">4.8/5</div>
                <div className="opacity-90">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">1,200+</div>
                <div className="opacity-90">Certified Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">50+</div>
                <div className="opacity-90">Expert Instructors</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the movement transforming sports coaching across Africa. Start your journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Browse Courses
            </button>
            <button className="border border-primary text-primary px-8 py-4 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
              Become an Instructor
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}