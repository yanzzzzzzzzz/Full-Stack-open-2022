import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddEntryForm from './AddEntryForm';
import { EntryFormValue } from '../types';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (newEntry:EntryFormValue) => void;
}

const AddEntryModal = ({modalOpen, onClose, onSubmit}: Props) =>(
  <Dialog open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new entry</DialogTitle>
    <DialogContent>
      <AddEntryForm 
        onSubmit={onSubmit} 
        onCancel={onClose}/>
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;