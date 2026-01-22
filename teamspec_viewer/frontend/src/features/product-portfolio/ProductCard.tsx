import { Card, CardContent, CardActionArea, Typography, Chip, Box } from '@mui/material';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import { Product } from '@/api';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    active: { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' },
    deprecated: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' },
    archived: { bg: '#94a3b8', color: 'white' },
};

export function ProductCard({ product, onClick }: ProductCardProps) {
    const statusStyle = STATUS_COLORS[product.status] || STATUS_COLORS.active;

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: 1, borderColor: 'divider',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
                    borderColor: '#667eea',
                },
            }}
        >
            <CardActionArea onClick={() => onClick(product)}>
                <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <FolderSpecialIcon sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Chip
                                label={product.prefix}
                                size="small"
                                sx={{
                                    mb: 1,
                                    bgcolor: 'action.selected',
                                    color: 'text.secondary',
                                    fontWeight: 700,
                                    fontFamily: 'monospace',
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    lineHeight: 1.2,
                                }}
                            >
                                {product.name}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            mb: 2,
                            minHeight: 40,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {product.description || 'No description available'}
                    </Typography>

                    {/* Footer */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Chip
                            label={product.status.toUpperCase()}
                            size="small"
                            sx={{
                                background: statusStyle.bg,
                                color: statusStyle.color,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                            }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {product.projectCount} project{product.projectCount !== 1 ? 's' : ''}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
