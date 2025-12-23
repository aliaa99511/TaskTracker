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
}

// Attachment interface
export interface Attachment {
  FileName: string;
  ServerRelativeUrl: string;
  TimeCreated: string;
}