import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Star, Users, Clock, Search, Filter } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PaymentModal } from "./PaymentModal";
import { PageHero } from "./PageHero";

interface CoursesPageProps {
  onNavigate: (page: string, courseId?: string) => void;
}

const courses = [
  {
    id: "1",
    title: "Foundation Football Coaching",
    instructor: "John Mbeki",
    rating: 4.8,
    students: 156,
    duration: "6 weeks",
    price: "$89",
    category: "Football",
    level: "Beginner",
    description: "Learn the fundamentals of football coaching including tactics, player development, and team management.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=240&fit=crop",
  },
  {
    id: "2",
    title: "Advanced Football Tactics",
    instructor: "John Mbeki",
    rating: 4.9,
    students: 89,
    duration: "8 weeks",
    price: "$125",
    category: "Football",
    level: "Advanced",
    description: "Master advanced tactical concepts, formation analysis, and strategic game planning.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=240&fit=crop",
  },
  {
    id: "3",
    title: "Youth Athletics Development",
    instructor: "Sarah Okafor",
    rating: 4.7,
    students: 98,
    duration: "4 weeks",
    price: "$75",
    category: "Athletics",
    level: "Intermediate",
    description: "Specialized training methods for young athletes focusing on proper technique and injury prevention.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop",
  },
  {
    id: "4",
    title: "Sprinting Excellence",
    instructor: "Sarah Okafor",
    rating: 4.6,
    students: 67,
    duration: "5 weeks",
    price: "$95",
    category: "Athletics",
    level: "Intermediate",
    description: "Comprehensive sprinting techniques, speed development, and performance optimization.",
    image: "https://images.unsplash.com/photo-1544943910-4c1dcaa3c8e9?w=400&h=240&fit=crop",
  },
  {
    id: "5",
    title: "Sports Psychology Fundamentals",
    instructor: "Dr. Ahmed Hassan",
    rating: 4.8,
    students: 203,
    duration: "8 weeks",
    price: "$120",
    category: "Psychology",
    level: "Beginner",
    description: "Understanding the mental aspects of sports performance and athlete motivation.",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=240&fit=crop",
  },
  {
    id: "6",
    title: "Strength & Conditioning",
    instructor: "Mike Johnson",
    rating: 4.7,
    students: 134,
    duration: "6 weeks",
    price: "$99",
    category: "Fitness",
    level: "Intermediate",
    description: "Evidence-based approaches to building strength, power, and conditioning in athletes.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=240&fit=crop",
  },
  {
    id: "7",
    title: "Youth Coaching Essentials",
    instructor: "Lisa Thompson",
    rating: 4.9,
    students: 178,
    duration: "7 weeks",
    price: "$110",
    category: "Youth Coaching",
    level: "Beginner",
    description: "Special considerations and techniques for coaching young athletes effectively.",
    image: "https://images.unsplash.com/photo-1582142306936-62663703a2b3?w=400&h=240&fit=crop",
  },
  {
    id: "8",
    title: "Basketball Fundamentals",
    instructor: "David Wilson",
    rating: 4.5,
    students: 92,
    duration: "5 weeks",
    price: "$85",
    category: "Basketball",
    level: "Beginner",
    description: "Master the basics of basketball coaching including skills development and team strategies.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=240&fit=crop",
  },
];

const categories = ["All", "Football", "Athletics", "Psychology", "Fitness", "Youth Coaching", "Basketball"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export function CoursesPage({ onNavigate }: CoursesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnrollClick = (course: typeof courses[0]) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // In a real app, this would update the user's enrolled courses
    alert("Successfully enrolled! You can now access the course.");
    // Navigate to the course player
    if (selectedCourse) {
      onNavigate("course-detail", selectedCourse.id);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <PageHero
        title="All Courses"
        subtitle="Discover comprehensive courses designed to elevate your coaching expertise and transform your career"
        backgroundImage="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&h=800&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Level Filters */}
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="p-0">
                <div className="relative">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-primary text-white">
                      {course.category}
                    </Badge>
                    <Badge variant="secondary">
                      {course.level}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="mb-2 text-base leading-tight">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    {course.rating}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {course.students}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.duration}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 pb-4 flex justify-between items-center">
                <span className="text-lg font-bold text-primary">{course.price}</span>
                <Button size="sm" onClick={() => handleEnrollClick(course)}>
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find more courses.
            </p>
          </div>
        )}

        {/* Results Count */}
        {filteredCourses.length > 0 && (
          <div className="text-center mt-8 text-muted-foreground">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        )}

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
    </div>
  );
}