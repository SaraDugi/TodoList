// types.ts

export type Task = {
    name: string;
    description: string;
    category: string;
    deadline: string;
    reminderDate: string;
  };
  
  // Navigation stack parameter list
  export type RootStackParamList = {
    TaskList: undefined;
    TaskDetails: { task: Task };
    AddTask: undefined;
  };
  