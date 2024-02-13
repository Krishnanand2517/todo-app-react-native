import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import TasksList from './components/TasksList';

const AddButton = (): React.JSX.Element => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>+ ADD</Text>
    </TouchableOpacity>
  );
};

const App = (): React.JSX.Element => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headWrapper}>
            <Text style={styles.headingText}>Tasks</Text>
            <AddButton />
          </View>

          <TasksList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
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

export default App;
