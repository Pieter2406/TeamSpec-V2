import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Alert, FormControlLabel, Checkbox, Tooltip } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {
    getFeatures,
    Artifact,
} from '@/api';
import { FeatureCardList } from './FeatureCard';
import { ArtifactTree, TreeNodeData } from '@/shared/components';
import { ArtifactReader } from '@/features/dashboards/components';
import { FIDetailView } from './FIDetailView';
import { DashboardLayout } from '@/features/layout';
import { useArtifactFilter, filterAndSortArtifacts } from '@/shared';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';

export function FADashboard() {
    const [features, setFeatures] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Feature selection state
    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
    const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);

    // Full reader state
    const [readerArtifact, setReaderArtifact] = useState<Artifact | null>(null);
    const [fiDetailArtifact, setFiDetailArtifact] = useState<Artifact | null>(null);

    // Filter state with localStorage persistence
    const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'FA' });

    // Apply filtering and sorting to features
    const processedFeatures = useMemo(
        () => filterAndSortArtifacts(features, showCompleted),
        [features, showCompleted]
    );

    // Load features
    const [refreshKey, setRefreshKey] = useState(0);
    useEffect(() => {
        getFeatures(PRODUCT_ID)
            .then(response => {
                setFeatures(response.artifacts);
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

    // Handle feature card click
    const handleFeatureClick = useCallback((feature: Artifact) => {
        if (expandedFeatureId === feature.id) {
            // Toggle off - collapse tree
            setExpandedFeatureId(null);
            setSelectedFeatureId(null);
        } else {
            // Expand tree for this feature
            setSelectedFeatureId(feature.id);
            setExpandedFeatureId(feature.id);
        }
    }, [expandedFeatureId]);

    // Handle tree node click - open full reader directly
    const handleNodeSelect = useCallback((node: TreeNodeData) => {
        // Build artifact from node
        const artifact: Artifact = {
            id: node.id,
            path: node.path,
            title: node.title,
            type: node.type,
            status: node.status,
        };

        // Open appropriate viewer
        if (node.type === 'feature-increment') {
            setFiDetailArtifact(artifact);
        } else {
            setReaderArtifact(artifact);
        }
    }, []);

    // Handle story click from FI detail view
    const handleStoryClick = useCallback((story: Artifact) => {
        setFiDetailArtifact(null);
        setReaderArtifact(story);
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
                <AccountTreeIcon sx={{ color: '#3b82f6' }} />
                Features
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
                                Show Completed ({features.length - processedFeatures.length} hidden)
                            </Typography>
                        }
                    />
                </Tooltip>
            </Box>

            <FeatureCardList
                features={processedFeatures}
                loading={loading}
                selectedFeatureId={selectedFeatureId || undefined}
                expandedFeatureId={expandedFeatureId || undefined}
                onFeatureClick={handleFeatureClick}
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
                <AccountTreeIcon sx={{ color: '#8b5cf6' }} />
                Artifact Relationships
            </Typography>

            {expandedFeatureId ? (
                <ArtifactTree
                    featureId={expandedFeatureId}
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
                        Select a feature to view its artifact relationships
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Click a feature card on the left to expand its tree
                    </Typography>
                </Box>
            )}
        </>
    );

    return (
        <DashboardLayout
            title="Functional Analysis Dashboard"
            subtitle={`Product: ${PRODUCT_ID} • Use-Case Centric View`}
            breadcrumb="FA Dashboard"
            sidebar={sidebarContent}
            main={mainContent}
        >
            {/* Artifact Reader Drawer (for non-FI artifacts) */}
            <ArtifactReader
                artifact={readerArtifact}
                onClose={() => setReaderArtifact(null)}
            />

            {/* FI Detail View (for feature increments with AS-IS/TO-BE tabs) */}
            <FIDetailView
                artifact={fiDetailArtifact}
                onClose={() => setFiDetailArtifact(null)}
                onStoryClick={handleStoryClick}
            />
        </DashboardLayout>
    );
}
