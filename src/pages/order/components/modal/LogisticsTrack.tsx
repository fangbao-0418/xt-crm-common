import * as React from 'react';
import { Modal, Input, Row, Button } from 'antd';
import { batchExport } from '../../api';
import ExpressCompanySelect from '@/components/express-company-select';

const TextArea = Input.TextArea
interface LogisticsTrackProps {
  visible: boolean;
}
interface LogisticsTrackState {
  expressCompanyCode: string,
  expressNumbers: string
}

/** 物流轨迹弹窗 */
class LogisticsTrack extends React.Component<LogisticsTrackProps, LogisticsTrackState> {
  state = {
    expressCompanyCode: '',
    expressNumbers: ''
  }
  // 导出
  handleBatchExport = () => {

  }
  render() {
    const { expressCompanyCode } = this.state
    return (
      <Modal
        title='按快递单号批量查询物流轨迹'
        visible={this.props.visible}
        footer={(
          <Button
            type='primary'
            onClick={this.handleBatchExport}
          >
            导出
          </Button>
        )}
      >
        <Row className='mb10'>
          <span className='mr10'>快递公司选择</span>
          <ExpressCompanySelect
            value={expressCompanyCode}
          />
        </Row>
        <TextArea
          rows={14}
          placeholder='请输入快递单号，以换行区分，目前支持圆通、申通、中通、百世的单号查询，单次只能查询一家快递公司的快递单号'
        />
      </Modal>
    )
  }
}

export default LogisticsTrack;