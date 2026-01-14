import { Box } from '@mui/material';
import { RoleProvider, useRole } from './contexts/RoleContext';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { BADashboard } from './components/BADashboard';
import { FADashboard } from './components/FADashboard';

function AppContent() {
    const { role } = useRole();

    if (!role) {
        return <RoleSelector />;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {role === 'BA' && <BADashboard />}
                {role === 'FA' && <FADashboard />}
            </Box>
        </Box>
    );
}

function App() {
    return (
        <RoleProvider>
            <AppContent />
        </RoleProvider>
    );
}

export default App;
