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
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Snackbar, Portal, Modal} from 'react-native-paper';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';

import {RootTabsPropList} from '../App';

import TasksList from '../components/TasksList';
import AddTask from './AddTask';
import EditTask from './EditTask';

type CategoryProps = MaterialTopTabScreenProps<RootTabsPropList>;

interface AddButtonProps {
  onAddButtonPressed: () => void;
}

interface DeleteButtonProps {
  onDeleteButtonPressed: () => void;
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

const DeleteButton = ({
  onDeleteButtonPressed,
}: DeleteButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={onDeleteButtonPressed}
      activeOpacity={0.7}>
      <Text style={styles.deleteButtonText}>Delete List</Text>
    </TouchableOpacity>
  );
};

const Home = ({navigation, route}: CategoryProps): React.JSX.Element => {
  const isFocused = useIsFocused();

  const taskCategory = route.params?.taskCategory || 'All Tasks';
  const onDeleteCategory = route.params?.onDeleteCategory;

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
        // const value = await AsyncStorage.getItem('tasks');
        const value = await AsyncStorage.getItem(taskCategory);

        if (value !== null) {
          const categoryTasks: Task[] = JSON.parse(value);
          // const categoryTasks = allTasks.filter(
          //   task => task.category === taskCategory,
          // );

          if (categoryTasks.length > 0) {
            setTasks(categoryTasks);
          }

          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log('Failed to fetch tasks from storage:', error.message);
        }
      }
    };

    fetchTasks();
  }, [isFocused, taskCategory]);

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

  const onDeleteButtonPressed = async () => {
    if (onDeleteCategory !== undefined && taskCategory !== 'All Tasks') {
      await onDeleteCategory(taskCategory);
    }
  };

  const onTaskItemPressed = (task: Task) => {
    setSelectedTask(task);
    showEditTaskModal();
  };

  const onAdd = async (newTask: Task) => {
    try {
      const value = await AsyncStorage.getItem('tasks');
      let allTasks: Task[] = [];

      if (value !== null) {
        allTasks = JSON.parse(value);
      }

      if (Array.isArray(allTasks)) {
        const categoryTasks = allTasks.filter(
          task => task.category === taskCategory,
        );
        const updatedTasks = [...categoryTasks, newTask];

        await AsyncStorage.setItem(taskCategory, JSON.stringify(updatedTasks));

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTasks(updatedTasks);
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
      let allTasks: Task[] = [];

      if (value !== null) {
        allTasks = JSON.parse(value);
      }

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
          <AddTask
            taskCategory={taskCategory}
            hideAddTaskModal={hideAddTaskModal}
            onSave={onAdd}
          />
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {taskCategory !== 'All Tasks' && (
            <View style={styles.headWrapper}>
              {/* <Text style={styles.headingText}>Tasks</Text> */}
              <DeleteButton onDeleteButtonPressed={onDeleteButtonPressed} />
            </View>
          )}

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
    // marginTop: 64,
  },
  headWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headingText: {
    fontWeight: '700',
    fontSize: 36,
    color: '#2B2D42',
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: 'tomato',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'tomato',
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#33B249',
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    borderWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 4,
    borderColor: '#000',
    shadowColor: '#33B249',
    elevation: 10,
  },
  buttonText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
});
