import React from 'react'
import SpecContentModal, { RowSelectionOpts } from './SpecContentModal'
import CategoryModal from './CategoryModal'

export interface Options {
  visible: boolean
  floorId: number
  cb: (res: any, hide: () => void) => void
}

interface State {
  visible: boolean,
  categoryVisible: boolean,
  cateText: any[],
  floorId: number // 占位
}

/** modal高阶组件 */
function withModal(WrappedComponent: any): any {
  return class extends React.Component<any, State> {
    public state: State = {
      visible: false,
      categoryVisible: false,
      cateText: [],
      floorId: -1 // 占位
    }
    public handleOk: (res: any) => void
    public handleOkCategory: (res: any) => void
    public modal = {
      /** 专题内容管理 */
      specContentModal: ({ visible, floorId, cb }: Options) => {
        this.handleOk = (rowSelectionOpts: RowSelectionOpts) => {
          cb(this.handleCancel, rowSelectionOpts.selectedRows[0])
        }
        this.setState({
          visible,
          floorId
        })
      },
      /** 类目modal */
      categoryModal: ({ categoryVisible, cateText, cb}: any) => {
        this.handleOkCategory = (cateText: any[]) => {
          cb(this.handleCancelCategory, cateText)
        }
        this.setState({
          cateText,
          categoryVisible
        })
      }
    }
    public handleCancel = () => {
      this.setState({
        visible: false
      })
    }
    public handleCancelCategory = () => {
      this.setState({
        categoryVisible: false
      })
    }
    public render() {
      const {
        visible,
        categoryVisible,
        cateText
      } = this.state
      return (
        <>
          <SpecContentModal
            visible={visible}
            selectedRowKeys={[this.state.floorId]}
            onCancel={this.handleCancel}
            onOk={this.handleOk}
          />
          <CategoryModal
            cateText={cateText}
            visible={categoryVisible}
            onOk={this.handleOkCategory}
            onClose={() => this.setState({ categoryVisible: false })}
          />
          <WrappedComponent modal={this.modal} {...this.props} />
        </>
      )
    }
  }
}

export default withModal
