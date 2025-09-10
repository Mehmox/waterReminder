export default function Button({ symbol, onClick, className, width = 15, height = 15 }) {

    return (
        <button onClick={onClick} title="Add New" className={className + " group cursor-pointer outline-none duration-300"}>
            <svg xmlns="http://www.w3.org/2000/svg" width={width+"px"} height={height+"px"} viewBox="0 0 24 24"
                className="stroke-secondery fill-none group-hover:fill-primary-hover group-active:stroke-primary group-active:fill-secondery group-active:duration-0 duration-300">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5" />
                <path d="M8 12H16" strokeWidth="2.5" />
                {symbol === "+" && <path d="M12 16V8" strokeWidth="2.5" />}
            </svg>
        </button>);

}
