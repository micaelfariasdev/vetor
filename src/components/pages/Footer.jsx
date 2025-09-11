import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';

// Função para deixar a primeira letra de cada nome em maiúscula
function capitalizeName(name) {
    if (!name) return '';
    return name.charAt(0).toLocaleUpperCase() + name.slice(1).toLocaleLowerCase();
}

// Dados do seu perfil
const dadosDoUsuario = {
    first_name: 'micael',
    last_name: 'farias',
    github: 'https://github.com/micaelfariasdev',
    linkedin: 'https://www.linkedin.com/in/micaelfariasdev/',
    website: 'https://micaelfarias.com/',
};

const Footer = () => {
    return (
        <div className='col-span-2'>

            <Box
                component="footer"
                sx={{
                    py: 2,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="body1">
                                &copy; {new Date().getFullYear()} {capitalizeName(dadosDoUsuario.first_name)} {capitalizeName(dadosDoUsuario.last_name)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                            <Link
                                href={dadosDoUsuario.linkedin}
                                color="inherit"
                                sx={{ mx: 1 }}
                                target="_blank"
                                rel="noopener"
                            >
                                <LinkedInIcon />
                            </Link>
                            <Link
                                href={dadosDoUsuario.github}
                                color="inherit"
                                sx={{ mx: 1 }}
                                target="_blank"
                                rel="noopener"
                            >
                                <GitHubIcon />
                            </Link>
                            <Link
                                href={dadosDoUsuario.website}
                                color="inherit"
                                sx={{ mx: 1 }}
                                target="_blank"
                                rel="noopener"
                            >
                                <LanguageIcon />
                            </Link>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </div>
    );
};

export default Footer;