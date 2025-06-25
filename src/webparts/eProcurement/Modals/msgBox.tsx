import { DefaultButton, MessageBar, MessageBarType, Modal, Stack } from '@fluentui/react';
import * as React from 'react';
import styles from '../components/EProcurement.module.scss';

interface IMsgBox {
  isOpen: boolean;
  message?: string;
  action: string;
  onDismiss?: () => void;
  referenceNumber: string;
}

const MsgBox: React.FC<IMsgBox> = ({ isOpen, onDismiss, referenceNumber, message, action }) => {
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      isBlocking={false}
      containerClassName={styles.modalContent}
    >
      <div className={styles.modalContainer}>
        <Stack tokens={{ childrenGap: 16 }}>
          <MessageBar
            messageBarType={MessageBarType.success}
            styles={{ root: { marginBottom: '16px' } }}
            isMultiline={true}
          >
            <strong>{action}!</strong>
            <br />
            <br />
            Reference Number: <strong>{referenceNumber}</strong>
 
            <br />
            <br />
            {message}
          </MessageBar>

          <Stack horizontal horizontalAlign="space-between">
            <DefaultButton
              onClick={() => onDismiss?.()}
              text="Close"
              iconProps={{ iconName: 'Cancel' }}
            />
          </Stack>
        </Stack>
      </div>
    </Modal>
  );
};

export default MsgBox;
