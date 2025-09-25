import { Button, Dialog } from "@mui/material"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import api from "../../auth/auth";
import { useEffect, useState } from "react";
import { topNotice } from "../../../utils";

export function ServicoEdit({ serv, unidades, open, onClose, servico }) {
    const [editServ, setEditServ] = useState([]);
    const [editPost, setEditPost] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.post('servico-unidade/get-servicos-detail/',
                    {
                        serv: serv
                    }
                );

                setEditServ(response.data);
            } catch (err) {
                console.error('Erro ao carregar serviço:', err);
            }
        }

        if (serv) {
            fetchData();
        }
    }, [serv]);

    const salvar = async () => {
        const payload = {
            servico: serv,
            unidades: editPost
        };

        try {
            onClose()
            await api.post('servico-unidade/salvar-servicos-detail/', payload);
            topNotice({ success: 'Serviço salvo com sucesso!' });
        } catch (err) {
            topNotice({ error: `Erro ao salvar serviço. ${err}` });
            console.error('Erro ao salvar serviço:', err);
        }
    };


    const maxUni = unidades.reduce((max, andar) =>
        Math.max(max, andar.unidades.length), 0
    )
    console.log(
    )
    return (
        <Dialog open={open} onClose={onClose} keepMounted maxWidth="lg" fullWidth>
            <Box sx={{ p: 5 }}>
            <Box className='flex items-center justify-between'>

                
                <Typography variant="h5" component="h2" gutterBottom>
                    {servico.filter((e) => e.id === serv)[0].titulo}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={salvar}
                    >
                    Salvar
                </Button>
                    </Box>
                <TableContainer component={Paper}>
                    <Table aria-label="tabela de unidades por andar">
                        <TableBody>
                            {unidades.map((andar) => (
                                <TableRow
                                    key={andar.id}
                                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                                >
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        {andar.nome}
                                    </TableCell>

                                    {Array.from({ length: maxUni }).map((_, i) =>
                                        andar.unidades[i]?.nome_ou_numero && (
                                            <TableCell key={i} >
                                                <p className="font-bold">{String(andar.unidades[i].nome_ou_numero).padStart(2, '0')}</p>
                                                <input
                                                    type="text"
                                                    className="w-12"
                                                    value={editPost[andar.unidades[i].id] ?? editServ.find(e => e.unidade === andar.unidades[i].id)?.progresso ?? ''}
                                                    onChange={(e) =>
                                                        setEditPost(prev => ({
                                                            ...prev,
                                                            [andar.unidades[i].id]: e.target.value
                                                        }))
                                                    }
                                                />

                                            </TableCell>
                                        )
                                    )}

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Dialog>
    )
}
