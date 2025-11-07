"use client";

import { useState, useRef, useEffect } from "react";
import RoadmapVisualizer from "./_components/roadmap-visualizer";
import RoadmapSteps from "./_components/roadmap-steps";
import { createRoadmap, saveRoadmap, getUserRoadmaps, deleteRoadmap } from "@/actions/roadmap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map, 
  Plus, 
  Save, 
  Download, 
  Upload, 
  Edit3, 
  Move, 
  Trash2,
  Sparkles,
  Target,
  Lightbulb,
  FileText,
  TrendingUp,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  User,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  Settings,
  ArrowLeft,
  BookOpen,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

export default function RoadmapPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [careerField, setCareerField] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoadmap, setEditedRoadmap] = useState("");
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [progress, setProgress] = useState({});
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [timeFrame, setTimeFrame] = useState("standard");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [previousRoadmaps, setPreviousRoadmaps] = useState([]);
  const [loadingPreviousRoadmaps, setLoadingPreviousRoadmaps] = useState(true);
  const [errorLoadingRoadmaps, setErrorLoadingRoadmaps] = useState(false);
  const [showPreviousRoadmaps, setShowPreviousRoadmaps] = useState(false);
  const [showRoadmapList, setShowRoadmapList] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [deleteRoadmapId, setDeleteRoadmapId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Set isClient to true after component mounts to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load previous roadmaps on component mount
  useEffect(() => {
    const loadPreviousRoadmaps = async () => {
      try {
        setLoadingPreviousRoadmaps(true);
        setErrorLoadingRoadmaps(false);
        const roadmaps = await getUserRoadmaps();
        setPreviousRoadmaps(roadmaps);
      } catch (error) {
        console.error("Failed to load previous roadmaps:", error);
        setErrorLoadingRoadmaps(true);
        toast.error("Failed to load previous roadmaps");
      } finally {
        setLoadingPreviousRoadmaps(false);
      }
    };

    loadPreviousRoadmaps();
  }, []);

  // AI roadmap generation function
  const handleGenerateRoadmap = async () => {
    if (!careerField.trim()) {
      toast.error("Please enter a career field");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Enhanced prompt with additional parameters
      const enhancedPrompt = `${careerField}${additionalInfo ? ` with focus on: ${additionalInfo}` : ''}`;
      const roadmap = await createRoadmap(enhancedPrompt);
      
      // Initialize progress tracking
      const initialProgress = {};
      roadmap.steps.forEach(step => {
        initialProgress[step.id] = false;
      });
      
      // Save the roadmap to database
      const roadmapToSave = {
        ...roadmap,
        progress: initialProgress
      };
      
      const savedRoadmap = await saveRoadmap(roadmapToSave);
      
      // Refresh previous roadmaps after saving
      try {
        const roadmaps = await getUserRoadmaps();
        setPreviousRoadmaps(roadmaps);
      } catch (error) {
        console.error("Failed to refresh previous roadmaps:", error);
      }
      
      // Redirect to the view page with the saved roadmap ID
      window.location.href = `/roadmap/view?id=${savedRoadmap.id}`;
    } catch (error) {
      toast.error("Failed to generate roadmap");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save roadmap to database
  const handleSaveRoadmap = async () => {
    if (!roadmapData) {
      toast.error("No roadmap to save");
      return;
    }

    try {
      const roadmapToSave = {
        ...roadmapData,
        progress
      };
      
      await saveRoadmap(roadmapToSave);
      
      // Refresh previous roadmaps after saving
      try {
        const roadmaps = await getUserRoadmaps();
        setPreviousRoadmaps(roadmaps);
      } catch (error) {
        console.error("Failed to refresh previous roadmaps:", error);
      }
      
      toast.success("Roadmap saved successfully!");
    } catch (error) {
      console.error("Failed to save roadmap:", error);
      toast.error("Failed to save roadmap");
    }
  };

  // Export roadmap as JSON file
  const handleExportRoadmap = () => {
    if (!roadmapData) {
      toast.error("No roadmap to export");
      return;
    }

    try {
      const dataToExport = {
        ...roadmapData,
        progress,
        exportedAt: new Date().toISOString()
      };

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `career-roadmap-${careerField.replace(/\s+/g, '-').toLowerCase()}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast.success("Roadmap exported successfully!");
    } catch (error) {
      console.error("Failed to export roadmap:", error);
      toast.error("Failed to export roadmap");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const toggleStepCompletion = (stepId) => {
    setProgress(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
    
    toast.success(progress[stepId] ? "Step marked as incomplete" : "Step marked as complete");
  };

  // Function to show the new roadmap creation form
  const handleCreateNewRoadmap = () => {
    setRoadmapData(null);
    setCareerField("");
    setExperienceLevel("beginner");
    setTimeFrame("standard");
    setAdditionalInfo("");
    setShowPreviousRoadmaps(false);
    setShowRoadmapList(false);
  };

  // Function to show previous roadmaps
  const handleShowPreviousRoadmaps = () => {
    setShowPreviousRoadmaps(true);
  };

  // Function to show roadmap list
  const handleShowRoadmapList = () => {
    setShowRoadmapList(true);
    setRoadmapData(null);
  };

  // Function to load a roadmap
  const handleLoadRoadmap = (roadmap) => {
    // Navigate to the roadmap view page with the roadmap ID
    window.location.href = `/roadmap/view?id=${roadmap.id}`;
  };

  // Function to handle loading a roadmap from the previous roadmaps section
  const handleLoadPreviousRoadmap = (roadmap) => {
    setRoadmapData({
      title: roadmap.title,
      description: roadmap.description,
      steps: roadmap.steps
    });
    setProgress(roadmap.progress || {});
    setShowPreviousRoadmaps(false);
    toast.success("Roadmap loaded successfully!");
  };

  // Delete a roadmap
  const handleDeleteRoadmap = async (roadmapId) => {
    setIsDeleting(true);
    try {
      await deleteRoadmap(roadmapId);
      
      // Refresh the list of roadmaps
      const roadmaps = await getUserRoadmaps();
      setPreviousRoadmaps(roadmaps);
      
      toast.success("Roadmap deleted successfully!");
    } catch (error) {
      console.error("Failed to delete roadmap:", error);
      toast.error(error.message || "Failed to delete roadmap");
    } finally {
      setIsDeleting(false);
      setDeleteRoadmapId(null);
    }
  };

  // Calculate completion percentage
  const completionPercentage = roadmapData ? 
    Math.round((Object.values(progress).filter(Boolean).length / roadmapData.steps.length) * 100) : 0;

  // Preset career options
  const careerOptions = [
    "Software Engineering",
    "Data Science",
    "Product Management",
    "Digital Marketing",
    "UX/UI Design",
    "Cybersecurity",
    "Cloud Architecture",
    "Project Management",
    "Artificial Intelligence",
    // Add more options as needed
  ];

  // Format date in a way that avoids hydration issues
  const formatDate = (dateString) => {
    // Return a consistent placeholder during SSR
    if (typeof window === 'undefined') {
      return 'Loading...';
    }
    
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Only render motion components on the client side
  const MotionDiv = isClient ? motion.div : 'div';
  const MotionCard = isClient ? motion.div : 'div';

  return (
    <div className="space-y-8 px-4">
      {/* Header with animation */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-title ">Career Roadmap</h1>
          {/* Show Save and Export buttons only when roadmap is generated */}
          {roadmapData && (
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={handleSaveRoadmap} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleExportRoadmap} className="w-full md:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          )}
        </div>
      </MotionDiv>

      {/* Career Field Input - Always visible */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Map className="h-5 w-5" />
              Generate Your Career Roadmap
            </CardTitle>
            <CardDescription>
              Enter your desired career field to generate a personalized roadmap
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Career Field
                </label>
                <Select onValueChange={setCareerField} value={careerField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a career field" />
                  </SelectTrigger>
                  <SelectContent>
                    {careerOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other (specify below)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Experience Level
                </label>
                <Select onValueChange={setExperienceLevel} value={experienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                    <SelectItem value="career-change">Career Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(!careerField || careerField === "other") && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Specify Career Field
                </label>
                <Input
                  placeholder="e.g., Software Engineering, Data Science, Marketing, etc."
                  value={careerField === "other" ? "" : careerField}
                  onChange={(e) => setCareerField(e.target.value)}
                  className="flex-grow"
                />
              </div>
            )}
            
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced-options">
                <AccordionTrigger className="text-sm font-medium flex items-center gap-2 hover:no-underline">
                  <Settings className="h-4 w-4" />
                  Advanced Options
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time Frame
                      </label>
                      <Select onValueChange={setTimeFrame} value={timeFrame}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time frame" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accelerated">Accelerated (3-6 months)</SelectItem>
                          <SelectItem value="standard">Standard (6-12 months)</SelectItem>
                          <SelectItem value="extended">Extended (12+ months)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Budget Consideration
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Budget (Free resources)</SelectItem>
                          <SelectItem value="medium">Medium Budget ($500-2000)</SelectItem>
                          <SelectItem value="high">High Budget ($2000+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Additional Focus Areas (Optional)
                    </label>
                    <Textarea
                      placeholder="e.g., Remote work opportunities, specific technologies, certifications, etc."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleGenerateRoadmap} 
                disabled={isGenerating}
                className="w-full sm:w-auto relative"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2 h-4 w-4"
                    >
                      <Loader2 className="h-4 w-4" />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Personalized Roadmap
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Our AI will create a personalized roadmap based on your career goals and preferences
            </p>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Progress Overview Cards - Only shown when roadmap is generated */}
      {roadmapData && (
        <MotionDiv 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roadmapData.steps.length}</div>
              <p className="text-xs text-muted-foreground">Phases to success</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <p className="text-xs text-muted-foreground">Of roadmap completed</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI-Powered</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">Personalized for you</p>
            </CardContent>
          </Card>
        </MotionDiv>
      )}

      {/* Roadmap Visualization - Only shown when roadmap is generated */}
      {roadmapData && isClient && (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Map className="h-5 w-5" />
                    {roadmapData.title}
                  </CardTitle>
                  <CardDescription>
                    {roadmapData.description}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleEditToggle}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? "View" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedRoadmap}
                  onChange={(e) => setEditedRoadmap(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
              ) : (
                <div className="space-y-6">
                  <div className="h-[700px] border rounded-lg bg-muted/30 p-4">
                    <RoadmapVisualizer 
                      nodes={nodes}
                      connections={connections}
                      progress={progress}
                      onStepToggle={toggleStepCompletion}
                    />
                  </div>
                  
                  <RoadmapSteps 
                    steps={roadmapData.steps} 
                    progress={progress}
                    onStepToggle={toggleStepCompletion}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </MotionDiv>
      )}

      {/* Previous Roadmaps Section - Always visible below the input form */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  Your Previous Roadmaps
                </CardTitle>
                <CardDescription>
                  View and load roadmaps you've created previously
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingPreviousRoadmaps ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : errorLoadingRoadmaps ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                <h3 className="mt-4 font-medium">Error loading roadmaps</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There was an issue loading your previous roadmaps. Please try again later.
                </p>
              </div>
            ) : previousRoadmaps.length > 0 ? (
              <div className="space-y-4">
                {previousRoadmaps.map((roadmap, index) => (
                  <MotionDiv
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="group relative">
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <CardTitle className="text-xl text-white">
                              {roadmap.title}
                            </CardTitle>
                            <CardDescription>
                              Created {formatDate(roadmap.createdAt)}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleLoadRoadmap(roadmap)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteRoadmapId(roadmap.id);
                              }}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-muted-foreground text-sm line-clamp-3">
                          {roadmap.description}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-3">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {roadmap.steps?.length || 0} steps
                        </div>
                      </CardContent>
                    </Card>
                  </MotionDiv>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Map className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 font-medium">No previous roadmaps</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate your first roadmap to see it here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRoadmapId} onOpenChange={() => setDeleteRoadmapId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the roadmap
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteRoadmap(deleteRoadmapId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Spacer to prevent content from touching footer */}
      <div className="h-8"></div>
    </div>
  );
}