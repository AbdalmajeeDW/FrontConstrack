import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Project } from '@/store/types/project.types';
import { createProjectServices, getProjects } from '@/store/services/admin/projects';

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
      })
    
  },
});

export const { setSelectedProject, clearProjectError } = projectSlice.actions;
export const selectProject = (state: { project: ProjectState }) => state.project.projects;
export const selectProjectsLoading = (state: { project: ProjectState }) => state.project.isLoading;
export const selectProjectsError = (state: { project: ProjectState }) => state.project.error;

export default projectSlice.reducer;
