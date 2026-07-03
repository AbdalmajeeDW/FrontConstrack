import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTasksByEmployeeId } from '../../services/employee/taskService';
import { Task } from '../../types/task.types';

interface EmployeeTaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeTaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const fetchEmployeeTasks = createAsyncThunk<Task[], number, { rejectValue: string }>(
  'employeeTask/fetchEmployeeTasks',
  async (employeeId, { rejectWithValue }) => {
    try {
      return await getTasksByEmployeeId(employeeId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load employee tasks');
    }
  },
);

const employeeTaskSlice = createSlice({
  name: 'employeeTask',
  initialState,
  reducers: {
    clearEmployeeTaskError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEmployeeTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load employee tasks';
      });
  },
});

export const { clearEmployeeTaskError } = employeeTaskSlice.actions;
export const selectEmployeeTasks = (state: { employeeTask: EmployeeTaskState }) => state.employeeTask.tasks;
export const selectEmployeeTaskLoading = (state: { employeeTask: EmployeeTaskState }) => state.employeeTask.isLoading;
export const selectEmployeeTaskError = (state: { employeeTask: EmployeeTaskState }) => state.employeeTask.error;

export default employeeTaskSlice.reducer;
