import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Project } from '@/store/types/project.types';
import { createProjectServices, deleteProjectServices, getProjectById, getProjects, updateProjectServices } from '@/store/services/admin/projects';
import { API_ENDPOINTS_ADMIN } from '@/store/endpoints';
import api from '@/store/superApi';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      return await getProjects();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load Projects');
    }
  },
);
export const createProject = createAsyncThunk<Project, Partial<Project>, { rejectValue: string }>(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      return await createProjectServices(projectData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create Project');
    }
  },
);
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }: { id: number; data: Partial<Project> }, { rejectWithValue }) => {
    try {
      const updated = await updateProjectServices(id, data);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update project");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteProjectServices(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete project");
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await getProjectById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch project");
    }
  }
);



const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject(state, action: PayloadAction<Project | null>) {
      state.selectedProject = action.payload;
    },
    clearProjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to load Project';
      })
    
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
   
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
        state.isLoading = false;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unable to create Project';
      }) // ===== updateProject =====
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex(
          (project) => project.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ===== deleteProject =====
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
        if (state.selectedProject?.id === action.payload) {
          state.selectedProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
  },
});

export const { setSelectedProject, clearProjectError } = projectSlice.actions;
export const selectProject = (state: { projects: ProjectState }) =>
  state.projects.projects;

export const selectProjectsLoading = (state: { projects: ProjectState }) =>
  state.projects.isLoading;

export const selectProjectsError = (state: { projects: ProjectState }) =>
  state.projects.error;
export default projectSlice.reducer;
export const selectSelectedProject = (state: any) => state.projects.selectedProject;
