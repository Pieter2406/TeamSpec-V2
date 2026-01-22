/**
 * DashboardLayout Component
 *
 * Shared full-viewport layout wrapper for all role dashboards.
 * Provides consistent structure with:
 * - Full viewport height (no scroll background visible)
 * - Full viewport width with responsive padding
 * - Responsive grid layout for sidebar + main content
 * - Theme-aware colors
 *
 * Story: s-e011-001 (Full-viewport responsive layout)
 * Feature-Increment: fi-TSV-010
 */

import { Box, Breadcrumbs, Link, Typography, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
    /** Page title displayed in header */
    title: string;
    /** Subtitle displayed below title */
    subtitle?: string;
    /** Breadcrumb label for current page */
    breadcrumb: string;
    /** Left sidebar content (card list, filters) */
    sidebar: ReactNode;
    /** Main content area (tree view, etc.) */
    main: ReactNode;
    /** Optional additional content (drawers, modals) */
    children?: ReactNode;
}

export function DashboardLayout({
    title,
    subtitle,
    breadcrumb,
    sidebar,
    main,
    children,
}: DashboardLayoutProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0, // Allow flex shrink
                width: '100%',
                bgcolor: 'background.default',
                overflow: 'hidden', // Prevent horizontal scroll at root
            }}
        >
            {/* Header Section - fixed height */}
            <Box
                sx={{
                    px: { xs: 2, sm: 3, md: 4 },
                    pt: { xs: 2, sm: 3 },
                    pb: { xs: 1, sm: 2 },
                    flexShrink: 0,
                }}
            >
                {/* Breadcrumbs */}
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link
                        color="inherit"
                        href="#"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                        <HomeIcon sx={{ fontSize: 18 }} />
                        Home
                    </Link>
                    <Typography color="text.primary" fontWeight={600}>
                        {breadcrumb}
                    </Typography>
                </Breadcrumbs>

                {/* Page Header */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: 'text.primary',
                            mb: 0.5,
                        }}
                    >
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Main Content Grid - fills remaining height */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr', // Mobile: stacked
                        md: '340px 1fr', // Tablet+: sidebar + main
                        lg: '380px 1fr', // Desktop: wider sidebar
                    },
                    gap: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 3, md: 4 },
                    pb: { xs: 2, sm: 3 },
                    flex: 1,
                    minHeight: 0, // Critical for flex children to scroll
                    overflow: 'hidden',
                }}
            >
                {/* Sidebar Column */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        overflow: 'auto',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        border: 1,
                        borderColor: isDark ? 'divider' : 'grey.200',
                        p: 2,
                    }}
                >
                    {sidebar}
                </Box>

                {/* Main Content Column */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        overflow: 'auto',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        border: 1,
                        borderColor: isDark ? 'divider' : 'grey.200',
                        p: 2,
                    }}
                >
                    {main}
                </Box>
            </Box>

            {/* Additional content (drawers, modals, etc.) */}
            {children}
        </Box>
    );
}
