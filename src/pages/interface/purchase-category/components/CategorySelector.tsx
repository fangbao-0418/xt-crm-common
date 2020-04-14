import React from 'react'
import { Modal } from 'antd'
import Ctree from '@/pages/interface/category/tree'

interface Props {
  cateText: any[]
  visible: boolean
  onOk: (payload: any[]) => void
  onClose: () => void
}
interface State {
  cateText: any[]
}

/** 选择活动modal */
class Main extends React.Component<Props, State> {
  public state: State = {
    cateText: []
  }
  public cateText: any[]
  public constructor(props: any) {
    super(props)
    this.handleOk = this.handleOk.bind(this)
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.cateText !== nextProps.cateText) {
      this.cateText = nextProps.cateText
      this.setState({
        cateText: nextProps.cateText
      })
    }
  }

  public handleOk() {
    this.props.onOk(this.cateText)
  }

  public render() {
    const { visible } = this.props
    return (
      <Modal
        title="选择活动"
        visible={visible}
        width={1000}
        onCancel={this.props.onClose}
        onOk={this.handleOk}
      >
        <Ctree
          setList={(cateText: any[]) => this.cateText = cateText}
          checkData={this.state.cateText}
        />
      </Modal>
    )
  }
}

export default Main