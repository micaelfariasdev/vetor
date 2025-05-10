import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaCirclePlus } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";
import Dialog from "@mui/material/Dialog";

export function DesMesMesDetail() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState();

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

    const UpdateItens = async (e) => {
      e.preventDefault();

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
        console.error(error);
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
                <label
                  for="iupdate"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Arquivo:
                </label>
                <input
                  type="file"
                  name="update"
                  id="iupdate"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button
                type="submit"
                className="bg-cyan-500 rounded-xl text-white p-2 cursor-pointer"
              >
                Upload
              </button>
            </form>
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
    { field: "empresa", headerName: "Fornecedor", flex: 4 },
    {
      field: "data",
      headerName: "Data",
      flex: 1,
      valueGetter: (value, row) => {
        return `${new Date(row.data).toLocaleDateString("pt-BR")}`;
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
      headerName: "Ações",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="h-full w-full text-xl flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setEdit(params.row.id);
            }}
            className="w-fit p-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-200"
          >
            <FaCirclePlus className="" />
          </button>
        </div>
      ),
    },
  ];

  const total =
    data.itens?.reduce((acc, item) => acc + parseFloat(item.valor), 0) || 0;
  const paginationModel = { page: 0, pageSize: 20 };
  return (
    <>
      {create && <CreateNew />}
      {edit && <EditItem item={edit} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">
            Despesas de {data.mes}/{data.ano}
          </h1>
          <FaCirclePlus
            className="text-4xl text-cyan-500 hover:text-cyan-800 cursor-pointer active:scale-90"
            onClick={() => setCreate(true)}
          />
        </div>
        <hr className="col-span-2" />
        <div className="col-span-2">
          <h1 className="font-bold text-2xl">
            Total: R${" "}
            {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h1>
        </div>
        <Paper>
          <DataGrid
            rows={data.itens}
            columns={columns}
            initialState={{
              pagination: { paginationModel },
              sorting: {
                sortModel: [{ field: "empresa", sort: "asc" }],
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
