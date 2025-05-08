export function Menu(){
    return(
        <>
        <div className="h-screen bg-gray-100 min-w-[260px]  flex flex-col items-center p-2 pt-4 row-span-2">
        <h1 className="font-bold text-[20px]">Vetor Construções</h1>
        <nav className="w-full">
            <ul className="flex flex-col gap-2 mt-4 text-center font-medium text-[16px]">
                <li className="w-full p-2 rounded-md hover:bg-[#E2F4FF]">Home</li>
                <li className="w-full p-2 rounded-md hover:bg-[#E2F4FF]">Obras</li>
                <li className="w-full p-2 rounded-md hover:bg-[#E2F4FF]">Financeiro</li>
                <li className="w-full p-2 rounded-md hover:bg-[#E2F4FF]">Funcionários</li>
                <li className="w-full p-2 rounded-md hover:bg-[#E2F4FF]">Empresas</li>
            </ul>
        </nav>
        </div>
        </>
    )

}

export function MenuTop(){
    return(
        <div className="flex flex-row-reverse items-center gap-4 px-10 border-b-2 border-gray-200">
            <a href="">Perfil</a>
            <a href="">Mensagems</a>
        </div>
    )
}