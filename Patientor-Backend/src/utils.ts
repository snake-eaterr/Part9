import { newPatient, Gender, Entry, newEntry, Discharge, SickLeave, HealthCheckRating } from "./types";


const toNewPatientEntry = (object: any): newPatient => {
  const newEntry: newPatient = {
    name: parseString(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseString(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString(object.occupation),
    entries: parseEntry(object.entries)
  };

  return newEntry;
};



const isArrayOfEntries = (array: unknown): array is Entry[] => {
  return Array.isArray(array); // incomplete type guard
};
// for newPatient
const parseEntry = (array: unknown): Entry[] => {
  // assuming entries will not be an empty array
  if(!array || !isArrayOfEntries(array) || !array.every(entry => entry.type === "OccupationalHealthcare" || "Hospital" || "HealthCheck" )) {
    throw new Error('missing entries');
  }
  
  return array;
};











const parseString = (item: unknown): string => {
  if(!item || !isString(item)) {
    throw new Error('Incorrect or missing name');
  }

  return item;
};


const isString = (item: unknown): item is string => {
  return typeof item === 'string' || item instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if(!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseDiagnosisCodes = (codes: unknown): string[] => {
  if(codes === undefined) return []; 
  if(!Array.isArray(codes) || !codes.every(code => isString(code))) {
    throw new Error('Diagnosis codes error');
  }
  return codes;
}

const parseDischarge = (discharge: unknown): Discharge => {
  if(!(typeof discharge === 'object' && discharge !== null)) {
    throw new Error('discharge');
  }
  if(!('date' in discharge && 'criteria' in discharge)) {
    throw new Error('discharge');
  }

  const object = discharge as Discharge;
  return {
    date: parseDate(object.date),
    criteria: parseString(object.criteria)
  };
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if(!(typeof sickLeave === 'object' && sickLeave !== null)) {
    throw new Error('sick leave');
  }
  if(!('startDate' in sickLeave && 'endDate' in sickLeave)) {
    throw new Error('sick leave');
  }

  const object = sickLeave as { startDate: unknown, endDate: unknown };
  return {
    startDate: parseDate(object.startDate),
    endDate: parseDate(object.endDate)
  };
}

const isRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseRating = (rating: unknown): HealthCheckRating => {
  if(!rating || !isString(rating) || !isRating(rating)) {
    throw new Error('Incorrect or missing gender: ' + rating);
  }
  return rating;
    
}



const parseEntryType = (type: unknown) => {
  if (type === "OccupationalHealthcare") {
    return "OccupationalHealthcare" as const;
  } else if (type === "Hospital") {
    return "Hospital" as const;
  } else if (type === "HealthCheck") {
    return "HealthCheck" as const;
  } else {
    throw new Error("No valid entry type found");
  }
};

export const toNewEntry = (object: {
  type: unknown;
  description: unknown;
  id: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes: unknown;
  discharge?: unknown;
  employerName?: unknown;
  sickLeave?: unknown;
  healthCheckRating?: unknown
}): newEntry | undefined => {
  console.log('here');
  const commonProperties = {
    type: parseEntryType(object.type),
    description: parseString(object.description),
    date: parseDate(object.date),
    specialist: parseString(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes)
  };

  switch(commonProperties.type) {
    case "Hospital": 
      return {
        ...commonProperties,
        discharge: parseDischarge(object.discharge),
        type: "Hospital"
      };
    case "OccupationalHealthcare":
      return {
        ...commonProperties,
        type: "OccupationalHealthcare",
        sickLeave: parseSickLeave(object.sickLeave),
        employerName: parseString(object.employerName)
      };
    case "HealthCheck": 
      return {
        ...commonProperties,
        type: "HealthCheck",
        healthCheckRating: parseRating(object.healthCheckRating)
      }
    default:
      return;
      
  }

};


export default toNewPatientEntry;