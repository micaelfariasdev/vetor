import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
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

export function ConvertMes(mes) {
  const meses = {
    "01": "Janeiro",
    1: "Janeiro",
    1: "Janeiro",
    "02": "Fevereiro",
    2: "Fevereiro",
    2: "Fevereiro",
    "03": "Março",
    3: "Março",
    3: "Março",
    "04": "Abril",
    4: "Abril",
    4: "Abril",
    "05": "Maio",
    5: "Maio",
    5: "Maio",
    "06": "Junho",
    6: "Junho",
    6: "Junho",
    "07": "Julho",
    7: "Julho",
    7: "Julho",
    "08": "Agosto",
    8: "Agosto",
    8: "Agosto",
    "09": "Setembro",
    9: "Setembro",
    9: "Setembro",
    10: "Outubro",
    10: "Outubro",
    11: "Novembro",
    11: "Novembro",
    12: "Dezembro",
    12: "Dezembro",
  };

  return meses[mes] || "";
}

export function DesMesMes() {
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);
  const [del, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  function Delete({ IdItem, itemName }) {
    console.log(IdItem);

    const deleteAPi = async (IdItem) => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const response = await axios.delete(
          `http://localhost:8000/api/despesas/${IdItem}/`
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
              Tem certeza que deseja excluir as Despesdas do mês de{" "}
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

  function CreateNew() {
    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth();
    const anos = Array.from({ length: 5 }, (_, i) => anoAtual - i);
    const [mes, setMes] = useState(mesAtual);
    const [ano, setAno] = useState(anoAtual);
    const [obra, setObra] = useState();
    const [arrayobra, setArrayObra] = useState([]);

    useEffect(() => {
      axios.get("http://127.0.0.1:8000/api/obras/").then((response) => {
        setArrayObra(response.data);
      });
    }, []);

    const NewDesMesMes = async (e) => {
      e.preventDefault();

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const formData = new FormData();

      formData.append("author", 1);
      formData.append("obra", obra);
      formData.append("mes", mes);
      formData.append("ano", ano);

      try {
        const response = await axios.post(
          `http://localhost:8000/api/despesas/`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        window.location.reload();
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError("Não foi possível criar. Verifique suas credenciais.");
      }
    };

    const handleClose = () => {
      setCreate(false);
    };

    return (
      <>
        <Dialog
          open={create}
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          keepMounted
        >
          {" "}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loading && (
            <div className="p-5 gap-4 flex flex-col">
              <div className="w-full flex flex-row justify-between text-3xl">
                <h1 className="block text-lg font-semibold text-gray-700">
                  Cadastrar
                </h1>
                <IoIosCloseCircle
                  className="text-red-500 hover:text-red-200 cursor-pointer"
                  onClick={() => setCreate(false)}
                />
              </div>
              <form
                onSubmit={NewDesMesMes}
                method="post"
                className="grid grid-cols-2 gap-5 gap-x-4"
              >
                <div className="col-span-2">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Obra</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={obra}
                      label="Obra"
                      onChange={(e) => setObra(e.target.value)}
                    >
                      {arrayobra.map((item) => (
                        <MenuItem value={item.id}>{item.nome}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Mês</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mes}
                    label="Mês"
                    onChange={(e) => setMes(e.target.value)}
                  >
                    <MenuItem value={1}>Janeiro</MenuItem>
                    <MenuItem value={2}>Fevereiro</MenuItem>
                    <MenuItem value={3}>Março</MenuItem>
                    <MenuItem value={4}>Abril</MenuItem>
                    <MenuItem value={5}>Maio</MenuItem>
                    <MenuItem value={6}>Junho</MenuItem>
                    <MenuItem value={7}>Julho</MenuItem>
                    <MenuItem value={8}>Agosto</MenuItem>
                    <MenuItem value={9}>Setembro</MenuItem>
                    <MenuItem value={10}>Outubro</MenuItem>
                    <MenuItem value={11}>Novembro</MenuItem>
                    <MenuItem value={12}>Dezembro</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Ano</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={ano}
                    label="Ano"
                    onChange={(e) => setAno(e.target.value)}
                  >
                    {anos.map((ano) => (
                      <MenuItem value={ano}>{ano}</MenuItem>
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
            </div>
          )}
        </Dialog>
      </>
    );
  }

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/despesas/").then((response) => {
      setData(response.data);
    });
  }, []);

  const columns = [
    { field: "obra_name", headerName: "Obra", minWidth: 200, flex: 0 },
    { field: "username", headerName: "Usuario", flex: 0 },
    {
      field: "criado_em",
      headerName: "Criado Em",
      flex: 1,
      valueGetter: (value, row) => {
        return `${new Date(row.criado_em).toLocaleDateString("pt-BR")}`;
      },
    },
    {
      field: "atualizado_em",
      headerName: "Última Atualização",
      flex: 1,
      valueGetter: (value, row) => {
        return `${new Date(row.atualizado_em).toLocaleDateString("pt-BR")}`;
      },
    },
    {
      field: "referencia",
      headerName: "Mês",
      flex: 1,
      valueGetter: (value, row) => {
        return `${ConvertMes(row.mes)}/${row.ano}`;
      },
    },
    {
      field: "valor_total",
      headerName: "Total (R$)",
      flex: 2,
      valueGetter: (value, row) => {
        return `R$ ${parseFloat(
          row.itens
            .reduce((acc, item) => acc + parseFloat(item.valor), 0)
            .toFixed(2)
        ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
      },
    },
    {
      field: "data_ordenacao",
      hide: true,
      valueGetter: (value, row) =>
        `${row.ano}-${String(row.mes).padStart(2, "0")}`,
    },
    {
      field: "acoes",
      headerName: "Ações",
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
          </a>
          <a onClick={() => setDelete(params.row.id)}>
            <IconButton
              sx={{
                padding: 1,
                backgroundColor: "error.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "error.main",
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
      {create && <CreateNew />}
      {del && (
        <Delete
          IdItem={del}
          itemName={`${ConvertMes(
            data.find((item) => item.id === del).mes
          )} de ${data.find((item) => item.id === del).ano}`}
        />
      )}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">Despesas Mês a Mês</h1>
          <IconButton
            sx={{
              padding: 1,
              backgroundColor: "info.main",
              color: "white",
              "&:hover": {
                backgroundColor: "info.dark",
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
            columnVisibilityModel={{
              data_ordenacao: false,
            }}
            initialState={{
              pagination: { paginationModel },
              sorting: {
                sortModel: [{ field: "data_ordenacao", sort: "desc" }],
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
