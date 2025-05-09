import { FaHelmetSafety, FaPeopleGroup } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import {
  IoIosConstruct,
  IoIosBusiness,
  IoIosArrowForward,
} from "react-icons/io";
import { MdMonetizationOn } from "react-icons/md";
import { useState, useEffect } from "react";

function MenuItem({ icon: Icon, label, send, current, onClick, many = false }) {
  const active = current === send;

  return (
    <div
      onClick={() => onClick(send)}
      className={`w-full pl-5 py-2 gap-2 rounded-md cursor-pointer grid grid-cols-[24px_1fr_24px] grid-rows-1 items-center
          ${active ? "bg-[#E2F4FF]" : "hover:bg-[#E2F4FF]"}`}
      id={send}
    >
      <Icon className="w-full" />
      <p className="self-start">{label}</p>
      {many && (
        <IoIosArrowForward className={active ? "rotate-90" : "rotate-0"} />
      )}
    </div>
  );
}

function MenuItemSub({
  icon: Icon,
  label,
  current,
  onClick,
  many = false,
  itens = false,
}) {
  const [page, setiPage] = useState("");
  const [hover, setHover] = useState(false);
  const active = page === current;
  return (
    <div
      className={`overflow-hidden w-full pl-5 py-2 gap-x-2 rounded-md cursor-pointer grid grid-cols-[24px_1fr_24px] grid-rows-1 items-center
            ${active ? "bg-[#E2F4FF] gap-y-2" : "hover:bg-[#E2F4FF]"}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Icon className="w-full" />
      <p className="self-start">{label}</p>
      {many && (
        <IoIosArrowForward
          className={hover || active ? "rotate-90" : "rotate-0"}
        />
      )}
      {itens && <nav
       className={`flex flex-col text-sm items-start not-only:gap-1 w-full col-start-2 col-span-2 transition-all duration-300 ease-in-out
        ${hover || active ? "max-h-96" : "max-h-0"}
      `}
      >
        {itens.map((i) => (
          <button
            key={i.label}
            onClick={() => {
              setiPage(i.send);
              onClick(i.send);
            }}
            className={`gap-2 w-full pl-1 text-left rounded-md cursor-pointer overflow-hidden
                ${hover || active ? "visible" : "hidden"}
                ${current === i.send ? "bg-[#a6d4f0]" : "hover:bg-[#a6d4f0]"}
                `}
          >
            {i.label}
          </button>
        ))}
      </nav>}
    </div>
  );
}

export function Menu({ onNavigate }) {
  const [showPage, setPage] = useState("home");

  useEffect(() => {
    onNavigate(showPage);
  });

  return (
    <>
      <div className="h-screen bg-gray-100 min-w-[260px]  flex flex-col items-center p-2 pt-4 row-span-2">
        <h1 className="font-bold text-[20px]">Vetor Construções</h1>
        <nav className="w-full flex flex-col gap-2 mt-4 text-left font-medium text-lg">
          <MenuItem
            icon={FaHome}
            label="Home"
            send="home"
            current={showPage}
            onClick={setPage}
          />
          <MenuItem
            icon={FaHelmetSafety}
            label="Obras"
            send="obras"
            current={showPage}
            onClick={setPage}
          />
          <MenuItemSub
            icon={MdMonetizationOn}
            label="Financeiro"
            current={showPage}
            onClick={setPage}
            many={true}
            itens={[
              {
                label: "Títulos a Pagar",
                send: "titulo-pagar",
              },
              {
                label: "Medições a Pagar",
                send: "med-pagar",
              },
              {
                label: "Medições a Receber",
                send: "med-receber",
              },
            ]}
          />
          <MenuItem
            icon={FaPeopleGroup}
            label="Funcionários"
            send="funcionarios"
            current={showPage}
            onClick={setPage}
          />
          <MenuItem
            icon={IoIosBusiness}
            label="Empresas"
            send="empresas"
            current={showPage}
            onClick={setPage}
          />
          <MenuItemSub
            icon={IoIosConstruct}
            label="Engenharia"
            current={showPage}
            onClick={setPage}
            many={true}
            itens={[
                {
                  label: "Despesas Mês a Mês",
                  send: "desp-mes-mes",
                },
              
              ]}
          />
        </nav>
      </div>
    </>
  );
}

export function MenuTop() {
  return (
    <div className="flex flex-row-reverse items-center gap-4 px-10 border-b-2 border-gray-200">
      <a href="">Perfil</a>
      <a href="">Mensagems</a>
    </div>
  );
}
