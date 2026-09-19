import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ChevronRight, ChevronLeft, X, CheckCircle, HelpCircle } from 'lucide-react';

const TOUR_STEPS = [
  {
    target: 'create-team',
    title: '1. Create Your Workspace / Team',
    description: 'Start by creating a workspace team. Open the team selector dropdown in the sidebar and click "Create New Workspace".',
    actionHint: 'Click "Create New Workspace" in the sidebar',
  },
  {
    target: 'add-member',
    title: '2. Invite Members',
    description: 'Add colleagues to your team by clicking the Invite Member button in the Direct Messages section.',
    actionHint: 'Click the + user icon to invite team members',
  },
  {
    target: 'create-project',
    title: '3. Create a Project',
    description: 'Organize your work into projects. Click "+ New Project" in the Kanban Board header to get started.',
    actionHint: 'Click "+ New Project"',
  },
  {
    target: 'create-subtask',
    title: '4. Create Tasks & Subtasks',
    description: 'Add subtasks under your active project, assign priority, deadline, and assign team members.',
    actionHint: 'Click "+ Add Subtask"',
  },
  {
    target: 'navigation-tabs',
    title: '5. Explore Views & Analytics',
    description: 'Switch between Team Channels, Kanban Board, and Real-time Performance Metrics using the navigation menu.',
    actionHint: 'Click any tab to navigate views',
  },
];

export default function OnboardingTour({ isOpen, onClose }) {
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const storageKey = (user?._id || user?.id)
    ? `synccore_onboarding_completed_${user._id || user.id}`
    : 'synccore_onboarding_completed_guest';

  // Reset to step 0 whenever tour opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Recalculate target element bounding rect
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const updateRect = () => {
      const el = document.querySelector(`[data-tour="${currentStep.target}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 500);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isOpen, currentStepIndex, currentStep]);

  if (!isOpen || !currentStep) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col justify-between">
      {/* Darkened backdrop with spotlight cutout if target element exists */}
      <div className="absolute inset-0 bg-black/60 transition-all duration-300 pointer-events-auto">
        {targetRect && (
          <div
            className="absolute rounded-xl border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all duration-300 animate-pulse pointer-events-none"
            style={{
              top: Math.max(0, targetRect.top - 6),
              left: Math.max(0, targetRect.left - 6),
              width: targetRect.width + 12,
              height: targetRect.height + 12,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 20px rgba(16, 185, 129, 0.8)',
            }}
          />
        )}
      </div>

      {/* Floating Onboarding Tour Dialog */}
      <div className="relative z-[10000] pointer-events-auto m-auto max-w-md w-[92vw] p-5 rounded-2xl bg-[#0F172A] border border-emerald-500/40 text-white shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm tracking-tight text-emerald-300">
              New User Quick Start Guide ({currentStepIndex + 1}/{TOUR_STEPS.length})
            </h3>
          </div>
          <button
            onClick={handleComplete}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Title & Content */}
        <div className="mb-4">
          <h4 className="font-bold text-base text-white mb-1.5">{currentStep.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>
          {currentStep.actionHint && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{currentStep.actionHint}</span>
            </div>
          )}
        </div>

        {/* Progress Bar & Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStepIndex
                    ? 'w-5 bg-emerald-400'
                    : idx < currentStepIndex
                    ? 'w-2 bg-emerald-700'
                    : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1 shadow-lg shadow-emerald-500/20"
            >
              {currentStepIndex === TOUR_STEPS.length - 1 ? (
                <>
                  <span>Get Started</span>
                  <CheckCircle className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
