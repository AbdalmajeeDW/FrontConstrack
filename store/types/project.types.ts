export interface Project {
  id?: number;
  name: string;
  description?: string;
  client_name?: string;
  client_phone?: string;
  location?: string;
  city?: string;
  postal_code?: string;
  start_date?: string;
  end_date?: string;
  status:"planning" | "active" | "completed" | "cancelled" 
}
 