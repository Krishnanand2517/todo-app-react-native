import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';

type TaskItemProps = {
  id: string;
  task: string;
  date: string | undefined;
  time: string | undefined;
  onTaskItemPressed: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
};

interface TasksListProps {
  onTaskItemPressed: (task: Task) => void;
  tasks: Task[];
  onDelete: (taskId: string) => Promise<void>;
}

const TaskItem = ({
  id,
  task,
  date,
  time,
  onTaskItemPressed,
  onDelete,
}: TaskItemProps): React.JSX.Element => {
  const swipeAnim = useRef(new Animated.Value(0)).current;

  const onSwipeableWillOpen = (direction: 'left' | 'right') => {
    const moveTo = direction === 'left' ? 9999 : -9999;

    Animated.timing(swipeAnim, {
      toValue: moveTo,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      onDelete(id);
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
      leftThreshold={150}
      rightThreshold={150}>
      <Animated.View style={{transform: [{translateX: swipeAnim}]}}>
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
      </Animated.View>
    </Swipeable>
  );
};

const TasksList = ({
  onTaskItemPressed,
  tasks,
  onDelete,
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
              onDelete={onDelete}
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
    </View>
  );
};

export default TasksList;

const styles = StyleSheet.create({
  listWrapper: {
    marginTop: 36,
  },
  taskItem: {
    backgroundColor: '#CAF0F8',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 16,
    marginVertical: 12,
    marginHorizontal: 24,
    paddingHorizontal: 12,
    paddingVertical: 12,
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
    color: '#8D99AE',
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
});
