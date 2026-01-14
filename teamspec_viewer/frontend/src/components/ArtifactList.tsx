import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { Artifact } from '../api/artifacts';

interface ArtifactListProps {
    title: string;
    artifacts: Artifact[];
    loading?: boolean;
    error?: string;
    onSelect: (artifact: Artifact) => void;
    emptyMessage?: string;
}

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
    Approved: 'success',
    Proposed: 'info',
    Draft: 'warning',
    Done: 'success',
    'In Progress': 'primary',
    Backlog: 'default',
};

export function ArtifactList({
    title,
    artifacts,
    loading,
    error,
    onSelect,
    emptyMessage = 'No artifacts found',
}: ArtifactListProps) {
    if (loading) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (artifacts.length === 0) {
        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
                    {title}
                </Typography>
                <Typography sx={{ p: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                    {emptyMessage}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
                {title}
            </Typography>
            <List dense>
                {artifacts.map((artifact) => (
                    <ListItem key={artifact.id} disablePadding>
                        <ListItemButton onClick={() => onSelect(artifact)}>
                            <ListItemText
                                primary={artifact.title}
                                secondary={artifact.id}
                            />
                            {artifact.status && (
                                <Chip
                                    label={artifact.status}
                                    size="small"
                                    color={STATUS_COLORS[artifact.status] || 'default'}
                                    variant="outlined"
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
