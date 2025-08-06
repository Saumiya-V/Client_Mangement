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

export function ClientForm() {
  const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    description: "",
    address: "",
    status: "Active",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

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
  status: "Active",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
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
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Client name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Address"
               value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
               value={formData.startDate}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">End Date</label>
            <input
              type="date"
              name="endDate" 
               value={formData.endDate}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
               value={formData.status}
               name="status"
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
