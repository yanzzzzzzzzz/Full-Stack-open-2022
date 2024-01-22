export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface Discharge {
  date:string;
  criteria:string;
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;

export enum ActionType {
  SetPatientList = "SET_PATIENT_LIST",
  AddPatient = "ADD_PATIENT",
  SetDiagnoseList = "SET_DIAGNOSE_LIST"
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}

export enum HealthCheckRating {
  Healthy = "0",
  LowRisk = "1",
  HighRisk = "2",
  CriticalRisk = "3"
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: Discharge;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: { startDate:string, endDate:string };
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

type OmitId<T extends Entry> = Omit<T, 'id'>;

type HospitalFormValues = OmitId<HospitalEntry>;
type OccupationalHealthcareFormValues = OmitId<OccupationalHealthcareEntry>;
type HealthCheckFormValues = OmitId<HealthCheckEntry>;

export type EntryFormValue = 
  HospitalFormValues | 
  OccupationalHealthcareFormValues | 
  HealthCheckFormValues;
