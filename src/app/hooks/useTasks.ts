import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../types/task';
import { createTask, deleteTask, fetchTasks, updateTask } from '../utili/api';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const addTask = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const editTask = useMutation({
    mutationFn: ({ id, task }: { id: number; task: Omit<Task, 'id'> }) =>
      updateTask(id, task),
    onMutate: async ({ id, task }) => {
      // Cancel any outgoing refetches to avoid overwriting
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      // Optimistically update to the new value
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], (old) => 
          old?.map(t => t.id === id ? { ...t, ...task } : t)
        );
      }
      
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const removeTask = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return {
    data,
    isLoading,
    addTask,
    editTask,
    removeTask,
  };
};