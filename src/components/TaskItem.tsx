import React, {useRef, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';

import {Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

import {toIsoDateTime} from '../utils/dateFunctions';
import ThemeContext, {ThemeContextType} from '../context/ThemeContext';

type TaskItemProps = {
  index: number;
  id: string;
  task: string;
  bgColor: string;
  completed: boolean;
  category: string;
  channelId: string;
  date: string | undefined;
  time: string | undefined;
  onTaskItemPressed: (task: Task) => void;
  handleDelete: (taskId: string, taskIndex: number) => void;
  handleTaskCirclePress: (taskId: string) => void;
};

const TaskItem = ({
  index,
  id,
  task,
  bgColor,
  completed,
  category,
  channelId,
  date,
  time,
  onTaskItemPressed,
  handleDelete,
  handleTaskCirclePress,
}: TaskItemProps): React.JSX.Element => {
  const {theme} = useContext(ThemeContext) as ThemeContextType;

  const swipeAnim = useRef(new Animated.Value(0)).current;

  const onSwipeableWillOpen = (direction: 'left' | 'right') => {
    const moveTo = direction === 'left' ? 3000 : -3000;

    Animated.timing(swipeAnim, {
      toValue: moveTo,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      handleDelete(id, index);
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

  const displayDateText = () => {
    if (date) {
      const today: Date = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const combinedDateTime: Date = new Date(toIsoDateTime(date, time));

      if (combinedDateTime.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (combinedDateTime.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return date;
      }
    }
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
            theme === 'dark' && styles.taskItemDark,
          ]}
          onPress={() =>
            onTaskItemPressed({
              id,
              task,
              bgColor,
              completed,
              category,
              channelId,
              date,
              time,
            })
          }
          activeOpacity={0.5}>
          <TouchableOpacity
            style={styles.taskCompleteCircle}
            onPress={() => handleTaskCirclePress(id)}>
            {completed ? (
              <Icon name="check-circle" size={20} color="#000" />
            ) : (
              <Icon name="circle" size={20} color="#000" />
            )}
          </TouchableOpacity>
          <View style={styles.taskTextWrapper}>
            <Text
              style={[
                styles.taskText,
                completed && {textDecorationLine: 'line-through'},
              ]}>
              {task}
            </Text>
            {(date || time) && (
              <View style={styles.dateTimeWrapper}>
                <Text style={styles.dateTimeText}>{displayDateText()}</Text>
                <Text style={styles.dateTimeText}>{time}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  deleteIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  deleteIcon: {
    width: 50,
    height: 50,
  },
  taskItem: {
    borderWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 4,
    borderColor: '#000',
    borderRadius: 16,
    marginVertical: 12,
    marginHorizontal: 24,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
  },
  taskItemDark: {
    borderColor: '#FFF',
  },
  taskCompleteCircle: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTextWrapper: {
    rowGap: 4,
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#2B2D42',
    fontFamily: 'NunitoSans-Regular',
  },
  dateTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#3D4654',
    fontFamily: 'NunitoSans-Light',
  },
});
