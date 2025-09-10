import { useEffect, useState } from "react"

export default function App() {
    const [config, setConfig] = useState();

    useEffect(() => {
        window.Electron.setupNotiConfig()
            .then((config) => setConfig(config));

        window.Electron.changeConfig((config) => setConfig(config))
    }, []);

    return <section className="w-screen h-screen flex flex-col border-r-2 bg-primary relative rounded-2xl ">
        <header className="flex justify-between items-center rounded-2xl">
            <div className="flex items-center text-xl">
                <img className="w-5 h-5 ml-1" rel="icon" src="favicon.ico" alt="" />
                <h2 className="ml-1">Notification</h2>
            </div>
            <div>
                <button className="w-12 h-full bg-primary hover:bg-primary-hover text-2xl text-center border-0 rounded-2xl"
                    onClick={window.Electron.closeNotification}>X</button >
            </div>
        </header>

        <div className="flex flex-col items-center">
            <img className="w-32 h-32" src="cup.png" alt="" />

            <h1 className="text-2xl text-secondery">Time to drink {config && config.cup} cup of water</h1>

            <p className="overflow-clip text-secondery text-2xl">{config && config.message}</p>
        </div>
    </section>
}