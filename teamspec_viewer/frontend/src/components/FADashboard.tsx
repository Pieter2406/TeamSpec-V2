import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
    getFeatures,
    getFeatureIncrements,
    getEpics,
    getStories,
    Artifact,
} from '../api/artifacts';
import { ArtifactList } from './ArtifactList';
import { ArtifactReader } from './ArtifactReader';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';
const PROJECT_ID = 'teamspecviewermvp';

export function FADashboard() {
    const [features, setFeatures] = useState<Artifact[]>([]);
    const [featureIncrements, setFeatureIncrements] = useState<Artifact[]>([]);
    const [epics, setEpics] = useState<Artifact[]>([]);
    const [stories, setStories] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

    useEffect(() => {
        Promise.all([
            getFeatures(PRODUCT_ID),
            getFeatureIncrements(PROJECT_ID),
            getEpics(PROJECT_ID),
            getStories(PROJECT_ID),
        ])
            .then(([featuresData, fiData, epicsData, storiesData]) => {
                setFeatures(featuresData.artifacts);
                setFeatureIncrements(fiData.artifacts);
                setEpics(epicsData.artifacts);
                setStories(storiesData.artifacts);
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
                FA Dashboard
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
                title="Features"
                artifacts={features}
                loading={loading}
                onSelect={setSelectedArtifact}
            />

            <ArtifactList
                title="Feature Increments"
                artifacts={featureIncrements}
                loading={loading}
                onSelect={setSelectedArtifact}
            />

            <ArtifactList
                title="Epics"
                artifacts={epics}
                loading={loading}
                onSelect={setSelectedArtifact}
            />

            <ArtifactList
                title="Stories"
                artifacts={stories}
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
