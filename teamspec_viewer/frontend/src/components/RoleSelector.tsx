import { Button, Box, Typography, Paper } from '@mui/material';
import { useRole, Role } from '../contexts/RoleContext';

const AVAILABLE_ROLES: { id: Role; label: string; description: string }[] = [
    {
        id: 'BA',
        label: 'Business Analyst',
        description: 'Access BA documents and BA increments',
    },
    {
        id: 'FA',
        label: 'Functional Analyst',
        description: 'Access features, feature-increments, epics, and stories',
    },
];

export function RoleSelector() {
    const { setRole } = useRole();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 4,
                p: 4,
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Select Your Role
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Choose a role to see relevant artifacts for your work
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                {AVAILABLE_ROLES.map((role) => (
                    <Paper
                        key={role.id}
                        elevation={2}
                        sx={{
                            p: 3,
                            width: 280,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                                elevation: 8,
                                transform: 'translateY(-4px)',
                                boxShadow: 4,
                            },
                        }}
                        onClick={() => setRole(role.id)}
                    >
                        <Typography variant="h5" gutterBottom>
                            {role.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {role.description}
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={(e) => {
                                e.stopPropagation();
                                setRole(role.id);
                            }}
                        >
                            Select {role.id}
                        </Button>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}
