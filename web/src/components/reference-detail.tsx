import { IChunk } from '@/interfaces/database/knowledge';
import { Modal, Row, Tag } from 'antd';
// import { Divider } from 'antd/es';

interface ReferenceDetailModalProps {
  visible: boolean;
  handleOk: () => void;
  hideModal: () => void;
  referenceDetailData?: IChunk;
}

const ReferenceDetailModal = ({
  visible,
  handleOk,
  hideModal,
  referenceDetailData,
}: ReferenceDetailModalProps) => {
  return (
    <Modal
      title={referenceDetailData?.docnm_kwd}
      width={688}
      open={visible}
      onOk={handleOk}
      onCancel={hideModal}
      destroyOnClose
    >
      {/* <Divider /> */}
      <div
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: 6,
          padding: '12px 12px',
        }}
      >
        <Row>
          <Tag size="large" color="processing">
            语义检索 {referenceDetailData?.vector_similarity}
          </Tag>

          <Tag style={{ color: '#667085' }}>
            <svg
              style={{ verticalAlign: 'sub', marginRight: 4 }}
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="#667085"
              focusable="false"
            >
              <path d="M4.142 4.317v1.516c0 .13.104.234.233.234h.7a.233.233 0 0 0 .233-.234V5.25h1.167v3.526h-.674a.233.233 0 0 0-.234.234v.7c0 .128.105.233.234.233h2.515a.233.233 0 0 0 .233-.233v-.7a.233.233 0 0 0-.233-.234h-.674V5.25h1.166v.583c0 .13.105.234.234.234h.7a.233.233 0 0 0 .233-.234V4.317a.233.233 0 0 0-.233-.234H4.375a.233.233 0 0 0-.233.234Z"></path>
              <path
                clip-rule="evenodd"
                d="M4.526 1.167h4.948c.47 0 .857 0 1.173.026.328.026.63.084.912.228.44.224.796.58 1.02 1.02.144.283.202.584.228.912.026.316.026.703.026 1.173v4.948c0 .47 0 .857-.026 1.173-.026.328-.084.63-.228.912-.224.44-.58.796-1.02 1.02-.283.144-.584.202-.912.229-.316.025-.703.025-1.173.025H4.526c-.47 0-.857 0-1.173-.025-.328-.027-.63-.085-.912-.229a2.334 2.334 0 0 1-1.02-1.02c-.144-.283-.202-.584-.229-.912-.025-.316-.025-.703-.025-1.173V4.526c0-.47 0-.857.025-1.173.027-.328.085-.63.229-.912.224-.44.58-.796 1.02-1.02.283-.144.584-.202.912-.228.316-.026.703-.026 1.173-.026ZM3.448 2.355c-.256.021-.386.06-.478.106-.22.111-.398.29-.51.51-.046.09-.084.221-.105.477-.021.263-.022.602-.022 1.102v4.9c0 .5 0 .84.022 1.102.021.256.059.386.105.478.112.22.29.398.51.51.092.046.222.084.478.105.263.021.602.022 1.102.022h4.9c.5 0 .84 0 1.102-.022.256-.021.386-.059.478-.105.22-.112.398-.29.51-.51.046-.091.084-.222.105-.478.021-.263.022-.602.022-1.102v-4.9c0-.5 0-.84-.022-1.102-.021-.256-.059-.386-.105-.478a1.167 1.167 0 0 0-.51-.51c-.092-.046-.222-.084-.478-.105a15.085 15.085 0 0 0-1.102-.022h-4.9c-.5 0-.84 0-1.102.022Z"
              ></path>
            </svg>
            {referenceDetailData?.content_with_weight?.length}
          </Tag>
        </Row>
        <div
          className="content"
          style={{
            marginTop: 8,
          }}
        >
          {referenceDetailData?.content_with_weight}
        </div>
        <Row></Row>
      </div>
    </Modal>
  );
};

export default ReferenceDetailModal;
