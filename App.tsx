import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { RemoteControl } from './components/RemoteControl';
import { Settings } from './components/Settings';
import { AIChat } from './components/AIChat';
import { INITIAL_STATS, INITIAL_SETTINGS } from './constants';
import { RobotState, SystemStats, RobotSettings } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // App State
  const [robotState, setRobotState] = useState<RobotState>(RobotState.WORKING);
  const [stats, setStats] = useState<SystemStats>(INITIAL_STATS);
  const [settings, setSettings] = useState<RobotSettings>(INITIAL_SETTINGS);

  // Simulation effect for changing data
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        batteryLevel: Math.max(0, prev.batteryLevel - (robotState === RobotState.WORKING ? 0.05 : 0)),
        temperature: 30 + Math.random() * 5,
        connectionStrength: 90 + Math.floor(Math.random() * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoggedIn, robotState]);

  const updateSetting = (key: keyof RobotSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <HashRouter>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={() => setIsLoggedIn(false)}
      >
        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} state={robotState} />
        )}
        {activeTab === 'control' && (
          <RemoteControl 
            currentState={robotState} 
            onStateChange={setRobotState} 
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            settings={settings} 
            updateSetting={updateSetting} 
          />
        )}
        
        {/* Floating AI Chat Widget */}
        <AIChat stats={stats} state={robotState} settings={settings} />
      </Layout>
    </HashRouter>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
