import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useMemo } from 'react';
import api from '../auth/auth';
import { formatarDinheiro, topNotice } from '../../utils';

export function Medicao() {
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);
  const [del, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchObraQuery, setSearchObraQuery] = useState('');

  function Delete({ IdItem, itemName }) {
    const deleteAPi = async (IdItem) => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const response = await api.delete(`medicao/${IdItem}/`);
        setDelete(false);
        setLoading(false);
        topNotice({ success: 'Medição excluída com sucesso!' });
      } catch (error) {
        topNotice({ error: `Erro ao excluir a medição. Tente novamente. ${error}` });
        setLoading(false);
      }
    };

    return (
      <>
        <Dialog open={del} onClose={() => setDelete(false)}>
     
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir a medição{' '}
              <strong>{itemName}</strong>? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDelete(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                deleteAPi(IdItem);
              }}
              color="error"
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function CreateNew({ create, setCreate }) {
    const [obra, setObra] = useState('');
    const [pagamento, setPagamento] = useState(null);
    const [arrayObra, setArrayObra] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      api.get('obras/').then((response) => {
        setArrayObra(response.data);
      });
    }, []);

    const NewMedico = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await api.post('medicao/', {
          obra,
          data_pagamento: pagamento ? pagamento.format('YYYY-MM-DD') : null,
        });
        topNotice({ success: `Medição criada com sucesso!` });
        setCreate(false);
      } catch (error) {
        topNotice({
          error: `Não foi possível criar. Verifique os dados!. ${error}`,
        });
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setCreate(false);
    };

    return (
      <Dialog open={create} onClose={handleClose} keepMounted>
   
          <div className="p-5 gap-4 flex flex-col w-100">
            <div className="w-full flex flex-row justify-between text-3xl">
              <h1 className="block text-lg font-semibold text-gray-700">
                Cadastrar
              </h1>
              <IoIosCloseCircle
                className="text-red-500 hover:text-red-200 cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <form onSubmit={NewMedico} className="flex flex-col gap-5 gap-x-4">
              <FormControl fullWidth>
                <InputLabel id="obra-label">Obra</InputLabel>
                <Select
                  labelId="obra-label"
                  id="obra-select"
                  value={obra}
                  onChange={(e) => setObra(e.target.value)}
                >
                  {arrayObra.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateField
                    label="Data de Pagamento"
                    value={pagamento}
                    onChange={(newValue) => setPagamento(newValue)}
                    format="DD/MM/YYYY"
                  />
                </LocalizationProvider>
              </FormControl>

              <button
                type="submit"
                className="bg-cyan-500 rounded-xl text-white p-2 w-full col-span-2"
              >
                Cadastrar
              </button>
            </form>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
 
      </Dialog>
    );
  }

  useEffect(() => {
    setLoading(true);
    api
      .get('medicao/')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados:', error);
      })
      .finally(() => {
        setLoading(false); // ✅ Esta linha é executada APÓS a requisição ser concluída.
      });
  }, [del, create]);

  const columns = [
    { field: 'str', headerName: 'Medição', minWidth: 250, flex: 1 },
    {
      field: 'valor_total',
      headerName: 'Valor Total',
      minWidth: 250,
      flex: 1,
      valueFormatter: (params) => formatarDinheiro(params),
    },
    {
      field: 'ano',
      headerName: 'Ano',
      width: 100,
      hidden: false, // Oculta a coluna de Mês
      valueGetter: (value, row) => {
        return Number(new Date(row.data_medicao).getUTCFullYear());
      },
    },
    {
      field: 'mes',
      headerName: 'Mês',
      width: 100,
      hidden: true, // Oculta a coluna de Mês
      valueGetter: (value, row) => {
        return Number(new Date(row.data_medicao).getUTCMonth() + 1);
      },
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="h-full w-full text-md flex items-center justify-center gap-2">
          <IconButton
            aria-label="editar"
            size="small"
            sx={{
              backgroundColor: 'info.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'info.dark',
              },
              padding: 1,
            }}
            onClick={() =>
              (window.location.href = `${window.location.href}/${params.row.id}`)
            }
          >
            <FaEdit />
          </IconButton>
          <IconButton
            sx={{
              padding: 1,
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.main',
                opacity: 0.8,
              },
            }}
            aria-label="deletar"
            size="small"
            onClick={() =>
              setDelete({ id: params.row.id, nome: params.row.str })
            }
          >
            <MdDelete />
          </IconButton>
        </div>
      ),
    },
  ];

  const filterObra = useMemo(() => {
    if (!searchQuery && !searchObraQuery) {
      return data;
    }
    return data.filter((func) => {
      const nomeMatch = func.nome
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return nomeMatch;
    });
  }, [data, searchQuery]);

  return (
    <>
   
      {create && <CreateNew create={create} setCreate={setCreate} />}
      {del && <Delete IdItem={del.id} itemName={del.nome} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">Medição</h1>
          <IconButton
            sx={{
              padding: 1,
              backgroundColor: 'info.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'info.dark',
              },
            }}
            aria-label="deletar"
            size="small"
            onClick={() => setCreate(true)}
          >
            <FaCirclePlus />
          </IconButton>
        </div>
        <hr className="col-span-2" />
        <div className="col-span-2 flex gap-2 ">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-[50%]"
          />
        </div>
        <Paper>
          <DataGrid
            rows={filterObra}
            columns={columns}
            columnVisibilityModel={{
              ano: false,
              mes: false,
            }}
            initialState={{
              sorting: {
                sortModel: [
                  { field: 'ano', sort: 'desc' },
                  { field: 'mes', sort: 'desc' },
                  { field: 'nome', sort: 'asc' },
                ],
              },
            }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    </>
  );
}
