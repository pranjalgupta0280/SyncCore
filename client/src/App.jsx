import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TeamProvider, useTeam } from './context/TeamContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import TaskBoard from './components/TaskBoard';
import AnalyticsPanel from './components/AnalyticsPanel';
import AuthModal from './components/AuthModal';
import MemberModal from './components/MemberModal';
import TeamModal from './components/TeamModal';

function MainApp() {
  const { user, loading } = useAuth();
  const { activeTab } = useTeam();
  const { theme } = useTheme();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  if (loading) {
    return (
      <div className={`h-screen w-screen flex items-center justify-center text-xs font-semibold tracking-wider uppercase ${
        theme === 'light' ? 'bg-[#f8fafc] text-emerald-700' : 'bg-[#050505] text-emerald-400'
      }`}>
        Initializing SyncCore Platform...
      </div>
    );
  }

  // Unauthenticated user -> Show Landing Page
  if (!user) {
    return (
      <>
        <LandingPage
          onGetStarted={() => setShowAuthModal(true)}
          onLogin={() => setShowAuthModal(true)}
        />
        {showAuthModal && (
          <div className="relative z-50">
            <AuthModal onClose={() => setShowAuthModal(false)} />
          </div>
        )}
      </>
    );
  }

  // Authenticated user -> Show Workspace Dashboard
  return (
    <div className={`flex h-screen w-screen overflow-hidden ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#050505] text-white'
    }`}>
      {/* Sidebar */}
      <Sidebar
        onOpenMemberModal={() => setIsMemberModalOpen(true)}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {activeTab === 'chat' && <ChatPanel />}
        {activeTab === 'tasks' && <TaskBoard />}
        {activeTab === 'analytics' && <AnalyticsPanel />}
      </main>

      {/* Modals */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TeamProvider>
          <MainApp />
        </TeamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

