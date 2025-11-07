import { useEffect, useRef, useState } from "react";
import Input from "./Input";
import Timer from "./Timer";
import Counter from "./Counter";

export default function Settings() {
    const clickSound = new Audio(`assets/click_sound.mp3`);
    const notiSound = new Audio(`assets/noti_sound.mp3`);
    clickSound.volume = 0.2;
    notiSound.volume = 0.4;

    const refs = {
        noti_alwaysOnTop: useRef(),
        noti_limit: useRef(),
        noti_cup: useRef(),
        noti_cooldown: useRef(),
        noti_timeType: useRef(),
        noti_message: useRef(),
    }

    const [config, setConfig] = useState(null);
    const [counter, setCounter] = useState();
    const [time, setTime] = useState({ time: undefined, toggle: false });

    function getObjet() {
        return {
            alwaysOnTop: refs.noti_alwaysOnTop.current.checked,
            limit: +refs.noti_limit.current.value,
            cup: refs.noti_cup.current.value,
            cooldown: +refs.noti_cooldown.current.value,
            timeType: +refs.noti_timeType.current.value,
            message: refs.noti_message.current.value
        }
    }

    function itShouldWork() {
        if (refs.noti_cooldown.current) {
            setTime((pre) => {
                const time = refs.noti_cooldown.current.value * refs.noti_timeType.current.value

                if (pre.time === time) return { time: pre.time, toggle: !pre.toggle }

                return { time, toggle: pre.toggle }
            });
        }

    }

    useEffect(() => {
        window.Electron && window.Electron.setupMainConfig()
            .then((config) => setConfig(config));

        window.Electron && window.Electron.setupMainCounter()
            .then((counter) => setCounter(counter));

        window.Electron && window.Electron.changeCounter((value) => setCounter(value));
    }, [])

    useEffect(itShouldWork, [counter]);

    function SaveConfig() {
        clickSound.play();

        const config = getObjet();

        setConfig(config)

        window.Electron && window.Electron.saveConfig(config);

        itShouldWork();
    }

    function _SetCounter(action) {
        clickSound.play();

        setCounter(pre => {
            console.log(pre + action)
            console.log(config.limit)
            if (pre + action <= config.limit && pre + action >= 0) {
                window.Electron && window.Electron.saveCounter(pre + action);
                return pre + action
            } else {
                window.Electron && window.Electron.saveCounter(pre);
                return pre
            }
        });
    }

    function _ResetCounter() {
        clickSound.play();

        setCounter(0);

        window.Electron && window.Electron.saveCounter(0);
    }

    function format(time) {
        if (!refs.noti_cooldown.current) return time
        return time + (refs.noti_cooldown.current.value > 1 ? "s" : "")
    }

    const retu = <div className="flex flex-col">
        <Input
            type="checkbox"
            messageStart="Notifications alwaysOnTop: "
            save={SaveConfig}
            ref={refs.noti_alwaysOnTop}
            defaultChecked={config && config.alwaysOnTop}
        />

        <Input
            type="number"
            messageStart=""
            save={SaveConfig}
            ref={refs.noti_limit}
            messageEnd=" notification per day."
            defaultValue={config && +config.limit}
        />

        <Input
            type="number"
            messageStart=""
            save={SaveConfig}
            ref={refs.noti_cup}
            messageEnd=" cup of water every notification."
            defaultValue={config && +config.cup}
        />

        <Input
            type="number"
            messageStart="Notify me every "
            save={SaveConfig}
            ref={refs.noti_cooldown}
            special={<select ref={refs.noti_timeType}
                onChange={SaveConfig}
                value={config?.timeType}>
                <option value={1000}>{format("second")}.</option>
                <option value={60000}>{format("minute")}.</option>
                <option value={60000 * 60}>{format("hour")}.</option>
            </select>}
            defaultValue={config && config.cooldown}
        />

        <div className="p text-secondery">Make a custom message to display on notification</div>

        <textarea className="resize-none bg-white border-2 border-black text-secondery"
            onChange={SaveConfig}
            maxLength={40}
            rows={1}
            spellCheck="false"
            ref={refs.noti_message}
            defaultValue={config && config.message}
        />

        <Counter config={config} counter={counter} _SetCounter={_SetCounter} _ResetCounter={_ResetCounter} />

        <Timer time={time} on_off={config && (config.limit - counter > 0)} sound={notiSound} />
    </div>

    if (!config) return <h1>Somethink went wrong...</h1>
    return retu;
}