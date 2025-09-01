import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
import TextField from '@mui/material/TextField';

export function ConvertMes(mes) {
  const meses = {
    '01': 'Janeiro',
    '02': 'Fevereiro',
    '03': 'Março',
    '04': 'Abril',
    '05': 'Maio',
    '06': 'Junho',
    '07': 'Julho',
    '08': 'Agosto',
    '09': 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro',
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro',
  };

  return meses[mes] || '';
}

export function Ponto() {
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);
  const [del, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  function Delete({ IdItem, itemName }) {
    const deleteAPi = async (IdItem) => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const response = await axios.delete(
          `https://vetor-api.micaelfarias.com/api/mes-ponto/${IdItem}/`
        );
        setDelete(false);
        setLoading(false);
        window.location.reload();
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    return (
      <>
        <Dialog open={del} onClose={() => setDelete(false)}>
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir <strong>{itemName}</strong>? Esta
              ação não pode ser desfeita.
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
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [obra, setObra] = useState('');
    const [arrayobra, setArrayObra] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      axios
        .get('https://vetor-api.micaelfarias.com/api/obras/')
        .then((response) => {
          setArrayObra(response.data);
        });
    }, []);

    const NewFuncionario = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await axios.post('https://vetor-api.micaelfarias.com/api/mes-ponto/', {
          author: 1,
          mes,
          ano,
          obra,
        });
        window.location.reload();
      } catch (error) {
        console.error(error);
        setError('Não foi possível criar. Verifique os dados.');
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setCreate(false);
    };

    return (
      <Dialog open={create} onClose={handleClose} keepMounted>
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && (
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
            <form
              onSubmit={NewFuncionario}
              className="grid grid-cols-2 gap-5 gap-x-4"
            >
              <FormControl fullWidth>
                <InputLabel id="mes-label">Mês</InputLabel>
                <Select
                  id="mes-select"
                  label="Mês"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((i) => (
                    <MenuItem key={i} value={i}>
                      {ConvertMes(i)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  id="ano"
                  label="Ano"
                  variant="outlined"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                />
              </FormControl>

              <FormControl fullWidth className="col-span-2">
                <InputLabel id="obra-label">Obra</InputLabel>
                <Select
                  labelId="obra-label"
                  id="obra-select"
                  label="Obra"
                  value={obra}
                  onChange={(e) => setObra(e.target.value)}
                >
                  {arrayobra.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <button
                type="submit"
                className="bg-cyan-500 rounded-xl cursor-pointer text-white p-2 w-full col-span-2"
              >
                Cadastrar
              </button>
            </form>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}
      </Dialog>
    );
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get('https://vetor-api.micaelfarias.com/api/mes-ponto/')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados:", error);
      })
      .finally(() => {
        setLoading(false); // ✅ Esta linha é executada APÓS a requisição ser concluída.
      });
  }, []);

  const columns = [
    {
      field: 'nome',
      headerName: 'Ponto',
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.obra_name} - ${ConvertMes(row.mes)} / ${row.ano}`;
      },
    },
    {
      field: 'ano',
      headerName: 'Ano',
      width: 100,
      hide: true, // Oculta a coluna de Ano
    },
    {
      field: 'mes',
      headerName: 'Mês',
      width: 100,
      hide: true, // Oculta a coluna de Mês
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="h-full w-full text-md flex items-center justify-center gap-2">
          <a href={`${window.location.pathname}/${params.row.id}`}>
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
            >
              <FaEdit />
            </IconButton>
          </a>
          <a
            onClick={() =>
              setDelete({
                id: params.row.id,
                nome: `${params.row.obra_name} - ${ConvertMes(
                  params.row.mes
                )} / ${params.row.ano}`,
              })
            }
          >
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
            >
              <MdDelete />
            </IconButton>
          </a>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {create && <CreateNew create={create} setCreate={setCreate} />}

      {del && <Delete IdItem={del.id} itemName={del.nome} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">Ponto</h1>
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
        <div className="col-span-2"></div>
        <Paper>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: { paginationModel },
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

export default ConvertMes;
