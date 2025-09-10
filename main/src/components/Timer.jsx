import { useEffect, useState } from "react";

function format(time) {
    function check(time) {
        if (time === 0) return "00"
        if (time < 10) return `0${time}`
        return time
    }
    let minute = Math.floor(time / 60)
    time -= minute * 60;

    let hour = Math.floor(minute / 60)
    minute -= hour * 60;

    if (!hour && !minute && !time) return `00:00:00`
    return `${check(hour)}:${check(minute)}:${check(time)}`
}

export default function Timer({ time, on_off, sound }) {
    const [countDown, setCountdown] = useState();

    useEffect(() => {
        if (!time.time) return

        setCountdown(time.time / 1000);

        if (on_off) {
            const Interval = setInterval(() => {
                setCountdown(pre => {
                    if (pre - 1 < 1) {
                        clearInterval(Interval)
                        window.Electron && window.Electron.showNoti();
                        sound.play();
                        return 0
                    }
                    return pre - 1;
                })
            }, 1000);
            return () => clearInterval(Interval)
        }
    }, [time.time, time.toggle]);

    return <div className="mt-8">
        <h3 className="text-3xl text-center">Timer</h3>
        <h2 className="text-5xl text-center">{format(countDown)}</h2>
    </div>
}