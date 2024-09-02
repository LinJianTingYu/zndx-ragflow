import MessageItem from '@/components/message-item';
import DocumentPreviewer from '@/components/pdf-previewer';
import { MessageType } from '@/constants/chat';
import { useTranslate } from '@/hooks/common-hooks';
import { ClockCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Drawer,
  Flex,
  Input,
  message,
  Row,
  Spin,
  Tag,
} from 'antd';
import {
  useClickDrawer,
  useExportContentToTXT,
  useFetchConversationOnMount,
  useGetFileIcon,
  useGetSendButtonDisabled,
  useSelectConversationLoading,
  useSelectCurrentDialog,
  useSendButtonDisabled,
  useSendMessage,
} from '../hooks';
import { buildMessageItemReference } from '../utils';

import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { IDialog } from '@/interfaces/database/chat';
import { useMemo } from 'react';
import styles from './index.less';

const ChatContainer = () => {
  const {
    ref,
    currentConversation: conversation,
    addNewestConversation,
    removeLatestMessage,
    addNewestAnswer,
  } = useFetchConversationOnMount();
  const {
    handleInputChange,
    handlePressEnter,
    handleReGenerateContent,
    value,
    setValue,
    loading: sendLoading,
  } = useSendMessage(
    conversation,
    addNewestConversation,
    removeLatestMessage,
    addNewestAnswer,
  );
  const { visible, hideModal, documentId, selectedChunk, clickDocumentButton } =
    useClickDrawer();
  const disabled = useGetSendButtonDisabled();
  const sendDisabled = useSendButtonDisabled(value);
  const currentDialog: IDialog = useSelectCurrentDialog();
  useGetFileIcon();
  const loading = useSelectConversationLoading();
  const { t } = useTranslate('chat');
  const { data: userInfo } = useFetchUserInfo();
  const handleExport = useExportContentToTXT();
  const handleReGenerate = (content: string) => {
    if (loading) return;
    handleReGenerateContent(content);
  };

  const handleExportMessage = () => {
    if (!conversation?.message?.length)
      return message.error('没有对话记录可以导出');
    // 定义要写入文件的内容
    let content = ``;
    conversation.message.map((item) => {
      content += `${item.role === 'user' ? `${userInfo.nickname}:\n` : `${currentDialog.name}:\n`}${item.content}\n\n`;
    });
    handleExport({
      content,
      fileName: `${currentDialog.name}_对话记录_${new Date().getTime()}.txt`,
    });
  };

  const lasetQuestionStr = useMemo(() => {
    return (
      conversation?.message?.findLast((item) => item.role === 'user')
        ?.content || ''
    );
  }, [conversation]);

  return (
    <>
      <Flex flex={1} className={styles.chatContainer} vertical>
        <Row
          justify="space-between"
          align="middle"
          style={{
            padding: '12px 16px',
            backgroundColor: '#fbfbfc',
            // color: '#fff',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <Col
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              marginRight: 12,
              width: 'calc(100% - 200px)',
            }}
          >
            {lasetQuestionStr && `${t('askQuestion')}：${lasetQuestionStr}`}
          </Col>
          <span>
            <Tag color="geekblue" style={{ lineHeight: '22px' }}>
              <ClockCircleOutlined />
              <span style={{ marginLeft: 4 }}>
                {t('qaNumber',{number: conversation?.message?.length||0})}
              </span>
            </Tag>
            <Button type="primary" size="small" onClick={handleExportMessage}>
              {t('exportQA')}
            </Button>
          </span>
        </Row>
        <Flex flex={1} vertical className={styles.messageContainer}>
          <div>
            <Spin spinning={loading}>
              {conversation?.message?.map((message, i) => {
                return (
                  <MessageItem
                    loading={
                      message.role === MessageType.Assistant &&
                      sendLoading &&
                      conversation?.message.length - 1 === i
                    }
                    key={message.id}
                    item={message}
                    nickname={userInfo.nickname}
                    assistantName={currentDialog.name}
                    currentDialog={currentDialog}
                    avatar={userInfo.avatar}
                    reference={buildMessageItemReference(conversation, message)}
                    clickDocumentButton={clickDocumentButton}
                    handleReGenerate={handleReGenerate}
                  ></MessageItem>
                );
              })}
            </Spin>
          </div>
          <div ref={ref} />
        </Flex>
        <Row style={{ padding: '0 16px 12px' }}>
          <Input
            size="large"
            placeholder={t('sendPlaceholder')}
            value={value}
            disabled={disabled}
            suffix={
              <Button
                type="primary"
                onClick={handlePressEnter}
                loading={sendLoading}
                disabled={sendDisabled}
              >
                {t('send')}
              </Button>
            }
            onPressEnter={handlePressEnter}
            onChange={handleInputChange}
          />
        </Row>
      </Flex>
      <Drawer
        title="Document Previewer"
        onClose={hideModal}
        open={visible}
        width={'50vw'}
      >
        <DocumentPreviewer
          documentId={documentId}
          chunk={selectedChunk}
          visible={visible}
        ></DocumentPreviewer>
      </Drawer>
    </>
  );
};

export default ChatContainer;
