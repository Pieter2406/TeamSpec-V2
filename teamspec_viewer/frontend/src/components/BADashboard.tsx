import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
    getBusinessAnalysis,
    getBusinessAnalysisIncrements,
    Artifact,
} from '../api/artifacts';
import { ArtifactList } from './ArtifactList';
import { ArtifactReader } from './ArtifactReader';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';
const PROJECT_ID = 'teamspecviewermvp';

export function BADashboard() {
    const [baArtifacts, setBaArtifacts] = useState<Artifact[]>([]);
    const [baiArtifacts, setBaiArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

    useEffect(() => {
        Promise.all([
            getBusinessAnalysis(PRODUCT_ID),
            getBusinessAnalysisIncrements(PROJECT_ID),
        ])
            .then(([baData, baiData]) => {
                setBaArtifacts(baData.artifacts);
                setBaiArtifacts(baiData.artifacts);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                BA Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Product: {PRODUCT_ID} | Project: {PROJECT_ID}
            </Typography>

            {error && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
                    <Typography color="error.contrastText">{error}</Typography>
                </Paper>
            )}

            <ArtifactList
                title="Business Analysis"
                artifacts={baArtifacts}
                loading={loading}
                onSelect={setSelectedArtifact}
            />

            <ArtifactList
                title="Business Analysis Increments"
                artifacts={baiArtifacts}
                loading={loading}
                onSelect={setSelectedArtifact}
            />

            <ArtifactReader
                artifact={selectedArtifact}
                onClose={() => setSelectedArtifact(null)}
            />
        </Box>
    );
}
