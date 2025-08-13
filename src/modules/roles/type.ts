export type RoleData = {
  id: number;
  name: string;
  type: string;
  definition: string;
  startDate: string;  
  endDate: string;    
  status: 'Active' | 'Inactive' | string; 
};
