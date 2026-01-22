/**
 * SADashboard Component
 *
 * Solution Architect role dashboard providing navigation to:
 * - Solution Designs (SD) → SD Increments (SDI)
 * - Technical Architecture (TA) → TA Increments (TAI)
 *
 * Story: s-e009-003 (SA Dashboard)
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
    Card,
    CardContent,
    CardActionArea,
    Chip,
    useTheme,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    getSolutionDesigns,
    getTechnicalArchitecture,
    Artifact,
} from '@/api';
import { getArtifactIcon } from '@/shared/utils';
import { SATree, SATreeNodeData } from './SATree';
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
// Main SADashboard Component
// ============================================================================

export function SADashboard() {
    // Tab state (0 = Solution Designs, 1 = Technical Architecture)
    const [activeTab, setActiveTab] = useState(0);

    // Solution Design state
    const [sdArtifacts, setSdArtifacts] = useState<Artifact[]>([]);
    const [loadingSD, setLoadingSD] = useState(true);
    const [selectedSDId, setSelectedSDId] = useState<string | null>(null);
    const [expandedSDId, setExpandedSDId] = useState<string | null>(null);

    // Technical Architecture state
    const [taArtifacts, setTaArtifacts] = useState<Artifact[]>([]);
    const [loadingTA, setLoadingTA] = useState(true);
    const [selectedTAId, setSelectedTAId] = useState<string | null>(null);
    const [expandedTAId, setExpandedTAId] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [readerArtifact, setReaderArtifact] = useState<Artifact | null>(null);

    // Filter state
    const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'SA' });

    // Icon configs
    const sdIconConfig = getArtifactIcon('solution-design');
    const taIconConfig = getArtifactIcon('technical-architecture');

    // Apply filtering and sorting
    const processedSD = useMemo(
        () => filterAndSortArtifacts(sdArtifacts, showCompleted),
        [sdArtifacts, showCompleted]
    );
    const processedTA = useMemo(
        () => filterAndSortArtifacts(taArtifacts, showCompleted),
        [taArtifacts, showCompleted]
    );

    // Load data
    useEffect(() => {
        getSolutionDesigns(PRODUCT_ID)
            .then(response => setSdArtifacts(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingSD(false));

        getTechnicalArchitecture(PRODUCT_ID)
            .then(response => setTaArtifacts(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingTA(false));
    }, []);

    // Handle SD card click
    const handleSDClick = useCallback((artifact: Artifact) => {
        if (expandedSDId === artifact.id) {
            setExpandedSDId(null);
            setSelectedSDId(null);
        } else {
            setSelectedSDId(artifact.id);
            setExpandedSDId(artifact.id);
        }
    }, [expandedSDId]);

    // Handle TA card click
    const handleTAClick = useCallback((artifact: Artifact) => {
        if (expandedTAId === artifact.id) {
            setExpandedTAId(null);
            setSelectedTAId(null);
        } else {
            setSelectedTAId(artifact.id);
            setExpandedTAId(artifact.id);
        }
    }, [expandedTAId]);

    // Handle tree node selection
    const handleNodeSelect = useCallback((node: SATreeNodeData) => {
        const artifact: Artifact = {
            id: node.id,
            path: node.path,
            title: node.title,
            type: node.type,
            status: node.status,
        };
        setReaderArtifact(artifact);
    }, []);

    // Get selected artifacts for tree
    const selectedSD = processedSD.find(a => a.id === expandedSDId);
    const selectedTA = processedTA.find(a => a.id === expandedTAId);

    // Sidebar content
    const sidebarContent = (
        <>
            {/* Tabs for SD vs TA */}
            <Paper elevation={0} sx={{ mb: 2, borderRadius: 2, border: 1, borderColor: 'divider' }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{
                        '& .MuiTab-root': { fontWeight: 600 },
                    }}
                >
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <sdIconConfig.icon sx={{ color: sdIconConfig.color, fontSize: 18 }} />
                                SD ({processedSD.length})
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <taIconConfig.icon sx={{ color: taIconConfig.color, fontSize: 18 }} />
                                TA ({processedTA.length})
                            </Box>
                        }
                    />
                </Tabs>
            </Paper>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Filter Toggle */}
            <Box sx={{ mb: 2 }}>
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

            {activeTab === 0 ? (
                <ArtifactCardList
                    artifacts={processedSD}
                    loading={loadingSD}
                    selectedId={selectedSDId || undefined}
                    expandedId={expandedSDId || undefined}
                    onArtifactClick={handleSDClick}
                    iconConfig={sdIconConfig}
                    emptyMessage="No solution designs found"
                />
            ) : (
                <ArtifactCardList
                    artifacts={processedTA}
                    loading={loadingTA}
                    selectedId={selectedTAId || undefined}
                    expandedId={expandedTAId || undefined}
                    onArtifactClick={handleTAClick}
                    iconConfig={taIconConfig}
                    emptyMessage="No technical architecture documents found"
                />
            )}
        </>
    );

    // Main content
    const mainContent = (
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
                <AccountTreeIcon sx={{ color: '#8b5cf6' }} />
                {activeTab === 0 ? 'SD → SDI Relationships' : 'TA → TAI Relationships'}
            </Typography>

            {activeTab === 0 ? (
                selectedSD ? (
                    <SATree
                        parentArtifact={selectedSD}
                        treeType="sd"
                        onNodeSelect={handleNodeSelect}
                        showCompleted={showCompleted}
                        projectId={PROJECT_ID}
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
                            Select a Solution Design to view its increments
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Click a card on the left to expand its tree
                        </Typography>
                    </Box>
                )
            ) : (
                selectedTA ? (
                    <SATree
                        parentArtifact={selectedTA}
                        treeType="ta"
                        onNodeSelect={handleNodeSelect}
                        showCompleted={showCompleted}
                        projectId={PROJECT_ID}
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
                            Select a Technical Architecture doc to view its increments
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
            title="Solution Architect Dashboard"
            subtitle={`Product: ${PRODUCT_ID} • Project: ${PROJECT_ID}`}
            breadcrumb="SA Dashboard"
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
