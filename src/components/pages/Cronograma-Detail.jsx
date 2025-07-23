import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaCirclePlus } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { IoReload } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import Dialog from "@mui/material/Dialog";
import { ConvertMes } from "./DespesasMes";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileDownload } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";

export function CronogramaDetail() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [obra, setObra] = useState([]);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState();
  const [error, setError] = useState(false);

  function CreateNew() {
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [errors] = useState([]);

    const UpdateItens = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (file) {
        if (file.name.split(".").pop() !== "xml") {
          errors.push("Formato de arquivo inválido. Use .xml");
          console.log(errors);
          setFile(null);
          setLoading(false);
          throw new Error("Formato de arquivo inválido. Use .xml");
        }
      }
      const formData = new FormData();

      formData.append("file", file);
      formData.append("cronograma", id);

      try {
        const response = await axios.post(
          `https://vetor-api.micaelfarias.com/api/xmlcronograma/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        ReloadCronograma()
        window.location.reload();
      } catch (error) {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        errors.push("Não foi possível criar. Verifique suas credenciais.");
        console.log(errors);
        setError(errors);
      }
    };
    const handleClose = () => {
      setCreate(false);
    };

    const VisuallyHiddenInput = styled("input")({
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: 1,
      overflow: "hidden",
      position: "absolute",
      bottom: 0,
      left: 0,
      whiteSpace: "nowrap",
      width: 1,
    });

    return (
      <>
        <Dialog
          open={create}
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          keepMounted
        >
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
              onSubmit={UpdateItens}
              method="post"
              className="flex flex-col gap-2"
              encType="multipart/form-data"
            >
              <div>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<FaCloudUploadAlt />}
                >
                  Enviar XMl
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    multiple
                  />
                </Button>
              </div>
              <button
                type="submit"
                className="bg-cyan-500 rounded-xl text-white p-2 cursor-pointer"
              >
                Upload
              </button>
            </form>
            {loading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error &&
              error.map((error, index) => (
                <p className="text-red-400">{error}</p>
              ))}
          </div>
        </Dialog>
      </>
    );
  }

  useEffect(() => {
    axios
      .get(`https://vetor-api.micaelfarias.com/api/cronograma/${id}/`)
      .then((response) => {
        setObra(response.data);
      });
  }, []);

  useEffect(() => {
    axios.get(`https://vetor-api.micaelfarias.com/api/servicos-cronograma/?cronograma=${id}`).then((response) => {
      setData(response.data);
    });
  }, []);

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      const response = await axios.patch(
        `https://vetor-api.micaelfarias.com/api/servicos-cronograma/${newRow.id}/`,
        {
          dias: newRow.dias,
          progresso: newRow.progresso,
        }
      );
      ReloadCronograma()
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      return oldRow;
    }
  };

  const [loading, setLoading] = useState(false);

  const ReloadCronograma = async () => {
    setLoading(true);
    try {
      await axios.post(`https://vetor-api.micaelfarias.com/api/cronograma/recalcular/${id}/`);

      const servicosRes = await axios.get(
        `https://vetor-api.micaelfarias.com/api/servicos-cronograma/?cronograma=${id}`
      );
      setData(servicosRes.data);

      const obraRes = await axios.get(
        `https://vetor-api.micaelfarias.com/api/cronograma/${id}/`
      );
      setObra(obraRes.data);

    } catch (error) {
      console.error("Erro ao recalcular cronograma:", error);
    } finally {
      setLoading(false);
    }
  };




  const columns = [
    { field: "codigo", headerName: "Código", minWidth: 300, flex: 0 },
    { field: "titulo", headerName: "Serviço", minWidth: 300, flex: 0 },
    { field: "dias", headerName: "Dias de Serviço", flex: 1, editable: true },
    {
      field: "inicio",
      headerName: "Inicio",
      flex: 1,
      valueGetter: (value, row) => {
        return `${String(new Date(row.inicio).toLocaleDateString("pt-BR"))}`;
      },
    },
    {
      field: "fim",
      headerName: "Final do Serviço",
      flex: 1,
      valueGetter: (value, row) => {
        const inicio = new Date(row.inicio);
        inicio.setDate(inicio.getDate() + row.dias);
        return inicio.toLocaleDateString("pt-BR");
      }

    },
    { field: "progresso", headerName: "Progesso", flex: 1, editable: true },
  ];



  const [search, setSearch] = useState("");

  const filteredRows = data.filter((row) =>
    [
      row.titulo,
      row.codigo,
    ]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
  );

  function QuickSearchToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter
          quickFilterParser={(searchInput) =>
            searchInput
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value !== "")
          }
        />
      </GridToolbarContainer>
    );
  }


  return (
    <>
      {create && <CreateNew />}
      {edit && <EditItem item={edit} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">
            Cronograma da obra {obra.obra_name} - Fim em {new Date(obra.final).toLocaleDateString("pt-BR")}
          </h1>
          <div className="flex flex-row gap-4">
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
              onClick={() => {
                setCreate(true);
                setError(false);
              }}
            >
              <FaCirclePlus />
            </IconButton>
            <IconButton
              sx={{
                padding: 1,
                backgroundColor: "info.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "info.dark",
                },
              }}
              aria-label="recarregar"
              size="small"
              onClick={ReloadCronograma}
              disabled={loading}
            >
              <IoReload className={loading ? "animate-spin" : ""} />
            </IconButton>
          </div>
        </div>
        <hr className="col-span-2" />
        <div className="col-span-2">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar por nome"
          />
        </div>
        <Paper>
          <DataGrid
            initialState={{
              sorting: {
                sortModel: [{ field: "codigo", sort: "asc" | "desc" }],
              },
            }}

            rows={filteredRows}
            columns={columns}
            processRowUpdate={handleRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            components={{ Toolbar: QuickSearchToolbar }}
          />

        </Paper>
      </div>
    </>
  );

}