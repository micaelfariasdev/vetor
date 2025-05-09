import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaCirclePlus } from "react-icons/fa6";
import { useParams } from 'react-router-dom';

function CreateNew() {
  const [mes, setMes] = useState('1');
  const [ano, setAno] = useState('2025');

  const NewDesMesMes = async (e) => {
    e.preventDefault();
    console.log(mes, ano);

    const formData = new FormData();

    formData.append('author', 1);
    formData.append('mes', mes);
    formData.append('ano', ano);


    try {
      const response = await axios.post(`http://localhost:8000/api/despesas/`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      window.location.href = `/`;
    } catch (error) {
      console.error(error);
      setError('Não foi possível criar. Verifique suas credenciais.');
    }
  };

  return (
    <>
      <div className="w-full h-full bg-black/50 absolute z-15 flex items-center justify-center">
        <div className="w-fit h-fit bg-white rounded-xl relative z-18 p-5 flex flex-col gap-4 items-center">
          <h1 className="block text-lg font-semibold text-gray-700">Cadastrar</h1>
          <form onSubmit={NewDesMesMes} method="post" className="flex flex-col gap-2">
            <div>
              <label for="mes" className="block text-lg font-semibold text-gray-700">Mês:</label>
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
              <label for="ano" className="block text-lg font-semibold text-gray-700">Ano:</label>
              <select name="ano" id="ano" className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <button type="submit" className="bg-cyan-500 rounded-xl text-white p-2">Cadastrar</button>
          </form>

        </div>
      </div>
    </>
  )
}

export function DesMesMesDetail() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [create, setCreate] = useState(false);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/despesas/${id}`).then((response) => {
      setData(response.data);
    });
  }, []);
  console.log(data.itens);

  const columns = [
    { field: "empresa", headerName: "Fornecedor", flex: 4 },
    { field: "data", headerName: "Data", flex: 1,
      valueGetter: (value, row) => {
        return `${new Date(row.data).toLocaleDateString('pt-BR')}`;
      },
     },
    { field: "documento", headerName: "Documento", flex: 1 },
    { field: "titulo", headerName: "Título", flex: 1 },
    { field: "valor", headerName: "Valor", flex: 1,
      valueGetter: (value, row) => {
        return `R$ ${parseFloat(row.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      },
     },
    { field: "descricao", headerName: "Descrição", flex:2 },

    {
      field: "acoes",
      headerName: "Ações",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="h-full w-full text-xl flex items-center justify-center gap-2">
          <a
            href={`/despesasmes/${params.row.id}`}
            className="w-fit p-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-200"
          >
            <FaCirclePlus className="" />
          </a>
        </div >
      ),
    }
  ];

  const total = data.itens?.reduce((acc, item) => acc + parseFloat(item.valor), 0) || 0;
  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <>{create && <CreateNew />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">Despesas de {data.mes}/{data.ano}</h1>
          <FaCirclePlus
            className="text-4xl text-cyan-500 hover:text-cyan-800 cursor-pointer active:scale-90"
            onClick={() => setCreate(true)} />
        </div>
        <hr className="col-span-2" />
        <div className="col-span-2">
          <h1 className="font-bold text-2xl">
            Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h1>
        </div>
        <Paper  >
          <DataGrid
            rows={data.itens}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    </>
  );
}
