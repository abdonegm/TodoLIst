'use client';

import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { useTasks } from '../hooks/useTasks';
import Column from './Column';
import Header from './Header';
import TaskFormDialog from './TaskFormDialog';
import { Task, ColumnType } from '../types/task';
import { useState } from 'react';

export default function Todo() {
  const {
    data: tasks = [],
    isLoading,
    addTask,
    editTask,
    removeTask,
  } = useTasks();
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (task: Omit<Task, 'id'>, id?: number) => {
    if (id) {
      editTask.mutate({ id, task });
    } else {
      addTask.mutate(task);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    removeTask.mutate(id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id.toString();
    const newColumn = over.id as ColumnType;

    const task = tasks.find((t) => t.id.toString() === taskId);
    if (!task || task.column === newColumn) return;

    editTask.mutate({
      id: task.id,
      task: { ...task, column: newColumn },
    });
  };

  const columns: ColumnType[] = ['backlog', 'in_progress', 'review', 'done'];

  return (
    <div className="p-4">
      <Header onAddClick={() => setOpen(true)} onSearch={setSearch} />

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => (
            <Column
              key={col}
              column={col}
              tasks={filteredTasks.filter((task) => task.column === col)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DndContext>

      <TaskFormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingTask}
      />
    </div>
  );
}
