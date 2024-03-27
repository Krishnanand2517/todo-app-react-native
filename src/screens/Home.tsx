import React, {useEffect, useState, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  StatusBar,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Snackbar, Portal, Modal} from 'react-native-paper';
import notifee, {
  AlarmType,
  AndroidImportance,
  AndroidNotificationSetting,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';

import {RootTabsPropList} from '../App';
import {toIsoDateTime} from '../utils/dateFunctions';

import ThemeContext, {ThemeContextType} from '../context/ThemeContext';
import TasksList from '../components/TasksList';
import AddTask from './modals/AddTask';
import EditTask from './modals/EditTask';
import DeleteCategoryConfirm from './modals/DeleteCategoryConfirm';
import DarkModeToggleSwitch from '../components/DarkModeToggleSwitch';

type CategoryProps = MaterialTopTabScreenProps<RootTabsPropList>;

interface AddButtonProps {
  onAddButtonPressed: () => void;
  theme: 'light' | 'dark' | null | undefined;
}

interface DeleteButtonProps {
  onDeleteButtonPressed: () => void;
  theme: 'light' | 'dark' | null | undefined;
}

const AddButton = ({
  onAddButtonPressed,
  theme,
}: AddButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={[styles.button, theme === 'dark' && styles.buttonDark]}
      onPress={onAddButtonPressed}
      activeOpacity={0.7}>
      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  );
};

const DeleteButton = ({
  onDeleteButtonPressed,
  theme,
}: DeleteButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={onDeleteButtonPressed}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.deleteButtonText,
          theme === 'dark' && styles.deleteButtonTextDark,
        ]}>
        Delete List
      </Text>
    </TouchableOpacity>
  );
};

