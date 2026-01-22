import { useState } from 'react';
import { Box } from '@mui/material';
import { RoleProvider, useRole, ToastProvider } from '@/shared/contexts';
import { useGlobalKeyHandler } from '@/shared/hooks';
import { KeyboardShortcutsModal, ShortcutHint } from '@/shared/components';
import { Header, RoleSelector } from '@/features/layout';
import { BADashboard } from '@/features/dashboards/ba';
import { FADashboard } from '@/features/dashboards/fa';
import { DEVDashboard } from '@/features/dashboards/dev';
import { SADashboard } from '@/features/dashboards/sa';
import { QADashboard } from '@/features/dashboards/qa';
import { SearchResults } from '@/features/search';
import { ProductPortfolio } from '@/features/product-portfolio';

type ViewType = 'dashboard' | 'search' | 'portfolio';

function AppContent() {
    const { role } = useRole();
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [shortcutsOpen, setShortcutsOpen] = useState(false);

    // Global keyboard shortcut for '?' to open shortcuts modal
    useGlobalKeyHandler({
        key: '?',
        handler: () => setShortcutsOpen(true),
        enabled: !shortcutsOpen,
    });

    if (!role) {
        return <RoleSelector />;
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentView('search');
    };

    const handleHomeClick = () => {
        setCurrentView('dashboard');
        setSearchQuery('');
    };

    const renderView = () => {
        switch (currentView) {
            case 'search':
                return (
                    <SearchResults
                        query={searchQuery}
                        onClose={() => setCurrentView('dashboard')}
                    />
                );
            case 'portfolio':
                return <ProductPortfolio />;
            case 'dashboard':
            default:
                return (
                    <>
                        {role === 'BA' && <BADashboard />}
                        {role === 'FA' && <FADashboard />}
                        {role === 'DEV' && <DEVDashboard />}
                        {role === 'SA' && <SADashboard />}
                        {role === 'QA' && <QADashboard />}
                    </>
                );
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'hidden',
            bgcolor: 'background.default',
        }}>
            <Header
                onSearch={handleSearch}
                onHomeClick={currentView !== 'dashboard' ? handleHomeClick : undefined}
            />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    minHeight: 0, // Critical: allows flex child to shrink below content size
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {renderView()}
            </Box>
            {/* Footer with shortcut hint */}
            <Box
                component="footer"
                sx={{
                    py: 1,
                    px: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    borderTop: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    flexShrink: 0, // Prevent footer from shrinking
                }}
            >
                <ShortcutHint onClick={() => setShortcutsOpen(true)} />
            </Box>
            {/* Keyboard shortcuts modal */}
            <KeyboardShortcutsModal
                open={shortcutsOpen}
                onClose={() => setShortcutsOpen(false)}
            />
        </Box>
    );
}

function App() {
    return (
        <ToastProvider>
            <RoleProvider>
                <AppContent />
            </RoleProvider>
        </ToastProvider>
    );
}

export default App;
