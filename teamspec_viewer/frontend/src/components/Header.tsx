import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { RoleBadge } from './RoleBadge';

export function Header() {
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TeamSpec Viewer
                </Typography>
                <Box>
                    <RoleBadge />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
