import { useState, useEffect } from "react";
import axios from "axios";
import { ConvertMes } from "./DespesasMes";
import { BarChart } from "@mui/x-charts/BarChart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function PaginaParaPDF() {
  const [data, setData] = useState([]);
  const [chartdata, setChartData] = useState([]);

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
      28
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/despesas/2/"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const Update = () => {
      const resultado = {};
      if (data.itens) {
        data.itens.forEach((item) => {
          if (!resultado[item.empresa]) {
            resultado[item.empresa] = {
              compras: 1,
              valor_total: parseFloat(item.valor),
            };
          } else {
            resultado[item.empresa]["compras"] += 1;
            resultado[item.empresa]["valor_total"] += parseFloat(item.valor);
          }
        });
        setChartData(resultado);
      }
    };
    Update();
  }, [data]);

  const total =
    data.itens?.reduce((acc, item) => acc + parseFloat(item.valor), 0) || 0;

  delete chartdata["VETOR CONSTRUÇÕES LTDA"];

  const top5v = Object.entries(chartdata)
    .sort((a, b) => b[1].valor_total - a[1].valor_total)
    .slice(0, 5);

  const top5q = Object.entries(chartdata)
    .sort((a, b) => b[1].compras - a[1].compras)
    .slice(0, 5);

  const nomesEmpresasc = top5v.map(([nome]) => nome);
  const nomesEmpresasq = top5q.map(([nome]) => nome);
  const nomesEmpresas1c = top5v.map(([nome]) =>
    nome.length > 10 ? nome.slice(0, 13) + "..." : nome
  );
  const nomesEmpresas1q = top5q.map(([nome]) =>
    nome.length > 10 ? nome.slice(0, 13) + "..." : nome
  );

  console.log(nomesEmpresasc);
  const valoresTotais = nomesEmpresasc.map(
    (nome) => chartdata[nome].valor_total
  );
  const quantidadesCompras = nomesEmpresasq.map(
    (nome) => chartdata[nome].compras
  );

  return (
    <div className="p-4 ">
      <button onClick={gerarPDF} className="bg-blue-500 text-white p-2 rounded">
        Gerar PDF
      </button>
      <div id="area-pdf" className="bg-white p-4 shadow-lg">
        <div className="grid grid-cols-2 grid-rows-2">
          <div className="row-span-2">
            <h1 className="font-bold text-3xl">
              Despesas de {ConvertMes(data.mes)}/{data.ano}
            </h1>
            <h1 className="font-bold text-2xl">
              Total:
              {" " +
                total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </h1>
          </div>
          <BarChart
            xAxis={[{ data: nomesEmpresas1c }]}
            series={[{ data: valoresTotais, label: "Valor Total" }]}
          />
          <BarChart
            xAxis={[{ data: nomesEmpresas1q }]}
            series={[{ data: quantidadesCompras, label: "Compras" }]}
            height={300}
          />
        </div>
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
                  <td className="border-b p-2">
                    {new Date(item.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="border-b p-2">{item.documento}</td>
                  <td className="border-b p-2">{item.titulo}</td>
                  <td className="border-b p-2">
                    {parseFloat(item.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="border-b p-2">
                    {String(item.descricao).toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
      </div>
    </div>
  );
}
