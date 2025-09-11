import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import api from '../auth/auth'

export default function Config() {
    const userString = localStorage.getItem('auth');
    const [user, setUser] = useState(userString ? JSON.parse(userString) : {});

    const [formData, setFormData] = useState({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    async function handleSave(e) {
        e.preventDefault();
        try {

            const response = await api.patch('me/', formData, {
            });
            console.log("Perfil atualizado com sucesso!", response.data);
            setUser(response.data);
            localStorage.setItem(
                "auth",
                response.data ? JSON.stringify(response.data) : null
            );
            alert("Perfil atualizado com sucesso!");
            window.location.reload();
        } catch (error) {
            console.error("Erro ao atualizar o perfil:", error.response ? error.response.data : error.message);
            alert("Erro ao atualizar o perfil. Tente novamente.");
        }
    }

    return (
        <Box
            sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Card sx={{ maxWidth: 1000, width: '100%' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Configurações de Perfil
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Atualize seus dados pessoais e seu endereço de e-mail.
                    </Typography>
                    <form onSubmit={handleSave}>
                        <Grid container spacing={3} columns={2} sx={{
                            justifyContent: "flex-end",
                        }} >
                            <Grid item size={2}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item size={1}>
                                <TextField
                                    fullWidth
                                    label="Nome"
                                    name="first_name" // Corrigido para first_name
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item size={1}>
                                <TextField
                                    fullWidth
                                    label="Sobrenome"
                                    name="last_name" // Corrigido para last_name
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item size={2}>
                                <TextField
                                    fullWidth
                                    label="Endereço de E-mail"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item size={1}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        mt: 2,
                                    }}
                                >
                                    <Button type="submit" variant="contained">
                                        Salvar Alterações
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};