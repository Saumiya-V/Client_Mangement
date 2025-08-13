import { createContext, useContext, useState } from 'react';

interface FormContextType {
  showForm: boolean;
  setShowForm: (value: boolean) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <FormContext.Provider value={{ showForm, setShowForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
