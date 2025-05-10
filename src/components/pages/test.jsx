import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState, useEffect } from "react";
import axios from "axios";

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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/despesas/1/"
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div id="area-pdf" className="bg-white p-4 shadow-lg">
        {data.itens && data.itens.length > 0 ? (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-left">Fornecedor</th>
                <th className="border-b p-2 text-left">Data</th>
                <th className="border-b p-2 text-left">Documento</th>
                <th className="border-b p-2 text-left">Título</th>
                <th className="border-b p-2 text-left">Valor</th>
                <th className="border-b p-2 text-left">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {data.itens.map((item) => (
                <tr key={item.id}>
                  <td className="border-b p-2">{item.empresa}</td>
                  <td className="border-b p-2">{item.data}</td>
                  <td className="border-b p-2">{item.documento}</td>
                  <td className="border-b p-2">{item.titulo}</td>
                  <td className="border-b p-2">{item.valor}</td>
                  <td className="border-b p-2">{item.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
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
