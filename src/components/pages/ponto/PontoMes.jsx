import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useMemo } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

function gerarMesCompleto(mes, ano) {
  const resultado = [];
  let mesini = mes;
  let mesfini = mes;
  let anoini = ano;

  if (mes === 1) {
    mesini = 11;
    mesfini = 0;
    anoini -= 1;
  } else {
    mesini = mes - 2;
    mesfini = mes - 1;
  }

  const dataInicial = new Date(anoini, mesini, 26);
  const dataFinal = new Date(ano, mesfini, 25);

  const dataAtual = new Date(dataInicial);
  while (dataAtual <= dataFinal) {
    const diaSemana = dataAtual.toLocaleDateString('pt-BR', {
      weekday: 'long',
    });

    resultado.push({
      data: dataAtual.toISOString().slice(8, 10),
      mes: dataAtual.toISOString().slice(5, 7),
      diaSemana: diaSemana,
      dataCompleta: dataAtual.toISOString().slice(0, 10),
    });

    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  return resultado;
}

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

export function PontoMes() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPonto, setEditPonto] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(false);
  const [calculos, setCalculos] = useState({
    horasExtra: '00:00',
    horasPremium: '00:00',
    horasFaltantes: '00:00',
    diasDeFalta: 0,
  });

  function EditarPonto({ IdItem }) {
    const [colaborador, setColaborador] = useState([]);
    const [pontos, setPontos] = useState([]);
    const [registros, setRegistros] = useState([]);

    const diasDoMes = useMemo(
      () => gerarMesCompleto(data.mes, data.ano),
      [data.mes, data.ano]
    );

    useEffect(() => {
      setLoading(true);
      axios
        .get(
          `https://vetor-api.micaelfarias.com/api/colaboradores/${IdItem}/pontos/${id}`
        )
        .then((response) => {
          setColaborador(response.data.dados);
          setPontos(response.data.pontos);
        });
      setLoading(false);
    }, [IdItem]);

    useEffect(() => {
      if (diasDoMes.length) {
        const inicial = diasDoMes.map((item) => {
          const ponto = pontos.find((p) => p.data === item.dataCompleta);
          return {
            data: item.dataCompleta,
            valores: [
              ponto?.entrada_manha?.slice(0, 5) ?? '',
              ponto?.saida_manha?.slice(0, 5) ?? '',
              ponto?.entrada_tarde?.slice(0, 5) ?? '',
              ponto?.saida_tarde?.slice(0, 5) ?? '',
              ponto?.feriado ?? false,
              ponto?.atestado ?? false,
              ponto?.delete ?? false,
              ponto?.falta ?? false,
            ],
          };
        });

        setRegistros(inicial);
      }
    }, [diasDoMes, pontos]);

    function handleChange(index, campo, valor) {
      setRegistros((prev) => {
        const copia = [...prev];
        const mapaCampos = {
          entrada_manha: 0,
          saida_manha: 1,
          entrada_tarde: 2,
          saida_tarde: 3,
          feriado: 4,
          atestado: 5,
          delete: 6,
          falta: 7,
        };

        if (!copia[index]) {
          copia[index] = {
            data: diasDoMes[index].data,
            valores: ['', '', '', '', '', '', '', ''],
          };
        }

        const indiceCampo = mapaCampos[campo];
        if (indiceCampo !== undefined) {
          copia[index].valores[indiceCampo] = valor;
        }

        return copia;
      });
    }

    async function handleSalvar() {
      try {
        setLoading(true);

        const registrosPreenchidos = registros
          .filter(
            (item) =>
              item.valores.slice(0, 3).some((valor) => valor !== '') ||
              item.valores.slice(4, 8).some((valor) => valor !== false)
          )
          .map((item) => ({
            ...item,
            data: item.data.split('-')[2],
            mes: item.data.split('-')[1],
          }));
        const payload = {
          author: 1,
          colaborador_id: IdItem,
          mes: data.mes,
          ano: data.ano,
          registros: registrosPreenchidos,
        };
        console.log(payload);
        await axios.post(
          `https://vetor-api.micaelfarias.com/api/ponto/salvar-registros/`,
          payload
        );
        setLoading(false);
        setEditPonto(false);
      } catch (err) {
        setLoading(false);
        setError('Erro ao salvar:', err);
        console.error('Erro ao salvar:', err);
      }
    }

    return (
      <Dialog
        open={editPonto}
        onClose={() => setEditPonto(false)}
        maxWidth="lg"
        fullWidth
      >
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <DialogTitle>
          <Grid item xs={6}>
            <Typography variant="h4">
              {colaborador.nome} • {ConvertMes(data.mes)} / {data.ano}
            </Typography>

            <Grid item xs={6}>
              <Table size="small" sx={{ border: '1px solid #e0e0e0' }}>
                <TableBody>
                  <TableRow>
                    <TableCell>❌ Faltas</TableCell>
                    <TableCell
                      sx={{ borderRight: '1px solid #e0e0e0' }}
                      align="right"
                    >
                      {colaborador.falta}
                    </TableCell>
                    <TableCell>⏳ Faltantes</TableCell>
                    <TableCell
                      sx={{ borderRight: '1px solid #e0e0e0' }}
                      align="right"
                    >
                      {colaborador['horas-faltando']}
                    </TableCell>
                    <TableCell>⏫ Extras</TableCell>
                    <TableCell
                      sx={{ borderRight: '1px solid #e0e0e0' }}
                      align="right"
                    >
                      {colaborador['horas-extras']}
                    </TableCell>
                    <TableCell>📅 Feriado/Domingo</TableCell>
                    <TableCell
                      sx={{ borderRight: '1px solid #e0e0e0' }}
                      align="right"
                    >
                      {colaborador['horas-feriado-domingo']}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '3fr 1fr 1fr 1fr repeat(4, 2fr) 1fr',
              justifyItems: 'center',
              gap: '8px',
            }}
          >
            <strong>Data</strong>
            <strong>Atestado?</strong>
            <strong>Feriado?</strong>
            <strong>Falta?</strong>
            <strong>Entrada Manhã</strong>
            <strong>Saída Manhã</strong>
            <strong>Entrada Tarde</strong>
            <strong>Saída Tarde</strong>
            <strong>Delete</strong>
          </div>
          {registros.map((item, index) => {
            const diaObj = diasDoMes[index];
            const isDelete = item.valores[6];
            const isSabado = ['sábado', 'domingo'].includes(
              diaObj.diaSemana.toLowerCase()
            );

            const linhaStyle = {
              display: 'grid',
              gridTemplateColumns: '3fr 1fr 1fr 1fr repeat(4, 2fr)',
              justifyItems: 'center',
              gap: '8px',
              padding: '2px 0',
              backgroundColor: isDelete
                ? '#f28b82'
                : isSabado
                ? '#fff176'
                : '#fff',
              opacity: isDelete ? 0.6 : 1,
              pointerEvents: isDelete ? 'none' : 'auto',
            };
            return (
              <div
                key={item.data}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '13fr 1fr',
                }}
              >
                <div style={linhaStyle}>
                  <div
                    style={{
                      padding: '4px',
                      justifySelf: 'left',
                    }}
                  >
                    {diaObj.data}/{diaObj.mes} • {diaObj.diaSemana}
                  </div>
                  <input
                    type="checkbox"
                    checked={item.valores[5] === true}
                    onChange={(e) =>
                      handleChange(index, 'atestado', e.target.checked)
                    }
                  />
                  <input
                    type="checkbox"
                    checked={item.valores[4] === true}
                    onChange={(e) =>
                      handleChange(index, 'feriado', e.target.checked)
                    }
                  />
                  <input
                    type="checkbox"
                    checked={item.valores[7] === true}
                    onChange={(e) =>
                      handleChange(index, 'falta', e.target.checked)
                    }
                  />
                  {!item.valores[7] ? (
                    <>
                      <input
                        type="time"
                        value={item.valores[0]}
                        onChange={(e) =>
                          handleChange(index, 'entrada_manha', e.target.value)
                        }
                      />
                      <input
                        type="time"
                        value={item.valores[1]}
                        onChange={(e) =>
                          handleChange(index, 'saida_manha', e.target.value)
                        }
                      />
                      <input
                        type="time"
                        value={item.valores[2]}
                        onChange={(e) =>
                          handleChange(index, 'entrada_tarde', e.target.value)
                        }
                      />
                      <input
                        type="time"
                        value={item.valores[3]}
                        onChange={(e) =>
                          handleChange(index, 'saida_tarde', e.target.value)
                        }
                      />
                    </>
                  ) : (
                    <div className="col-span-4 bg-red-700 text-white font-bold w-full text-center flex justify-center ">
                      <p className="self-center"> FALTA </p>
                    </div>
                  )}
                </div>
                <IconButton
                  sx={{
                    height: '30px',
                    aspectRatio: '1/1',
                    padding: 1,
                    backgroundColor: 'error.main',
                    color: 'white',
                    justifySelf: 'center',
                    alignSelf: 'center',
                    '&:hover': {
                      backgroundColor: 'error.main',
                      opacity: 0.8,
                    },
                  }}
                  aria-label="deletar"
                  size="small"
                  onClick={() => handleChange(index, 'delete', !isDelete)}
                >
                  <MdDelete />
                </IconButton>
              </div>
            );
          })}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditPonto(false)}>Cancelar</Button>
          <Button color="primary" onClick={handleSalvar}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://vetor-api.micaelfarias.com/api/mes-ponto/${id}/relacao/`)
      .then((res) => {
        setFuncionarios(res.data.funcionarios);
        setData(res.data.dados);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const columns = [
    { field: 'nome', headerName: 'Funcionario', minWidth: 200, flex: 1 },
    { field: 'cargo', headerName: 'Função', minWidth: 200, flex: 0 },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div
          className="h-full w-full text-md flex items-center justify-center gap-2"
          onClick={() => setEditPonto({ id: params.row.id })}
        >
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
        </div>
      ),
    },
  ];

  function abrirPopup(url) {
    const nomeDaJanela = 'popupPersonalizado';

    const opcoes = `width=${1080},height=${720},scrollbars=yes,resizable=yes`;

    window.open(url, nomeDaJanela, opcoes);
  }

  const filteredFuncionarios = useMemo(() => {
    if (!searchQuery) {
      return funcionarios;
    }
    return funcionarios.filter((func) =>
      func.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [funcionarios, searchQuery]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {editPonto && <EditarPonto IdItem={editPonto.id} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">{`${data.obra_name} - ${ConvertMes(
            data.mes
          )} / ${data.ano}`}</h1>
          <IconButton
            sx={{
              padding: 1,
              backgroundColor: 'success.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'success.dark',
              },
            }}
            aria-label="deletar"
            size="small"
            onClick={() => {
              const pop1 = abrirPopup(
                `https://vetor-api.micaelfarias.com/api/ponto/pdf/${id}/`
              );
            }}
          >
            <FaFileDownload />
          </IconButton>
        </div>

        <hr className="col-span-2" />
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
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
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    </>
  );
}

export default ConvertMes;
