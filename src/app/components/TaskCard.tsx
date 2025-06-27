import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Task } from '../types/task';
import { Delete, Edit } from '@mui/icons-material';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task?.id.toString(),
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div style={style}>
      <Card variant="outlined">
        <CardContent>
          <div className="flex justify-between items-start">
            <div
              ref={setNodeRef}
              {...listeners}
              {...attributes}
              className="flex-1"
            >
              <Typography variant="h6">{task.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {task.description}
              </Typography>
            </div>

            <div className="flex-shrink-0">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                <Delete />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
