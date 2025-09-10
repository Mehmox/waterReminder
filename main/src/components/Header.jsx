const version = process.env.REACT_APP_VERSION;

export default function Header() {
    return <header className="flex justify-between items-center rounded-2xl">
        <div className="flex items-center rounded-2xl">
            <img className="w-5 h-5" rel="icon" src="favicon.ico" alt="" />
            <h2 className="ml-1">Settings <span className="text-black text-sm">v{version}</span></h2>
        </div>
        {window.Electron && <button className="w-12 h-full bg-primary text-4xl hover:bg-primary-hover text-center border-0 rounded-2xl"
            onClick={window.Electron.closeSettings}>-</button>}
    </header>
}