const Home = ({navigation, route}: CategoryProps): React.JSX.Element => {
  const isFocused = useIsFocused();

  const taskCategory = route.params?.taskCategory || 'My Tasks';
  const onDeleteCategory = route.params?.onDeleteCategory;

  const {theme} = useContext(ThemeContext) as ThemeContextType;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task>();

  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
  const [isDeleteCategoryModalVisible, setIsDeleteCategoryModalVisible] =
    useState(false);

  const [deletedTask, setDeletedTask] = useState<Task>();
  const [deletedTaskIndex, setDeletedTaskIndex] = useState<number>();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const value = await AsyncStorage.getItem(taskCategory);

        if (value !== null) {
          const categoryTasks: Task[] = JSON.parse(value);

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

  const addNotification = async (newTask: EditableTask) => {
    const presentDateString = new Date()
      .toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .split('-')
      .join(' ');

    const combinedDateTime: Date = new Date(
      newTask.date
        ? toIsoDateTime(newTask.date, newTask.time)
        : toIsoDateTime(presentDateString, newTask.time),
    );

    const presentTime = new Date().getTime();
    const taskTime = combinedDateTime.getTime();

    let triggerHour: TimestampTrigger;
    let triggerFiveMin: TimestampTrigger;
    let triggerFinal: TimestampTrigger;

    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
      triggerHour = {
        type: TriggerType.TIMESTAMP,
        timestamp: new Date(taskTime - 60 * 60 * 1000).getTime(),
        alarmManager: {
          type: AlarmType.SET_AND_ALLOW_WHILE_IDLE,
        },
      };

      triggerFiveMin = {
        type: TriggerType.TIMESTAMP,
        timestamp: new Date(taskTime - 5 * 60 * 1000).getTime(),
        alarmManager: {
          type: AlarmType.SET_AND_ALLOW_WHILE_IDLE,
        },
      };

      triggerFinal = {
        type: TriggerType.TIMESTAMP,
        timestamp: taskTime,
        alarmManager: {
          type: AlarmType.SET_ALARM_CLOCK,
        },
      };
    } else {
      await notifee.openAlarmPermissionSettings();
    }

    if (taskTime > presentTime) {
      const channelId = await notifee.createChannel({
        id: newTask.channelId,
        name: newTask.task,
        bypassDnd: true,
        sound: 'default',
        vibrationPattern: [300, 500, 500, 500, 700, 500],
        importance: AndroidImportance.HIGH,
      });

      if (taskTime > presentTime + 60 * 60 * 1000) {
        await notifee.createTriggerNotification(
          {
            title: newTask.task,
            body: 'Task Reminder - 1 hour to go!',
            android: {
              channelId,
              smallIcon: 'todo_icon_small',
              largeIcon: 'todo_icon',
              showTimestamp: true,
              color: '#5CFAB2',
              pressAction: {
                id: newTask.id,
                launchActivity: 'default',
              },
            },
          },
          triggerHour,
        );
      }

      if (taskTime > presentTime + 5 * 60 * 1000) {
        await notifee.createTriggerNotification(
          {
            title: newTask.task,
            body: 'Task Reminder - 5 minutes to go!',
            android: {
              channelId,
              smallIcon: 'todo_icon_small',
              largeIcon: 'todo_icon',
              showTimestamp: true,
              color: '#5CFAB2',
              pressAction: {
                id: newTask.id,
                launchActivity: 'default',
              },
            },
          },
          triggerFiveMin,
        );
      }

      await notifee.createTriggerNotification(
        {
          title: newTask.task,
          body: `Task Reminder - ${newTask.time}`,
          android: {
            channelId,
            smallIcon: 'todo_icon_small',
            largeIcon: 'todo_icon',
            showTimestamp: true,
            color: '#5CFAB2',
            pressAction: {
              id: newTask.id,
              launchActivity: 'default',
            },
          },
        },
        triggerFinal,
      );
    }
  };

  const showAddTaskModal = () => setIsAddTaskModalVisible(true);
  const hideAddTaskModal = () => setIsAddTaskModalVisible(false);

  const showEditTaskModal = () => setIsEditTaskModalVisible(true);
  const hideEditTaskModal = () => {
    setIsEditTaskModalVisible(false);
    setSelectedTask(undefined);
  };

  const showDeleteCategoryModal = () => setIsDeleteCategoryModalVisible(true);
  const hideDeleteCategoryModal = () => setIsDeleteCategoryModalVisible(false);

  const onAddButtonPressed = () => {
    showAddTaskModal();
  };

  const onDeleteButtonPressed = () => {
    showDeleteCategoryModal();
  };

  const onDeleteCategoryConfirm = async () => {
    hideDeleteCategoryModal();

    if (onDeleteCategory !== undefined && taskCategory !== 'My Tasks') {
      tasks.map(item => {
        notifee.deleteChannel(item.id);
      });

      await AsyncStorage.removeItem(taskCategory);
      await onDeleteCategory(taskCategory);
    }
  };

  const onTaskItemPressed = (task: Task) => {
    setSelectedTask(task);
    showEditTaskModal();
  };

  const onAdd = async (newTask: Task) => {
    try {
      const value = await AsyncStorage.getItem(taskCategory);
      let categoryTasks: Task[] = [];

      if (value !== null) {
        categoryTasks = JSON.parse(value);
      }

      if (Array.isArray(categoryTasks)) {
        const updatedTasks = [...categoryTasks, newTask];

        await AsyncStorage.setItem(taskCategory, JSON.stringify(updatedTasks));

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTasks(updatedTasks);

        if (newTask.date || newTask.time) {
          addNotification(newTask);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          'Failed to store the task into phone memory:',
          error.message,
        );
      }
    }
  };

  const onEdit = async (editedTask: EditableTask) => {
    try {
      const value = await AsyncStorage.getItem(taskCategory);
      let categoryTasks: Task[] = [];

      if (value !== null) {
        categoryTasks = JSON.parse(value);
      }

      if (Array.isArray(categoryTasks)) {
        const updatedTasks = categoryTasks.map((item: Task) =>
          item.id === editedTask.id
            ? {
                ...item,
                task: editedTask.task,
                date: editedTask.date,
                time: editedTask.time,
              }
            : item,
        );

        await AsyncStorage.setItem(taskCategory, JSON.stringify(updatedTasks));

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTasks(updatedTasks);

        if (editedTask.date || editedTask.time) {
          addNotification(editedTask);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to edit the task:', error.message);
      }
    }
  };

  const onDelete = (taskId: string, taskIndex: number) => {
    try {
      if (tasks.length > 0) {
        const updatedTasks = tasks.filter((item: Task) => item.id !== taskId);

        AsyncStorage.setItem(taskCategory, JSON.stringify(updatedTasks));

        setDeletedTask(tasks.find((item: Task) => item.id === taskId));
        setDeletedTaskIndex(taskIndex);
        setTasks(updatedTasks);

        notifee.deleteChannel(taskId);

        setIsSnackbarVisible(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to delete the task:', error.message);
      }
    }
  };

  const undoDelete = () => {
    try {
      if (deletedTask && deletedTaskIndex !== undefined) {
        const updatedTasks = [...tasks];
        updatedTasks.splice(deletedTaskIndex, 0, deletedTask);

        AsyncStorage.setItem(taskCategory, JSON.stringify(updatedTasks));

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setTasks(updatedTasks);

        if (deletedTask.date || deletedTask.time) {
          addNotification(deletedTask);
        }

        setDeletedTask(undefined);
        setDeletedTaskIndex(undefined);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to undo the deletion:', error.message);
      }
    }
  };

  const onToggleComplete = (taskId: string) => {
    try {
      const updatedTasks = tasks.map((item: Task) =>
        item.id === taskId ? {...item, completed: !item.completed} : item,
      );

      AsyncStorage.setItem(taskCategory, JSON.stringify(updatedTasks));

      const task = tasks.find(item => item.id === taskId);

      if (task?.date || task?.time) {
        if (task.completed) {
          addNotification(task);
        } else {
          notifee.deleteChannel(taskId);
        }
      }

      setTasks(updatedTasks);
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to mark task as complete:', error.message);
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.screen, theme === 'dark' && styles.darkScreen]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#121212' : '#FFF6E9'}
      />
      <Portal>
        <Modal
          visible={isDeleteCategoryModalVisible}
          onDismiss={hideDeleteCategoryModal}
          contentContainerStyle={styles.deleteCategoryModalContent}>
          <DeleteCategoryConfirm
            hideDeleteCategoryModal={hideDeleteCategoryModal}
            onDelete={onDeleteCategoryConfirm}
          />
        </Modal>
      </Portal>

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
          {taskCategory !== 'My Tasks' ? (
            <View style={styles.deleteButtonWrapper}>
              {/* <Text style={styles.headingText}>Tasks</Text> */}
              <DeleteButton
                onDeleteButtonPressed={onDeleteButtonPressed}
                theme={theme}
              />
            </View>
          ) : (
            // <View style={styles.emptyWrapper} />
            <DarkModeToggleSwitch />
          )}

          <TasksList
            onTaskItemPressed={onTaskItemPressed}
            tasks={tasks}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        </View>
      </ScrollView>

      <AddButton onAddButtonPressed={onAddButtonPressed} theme={theme} />

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
  darkScreen: {
    backgroundColor: '#121212',
  },
  modalContent: {
    height: 320,
    marginHorizontal: 24,
  },
  deleteCategoryModalContent: {
    height: 200,
    marginHorizontal: 24,
  },
  container: {
    // marginTop: 64,
  },
  deleteButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyWrapper: {
    marginVertical: 18,
  },
  headingText: {
    fontWeight: '700',
    fontSize: 36,
    color: '#2B2D42',
  },
  headingTextDark: {
    color: '#FFF',
    opacity: 0.87,
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
    fontFamily: 'NunitoSans-SemiBold',
  },
  deleteButtonTextDark: {
    color: '#FFF',
    opacity: 0.87,
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
    borderColor: '#000',
    shadowColor: '#33B249',
    elevation: 10,
  },
  buttonDark: {
    borderColor: '#FFF',
  },
  buttonText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
});
