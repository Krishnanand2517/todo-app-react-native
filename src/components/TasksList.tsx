import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';

type TaskItemProps = {
  id: string;
  task: string;
  date: string | undefined;
  time: string | undefined;
  onTaskItemPressed: (task: Task) => void;
};

interface TasksListProps {
  onTaskItemPressed: (task: Task) => void;
  tasks: Task[];
}

const TaskItem = ({
  id,
  task,
  date,
  time,
  onTaskItemPressed,
}: TaskItemProps): React.JSX.Element => (
  <TouchableOpacity
    style={styles.taskItem}
    onPress={() => onTaskItemPressed({id, task, date, time})}
    activeOpacity={0.5}>
    <Text style={styles.taskText}>{task}</Text>
    {(date || time) && (
      <View style={styles.dateTimeWrapper}>
        <Text style={styles.dateTimeText}>{date}</Text>
        <Text style={styles.dateTimeText}>{time}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const TasksList = ({
  onTaskItemPressed,
  tasks,
}: TasksListProps): React.JSX.Element => {
  return (
    <View style={styles.listWrapper}>
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={({item}) => (
            <TaskItem
              id={item.id.toString()}
              task={item.task}
              date={item.date}
              time={item.time}
              onTaskItemPressed={onTaskItemPressed}
            />
          )}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.noTaskTextWrapper}>
          <Text style={styles.noTaskText}>
            {'No tasks here.\nAdd one by pressing the green button!'}
          </Text>
        </View>
      )}
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
    borderRadius: 16,
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
  noTaskTextWrapper: {
    marginTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0A79DF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  noTaskText: {
    fontSize: 18,
    color: '#2B2D42',
  },
});
