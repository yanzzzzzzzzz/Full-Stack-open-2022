import diagnoses from "../services/diagnoses";
import { Patient, ActionType, Diagnosis } from "../types";
import { State } from './state';

export type Action =
  | { 
      type: ActionType.SetPatientList; 
      payload: Patient[] ;
    }
  | { 
      type: ActionType.AddPatient; 
      payload: Patient 
    }
  | {
    type: ActionType.SetDiagnoseList;
    payload: Diagnosis[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SetPatientList:
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case ActionType.AddPatient:
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case ActionType.SetDiagnoseList:
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnose) => ({ ...memo, [diagnose.code]: diagnose }),
            {}
          ),
          ...state.diagnoses
        }
      };
    default:
      return state;
  }
};
//dispatch({ type: 'ADD_PATIENT', payload: patient});
export const addPatient = (patient: Patient):{ type: ActionType.AddPatient, payload: Patient } => {
  return {
    type: ActionType.AddPatient,
    payload: patient
  };
};

export const SetPatientList = (patients: Array<Patient>):{ type: ActionType.SetPatientList, payload: Array<Patient> } => {
  return {
    type: ActionType.SetPatientList,
    payload: patients
  };
};

export const SetDiagnoseList = (diagnoses: Array<Diagnosis>):{ type: ActionType.SetDiagnoseList, payload: Array<Diagnosis> } => {
  return {
    type: ActionType.SetDiagnoseList,
    payload: diagnoses
  };
};