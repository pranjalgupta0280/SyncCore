import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TeamProvider, useTeam } from './context/TeamContext';
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

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0B0F19] flex items-center justify-center text-xs text-emerald-400 font-semibold tracking-wider uppercase">
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
    <div className="flex h-screen w-screen bg-[#0B0F19] text-white overflow-hidden">
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
    <AuthProvider>
      <TeamProvider>
        <MainApp />
      </TeamProvider>
    </AuthProvider>
  );
}
