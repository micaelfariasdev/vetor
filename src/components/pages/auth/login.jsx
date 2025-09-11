import { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { login as loginApi } from './auth';
import { default as api } from './auth';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(async () => {
        try {
            const userResp = await api.get("me/")
                .then(res => {
                    localStorage.setItem(
                        "auth",
                        res.data ? JSON.stringify(res.data) : null
                    );
                    setUser(res.data);
                    window.location.href = '/home';
                    return res; // mantém compatibilidade com o await
                });
        } catch {
            setUser(false);
        }
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginApi(username, password);
            window.location.href = '/home'
        } catch {
            setLoading(false);
            setError('Login falhou');
        }
    };


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Paper className="p-8 w-[400px] flex flex-col gap-4">
                <Typography variant="h5" className="text-center font-bold">
                    Entrar
                </Typography>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        className="py-2"
                    >
                        {loading ? <CircularProgress size={24} /> : 'Entrar'}
                    </Button>
                </form>
                {error && <Typography color="error">{error}</Typography>}
            </Paper>
        </div>
    );
}
