"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  BriefcaseIcon,
  LineChart as LineChartIcon,
  TrendingUp,
  TrendingDown,
  Brain,
  FileText,
  Mail,
  ClipboardList,
  Award,
  Calendar,
  User,
  Rocket,
  Target,
  BookOpen,
  Map,
  MessageCircle,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Eye,
  Trash2,
  TrendingUpDown,
  RefreshCw
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getResume } from "@/actions/resume";
import { getCoverLetters } from "@/actions/cover-letter";
import { getAssessments } from "@/actions/interview";
import { getUserRoadmaps } from "@/actions/roadmap";

const DashboardView = ({ insights, resume: initialResume, coverLetters: initialCoverLetters, assessments: initialAssessments, roadmaps: initialRoadmaps }) => {
  // State for real-time data
  const [resume, setResume] = useState(initialResume);
  const [coverLetters, setCoverLetters] = useState(initialCoverLetters);
  const [assessments, setAssessments] = useState(initialAssessments);
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch updated data with better error handling
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [resumeData, coverLettersData, assessmentsData, roadmapsData] = await Promise.all([
        getResume().catch(err => {
          console.error("Error fetching resume:", err);
          return null;
        }),
        getCoverLetters().catch(err => {
          console.error("Error fetching cover letters:", err);
          return [];
        }),
        getAssessments().catch(err => {
          console.error("Error fetching assessments:", err);
          return [];
        }),
        getUserRoadmaps().catch(err => {
          console.error("Error fetching roadmaps:", err);
          return [];
        })
      ]);

      setResume(resumeData);
      setCoverLetters(coverLettersData);
      setAssessments(assessmentsData);
      setRoadmaps(roadmapsData);
      
      // Log for debugging
      console.log("Dashboard data updated:", {
        resume: !!resumeData,
        coverLetters: coverLettersData?.length || 0,
        assessments: assessmentsData?.length || 0,
        roadmaps: roadmapsData?.length || 0
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load updated dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Set up interval for real-time updates
  useEffect(() => {
    // Fetch data immediately on component mount for quicker updates
    fetchDashboardData();
    
    // Set up interval to fetch data every 5 seconds for more responsive real-time updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Add a more frequent check when the component is focused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // When the tab becomes visible, fetch data immediately
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle cases where data might be missing
  if (!insights) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Error loading dashboard data</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try refreshing the page or contact support
          </p>
        </div>
      </div>
    );
  }

  // Transform salary data for the chart, with fallbacks
  const salaryData = insights.salaryRanges?.map((range) => ({
    name: range.role || "Unknown Role",
    min: (range.min || 0) / 1000,
    max: (range.max || 0) / 1000,
    median: (range.median || 0) / 1000,
  })) || [];

  // Prepare data for pie chart showing skill distribution
  const skillData = (insights.topSkills || []).slice(0, 5).map((skill, index) => ({
    name: skill,
    value: [40, 30, 25, 20, 15][index] || 15
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getDemandLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook?.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChartIcon, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChartIcon, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook)?.icon || LineChartIcon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook)?.color || "text-gray-500";

  // Format dates using date-fns, with fallbacks
  let lastUpdatedDate = "Unknown";
  let nextUpdateDistance = "soon";
  
  try {
    lastUpdatedDate = insights.lastUpdated 
      ? format(new Date(insights.lastUpdated), "dd/MM/yyyy")
      : "Unknown";
      
    nextUpdateDistance = insights.nextUpdate
      ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true })
      : "soon";
  } catch (dateError) {
    console.error("Error formatting dates:", dateError);
    lastUpdatedDate = "Unknown";
    nextUpdateDistance = "soon";
  }

  // Calculate overall progress with fallbacks
  const hasResume = !!resume;
  const hasCoverLetters = (coverLetters?.length || 0) > 0;
  const hasAssessments = (assessments?.length || 0) > 0;
  const hasRoadmaps = (roadmaps?.length || 0) > 0;
  const progressPercentage = 
    ((hasResume ? 1 : 0) + (hasCoverLetters ? 1 : 0) + (hasAssessments ? 1 : 0) + (hasRoadmaps ? 1 : 0)) * 25;

  // Get latest assessment for performance card
  const latestAssessment = assessments?.length > 0 ? assessments[assessments.length - 1] : null;

  // Calculate additional stats
  const totalCoverLetters = coverLetters?.length || 0;
  const totalAssessments = assessments?.length || 0;
  const totalRoadmaps = roadmaps?.length || 0;
  const highestScore = assessments?.length 
    ? Math.max(...assessments.map(a => a.quizScore || 0)) 
    : 0;

  // Get the most recent roadmap
  const latestRoadmap = roadmaps?.length > 0 ? roadmaps[0] : null;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold ">Welcome to Your Career Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and access all your career tools in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm w-full md:w-auto justify-center md:justify-start">
              <Rocket className="w-4 h-4 mr-2" />
              {insights.industry || "Technology"} Industry Insights
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Your Career Progress
            </CardTitle>
            <CardDescription>
              Track your completion of key career development milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Overall Progress</span>
                <span className="font-bold">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${hasResume ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Resume Created</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${hasCoverLetters ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Cover Letters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${hasAssessments ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Assessments Taken</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${hasRoadmaps ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Roadmaps Created</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasResume ? "Created" : "Not Created"}</div>
            <p className="text-xs text-muted-foreground">
              {hasResume ? "Ready to use" : "Create your resume"}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoverLetters}</div>
            <p className="text-xs text-muted-foreground">
              {totalCoverLetters > 0 ? "Ready to use" : "Create new"}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssessments}</div>
            <p className="text-xs text-muted-foreground">
              {totalAssessments > 0 ? "Completed" : "Take your first"}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roadmaps</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoadmaps}</div>
            <p className="text-xs text-muted-foreground">
              {totalRoadmaps > 0 ? "Created" : "Create your first"}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highestScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Your highest assessment score
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Overview */}
      {latestAssessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Latest Performance
              </CardTitle>
              <CardDescription>
                Your most recent assessment results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold">{latestAssessment.quizScore?.toFixed(1) || "0.0"}%</h3>
                  <p className="text-muted-foreground">
                    {latestAssessment.createdAt 
                      ? (() => {
                          try {
                            return format(new Date(latestAssessment.createdAt), "MMM d, yyyy");
                          } catch (e) {
                            return "Unknown date";
                          }
                        })()
                      : "Unknown date"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={latestAssessment.quizScore || 0} className="w-32" />
                  <span className="text-sm font-medium">
                    {(latestAssessment.quizScore || 0) >= 80 ? 'Excellent' : 
                     (latestAssessment.quizScore || 0) >= 60 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                {latestAssessment.improvementTip && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm italic">"{latestAssessment.improvementTip}"</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Market Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LineChartIcon className="w-5 h-5 mr-2" />
                <CardTitle className="font-semibold leading-none tracking-tight">
                  Industry Insights
                </CardTitle>
              </div>
              <Badge variant="outline">
                Updated {lastUpdatedDate}
              </Badge>
            </div>
            <CardDescription>
              Key metrics for the {insights.industry || "Technology"} industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Market Outlook
                  </CardTitle>
                  <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{insights.marketOutlook || "Neutral"}</div>
                  <p className="text-xs text-muted-foreground">
                    Next update {nextUpdateDistance}
                  </p>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Industry Growth
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights.growthRate?.toFixed(1) || "0.0"}%
                  </div>
                  <Progress value={insights.growthRate || 0} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
                  <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{insights.demandLevel || "Medium"}</div>
                  <div
                    className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                      insights.demandLevel
                    )}`}
                  />
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {(insights.topSkills || []).slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Salary Ranges Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BriefcaseIcon className="w-5 h-5 mr-2" />
                Salary Ranges (in thousands)
              </CardTitle>
              <CardDescription>
                Average salary ranges for key roles in {insights.industry || "Technology"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[90vh] max-h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salaryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={false}
                    axisLine={false}
                    height={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    domain={[0, 'dataMax + 20']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      fontSize: '12px'
                    }}
                    formatter={(value, name, props) => [value, `${props.payload.name}: ${name}`]}
                  />
                  <Legend 
                    wrapperStyle={{ 
                    }}
                  />
                  <Bar dataKey="min" fill="hsl(var(--primary))" name="Min Salary" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="median" fill="hsl(var(--chart-2))" name="Median Salary" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" fill="hsl(var(--chart-3))" name="Max Salary" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Key Industry Trends
              </CardTitle>
              <CardDescription>
                Current trends shaping the {insights.industry || "Technology"} industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {(insights.keyTrends || []).slice(0, 5).map((trend, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start space-x-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                  >
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                    <span>{trend}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Recommended Skills
              </CardTitle>
              <CardDescription>
                Skills to consider developing for career growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(insights.recommendedSkills || []).slice(0, 8).map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.1 + index * 0.05 }}
                  >
                    <Badge variant="outline">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardView;