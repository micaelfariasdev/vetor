import * as React from 'react';
import { useState, useEffect } from 'react';
import { data, useParams } from 'react-router-dom';
import { IoIosCloseCircle } from 'react-icons/io';

import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import { ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { FaEdit } from 'react-icons/fa';

import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import api from '../auth/auth';
import { topNotice } from '../../utils';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { ServicoEdit } from './servicos/ServicoEdit';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function Obras_detail() {

  const { id } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [end, setEnd] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [type, setType] = useState('');
  const [serv, setServ] = useState('');
  const [edit, setEdit] = useState('');
  let [att, setAtt] = useState(false);
  const [unidades, setUnidades] = useState([]);
  const [openAndar, setOpenAndar] = useState('');
  const [search, setSearch] = useState(false);
  const [servIdEdit, setServIdEdit] = useState('')

  const gerarRelatorio = async () => {
    try {
      const responseAPI = await api.get(`/obras/${id}/servicos/`);
      const jsonData = responseAPI.data;
      console.log(jsonData)
      const urlDestino = 'https://vetor.micaelfarias.com/apiv2/relatorio/servicos';
      const response = await fetch(urlDestino, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório no servidor.');
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      window.open(fileURL, '_blank');

    } catch (error) {
      console.error("Falha ao gerar e abrir relatório:", error);
      alert("Não foi possível gerar o relatório. Verifique o console.");
    }
  };


  useEffect(() => {
    setLoading(true);
    api
      .get(`https://vetor-api.micaelfarias.com/api/obras/${id}/`)
      .then((response) => {
        setNome(response.data.nome);
        setEnd(response.data.endereço);
        setCnpj(response.data.cnpj);
        setType(response.data.tipo_obra);
        setServ(response.data.servicos);
        setUnidades(response.data.andares);
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados:', error);
      })
      .finally(() => {
        setLoading(false); // ✅ Esta linha é executada APÓS a requisição ser concluída.
      });
  }, [att]);

  const EditObra = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await api.patch(`obras/${id}/`, {
        nome,
        endereço: end,
        cnpj,
        type,
      });
      setAtt((prev) => !prev);
      topNotice({ success: 'Obra editada com sucesso!' });
    } catch (error) {
      console.error(error);
      setError('Não foi possível criar. Verifique os dados.');
    } finally {
      setLoading(false);
    }
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

  const [value, setValue] = React.useState(0);

  const handleChangee = (event, newValue) => {
    setValue(newValue);
  };

  const handleRemoveItem = (idToRemove, name) => {
    const updatedItems = serv.filter((item) => item.id !== idToRemove);
    setServ(updatedItems);
    try {
      api
        .delete(`obras/${id}/remove-servicos/`, {
          data: { servico_id: idToRemove },
        })
        .then((response) => {
          topNotice({ success: `Serviço ${name} removido com sucesso!` });
        });
    } catch (err) {
      topNotice({ error: 'Erro ao remover serviço. Tente novamente.' });
    }
  };

  const handleAddItem = (idToAdd, name) => {
    try {
      api
        .post(`obras/${id}/add-servicos/`, {
          servico_id: idToAdd,
        })
        .then((response) => {
          topNotice({ success: `Serviço ${name} adicionado com sucesso!` });
        });
    } catch (err) {
      topNotice({ error: 'Erro ao adicionar serviço. Tente novamente.' });
    }
  };

  function SearchServ({ search, setSearch }) {
    const [getServ, setGetServ] = React.useState(0);

    useEffect(() => {
      api
        .get(`https://vetor-api.micaelfarias.com/api/servico/`)
        .then((response) => {
          setGetServ(response.data);
        });
    }, []);
    const handleClose = () => {
      setSearch(false);
    };

    const [difServ, setDiServ] = React.useState([]);

    useEffect(() => {
      if (getServ && serv) {
        const servicosDiferentes = getServ.filter(
          (item) => !serv.some((service) => service.id === item.id)
        );
        setDiServ(servicosDiferentes);
      }
    }, [getServ, serv]);

    return (
      <Dialog open={search} onClose={handleClose} maxWidth="lg" fullWidth>
        <Box className="w-full h-full min-h-150 p-5">
          <div className="w-full flex flex-row justify-between text-3xl">
            <h1 className="block text-lg font-semibold text-gray-700">
              Adicionar
            </h1>
            <IoIosCloseCircle
              className="text-red-500 hover:text-red-200 cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <List>
            {difServ.length > 0 ? (
              difServ.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText primary={item.titulo} />
                  <IconButton
                    edge="end"
                    aria-label="adicionar"
                    onClick={() => {
                      setServ([...serv, item]);
                      handleAddItem(item.id, item.titulo);
                    }}
                    color="primary"
                  >
                    <AddCircleIcon />
                  </IconButton>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" className="text-gray-500">
                Nenhum serviço encontrado.
              </Typography>
            )}
          </List>
        </Box>
      </Dialog>
    );
  }

  function EditServicosUnidades({ idUni, obra }) {
    const [editServ, setEditServ] = useState([]);

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await api.post('servico-unidade/get-servicos/',
            {
              unidade_id: idUni
            }
          );

          setEditServ(response.data);
        } catch (err) {
          console.error('Erro ao carregar serviço:', err);
        }
      }

      if (idUni) {
        fetchData();
      }
    }, [idUni]);

    const handleClose = () => {
      setEdit(false);
    };



    return (
      <Dialog open={edit} onClose={handleClose} keepMounted>
        <Box className="w-full h-full min-h-150 p-5">
          <List className='w-100'>
            {serv.map((item) => {
              const found = editServ.find((i) => i.servico === item.id) || {};
              return (
                <ListItem key={item.id} divider className='flex justify-between '>
                  <ListItemText primary={item.titulo} />
                  <ListItemText primary={found?.status ?? 0.00} className='text-right'/>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Dialog>
    );
  }
  const handleCloseedit = () => {
    setServIdEdit(null)
  }

  return (
    <>
      {search && <SearchServ search={search} setSearch={setSearch} />}
      {edit && <EditServicosUnidades idUni={edit} obra={id} />}
      {servIdEdit && <ServicoEdit unidades={unidades} serv={servIdEdit} open={!!servIdEdit} onClose={handleCloseedit} servico={serv} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">Obras</h1>
          <div className="flex flex-row-reverse " hidden={value !== 2}>
            <IconButton
              sx={{
                padding: 1,
                backgroundColor: 'success.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'success.dark',
                },
              }}
              size="small"
              onClick={gerarRelatorio}
            >
              <FaCloudUploadAlt />
            </IconButton>
          </div>
        </div>
        <hr className="col-span-2" />
        <div className="col-span-2 flex gap-2 ">
          <Box
            sx={{ borderBottom: 1, borderColor: 'divider', minWidth: '100%' }}
          >
            <Tabs
              value={value}
              onChange={handleChangee}
              aria-label="basic tabs example"
            >
              <Tab label="Cadastro" {...a11yProps(0)} />
              <Tab label="Serviços" {...a11yProps(1)} />
              <Tab label="Unidades" {...a11yProps(2)} />
            </Tabs>
          </Box>
        </div>
        <Paper hidden={value !== 0}>
          <form
            onSubmit={EditObra}
            className="grid grid-cols-2 gap-4 p-4 align-middle"
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
            <FormControl fullWidth className="col-span-2">
              <TextField
                id="endereco"
                label="Endereço"
                variant="outlined"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth className="">
              <TextField
                id="CNPJ"
                label="CNPJ"
                variant="outlined"
                value={cnpj}
                onChange={(e) => handleChange(e)}
              />
            </FormControl>

            <FormControl fullWidth className="">
              <InputLabel id="type">Tipo de Obra</InputLabel>
              <Select
                label="Tipo de Obra"
                id="type-id"
                variant="outlined"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="PREDIO">Prédio</MenuItem>
                <MenuItem value="CONDOMINIO">Condomínio de Casas</MenuItem>
                <MenuItem value="LOTEAMENTO">Loteamento</MenuItem>
              </Select>
            </FormControl>
            <button
              type="submit"
              className="bg-cyan-500 rounded-xl cursor-pointer text-white p-2 w-20 col-2 justify-self-end"
            >
              Salvar
            </button>
          </form>
        </Paper>

        <Paper
          hidden={value !== 1}
          className="grid grid-cols-1 gap-4 p-4 items-start"
        >
          <List>
            {serv ? (
              serv.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText primary={item.titulo} />
                  <IconButton
                    edge="end"
                    aria-label="remover"
                    onClick={() => setServIdEdit(item.id)}
                  >
                    <FaEdit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="remover"
                    onClick={() => handleRemoveItem(item.id, item.titulo)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" className="text-gray-500">
                Nenhum serviço adicionado.
              </Typography>
            )}
          </List>
          <Box className="grid gap-2 grid-cols-1 justify-self-end">
            <button
              className="bg-gray-500 rounded-xl cursor-pointer text-white p-2"
              onClick={() => setSearch(true)}
            >
              Adicionar
            </button>
          </Box>
        </Paper>

        <Paper hidden={value !== 2}>
          <TableContainer component={Paper}>

            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Andar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unidades.map((row) => (
                  <>
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() => setOpenAndar(row.id)}
                        selected={openAndar === row.id}
                      >
                        {row.nome}
                      </TableCell>
                    </TableRow>
                    <Collapse
                      in={openAndar === row.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <div className="w-full flex gap-5 p-2 font-bold">
                        {row.unidades.map((item, index) => (
                          <ThemeProvider
                            theme={{
                              palette: {
                                primary: {
                                  main: '#007FFF',
                                  dark: '#0066CC',
                                },
                              },
                            }}
                          >
                            <Box
                              sx={{
                                cursor: 'pointer',
                                color: 'white',
                                textAlign: 'center',
                                width: 25,
                                height: 25,
                                borderRadius: 1,
                                bgcolor: '#64b5f6',
                                '&:hover': {
                                  bgcolor: '#b3e5fc',
                                },
                              }}
                              onClick={() => setEdit(item.id)}
                            >
                              {item.nome_ou_numero}
                            </Box>
                          </ThemeProvider>
                        ))}
                      </div>
                    </Collapse>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </>
  );
}
