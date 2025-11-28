import React, { useState, useEffect } from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  unit: string;
  step?: number;
}

const InputSlider: React.FC<Props> = ({ label, value, onChange, min, max, unit, step = 1 }) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  // Sync internal state with prop value when prop changes externally
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);

    const num = parseFloat(newVal);
    // Update parent only if it's a valid non-negative number
    if (!isNaN(num) && num >= 0) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const num = parseFloat(inputValue);
    if (isNaN(num)) {
      setInputValue(value.toString());
    } else {
      setInputValue(num.toString());
      onChange(num);
    }
  };

  // Calculate percentage for gradient background
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="mb-8 last:mb-0">
      {/* Header Row: Label & Input */}
      <div className="flex justify-between items-end mb-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </label>
        
        <div 
          className={`
            relative flex items-center bg-slate-900 border rounded-lg px-3 py-1.5 transition-all duration-200
            ${isFocused 
              ? 'border-blue-500 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10' 
              : 'border-slate-700 hover:border-slate-600'
            }
          `}
        >
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            step={step}
            className="w-24 bg-transparent text-right font-mono text-lg font-bold text-slate-100 focus:outline-none placeholder-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs font-semibold text-slate-500 ml-2 select-none pt-0.5">{unit}</span>
        </div>
      </div>

      {/* Slider Row */}
      <div className="relative w-full h-6 flex items-center group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            setInputValue(val.toString());
            onChange(val);
          }}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none z-10
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:border-4 
            [&::-webkit-slider-thumb]:border-slate-900 
            [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.3)] 
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            
            [&::-moz-range-thumb]:w-5 
            [&::-moz-range-thumb]:h-5 
            [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:border-4 
            [&::-moz-range-thumb]:border-slate-900
            [&::-moz-range-thumb]:rounded-full
          "
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #10b981 ${percent}%, #1e293b ${percent}%, #1e293b 100%)`
          }}
        />
      </div>
      
      {/* Footer Labels (Fade in on hover) */}
      <div className="flex justify-between -mt-1 text-[10px] font-medium text-slate-600 px-1 uppercase tracking-wide opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default InputSlider;