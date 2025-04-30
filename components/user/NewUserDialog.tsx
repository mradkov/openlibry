import { UserPlus } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export interface NewUserDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  maxUserID: number;
  onCreate: (idValue: number, idAuto: boolean) => void;
}

export default function NewUserDialog(props: NewUserDialogProps) {
  const { onCreate, open, maxUserID, setOpen } = props;
  const [idValue, setIdValue] = useState(maxUserID);
  const [idAuto, setIdAuto] = useState(true);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <Label htmlFor="idValue">Потребителско ID</Label>
        <Input
          id="idValue"
          disabled={idAuto}
          value={idValue}
          onChange={(e) => {
            setIdValue(parseInt(e.target.value) ? parseInt(e.target.value) : 0);
          }}
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={idAuto}
            onCheckedChange={(c) => {
              setIdAuto(c === true);
            }}
            id="idAuto"
          />
          <Label htmlFor="idAuto">Автоматично ID</Label>
        </div>
        <Button
          onClick={() => {
            onCreate(idValue, idAuto);
          }}
        >
          <UserPlus /> Създаване на нов потребител
        </Button>
      </DialogContent>
    </Dialog>
  );
}
