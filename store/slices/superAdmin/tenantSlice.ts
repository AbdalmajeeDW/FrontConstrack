import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { activateTenant, createTenant, getTenantById, getTenants, Tenant, updateTenant as updateTenantService } from '../../services/superAdmins/tenantService';

interface TenantState {
  tenants: Tenant[];
  isLoading: boolean;
    selectedTenant: Tenant | null;

  error: string | null;
}


const initialState: TenantState = {
  tenants: [],
  isLoading: false,
    selectedTenant: null,

  error: null,
};

export const fetchTenants = createAsyncThunk<
  Tenant[],
  void,
  { rejectValue: string }
>('tenant/fetchTenants', async (_, { rejectWithValue }) => {
  try {
    const tenants = await getTenants();
    return tenants;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load tenants');
  }
});
export const fetchTenantById = createAsyncThunk<
  Tenant,
  number,
  { rejectValue: string }
>('tenant/fetchTenantById', async (id, { rejectWithValue }) => {
  try {
    const tenant = await getTenantById(id);
    return tenant;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load tenant');
  }
});
export const addTenant = createAsyncThunk<
  Tenant,
  Partial<Tenant>,
  { rejectValue: string }
>('tenant/addTenant', async (tenantData, { rejectWithValue }) => {
  try {
    const tenant = await createTenant(tenantData);
    return tenant;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create tenant');
  }
});

export const updateTenant = createAsyncThunk<
  Tenant,
  { id: number; data: Partial<Tenant> },
  { rejectValue: string }
>('tenant/updateTenant', async ({ id, data }, { rejectWithValue }) => {
  try {
    const tenant = await updateTenantService(id, data);
    return tenant;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update tenant');
  }
});
export const activateTenantById = createAsyncThunk<
  Tenant,
  number,
  { rejectValue: string }
>('tenant/activateTenant', async (id, { rejectWithValue }) => {
  try {
    const tenant = await activateTenant(id);
    return tenant;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to activate tenant');
  }
});
const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenants(state, action: PayloadAction<Tenant[]>) {
      state.tenants = action.payload;
    },
    clearTenantError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.tenants = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load tenants';
      })
      .addCase(addTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTenant.fulfilled, (state, action) => {
        state.tenants.unshift(action.payload);
        state.isLoading = false;
      })
      .addCase(addTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to add tenant';
      })
      .addCase(updateTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.tenants = state.tenants.map((tenant) =>
          tenant.id === action.payload.id ? action.payload : tenant,
        );
        state.isLoading = false;
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to update tenant';
      })
      .addCase(activateTenantById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateTenantById.fulfilled, (state, action) => {
        state.tenants = state.tenants.map((tenant) =>
          tenant.id === action.payload.id ? action.payload : tenant,
        );
        state.isLoading = false;
      })
      .addCase(activateTenantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to activate tenant';
      })
           .addCase(fetchTenantById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.selectedTenant = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTenantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load tenant';
      })
  },
});

export const { setTenants, clearTenantError } = tenantSlice.actions;
export const selectTenants = (state: { tenant: TenantState }) => state.tenant.tenants;
export const selectTenantLoading = (state: { tenant: TenantState }) => state.tenant.isLoading;
export const selectTenantError = (state: { tenant: TenantState }) => state.tenant.error;

export default tenantSlice.reducer;
