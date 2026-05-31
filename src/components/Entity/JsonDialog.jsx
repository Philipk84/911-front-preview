import { Dialog, DialogContent, DialogTitle } from '@mui/material'

export default function JsonDialog({ item, onClose }) {
  return (
    <Dialog open={Boolean(item)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle del registro</DialogTitle>
      <DialogContent dividers>
        <pre className="json-box">{JSON.stringify(item, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  )
}
