// ReusableForm.tsx
import React, { useState } from 'react';
import type { FormConfig } from './formTypes';
import { renderField } from '@/utils/renderFields';
import { Button } from '../ui/button';
import { MoveLeft } from 'lucide-react';
import { useFormContext } from '@/utils/hooks/FormContext';


const ReusableForm: React.FC<FormConfig> = ({ title, fields, onSubmit, submitLabel = "Save" }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const {setShowForm} = useFormContext()


  const handleSubmit = () => {
  const newErrors: Record<string, string | null> = {};

  fields.forEach((field) => {
    const value = formData[field.name];

    if (field.required && !value) {
      newErrors[field.name] = `${field.label} is required`;
    } else if (field.validate) {
      newErrors[field.name] = field.validate(value);
    } else {
      newErrors[field.name] = null;
    }
  });

  const start = formData["startDate"];
  const end = formData["endDate"];

  if (start && end && new Date(start) > new Date(end)) {
    newErrors["startDate"] = "Start date cannot be after end date";
    newErrors["endDate"] = "End date cannot be before start date";
  }

  setErrors(newErrors);

  const hasError = Object.values(newErrors).some((e) => e !== null);
  if (!hasError) {
    onSubmit(formData);
  }
};


  return (
    <>
    <h2 className="text-xl font-bold mb-4">{title}</h2><hr></hr>
    <form onSubmit={(e)=>e.preventDefault()} className="grid grid-cols-2 mb-5 w-full">
          {fields.map((field) => (
              <div key={field.name} className='mt-5'>
                  {renderField({
                      ...field,
                      value: formData[field.name],
                      onChange: (val) => setFormData((prev) => ({ ...prev, [field.name]: val })),
                      error: errors[field.name],
                  })}
              </div>
          ))}
      </form><hr></hr>
          <div className='flex justify-between'>
             <Button
              onClick={() => setShowForm(false)}
              className="mt-4 bg-gray-300 text-black px-4 py-1.5 rounded-sm text-sm hover:bg-white"
            >
              <MoveLeft/>
            </Button>
          <button
          onClick={handleSubmit}
          type="submit"
          className="bg-blue-600 mt-4 w-25 text-white px-4 py-1.5 rounded mb-5"
      >
              {submitLabel}
          </button>
           </div>
      </>

  );
};

export default ReusableForm;
