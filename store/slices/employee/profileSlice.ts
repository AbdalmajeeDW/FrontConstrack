import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTasksByEmployeeId } from '../../services/employee/taskService';
import { EmployeeUser } from '@/store/types/employee.types';
import { getByEmployeeId } from '@/store/services/employee/profileService';

interface EmployeeState {
  employee: EmployeeUser;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employee: {} as EmployeeUser,
  isLoading: false,
  error: null,
};

export const fetchEmployee = createAsyncThunk<EmployeeUser, number, { rejectValue: string, source?: string }>(
  'employeeProfile/fetchEmployee',
  async (employeeId, { rejectWithValue }) => {
    try {
      return await getByEmployeeId(employeeId);
    } catch (error: EmployeeUser | any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load employee profile');
    }
  },
);

const employeeSlice = createSlice({
  name: 'employeeProfile',
  initialState,
  reducers: {
    clearEmployeeTaskError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.employee = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { clearEmployeeTaskError } = employeeSlice.actions;
export const selectEmployee = (state: { employeeProfile: EmployeeState }) => state.employeeProfile.employee;
export const selectEmployeeLoading = (state: { employeeProfile: EmployeeState }) => state.employeeProfile.isLoading;
export const selectEmployeeError = (state: { employeeProfile: EmployeeState }) => state.employeeProfile.error;

export default employeeSlice.reducer;
