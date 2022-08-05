import express from 'express';
import services from '../services/services';
import toNewPatientEntry, { toNewEntry } from '../utils';

const router = express.Router();

router.get('/ping', (_req, res) => {
  console.log('got pinged');
  res.send('pong');
});

router.get('/diagnoses', (_req, res) => {
  res.json(services.getDiagnoses());
});

router.get('/patients/:id', (req, res) => {
  const patient =services.getPatient(req.params.id);
  if(patient) {
    return res.json(patient);
  }
  return res.sendStatus(404);
});

router.get('/patients', (_req, res) => {
  res.json(services.getPatientsWithoutSsn());
});

router.post('/patients', (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);
    const addedPatient = services.addPatient(newPatient);
    res.json(addedPatient);

  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/patients/:id/entries', (req, res) => {
  {
    try {
      const id = req.params.id;
      const newEntry = toNewEntry(req.body);
      if (newEntry) {
        const patientAddedTo = services.addEntry(id, newEntry);
        res.json(patientAddedTo);
      }
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }
  }
})


export default router;