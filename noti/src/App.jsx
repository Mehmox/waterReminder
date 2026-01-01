import { useEffect, useState } from "react";

export default function App() {
    const [config, setConfig] = useState();
    const [counter, setCounter] = useState();

    function handleclose() {
        setCounter(pre => {
            return pre + 1;
        });
        window.Electron.closeNotification();
    }

    useEffect(() => {
        window.Electron.setupNotiConfig()
            .then(config => setConfig(config));

        window.Electron && window.Electron.setupNotiCounter()
            .then(counter => setCounter(counter));

        window.Electron.changeConfig((config) => setConfig(config));
    }, []);

    return <section className="w-screen h-screen flex flex-col border-r-2 bg-primary relative">
        <header className="flex justify-between items-center rounded-2xl">
            <div className="flex items-center text-xl">
                <img className="w-5 h-5 ml-1" rel="icon" src="favicon.ico" alt="" />
                <h2 className="ml-1">Notification</h2>
            </div>
            <div>
                <button className="w-12 h-full bg-primary hover:bg-primary-hover text-2xl text-center border-0"
                    onClick={handleclose}>X</button >
            </div>
        </header>

        <div className="flex flex-col items-center">
            <img className="w-32 h-32" src="cup.png" alt="" />

            <h2 className="text-2xl text-secondery">Drink {config && config.cup} cup of water</h2>

            <h2 className="text-2xl text-secondery">{(config && counter) && (config.limit - counter)} cup left</h2>
        </div>
    </section>
}