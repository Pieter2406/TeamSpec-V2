import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Alert, FormControlLabel, Checkbox, Tooltip } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {
    getBusinessAnalysis,
    Artifact,
} from '@/api';
import { getArtifactIcon } from '@/shared/utils';
import { BACardList } from './BACard';
import { BATree, BATreeNodeData } from './BATree';
import { ArtifactReader } from '@/features/dashboards/components';
import { DashboardLayout } from '@/features/layout';
import { useArtifactFilter, filterAndSortArtifacts } from '@/shared';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';

export function BADashboard() {
    // Get icon configurations
    const baIconConfig = getArtifactIcon('business-analysis');
    const BAIcon = baIconConfig.icon;
    const [baArtifacts, setBaArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // BA selection state
    const [selectedBAId, setSelectedBAId] = useState<string | null>(null);
    const [expandedBAId, setExpandedBAId] = useState<string | null>(null);

    // Full reader state
    const [readerArtifact, setReaderArtifact] = useState<Artifact | null>(null);

    // Filter state with localStorage persistence
    const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'BA' });

    // Apply filtering and sorting to BA artifacts
    const processedBArtifacts = useMemo(
        () => filterAndSortArtifacts(baArtifacts, showCompleted),
        [baArtifacts, showCompleted]
    );

    // Load BA documents
    const [refreshKey, setRefreshKey] = useState(0);
    useEffect(() => {
        getBusinessAnalysis(PRODUCT_ID)
            .then(response => {
                setBaArtifacts(response.artifacts);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refreshKey]);

    // Refresh callback for status updates
    const handleStatusUpdate = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // Handle BA card click
    const handleBAClick = useCallback((ba: Artifact) => {
        if (expandedBAId === ba.id) {
            // Toggle off - collapse tree
            setExpandedBAId(null);
            setSelectedBAId(null);
        } else {
            // Expand tree for this BA
            setSelectedBAId(ba.id);
            setExpandedBAId(ba.id);
        }
    }, [expandedBAId]);

    // Handle tree node click - open full reader directly
    const handleNodeSelect = useCallback((node: BATreeNodeData) => {
        // Build artifact from node
        const artifact: Artifact = {
            id: node.id,
            path: node.path,
            title: node.title,
            type: node.type === 'ba' ? 'business-analysis' : 'business-analysis-increment',
            status: node.status,
        };
        setReaderArtifact(artifact);
    }, []);

    // Sidebar content
    const sidebarContent = (
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
                <BAIcon sx={{ color: baIconConfig.color }} />
                Business Analysis
            </Typography>

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
                                Toggle to show or hide artifacts with completed states:
                            </Typography>
                            <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5, fontSize: '0.85rem' }}>
                                <li>Done — Completed and closed</li>
                                <li>Retired — No longer in use</li>
                                <li>Deferred — Moved to later release</li>
                                <li>Out-of-Scope — Explicitly excluded</li>
                                <li>Archived — Historical reference</li>
                            </Box>
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
                                Show Completed ({baArtifacts.length - processedBArtifacts.length} hidden)
                            </Typography>
                        }
                    />
                </Tooltip>
            </Box>

            <BACardList
                baArtifacts={processedBArtifacts}
                loading={loading}
                selectedBAId={selectedBAId || undefined}
                expandedBAId={expandedBAId || undefined}
                onBAClick={handleBAClick}
            />
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
                <AccountTreeIcon sx={{ color: baIconConfig.color }} />
                Artifact Relationships
            </Typography>

            {expandedBAId ? (
                <BATree
                    baId={expandedBAId}
                    onNodeSelect={handleNodeSelect}
                    showCompleted={showCompleted}
                    onStatusUpdate={handleStatusUpdate}
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
                        Select a BA document to view its increments
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Click a BA card on the left to expand its tree
                    </Typography>
                </Box>
            )}
        </>
    );

    return (
        <DashboardLayout
            title="Business Analysis Dashboard"
            subtitle={`Product: ${PRODUCT_ID} • Use-Case Centric View`}
            breadcrumb="BA Dashboard"
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
