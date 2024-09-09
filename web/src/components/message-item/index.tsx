import { ReactComponent as AssistantIcon } from '@/assets/svg/assistant.svg';
import { ReactComponent as QuoteIcon } from '@/assets/svg/quote.svg';
import { MessageType } from '@/constants/chat';
import { useTranslate } from '@/hooks/common-hooks';
import { useSelectFileThumbnails } from '@/hooks/knowledge-hooks';
import { IReference, Message } from '@/interfaces/database/chat';
import { IChunk } from '@/interfaces/database/knowledge';
import classNames from 'classnames';
import { useMemo, useState } from 'react';

import MarkdownContent from '@/pages/chat/markdown-content';
import { Avatar, Col, Flex, Row, Tooltip } from 'antd';
import styles from './index.less';

import CopyToClipboard from '@/components/copy-to-clipboard';
import { UndoOutlined } from '@ant-design/icons';
import ReferenceDetailModal from '../reference-detail';

interface IProps {
  item: Message;
  reference: IReference;
  loading?: boolean;
  nickname?: string;
  avatar?: string;
  assistantName?: string;
  clickDocumentButton?: (documentId: string, chunk: IChunk) => void;
  handleReGenerate: (content: string) => void;
}

const MessageItem = ({
  item,
  reference,
  loading = false,
  avatar = '',
  nickname = '',
  assistantName,
  clickDocumentButton,
  handleReGenerate,
}: IProps) => {
  const isAssistant = item.role === MessageType.Assistant;
  const { t } = useTranslate('chat');
  const fileThumbnails = useSelectFileThumbnails();
  const [referenceDetailVisible, setReferenceDetailVisible] = useState(false);
  const [referenceDetailData, setReferenceDetailData] = useState<IChunk>();

  const referenceDocumentList = useMemo(() => {
    console.log('reference', reference);
    return reference?.chunks ?? [];
  }, [reference?.doc_aggs]);

  const content = useMemo(() => {
    let text = item.content;
    if (text === '') {
      text = t('searching');
    }
    return loading ? text?.concat('~~2$$') : text;
  }, [item.content, loading, t]);

  const hideReferenceDetailModal = () => {
    setReferenceDetailVisible(false);
  };
  const handleOpenReferenceDetailModal = (item: IChunk) => {
    setReferenceDetailData(item);
    setReferenceDetailVisible(true);
  };

  return (
    <div
      className={classNames(styles.messageItem, {
        [styles.messageItemLeft]: item.role === MessageType.Assistant,
        [styles.messageItemRight]: item.role === MessageType.User,
      })}
    >
      <section
        className={classNames(styles.messageItemSection, {
          [styles.messageItemSectionLeft]: item.role === MessageType.Assistant,
          [styles.messageItemSectionRight]: item.role === MessageType.User,
        })}
      >
        <div
          className={classNames(styles.messageItemContent, {
            [styles.messageItemContentReverse]: item.role === MessageType.User,
          })}
        >
          {item.role === MessageType.User ? (
            <Avatar
              size={40}
              src={
                avatar ??
                'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
              }
            />
          ) : (
            <AssistantIcon></AssistantIcon>
          )}
          <Flex vertical gap={8} flex={1}>
            <Flex
              style={{
                flexDirection: isAssistant ? 'row' : 'row-reverse',
              }}
            >
              <b style={{ marginRight: 8 }}>
                {isAssistant ? assistantName : nickname}
              </b>
              {!isAssistant && (
                <Tooltip placement="bottom" title="重新生成" color="#5b77e3">
                  <UndoOutlined
                    width={14}
                    style={{
                      color: '#8a95a7',
                      cursor: 'pointer',
                      margin: '0 8px',
                    }}
                    onClick={() => handleReGenerate(content)}
                  />
                </Tooltip>
              )}

              <span style={{ color: '#8a95a7' }}>
                <CopyToClipboard text={content} />
              </span>
            </Flex>
            <div
              className={
                isAssistant ? styles.messageText : styles.messageUserText
              }
            >
              <MarkdownContent
                content={content}
                reference={reference}
                clickDocumentButton={clickDocumentButton}
              ></MarkdownContent>
            </div>
            {isAssistant && referenceDocumentList.length > 0 && (
              <div className={styles['reference-wrapper']}>
                <Row align={'middle'} className={styles['card-header']}>
                  <QuoteIcon />
                  <span
                    style={{
                      marginLeft: 6,
                    }}
                  >
                    参考资料
                  </span>
                </Row>
                <Row className={styles['reference-list']} gutter={[8, 8]}>
                  {referenceDocumentList.map((item, index) => {
                    return (
                      <Col
                        key={index}
                        xxl={8}
                        xl={12}
                        lg={24}
                        md={24}
                        sm={24}
                        xs={24}
                      >
                        <div
                          className={styles['reference-item']}
                          onClick={() => handleOpenReferenceDetailModal(item)}
                        >
                          <div
                            className="title"
                            style={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            [{index + 1}] {item.docnm_kwd}
                          </div>
                          <div className={styles['content']}>
                            {item.content_with_weight}
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            )}
          </Flex>
        </div>
      </section>
      <ReferenceDetailModal
        referenceDetailData={referenceDetailData}
        visible={referenceDetailVisible}
        handleOk={hideReferenceDetailModal}
        hideModal={hideReferenceDetailModal}
      />
    </div>
  );
};

export default MessageItem;
