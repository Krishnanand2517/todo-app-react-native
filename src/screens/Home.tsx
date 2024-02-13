import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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
  const onAddButtonPressed = () => navigation.navigate('AddTask');
  const onTaskItemPressed = () => navigation.navigate('EditTask');

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headWrapper}>
            <Text style={styles.headingText}>Tasks</Text>
            <AddButton onAddButtonPressed={onAddButtonPressed} />
          </View>

          <TasksList onTaskItemPressed={onTaskItemPressed} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

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
    fontSize: 36,
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
});
