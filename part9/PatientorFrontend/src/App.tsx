import { useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import patientService from "./services/patients";
import diagnoseService from "./services/diagnoses";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/Patient";
import { SetPatientList, SetDiagnoseList} from './state';
import { useStateValue } from "./state/useStateValue";
const App = () => { 
  const [, dispatch] = useStateValue();

  useEffect(() => {

    const fetchPatientList = async () => {
      try {
        const patients = await patientService.getAll();
        dispatch(SetPatientList(patients));
      } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if(axios.isAxiosError(error) && error.response) {
          errorMessage += ' Error: ' + error.response.data.message;
        }
        console.error(errorMessage);
      }
    };
    
    const fetchDiagnoseList = async () => {
      try {
        const diagnoses = await diagnoseService.getAll();
        dispatch(SetDiagnoseList(diagnoses));
        console.log('diagnoses', diagnoses);
        
      } catch (error) {
        let errorMessage = 'Something went wrong.';
        if(axios.isAxiosError(error) && error.response) {
          errorMessage += ' Error: ' + error.response.data.message;
        }
        console.error(errorMessage);
      }
    };
    void fetchPatientList();
    void fetchDiagnoseList();
  }, [dispatch]);
  
  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/patients/:id" element={<PatientPage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
