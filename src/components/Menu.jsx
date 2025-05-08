import { FaHelmetSafety, FaPeopleGroup } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { IoIosConstruct, IoIosBusiness, IoIosArrowForward } from "react-icons/io";
import { MdMonetizationOn } from "react-icons/md";
import { useState, useEffect } from "react";

function MenuItem({ icon: Icon, label, send, current, onClick, many=false }) {
    const active = current === send
    return (
      <div
        onClick={() => onClick(send)}
        className={`w-full pl-5 py-2 gap-2 rounded-md cursor-pointer grid grid-cols-[24px_1fr_24px] grid-rows-1 items-center
          ${active ? "bg-[#E2F4FF]" : "hover:bg-[#E2F4FF]"}`}
      >
        <Icon className="w-full" />
        <p className="self-start">{label}</p>
        {many && <IoIosArrowForward className={current == 'financeiro' ? 'rotate-90' : 'rotate-0'} />}

      </div>
    )
  }


export function Menu({ onNavigate }) {
    const [showSubMenu, setSubMenu] = useState("");

    useEffect(() => {
        onNavigate(showSubMenu)
        console.log(showSubMenu)
    })

    return (
        <>
            <div className="h-screen bg-gray-100 min-w-[260px]  flex flex-col items-center p-2 pt-4 row-span-2">
                <h1 className="font-bold text-[20px]">Vetor Construções</h1>
                <nav className="w-full flex flex-col gap-2 mt-4 text-left font-medium text-lg">
                    <MenuItem icon={FaHome} label="Home" send='home' current={showSubMenu} onClick={setSubMenu} />
                    <MenuItem icon={FaHelmetSafety} label="Obras" send='obras' current={showSubMenu} onClick={setSubMenu} />
                    <MenuItem icon={MdMonetizationOn} label="Financeiro" send='financeiro' current={showSubMenu} onClick={setSubMenu} many={true} />
                    <MenuItem icon={FaHome} label="Home" send='home' current={showSubMenu} onClick={setSubMenu} />
                    <MenuItem icon={FaHome} label="Home" send='home' current={showSubMenu} onClick={setSubMenu} />
                    <MenuItem icon={FaHome} label="Home" send='home' current={showSubMenu} onClick={setSubMenu}  />
                                                            <div
                        onClick={() => setSubMenu("financeiro")}
                        className="w-full pl-5 py-2 gap-2 rounded-md hover:bg-[#E2F4FF] cursor-pointer grid grid-cols-[24px_1fr_24px] grid-rows-1 items-center">
                        <MdMonetizationOn className="w-full" />
                        <p className="self-start">
                            Financeiro
                        </p>
                    </div>
                    <div
                        onClick={() => setSubMenu("funcionario")}
                        className="w-full pl-5 py-2 gap-2 rounded-md hover:bg-[#E2F4FF] cursor-pointer grid grid-cols-[24px_1fr_24px] grid-rows-1 items-center">
                        <FaPeopleGroup className="w-full" />
                        <p className="self-start">
                            Funcionários
                        </p>
                    </div>
                    <div
                        onClick={() => setSubMenu("empresas")}
                        className="w-full pl-5 py-2 gap-2 rounded-md hover:bg-[#E2F4FF] cursor-pointer grid grid-cols-[24px_1fr_24px] grid-rows-1 items-center">
                        <IoIosBusiness className="w-full" />
                        <p className="self-start">
                            Empresas
                        </p>
                    </div>
                    <div
                        onClick={() => setSubMenu("engenharia")}
                        className="w-full pl-5 py-2 gap-2 rounded-md hover:bg-[#E2F4FF] cursor-pointer grid grid-cols-[24px_1fr_24px] grid-rows-1 items-center">
                        <IoIosConstruct className="w-full" />
                        <p className="self-start">
                            Engenharia
                        </p>
                    </div>

                </nav>
            </div>
        </>
    )

}

export function MenuTop() {
    return (
        <div className="flex flex-row-reverse items-center gap-4 px-10 border-b-2 border-gray-200">
            <a href="">Perfil</a>
            <a href="">Mensagems</a>
        </div>
    )
}