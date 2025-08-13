import type { FormConfig } from "@/components/form/formTypes";
import { createPermission, fetchActiveRoles, fetchClientOptions } from "@/utils/fetch";

export const getPermissionFormConfig = async (): Promise<FormConfig> => {
  const clients = await fetchClientOptions();
  const roles = await fetchActiveRoles();

  return {
    title: "Permission Info",
    submitLabel: "Save",
     onSubmit: async (formData) => {
          try {
            await createPermission(formData); 
            alert("Permission created successfully!");
          } catch (err) {
            console.error("Failed to create permission:", err);
            alert("Failed to create permission.");
          }
        },
    fields: [
      {
        name: "name",
        label: "Name",
        placeholder:'Permission Name',
        type: "text",
        required: true,
        validate: (val) => val.length < 3 ? "Minimum 3 characters required" : null,
      },
      {
        name: "definition",
        label: "Definition",
        placeholder:'Definition',
        type: "text",
        required: true,
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
        name: "clients",
        label: "Client",
        type: "select",
        required: true,
        options: clients,
        isMulti:false
      },
      {
        name: "roles",
        label: "Roles",
        type: "select",
        required: true,
        options: roles,
        isMulti:true
      },
    ],
  };
};
