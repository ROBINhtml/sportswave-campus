import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Play, 
  Download, 
  Star,
  Calendar,
  Target,
  TrendingUp
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PaymentHistory } from "./PaymentHistory";
import { CertificatesView } from "./CertificatesView";

interface StudentDashboardProps {
  user: any;
  onNavigate: (page: string, courseId?: string) => void;
}

const enrolledCourses = [
  {
    id: "1",
    title: "Foundation Football Coaching",
    instructor: "John Mbeki",
    progress: 75,
    completedLessons: 15,
    totalLessons: 20,
    nextLesson: "Advanced Defensive Strategies",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop",
    category: "Football",
    enrolledDate: "2024-01-15",
    estimatedCompletion: "2024-03-15"
  },
  {
    id: "2",
    title: "Sports Psychology Fundamentals",
    instructor: "Dr. Ahmed Hassan",
    progress: 40,
    completedLessons: 8,
    totalLessons: 20,
    nextLesson: "Mental Resilience Training",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop",
    category: "Psychology",
    enrolledDate: "2024-01-20",
    estimatedCompletion: "2024-04-20"
  },
  {
    id: "3",
    title: "Youth Athletics Development",
    instructor: "Sarah Okafor",
    progress: 100,
    completedLessons: 12,
    totalLessons: 12,
    nextLesson: "Course Completed",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
    category: "Athletics",
    enrolledDate: "2023-12-01",
    estimatedCompletion: "2024-01-01"
  }
];

const certificates = [
  {
    id: "1",
    title: "Youth Athletics Development Certification",
    issueDate: "2024-01-05",
    instructor: "Sarah Okafor",
    credentialId: "SWC-2024-001",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop"
  }
];

const upcomingDeadlines = [
  {
    course: "Foundation Football Coaching",
    task: "Module 4 Assignment",
    dueDate: "2024-02-15",
    status: "pending"
  },
  {
    course: "Sports Psychology Fundamentals",
    task: "Case Study Analysis",
    dueDate: "2024-02-20",
    status: "pending"
  }
];

export function StudentDashboard({ user, onNavigate }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
  const inProgressCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length;
  const avgProgress = Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / totalCourses);

  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Track your learning progress and continue your coaching journey.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{totalCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-accent" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{inProgressCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">{avgProgress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {enrolledCourses
                    .filter(course => course.progress > 0 && course.progress < 100)
                    .slice(0, 2)
                    .map((course) => (
                      <div key={course.id} className="flex gap-4 p-4 border rounded-lg">
                        <ImageWithFallback
                          src={course.image}
                          alt={course.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{course.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">Next: {course.nextLesson}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <Progress value={course.progress} className="flex-1" />
                            <span className="text-xs text-muted-foreground">{course.progress}%</span>
                          </div>
                          <Button size="sm" onClick={() => onNavigate("course-detail", course.id)}>
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{deadline.task}</p>
                        <p className="text-sm text-muted-foreground">{deadline.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {deadline.dueDate}</p>
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6 mt-6">
            <div className="grid gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <ImageWithFallback
                        src={course.image}
                        alt={course.title}
                        className="w-32 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold">{course.title}</h3>
                            <p className="text-muted-foreground">by {course.instructor}</p>
                          </div>
                          <Badge variant="secondary">{course.category}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                          <span>Enrolled: {course.enrolledDate}</span>
                          <span>•</span>
                          <span>Est. Completion: {course.estimatedCompletion}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => onNavigate("course-detail", course.id)}
                            disabled={course.progress === 100}
                          >
                            {course.progress === 100 ? "Completed" : "Continue Learning"}
                          </Button>
                          {course.progress === 100 && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Certificate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6 mt-6">
            <CertificatesView />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6 mt-6">
            <PaymentHistory userId={user.id} />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Learning Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Schedule feature coming soon</h3>
                  <p className="text-muted-foreground">
                    We're working on a personalized learning schedule to help you stay on track.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}