import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaCirclePlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import Dialog from "@mui/material/Dialog";

export function DesMesMes() {
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);

  function CreateNew() {
    const [mes, setMes] = useState("1");
    const [ano, setAno] = useState("2025");

    const NewDesMesMes = async (e) => {
      e.preventDefault();
      console.log(mes, ano);

      const formData = new FormData();

      formData.append("author", 1);
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

        window.location.href = `/`;
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
          <div
          className="p-5 gap-4 flex flex-col">
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
              className="grid grid-cols-2 gap-2 gap-x-4"
            >
              <div>
                <label
                  for="mes"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Mês:
                </label>
                <select
                  name="mes"
                  id="mes"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                >
                  <option value="01">Janeiro</option>
                  <option value="02">Fevereiro</option>
                  <option value="03">Março</option>
                  <option value="04">Abril</option>
                  <option value="05">Maio</option>
                  <option value="06">Junho</option>
                  <option value="07">Julho</option>
                  <option value="08">Agosto</option>
                  <option value="09">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>
              </div>

              <div>
                <label
                  for="ano"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Ano:
                </label>
                <select
                  name="ano"
                  id="ano"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-cyan-500 rounded-xl cursor-pointer text-white p-2 w-full col-span-2"
              >
                Cadastrar
              </button>
            </form>
          </div>
        </Dialog>
      </>
    );
  }

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/despesas/").then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 10 },
    { field: "username", headerName: "Usuario", flex: 6 },
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
        return `${row.mes}/ ${row.ano}`;
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
      field: "acoes",
      headerName: "Ações",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="h-full w-full text-md flex items-center justify-center gap-2">
          <a
            href={`/despesasmes/${params.row.id}`}
            className="w-fit p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-200"
          >
            <FaEdit className="" />
          </a>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 20 };
  return (
    <>
      {create && <CreateNew />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">Despesas Mês a Mês</h1>
          <FaCirclePlus
            className="text-4xl text-cyan-500 hover:text-cyan-800 cursor-pointer active:scale-90"
            onClick={() => setCreate(true)}
          />
        </div>
        <hr className="col-span-2" />
        <div className="col-span-2"></div>
        <Paper>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: { paginationModel },
            }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    </>
  );
}
