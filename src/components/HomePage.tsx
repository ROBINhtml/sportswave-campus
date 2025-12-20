import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Users, Clock, Play, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PaymentModal } from "./PaymentModal";
import stadiumBackground from "figma:asset/52a47af762db8f183479c275cd6e048a653bdde4.png";

interface HomePageProps {
  onNavigate: (page: string, courseId?: string) => void;
}

const featuredCourses = [
  {
    id: "1",
    title: "Foundation Football Coaching",
    instructor: "John Mbeki",
    rating: 4.8,
    students: 156,
    duration: "6 weeks",
    price: "$89",
    category: "Football",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=240&fit=crop",
  },
  {
    id: "2",
    title: "Youth Athletics Development",
    instructor: "Sarah Okafor",
    rating: 4.9,
    students: 98,
    duration: "4 weeks",
    price: "$75",
    category: "Athletics",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop",
  },
  {
    id: "3",
    title: "Sports Psychology Fundamentals",
    instructor: "Dr. Ahmed Hassan",
    rating: 4.7,
    students: 203,
    duration: "8 weeks",
    price: "$120",
    category: "Psychology",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=240&fit=crop",
  },
];

const instructors = [
  {
    id: "1",
    name: "John Mbeki",
    expertise: "Football Coaching",
    experience: "15+ years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Sarah Okafor",
    expertise: "Athletics Training",
    experience: "12+ years",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Dr. Ahmed Hassan",
    expertise: "Sports Psychology",
    experience: "20+ years",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof featuredCourses[0] | null>(null);

  const handleEnrollClick = (course: typeof featuredCourses[0]) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    alert("Successfully enrolled! You can now access the course.");
    if (selectedCourse) {
      onNavigate("course-detail", selectedCourse.id);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative text-white min-h-screen flex items-center"
        style={{
          backgroundImage: `url(${stadiumBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Link to main website */}
            <a 
              href="https://sportswavefoundation.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Sportswave Foundation</span>
            </a>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-accent leading-tight">
              SPORTSWAVE<br />
              CAMPUS
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              At Sportswave Campus, we believe in fostering athletic excellence and academic growth. 
              Our platform is dedicated to providing comprehensive resources, support, and 
              opportunities for student-athletes to excel in both their sports and studies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 font-medium rounded-full"
                onClick={() => onNavigate("courses")}
              >
                START COURSE
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 font-medium rounded-full bg-transparent border-2"
                onClick={() => onNavigate("courses")}
              >
                ▶ ALL COURSES
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular courses designed to elevate your coaching skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="p-0">
                  <div className="relative">
                    <ImageWithFallback
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-white">
                      {course.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="mb-2 text-lg">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">by {course.instructor}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">{course.price}</span>
                  <Button onClick={() => handleEnrollClick(course)}>
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" onClick={() => onNavigate("courses")}>
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Instructors Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Expert Instructors</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn from the best coaches and experts across Africa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <ImageWithFallback
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold mb-2">{instructor.name}</h3>
                  <p className="text-muted-foreground mb-2">{instructor.expertise}</p>
                  <p className="text-sm text-muted-foreground">{instructor.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Coaching Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of coaches who are already transforming their skills with Sportswave Campus
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => onNavigate("courses")}
            >
              Browse Courses
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => onNavigate("contact")}
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedCourse && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          course={selectedCourse}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}