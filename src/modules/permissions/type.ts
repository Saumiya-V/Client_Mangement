export type Permission = {
  id: number;
  name: string;
  definition: string;
  status: 'Active' | 'Inactive';
  startDate: string; 
  endDate: string;   
}
