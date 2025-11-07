"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoadmapVisualizer from "../_components/roadmap-visualizer";
import RoadmapSteps from "../_components/roadmap-steps";
import { getRoadmapById, updateRoadmapProgress, saveRoadmap } from "@/actions/roadmap";
import { motion } from "framer-motion";
import { 
  Map, 
  ArrowLeft,
  Edit3,
  Save,
  Download,
  FileText,
  Target,
  CheckCircle,
  Sparkles,
  Loader2
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
import { toast } from "sonner";
import { Suspense } from 'react';

// Separate component for the main content that uses useSearchParams
function RoadmapViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roadmapId = searchParams.get('id');
  
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoadmap, setEditedRoadmap] = useState("");
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [progress, setProgress] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!roadmapId) {
        router.push('/roadmap');
        return;
      }
      
      try {
        setLoading(true);
        const roadmap = await getRoadmapById(roadmapId);
        if (roadmap) {
          setRoadmapData(roadmap);
          setEditedRoadmap(JSON.stringify(roadmap, null, 2));
          
          // Initialize visual nodes for React Flow with better spacing
          const initialNodes = (roadmap.steps || []).map((step, index) => ({
            id: step.id.toString(), // Ensure ID is a string
            x: 100 + (index % 2) * 400, // Increased spacing between nodes
            y: 100 + Math.floor(index / 2) * 300, // Increased vertical spacing
            title: step.title,
            description: step.description,
            duration: step.duration
          }));
          
          const initialConnections = (roadmap.steps || []).slice(0, -1).map((_, index) => ({
            from: roadmap.steps[index].id.toString(), // Ensure ID is a string
            to: roadmap.steps[index + 1].id.toString() // Ensure ID is a string
          }));
          
          setNodes(initialNodes);
          setConnections(initialConnections);
          
          // Initialize progress tracking
          const initialProgress = roadmap.progress || {};
          (roadmap.steps || []).forEach(step => {
            if (initialProgress[step.id] === undefined) {
              initialProgress[step.id] = false;
            }
          });
          setProgress(initialProgress);
        } else {
          toast.error("Roadmap not found");
          router.push('/roadmap');
        }
      } catch (error) {
        console.error("Failed to fetch roadmap:", error);
        toast.error("Failed to load roadmap");
        router.push('/roadmap');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [roadmapId, router]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const toggleStepCompletion = async (stepId) => {
    const newProgress = {
      ...progress,
      [stepId]: !progress[stepId]
    };
    
    setProgress(newProgress);
    
    // Save progress to database
    try {
      setIsSaving(true);
      await updateRoadmapProgress(roadmapId, newProgress);
      toast.success(progress[stepId] ? "Step marked as incomplete" : "Step marked as complete");
    } catch (error) {
      console.error("Failed to update progress:", error);
      toast.error("Failed to save progress");
      // Revert the change if save failed
      setProgress(prev => ({
        ...prev,
        [stepId]: !newProgress[stepId]
      }));
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate completion percentage
  const completionPercentage = roadmapData ? 
    Math.round((Object.values(progress).filter(Boolean).length / roadmapData.steps.length) * 100) : 0;

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

      const exportFileDefaultName = `career-roadmap-${roadmapData.title.replace(/\s+/g, '-').toLowerCase()}.json`;

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
      
      toast.success("Roadmap saved successfully!");
    } catch (error) {
      console.error("Failed to save roadmap:", error);
      toast.error("Failed to save roadmap");
    }
  };

  // Only render motion components on the client side to prevent hydration errors
  const MotionDiv = isClient ? motion.div : 'div';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4">
      {/* Back to Roadmaps Button - Moved to top similar to Back to Cover Letters */}
      <div className="mb-4">
        <Button onClick={() => router.push('/roadmap')} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
      </div>

      {/* Header with animation */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Career Roadmap</h1>
          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={handleEditToggle} variant="outline">
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "View" : "Edit"}
            </Button>
            <Button onClick={handleExportRoadmap} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </MotionDiv>

      {/* Progress Overview Cards */}
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

      {/* Roadmap Visualization */}
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
                <Button onClick={handleSaveRoadmap} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Roadmap
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

      {/* Spacer to prevent content from touching footer */}
      <div className="h-8"></div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

// Main page component wrapped in Suspense
export default function RoadmapViewPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RoadmapViewContent />
    </Suspense>
  );
}
