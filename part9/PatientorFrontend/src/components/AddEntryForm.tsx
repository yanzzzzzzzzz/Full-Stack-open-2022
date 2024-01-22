import {  TextField, InputLabel, MenuItem, Select, Button, SelectChangeEvent } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { EntryFormValue, HealthCheckRating} from '../types';

interface Props {
  onCancel: () => void;
  onSubmit: (newEntry:EntryFormValue) => void;
}

enum EntryType {
  HealthCheck = 'HealthCheck',
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare'
}

interface TypeOption {
  value: EntryType;
  label: string;
}

const typeOptions: TypeOption[] = Object.values(EntryType).map(v => ({
  value: v, label: v.toString()
}));

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [date, setDate] = useState('2024-1-22');
  const [type, setType] = useState('HealthCheck');
  const [specialist, setSpecialist] = useState('456');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');
  const [description, setDescription] = useState('123');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [selectedRating, setSelectedRating] = useState('Healthy');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const selectType = Object.values(EntryType).find(t => t.toString() === value);
      if (selectType) {
        setType(selectType);
      }
    }
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    if ( typeof event.target.value === "string") {
      setSelectedRating(event.target.value);
    }
  };
  const addEntry  = (event: SyntheticEvent) => {
    event.preventDefault();


    try {
      const commonProps = {
        specialist,
        description,
        date,
      };
      let newEntry: EntryFormValue;

      switch (type) {
        case 'HealthCheck':
          newEntry = {
            type: 'HealthCheck',
            healthCheckRating : selectedRating as HealthCheckRating,
            ...commonProps
          };
          break;
        case 'Hospital':
          newEntry = {
            type: 'Hospital',
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria
            },
            ...commonProps
          };
          break;
        case 'OccupationalHealthcare':
          newEntry = {
            type: 'OccupationalHealthcare',
            employerName: employerName,
            sickLeave: {
              startDate: sickLeaveStartDate,
              endDate: sickLeaveEndDate
            },
            ...commonProps
          };
          break;
        default:
          throw new Error('Invalid entry type');
      }
      onSubmit(newEntry);
    } catch (error) {
      console.log('error', error);
    }
    onCancel();
  };

  return (
    <div>
      <form onSubmit={addEntry}>
      <InputLabel>Type</InputLabel>
        <Select
          fullWidth
          value={type}
          onChange={onTypeChange}
        >
        {typeOptions.map(option =>
          <MenuItem
            key={option.label}
            value={option.value}
          >
            {option.label
          }</MenuItem>
        )}
        </Select>
        <TextField
          label="Date"
          placeholder="YYYY-MM-DD"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Description"
          placeholder=""
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <TextField
          label="DiagnosisCodes(Option)"
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => setDiagnosisCodes(target.value)}
        />
        {
          type==='HealthCheck' && (
            <>
              <InputLabel style={{ marginTop: 20 }}>Health Check Rating</InputLabel>
              <Select
                value={selectedRating}
                onChange={handleChange}
                fullWidth
              >
                {Object.keys(HealthCheckRating).map(key =>
                  <MenuItem
                    key={key}
                    value={key}
                  >
                    {key}
                  </MenuItem>
                )}
              </Select>
            </>
          )
        }
        {
          type==='Hospital' && (
            <>
              <TextField
                label="DischargeDate(Option)"
                fullWidth
                value={dischargeDate}
                onChange={({ target }) => setDischargeDate(target.value)}
              />
              <TextField
                label="DischargeCriteria(Option)"
                fullWidth
                value={dischargeCriteria}
                onChange={({ target }) => setDischargeCriteria(target.value)}
              />
            </>
          )
        }
        {
          type==='OccupationalHealthcare' && (
            <>
              <TextField
                label="employerName"
                fullWidth
                value={employerName}
                onChange={({ target }) => setEmployerName(target.value)}
              />
              <TextField
                label="sickLeave startDate(Option)"
                fullWidth
                value={sickLeaveStartDate}
                onChange={({ target }) => setSickLeaveStartDate(target.value)}
              />
              <TextField
                label="sickLeave endDate(Option)"
                fullWidth
                value={sickLeaveEndDate}
                onChange={({ target }) => setSickLeaveEndDate(target.value)}
              />
            </>
          )
        }
        <Button variant="contained" color="primary" type='submit'>ADD</Button>
      </form>
    </div>
  );
};

export default AddEntryForm;