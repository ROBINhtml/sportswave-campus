import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CertificateGenerator } from "./CertificateGenerator";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Circle, 
  Download, 
  MessageCircle, 
  Send, 
  Award,
  FileText,
  Video,
  Users,
  Clock,
  Star
} from "lucide-react";

interface CoursePlayerProps {
  courseId: string;
  onNavigate: (page: string) => void;
  user?: any;
}

// Sample course data
const courseData = {
  id: "1",
  title: "Foundation Football Coaching",
  instructor: "John Mbeki",
  description: "Master the fundamentals of football coaching with this comprehensive course designed for aspiring coaches in Africa.",
  rating: 4.8,
  students: 156,
  totalLessons: 8,
  duration: "6 weeks",
  image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
  lessons: [
    {
      id: 1,
      title: "Introduction to Football Coaching",
      duration: "15:30",
      type: "video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sample video
      completed: true,
      materials: [
        { name: "Coaching Fundamentals Guide.pdf", size: "2.3 MB" },
        { name: "FIFA Coaching Guidelines.pdf", size: "1.8 MB" }
      ]
    },
    {
      id: 2,
      title: "Understanding Player Psychology",
      duration: "22:45",
      type: "video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      completed: true,
      materials: [
        { name: "Player Psychology Worksheet.pdf", size: "1.2 MB" }
      ]
    },
    {
      id: 3,
      title: "Basic Training Techniques",
      duration: "18:20",
      type: "video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      completed: false,
      materials: [
        { name: "Training Drills Manual.pdf", size: "3.1 MB" },
        { name: "Equipment Checklist.pdf", size: "0.8 MB" }
      ]
    },
    {
      id: 4,
      title: "Quiz: Coaching Fundamentals",
      duration: "10:00",
      type: "quiz",
      completed: false,
      questions: [
        {
          question: "What is the most important quality of a good football coach?",
          options: ["Technical knowledge", "Communication skills", "Physical fitness", "All of the above"],
          correct: 3
        },
        {
          question: "How often should youth players train per week?",
          options: ["Every day", "2-3 times", "Once a week", "5-6 times"],
          correct: 1
        }
      ]
    }
  ]
};

// Sample discussion data
const discussions = {
  1: [
    {
      id: 1,
      user: "Sarah M.",
      avatar: "SM",
      time: "2 hours ago",
      message: "Great introduction to the course! I'm excited to learn more about player psychology.",
      replies: [
        {
          id: 2,
          user: "John Mbeki",
          avatar: "JM",
          time: "1 hour ago",
          message: "Thank you Sarah! The psychology aspect is crucial for effective coaching. You'll love the next lesson.",
          isInstructor: true
        }
      ]
    },
    {
      id: 3,
      user: "David K.",
      avatar: "DK",
      time: "5 hours ago",
      message: "Question: Should I focus on technical skills or teamwork first with young players?",
      replies: []
    }
  ]
};

