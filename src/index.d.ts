interface Task {
  id: string;
  task: string;
  bgColor: string;
  completed: boolean;
  category: string;
  channelId: string;
  date?: string;
  time?: string;
}

type EditableTask = Omit<Task, 'bgColor' | 'completed' | 'category'>;
