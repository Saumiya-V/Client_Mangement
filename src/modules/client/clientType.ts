export type Client ={
    id: string;
    name: string;
    status: string;
    address: string;
    description: string;
    startDate: string;
    endDate: string;
}

export type ClientFormData = {
  name: string;
  description: string;
  address: string;
  status: "Active" | "Inactive";
  startDate: string;
  endDate: string;
}