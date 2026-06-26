import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getTaskById,
  getTasks,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from '../../services/admin/taskService';
import { Task } from '../../types/task.types';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'task/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await getTasks();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load tasks');
    }
  },
);

export const fetchTaskById = createAsyncThunk<Task, number, { rejectValue: string }>(
  'task/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      return await getTaskById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load task');
    }
  },
);

export const createTask = createAsyncThunk<Task, Partial<Task>, { rejectValue: string }>(
  'task/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      return await createTaskService(taskData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  },
);

export const updateTask = createAsyncThunk<
  Task,
  { id: number; data: Partial<Task> },
  { rejectValue: string }
>('task/updateTask', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateTaskService(id, data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk<number, number, { rejectValue: string }>(
  'task/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTaskService(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  },
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setSelectedTask(state, action: PayloadAction<Task | null>) {
      state.selectedTask = action.payload;
    },
    clearTaskError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load tasks';
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load task';
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.isLoading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to create task';
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        );
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to update task';
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
        state.isLoading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to delete task';
      });
  },
});

export const { setSelectedTask, clearTaskError } = taskSlice.actions;
export const selectTasks = (state: { task: TaskState }) => state.task.tasks;
export const selectSelectedTask = (state: { task: TaskState }) => state.task.selectedTask;
export const selectTaskLoading = (state: { task: TaskState }) => state.task.isLoading;
export const selectTaskError = (state: { task: TaskState }) => state.task.error;

export default taskSlice.reducer;
