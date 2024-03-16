import React from 'react';
import {StyleSheet, Text, View, FlatList, LayoutAnimation} from 'react-native';

import TaskItem from './TaskItem';

interface TasksListProps {
  onTaskItemPressed: (task: Task) => void;
  tasks: Task[];
  onDelete: (taskId: string, taskIndex: number) => void;
  onToggleComplete: (taskId: string) => void;
}

const TasksList = ({
  onTaskItemPressed,
  tasks,
  onDelete,
  onToggleComplete,
}: TasksListProps): React.JSX.Element => {
  const incompleteTasks = tasks.filter(task => task.completed === false);
  const completedTasks = tasks.filter(task => task.completed === true);

  const handleDelete = (taskId: string, taskIndex: number) => {
    onDelete(taskId, taskIndex);

    LayoutAnimation.configureNext({
      duration: 300,
      update: {type: LayoutAnimation.Types.easeInEaseOut},
      delete: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  };

  const handleTaskCirclePress = (taskId: string) => {
    onToggleComplete(taskId);

    LayoutAnimation.configureNext({
      duration: 300,
      update: {type: LayoutAnimation.Types.easeInEaseOut},
      delete: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  };

  return (
    <View style={styles.listWrapper}>
      {incompleteTasks.length > 0 ? (
        <FlatList
          data={incompleteTasks}
          renderItem={({item, index}) => (
            <TaskItem
              index={index}
              id={item.id.toString()}
              task={item.task}
              bgColor={item.bgColor}
              completed={item.completed}
              category={item.category}
              date={item.date}
              time={item.time}
              onTaskItemPressed={onTaskItemPressed}
              handleDelete={handleDelete}
              handleTaskCirclePress={handleTaskCirclePress}
            />
          )}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          inverted
        />
      ) : (
        <View style={styles.noTaskTextWrapper}>
          <Text style={styles.noTaskText}>
            {'No tasks here.\nAdd one by pressing the green button!'}
          </Text>
        </View>
      )}

      <View style={styles.completedSection}>
        <Text style={styles.completedHeader}>Completed</Text>
        {completedTasks.length > 0 ? (
          <FlatList
            data={completedTasks}
            renderItem={({item, index}) => (
              <TaskItem
                index={index}
                id={item.id.toString()}
                task={item.task}
                bgColor={item.bgColor}
                completed={item.completed}
                category={item.category}
                date={item.date}
                time={item.time}
                onTaskItemPressed={onTaskItemPressed}
                handleDelete={handleDelete}
                handleTaskCirclePress={handleTaskCirclePress}
              />
            )}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            inverted
          />
        ) : (
          <View style={styles.noCompletedTextWrapper}>
            <Text style={styles.noCompletedText}>
              Still waiting for you to complete your tasks...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TasksList;

const styles = StyleSheet.create({
  listWrapper: {
    marginTop: 36,
  },
  completedSection: {
    marginTop: 48,
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#D3D3D3',
  },
  completedHeader: {
    marginVertical: 12,
    marginHorizontal: 24,
    fontSize: 20,
    fontFamily: 'NunitoSans-Bold',
    color: '#2B2D42',
  },
  noTaskTextWrapper: {
    marginTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0A79DF',
    borderRadius: 8,
    marginHorizontal: 24,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  noTaskText: {
    fontSize: 16,
    color: '#2B2D42',
    fontFamily: 'NunitoSans-Regular',
  },
  noCompletedTextWrapper: {
    marginTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#0A79DF',
    borderRadius: 8,
    marginHorizontal: 24,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  noCompletedText: {
    fontSize: 14,
    color: '#2B2D42',
    fontFamily: 'NunitoSans-Regular',
  },
});
