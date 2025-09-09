import { useState } from 'react';
import { TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { login as loginApi } from './auth';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginApi(username, password);
            onLogin(true);
        } catch {
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
