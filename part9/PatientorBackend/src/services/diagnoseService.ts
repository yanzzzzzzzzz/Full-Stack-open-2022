import diagnosesEntries from '../data/diagnoses';
import { Diagnose } from '../types';

const getEntries = (): Diagnose[] => {
  return diagnosesEntries;
};

export default {
  getEntries
};