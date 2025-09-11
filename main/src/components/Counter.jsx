import Button from "./Button.jsx";

export default function Counter({ config, counter, _SetCounter, _ResetCounter }) {

    return <div className="text-secondery mt-4">
        {config && (config.limit - counter > -1) && <h3 className="text-3xl text-center">{config.limit - counter} left for today!</h3>}

        <div className="flex flex-col">
            <div className="flex justify-center items-center">
                <Button onClick={() => _SetCounter(1)} symbol="-" className="mx-2" width="25" height="25"/>
                <button onClick={_ResetCounter} className="uppercase"> reset </button>
                <Button onClick={() => _SetCounter(-1)} symbol="+" className="mx-2" width="25" height="25" />
            </div>
        </div>
    </div>
}