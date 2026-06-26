import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getEmployees, createEmployee, updateEmployee as updateEmployeeService, employee } from '../../services/admin/employee';
interface employeesState {
  employees: employee[];
  isLoading: boolean;
  error: string | null;
}


const initialState: employeesState = {
  employees: [],
  isLoading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk<
  employee[],
  void,
  { rejectValue: string }
>('employee/fetchEmployees', async (_, { rejectWithValue }) => {
  try {
    const employees = await getEmployees();
    return employees;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load employees');
  }
});

export const addEmployee = createAsyncThunk<
  employee,
  Partial<employee>,
  { rejectValue: string }
>('employee/addEmployee', async (employeeData, { rejectWithValue }) => {
  try {
    const employee = await createEmployee(employeeData);
    return employee;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
  }
});

export const updateEmployee = createAsyncThunk<
  employee,
  { id: number; data: Partial<employee> },
  { rejectValue: string }
>('employee/updateEmployee', async ({ id, data }, { rejectWithValue }) => {
  try {
    const employee = await updateEmployeeService(id, data);
    return employee;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
  }
});

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<employee[]>) {
      state.employees = action.payload;
    },
    clearEmployeeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load employees';
      })
      .addCase(addEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.unshift(action.payload);
        state.isLoading = false;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to add employee';
      })
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.map((employee) =>
          employee.id === action.payload.id ? action.payload : employee,
        );
        state.isLoading = false;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to update employee';
      });
  },
});

export const { setEmployees, clearEmployeeError } = employeeSlice.actions;
export const selectEmployees = (state: { employee: employeesState }) => state.employee.employees;
export const selectEmployeeLoading = (state: { employee: employeesState }) => state.employee.isLoading;
export const selectEmployeeError = (state: { employee: employeesState }) => state.employee.error;

export default employeeSlice.reducer;
