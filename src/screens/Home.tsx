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
import {Snackbar} from 'react-native-paper';

import {RootStackParamList} from '../App';
import TasksList from '../components/TasksList';

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
      <Text style={styles.buttonText}>+ ADD</Text>
    </TouchableOpacity>
  );
};

const Home = ({navigation}: HomeProps): React.JSX.Element => {
  const isFocused = useIsFocused();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [visible, setVisible] = useState(false);
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

  const onAddButtonPressed = () => navigation.navigate('AddTask');
  const onTaskItemPressed = (task: Task) =>
    navigation.navigate('EditTask', {task});

  const onDelete = (taskId: string, taskIndex: number) => {
    try {
      if (tasks.length > 0) {
        const updatedTasks = tasks.filter((item: Task) => item.id !== taskId);

        AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

        setDeletedTask(tasks.find((item: Task) => item.id === taskId));
        setDeletedTaskIndex(taskIndex);
        setTasks(updatedTasks);
        setVisible(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to delete the task');
      }
    }
  };

  const undoDelete = () => {
    try {
      if (deletedTask && deletedTaskIndex) {
        const updatedTasks = [...tasks];
        updatedTasks.splice(deletedTaskIndex, 0, deletedTask);

        AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

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
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headWrapper}>
            <Text style={styles.headingText}>Tasks</Text>
            <AddButton onAddButtonPressed={onAddButtonPressed} />
          </View>

          <TasksList
            onTaskItemPressed={onTaskItemPressed}
            tasks={tasks}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        </View>
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3500}
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
    backgroundColor: '#33B249',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});
