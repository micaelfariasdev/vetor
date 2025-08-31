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
import { TextField } from '@mui/material';
import { useMemo } from 'react';

export function Obras() {
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [del, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchObraQuery, setSearchObraQuery] = useState('');

  function Delete({ IdItem, itemName }) {
    const deleteAPi = async (IdItem) => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const response = await axios.delete(
          `https://vetor-api.micaelfarias.com/api/obras/${IdItem}/`
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
              Tem certeza que deseja excluir o funcionario{' '}
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
    const [nome, setNome] = useState('');
    const [end, setEnd] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [type, setType] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const NewObra = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const resp = await axios.post(
          'https://vetor-api.micaelfarias.com/api/obras/',
          {
            author: 1,
            nome,
            endereço: end,
            cnpj,
            type,
          }
        );
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

    const formatCNPJ = (value) => {
      if (!value) return '';
      value = value.replace(/\D/g, ''); // Remove tudo o que não é dígito
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      return value.substring(0, 18);
    };

    const handleChange = (event) => {
      const rawValue = event.target.value;
      const formattedValue = formatCNPJ(rawValue);

      setCnpj(formattedValue);
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
            <form onSubmit={NewObra} className="grid grid-cols-2 gap-5 gap-x-4">
              <FormControl fullWidth className="col-span-2">
                <TextField
                  id="nome"
                  label="Nome"
                  variant="outlined"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth className="col-span-2">
                <TextField
                  id="endereco"
                  label="Endereço"
                  variant="outlined"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth className="col-span-2">
                <TextField
                  label="CNPJ"
                  variant="outlined"
                  value={cnpj}
                  fullWidth
                  margin="normal"
                  className="rounded-lg"
                  error={error}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
              <FormControl fullWidth className="col-span-2">
                <InputLabel id="type">Tipo de Obra</InputLabel>
                <Select
                  labelId="type"
                  id="type-id"
                  label="Tipo de Obra"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="PREDIO">Prédio'</MenuItem>
                  <MenuItem value="CONDOMINIO">'Condomínio de Casas'</MenuItem>
                  <MenuItem value="LOTEAMENTO">'Loteamento'</MenuItem>
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
    axios
      .get('https://vetor-api.micaelfarias.com/api/obras/')
      .then((response) => {
        setData(response.data);
      });
  }, []);

  const columns = [
    { field: 'nome', headerName: 'Obra', minWidth: 250, flex: 1 },
    {
      field: 'cnpj',
      headerName: 'CNPJ',
      sortable: false,
      filterable: false,
      minWidth: 250,
      flex: 1,
    },
    {
      field: 'endereço',
      headerName: 'Endereço',
      sortable: false,
      filterable: false,
      minWidth: 200,
      flex: 3,
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
              setDelete({ id: params.row.id, nome: params.row.nome })
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
      {edit && <Edit IdItem={edit.id} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">Obras</h1>
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
            initialState={{
              sorting: {
                sortModel: [{ field: 'nome', sort: 'asc' }],
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
