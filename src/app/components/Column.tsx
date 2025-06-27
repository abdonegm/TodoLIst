import { useDroppable } from '@dnd-kit/core';
import { ColumnType, Task } from '../types/task';
import TaskCard from './TaskCard';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface Props {
  column: ColumnType;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function Column({ column, tasks, onEdit, onDelete }: Props) {
  const { setNodeRef } = useDroppable({
    id: column,
    data: {
      type: 'column',
    },
  });

  const taskIds = tasks.map((task) => task.id.toString());

  return (
    <div ref={setNodeRef} className="bg-white p-3 rounded shadow min-h-[150px]">
      <h2 className="text-lg font-bold capitalize mb-3">
        {column.replace('_', ' ')}
      </h2>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
