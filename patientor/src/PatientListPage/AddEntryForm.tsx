import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Typography } from '@material-ui/core';
import { HospitalEntry } from '../types';
import { DiagnosisSelection } from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import * as Yup from 'yup';

export type EntryFromForm = Omit<HospitalEntry, "id" | "type">;



interface Props {
  onSubmit: (values: EntryFromForm) => void;
}







const AddEntryForm = ({ onSubmit }: Props) => {

  const [{ diagnoses }] = useStateValue();

  return (
    <Formik initialValues={{ description: "", date: "", specialist: "", diagnosisCodes: [], discharge: {
      date: "",
      criteria: ""
    } }} onSubmit={onSubmit}
      validationSchema={Yup.object({
        description: Yup.string().required('Required'),
        date: Yup.string().required('Required'),
        specialist: Yup.string().required('Required'),
        discharge: Yup.object({
          date: Yup.string().required('Required'),
          criteria: Yup.string().required('required')
        })
      })}
    >
      {formik => {
        
        return (
          <Form>
        <div>
          <label htmlFor='description'>Description</label>
          <input id="description" type="text" { ...formik.getFieldProps('description') } />
          { formik.touched.description && formik.errors.description ? <div style={{color: 'red'}}>{formik.errors.description}</div> : null }
        </div>
        <div>
          <label htmlFor='date'>Date</label>
          <input id="date" type="date" { ...formik.getFieldProps('date') } />
          { formik.touched.date && formik.errors.date ? <div style={{color: 'red'}}>{formik.errors.date}</div> : null }
        </div>
        <div>
          <label htmlFor='specialist'>Specialist</label>
          <input id="specialist" type="text" { ...formik.getFieldProps('specialist') } />
          { formik.touched.specialist && formik.errors.specialist ? <div style={{color: 'red'}}>{formik.errors.specialist}</div> : null }
        </div>
        <DiagnosisSelection  setFieldValue={formik.setFieldValue} setFieldTouched={formik.setFieldTouched} diagnoses={diagnoses}   />
        { formik.touched.diagnosisCodes && formik.errors.diagnosisCodes ? <div style={{color: 'red'}}>{formik.errors.diagnosisCodes}</div> : null }    
        {/* <div>
          <label htmlFor='diagnosisCodes'>Diagnosis Codes</label>
          <input id="diagnosisCodes" type="text" { ...formik.getFieldProps('diagnosisCodes') } onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => formik.values.diagnosisCodes[0] = e.target.value} />
        </div> */}
        <Typography variant="h6">Discharge</Typography>
        <div>
          <label htmlFor='dischargeDate'>Date</label>
          <input type="date" id="dischargeDate" { ...formik.getFieldProps('dischargeDate') } onChange={(e) => {
            formik.values.discharge.date = e.target.value;
          }} />
        </div><div>
          <label htmlFor='criteria'>Criteria</label>
          <input type="text" id="criteria" { ...formik.getFieldProps('criteria') } onChange={(e) => {
            formik.values.discharge.criteria = e.target.value;
          }} />
        </div>
        { formik.touched.discharge && formik.errors.discharge ? <div style={{color: 'red'}}>{formik.errors.discharge}</div> : null }
        <button type="submit">Submit</button>
      </Form>
        )
      }}
    </Formik>
  )
};

export default AddEntryForm;