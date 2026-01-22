/**
 * QADashboard Component
 *
 * QA Engineer role dashboard providing navigation to:
 * - Feature Increments → Test Cases (project scope)
 * - Features → Regression Tests (product scope)
 * - Bug Reports (flat list)
 *
 * Story: s-e009-004 (QA Dashboard)
 * Feature: f-TSV-002 (Role-specific dashboards)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Alert,
    Paper,
    FormControlLabel,
    Checkbox,
    Tooltip,
    Tabs,
    Tab,
    Chip,
    Badge,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Card,
    CardContent,
    CardActionArea,
    useTheme,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    getFeatureIncrements,
    getFeatures,
    getBugReports,
    Artifact,
} from '@/api';
import { getArtifactIcon } from '@/shared/utils';
import { QATree, QATreeNodeData } from './QATree';
import { ArtifactReader } from '@/features/dashboards/components';
import { DashboardLayout } from '@/features/layout';
import { useArtifactFilter, filterAndSortArtifacts } from '@/shared';
import { TBDIndicator } from '@/shared/components';
import { getCardSx, getThemedStatusColor } from '@/shared/styles';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';
const PROJECT_ID = 'teamspecviewermvp';

// ============================================================================
// Artifact Card Component (Bug-009 fix: match FeatureCard pattern)
// ============================================================================

interface ArtifactCardProps {
    artifact: Artifact;
    isSelected: boolean;
    isExpanded: boolean;
    onClick: () => void;
    iconConfig: { icon: React.ElementType; color: string };
}

function ArtifactCard({ artifact, isSelected, isExpanded, onClick, iconConfig }: ArtifactCardProps) {
    const theme = useTheme();
    const Icon = iconConfig.icon;
    const statusColor = getThemedStatusColor(theme, artifact.status);
    const cardSx = getCardSx(theme, { isSelected, isExpanded });

    return (
        <Card
            sx={{
                mb: 1,
                borderRadius: 2,
                ...cardSx,
            }}
        >
            <CardActionArea onClick={onClick}>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        {/* Expand/Collapse Icon */}
                        <Box sx={{ color: 'text.secondary', mt: 0.25 }}>
                            {isExpanded ? (
                                <ExpandMoreIcon sx={{ fontSize: 20 }} />
                            ) : (
                                <ChevronRightIcon sx={{ fontSize: 20 }} />
                            )}
                        </Box>

                        {/* Colored Icon Background */}
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                bgcolor: `${iconConfig.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Icon sx={{ color: iconConfig.color, fontSize: 20 }} />
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* Title Row with Status and TBD */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        lineHeight: 1.3,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {artifact.title}
                                </Typography>
                                <TBDIndicator show={artifact.hasTBD ?? false} size="small" />
                                {artifact.status && (
                                    <Chip
                                        label={artifact.status}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            bgcolor: statusColor.bg,
                                            color: statusColor.text,
                                            borderRadius: 1,
                                        }}
                                    />
                                )}
                            </Box>

                            {/* ID Row */}
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                }}
                            >
                                {artifact.id}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

// ============================================================================
// Artifact Card List Component
// ============================================================================

interface ArtifactCardListProps {
    artifacts: Artifact[];
    loading: boolean;
    selectedId?: string;
    expandedId?: string;
    onArtifactClick: (artifact: Artifact) => void;
    iconConfig: { icon: React.ElementType; color: string };
    emptyMessage: string;
}

function ArtifactCardList({
    artifacts,
    loading,
    selectedId,
    expandedId,
    onArtifactClick,
    iconConfig,
    emptyMessage,
}: ArtifactCardListProps) {
    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                {[1, 2, 3].map((i) => (
                    <Paper
                        key={i}
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 1,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            bgcolor: 'action.hover',
                            height: 64,
                        }}
                    />
                ))}
            </Box>
        );
    }

    if (artifacts.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">{emptyMessage}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            {artifacts.map((artifact) => (
                <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    isSelected={selectedId === artifact.id}
                    isExpanded={expandedId === artifact.id}
                    onClick={() => onArtifactClick(artifact)}
                    iconConfig={iconConfig}
                />
            ))}
        </Box>
    );
}

// ============================================================================
// Bug Reports Panel Component
// ============================================================================

interface BugReportsPanelProps {
    bugs: Artifact[];
    loading: boolean;
    onBugClick: (bug: Artifact) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    Open: { bg: '#fee2e2', text: '#991b1b' },
    'In Progress': { bg: '#dbeafe', text: '#1e40af' },
    Resolved: { bg: '#dcfce7', text: '#166534' },
    Closed: { bg: '#f3f4f6', text: '#374151' },
};

function BugReportsPanel({ bugs, loading, onBugClick }: BugReportsPanelProps) {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} />
            </Box>
        );
    }

    if (bugs.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">No bug reports found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <List dense sx={{ py: 0 }}>
                {bugs.map((bug) => {
                    const statusStyle = STATUS_COLORS[bug.status || ''] || { bg: '#f3f4f6', text: '#374151' };
                    return (
                        <ListItem key={bug.id} disablePadding>
                            <ListItemButton onClick={() => onBugClick(bug)} sx={{ py: 1 }}>
                                <BugReportIcon sx={{ color: '#ef4444', mr: 1.5, fontSize: 20 }} />
                                <ListItemText
                                    primary={bug.title}
                                    secondary={bug.id}
                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                    secondaryTypographyProps={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                />
                                {bug.status && (
                                    <Chip
                                        label={bug.status}
                                        size="small"
                                        sx={{
                                            bgcolor: statusStyle.bg,
                                            color: statusStyle.text,
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}

// ============================================================================
// Main QADashboard Component
// ============================================================================

export function QADashboard() {
    // Tab state (0 = FI → Test Cases, 1 = Features → Regression Tests, 2 = Bug Reports)
    const [activeTab, setActiveTab] = useState(0);

    // Feature Increments state
    const [fiArtifacts, setFiArtifacts] = useState<Artifact[]>([]);
    const [loadingFI, setLoadingFI] = useState(true);
    const [selectedFIId, setSelectedFIId] = useState<string | null>(null);
    const [expandedFIId, setExpandedFIId] = useState<string | null>(null);

    // Features state
    const [features, setFeatures] = useState<Artifact[]>([]);
    const [loadingFeatures, setLoadingFeatures] = useState(true);
    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
    const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);

    // Bug reports state
    const [bugReports, setBugReports] = useState<Artifact[]>([]);
    const [loadingBugs, setLoadingBugs] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const [readerArtifact, setReaderArtifact] = useState<Artifact | null>(null);

    // Filter state
    const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'QA' });

    // Icon configs
    const fiIconConfig = getArtifactIcon('feature-increment');
    const featureIconConfig = getArtifactIcon('feature');

    // Apply filtering and sorting
    const processedFI = useMemo(
        () => filterAndSortArtifacts(fiArtifacts, showCompleted),
        [fiArtifacts, showCompleted]
    );
    const processedFeatures = useMemo(
        () => filterAndSortArtifacts(features, showCompleted),
        [features, showCompleted]
    );

    // Open bugs count
    const openBugsCount = useMemo(
        () => bugReports.filter(bug => bug.status === 'Open' || bug.status === 'In Progress').length,
        [bugReports]
    );

    // Load data
    useEffect(() => {
        getFeatureIncrements(PROJECT_ID)
            .then(response => setFiArtifacts(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingFI(false));

        getFeatures(PRODUCT_ID)
            .then(response => setFeatures(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingFeatures(false));

        getBugReports(PROJECT_ID)
            .then(response => setBugReports(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingBugs(false));
    }, []);

    // Handle FI card click
    const handleFIClick = useCallback((artifact: Artifact) => {
        if (expandedFIId === artifact.id) {
            setExpandedFIId(null);
            setSelectedFIId(null);
        } else {
            setSelectedFIId(artifact.id);
            setExpandedFIId(artifact.id);
        }
    }, [expandedFIId]);

    // Handle Feature card click
    const handleFeatureClick = useCallback((artifact: Artifact) => {
        if (expandedFeatureId === artifact.id) {
            setExpandedFeatureId(null);
            setSelectedFeatureId(null);
        } else {
            setSelectedFeatureId(artifact.id);
            setExpandedFeatureId(artifact.id);
        }
    }, [expandedFeatureId]);

    // Handle tree node selection
    const handleNodeSelect = useCallback((node: QATreeNodeData) => {
        const artifact: Artifact = {
            id: node.id,
            path: node.path,
            title: node.title,
            type: node.type,
            status: node.status,
        };
        setReaderArtifact(artifact);
    }, []);

    // Handle bug click
    const handleBugClick = useCallback((bug: Artifact) => {
        setReaderArtifact(bug);
    }, []);

    // Get selected artifacts for tree
    const selectedFI = processedFI.find(a => a.id === expandedFIId);
    const selectedFeature = processedFeatures.find(a => a.id === expandedFeatureId);

    // QA dashboard has special layout for Bug Reports tab (no sidebar)
    // so we need custom rendering

    // Sidebar content - always show tabs for navigation
    const sidebarContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            {/* Tabs for FI vs Features vs Bugs - always visible */}
            <Paper elevation={0} sx={{ mb: 2, borderRadius: 2, border: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{
                        '& .MuiTab-root': { fontWeight: 600, minWidth: 'auto', px: 1.5, fontSize: '0.8rem' },
                    }}
                >
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <fiIconConfig.icon sx={{ color: fiIconConfig.color, fontSize: 16 }} />
                                FI ({processedFI.length})
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <featureIconConfig.icon sx={{ color: featureIconConfig.color, fontSize: 16 }} />
                                Reg ({processedFeatures.length})
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {openBugsCount > 0 ? (
                                    <Badge badgeContent={openBugsCount} color="error">
                                        <BugReportIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                                    </Badge>
                                ) : (
                                    <BugReportIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                                )}
                                Bugs ({bugReports.length})
                            </Box>
                        }
                    />
                </Tabs>
            </Paper>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2, flexShrink: 0 }}>
                    {error}
                </Alert>
            )}

            {/* Filter Toggle - only for FI and Features tabs */}
            {activeTab !== 2 && (
                <Box sx={{ mb: 2, flexShrink: 0 }}>
                    <Tooltip
                        title={
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    Show Completed Artifacts
                                </Typography>
                                <Typography variant="body2">
                                    Toggle to show or hide artifacts with completed states
                                </Typography>
                            </Box>
                        }
                        placement="right"
                        arrow
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showCompleted}
                                    onChange={(e) => setShowCompleted(e.target.checked)}
                                    size="small"
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Show Completed
                                </Typography>
                            }
                        />
                    </Tooltip>
                </Box>
            )}

            {/* Tab Content */}
            {activeTab === 0 && (
                <ArtifactCardList
                    artifacts={processedFI}
                    loading={loadingFI}
                    selectedId={selectedFIId || undefined}
                    expandedId={expandedFIId || undefined}
                    onArtifactClick={handleFIClick}
                    iconConfig={fiIconConfig}
                    emptyMessage="No feature increments found"
                />
            )}
            {activeTab === 1 && (
                <ArtifactCardList
                    artifacts={processedFeatures}
                    loading={loadingFeatures}
                    selectedId={selectedFeatureId || undefined}
                    expandedId={expandedFeatureId || undefined}
                    onArtifactClick={handleFeatureClick}
                    iconConfig={featureIconConfig}
                    emptyMessage="No features found"
                />
            )}
            {activeTab === 2 && (
                <BugReportsPanel
                    bugs={bugReports}
                    loading={loadingBugs}
                    onBugClick={handleBugClick}
                />
            )}
        </Box>
    );

    // Main content
    const mainContent = activeTab === 2 ? (
        // Bug reports - show nothing or selected bug info
        <Box
            sx={{
                p: 4,
                textAlign: 'center',
                color: 'text.secondary',
                bgcolor: 'action.hover',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <BugReportIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography variant="body1">
                Click a bug report on the left to view details
            </Typography>
        </Box>
    ) : (
        <>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <AccountTreeIcon sx={{ color: '#f59e0b' }} />
                {activeTab === 0 ? 'FI → Test Cases' : 'Feature → Regression Tests'}
            </Typography>

            {activeTab === 0 ? (
                selectedFI ? (
                    <QATree
                        parentArtifact={selectedFI}
                        treeType="fi"
                        onNodeSelect={handleNodeSelect}
                        showCompleted={showCompleted}
                        scopeId={PROJECT_ID}
                    />
                ) : (
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            color: 'text.secondary',
                            bgcolor: 'action.hover',
                            borderRadius: 2,
                            border: '1px dashed',
                            borderColor: 'divider',
                        }}
                    >
                        <AccountTreeIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                        <Typography variant="body1">
                            Select a Feature Increment to view its Test Cases
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Click a card on the left to expand its tree
                        </Typography>
                    </Box>
                )
            ) : (
                selectedFeature ? (
                    <QATree
                        parentArtifact={selectedFeature}
                        treeType="feature"
                        onNodeSelect={handleNodeSelect}
                        showCompleted={showCompleted}
                        scopeId={PRODUCT_ID}
                    />
                ) : (
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            color: 'text.secondary',
                            bgcolor: 'action.hover',
                            borderRadius: 2,
                            border: '1px dashed',
                            borderColor: 'divider',
                        }}
                    >
                        <AccountTreeIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                        <Typography variant="body1">
                            Select a Feature to view its Regression Tests
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Click a card on the left to expand its tree
                        </Typography>
                    </Box>
                )
            )}
        </>
    );

    return (
        <DashboardLayout
            title={`QA Dashboard${openBugsCount > 0 ? ` (${openBugsCount} Open Bug${openBugsCount > 1 ? 's' : ''})` : ''}`}
            subtitle={`Product: ${PRODUCT_ID} • Project: ${PROJECT_ID}`}
            breadcrumb="QA Dashboard"
            sidebar={sidebarContent}
            main={mainContent}
        >
            {/* Artifact Reader Drawer */}
            <ArtifactReader
                artifact={readerArtifact}
                onClose={() => setReaderArtifact(null)}
            />
        </DashboardLayout>
    );
}
