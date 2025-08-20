export type TimezoneOption = {
  value:string;
  label:string;
}

export type SlotLabel = "Primary" | "Secondary"
| "Tertiary"

export type DateTimeSlot = {
  id: string;        
  date: string; 
  time:string; 
  timezone: string;  
};

export type EngageFormType = {
  engagementOwner: string;
    speaker: string;
    caterer: string;
    cohost: string;
    dateTime:DateTimeSlot[]
}

export type Engagement = {
  id: number;
  engagementOwner: string;
  speaker: string;
  caterer: string;
  cohost: string;
  primaryDateTime: DateTimeSlot ;   
  secondaryDateTime?: DateTimeSlot | '-';
  tertiaryDateTime?: DateTimeSlot | '-';
  createdDateTime: string;
};
