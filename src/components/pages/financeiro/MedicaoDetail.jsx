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
import { useParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';

import { useMemo } from 'react';
import api from '../auth/auth';
import { formatarDinheiro } from '../../utils';
import { Collapse, TextField } from '@mui/material';



export function MedicaoDetail() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [create, setCreate] = useState(false);
  const [del, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  var [att, setAtt] = useState(false);

  const [error, setError] = useState('')


  const [searchQuery, setSearchQuery] = useState('');
  const [searchObraQuery, setSearchObraQuery] = useState('');

  function Delete({ IdItem, itemName }) {
    const deleteAPi = async (IdItem) => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const response = await api.delete(
          `medicao-colaborador/${IdItem}/`
        );
        setDelete(false);
        setLoading(false);
        setAtt(true)
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
              Tem certeza que deseja excluir o Colaborador{' '}
              <strong>{itemName}</strong> dessa medição? Esta ação não pode ser desfeita.
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
    const [colaborador, setColaborador] = useState('')
    const [arrayColaborador, setArrayColaborador] = useState([])


    useEffect(() => {
      api.get('colaboradores/').then((response) => {
        setArrayColaborador(response.data)
      })
    }, [])

    const NewColaborador = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        await api.post('medicao-colaborador/', {
          colaborador,
          medicao: id,
        });
        setCreate(false);
        setAtt(true)
      } catch (err) {
        if (err.response && err.response.data) {
          const data = err.response.data;

          // Pega a primeira mensagem de erro disponível
          const firstKey = Object.keys(data)[0];
          const firstMessage = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
          console.error(firstMessage);
          setError(firstMessage);
        } else {
          setError("Não foi possível criar. Verifique os dados.");
        }
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setCreate(false)
    }
    console.log(arrayColaborador)
    const options = arrayColaborador.filter(i => i.obra === data.obra).map(({ id, nome }) => ({ 'id': id, 'label': nome }))
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

          <form onSubmit={NewColaborador} className="flex flex-col gap-5 gap-x-4">
            <Autocomplete
              options={options}
              onChange={(e, value) => setColaborador(value.id)}
              renderInput={(params) => <TextField {...params} label="Colaborador" />}
            />

            <button
              type="submit"
              className="bg-cyan-500 rounded-xl text-white p-2 w-full col-span-2"
            >
              Cadastrar
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        </div>
      </Dialog>

    )
  }

  function EditMedicaoColaborador({ IdColaborador }) {
    const [dataCol, setDataCol] = useState([]);
    const [deleteServ, setDeleteServ] = useState(false);
    const [servicos, setServicos] = useState('')
    const [descricao, setDescricao] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [valor, setValor] = useState('')
    const [create, setCreate] = useState(false)
    const [createServ, setCreateServ] = useState(false)
    const [arrayServicos, setArrayServicos] = useState([])

    function CreateNewServ() {
      const [titulo, setTitulo] = useState('');
      const [desc, setDesc] = useState('');

      const [error, setError] = useState('');

      const NewServico = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
          const resp = await api.post(
            'servico/',
            {
              titulo: titulo,
              descricao: desc,
            }
          );
          await api.patch(
            `obras/${data.obra}/`,
            {
              titulo: titulo,
              descricao: desc,
            }
          );
          handleClose()
        } catch (error) {
          console.error(error);
          setError('Não foi possível criar. Verifique os dados.');
        } finally {
          setLoading(false);
        }
      };

      const handleClose = () => {
        setCreateServ(false);
      };

      return (
        <Dialog open={createServ} onClose={handleClose} keepMounted>
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
            <form onSubmit={NewServico} className="grid grid-cols-2 gap-5 gap-x-4">
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
        </Dialog>
      );
    }

    useEffect(() => {
      api.get('servico/').then((response) => {
        setArrayServicos(response.data)
        console.log(response.data)
      })
    }, [])

    const options = arrayServicos.filter(i => (i.obras).includes(data.obra)).map(({ id, titulo }) => ({ 'id': id, 'label': titulo }))

    function DeleteServ({ IdItem, itemName }) {
      const deleteAPi = async (IdItem) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          const response = await api.delete(
            `item-medicao/${IdItem}/`
          );
          setDeleteServ(false);
          setAtt(true);

        } catch (error) {
          console.error(error);
        }
      };

      return (
        <>
          <Dialog open={deleteServ} onClose={() => setDeleteServ(false)}>

            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Tem certeza que deseja excluir o serviço de {' '}
                <strong>{itemName}</strong>? Esta ação não pode ser desfeita.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteServ(false)}>Cancelar</Button>
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

    const NewService = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        await api.post('item-medicao/', {
          colaborador: IdColaborador,
          servico: servicos,
          descricao: descricao,
          quantidade_feita: quantidade,
          valor_unitario: valor,
        });
        setCreate(false);
        setAtt(true)
      } catch (err) {
        if (err.response && err.response.data) {
          const data = err.response.data;

          // Pega a primeira mensagem de erro disponível
          const firstKey = Object.keys(data)[0];
          const firstMessage = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
          console.error(firstMessage);
          setError(firstMessage);
        } else {
          setError("Não foi possível criar. Verifique os dados.");
        }
      } finally {
        setLoading(false);
      }
    };

    const columns = [
      { field: 'servico_nome', headerName: 'Serviço', flex: 1 },
      {
        field: "descricao",
        headerName: "Descrição",
        flex: 1,
      },
      { field: 'quantidade_feita', headerName: 'Quantidade', flex: 1, editable: true },
      { field: 'valor_unitario', headerName: 'Valor Unitario', flex: 1, editable: true, valueFormatter: (params) => formatarDinheiro(params), },
      { field: 'valor_total', headerName: 'Total', flex: 1, valueFormatter: (params) => formatarDinheiro(params), },
      {
        field: 'acoes',
        headerName: 'Ações',
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <div className="h-full w-full text-md flex items-center justify-center gap-2">
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
                setDeleteServ({ id: params.row.id, nome: params.row.servico_nome })
              }
            >
              <MdDelete />
            </IconButton>
          </div>
        ),
      },
    ];

    useEffect(() => {
      setLoading(true);
      const find = data.colaboradores_associados.find((col) => col.id === IdColaborador)
      setDataCol(find);
      setLoading(false);
      console.log(dataCol)
    }, [IdColaborador]);

    const handleProcessRowUpdate = async (newRow, oldRow) => {
      try {
        const resp = await api.patch(`item-medicao/${newRow.id}/`, newRow);
        const updatedRow = resp.data;

        setAtt(true);

        return updatedRow;
      } catch (error) {
        console.error("Erro ao atualizar:", error);
        return oldRow; // volta pro valor antigo se der erro
      }
    };



    return (
      <>
        {deleteServ && <DeleteServ IdItem={deleteServ.id} itemName={deleteServ.nome} />}
        {createServ && <CreateNewServ />}

        <Dialog open={edit} onClose={() => setEdit(false)} fullWidth maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContent aria-label="close"
            sx={(theme) => ({
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            })}>
            <DialogTitle id="alert-dialog-title">
              <strong>Nome:</strong> {dataCol.colaborador_name}
            </DialogTitle>
            <DialogTitle id="alert-dialog-title">
              <strong>Valor Total:</strong> {formatarDinheiro(dataCol.valor_total)}
            </DialogTitle>
            <IconButton
              sx={{
                backgroundColor: 'info.main',
                height: 'fit-content',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'info.dark',
                },
              }}
              aria-label="plus"
              onClick={() => setCreate(prev => !prev)}
            >
              <FaCirclePlus />
            </IconButton>

          </DialogContent>
          <Collapse in={create} timeout="auto" unmountOnExit>
            <DialogContent dividers >

              <form onSubmit={NewService} className="flex flex-row gap-5 gap-x-4">
                <FormControl fullWidth className="col-span-2">
                  <Autocomplete
                    options={options}
                    onChange={(e, value) => setServicos(value.id)}
                    renderInput={(params) => <TextField {...params} label="Serviços" />}
                  />
                </FormControl>
                {/* <IconButton
                  sx={{
                    backgroundColor: 'info.main',
                    height: 'fit-content',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'info.dark',
                    },
                  }}
                  aria-label="plus"
                  onClick={() => setCreateServ(true)}
                >
                  <FaCirclePlus />
                </IconButton> */}
                <FormControl fullWidth className="col-span-2">
                  <TextField
                    id="descricao"
                    label="Descrição"
                    variant="outlined"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth className="col-span-2">
                  <TextField
                    id="quantidade"
                    label="Quantidade"
                    variant="outlined"
                    value={quantidade}
                    type="number"
                    inputProps={{
                      step: "0.01",
                      min: "0.00"
                    }}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth className="col-span-2">
                  <TextField
                    id="valor"
                    label="Valor Unitario"
                    variant="outlined"
                    type="number"
                    inputProps={{
                      step: "0.01",
                      min: "0.00"
                    }}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </FormControl>
                <button
                  type="submit"
                  className="bg-cyan-500 rounded-xl text-white p-2 "
                >
                  Cadastrar
                </button>
              </form>
            </DialogContent>
          </Collapse>
          <DialogContent dividers>
            <Paper>
              <DataGrid
                rows={dataCol.itens}
                columns={columns}
                columnVisibilityModel={{
                  ano: false,
                  mes: false,
                }}
                initialState={{
                  sorting: {
                    sortModel: [
                      { field: 'servico', sort: 'desc' },
                    ],
                  },
                }}
                sx={{ border: 0 }}
                processRowUpdate={handleProcessRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
              />
            </Paper>
          </DialogContent>
        </Dialog >
      </>
    )
  }


  useEffect(() => {
    setLoading(true);
    api
      .get(`medicao/${id}`)
      .then((response) => {
        setData(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados:', error);
      })
      .finally(() => {
        setAtt(false)
        setLoading(false); // ✅ Esta linha é executada APÓS a requisição ser concluída.
      });
  }, [att]);


  const columns = [
    { field: 'colaborador_name', headerName: 'Nome', minWidth: 250, flex: 1 },
    { field: 'valor_total', headerName: 'Valor Total', minWidth: 250, flex: 1, valueFormatter: (params) => formatarDinheiro(params), },
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
              setEdit(params.row.id)
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
              setDelete({ id: params.row.id, nome: params.row.colaborador_name })
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
      return data.colaboradores_associados;
    }
    return data.colaboradores_associados.filter((func) => {
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
      {edit && <EditMedicaoColaborador IdColaborador={edit} />}
      {del && <Delete IdItem={del.id} itemName={del.nome} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">{data.str}</h1>
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
