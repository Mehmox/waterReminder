import Button from "./Button.jsx"

export default function Input({ messageStart, ref, messageEnd, special, save, ...props }) {

    function handleChange(target, action) {
        if (+target.current.value + action >= 0 && +target.current.value + action < 100)
            target.current.value = +target.current.value + action
    }

    const input = <input className="text-center underline w-7"
        onChange={(e) => {
            if (e.type === "number") {
                let value = +e.target.value;
                if (value > 99) e.target.value = 99;
                if (value < 0 || value === undefined) e.target.value = 0;
            }

            if (save) save();
        }}
        placeholder="X"
        ref={ref}
        {...props}
    />

    return <div className="p text-secondery my-2 text-xl">
        <label>
            {messageStart}
            {props.type === "number" &&
                <Button onClick={() => {
                    handleChange(ref, -1);
                    save && save();
                }} symbol="-"
                />}
        </label>

        {props.type === "checkbox" ? (
            <label className="container">
                {input}
                <div className="checkmark"></div>
            </label>
        ) : input}

        <label>
            {props.type === "number" &&
                <Button onClick={() => {
                    handleChange(ref, 1);
                    save && save();
                }} symbol="+"
                />}
            {messageEnd}
        </label>
        {special}
    </div>
}