import axios from "axios";
import { Base_Url } from "../constants/url";


export const fetchClientOptions = async () => {
  const res = await fetch(`${Base_Url}/clients`);
  const data = await res.json();
  const now = new Date();

  return data
    .filter((client: any) => {
      const start = new Date(client.startDate);
      const end = new Date(client.endDate);
      const isActive = start <= now && end >=now;
      return isActive;
    }).map((client:any)=>({
      label:client.name,
      value:client.id
    }));
};


export const fetchActiveRoles = async () => {
  const res = await fetch(`${Base_Url}/roles`);
  const data = await res.json();

  const now = new Date();

  return data
    .filter((role: any) => {
      const start = new Date(role.startDate);
      const end = new Date(role.endDate);
      const isActive = start <= now && end >=now;
      return isActive;
    }).map((role:any)=>({
      label:role.name,
      value:role.id
    }));
};



 export const fetchPermissionData = async () => {
    const res = await axios.get(`${Base_Url}/permissions`);
    return res.data;
  };

  export const fetchFunctionalAreaData = async() =>{
       try{
        const res = await axios.get(`${Base_Url}/functionalAreas`);
        return res.data
       }catch(err){
        console.error(err)
       }
    }

  export const fetchEngagements = async () =>{
    try{
      const res = await axios.get(`${Base_Url}/engagements`);
      return res.data
    }catch(err){
        console.error(err)
       }
  }

  export const createFunctionalArea = async (data: any) => {
  const response = await axios.post(`${Base_Url}/functionalAreas`, data);
  return response.data;
};

  export const createRole = async (data: any) => {
  const response = await axios.post(`${Base_Url}/roles`, data);
  return response.data;
};

 export const createPermission = async (data: any) => {
  const response = await axios.post(`${Base_Url}/permissions`, data);
  return response.data;
};


export const fetchRoleData = async() =>{
       try{
        const res = await axios.get(`${Base_Url}/roles`);
        return res.data
       }catch(err){
        console.error(err)
       }
    }