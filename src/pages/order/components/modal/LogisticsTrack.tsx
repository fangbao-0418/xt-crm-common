import * as React from 'react';
import { Modal } from 'antd';

interface LogisticsTrackProps {
  visible: boolean;
}
interface LogisticsTrackState {

}

/** 物流轨迹弹窗 */
class LogisticsTrack extends React.Component<LogisticsTrackProps, LogisticsTrackState> {
  render() {
    return (
      <Modal
        title='按快递单号批量查询物流轨迹'
        visible={this.props.visible}
      >
      
      </Modal>
    )
  }
}

export default LogisticsTrack;