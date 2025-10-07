import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DataOrang from './pages/DataOrang';
import RumahTangga from './pages/RumahTangga';
import Silsilah from './pages/Silsilah';
import Peta from './pages/Peta';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orang':
        return <DataOrang />;
      case 'rumah-tangga':
        return <RumahTangga />;
      case 'silsilah':
        return <Silsilah />;
      case 'peta':
        return <Peta />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 lg:ml-0 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
