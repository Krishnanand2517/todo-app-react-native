interface Task {
  id: string;
  task: string;
  bgColor: string;
  completed: boolean;
  date?: string;
  time?: string;
}

type EditableTask = Omit<Task, 'bgColor' | 'completed'>;
