import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCirclePlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import TextField from '@mui/material/TextField';
import React from "react";
import { useMemo } from "react";

function gerarMesCompleto(mes, ano) {
  const resultado = [];
  const dataInicial = new Date(ano, mes - 1, 1);
  const dataFinal = new Date(ano, mes, 0);

  for (let dia = 1; dia <= dataFinal.getDate(); dia++) {
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });
    const idSemana = data.getDay()
    resultado.push({
      data: data.toISOString().slice(8, 10),
      diaSemana: diaSemana,
      dataCompleta: data.toISOString().slice(0, 10)
    });
  }

  return resultado;
}


export function ConvertMes(mes) {
  const meses = {
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    "10": "Outubro",
    "11": "Novembro",
    "12": "Dezembro",
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro"
  };

  return meses[mes] || "";
}


export function PontoMes() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPonto, setEditPonto] = useState();
  const [registros, setRegistros] = useState([]);

  function EditarPonto({ IdItem }) {
  const [colaborador, setColaborador] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const diasDoMes = useMemo(() => gerarMesCompleto(data.mes, data.ano), [data.mes, data.ano]);

  useEffect(() => {
    axios.get(`https://vetor-api.micaelfarias.com/api/colaboradores/${IdItem}`)
      .then((response) => setColaborador(response.data));
  }, [IdItem]);

  useEffect(() => {
    axios.get(`https://vetor-api.micaelfarias.com/api/ponto/?colaborador=${IdItem}`)
      .then((response) => setPontos(response.data));
  }, [IdItem]);

  // Inicializa registros assim que pontos e diasDoMes estiverem disponíveis
  useEffect(() => {
    if (diasDoMes.length && pontos.length) {
      const inicial = diasDoMes.map(item => {
        const ponto = pontos.find(p => p.data === item.dataCompleta);
        return {
          data: item.dataCompleta,
          valores: [
            ponto?.entrada_manha?.slice(0,5) ?? "",
            ponto?.saida_manha?.slice(0,5) ?? "",
            ponto?.entrada_tarde?.slice(0,5) ?? "",
            ponto?.saida_tarde?.slice(0,5) ?? ""
          ]
        };
      });
      setRegistros(inicial);
    }
  }, [diasDoMes, pontos]);

  function handleChange(index, campo, valor) {
    setRegistros(prev => {
      const copia = [...prev];
      const mapaCampos = {
        entrada_manha: 0,
        saida_manha: 1,
        entrada_tarde: 2,
        saida_tarde: 3,
      };
      if (!copia[index]) copia[index] = { data: diasDoMes[index].data, valores: ["","","",""] };
      copia[index].valores[mapaCampos[campo]] = valor;
      return copia;
    });
  }

  async function handleSalvar() {
    try {
      setLoading(true);
      const registrosPreenchidos = registros
      .filter(item => item.valores.some(valor => valor !== ""))
      .map(item => ({
      ...item,
      data: item.data.split("-")[2]  // pega só o dia (última parte do 'YYYY-MM-DD')
    })
    );

      const payload = {
        author: 1,
        colaborador_id: IdItem,
        mes: data.mes,
        ano: data.ano,
        registros: registrosPreenchidos
      };
      await axios.post(`https://vetor-api.micaelfarias.com/api/ponto/salvar-registros/`, payload);
      setLoading(false);
      setEditPonto(false);
    } catch (err) {
      setLoading(false);
      console.error("Erro ao salvar:", err);
    }
  }

  return (
    <Dialog open={editPonto} onClose={() => setEditPonto(false)} maxWidth="md" fullWidth>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <DialogTitle>{colaborador.nome} • {ConvertMes(data.mes)} / {data.ano}</DialogTitle>

      <DialogContent>
        <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(4, 1fr)", gap: "8px" }}>
          <strong>Data</strong>
          <strong>Entrada Manhã</strong>
          <strong>Saída Manhã</strong>
          <strong>Entrada Tarde</strong>
          <strong>Saída Tarde</strong>
        </div>
        {registros.map((item, index) => {
          const diaObj = diasDoMes[index];
          const isDomingo = diaObj.diaSemana.toLowerCase() === "domingo";
          const isSabado = diaObj.diaSemana.toLowerCase() === "sábado";
          const linhaStyle = {
            display: "grid",
            gridTemplateColumns: "2fr repeat(4, 1fr)",
            gap: "8px",
            padding: "2px 0",
            backgroundColor: isDomingo ? "#f28b82" : isSabado ? "#fff176" : "#fff",
            opacity: isDomingo ? 0.6 : 1,
            pointerEvents: isDomingo ? "none" : "auto",
          };

          return (
            <div key={item.data} style={linhaStyle}>
              <div style={{ padding: "4px" }}>{diaObj.data}/{diaObj.diaSemana}</div>
              <input type="time" value={item.valores[0]} onChange={e => handleChange(index, "entrada_manha", e.target.value)} />
              <input type="time" value={item.valores[1]} onChange={e => handleChange(index, "saida_manha", e.target.value)} />
              <input type="time" value={item.valores[2]} onChange={e => handleChange(index, "entrada_tarde", e.target.value)} />
              <input type="time" value={item.valores[3]} onChange={e => handleChange(index, "saida_tarde", e.target.value)} />
            </div>
          );
        })}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setEditPonto(false)}>Cancelar</Button>
        <Button color="primary" onClick={handleSalvar}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}



  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`https://vetor-api.micaelfarias.com/api/mes-ponto/${id}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!data?.obra) return;
    axios.get(`https://vetor-api.micaelfarias.com/api/colaboradores/?obra=${data.obra}`)
      .then((res) => setFuncionarios(res.data));
  }, [data?.obra]);


  const columns = [
    { field: "nome", headerName: "Funcionario", minWidth: 200, flex: 1 },
    { field: "cargo", headerName: "Função", minWidth: 200, flex: 0 },
    { field: "obra_name", headerName: "Obra", minWidth: 200, flex: 0 },
    {
      field: "acoes",
      headerName: "Ações",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="h-full w-full text-md flex items-center justify-center gap-2"
          onClick={() => setEditPonto({ 'id': params.row.id })}>
          <IconButton
            aria-label="editar"
            size="small"
            sx={{
              backgroundColor: "info.main",
              color: "white",
              "&:hover": {
                backgroundColor: "info.dark",
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

  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <>
      {editPonto && (
        <EditarPonto
          IdItem={editPonto.id}
        />
      )}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">{`${data.obra_name} - ${ConvertMes(data.mes)} / ${data.ano}`}</h1>

        </div>
        <hr className="col-span-2" />
        <div className="col-span-2"></div>
        <Paper>
          <DataGrid
            rows={funcionarios}
            columns={columns}
            initialState={{
              pagination: { paginationModel },
              sorting: {
                sortModel: [{ field: "nome", sort: "desc" }],
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
