import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaCirclePlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import Dialog from "@mui/material/Dialog";

export function PaginaParaPDF() {
  const [data, setData] = useState([]);

  const gerarPDF = async () => {
    const elemento = document.getElementById("area-pdf");
    const canvas = await html2canvas(elemento);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const largura = pdf.internal.pageSize.getWidth();
    const altura = (canvas.height * largura) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, largura, altura);
    pdf.save("pagina.pdf");
  };
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/despesas/1").then((response) => {
      setData(response.data);
    });
  }, []);

  return (
    <div className="p-4">
      <div id="area-pdf" className="bg-white p-4 shadow-lg">
        <table>
          <thead>
            <tr>
                <th>Fornecedor</th>
<th>Data</th>
<th>Documento</th>
<th>Título</th>
<th>Valor</th>
<th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {data.map{(item) =>{
                
            }}}
            <tr>
              <td>asada</td>
              <td>asada</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={gerarPDF}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Baixar PDF
      </button>
    </div>
  );
}