export function CoursePlayer({ courseId, onNavigate, user }: CoursePlayerProps) {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);

  const currentLessonData = courseData.lessons.find(lesson => lesson.id === currentLesson);
  const completedLessons = courseData.lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / courseData.totalLessons) * 100;
  const currentDiscussion = discussions[currentLesson] || [];

  const handleLessonComplete = () => {
    const lesson = courseData.lessons.find(l => l.id === currentLesson);
    if (lesson) {
      lesson.completed = true;
      // Check if course is completed
      const allCompleted = courseData.lessons.every(l => l.completed);
      if (allCompleted) {
        setShowCertificate(true);
      }
    }
  };

  const handleQuizSubmit = () => {
    setShowQuizResults(true);
    handleLessonComplete();
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // In a real app, this would add to the discussion
      setNewComment("");
    }
  };

  return (
    <div className="pt-20 pb-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate("courses")}
            className="mb-4"
          >
            ← Back to Courses
          </Button>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6">
              <img 
                src={courseData.image} 
                alt={courseData.title}
                className="w-full lg:w-80 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{courseData.title}</h1>
                <p className="text-muted-foreground mb-4">{courseData.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{courseData.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{courseData.students} students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{courseData.duration}</span>
                  </div>
                  <Badge variant="secondary">{courseData.totalLessons} lessons</Badge>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Course Progress</span>
                    <span>{Math.round(progressPercentage)}% Complete</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentLessonData?.title}</span>
                  <Badge variant={currentLessonData?.completed ? "default" : "secondary"}>
                    {currentLessonData?.completed ? "Completed" : "In Progress"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentLessonData?.type === "video" ? (
                  <div className="space-y-4">
                    {/* Video Player */}
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <iframe
                        src={currentLessonData.videoUrl}
                        title={currentLessonData.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                    
                    {/* Video Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Duration: {currentLessonData.duration}
                        </span>
                      </div>
                      
                      {!currentLessonData.completed && (
                        <Button onClick={handleLessonComplete}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </Button>
                      )}
                    </div>

                    {/* Materials */}
                    {currentLessonData.materials && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Lesson Materials
                        </h4>
                        <div className="space-y-2">
                          {currentLessonData.materials.map((material, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium text-sm">{material.name}</p>
                                <p className="text-xs text-muted-foreground">{material.size}</p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Quiz Content
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Quiz Assessment</h3>
                      <p className="text-muted-foreground">Test your knowledge from the previous lessons</p>
                    </div>

                    {!showQuizResults ? (
                      <div className="space-y-6">
                        {currentLessonData.questions?.map((question, questionIndex) => (
                          <Card key={questionIndex}>
                            <CardContent className="p-6">
                              <h4 className="font-medium mb-4">
                                Question {questionIndex + 1}: {question.question}
                              </h4>
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`question-${questionIndex}`}
                                      value={optionIndex}
                                      onChange={() => setQuizAnswers({
                                        ...quizAnswers,
                                        [questionIndex]: optionIndex
                                      })}
                                      className="text-primary"
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Button 
                          onClick={handleQuizSubmit}
                          className="w-full"
                          disabled={Object.keys(quizAnswers).length !== currentLessonData.questions?.length}
                        >
                          Submit Quiz
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-green-50 rounded-lg">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Quiz Completed!</h3>
                        <p className="text-muted-foreground mb-4">
                          You scored {Object.keys(quizAnswers).filter(key => 
                            quizAnswers[parseInt(key)] === currentLessonData.questions?.[parseInt(key)].correct
                          ).length} out of {currentLessonData.questions?.length} questions correctly.
                        </p>
                        <Badge variant="default">Lesson Complete</Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* Discussion Section */}
                <Separator className="my-6" />
                <Tabs defaultValue="discussion" className="w-full">
                  <TabsList>
                    <TabsTrigger value="discussion">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Discussion ({currentDiscussion.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="discussion" className="space-y-4 mt-6">
                    {/* Add Comment */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex space-x-3">
                          <Avatar>
                            <AvatarFallback>YU</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Ask a question or share your thoughts..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                              <Send className="h-4 w-4 mr-2" />
                              Post Comment
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Comments */}
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {currentDiscussion.map((comment) => (
                          <Card key={comment.id}>
                            <CardContent className="p-4">
                              <div className="flex space-x-3">
                                <Avatar>
                                  <AvatarFallback>{comment.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium">{comment.user}</span>
                                    {comment.isInstructor && (
                                      <Badge variant="default" className="text-xs">Instructor</Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                                  </div>
                                  <p className="text-sm">{comment.message}</p>
                                  
                                  {/* Replies */}
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="mt-3 ml-6 pl-3 border-l">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-medium text-sm">{reply.user}</span>
                                        {reply.isInstructor && (
                                          <Badge variant="default" className="text-xs">Instructor</Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">{reply.time}</span>
                                      </div>
                                      <p className="text-sm">{reply.message}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Outline */}
            <Card>
              <CardHeader>
                <CardTitle>Course Outline</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-2">
                    {courseData.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          currentLesson === lesson.id 
                            ? "bg-primary/10 border-primary" 
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setCurrentLesson(lesson.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {lesson.type === "video" ? (
                              <Video className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">{lesson.title}</span>
                          </div>
                          {lesson.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-6">
                          {lesson.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Certificate Generation */}
            {progressPercentage === 100 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-yellow-500" />
                    Course Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Congratulations! You've completed all lessons in this course.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => setShowCertificate(true)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Certificate Generator */}
        <CertificateGenerator
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          studentName={user?.name || "Student"}
          courseName={courseData.title}
          completionDate={new Date().toISOString()}
          courseId={courseData.id}
        />
      </div>
    </div>
  );
}