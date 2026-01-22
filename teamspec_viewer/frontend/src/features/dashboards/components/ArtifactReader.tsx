import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Drawer, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import { getArtifactContent, Artifact } from '@/api';
import { TbdHighlighter } from '@/shared/components';
import { useFocusManagement } from '@/shared/hooks';

interface ArtifactReaderProps {
    artifact: Artifact | null;
    onClose: () => void;
}

export function ArtifactReader({ artifact, onClose }: ArtifactReaderProps) {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { saveFocus, restoreFocus } = useFocusManagement();

    // Save focus when drawer opens
    useEffect(() => {
        if (artifact) {
            saveFocus();
        }
    }, [artifact, saveFocus]);

    // Handle close with focus restoration
    const handleClose = () => {
        onClose();
        restoreFocus();
    };

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
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', md: '60%', lg: '50%' },
                    boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
                },
            }}
        >
            {artifact && (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <IconButton
                                onClick={handleClose}
                                aria-label="close"
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                    <DescriptionIcon sx={{ fontSize: 28, opacity: 0.9 }} />
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 700, lineHeight: 1.2 }}
                                    >
                                        {artifact.title}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        opacity: 0.8,
                                        fontFamily: 'monospace',
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    {artifact.path}
                                </Typography>
                                {artifact.status && (
                                    <Chip
                                        label={artifact.status}
                                        size="small"
                                        sx={{
                                            mt: 1.5,
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'background.default' }}>
                        {loading && (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">Loading...</Typography>
                            </Box>
                        )}
                        {error && (
                            <Box sx={{ p: 4 }}>
                                <Typography color="error">{error}</Typography>
                            </Box>
                        )}
                        {!loading && !error && content && (
                            <TbdHighlighter content={content}>
                                {(processedContent: string) => (
                                    <Box
                                        className="markdown-content"
                                        sx={{
                                            p: 4,
                                            '& h1': {
                                                fontSize: '1.75rem',
                                                fontWeight: 800,
                                                mb: 2,
                                                mt: 3,
                                                color: 'text.primary',
                                                borderBottom: 2,
                                                borderColor: 'divider',
                                                pb: 2,
                                            },
                                            '& h2': {
                                                fontSize: '1.35rem',
                                                fontWeight: 700,
                                                mb: 1.5,
                                                mt: 3,
                                                color: 'text.primary',
                                            },
                                            '& h3': {
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                mb: 1,
                                                mt: 2,
                                                color: 'text.secondary',
                                            },
                                            '& p': {
                                                mb: 1.5,
                                                lineHeight: 1.7,
                                                color: 'text.secondary',
                                            },
                                            '& ul, & ol': {
                                                pl: 3,
                                                mb: 1.5,
                                            },
                                            '& li': {
                                                mb: 0.5,
                                                lineHeight: 1.6,
                                                color: 'text.secondary',
                                            },
                                            '& table': {
                                                borderCollapse: 'collapse',
                                                width: '100%',
                                                mb: 2,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                '& th, & td': {
                                                    border: 1,
                                                    borderColor: 'divider',
                                                    p: 1.5,
                                                    textAlign: 'left',
                                                },
                                                '& th': {
                                                    bgcolor: 'action.hover',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                },
                                                '& tr:hover td': {
                                                    bgcolor: 'action.hover',
                                                },
                                            },
                                            '& code': {
                                                bgcolor: 'action.selected',
                                                px: 1,
                                                py: 0.25,
                                                borderRadius: 1,
                                                fontFamily: '"Fira Code", monospace',
                                                fontSize: '0.875rem',
                                                color: 'secondary.main',
                                            },
                                            '& pre': {
                                                bgcolor: 'grey.900',
                                                p: 2.5,
                                                borderRadius: 2,
                                                overflow: 'auto',
                                                '& code': {
                                                    bgcolor: 'transparent',
                                                    color: 'grey.200',
                                                    p: 0,
                                                },
                                            },
                                            '& blockquote': {
                                                borderLeft: 4,
                                                borderColor: 'primary.main',
                                                bgcolor: 'action.hover',
                                                pl: 2,
                                                py: 1,
                                                ml: 0,
                                                borderRadius: '0 8px 8px 0',
                                                color: 'text.secondary',
                                                fontStyle: 'italic',
                                            },
                                            '& a': {
                                                color: 'primary.main',
                                                textDecoration: 'none',
                                                fontWeight: 500,
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                },
                                            },
                                            '& hr': {
                                                my: 4,
                                                border: 'none',
                                                height: 2,
                                                bgcolor: 'divider',
                                            },
                                            '& strong': {
                                                fontWeight: 600,
                                                color: 'text.primary',
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
