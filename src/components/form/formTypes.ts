export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'date'
  | 'checkbox'
  | 'select';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  validate?: (value: any) => string | null;
  options?: { label: string; value: string }[]; 
  placeholder?: string;
  isMulti?: boolean;
}

export interface FormConfig {
  title: string;
  fields: FormFieldConfig[];
  onSubmit: (values: Record<string, any>) => void;
  submitLabel?: string;
}
