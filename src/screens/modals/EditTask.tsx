import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import uuid from 'react-native-uuid';
import notifee from '@notifee/react-native';

interface EditTaskProps {
  task: Task;
  hideEditTaskModal: () => void;
  onSave: (editedTask: EditableTask) => Promise<void>;
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

const EditTask = ({
  task,
  hideEditTaskModal,
  onSave,
}: EditTaskProps): React.JSX.Element => {
  const [taskContent, setTaskContent] = useState(task.task);
  const [date, setDate] = useState(task.date);
  const [time, setTime] = useState(task.time);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  const onSaveButtonPressed = async () => {
    const oldChannelId = task.channelId;

    if (taskContent !== '') {
      const editedTask: EditableTask = {
        id: task.id,
        task: taskContent,
        channelId: uuid.v4().toString(),
        date,
        time,
      };

      onSave(editedTask);
      hideEditTaskModal();
      notifee.deleteChannel(oldChannelId);
    }
  };

  const onCancelButtonPressed = () => {
    hideEditTaskModal();
  };

  const onAddDateButtonPressed = () => setDateModalOpen(true);
  const onAddTimeButtonPressed = () => setTimeModalOpen(true);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headWrapper}>
          <Text style={styles.headingText}>Edit Task</Text>
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

export default EditTask;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
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
  button: {
    backgroundColor: '#33B249',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    elevation: 5,
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
