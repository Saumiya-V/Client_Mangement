import type { FormConfig } from '@/components/form/formTypes';
import { createFunctionalArea, fetchClientOptions } from '@/utils/fetch';

export const getfunctionalAreaConfig =async ():Promise<FormConfig> => {

const clients = await fetchClientOptions();

return {
  title: "Functional Area Info",
  submitLabel: "Save",
 onSubmit: async (formData) => {
      try {
        await createFunctionalArea(formData); 
        alert("Functional Area created successfully!");
      } catch (err) {
        console.error("Failed to create functional area:", err);
        alert("Failed to create functional area.");
      }
    },
  fields: [
    {
      name: 'name',
      label: 'Functional Area Name',
      type: 'text',
      required: true,
      placeholder: 'Functional Area Name',
    },
    {
      name: 'type',
      label: 'Functional Area Type',
      type: 'text',
      required: true,
      placeholder: 'Functional Area Type',
    },
    {
      name: 'definition',
      label: 'Definition',
      type: 'text',
      placeholder: 'Definition',
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
    {
      name: 'alignClients',
      label: 'Align Clients',
      type: 'select',
      placeholder: 'Select active client',
      options: clients,
      isMulti:true
    },
  ]
};
}
