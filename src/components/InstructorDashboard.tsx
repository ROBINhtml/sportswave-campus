import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit, 
  Eye,
  Upload,
  Play,
  FileText,
  BarChart3,
  FolderOpen,
  PenSquare
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CourseMaterialManager } from "./CourseMaterialManager";


interface InstructorDashboardProps {
  user: any;
  onNavigate: (page: string, courseId?: string) => void;
}

const instructorCourses = [
  {
    id: "1",
    title: "Foundation Football Coaching",
    students: 156,
    revenue: 13884,
    rating: 4.8,
    status: "published",
    lastUpdated: "2024-01-15",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop",
    category: "Football",
    price: 89,
    lessons: 20,
    completionRate: 78
  },
  {
    id: "2",
    title: "Advanced Football Tactics",
    students: 89,
    revenue: 11125,
    rating: 4.9,
    status: "published",
    lastUpdated: "2024-01-20",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=200&fit=crop",
    category: "Football",
    price: 125,
    lessons: 24,
    completionRate: 65
  },
  {
    id: "3",
    title: "Youth Coaching Fundamentals",
    students: 0,
    revenue: 0,
    rating: 0,
    status: "draft",
    lastUpdated: "2024-01-25",
    image: "https://images.unsplash.com/photo-1582142306936-62663703a2b3?w=300&h=200&fit=crop",
    category: "Youth Coaching",
    price: 95,
    lessons: 18,
    completionRate: 0
  }
];

const recentStudents = [
  {
    id: "1",
    name: "Michael Osei",
    course: "Foundation Football Coaching",
    progress: 85,
    lastActive: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
  },
  {
    id: "2",
    name: "Amina Hassan",
    course: "Advanced Football Tactics",
    progress: 60,
    lastActive: "1 day ago",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
  },
  {
    id: "3",
    name: "David Mensah",
    course: "Foundation Football Coaching",
    progress: 95,
    lastActive: "3 hours ago",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
  }
];

export function InstructorDashboard({ user, onNavigate }: InstructorDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCourseId, setSelectedCourseId] = useState(instructorCourses[0]?.id || "1");
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: ""
  });

  const totalStudents = instructorCourses.reduce((acc, course) => acc + course.students, 0);
  const totalRevenue = instructorCourses.reduce((acc, course) => acc + course.revenue, 0);
  const publishedCourses = instructorCourses.filter(course => course.status === "published").length;
  const avgRating = instructorCourses.filter(c => c.rating > 0).reduce((acc, course) => acc + course.rating, 0) / 
                   instructorCourses.filter(c => c.rating > 0).length || 0;

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock course creation - in real app would call API
    alert("Course created successfully! (This is a mock implementation)");
    setNewCourse({ title: "", description: "", category: "", price: "", duration: "" });
  };

  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and track your teaching impact.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Published Courses</p>
                  <p className="text-2xl font-bold">{publishedCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-accent" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
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
            <TabsTrigger value="materials">Course Materials</TabsTrigger>
            <TabsTrigger value="create">Create Course</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Student Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-4 p-3 border rounded">
                      <ImageWithFallback
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{student.progress}% complete</p>
                        <p className="text-xs text-muted-foreground">{student.lastActive}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab("create")}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    Create New Course
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => onNavigate("create-blog-post")}
                  >
                    <PenSquare className="h-6 w-6 mb-2" />
                    Write Blog Post
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab("students")}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    View All Students
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab("materials")}
                  >
                    <FolderOpen className="h-6 w-6 mb-2" />
                    Manage Materials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">My Courses</h2>
              <Button onClick={() => setActiveTab("create")}>
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </div>

            <div className="grid gap-6">
              {instructorCourses.map((course) => (
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
                            <p className="text-muted-foreground">{course.category} • {course.lessons} lessons</p>
                          </div>
                          <Badge 
                            variant={course.status === "published" ? "default" : "secondary"}
                            className={course.status === "published" ? "bg-green-500" : ""}
                          >
                            {course.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Students</p>
                            <p className="font-medium">{course.students}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-medium">${course.revenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Rating</p>
                            <p className="font-medium">{course.rating > 0 ? course.rating.toFixed(1) : "No ratings"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Completion</p>
                            <p className="font-medium">{course.completionRate}%</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              setActiveTab("materials");
                            }}
                          >
                            <FolderOpen className="h-4 w-4 mr-1" />
                            Materials
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Course Materials</h2>
                <p className="text-muted-foreground">Upload and manage materials for your courses</p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="course-select" className="text-sm">Course:</Label>
                <select
                  id="course-select"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {instructorCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <CourseMaterialManager 
              user={user} 
              courseId={selectedCourseId} 
            />
          </TabsContent>

          <TabsContent value="create" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Course</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCourse} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter course title"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Football, Athletics"
                        value={newCourse.category}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="Course price"
                        value={newCourse.price}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 6 weeks"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse(prev => ({ ...prev, duration: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your course content and what students will learn..."
                      value={newCourse.description}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Course Content</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Upload Course Materials</p>
                      <p className="text-muted-foreground mb-4">
                        Add videos, documents, quizzes, and other course content
                      </p>
                      <Button variant="outline">
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">Create Course</Button>
                    <Button type="button" variant="outline">Save as Draft</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Detailed student analytics coming soon</h3>
                  <p className="text-muted-foreground">
                    Track individual student progress, send messages, and provide personalized feedback.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Advanced analytics coming soon</h3>
                  <p className="text-muted-foreground">
                    Get detailed insights into course performance, student engagement, and revenue trends.
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