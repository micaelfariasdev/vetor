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

export function CronogramaDetail() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [obra, setObra] = useState([]);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState();
  const [error, setError] = useState(false);


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
      console.log(response.data);
    });
  }, []);

  const columns = [
    { field: "codigo", headerName: "Código", minWidth: 300, flex: 0 },
    { field: "titulo", headerName: "Serviço", minWidth: 300, flex: 0 },
    { field: "dias", headerName: "Dias de Serviço", flex: 1 },
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
        return `${String(new Date(row.fim).toLocaleDateString("pt-BR"))}`;
      },
    },
    { field: "progesso", headerName: "Progesso", flex: 1 },
  ];



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


  return (
    <>
      {create && <CreateNew />}
      {edit && <EditItem item={edit} />}
      <div className="w-full h-full grid grid-rows-[auto_auto_auto_1fr] gap-4 p-4 grid-cols-1">
        <div className="grid grid-cols-[1fr_auto] items-center ">
          <h1 className="font-bold text-3xl">
            Cronograma da obra {obra.obra_name} - Finalizada em {obra.final}
          </h1>
          <div className="flex flex-row gap-4">
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
            rows={data}
            columns={columns}
            initialState={{
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
