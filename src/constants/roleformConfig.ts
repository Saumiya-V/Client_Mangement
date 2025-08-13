import type { FormConfig } from '@/components/form/formTypes';
import { createRole } from '@/utils/fetch';


export const roleFormConfig: FormConfig = {
  title: "Role Info",
  submitLabel: "Save",
 onSubmit: async (formData) => {
      try {
        await createRole(formData); 
        alert("Role created successfully!");
      } catch (err) {
        console.error("Failed to create role:", err);
        alert("Failed to create role.");
      }
    },
  fields: [
    {
      name: 'name',
      label: 'Role Name',
      placeholder:'Role Name',
      type: 'text',
      required: true,
      validate: (val) => val.length < 3 ? "Minimum 3 characters required" : null,
    },
    {
      name: 'definition',
      label: 'Definition',
      placeholder:'Definition',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      label: 'Type',
      placeholder:'Type',
      type: 'text',
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
    },
  ]
};


