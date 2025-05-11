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

export function DesMesMesDetail() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState();
  const [error, setError] = useState(false);

  function EditItem(item) {
    const [descricao, setDescricao] = useState("");
    const [DataItem, setDataItem] = useState("");

    useEffect(() => {
      axios
        .get(`http://127.0.0.1:8000/api/despesasitens/${item["item"]}/`)
        .then((response) => {
          setDataItem(response.data);
          setDescricao(response.data.descricao);
        });
    }, []);

    const EditItemSave = async (e) => {
      e.preventDefault();

      const formData = new FormData();

      formData.append("descricao", descricao);
      formData.append("Object", DataItem.despesas_mes);

      try {
        const response = await axios.patch(
          `http://127.0.0.1:8000/api/despesasitens/${item["item"]}/`,
          formData
        );

        window.location.reload();
      } catch (error) {
        console.error(error);
        setError("Não foi possível editar. Verifique suas credenciais.");
      }
    };
    const handleClose = () => {
      setEdit(false);
    };
    return (
      <>
        <Dialog
          open={edit}
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          keepMounted
        >
          <div className="p-5 gap-4 flex flex-col">
            <div className="w-full flex flex-row justify-between text-3xl">
              <h1 className="block text-lg font-semibold text-gray-700">
                Editar
              </h1>
              <IoIosCloseCircle
                className="text-red-500 hover:text-red-200 cursor-pointer"
                onClick={() => setEdit(false)}
              />
            </div>
            <form
              onSubmit={EditItemSave}
              method="post"
              className="flex flex-col gap-2"
            >
              <div>
                <strong>Fornecedor</strong>
                <p>{DataItem.empresa}</p>
              </div>
              <div>
                <strong>Data</strong>
                <p>{new Date(DataItem.data).toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <strong>Documento</strong>
                <p>{DataItem.documento}</p>
              </div>
              <div>
                <strong>Título</strong>
                <p>{DataItem.titulo}</p>
              </div>
              <div>
                <strong>Valor</strong>
                <p>
                  {parseFloat(DataItem.valor).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <label
                  for="idescricao"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Descrição
                </label>
                <input
                  type="text"
                  name="descricao"
                  id="idescricao"
                  defaultValue={DataItem.descricao}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-cyan-500 rounded-xl text-white p-2 cursor-pointer"
              >
                Editar
              </button>
            </form>
          </div>
        </Dialog>
      </>
    );
  }

  function CreateNew() {
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [errors] = useState([]);

    const UpdateItens = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (file) {
        if (file.name.split(".").pop() !== "xlsx") {
          errors.push("Formato de arquivo inválido. Use .xlsx");
          console.log(errors);
          setFile(null);
          setLoading(false);
          throw new Error("Formato de arquivo inválido. Use .xlsx");
        }
      }
      const formData = new FormData();

      formData.append("file", file);
      formData.append("Object", id);

      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/excel/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

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
                  Enviar Relatório
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
    axios.get(`http://127.0.0.1:8000/api/despesas/${id}`).then((response) => {
      setData(response.data);
    });
  }, []);

  const columns = [
    { field: "empresa", headerName: "Fornecedor", minWidth: 300, flex: 0 },
    {
      field: "data",
      headerName: "Data",
      flex: 1,
      valueGetter: (value, row) => {
        return `${String(new Date(row.data).toLocaleDateString("pt-BR"))
          .split("/")
          .slice(0, 2)
          .join("/")}`;
      },
    },
    { field: "documento", headerName: "Documento", flex: 1 },
    { field: "titulo", headerName: "Título", flex: 1 },
    {
      field: "valor",
      headerName: "Valor",
      flex: 1,
      valueGetter: (value, row) => {
        return `R$ ${parseFloat(row.valor).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`;
      },
    },
    {
      field: "descricao",
      headerName: "Descrição",
      flex: 2,
      valueGetter: (value, row) => {
        return `${String(row.descricao).toUpperCase()}`;
      },
    },

    {
      field: "acoes",
      headerName: "",
      maxWidth: 50,
      flex: 0,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="h-full w-full text-xl flex items-center justify-center gap-2">
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
              setEdit(params.row.id);
            }}
          >
            <FaEdit />
          </IconButton>
        </div>
      ),
    },
  ];

  const total =
    data.itens?.reduce((acc, item) => acc + parseFloat(item.valor), 0) || 0;
  const paginationModel = { page: 0, pageSize: 10 };

  const [search, setSearch] = useState("");

  const filteredRows = (data.itens || []).filter(
    (row) =>
      row.empresa?.toLowerCase().includes(search.toLowerCase()) ||
      row.descricao?.toLowerCase().includes(search.toLowerCase()) ||
      row.documento?.toLowerCase().includes(search.toLowerCase()) ||
      row.titulo?.toLowerCase().includes(search.toLowerCase())
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

  function gerarPDF() {
    if (!data || !data.itens) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(
      `Relatório de Despesas ${ConvertMes(data.mes)}/${data.ano}`,
      14,
      20
    );

    doc.setFontSize(12);
    doc.text(
      `Total: R$ ${data.itens
        .reduce((acc, item) => acc + parseFloat(item.valor), 0)
        .toLocaleString("pt-BR")}`,
      14,
      26.5
    );

    const rows = data.itens.map((item) => [
      item.empresa,
      new Date(item.data).toLocaleDateString("pt-BR"),
      item.documento,
      item.titulo,
      parseFloat(item.valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      String(item.descricao).toUpperCase(),
    ]);

    autoTable(doc, {
      head: [["Empresa", "Data", "Documento", "Título", "Valor", "Descrição"]],
      body: rows,
      startY: 30,
      styles: {
        fontSize: 8,
      },
    });

    doc.save(`relatorio-${ConvertMes(data.mes)}-${data.ano}.pdf`);
  }

  return (
    <>
      {create && <CreateNew />}
      {edit && <EditItem item={edit} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">
            Despesas de {ConvertMes(data.mes)}/{data.ano}
          </h1>
          <div className="flex flex-row gap-4">
            <IconButton
              sx={{
                padding: 1,
                backgroundColor: "success.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "success.dark",
                },
              }}
              aria-label="deletar"
              size="small"
              onClick={gerarPDF}
            >
              <FaFileDownload />
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
              aria-label="deletar"
              size="small"
              onClick={() => {
                setCreate(true);
                setError(false);
              }}
            >
              <FaCirclePlus />
            </IconButton>
          </div>
        </div>
        <hr className="col-span-2" />
        <div className="col-span-2">
          <h1 className="font-bold text-2xl">
            Total: R${" "}
            {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h1>
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
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: { paginationModel },
              sorting: {
                sortModel: [{ field: "empresa", sort: "asc" }],
              },
            }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            components={{ Toolbar: QuickSearchToolbar }}
          />
        </Paper>
      </div>
    </>
  );
}
