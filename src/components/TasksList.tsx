import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  LayoutAnimation,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

type TaskItemProps = {
  id: string;
  task: string;
  bgColor: string;
  completed: boolean;
  date: string | undefined;
  time: string | undefined;
  onTaskItemPressed: (task: Task) => void;
  handleDelete: (taskId: string) => void;
  handleTaskCirclePress: (taskId: string) => void;
};

interface TasksListProps {
  onTaskItemPressed: (task: Task) => void;
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskItem = ({
  id,
  task,
  bgColor,
  completed,
  date,
  time,
  onTaskItemPressed,
  handleDelete,
  handleTaskCirclePress,
}: TaskItemProps): React.JSX.Element => {
  const swipeAnim = useRef(new Animated.Value(0)).current;

  const onSwipeableWillOpen = (direction: 'left' | 'right') => {
    const moveTo = direction === 'left' ? 3000 : -3000;

    Animated.timing(swipeAnim, {
      toValue: moveTo,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      handleDelete(id);
    });
  };

  const renderActions = (
    dragX: Animated.AnimatedInterpolation<number>,
    actionType: 'left' | 'right',
  ) => {
    const scale = dragX.interpolate({
      inputRange: actionType === 'left' ? [0, 75] : [-75, 0],
      outputRange: actionType === 'left' ? [0, 1] : [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.deleteIconWrapper, {transform: [{scale}]}]}>
        <Image
          source={require('../assets/delete-icon.png')}
          style={styles.deleteIcon}
        />
      </Animated.View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={(_progress, dragX) => renderActions(dragX, 'left')}
      renderRightActions={(_progress, dragX) => renderActions(dragX, 'right')}
      onSwipeableWillOpen={onSwipeableWillOpen}
      leftThreshold={120}
      rightThreshold={120}>
      <Animated.View style={{transform: [{translateX: swipeAnim}]}}>
        <TouchableOpacity
          style={[
            styles.taskItem,
            {backgroundColor: bgColor},
            completed && {opacity: 0.6},
          ]}
          onPress={() =>
            onTaskItemPressed({id, task, bgColor, completed, date, time})
          }
          activeOpacity={0.5}>
          <View style={styles.taskTextWrapper}>
            <TouchableOpacity
              style={styles.taskCompleteCircle}
              onPress={() => handleTaskCirclePress(id)}>
              {completed ? (
                <Icon name="check-circle" size={20} color="#000" />
              ) : (
                <Icon name="circle" size={20} color="#000" />
              )}
            </TouchableOpacity>
            <Text
              style={[
                styles.taskText,
                completed && {textDecorationLine: 'line-through'},
              ]}>
              {task}
            </Text>
          </View>
          {(date || time) && (
            <View style={styles.dateTimeWrapper}>
              <Text style={styles.dateTimeText}>{date}</Text>
              <Text style={styles.dateTimeText}>{time}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );
};

const TasksList = ({
  onTaskItemPressed,
  tasks,
  onDelete,
  onToggleComplete,
}: TasksListProps): React.JSX.Element => {
  const incompleteTasks = tasks.filter(task => task.completed === false);
  const completedTasks = tasks.filter(task => task.completed === true);

  const handleDelete = (taskId: string) => {
    onDelete(taskId);

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
          renderItem={({item}) => (
            <TaskItem
              id={item.id.toString()}
              task={item.task}
              bgColor={item.bgColor}
              completed={item.completed}
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
            renderItem={({item}) => (
              <TaskItem
                id={item.id.toString()}
                task={item.task}
                bgColor={item.bgColor}
                completed={item.completed}
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
  taskItem: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 16,
    marginVertical: 12,
    marginHorizontal: 24,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  taskTextWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskCompleteCircle: {
    paddingBottom: 10,
    paddingRight: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#2B2D42',
  },
  deleteIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  deleteIcon: {
    width: 50,
    height: 50,
  },
  dateTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#3D4654',
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
    fontWeight: '700',
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
    fontSize: 18,
    color: '#2B2D42',
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
  },
});
