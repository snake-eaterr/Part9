import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../state';
import { Diagnosis, Patient, Entry } from '../types';
import { updatePatient, setDiagnoses } from '../state/reducer';
import { apiBaseUrl } from '../constants';
import toPatient, { parseString } from '../utils';
import { Typography, Box } from '@material-ui/core';
import AddEntryForm, { EntryFromForm } from '../PatientListPage/AddEntryForm';
import axios from 'axios';








const PatientPage = () => {

  const [{ patients, diagnoses }, dispatch] = useStateValue(); //diagnoses is empty []

  const { id } = useParams<{ id: string }>();

  const fetchStatus = useRef({ shouldFetch: false, hasFetched: false }); // user could be coming from PatientsListPage, where patients would already be fetched, or they could be coming from direct url
  

  let patient = patients[parseString(id)];

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };
  

  try {
    patient = toPatient({...patient});
  } catch(error: unknown) {
    if (error instanceof Error && !fetchStatus.current.hasFetched) {
      fetchStatus.current = { ...fetchStatus.current, shouldFetch: true };
    }
  }

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const { data: diagnosesFromApi } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        dispatch(setDiagnoses(diagnosesFromApi));
      } catch (error: unknown) {
        if(error instanceof Error) {
          console.log(error);
        }
      }
    }
    void fetchDiagnoses();
  }, [])

  
  
  useEffect(() => {
    const fetchPatient = async () => {
      fetchStatus.current = { ...fetchStatus.current, shouldFetch: false };
      try {
        const { data: patientFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(updatePatient(patientFromApi));
        fetchStatus.current = { ...fetchStatus.current, hasFetched: true };
      } catch (e) {
        console.log(e);
      }
    };
    if(fetchStatus.current.shouldFetch) {
      void fetchPatient();
    }
    
  }, [id, ]);

  if(!patient || diagnoses.length === 0) return null;

  const onSubmit = async (values: EntryFromForm) => {
    
    let dia;
    if(values.diagnosisCodes) {
      const dia = values?.diagnosisCodes[0]?.split(',');
      console.log(dia);

    }
    const entry = {
      ...values,
      diagnosisCodes: dia,
      type: "Hospital"
    }

    try {
      const { data: updatedPatientFromApi } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        entry
      );
      dispatch(updatePatient(updatedPatientFromApi));
      console.log(updatedPatientFromApi)

    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
      }
    }


  }
  
  
  return (
    <Box>
      <Typography style={{marginTop: 50}} variant="h4" component="h2">
        {patient.name}
      </Typography>
      <Typography variant="h5" component="h4"> {patient.gender} </Typography>
      <Typography variant="h6" component="h4">ssn: {patient.ssn}</Typography>
      <Typography variant="h6" component="h4">occupation: {patient.occupation}</Typography>
      <Typography variant="h3" component="h3">Entries:</Typography>
      <AddEntryForm onSubmit={onSubmit} />
      {
        patient.entries.map(entry => {
          switch(entry.type) {
            case "HealthCheck": 
              return (
                <div style={{marginBottom: 10, padding: 10, borderRadius: 8, border: '1px solid black'}}>
                  <Typography variant="h6" component="h6">{entry.date} {" "} {entry.healthCheckRating}</Typography>
                  <Typography variant="h6" component="h6"> {entry.description} </Typography>
                  <ul>
                    {entry.diagnosisCodes && 
                      entry.diagnosisCodes.map(code => {
                        return (
                          <li key={code}>{code} {(diagnoses.find(diagnose => diagnose.code === code ))?.name}</li>
                        )
                        })
                      }
                  </ul>
                  <Typography variant="h6" component="h6"> Diagnose by {entry.specialist} </Typography>
                </div>
                
                )
            case "Hospital": 
              return (
                <div style={{marginBottom: 10, padding: 10, borderRadius: 8, border: '1px solid black'}}>
                  <Typography variant="h6" component="h6">{entry.date} {" | "} Discharge: {entry.discharge.date}</Typography>
                  <Typography variant="h6" component="h6"> {entry.description} </Typography>
                  <ul>
                     {entry.diagnosisCodes && 
                      entry.diagnosisCodes.map(code => {
                        return (
                          <li key={code}>{code} {(diagnoses.find(diagnose => diagnose.code === code ))?.name}</li>
                         )
                         })
                       }
                   </ul>
                   <Typography variant="h6" component="h6"> Diagnose by {entry.specialist} </Typography>
                </div>
                  
              )
            case "OccupationalHealthcare": 
              return (
                <div style={{marginBottom: 10, padding: 10, borderRadius: 8, border: '1px solid black'}}>
                  <Typography variant="h6" component="h6">{entry.date} {" | "} Employer: {entry.employerName}</Typography>
                  <Typography variant="h6" component="h6"> {entry.description} </Typography>
                  <Typography variant="h6" component="h6"> {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate} </Typography>
                  
                  <ul>
                     {entry.diagnosisCodes && 
                      entry.diagnosisCodes.map(code => {
                        return (
                          <li key={code}>{code} {(diagnoses.find(diagnose => diagnose.code === code ))?.name}</li>
                         )
                         })
                       }
                   </ul>
                   <Typography variant="h6" component="h6"> Diagnose by {entry.specialist} </Typography>
                </div>
                  
              )
            default:
              return assertNever(entry);
            
          }
            
            



          /* return (
            <div>
              <Typography variant="h6" component="h6">{entry.date} {" "} {entry.description}</Typography>
              <ul>
                {entry.diagnosisCodes && 
                  entry.diagnosisCodes.map(code => {
                    return (
                      <li key={code}>{code} {(diagnoses.find(diagnose => diagnose.code === code)).name}</li>
                    )
                  })
                }
              </ul>
            </div>
          ) */
        })
      }
    </Box>
  );
};

export default PatientPage;