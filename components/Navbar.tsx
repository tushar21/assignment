"use client";
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// interface Props {
//     window?: () => Window;
// }

const drawerWidth = 240;

const navItems = [
    // { label: 'Home', path: '/' },
    { label: 'Numbers', path: '/numbers' },
    { label: 'Grades', path: '/grades' },
];

const Navbar = () => {
    // const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        setMobileOpen(false);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography
                variant="h6"
                sx={{ my: 2, cursor: 'pointer' }}
                onClick={() => handleNavigation('/')}
            >
                Alison Full Stack Developer Assessment
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            sx={{
                                textAlign: 'center',
                                textDecoration: pathname === item.path ? 'underline' : 'none',
                            }}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    // const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>
            <AppBar component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        onClick={() => handleNavigation('/')}
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', sm: 'block' },
                            cursor: 'pointer',
                        }}
                    >
                        Alison
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                sx={{
                                    color: '#fff',
                                    borderBottom: pathname === item.path ? '2px solid #fff' : 'none',
                                }}
                                onClick={() => handleNavigation(item.path)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    // container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </>
    );
};

export default Navbar;
