export function DashBoardHead() {
  return (
    <div>
      <div className="mt-4 flex flex-nowrap justify-between items-center">
        <div>
          <h1 className="font-bold text-xl tracking-wide">Bonjour, Liam Gallagher ! 👋</h1>
          <p className="mt-1 text-gray-600 text-sm tracking-tight">Que recherchez-vous aujourd'hui ?</p>
        </div>
        <p>⚠ Filtre</p>
      </div>

      <div className="mt-5 flex flex-nowrap justify-between">
        <h2 className="font-bold text-xl">Catalogue des graphiques</h2>
        <div>
          <p className="inline">⚠ 2024</p>
          <p className="inline">⚠ Bénéficiaire</p>
        </div>
      </div>
    </div>
  )
}
