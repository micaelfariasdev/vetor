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
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';

import { default as api } from '../auth/auth';



export function ConvertMes(mes) {
  const meses = {
    '01': 'Janeiro',
    1: 'Janeiro',
    '02': 'Fevereiro',
    2: 'Fevereiro',
    '03': 'Março',
    3: 'Março',
    '04': 'Abril',
    4: 'Abril',
    '05': 'Maio',
    5: 'Maio',
    '06': 'Junho',
    6: 'Junho',
    '07': 'Julho',
    7: 'Julho',
    '08': 'Agosto',
    8: 'Agosto',
    '09': 'Setembro',
    9: 'Setembro',
    10: 'Outubro',
    10: 'Outubro',
    11: 'Novembro',
    11: 'Novembro',
    12: 'Dezembro',
    12: 'Dezembro',
  };

  return meses[mes] || '';
}

export function Funcionarios() {
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(null);
  const [del, setDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchObraQuery, setSearchObraQuery] = useState('');

  function Delete({ IdItem, itemName }) {
    const deleteAPi = async (IdItem) => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const response = await api.delete(
          `https://vetor-api.micaelfarias.com/api/colaboradores/${IdItem}/`
        );
        setDelete(false);
        setLoading(false);
        setData(prev => prev.filter(f => f.id !== IdItem));
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    return (
      <>
        <Dialog open={del} onClose={() => setDelete(false)}>

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
    const [nome, setNome] = useState('');
    const [cargo, setCargo] = useState('');
    const [situacao, setSituacao] = useState('');
    const [obra, setObra] = useState('');
    const [arrayobra, setArrayObra] = useState([]);
    const [dadosFun, setDadosFun] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      api
        .get('https://vetor-api.micaelfarias.com/api/obras/')
        .then((response) => {
          setArrayObra(response.data);
        });
    }, []);

    const editAPi = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await api.patch(
          `https://vetor-api.micaelfarias.com/api/colaboradores/${IdItem}/`,
          {
            nome,
            cargo,
            situacao,
            obra,
          }
        );
        setData(prev => prev.map(f => f.id === IdItem ? response.data : f));
      } catch (error) {
        console.error(error);
        setError('Não foi possível criar. Verifique os dados.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      api
        .get(`https://vetor-api.micaelfarias.com/api/colaboradores/${IdItem}/`)
        .then((response) => {
          setNome(response.data.nome);
          setCargo(response.data.cargo);
          setSituacao(response.data.situacao);
          setObra(response.data.obra);
        });
    }, []);

    const handleClose = () => {
      setEdit(false);
    };

    return (
      <Dialog open={edit} onClose={handleClose} keepMounted>

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
                  id="nome"
                  label="Nome"
                  variant="outlined"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth>
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
              <FormControl fullWidth>
                <InputLabel id="obra-label">Situação</InputLabel>
                <Select
                  labelId="obra-label"
                  id="obra-select"
                  label="Situação"
                  value={situacao}
                  onChange={(e) => setSituacao(e.target.value)}
                >
                  <MenuItem value="ASSINADO">Carteira</MenuItem>
                  <MenuItem value="FREE">Freelancer</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth className="col-span-2">
                <TextField
                  id="cargo"
                  label="Cargo"
                  variant="outlined"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
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
    const [nome, setNome] = useState('');
    const [cargo, setCargo] = useState('');
    const [situacao, setSituacao] = useState('');
    const [obra, setObra] = useState('');
    const [arrayobra, setArrayObra] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      api
        .get('https://vetor-api.micaelfarias.com/api/obras/')
        .then((response) => {
          setArrayObra(response.data);
        })
    }, []);

    const NewFuncionario = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await api.post(
          'https://vetor-api.micaelfarias.com/api/colaboradores/',
          {
            nome,
            cargo,
            situacao,
            obra,
          }
        );
        setData(prev => [...prev, response.data]);

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
              <FormControl fullWidth className="col-span-2">
                <TextField
                  id="nome"
                  label="Nome"
                  variant="outlined"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth>
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
              <FormControl fullWidth>
                <InputLabel id="obra-label">Situação</InputLabel>
                <Select
                  labelId="obra-label"
                  id="obra-select"
                  label="Situação"
                  value={situacao}
                  onChange={(e) => setSituacao(e.target.value)}
                >
                  <MenuItem value="ASSINADO">Carteira</MenuItem>
                  <MenuItem value="FREE">Freelancer</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth className="col-span-2">
                <TextField
                  id="cargo"
                  label="Cargo"
                  variant="outlined"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
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
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('https://vetor-api.micaelfarias.com/api/colaboradores/');
        if (isMounted) setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();

    return () => { isMounted = false; };
  }, []);


  const columns = [
    { field: 'nome', headerName: 'Funcionario', minWidth: 200, flex: 1 },
    { field: 'cargo', headerName: 'Função', minWidth: 200, flex: 0 },
    { field: 'obra_name', headerName: 'Obra', minWidth: 200, flex: 0 },
    { field: 'situacao', headerName: 'Situação', minWidth: 150, flex: 0 },
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
              setDelete({ id: params.row.id, nome: params.row.nome })
            }
          >
            <MdDelete />
          </IconButton>
        </div>
      ),
    },
  ];

  const filteredFuncionarios = useMemo(() => {
    if (!searchQuery && !searchObraQuery) {
      return data;
    }
    return data.filter((func) => {
      const nomeMatch = func.nome
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const obraMatch = (func.obra_name || '').toLowerCase()
        .includes(searchObraQuery.toLowerCase());
      return nomeMatch && obraMatch;
    });
  }, [data, searchQuery, searchObraQuery]);

  const uniqueObras = useMemo(() => {
    const obras = data.map((func) => func.obra_name);
    return [...new Set(obras)].sort();
  }, [data]);
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
          <h1 className="font-bold text-3xl">Funcionarios</h1>
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
          <select
            value={searchObraQuery}
            onChange={(e) => setSearchObraQuery(e.target.value)}
            className="w-1/2 p-2 border rounded-md"
          >
            <option value="">Pesquisar por obra...</option>
            {uniqueObras.map((obra, index) => (
              <option key={index} value={obra}>
                {obra}
              </option>
            ))}
          </select>
        </div>
        <Paper>
          <DataGrid
            rows={filteredFuncionarios}
            columns={columns}
            initialState={{
              sorting: {
                sortModel: [{ field: 'nome', sort: 'asc' }],
              },
            }}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    </>
  );
}

export default Funcionarios;
