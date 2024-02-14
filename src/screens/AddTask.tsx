import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Feather';

import {RootStackParamList} from '../App';

type AddTaskProps = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

interface DoneButtonProps {
  onDoneButtonPressed: () => void;
}

interface AddDateButtonProps {
  onAddDateButtonPressed: () => void;
}

interface AddTimeButtonProps {
  onAddTimeButtonPressed: () => void;
}

const DoneButton = ({
  onDoneButtonPressed,
}: DoneButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onDoneButtonPressed}
      activeOpacity={0.7}>
      <Icon name="check" size={30} color="#FFF" />
    </TouchableOpacity>
  );
};

const AddDateButton = ({
  onAddDateButtonPressed,
}: AddDateButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.dateTimeButton}
      onPress={onAddDateButtonPressed}
      activeOpacity={0.7}>
      <Text style={styles.dateTimeButtonText}>Add Date</Text>
    </TouchableOpacity>
  );
};

const AddTimeButton = ({
  onAddTimeButtonPressed,
}: AddTimeButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.dateTimeButton}
      onPress={onAddTimeButtonPressed}
      activeOpacity={0.7}>
      <Text style={styles.dateTimeButtonText}>Add Time</Text>
    </TouchableOpacity>
  );
};

const AddTask = ({navigation}: AddTaskProps): React.JSX.Element => {
  const [taskContent, setTaskContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  const onDoneButtonPressed = async () => {
    if (taskContent !== '') {
      try {
        const newTask: Task = {
          id: uuid.v4().toString(),
          task: taskContent,
          date,
          time,
        };

        const value = await AsyncStorage.getItem('tasks');
        if (value !== null) {
          const allTasks = JSON.parse(value);

          await AsyncStorage.setItem(
            'tasks',
            JSON.stringify(allTasks.concat(newTask)),
          );
        } else {
          await AsyncStorage.setItem('tasks', JSON.stringify([newTask]));
        }

        navigation.navigate('Home');
      } catch (error) {
        if (error instanceof Error) {
          console.log('Failed to store the task into phone memory');
        }
      }
    }
  };

  const onAddDateButtonPressed = () => setDateModalOpen(true);
  const onAddTimeButtonPressed = () => setTimeModalOpen(true);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headWrapper}>
          <Text style={styles.headingText}>Add Task</Text>
          <DoneButton onDoneButtonPressed={onDoneButtonPressed} />
        </View>
        <View style={styles.taskInputWrapper}>
          <TextInput
            style={styles.taskInput}
            value={taskContent}
            onChangeText={setTaskContent}
          />
        </View>
        <View style={styles.dateTimeButtonsWrapper}>
          <View style={styles.dateTimeSection}>
            <AddDateButton onAddDateButtonPressed={onAddDateButtonPressed} />
            {date && (
              <View style={styles.dateTimeTextWrapper}>
                <Text style={styles.dateTimeText}>{date}</Text>
              </View>
            )}
          </View>

          <View style={styles.dateTimeSection}>
            <AddTimeButton onAddTimeButtonPressed={onAddTimeButtonPressed} />
            {time && (
              <View style={styles.dateTimeTextWrapper}>
                <Text style={styles.dateTimeText}>{time}</Text>
              </View>
            )}
          </View>
        </View>

        <DatePicker
          modal
          mode="date"
          open={dateModalOpen}
          date={new Date()}
          onConfirm={selectedDate => {
            setDateModalOpen(false);
            setDate(
              selectedDate
                .toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
                .split('-')
                .join(' '),
            );
          }}
          onCancel={() => {
            setDateModalOpen(false);
          }}
        />

        <DatePicker
          modal
          mode="time"
          open={timeModalOpen}
          date={new Date()}
          onConfirm={selectedDate => {
            setTimeModalOpen(false);
            setTime(
              selectedDate.toLocaleTimeString('en-IN', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }),
            );
          }}
          onCancel={() => {
            setTimeModalOpen(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: '#FFF6E9',
  },
  container: {
    marginTop: 64,
    paddingHorizontal: 24,
  },
  headWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    fontWeight: '700',
    fontSize: 32,
    color: '#2B2D42',
  },
  button: {
    backgroundColor: '#33B249',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    elevation: 5,
  },
  taskInputWrapper: {
    marginTop: 36,
  },
  taskInput: {
    backgroundColor: '#CAF0F8',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    marginVertical: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2B2D42',
  },
  dateTimeButtonsWrapper: {
    marginTop: 24,
    rowGap: 20,
  },
  dateTimeButton: {
    backgroundColor: '#0A79DF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 5,
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateTimeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0A79DF',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#2B2D42',
  },
});
