import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material'
import { Assignment, People, BarChart, Settings } from '@mui/icons-material'
import api from './auth/auth'
import { useState, useEffect } from 'react';


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);

  useEffect(() => {
    setLoading(true)
    async function fetchInfos() {
      try {
        const userResp = await api.get("infos/")
          .then(res => setData(res.data));
        setLoading(false)
        console.log(data)
      } catch {
        setLoading(false)
        setUser(null);
      }
    }
    fetchInfos();
  }, []);

  const user = localStorage.getItem('auth')
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
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
            {data &&
              Object.values(data).map((item, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Assignment fontSize="large" color="primary" />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {item.count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            }



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
    </>
  )
}
