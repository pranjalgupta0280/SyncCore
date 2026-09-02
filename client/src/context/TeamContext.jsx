import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { getSocket } from '../services/socket';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'tasks', 'analytics'
  const [activeDmUser, setActiveDmUser] = useState(null); // null means channel chat
  const [loadingTeams, setLoadingTeams] = useState(false);

  const fetchTeams = async () => {
    if (!user) return;
    setLoadingTeams(true);
    try {
      const res = await API.get('/teams');
      if (res.data.success) {
        setTeams(res.data.data);
        if (res.data.data.length > 0 && !activeTeam) {
          setActiveTeam(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoadingTeams(false);
    }
  };

  const fetchProjects = async (teamId) => {
    if (!teamId) return;
    try {
      const res = await API.get(`/teams/${teamId}/projects`);
      if (res.data.success) {
        setProjects(res.data.data);
        if (res.data.data.length > 0) {
          setActiveProject(res.data.data[0]);
        } else {
          setActiveProject(null);
        }
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchAnalytics = async (teamId) => {
    if (!teamId) return;
    try {
      const res = await API.get(`/analytics/teams/${teamId}/stats`);
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTeams();
    } else {
      setTeams([]);
      setActiveTeam(null);
      setProjects([]);
      setActiveProject(null);
    }
  }, [user]);

  useEffect(() => {
    if (activeTeam) {
      fetchProjects(activeTeam._id);
      fetchAnalytics(activeTeam._id);

      const socket = getSocket();
      if (socket) {
        socket.emit('join_team', { teamId: activeTeam._id });
      }
    }
  }, [activeTeam]);

  const createTeam = async (name, description) => {
    const res = await API.post('/teams', { name, description });
    if (res.data.success) {
      await fetchTeams();
      setActiveTeam(res.data.data);
      return res.data.data;
    }
  };

  const createProject = async (title, description, deadline) => {
    if (!activeTeam) return;
    const res = await API.post(`/teams/${activeTeam._id}/projects`, {
      title,
      description,
      deadline,
    });
    if (res.data.success) {
      await fetchProjects(activeTeam._id);
      setActiveProject(res.data.data);
      return res.data.data;
    }
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        activeTeam,
        setActiveTeam,
        projects,
        activeProject,
        setActiveProject,
        analytics,
        activeTab,
        setActiveTab,
        activeDmUser,
        setActiveDmUser,
        loadingTeams,
        fetchTeams,
        fetchProjects,
        fetchAnalytics,
        createTeam,
        createProject,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
