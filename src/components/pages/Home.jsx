import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material'
import { Assignment, People, BarChart, Settings } from '@mui/icons-material'

export default function Home() {

  const user = localStorage.getItem('auth')
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Boas-vindas */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Olá, {user
            ? (user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`.toUpperCase()
              : (user?.username || 'Usuário').toUpperCase())
            : 'Usuário'} 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6 }}>
          Aqui está um resumo do seu painel hoje:
        </Typography>

        {/* Cards de resumo */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assignment fontSize="large" color="primary" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Projetos
                </Typography>
                <Typography variant="h4" fontWeight="bold">12</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <People fontSize="large" color="primary" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Equipes
                </Typography>
                <Typography variant="h4" fontWeight="bold">5</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <BarChart fontSize="large" color="primary" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Relatórios
                </Typography>
                <Typography variant="h4" fontWeight="bold">8</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Settings fontSize="large" color="primary" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Configurações
                </Typography>
                <Typography variant="h4" fontWeight="bold">3</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Atalhos rápidos */}
        <Box sx={{ mt: 30, textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            Acesse rapidamente:
          </Typography>
          <Button variant="contained" sx={{ m: 1 }} onClick={() => { window.location.href = '/obras' }}>
            Obras
          </Button>
          <Button variant="contained" sx={{ m: 1 }} onClick={() => { window.location.href = '/funcionarios' }}>
            Funcionários
          </Button>
          <Button variant="outlined" sx={{ m: 1 }} onClick={() => { window.location.href = '/perfil' }}>
            Configurações
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
