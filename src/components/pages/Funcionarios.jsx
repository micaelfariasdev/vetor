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
import TextField from '@mui/material/TextField';

export function ConvertMes(mes) {
  const meses = {
    "01": "Janeiro",
    1: "Janeiro",
    "02": "Fevereiro",
    2: "Fevereiro",
    "03": "Março",
    3: "Março",
    "04": "Abril",
    4: "Abril",
    "05": "Maio",
    5: "Maio",
    "06": "Junho",
    6: "Junho",
    "07": "Julho",
    7: "Julho",
    "08": "Agosto",
    8: "Agosto",
    "09": "Setembro",
    9: "Setembro",
    10: "Outubro",
    '10': "Outubro",
    11: "Novembro",
    '11': "Novembro",
    12: "Dezembro",
    '12': "Dezembro",
  };

  return meses[mes] || "";
}

export function Funcionarios() {
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
          `https://vetor-api.micaelfarias.com/api/colaboradores/${IdItem}/`
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
              Tem certeza que deseja excluir o funcionario {" "}
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
    const [nome, setNome] = useState("");
    const [cargo, setCargo] = useState("");
    const [situacao, setSituacao] = useState("");
    const [obra, setObra] = useState("");
    const [arrayobra, setArrayObra] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      axios.get("https://vetor-api.micaelfarias.com/api/obras/").then((response) => {
        setArrayObra(response.data);
      });
    }, []);

    const NewFuncionario = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await axios.post("https://vetor-api.micaelfarias.com/api/colaboradores/", {
          author: 1,
          nome,
          cargo,
          situacao,
          obra,
        });
        window.location.reload();
      } catch (error) {
        console.error(error);
        setError("Não foi possível criar. Verifique os dados.");
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
              <h1 className="block text-lg font-semibold text-gray-700">Cadastrar</h1>
              <IoIosCloseCircle
                className="text-red-500 hover:text-red-200 cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <form onSubmit={NewFuncionario} className="grid grid-cols-2 gap-5 gap-x-4">
              <FormControl fullWidth className="col-span-2">
                <TextField
                  id="nome"
                  label="Nome"
                  variant="outlined"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth >
                <InputLabel id="obra-label">Obra</InputLabel>
                <Select
                  labelId="obra-label"
                  id="obra-select"
                  label='Obra'
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
              <FormControl fullWidth >
                <InputLabel id="obra-label">Situação</InputLabel>
                <Select
                  labelId="obra-label"
                  id="obra-select"
                  label='Situação'
                  value={situacao}
                  onChange={(e) => setSituacao(e.target.value)}
                >
                    <MenuItem value='ASSINADO'>
                      Carteira
                    </MenuItem>
                    <MenuItem value='FREE'>
                      Freelancer
                    </MenuItem>
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
    axios.get("https://vetor-api.micaelfarias.com/api/colaboradores/").then((response) => {
      setData(response.data);
    });
  }, []);

  const columns = [
    { field: "nome", headerName: "Funcionario", minWidth: 200, flex: 1 },
    { field: "cargo", headerName: "Função",minWidth: 200, flex: 0 },
    { field: "obra_name", headerName: "Obra",minWidth: 200, flex: 0 },
    { field: "situacao", headerName: "Situação",minWidth: 150, flex: 0 },
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
          <a onClick={() => setDelete({ 'id': params.row.id, 'nome': params.row.nome })}>
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
      {create && <CreateNew create={create} setCreate={setCreate} />}

      {del && (
        <Delete
          IdItem={del.id}
          itemName={del.nome}
        />
      )}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">Funcionarios</h1>
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
