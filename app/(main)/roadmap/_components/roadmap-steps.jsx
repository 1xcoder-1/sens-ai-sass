"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Check, 
  Clock, 
  Target,
  Sparkles,
  Trophy,
  PartyPopper
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function RoadmapSteps({ steps, progress = {}, onStepToggle }) {
  const [isClient, setIsClient] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if all steps are completed and show popup
  useEffect(() => {
    if (!steps || !progress || steps.length === 0) return;

    const completedCount = steps.filter(step => progress[step.id]).length;
    const allCompleted = completedCount === steps.length;
    
    // Show popup only when all steps become completed (not on initial load)
    if (allCompleted && completedCount > previousCompletedCount && previousCompletedCount > 0) {
      setShowCompletionPopup(true);
    }
    
    setPreviousCompletedCount(completedCount);
  }, [progress, steps, previousCompletedCount]);

  // Don't render motion components during SSR to prevent hydration errors
  if (!isClient) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">
          Roadmap Steps
        </h3>
        
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = progress[step.id] || false;
            return (
              <div 
                key={step.id} 
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  isCompleted ? 'border-green-500 bg-green-50' : 'hover:shadow-lg'
                }`}
              >
                <Card className="border-0 shadow-none">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-100'
                      }`}>
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <span className="text-blue-800 font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-grow w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="w-full">
                            <h4 className={`text-lg font-bold ${
                              isCompleted ? 'text-green-800 line-through' : 'text-white'
                            }`}>
                              {step.title}
                            </h4>
                            <p className="text-gray-200 mt-2 text-sm sm:text-base">{step.description}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="p-2 h-auto self-start"
                            onClick={() => onStepToggle && onStepToggle(step.id)}
                          >
                            {isCompleted ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <Target className="h-5 w-5 text-gray-400 hover:text-green-500" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.duration}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`flex items-center gap-1 ${
                              isCompleted ? 'border-green-500 text-green-700' : ''
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <Check className="h-3 w-3" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Target className="h-3 w-3" />
                                Pending
                              </>
                            )}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant={isCompleted ? "outline" : "default"}
                            className="flex items-center gap-1 whitespace-nowrap"
                            onClick={() => onStepToggle && onStepToggle(step.id)}
                          >
                            {isCompleted ? (
                              <>
                                <Check className="h-4 w-4" />
                                <span className="hidden xs:inline">Completed</span>
                                <span className="xs:hidden">Done</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                <span className="hidden xs:inline">Start</span>
                                <span className="xs:hidden">Go</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.h3 
        className="text-xl font-bold text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Roadmap Steps
      </motion.h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = progress[step.id] || false;
          return (
            <motion.div 
              key={step.id} 
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                isCompleted ? 'border-green-500 bg-green-50' : 'hover:shadow-lg'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-none">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-100'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <span className="text-blue-800 font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-grow w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="w-full">
                          <h4 className={`text-lg font-bold ${
                            isCompleted ? 'text-green-800 line-through' : 'text-white'
                          }`}>
                            {step.title}
                          </h4>
                          <p className="text-gray-200 mt-2 text-sm sm:text-base">{step.description}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-2 h-auto self-start"
                          onClick={() => onStepToggle && onStepToggle(step.id)}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <Target className="h-5 w-5 text-gray-400 hover:text-green-500" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.duration}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`flex items-center gap-1 ${
                            isCompleted ? 'border-green-500 text-green-700' : ''
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <Check className="h-3 w-3" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Target className="h-3 w-3" />
                              Pending
                            </>
                          )}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant={isCompleted ? "outline" : "default"}
                          className="flex items-center gap-1 whitespace-nowrap"
                          onClick={() => onStepToggle && onStepToggle(step.id)}
                        >
                          {isCompleted ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span className="hidden xs:inline">Completed</span>
                              <span className="xs:hidden">Done</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              <span className="hidden xs:inline">Start</span>
                              <span className="xs:hidden">Go</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Popup */}
      <Dialog open={showCompletionPopup} onOpenChange={setShowCompletionPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <span className="text-2xl">Congratulations!</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-lg mb-2">You've completed all the steps in your roadmap!</p>
            <p className="text-muted-foreground">
              Great job staying committed to your career goals. Keep up the excellent work!
            </p>
            <div className="flex justify-center mt-4">
              <PartyPopper className="h-6 w-6 text-yellow-500 animate-bounce" />
              <Sparkles className="h-6 w-6 text-blue-500 mx-2 animate-pulse" />
              <PartyPopper className="h-6 w-6 text-yellow-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <Button onClick={() => setShowCompletionPopup(false)}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}