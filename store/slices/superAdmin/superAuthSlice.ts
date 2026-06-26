import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, logout as logoutApi, User } from '../../services/superAdmins/superAuth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};


export const login = createAsyncThunk(
  'superAuth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginApi({ email, password });


      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
  
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
});

//export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
//  const user = await getCurrentUser();
//  return user;
//});

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const token = localStorage.getItem('auth-token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return { user, token, isAuthenticated: true };
    } catch {
      return { user: null, token: null, isAuthenticated: false };
    }
  }
  
  return { user: null, token: null, isAuthenticated: false };
});

const authSlice = createSlice({
  name: 'superAuth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;  
   
          
      state.isAuthenticated = !!action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        
        state.token = action.payload.access_token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // ========== Logout ==========
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      // ========== Get Current User ==========
     // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
     //   state.user = action.payload;
     //   state.isAuthenticated = true;
     // })
     // .addCase(fetchCurrentUser.rejected, (state) => {
     //   state.user = null;
     //   state.isAuthenticated = false;
     // });
  },
});


export const { clearError, setUser, setToken, resetAuth } = authSlice.actions;
export const selectAllUsers = (state: { user: AuthState }) =>
  state.user?.user;
export default authSlice.reducer;