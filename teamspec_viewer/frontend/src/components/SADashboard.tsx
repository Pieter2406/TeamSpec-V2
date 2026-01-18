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
    Container,
    Grid,
    Alert,
    Breadcrumbs,
    Link,
    Paper,
    FormControlLabel,
    Checkbox,
    Tooltip,
    Tabs,
    Tab,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {
    getSolutionDesigns,
    getTechnicalArchitecture,
    Artifact,
} from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';
import { SATree, SATreeNodeData } from './SATree';
import { ArtifactReader } from './ArtifactReader';
import { useArtifactFilter } from '../hooks/useArtifactFilter';
import { filterAndSortArtifacts } from '../utils/artifactSorting';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';
const PROJECT_ID = 'teamspecviewermvp';

// ============================================================================
// Artifact Card Component
// ============================================================================

interface ArtifactCardProps {
    artifact: Artifact;
    isSelected: boolean;
    isExpanded: boolean;
    onClick: () => void;
    iconConfig: { icon: React.ElementType; color: string };
}

function ArtifactCard({ artifact, isSelected, isExpanded, onClick, iconConfig }: ArtifactCardProps) {
    const Icon = iconConfig.icon;
    
    return (
        <Paper
            elevation={0}
            onClick={onClick}
            sx={{
                p: 2,
                mb: 1,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isExpanded ? '#8b5cf6' : isSelected ? '#3b82f6' : '#e2e8f0',
                borderRadius: 2,
                bgcolor: isExpanded ? '#f5f3ff' : isSelected ? '#eff6ff' : 'white',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: '#8b5cf6',
                    bgcolor: '#faf5ff',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Icon sx={{ color: iconConfig.color, fontSize: 24 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {artifact.title}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#64748b',
                            fontFamily: 'monospace',
                            fontSize: '0.7rem',
                        }}
                    >
                        {artifact.id}
                    </Typography>
                </Box>
                {artifact.status && (
                    <Typography
                        variant="caption"
                        sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontWeight: 600,
                            bgcolor: artifact.status === 'Approved' ? '#dcfce7' : '#fef3c7',
                            color: artifact.status === 'Approved' ? '#166534' : '#92400e',
                        }}
                    >
                        {artifact.status}
                    </Typography>
                )}
            </Box>
        </Paper>
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
                            border: '1px solid #e2e8f0',
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            height: 64,
                        }}
                    />
                ))}
            </Box>
        );
    }

    if (artifacts.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
                <Typography variant="body2">{emptyMessage}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
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

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs sx={{ mb: 3 }}>
                    <Link
                        color="inherit"
                        href="#"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                        <HomeIcon sx={{ fontSize: 18 }} />
                        Home
                    </Link>
                    <Typography color="text.primary" fontWeight={600}>
                        SA Dashboard
                    </Typography>
                </Breadcrumbs>

                {/* Page Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}
                    >
                        Solution Architect Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Product: <strong>{PRODUCT_ID}</strong> &bull; Project: <strong>{PROJECT_ID}</strong>
                    </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Tabs for SD vs TA */}
                <Paper elevation={0} sx={{ mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        sx={{
                            '& .MuiTab-root': { fontWeight: 600 },
                            borderBottom: '1px solid #e2e8f0',
                        }}
                    >
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <sdIconConfig.icon sx={{ color: sdIconConfig.color }} />
                                    Solution Designs ({processedSD.length})
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <taIconConfig.icon sx={{ color: taIconConfig.color }} />
                                    Technical Architecture ({processedTA.length})
                                </Box>
                            }
                        />
                    </Tabs>
                </Paper>

                {/* Main Layout */}
                <Grid container spacing={3}>
                    {/* Left Column: Artifact Cards */}
                    <Grid item xs={12} md={5} lg={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid #e2e8f0',
                                bgcolor: 'white',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                {activeTab === 0 ? (
                                    <>
                                        <sdIconConfig.icon sx={{ color: sdIconConfig.color }} />
                                        Solution Designs
                                    </>
                                ) : (
                                    <>
                                        <taIconConfig.icon sx={{ color: taIconConfig.color }} />
                                        Technical Architecture
                                    </>
                                )}
                            </Typography>

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
                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
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
                        </Paper>
                    </Grid>

                    {/* Right Column: Tree View */}
                    <Grid item xs={12} md={7} lg={8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid #e2e8f0',
                                bgcolor: 'white',
                                minHeight: 400,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
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
                                            color: '#94a3b8',
                                            bgcolor: '#f8fafc',
                                            borderRadius: 2,
                                            border: '1px dashed #e2e8f0',
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
                                            color: '#94a3b8',
                                            bgcolor: '#f8fafc',
                                            borderRadius: 2,
                                            border: '1px dashed #e2e8f0',
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
                        </Paper>
                    </Grid>
                </Grid>

                {/* Artifact Reader Drawer */}
                <ArtifactReader
                    artifact={readerArtifact}
                    onClose={() => setReaderArtifact(null)}
                />
            </Container>
        </Box>
    );
}
