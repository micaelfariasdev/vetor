import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useMemo } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import api from '../auth/auth';
import { ConvertMes, iniciarDownload, topNotice } from '../../utils';
import axios from 'axios';

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

export function PontoMes() {
  const { id } = useParams();
  const [down, setdown] = useState(false);
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
      // Verifica se IdItem existe para evitar requisições desnecessárias
      if (IdItem) {
        api
          .get(
            `https://vetor-api.micaelfarias.com/api/colaboradores/${IdItem}/pontos/${id}`
          )
          .then((response) => {
            setColaborador(response.data.dados);
            setPontos(response.data.pontos);
          })
          .catch((error) => {
            console.error('Erro ao buscar dados do colaborador:', error);
          });
      }
    }, [IdItem, id]); // Dependências corrigidas

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
              ponto?.ferias ?? false,
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
          ferias: 8,
        };

        if (!copia[index]) {
          copia[index] = {
            data: diasDoMes[index].data,
            valores: ['', '', '', '', '', '', '', '', ''],
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
              item.valores.slice(4, 9).some((valor) => valor !== false)
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
        await api.post(`ponto/salvar-registros/`, payload);
        setLoading(false);
        setEditPonto(false);
        topNotice({
          success: `Ponto do colaborador ${colaborador.nome} salvo com sucesso!`,
        });
      } catch (err) {
        topNotice({ error: `Erro ao salvar o ponto. Tente novamente. ${err}` });
        setLoading(false);
      }
    }

    function calcularHorasTrabalhadas(
      entradaManha,
      saidaManha,
      entradaTarde,
      saidaTarde
    ) {
      const converterParaMinutos = (horaString) => {
        if (!horaString) return 0;
        const [horas, minutos] = horaString.split(':').map(Number);
        return horas * 60 + minutos;
      };

      const minutosEntradaManha = converterParaMinutos(entradaManha);
      const minutosSaidaManha = converterParaMinutos(saidaManha);
      const minutosEntradaTarde = converterParaMinutos(entradaTarde);
      const minutosSaidaTarde = converterParaMinutos(saidaTarde);

      const duracaoManha = minutosSaidaManha - minutosEntradaManha;
      const duracaoTarde = minutosSaidaTarde - minutosEntradaTarde;

      const totalMinutos = duracaoManha + duracaoTarde;

      return totalMinutos;
    }

    return (
      <Dialog
        open={editPonto}
        onClose={() => setEditPonto(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Grid container>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h4"
                className="flex justify-between align-middle items-center pb-5"
              >
                {colaborador.nome} • {ConvertMes(data.mes)} / {data.ano}
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
                  onClick={() =>
                    BaixaPontoCol(
                      data.ano,
                      data.mes,
                      colaborador.id,
                      colaborador.nome
                    )
                  }
                >
                  <FaCloudUploadAlt />
                </IconButton>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
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
              gridTemplateColumns: '3fr 1fr 1fr 1fr repeat(5, 2fr) 1fr',
              justifyItems: 'center',
              gap: '8px',
            }}
          >
            <strong>Data</strong>
            <strong>Situação</strong>
            <strong>Feriado?</strong>
            <strong>Falta?</strong>
            <strong>Entrada Manhã</strong>
            <strong>Saída Manhã</strong>
            <strong>Entrada Tarde</strong>
            <strong>Saída Tarde</strong>
            <strong>Horas</strong>
            <strong>Delete</strong>
          </div>
          {registros.map((item, index) => {
            const entradaManha = item.valores[0];
            const saidaManha = item.valores[1];
            const entradaTarde = item.valores[2];
            const saidaTarde = item.valores[3];

            const totalMinutos = calcularHorasTrabalhadas(
              entradaManha,
              saidaManha,
              entradaTarde,
              saidaTarde
            );

            const horas = Math.floor(Math.abs(totalMinutos) / 60);
            const minutos = Math.abs(totalMinutos) % 60;
            const sinal = totalMinutos < 0 ? '-' : '';

            const horasFormatadas = `${sinal}${String(horas).padStart(
              2,
              '0'
            )}:${String(minutos).padStart(2, '0')}`;

            const diaObj = diasDoMes[index];
            const isDelete = item.valores[6];
            const isSabado = ['sábado', 'domingo'].includes(
              diaObj.diaSemana.toLowerCase()
            );

            const linhaStyle = {
              display: 'grid',
              gridTemplateColumns: '3fr 1fr 1fr 1fr repeat(5, 2fr)',
              justifyItems: 'center',
              height: '35px',
              gap: '8px',
              padding: '2px 0',
              backgroundColor: isDelete
                ? '#f28b82'
                : isSabado
                ? '#fff176'
                : '#fff',
            };
            return (
              <div
                key={item.data}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '14fr 1fr',
                }}
              >
                {isDelete ? (
                  <div
                    style={{
                      width: '100%',
                      height: '35px',
                      backgroundColor: '#f28b82',
                      opacity: 0.6,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {' '}
                    <p className="self-center">
                      DELETAR DIA {diaObj.data}/{diaObj.mes} •{' '}
                      {diaObj.diaSemana}
                    </p>{' '}
                  </div>
                ) : (
                  <div style={linhaStyle}>
                    <div
                      style={{
                        padding: '4px',
                        justifySelf: 'left',
                      }}
                    >
                      {diaObj.data}/{diaObj.mes} • {diaObj.diaSemana}
                    </div>
                    <select
                      value={
                        item.valores[5]
                          ? 'atestado'
                          : item.valores[8]
                          ? 'ferias'
                          : 'normal'
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        handleChange(index, 'atestado', v === 'atestado');
                        handleChange(index, 'ferias', v === 'ferias');
                      }}
                    >
                      <option value="normal">-</option>
                      <option value="atestado">Atestado</option>
                      <option value="ferias">Férias</option>
                    </select>

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
                    {item.valores[7] ? (
                      <div className="col-span-4 bg-red-200 text-red-900 font-bold w-full text-center flex justify-center ">
                        <p className="self-center"> FALTA </p>
                      </div>
                    ) : item.valores[5] ? (
                      <div className="col-span-4 bg-blue-200 text-blue-800 font-bold w-full text-center flex justify-center ">
                        <p className="self-center"> ATESTADO </p>
                      </div>
                    ) : item.valores[8] ? (
                      <div className="col-span-4 bg-green-200 text-green-800 font-bold w-full text-center flex justify-center ">
                        <p className="self-center"> FERIAS </p>
                      </div>
                    ) : (
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
                        <p
                          className={
                            (diaObj.diaSemana === 'sexta-feira' &&
                              Number(horasFormatadas.slice(0, 2)) < 8) ||
                            (diaObj.diaSemana !== 'sexta-feira' &&
                              Number(horasFormatadas.slice(0, 2)) < 9)
                              ? 'text-red-500' // Adiciona a classe 'text-red-500' para vermelho
                              : 'text-green-400'
                          }
                        >
                          {horasFormatadas}
                        </p>
                      </>
                    )}
                  </div>
                )}
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
    api
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
const [progress, setProgress] = useState(0);
const [progressuser, setProgressuser] = useState('');
 async function BaixaPonto(ano, mes) {
    try {
      const primeiraResposta = await api.get(`ponto/pdf/${id}/`);
      const blob = new Blob([primeiraResposta.data], { type: 'text/html' });
      const fileURL = URL.createObjectURL(blob);

      // Abre o relatório na nova aba
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error("Ocorreu um erro nas requisições:", error.message);
      alert("Ocorreu um erro ao baixar os arquivos.");
      setProgress(0)
    } finally {
      setLoading(false);
      setProgress(0)
    }
  }


  async function BaixaPontoCol(ano, mes, col, nome) {
    try {
      const primeiraResposta = await api.get(`ponto/pdf/${id}/${col}`);

      const blob = new Blob([primeiraResposta.data], { type: 'text/html' });
      const fileURL = URL.createObjectURL(blob);

      // Abre o relatório na nova aba
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Ocorreu um erro nas requisições:', error.message);

      alert('Ocorreu um erro ao baixar os arquivos.');
    }
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
      {editPonto && <EditarPonto IdItem={editPonto.id} />}
     {progress > 0 &&
     <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      padding: '10px',
      backgroundColor: '#fff',
      border: '1px solid #000',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      textAlign: 'center',
      zIndex: 999999999999
    }}
  >
    <div
      style={{
        width: `${progress}%`,
        height: '20px',
        backgroundColor: '#4caf50',
        transition: 'width 0.3s'
      }}
    />
    <p>{progress}% concluído</p>
    <p>Salvando {progressuser}</p>
  </div>}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">{`${data.obra_name} - ${ConvertMes(
            data.mes
          )} / ${data.ano}`}</h1>
          <div className="flex gap-5 items-center ">
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
              onClick={() => BaixaPonto(data.ano, data.mes)}
            >
              <FaCloudUploadAlt />
            </IconButton>
          </div>
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
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    </>
  );
}
