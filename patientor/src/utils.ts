import { Patient, Gender, Entry } from "./types";

const toPatient = (object: any): Patient => {
  const returnedPatient: Patient = {
    id: parseString(object.id),
    name: parseString(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseString(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString(object.occupation),
    entries: parseEntry(object.entries)
  };

  return returnedPatient;
};

const isArrayOfEntries = (array: unknown): array is Entry[] => {
  return Array.isArray(array); // incomplete type guard
};

const parseEntry = (array: unknown): Entry[] => {
  // assuming entries will not be an empty array
  if(!array || !isArrayOfEntries(array) || !array.every(entry => entry.type === "OccupationalHealthcare" || "Hospital" || "HealthCheck" )) {
    throw new Error('missing entries');
  }

  return array;
};

export const parseString = (item: unknown): string => {
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

export default toPatient;