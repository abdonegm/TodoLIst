'use client'

import { Button, TextField } from '@mui/material'

interface HeaderProps {
  onAddClick: () => void
  onSearch: (value: string) => void
}

export default function Header({ onAddClick, onSearch }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
      <TextField
        label="Search tasks"
        onChange={(e) => onSearch(e.target.value)}
        variant="outlined"
        className="w-full md:w-1/3"
      />
      <Button variant="contained" onClick={onAddClick}>
        + Add Task
      </Button>
    </div>
  )
}
