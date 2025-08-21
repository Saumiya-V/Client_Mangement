import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { timeIntervalArr } from "@/constants/timeInterval";
import  Select  from "react-select";
import { timezoneMap } from "@/constants/timezoneArr";
import {  AlertCircleIcon, CalendarPlus, Clock, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateTimeSlot, EngageFormType,TimezoneOption } from "./type";
import {  fetchEngagements, getLabel } from "@/utils/fetch";
import { DateTime } from "luxon";
import axios from "axios";
import { Base_Url } from "@/constants/url";
import { toast } from "sonner"; 
import { useError } from "@/utils/hooks/ErrorContext";
import { Alert, AlertTitle } from "@/components/ui/alert";



const EngagementForm = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeInterval,setActiveInterval] = useState<string|null>(null)
  const [isdateSelected,setisdateSelected] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState<TimezoneOption|null>(null)
  const [dataLength,setDataLength] = useState<number>(0)
 const {error,setError} = useError()

  const [formData, setFormData] = useState<EngageFormType>({
    engagementOwner: "",
    speaker: "",
    caterer: "",
    cohost: "",
    dateTime:[]
  });

  useEffect(()=>{
  const loadData = async () => {
      const data = await fetchEngagements();
      if (data) {
        setDataLength(data.length)
      }
    };
    loadData();
  },[])

  useEffect(() => {
  if (error) {
    const timer = setTimeout(() => {
      setError(null)   
    }, 3000)

    return () => clearTimeout(timer) 
  }
}, [error, setError])

  const options = Object.entries(timezoneMap).map(([abbr]) => ({
    value: abbr,
    label: abbr
  }))

  const slotLength = formData.dateTime.length

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (!formData.engagementOwner || !formData.speaker || !formData.caterer || !formData.cohost) {
      setError("Please fill all text fields before proceeding.")
      return;
    }
    setStep(2);
  };



const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.dateTime[0]) {
    setError("Primary Date and Time is required.")
    return;
  }

  try {
    const { data } = await axios.post(`${Base_Url}/engagements`, {
      id:String(dataLength + 1),
      engagementOwner: formData.engagementOwner,
      speaker: formData.speaker,
      caterer: formData.caterer,
      cohost: formData.cohost,
      primaryDateTime: formData.dateTime[0],
      secondaryDateTime: formData.dateTime[1] ?? "-",
      tertiaryDateTime: formData.dateTime[2] ?? "-",
      createdDateTime: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,   
})

    });

    if (!data.ok) throw new Error("Failed to create engagement");

    alert("Engagement created successfully!");
    console.log("Engagement Created:", data);

    setOpen(false);
    setStep(1);
    setFormData({
      engagementOwner: "",
      speaker: "",
      caterer: "",
      cohost: "",
      dateTime: [],
    });
  } catch (err) {
    console.error("Failed to create engagement", err);
    toast.error("Failed to create engagement. Try again.");
  }
};

const handleDialogChange = (isOpen: boolean) => {
  setOpen(isOpen);
  if (!isOpen) {
    setFormData(
      {engagementOwner: "",
       speaker: "",
       caterer: "",
       cohost: "",
       dateTime:[]
      }
    );
    setStep(1);
    setisdateSelected(false);
    setSelectedDate(null)
    setActiveInterval(null);
    setSelectedTimezone(null);
  }
};


const deleteSlot = (id: string) => {
  setFormData((prev) => ({
    ...prev,
    dateTime: prev.dateTime.filter((s) => s.id !== id),
  }));
};


const addSlot = (interval: string) => {
  if (!selectedDate || !selectedTimezone) return;

  const tz = timezoneMap[selectedTimezone.value];

  const luxonDate = DateTime.fromFormat(
    `${selectedDate.toDateString()} ${interval}`,
    "EEE MMM dd yyyy h:mm a",
    { zone: tz }
  );

  if (!luxonDate.isValid) {
    console.error("Invalid Luxon date:", luxonDate.invalidExplanation);
    return;
  }

  const newSlot: DateTimeSlot = {
    id: crypto.randomUUID(),
    date: luxonDate.toFormat("MM/dd/yyyy"),
    time: luxonDate.toFormat("hh:mm a"),
    timezone: selectedTimezone.value,
  };

  setFormData((prev) => ({
    ...prev,
    dateTime: [...prev.dateTime, newSlot].slice(0, 3),
  }));
};




