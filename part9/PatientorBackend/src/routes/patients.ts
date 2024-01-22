import express from 'express';
import patientService from '../services/patientService';
import { toNewPatientEntry } from '../utils';
import { EntryWithoutId } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getEntries());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);
    const addedEntry = patientService.addPatient(newPatient);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.get('/:id', (req, res) => {
  try {
    const patient = patientService.getPatientById(req.params.id);
    if(patient) {
      res.send(patient);
    }
    else {
      res.sendStatus(404);
    }
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    if('type' in req.body && 'description' in req.body && 'date' in req.body && 'specialist' in req.body){
      const newEntry = patientService.addPatientEntry(req.params.id, req.body as EntryWithoutId);
      res.json(newEntry);
    }
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;