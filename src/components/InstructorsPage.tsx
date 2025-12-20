import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { PageHero } from "./PageHero";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, Users, BookOpen, Award, CheckCircle } from "lucide-react";

interface InstructorsPageProps {
  onNavigate: (page: string) => void;
}

const instructors = [
  {
    id: "1",
    name: "John Mbeki",
    specialty: "Football Coaching",
    experience: "15+ years",
    rating: 4.9,
    students: 245,
    courses: 3,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Former professional footballer turned elite coach with CAF A License. Specializes in tactical development and youth coaching.",
    achievements: ["CAF A License", "UEFA B License", "500+ Players Coached"],
    verified: true
  },
  {
    id: "2",
    name: "Sarah Okafor",
    specialty: "Athletics & Track",
    experience: "12+ years",
    rating: 4.8,
    students: 189,
    courses: 4,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    bio: "Olympic athletics coach and World Championships medalist. Expert in sprinting techniques and performance optimization.",
    achievements: ["Olympic Coach", "World Championships Medal", "IAAF Level 5"],
    verified: true
  },
  {
    id: "3",
    name: "Dr. Ahmed Hassan",
    specialty: "Sports Psychology",
    experience: "10+ years",
    rating: 4.9,
    students: 203,
    courses: 2,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Sports psychologist with PhD in Performance Psychology. Worked with Olympic teams and professional athletes.",
    achievements: ["PhD Sports Psychology", "Olympic Team Consultant", "Research Published"],
    verified: true
  },
  {
    id: "4",
    name: "Mike Johnson",
    specialty: "Strength & Conditioning",
    experience: "8+ years",
    rating: 4.7,
    students: 134,
    courses: 2,
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop&crop=face",
    bio: "Certified strength and conditioning specialist with experience in professional sports and rehabilitation.",
    achievements: ["CSCS Certified", "Pro Teams Experience", "Injury Prevention Expert"],
    verified: true
  },
  {
    id: "5",
    name: "Lisa Thompson",
    specialty: "Youth Development",
    experience: "14+ years",
    rating: 4.8,
    students: 178,
    courses: 3,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&fit=crop&crop=face",
    bio: "Youth development specialist with expertise in age-appropriate training and talent identification.",
    achievements: ["Youth Coaching Certification", "Talent ID Expert", "Child Protection Trained"],
    verified: true
  },
  {
    id: "6",
    name: "David Wilson",
    specialty: "Basketball Coaching",
    experience: "11+ years",
    rating: 4.6,
    students: 92,
    courses: 2,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    bio: "Former professional basketball player and certified coach with experience in youth and professional levels.",
    achievements: ["FIBA Certified", "Pro Player Experience", "Youth Championship Winner"],
    verified: true
  }
];

const benefits = [
  {
    icon: BookOpen,
    title: "Share Your Expertise",
    description: "Create courses and share your knowledge with coaches across Africa"
  },
  {
    icon: Users,
    title: "Build Your Community",
    description: "Connect with fellow coaches and build your professional network"
  },
  {
    icon: Award,
    title: "Earn Recognition",
    description: "Get recognized as a verified expert in your coaching specialty"
  },
  {
    icon: Star,
    title: "Flexible Schedule",
    description: "Teach on your own schedule and reach students globally"
  }
];

export function InstructorsPage({ onNavigate }: InstructorsPageProps) {
  return (
    <div>
      {/* Hero Section */}
      <PageHero
        title="Meet Our Expert Instructors"
        subtitle="Learn from world-class coaches and sports professionals who are passionate about developing the next generation of African coaching talent"
        backgroundImage="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=800&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Instructor Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Certified Instructors</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Learn from experienced professionals who have dedicated their careers to excellence in sports coaching
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="relative inline-block">
                    <ImageWithFallback
                      src={instructor.image}
                      alt={instructor.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    {instructor.verified && (
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl">{instructor.name}</CardTitle>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {instructor.specialty}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {instructor.bio}
                  </p>
                  
                  <div className="flex justify-center gap-6 mb-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{instructor.rating}</span>
                      </div>
                      <span className="text-muted-foreground">Rating</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary mr-1" />
                        <span className="font-medium">{instructor.students}</span>
                      </div>
                      <span className="text-muted-foreground">Students</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary mr-1" />
                        <span className="font-medium">{instructor.courses}</span>
                      </div>
                      <span className="text-muted-foreground">Courses</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Achievements:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {instructor.achievements.map((achievement, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {instructor.experience} experience
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Become an Instructor Section */}
        <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Become an Instructor</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Share your expertise with coaches across Africa and help build the future of sports on the continent
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/90"
                onClick={() => onNavigate("auth")}
              >
                Apply to Become an Instructor
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Join over 50+ expert instructors already teaching on our platform
              </p>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Instructor Requirements</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We maintain high standards to ensure quality education for all our students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3">Experience</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Minimum 3 years coaching experience</li>
                  <li>• Relevant certifications in your field</li>
                  <li>• Proven track record of success</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3">Qualifications</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Recognized coaching credentials</li>
                  <li>• Educational background in sports/related field</li>
                  <li>• Continuing education commitment</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3">Teaching Skills</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Strong communication abilities</li>
                  <li>• Ability to create engaging content</li>
                  <li>• Commitment to student success</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}