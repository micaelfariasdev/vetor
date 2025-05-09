import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";

export function DesMesMes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/despesas/").then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "author", headerName: "Usuario", width: 130 },
    {
      field: "criado_em",
      headerName: "Criado Em",
      width: 130,
      valueGetter: (value, row) => {
        return `${new Date(row.criado_em).toLocaleDateString("pt-BR")}`;
      },
    },
    {
      field: "atualizado_em",
      headerName: "Última Atualização",
      width: 130,
      valueGetter: (value, row) => {
        return `${new Date(row.atualizado_em).toLocaleDateString("pt-BR")}`;
      },
    },
    {
      field: "referencia",
      headerName: "Mês",
      width: 160,
      valueGetter: (value, row) => {
        return `${row.mes}/ ${row.ano}`;
      },
    },
    {
      field: "valor_total",
      headerName: "Total (R$)",
      width: 130,
      valueGetter: (value, row) =>{
        return row.itens.reduce((acc, item) => acc + parseFloat(item.valor), 0).toFixed(2)
          }
    },
  ];

  const rows = data;

  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <>
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4">
        <h1 className="font-bold text-3xl">Despesas Mês a Mês</h1>
        <hr />
        <div></div>
        <Paper sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={rows}
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