function isBlocked(selectedDate: Date, interval: string|null, tzKey: string, slots: DateTimeSlot[]) {
  const tz = timezoneMap[tzKey];

  
  const dateStr = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()} ${interval}`;

  const current = DateTime.fromFormat(dateStr, "M/d/yyyy h:mm a", { zone: tz });

  if (!current.isValid) {
    console.error("Invalid current date in isBlocked:", current.invalidExplanation, "string:", dateStr);
    return false;
  }

  return slots.some(slot => {
    const slotTz = timezoneMap[slot.timezone];
   const slotDate = DateTime.fromFormat(
  `${slot.date} ${slot.time}`,
  "MM/dd/yyyy hh:mm a",
  { zone: slotTz }
);


    if (!slotDate.isValid) {
      console.error("Invalid slotDate:", slotDate.invalidExplanation, slot);
      return false;
    }


    const equivalent = slotDate.setZone(tz);
    const bufferStart = equivalent.minus({ minutes: 30 });
    const bufferEnd = equivalent.plus({ minutes: 45 });

  return current >= bufferStart && current <= bufferEnd;
  });
}

const handleContinue = () => {
  if (!selectedDate || !selectedTimezone || !activeInterval) {
    alert("Please select date, timezone and time");
    return;
  }

  setisdateSelected(true)
};



  return (
  <>
     <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-sm text-sm">
          + Create Engagement
        </Button>
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-10xl rounded-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-3">
              <span><CalendarPlus/></span>
              <p>Create Engagement</p>
            </div>
          </DialogTitle>
               {
              error && (
                <Alert variant={"destructive"}>
                  <AlertCircleIcon/>
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )
            }
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="mt-5">
              <Label htmlFor="engagementOwner" className="mb-3">Engagement Owner</Label>
              <Input
                id="engagementOwner"
                name="engagementOwner"
                placeholder="Engagement Owner"
                value={formData.engagementOwner}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="speaker" className="mb-3">Speaker</Label>
              <Input
                id="speaker"
                name="speaker"
                value={formData.speaker}
                placeholder="Speaker"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="caterer" className="mb-3">Caterer</Label>
              <Input
                id="caterer"
                name="caterer"
                value={formData.caterer}
                placeholder="Caterer"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="cohost" className="mb-3">Cohost</Label>
              <Input
                id="cohost"
                name="cohost"
                value={formData.cohost}
                placeholder="Cohost"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-sm text-sm" onClick={handleNext}>
              Next
            </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 w-full">
           <div className="border-b flex justify-between">
            <div className="mb-2">
                <p className="text-sm">Date & Time</p>
                <p className="text-xs text-gray-500">Select Date & Time</p>
            </div>
            <div className="flex items-center justify-center gap-2">
                <span className="h-3 w-3 bg-red-500"></span>
                <p className="text-gray-500 text-sm font-semibold mr-2">Lead Time</p>
            </div>
           </div>

           <div className="flex justify-between gap-4">
            <div>
                <DatePicker
                  selected={selectedDate}
                   onChange={(date) => setSelectedDate(date)}
                  inline 
                  calendarClassName="small-datepicker"
                  minDate={new Date()}  />
            </div>
           {
            isdateSelected && slotLength > 0 ? (<div className="border-1 border-gray-400 rounded w-[250px] h-[33vh] p-2 relative right-2 overflow-y-auto">
              {
                formData.dateTime.map((slot,id)=>(
                  <div className="border rounded flex gap-2 flex-col p-3 border-gray-400 mb-3">
                <div className="flex justify-between">
                  <p className="font-bold text-sm">{getLabel(id)} Date & Time</p>
                  <span className=" text-red-500" onClick={()=>deleteSlot(slot.id)}>
                    <Trash size={18}/>
                  </span>
                </div>
                <div>
                  <p className="text-[12px] text-gray-600">Start Date & Time</p>
                  <p className="text-[12px] font-semibold">{slot.date} , {slot.time} {slot.timezone}</p>
                </div>
              </div>
                ))
              }
              {
                slotLength <= 2 && (
                  <Button onClick={() => { setisdateSelected(false);
                    setSelectedDate(null);
                    setActiveInterval(null);
                    setSelectedTimezone(null);
                   }} className={`bg-blue-600 text-white w-[190px] relative text-[12px] mt-2 ${slotLength === 1 ? 'left-11':'left-8'} font-semibold`}><Clock size={15}/>Select Alternate Date & Time</Button>
                )
              }
            </div>) : (<div className="border-1 border-gray-300 rounded w-[240px] h-[33vh]">
             <div>
                <Select
                options={options}
                placeholder="Select a Timezone"
                className="text-sm"
                value={selectedTimezone}
                onChange={(option)=>setSelectedTimezone(option)}
                />
            </div>
            <div className="flex flex-wrap w-[240px] h-[28vh]  overflow-x-auto gap-5">
                {
                    timeIntervalArr.map((interval,i)=>{
                      const isDisabled = !selectedTimezone ||(!!selectedDate && isBlocked(selectedDate, interval, selectedTimezone.value, formData.dateTime))
                        return <Button
                              key={i}
                              disabled={isDisabled}
                              className={cn("ml-5 bg-white text-gray-600 text-[12px] hover:bg-blue-600 hover:text-white mt-1",
                              activeInterval === interval && "bg-blue-600 text-white",
                             !selectedTimezone && "bg-gray-200 text-gray-400 opacity-100 cursor-not-allowed"
                        )}
                        onClick={() =>{ 
                          setActiveInterval(interval)
                          addSlot(interval);
                        }}>
                        {interval}
                     </Button>

                    })
                }
            </div>
           </div>)
           }
           </div>
           {
             !isdateSelected &&  (
              <Button onClick={handleContinue} className="border rounded w-18 font-semibold h-7  text-sm flex items-center justify-center ml-98 bg-blue-600 text-white">
           Continue
           </Button>
             )
           }
            <hr className="mt-5"></hr>
            <div className="flex justify-between mt-5">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className={`${!formData.dateTime[0]?'bg-gray-500 hover:bg-gray-500 text-white px-4 py-1.5 rounded-sm text-sm':'bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-sm text-sm'}`} onClick={handleCreate}>Create</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </>
  );
}

export default EngagementForm
