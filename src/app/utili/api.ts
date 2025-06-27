import axios from 'axios';
import { Task } from '../types/task';

const API = 'http://localhost:4000/tasks';

export const fetchTasks = () => axios.get(API).then((res) => res.data);
export const createTask = (task: Omit<Task, 'id'>) => axios.post(API, task);
export const updateTask = (id: number, task: Omit<Task, 'id'>) =>
  axios.put(`${API}/${id}`, task);
export const deleteTask = (id: number) => axios.delete(`${API}/${id}`);
