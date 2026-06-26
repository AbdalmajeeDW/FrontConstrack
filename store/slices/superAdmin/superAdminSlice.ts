import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createSuperAdmin, getSuperAdmins, superAdmin, updateSuperAdmin } from '../../services/superAdmins/superAdmin';
import { fetchTenants } from './tenantSlice';

interface SuperAdminState {
  superAdmins: superAdmin[];
  isLoading: boolean;
  error: string | null;
}


const initialState: SuperAdminState = {
  superAdmins: [],
  isLoading: false,
  error: null,
};

export const fetchSuperAdmins = createAsyncThunk<
  superAdmin[],
  void,
  { rejectValue: string }
>('superAdmin/fetchSuperAdmins', async (_, { rejectWithValue }) => {
  try {
    const superAdmins = await getSuperAdmins();
    return superAdmins;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load super admins');
  }
});

export const addTenant = createAsyncThunk<
  superAdmin,
  Partial<superAdmin>,
  { rejectValue: string }
>('superAdmin/addSuperAdmin', async (superAdminData, { rejectWithValue }) => {
  try {
    const superAdmin = await createSuperAdmin(superAdminData);
    return superAdmin;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create super admin');
  }
});

export const updateTenant = createAsyncThunk<
  superAdmin,
  { id: number; data: Partial<superAdmin> },
  { rejectValue: string }
>('superAdmin/updateSuperAdmin', async ({ id, data }, { rejectWithValue }) => {
  try {
    const superAdmin = await updateSuperAdmin(id, data);
    return superAdmin;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update super admin');
  }
});

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    setSuperAdmins(state, action: PayloadAction<superAdmin[]>) {
      state.superAdmins = action.payload;
    },
    clearSuperAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdmins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdmins.fulfilled, (state, action) => {
        state.superAdmins = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSuperAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load super admins';
      })
      .addCase(addTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTenant.fulfilled, (state, action) => {
        state.superAdmins.unshift(action.payload);
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
        state.superAdmins = state.superAdmins.map((superAdmin) =>
          superAdmin.id === action.payload.id ? action.payload : superAdmin,
        );
        state.isLoading = false;
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to update tenant';
      });
  },
});

export const { setSuperAdmins, clearSuperAdminError } = superAdminSlice.actions;
export const selectSuperAdmins = (state: { superAdmin: SuperAdminState }) => state.superAdmin.superAdmins;
export const selectSuperAdminLoading = (state: { superAdmin: SuperAdminState }) => state.superAdmin.isLoading;
export const selectSuperAdminError = (state: { superAdmin: SuperAdminState }) => state.superAdmin.error;

export default superAdminSlice.reducer;
