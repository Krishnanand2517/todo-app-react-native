import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {SAMPLE_DATA} from '../data/sampleData';

type TaskItemProps = {
  task: string;
  date: string | undefined;
  time: string | undefined;
};

const TaskItem = ({task, date, time}: TaskItemProps): React.JSX.Element => (
  <View style={styles.taskItem}>
    <Text style={styles.taskText}>{task}</Text>
    {(date || time) && (
      <View style={styles.dateTimeWrapper}>
        <Text style={styles.dateTimeText}>{date}</Text>
        <Text style={styles.dateTimeText}>{time}</Text>
      </View>
    )}
  </View>
);

const TasksList = (): React.JSX.Element => {
  return (
    <View style={styles.listWrapper}>
      <FlatList
        data={SAMPLE_DATA}
        renderItem={({item}) => (
          <TaskItem task={item.task} date={item.date} time={item.time} />
        )}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
      />
    </View>
  );
};

export default TasksList;

const styles = StyleSheet.create({
  listWrapper: {
    marginTop: 36,
  },
  taskList: {
    marginBottom: 256,
  },
  taskItem: {
    backgroundColor: '#CAF0F8',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#2B2D42',
  },
  dateTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#8D99AE',
  },
});
