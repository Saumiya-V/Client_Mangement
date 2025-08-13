import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; 
import { DialogTrigger } from "@radix-ui/react-dialog";
import type { ClientFormData } from "./clientType";
import { Base_Url } from "@/constants/url";
import axios from "axios";
import { DatePicker } from "@/components/datepicker/DatePicker";

export function ClientForm() {
  const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    description: "",
    address: "",
    startDate: null,
    endDate:null ,
  });
  const [errors,setErrors] = useState<{[key:string]:string}>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if(!formData.name || !formData.address){
      setErrors({[name]:"This field is required"})
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors:{[key:string]:string} = {}

    if(!formData.name.trim()){
       newErrors.name = "Client Name is required"
    }


    if(!formData.address.trim()){
      newErrors.address = "Address is required"
    }

    if(formData.startDate && formData.endDate){
      const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (start > end) {
      newErrors.endDate = 'End date must be after or same as start date';
    }
    }

    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors)
      return;
    }

    setErrors({})

    try {
      const res = await axios.post(`${Base_Url}/clients`, formData, {
  headers: {
    "Content-Type": "application/json",
  },
});

      if (!res.data.ok) throw new Error("Failed to add client");

      const result = await res.data;
      console.log("Client added:", result);
      setOpen(false); 
      setFormData({
  name: "",
  description: "",
  address: "",
  startDate: null,
  endDate: null,
});

    } catch (error) {
      console.error("Error submitting client:", error);
    }
  };
    

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-sm text-sm">
            + Add Client
          </Button>
      </DialogTrigger>
      <DialogContent
       className="w-full max-w-md rounded-lg ml-110"
       onPointerDownOutside={(e)=>e.preventDefault()}
       >
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className={`mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm ${errors.name && !formData.name && "border-red-500"}`}
              placeholder="Client name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && !formData.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={4}
              name="description"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Description"
               value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="text"
              name="address"
              className={`mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm ${errors.address && !formData.address && "border-red-500"}`}
              placeholder="Address"
               value={formData.address}
              onChange={handleChange}
              required
            />
            {errors.address && !formData.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Start Date</label>
           <div className="border border-gray-300 rounded">
               <DatePicker
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={(val) => setFormData((prev) => ({ ...prev, startDate: val ?? null }))}
            />
           </div>
          </div>

          <div>
            <label className="text-sm font-medium">End Date</label>
             <div className="border border-gray-300 rounded">
              <DatePicker
              id="startDate"
              name="startDate"
              value={formData.endDate}
              onChange={(val) => setFormData((prev) => ({ ...prev, endDate: val ?? null }))}
            />
             </div>
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>

          <div className="pt-4">
            <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
