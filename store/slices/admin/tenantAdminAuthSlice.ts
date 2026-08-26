import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  login as loginApi,
  logout as logoutApi,
} from '../../services/admin/tenantAdminAuth';
import {
  TenantLoginCredentials,
  TenantAdminUser,
} from '../../types/tenantAdminAuth.types';

interface TenantAdminAuthState {
  tenantAdmin: TenantAdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: TenantAdminAuthState = {
  tenantAdmin: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const tenantAdminLogin = createAsyncThunk(
  'tenantAdminAuth/login',
  async (credentials: TenantLoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
          console.log('✅ Login response:', response); 

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Tenant admin login failed'
      );
    }
  }
);

export const tenantAdminLogout = createAsyncThunk(
  'tenantAdminAuth/logout',
  async () => {
    await logoutApi();
  }
);

export const tenantAdminInitialize = createAsyncThunk(
  'tenantAdminAuth/initialize',
  async () => {
    // Support both tenant-admin and employee stored sessions
    const tenantToken = localStorage.getItem('tenant-token');
    const tenantUserStr = localStorage.getItem('tenant-user');

    const employeeToken = localStorage.getItem('employee-token');
    const employeeUserStr = localStorage.getItem('employee-user');

    if (tenantToken && tenantUserStr) {
      try {
        const user = JSON.parse(tenantUserStr) as TenantAdminUser;
        return {
          user,
          token: tenantToken,
          isAuthenticated: true,
        };
      } catch {
        return {
          user: null,
          token: null,
          isAuthenticated: false,
        };
      }
    }

    if (employeeToken && employeeUserStr) {
      try {
        const user = JSON.parse(employeeUserStr) as TenantAdminUser;
        return {
          user,
          token: employeeToken,
          isAuthenticated: true,
        };
      } catch {
        return {
          user: null,
          token: null,
          isAuthenticated: false,
        };
      }
    }

    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
);

const tenantAdminAuthSlice = createSlice({
  name: 'tenantAdminAuth',
  initialState,
  reducers: {
    clearTenantAdminError: (state) => {
      state.error = null;
    },

    resetTenantAdminAuth: (state) => {
      state.tenantAdmin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.isInitialized = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // =====================
      // INITIALIZE
      // =====================
      .addCase(tenantAdminInitialize.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(tenantAdminInitialize.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.tenantAdmin = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(tenantAdminInitialize.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
      })

      // =====================
      // LOGIN
      // =====================
      .addCase(tenantAdminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(tenantAdminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.tenantAdmin = action.payload.user;
        state.token = action.payload.access_token;
        state.error = null;
      })
      .addCase(tenantAdminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;

        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Tenant admin login failed';
      })

      // =====================
      // LOGOUT
      // =====================
      .addCase(tenantAdminLogout.fulfilled, (state) => {
        state.tenantAdmin = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.isInitialized = false;
      });
  },
});

export const { clearTenantAdminError, resetTenantAdminAuth } =
  tenantAdminAuthSlice.actions;

export const selectTenantAdminAuth = (state: {
  tenantAdminAuth: TenantAdminAuthState;
}) => state.tenantAdminAuth;

export default tenantAdminAuthSlice.reducer;