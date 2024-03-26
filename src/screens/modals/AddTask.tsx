import React, {useState, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import uuid from 'react-native-uuid';
import DatePicker from 'react-native-date-picker';

import ThemeContext, {ThemeContextType} from '../../context/ThemeContext';
import {bgColors} from '../../data/taskItemBgColors';

interface AddTaskProps {
  hideAddTaskModal: () => void;
  onSave: (newTask: Task) => Promise<void>;
  taskCategory: string;
}

interface AddDateButtonProps {
  onAddDateButtonPressed: () => void;
}

interface AddTimeButtonProps {
  onAddTimeButtonPressed: () => void;
}

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

const AddTask = ({
  hideAddTaskModal,
  onSave,
  taskCategory,
}: AddTaskProps): React.JSX.Element => {
  const {theme} = useContext(ThemeContext) as ThemeContextType;

  const [taskContent, setTaskContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  const onSaveButtonPressed = async () => {
    if (taskContent !== '') {
      // Randomly choosing bgColor
      const randomIndex = Math.floor(Math.random() * bgColors.length);
      const randomColor = bgColors[randomIndex];

      const newTask: Task = {
        id: uuid.v4().toString(),
        task: taskContent,
        bgColor: randomColor,
        completed: false,
        channelId: uuid.v4().toString(),
        category: taskCategory,
        date,
        time,
      };

      await onSave(newTask);
    }
    hideAddTaskModal();
  };

  const onCancelButtonPressed = () => {
    hideAddTaskModal();
  };

  const onAddDateButtonPressed = () => setDateModalOpen(true);
  const onAddTimeButtonPressed = () => setTimeModalOpen(true);

  return (
    <SafeAreaView
      style={[styles.screen, theme === 'dark' && styles.screenDark]}>
      <View style={styles.container}>
        <View style={styles.headWrapper}>
          <Text
            style={[
              styles.headingText,
              theme === 'dark' && styles.headingTextDark,
            ]}>
            Add Task
          </Text>
        </View>
        <View style={styles.taskInputWrapper}>
          <TextInput
            style={[styles.taskInput, theme === 'dark' && styles.taskInputDark]}
            value={taskContent}
            onChangeText={setTaskContent}
          />
        </View>
        <View style={styles.dateTimeButtonsWrapper}>
          <View style={styles.dateTimeSection}>
            <AddDateButton onAddDateButtonPressed={onAddDateButtonPressed} />
            {date && (
              <TouchableOpacity
                style={styles.dateTimeTextWrapper}
                onPress={onAddDateButtonPressed}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.dateTimeText,
                    theme === 'dark' && styles.dateTimeTextDark,
                  ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dateTimeSection}>
            <AddTimeButton onAddTimeButtonPressed={onAddTimeButtonPressed} />
            {time && (
              <TouchableOpacity
                style={styles.dateTimeTextWrapper}
                onPress={onAddTimeButtonPressed}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.dateTimeText,
                    theme === 'dark' && styles.dateTimeTextDark,
                  ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.actionButtonsWrapper}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onCancelButtonPressed}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onSaveButtonPressed}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
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
    backgroundColor: '#FFF',
    borderRadius: 16,
  },
  screenDark: {
    backgroundColor: '#121212',
  },
  container: {
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  headWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 24,
    color: '#2B2D42',
    fontFamily: 'NunitoSans-Bold',
  },
  headingTextDark: {
    color: '#FFF',
    opacity: 0.87,
  },
  taskInputWrapper: {
    marginTop: 32,
  },
  taskInput: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#2B2D42',
    fontFamily: 'NunitoSans-Regular',
  },
  taskInputDark: {
    borderColor: '#FFF',
    color: '#FFF',
    opacity: 0.87,
  },
  dateTimeButtonsWrapper: {
    marginTop: 24,
    rowGap: 14,
  },
  dateTimeButton: {
    backgroundColor: '#0A79DF',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 5,
  },
  dateTimeButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontFamily: 'NunitoSans-Bold',
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
    fontFamily: 'NunitoSans-Regular',
  },
  dateTimeTextDark: {
    color: '#FFF',
    opacity: 0.87,
  },
  actionButtonsWrapper: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: 'tomato',
    fontSize: 16,
    fontFamily: 'NunitoSans-SemiBold',
  },
  saveButtonText: {
    color: '#33B249',
    fontSize: 16,
    fontFamily: 'NunitoSans-SemiBold',
  },
});
