import { Chip, Box, IconButton, Tooltip } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useRole } from '../contexts/RoleContext';

const ROLE_COLORS: Record<string, 'primary' | 'secondary'> = {
    BA: 'primary',
    FA: 'secondary',
};

const ROLE_LABELS: Record<string, string> = {
    BA: 'Business Analyst',
    FA: 'Functional Analyst',
};

export function RoleBadge() {
    const { role, clearRole } = useRole();

    if (!role) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
                label={`${role} - ${ROLE_LABELS[role]}`}
                color={ROLE_COLORS[role]}
                variant="filled"
                size="medium"
            />
            <Tooltip title="Switch Role">
                <IconButton size="small" onClick={clearRole} aria-label="switch role">
                    <SwapHorizIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
