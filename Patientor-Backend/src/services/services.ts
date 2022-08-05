import diagnosesData from '../data/diagnoses.json';
import patients from '../data/patients';
import { Diagnose, Patient, PatientWithoutSsn, newPatient, newEntry } from '../types';
import { v1 as uuid } from 'uuid';


// diagnoses doesn't need patients' treatment since they have no complex types
const diagnoses: Diagnose[] = diagnosesData; 



const getDiagnoses = (): Diagnose[]  => {
  return diagnoses;
}

const getPatientsWithoutSsn = (): PatientWithoutSsn[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries  }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find(patient => patient.id === id);
  return patient;
};

const addEntry = (id: string, entry: newEntry): Patient | undefined => {
  const patient = patients.find(patient => patient.id === id);
  if(patient !== undefined) {
    const newEntry = {
      ...entry,
      id: uuid()
    };
    console.log(newEntry, entry)
    patient.entries.push(newEntry);
    return patient;
  }

  return patient; // undefined
  
}

const addPatient = (entry: newPatient): Patient => {
  const newEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newEntry);
  return newEntry;
};

export default {
  getDiagnoses,
  getPatientsWithoutSsn,
  addPatient,
  getPatient,
  addEntry
};
