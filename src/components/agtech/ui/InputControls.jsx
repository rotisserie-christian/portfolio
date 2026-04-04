import { FaMinus, FaPlus } from 'react-icons/fa';

const InputControls = ({
    label,
    value,
    formattedValue,
    min,
    max,
    step,
    onChange,
    onMinus,
    onPlus
}) => {
    return (
        <div className="flex flex-col items-center w-full justify-center gap-2 mb-5">
            <div className="flex justify-between items-end w-full">
                <label className="text-base ubuntu-bold tracking-wide text-neutral-content/70 ml-1">{label}</label>
                <span className="text-base courier-new font-semibold text-neutral-content/70">{formattedValue}</span>
            </div>

            <div className='flex items-center justify-between gap-6 w-full mt-2'>
                <FaMinus
                    className='text-cyan-200/90 cursor-pointer hover:text-cyan-100 transition-colors'
                    onClick={onMinus}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="range range-xs w-full text-white/60"
                    style={{ "--range-shdw": "var(--fallback-n)" }}
                />
                <FaPlus
                    className='text-cyan-200/90 cursor-pointer hover:text-cyan-100 transition-colors'
                    onClick={onPlus}
                />
            </div>
        </div>
    );
};

export default InputControls;
