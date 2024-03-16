import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

interface DeleteCategoryConfirmProps {
  hideDeleteCategoryModal: () => void;
  onDelete: () => Promise<void>;
}

const DeleteCategoryConfirm = ({
  hideDeleteCategoryModal,
  onDelete,
}: DeleteCategoryConfirmProps): React.JSX.Element => {
  const onCancelButtonPressed = () => {
    hideDeleteCategoryModal();
  };

  const onDeleteButtonPressed = () => {
    onDelete();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Delete List</Text>

      <Text style={styles.messageText}>
        You can't undo this action. Are you sure?
      </Text>

      <View style={styles.actionButtonsWrapper}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onCancelButtonPressed}>
          <Text style={styles.cancelButtonText}>No</Text>
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
  headingText: {
    fontSize: 24,
    color: '#2B2D42',
    fontFamily: 'NunitoSans-Bold',
  },
  messageText: {
    fontSize: 14,
    color: '#2B2D42',
    fontFamily: 'NunitoSans-Regular',
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
  deleteButtonText: {
    color: 'tomato',
    fontSize: 16,
    fontFamily: 'NunitoSans-SemiBold',
  },
});
