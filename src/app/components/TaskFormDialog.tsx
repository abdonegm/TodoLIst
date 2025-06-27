import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem
} from '@mui/material'
import { useState, useEffect } from 'react'
import { ColumnType, Task } from '../types/task'


const columnOptions: ColumnType[] = ['backlog', 'in_progress', 'review', 'done']

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, 'id'>, id?: number) => void
  initialData?: Task | null
}

export default function TaskFormDialog({ open, onClose, onSubmit, initialData }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [column, setColumn] = useState<ColumnType>('backlog')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
      setColumn(initialData.column)
    } else {
      setTitle('')
      setDescription('')
      setColumn('backlog')
    }
  }, [initialData])

  const handleSubmit = () => {
    onSubmit({ title, description, column }, initialData?.id)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent className="flex flex-col gap-4  ">
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} className='!mt-4'  />
        <TextField
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
       
        />
        <TextField
          select
          label="Column"
          value={column}
          onChange={(e) => setColumn(e.target.value as ColumnType)}
        >
          {columnOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option.replace('_', ' ')}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
