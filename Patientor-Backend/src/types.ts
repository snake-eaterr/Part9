export interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

interface BaseEntry {
  id: string;
  description: String;
  date: String;
  specialist: String;
  diagnosisCodes?: Array<Diagnose['code']>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}



interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;

}

export interface SickLeave {
  startDate: string;
  endDate: string;
}

interface OccupationalHealthCareEntry extends BaseEntry {
  employerName: string;
  type: "OccupationalHealthcare";
  sickLeave?: SickLeave;
}

export interface Discharge {
  date: string;
  criteria: string;
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: Discharge;
}




export type Entry = HealthCheckEntry | OccupationalHealthCareEntry | HospitalEntry; 

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries : Entry[];
}

export type PatientWithoutSsn = Omit<Patient, 'ssn'>;

export type newPatient = Omit<Patient, 'id'>;

export type PublicPatient = Omit<Patient, 'ssn' | 'entries' >

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type newEntry = UnionOmit<Entry, 'id'>;