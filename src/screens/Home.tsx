import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Snackbar, Portal, Modal} from 'react-native-paper';

import {RootStackParamList} from '../App';
import TasksList from '../components/TasksList';
import AddTask from './AddTask';
import EditTask from './EditTask';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface AddButtonProps {
  onAddButtonPressed: () => void;
}

const AddButton = ({onAddButtonPressed}: AddButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onAddButtonPressed}
      activeOpacity={0.7}>
      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  );
};

const Home = ({navigation}: HomeProps): React.JSX.Element => {
  const isFocused = useIsFocused();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task>();

  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);

  const [deletedTask, setDeletedTask] = useState<Task>();
  const [deletedTaskIndex, setDeletedTaskIndex] = useState<number>();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const value = await AsyncStorage.getItem('tasks');
        if (value !== null) {
          setTasks(JSON.parse(value));

          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log('Failed to fetch tasks from storage');
        }
      }
    };

    fetchTasks();
  }, [isFocused]);

  const showAddTaskModal = () => setIsAddTaskModalVisible(true);
  const hideAddTaskModal = () => setIsAddTaskModalVisible(false);

  const showEditTaskModal = () => setIsEditTaskModalVisible(true);
  const hideEditTaskModal = () => {
    setIsEditTaskModalVisible(false);
    setSelectedTask(undefined);
  };

  const onAddButtonPressed = () => {
    showAddTaskModal();
  };

  const onTaskItemPressed = (task: Task) => {
    setSelectedTask(task);
    showEditTaskModal();
  };

  const onAdd = async (newTask: Task) => {
    try {
      const value = await AsyncStorage.getItem('tasks');
      if (value !== null) {
        const allTasks = JSON.parse(value);

        if (Array.isArray(allTasks)) {
          const updatedTasks = allTasks.concat(newTask);

          await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setTasks(updatedTasks);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to store the task into phone memory');
      }
    }
  };

  const onEdit = async (editedTask: EditableTask) => {
    try {
      const value = await AsyncStorage.getItem('tasks');
      if (value !== null) {
        const allTasks = JSON.parse(value);

        if (Array.isArray(allTasks)) {
          const updatedTasks = allTasks.map((item: Task) =>
            item.id === editedTask.id
              ? {
                  ...item,
                  task: editedTask.task,
                  date: editedTask.date,
                  time: editedTask.time,
                }
              : item,
          );

          await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setTasks(updatedTasks);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to edit the task');
      }
    }
  };

  const onDelete = (taskId: string, taskIndex: number) => {
    try {
      if (tasks.length > 0) {
        const updatedTasks = tasks.filter((item: Task) => item.id !== taskId);

        AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

        setDeletedTask(tasks.find((item: Task) => item.id === taskId));
        setDeletedTaskIndex(taskIndex);
        setTasks(updatedTasks);
        setIsSnackbarVisible(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to delete the task');
      }
    }
  };

  const undoDelete = () => {
    try {
      if (deletedTask && deletedTaskIndex !== undefined) {
        const updatedTasks = [...tasks];
        updatedTasks.splice(deletedTaskIndex, 0, deletedTask);

        AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setTasks(updatedTasks);
        setDeletedTask(undefined);
        setDeletedTaskIndex(undefined);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to undo the deletion');
      }
    }
  };

  const onToggleComplete = (taskId: string) => {
    try {
      const updatedTasks = tasks.map((item: Task) =>
        item.id === taskId ? {...item, completed: !item.completed} : item,
      );

      AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

      setTasks(updatedTasks);
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to mark task as complete');
      }
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Portal>
        <Modal
          visible={isAddTaskModalVisible}
          onDismiss={hideAddTaskModal}
          contentContainerStyle={styles.modalContent}>
          <AddTask hideAddTaskModal={hideAddTaskModal} onSave={onAdd} />
        </Modal>
      </Portal>

      {selectedTask && (
        <Portal>
          <Modal
            visible={isEditTaskModalVisible}
            onDismiss={hideEditTaskModal}
            contentContainerStyle={styles.modalContent}>
            <EditTask
              task={selectedTask}
              hideEditTaskModal={hideEditTaskModal}
              onSave={onEdit}
            />
          </Modal>
        </Portal>
      )}

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headWrapper}>
            <Text style={styles.headingText}>Tasks</Text>
          </View>

          <TasksList
            onTaskItemPressed={onTaskItemPressed}
            tasks={tasks}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        </View>
      </ScrollView>

      <AddButton onAddButtonPressed={onAddButtonPressed} />

      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={() => setIsSnackbarVisible(false)}
        duration={4000}
        action={{label: 'UNDO', onPress: undoDelete}}>
        Task deleted
      </Snackbar>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: '#FFF6E9',
  },
  modalContent: {
    height: 320,
    marginHorizontal: 24,
  },
  container: {
    marginTop: 64,
  },
  headWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headingText: {
    fontWeight: '700',
    fontSize: 36,
    color: '#2B2D42',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#33B249',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});
