import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Drawer } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getArtifactContent, Artifact } from '../api/artifacts';
import { TbdHighlighter } from './TbdHighlighter';

interface ArtifactReaderProps {
    artifact: Artifact | null;
    onClose: () => void;
}

export function ArtifactReader({ artifact, onClose }: ArtifactReaderProps) {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!artifact) {
            setContent('');
            return;
        }

        setLoading(true);
        setError(null);

        getArtifactContent(artifact.path)
            .then((data) => {
                setContent(data.content);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [artifact]);

    return (
        <Drawer
            anchor="right"
            open={!!artifact}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', md: '60%', lg: '50%' } },
            }}
        >
            {artifact && (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: 1,
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <IconButton onClick={onClose} aria-label="close">
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h6">{artifact.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {artifact.path}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
                        {loading && <Typography>Loading...</Typography>}
                        {error && <Typography color="error">{error}</Typography>}
                        {!loading && !error && content && (
                            <TbdHighlighter content={content}>
                                {(processedContent: string) => (
                                    <Box
                                        className="markdown-content"
                                        sx={{
                                            '& h1': { fontSize: '2rem', fontWeight: 'bold', mb: 2, mt: 3 },
                                            '& h2': { fontSize: '1.5rem', fontWeight: 'bold', mb: 1.5, mt: 2.5 },
                                            '& h3': { fontSize: '1.25rem', fontWeight: 'bold', mb: 1, mt: 2 },
                                            '& p': { mb: 1.5 },
                                            '& ul, & ol': { pl: 3, mb: 1.5 },
                                            '& li': { mb: 0.5 },
                                            '& table': {
                                                borderCollapse: 'collapse',
                                                width: '100%',
                                                mb: 2,
                                                '& th, & td': {
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    p: 1,
                                                    textAlign: 'left',
                                                },
                                                '& th': {
                                                    bgcolor: 'grey.100',
                                                    fontWeight: 'bold',
                                                },
                                            },
                                            '& code': {
                                                bgcolor: 'grey.100',
                                                px: 0.5,
                                                borderRadius: 0.5,
                                                fontFamily: 'monospace',
                                            },
                                            '& pre': {
                                                bgcolor: 'grey.100',
                                                p: 2,
                                                borderRadius: 1,
                                                overflow: 'auto',
                                                '& code': {
                                                    bgcolor: 'transparent',
                                                    p: 0,
                                                },
                                            },
                                            '& blockquote': {
                                                borderLeft: 4,
                                                borderColor: 'primary.main',
                                                pl: 2,
                                                ml: 0,
                                                color: 'text.secondary',
                                            },
                                            '& a': {
                                                color: 'primary.main',
                                            },
                                            '& hr': {
                                                my: 3,
                                                border: 'none',
                                                borderTop: 1,
                                                borderColor: 'divider',
                                            },
                                        }}
                                        dangerouslySetInnerHTML={{ __html: processedContent }}
                                    />
                                )}
                            </TbdHighlighter>
                        )}
                    </Box>
                </Box>
            )}
        </Drawer>
    );
}
