import { DatePicker } from '@/components/datepicker/DatePicker';
import type { FormFieldConfig } from '../components/form/formTypes';
import Select from 'react-select';


type RenderFieldProps = FormFieldConfig & {
  value: any;
  onChange: (value: any) => void;
  error?: string|null;
  isMulti?:boolean;
};
type OptionType = {
  label: string;
  value: string;
};

export const renderField = ({
  name,
  label,
  type,
  placeholder,
  required,
  options,
  value,
  onChange,
  error,
  isMulti
}: RenderFieldProps) => {
  return (
        <div className="flex flex-col space-y-1 w-full">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className={`border border-2 w-md rounded-md  bg-white ${type === "date" || type==='select' ? 'p-0.5' :'p-2'}`}>
        {type === "text" && (
          <input
            id={name}
            name={name}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-none outline-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent placeholder:text-gray-400"
          />
        )}

          {type === "date" && (
          <DatePicker
            id={name}
            name={name}
            value={value}
            onChange={onChange}
          />
        )}

        {type === "select" && options && (
<Select
  id={name}
  name={name}
  isMulti={!!isMulti}
  value={
    isMulti
      ? Array.isArray(value)
        ? options.filter((opt) => value.includes(opt.label))
        : []
      : options.find((opt) => opt.label === value) || null
  }
  onChange={(selected) => {
    if (isMulti) {
      const selectedValues = (selected as OptionType[]).map((s) => s.label);
      onChange(selectedValues);
    } else {
      onChange((selected as OptionType)?.label || "");
    }
  }}
  options={options}
  placeholder={placeholder || "Select..."}
  className="w-full text-sm placeholder:text-gray-100"
  classNamePrefix="react-select"
  styles={{
    control: (base) => ({
      ...base,
      border: "none",
      boxShadow: "none",
      outline: "none",
    }),
  }}
/>
)}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
