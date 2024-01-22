import {  Gender, Entry, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry, EntryFormValue } from "../types";
import { useParams } from 'react-router-dom';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import { useStateValue } from "../state/useStateValue";
import React, { useState } from "react";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button} from '@mui/material';
import AddEntryModal from "./AddEntryModal";
import patientService from '../services/patients';

const HeartRating = ({ rating }: { rating: number }) => {
  const getHeartColor = () => {
    return rating === 0 ? 'green' : 'yellow';
  };

  return (
    <FavoriteIcon style={{ color: getHeartColor() }} />
  );
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry;}) => {
  return (
    <>
      <p>
        {entry.date}
        <LocalHospitalIcon />
      </p>
      <p>{entry.description}</p>
      <p>diagnose by {entry.specialist}</p>
    </>
  );
};
const HealthCheckEntryDetailsDetails = ({ entry }: { entry: HealthCheckEntry;}) => {
  return (
    <>
      <p>
        {entry.date}
        <HealthAndSafetyIcon />
      </p>
      <p>{entry.description}</p>
      <HeartRating rating={entry.healthCheckRating}/>
      <p>diagnose by {entry.specialist}</p>
    </>
  );
};
const OccupationalHealthcareEntryDetails = ({ entry }: { entry: OccupationalHealthcareEntry;}) => {
  return (
    <>
      <p>
        {entry.date}
        <MedicalInformationIcon />
        {entry.employerName}
      </p>
      <p>{entry.description}</p>
      <p>diagnose by {entry.specialist}</p>
    </>
  );
};
const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryDetails entry={entry}/>;
    case 'HealthCheck':
      return <HealthCheckEntryDetailsDetails entry={entry}/>;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    default:
      return <></>;
  }
};
const PatientPage = () => {
  const customStyle = {
    border: '1px solid black',
    margin: '3px'
  };
  const [{ patients }] = useStateValue();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
  };

  const { id } = useParams<{ id: string }>();

  const submitNewEntry = async (newEntry:EntryFormValue) => {

    try {
      console.log('newEntry', newEntry);
      patientService.createNewEntry(id, newEntry);
    } catch (error) {
      console.log('error', error);
    }
    
  };
  if(id === undefined){
    return null;
  }
  const patient = patients[id];
  if(patient === null){
    return null;
  }
  return (
  <>
    
    <h1>
      {patient.name}
      {patient.gender === Gender.Male && (
        <MaleIcon />
      )}
      {patient.gender === Gender.Female && (
        <FemaleIcon />
      )}
    </h1>
    <p>ssn:{patient.ssn}</p>
    <p>occupation:{patient.occupation}</p>
    <AddEntryModal 
    onClose={closeModal} 
    modalOpen={modalOpen}
    onSubmit={submitNewEntry}
    />
    <Button variant="contained" color="primary" onClick={() => openModal()}>new entry</Button>
    <h2>entries</h2>
    {patient.entries.map((entry, index) => (
      <div key={index} style={customStyle}>
        <EntryDetails entry={entry} />
      </div>
    ))}
  </>
  );
};

export default PatientPage;