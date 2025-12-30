export interface ITasksTrackerProps {
  siteURL: string;
  token?: string;
  user?: object;
  isDarkTheme?: boolean;
  siteTheme: object;
  loginName?: string;
}

export interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: TaskFormData;
  isEdit?: boolean;
}

export interface TaskFormData {
  Id?: number;
  Title: string;
  Description?: string;
  StartDate?: Date | null;
  DueDate?: Date | null;
  Status: string;
  Priority: string;
  TaskTypeId?: string | number;
  DepartmentId?: string | number;
  ConcernedEntity?: string;
  EmployeeId?: number;
  ManagerIDId?: number | null;
  Attachments?: File[];
  FilesToDelete?: string[];
}

export interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: TaskFormData;
  isEdit?: boolean;
  departmentId?: number;
}

// Attachment interface
export interface Attachment {
  FileName: string;
  ServerRelativeUrl: string;
  TimeCreated: string;
}

export interface FilterState {
  searchText: string;
  priorityFilter: string[];
  statusFilter: string[];
  departmentFilter: string[];
  [key: string]: any; // For additional filters
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  color?: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
  type: 'chip' | 'select' | 'date' | 'text';
  multiple?: boolean;
}

export interface TaskFilterProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearAll?: () => void;
  filterConfigs?: FilterConfig[];
  showActiveFilters?: boolean;
  buttonText?: string;
  buttonVariant?: 'text' | 'outlined' | 'contained';
  buttonSize?: 'small' | 'medium' | 'large';
}