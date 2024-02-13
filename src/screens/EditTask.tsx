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

import {RootStackParamList} from '../App';

type EditTaskProps = NativeStackScreenProps<RootStackParamList, 'EditTask'>;

interface DoneButtonProps {
  onDoneButtonPressed: () => void;
}

const DoneButton = ({
  onDoneButtonPressed,
}: DoneButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onDoneButtonPressed}
      activeOpacity={0.7}>
      <Text style={styles.buttonText}>DONE</Text>
    </TouchableOpacity>
  );
};

const EditTask = ({navigation}: EditTaskProps): React.JSX.Element => {
  const [taskContent, setTaskContent] = useState('');

  const onDoneButtonPressed = () => navigation.navigate('Home');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headWrapper}>
        <Text style={styles.headingText}>Edit Task</Text>
        <DoneButton onDoneButtonPressed={onDoneButtonPressed} />
      </View>
      <View style={styles.taskInputWrapper}>
        <TextInput
          style={styles.taskInput}
          value={taskContent}
          onChangeText={setTaskContent}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditTask;

const styles = StyleSheet.create({
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
    borderRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
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
});
