import patients from '../data/patients';
import { PatientEntry, NewPatientEntry, Patient, Entry, EntryWithoutId } from '../types';
import { v4 as uuidv4 } from 'uuid';
import {toHealthCheckEntry, toHospitalEntry, toOccupationalHealthcareEntry} from '../utils';

const getEntries = (): PatientEntry[] => {
  return patients;
};

const addPatient = (entry: NewPatientEntry): PatientEntry =>{
  const newPatientEntry = {
    id:uuidv4(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const getPatientById = (id: string): Patient | undefined => {
  const patientEntry = patients.find(p => p.id === id);
  return patientEntry;
  
};

const addPatientEntry = (id: string, entry:EntryWithoutId): Entry => {
  const patient = patients.find(p => p.id === id);
  if(!patient){
    throw new Error("Patient is not in the system");
  }
  const newEntry = {
    id: String(uuidv4()),
    ...entry
  };
  switch (entry.type) {
    case 'HealthCheck':
      const healthCheckEntry = toHealthCheckEntry(newEntry);
      patient?.entries.push(healthCheckEntry);
      return healthCheckEntry;
    case 'Hospital':
      const HospitalEntry = toHospitalEntry(newEntry);
      patient?.entries.push(HospitalEntry);
      return HospitalEntry;
    case 'OccupationalHealthcare':
      const OccupationalHealthcareEntry = toOccupationalHealthcareEntry(newEntry);
      patient?.entries.push(OccupationalHealthcareEntry);
      return OccupationalHealthcareEntry;
    default:
      throw new Error("Patient is not in the system");
  }
  

};

export default {
  getEntries,
  addPatient,
  getPatientById,
  addPatientEntry
};