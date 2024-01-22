import { NewPatientEntry, Gender, Entry, HealthCheckEntry, HealthCheckRating, HospitalEntry, Discharge, OccupationalHealthcareEntry } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};
const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
      throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseName = (param: unknown): string => {
  if (!param || !isString(param)){
    throw  new Error('Incorrect or missing name: ' + param);
  }
  return param;
};

const parseDate = (date: unknown) : string => {
  if(!date || !isString(date) || !isDate(date)){
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)){
    throw  new Error('Incorrect or missing ssn: ' + ssn);
  }
  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)){
    throw  new Error('Incorrect or missing occupation: ' + occupation);
  }
  return occupation;
};

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }
  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object && 'entries' in object
  )  {
    const patientEntry: NewPatientEntry = {
    name: parseName(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: object.entries as Entry[],
    };
    return patientEntry;
  }
  throw new Error('Incorrect data: a field missing');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ishealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

export const toHealthCheckEntry = (entry: Entry): HealthCheckEntry => {
  if ('healthCheckRating' in entry && ishealthCheckRating(entry.healthCheckRating)){
    const healthCheckEntry: HealthCheckEntry = {
      ...entry,
      healthCheckRating: entry.healthCheckRating
    };
    return healthCheckEntry;
  }
  throw new Error('Incorrect data: a field missing');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkDischarge = (param:any):param is Discharge => {
  if('date' in param && isString(param.date) && 'criteria' in param && isString(param.criteria)){
    return true;
  }
  else {
    throw  new Error('Incorrect or missing name: ' + param);
  }
};

export const toHospitalEntry = (entry: Entry): HospitalEntry => {
  if ('discharge' in entry && checkDischarge(entry.discharge)){
    const hospitalEntry: HospitalEntry = {
      ...entry,
      discharge: entry.discharge
    };
    return hospitalEntry;
  }
  throw new Error('Incorrect data: a field missing');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSickLeave = (param: any): boolean => {
  if('startDate' in param && isString(param.startDate) && 'endDate' in param && isString(param.endDate)){
    return true;
  }
  else{
    return false;
  }
};

export const toOccupationalHealthcareEntry = (entry: Entry): OccupationalHealthcareEntry => {
  if('sickLeave' in entry){
    if(!isSickLeave(entry.sickLeave)){
      throw new Error('Invalid sickLeave format');
    }
  }
  if ('employerName' in entry && isString(entry.employerName)){
    const occupationalHealthcareEntry: OccupationalHealthcareEntry = {
      ...entry,
      employerName: entry.employerName,
      sickLeave: entry.sickLeave ?? undefined,
    };
    return occupationalHealthcareEntry;
  }
  throw new Error('Incorrect data: a field missing');
};