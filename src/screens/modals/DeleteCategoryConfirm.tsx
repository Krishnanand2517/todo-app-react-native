import React, {useContext} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import ThemeContext, {ThemeContextType} from '../../context/ThemeContext';

interface DeleteCategoryConfirmProps {
  hideDeleteCategoryModal: () => void;
  onDelete: () => Promise<void>;
}

const DeleteCategoryConfirm = ({
  hideDeleteCategoryModal,
  onDelete,
}: DeleteCategoryConfirmProps): React.JSX.Element => {
  const {theme} = useContext(ThemeContext) as ThemeContextType;

  const onCancelButtonPressed = () => {
    hideDeleteCategoryModal();
  };

  const onDeleteButtonPressed = () => {
    onDelete();
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.containerDark]}>
      <Text
        style={[
          styles.headingText,
          theme === 'dark' && styles.headingTextDark,
        ]}>
        Delete List
      </Text>

      <Text
        style={[
          styles.messageText,
          theme === 'dark' && styles.messageTextDark,
        ]}>
        You can't undo this action. Are you sure?
      </Text>

      <View style={styles.actionButtonsWrapper}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onCancelButtonPressed}>
          <Text style={[styles.cancelButtonText, styles.cancelButtonTextDark]}>
            No
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDeleteButtonPressed}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeleteCategoryConfirm;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    justifyContent: 'space-between',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  headingText: {
    fontSize: 24,
    color: '#2B2D42',
    fontFamily: 'NunitoSans-Bold',
  },
  headingTextDark: {
    color: '#FFF',
    opacity: 0.87,
  },
  messageText: {
    fontSize: 14,
    color: '#2B2D42',
    fontFamily: 'NunitoSans-Regular',
  },
  messageTextDark: {
    color: '#FFF',
    opacity: 0.87,
  },
  actionButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'NunitoSans-SemiBold',
  },
  cancelButtonTextDark: {
    color: '#FFF',
  },
  deleteButtonText: {
    color: 'tomato',
    fontSize: 16,
    fontFamily: 'NunitoSans-SemiBold',
  },
});
