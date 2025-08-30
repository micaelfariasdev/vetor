import { useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@mui/material';

export function PontoMesMockup() {
  const [data, setData] = useState([
    { id: 1, nome: 'João' },
    { id: 2, nome: 'Maria' },
  ]);

  const [openPontos, setOpenPontos] = useState(false);
  const [openHoras, setOpenHoras] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);

  const handlePontos = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setOpenPontos(true);
  };

  const handleHoras = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setOpenHoras(true);
  };

  const columns = [
    { field: 'nome', headerName: 'Funcionário', flex: 1 },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handlePontos(params.row)}
          >
            Pontos
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleHoras(params.row)}
          >
            Horas do mês
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={data} columns={columns} pageSize={5} />
      </div>

      <Dialog open={openPontos} onClose={() => setOpenPontos(false)} fullWidth>
        <DialogTitle>Pontos - {selectedFuncionario?.nome}</DialogTitle>
        <DialogContent>
          <Typography>
            Aqui você mostraria o grid diário/mensal de pontos desse
            funcionário.
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog open={openHoras} onClose={() => setOpenHoras(false)} fullWidth>
        <DialogTitle>Horas do mês - {selectedFuncionario?.nome}</DialogTitle>
        <DialogContent>
          <Typography>
            Aqui você mostra o total de horas trabalhadas do mês.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
