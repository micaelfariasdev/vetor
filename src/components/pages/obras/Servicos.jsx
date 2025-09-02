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
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import { TextField } from '@mui/material';
import { useMemo } from 'react';

export function Servicos() {
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [del, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  function Delete({ IdItem, itemName }) {
    const deleteAPi = async (IdItem) => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const response = await axios.delete(
          `https://vetor-api.micaelfarias.com/api/servico/${IdItem}/`
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

  function Edit({ IdItem }) {
    const [titulo, setTitulo] = useState('');
    const [desc, setDesc] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const editAPi = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await axios.patch(
          `https://vetor-api.micaelfarias.com/api/servico/${IdItem}/`,
          {
            titulo: titulo,
            descricao: desc,
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

    useEffect(() => {
      axios
        .get(`https://vetor-api.micaelfarias.com/api/servico/${IdItem}/`)
        .then((response) => {
          setTitulo(response.data.titulo);
          setDesc(response.data.descricao);
        });
    }, []);

    const handleClose = () => {
      setEdit(false);
    };

    return (
      <Dialog open={edit} onClose={handleClose} keepMounted>
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && (
          <div className="p-5 gap-4 flex flex-col w-100">
            <div className="w-full flex flex-row justify-between text-3xl">
              <h1 className="block text-lg font-semibold text-gray-700">
                Editar
              </h1>
              <IoIosCloseCircle
                className="text-red-500 hover:text-red-200 cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <form onSubmit={editAPi} className="grid grid-cols-2 gap-5 gap-x-4">
              <FormControl fullWidth className="col-span-2">
                <TextField
                  id="titulo"
                  label="Título"
                  variant="outlined"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth className="col-span-2">
                <TextField
                  id="desc"
                  label="Descrição"
                  variant="outlined"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </FormControl>
              <button
                type="submit"
                className="bg-cyan-500 rounded-xl cursor-pointer text-white p-2 w-full col-span-2"
              >
                Editar
              </button>
            </form>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}
      </Dialog>
    );
  }

  function CreateNew({ create, setCreate }) {
    const [titulo, setTitulo] = useState('');
    const [desc, setDesc] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const NewObra = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const resp = await axios.post(
          'https://vetor-api.micaelfarias.com/api/servico/',
          {
            titulo: titulo,
            descricao: desc,
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
                  id="titulo"
                  label="Título"
                  variant="outlined"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth className="col-span-2">
                <TextField
                  id="desc"
                  label="Descrição"
                  variant="outlined"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
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
      .get('https://vetor-api.micaelfarias.com/api/servico/')
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
    { field: 'titulo', headerName: 'Serviço', minWidth: 200, flex: 3 },
    {
      field: 'descricao',
      headerName: 'Descrição',
      minWidth: 200,
      flex: 3,
      filterable: false,
      sortable: false,
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 100,
      filterable: false,
      sortable: false,
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
            onClick={() => setEdit({ id: params.row.id })}
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
              setDelete({ id: params.row.id, nome: params.row.titulo })
            }
          >
            <MdDelete />
          </IconButton>
        </div>
      ),
    },
  ];

  const filterObra = useMemo(() => {
    if (!searchQuery) {
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
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {create && <CreateNew create={create} setCreate={setCreate} />}
      {del && <Delete IdItem={del.id} itemName={del.nome} />}
      {edit && <Edit IdItem={edit.id} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">Serviços</h1>
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
