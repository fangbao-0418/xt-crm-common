import React, { Children } from 'react'
import { Input } from 'antd'
import TreeCheckBox from '@/packages/common/components/tree-checkbox'
import { If } from '@/packages/common/components'
import { getAddress } from './api'
const { TextArea } = Input
interface SaleAreaProps {
  readOnly?: boolean
  onChange?: (value: any) => void
  value?: any
  style?: React.CSSProperties
  title?: any
}
interface SaleAreaState {
  visible: boolean,
  text: string,
  checkedKeys: string[]
}
class SaleArea extends React.Component<SaleAreaProps, SaleAreaState> {
  state: SaleAreaState = {
    visible: false,
    text: '',
    checkedKeys: []
  }
  treeCheckBox: TreeCheckBox
  componentDidMount () {
    if (this.treeCheckBox) {
      const treeData = this.treeCheckBox.getTreeData(this.props.value) || []
      this.setState({
        text: treeData.map(v => `${v.name}（${v.children.length}）`).join('、'),
        checkedKeys: this.treeCheckBox.getCheckedKeys(treeData)
      })
    }
  }
  componentWillReceiveProps (props: SaleAreaProps) {
    const treeData = this.treeCheckBox.getTreeData(props.value) || []
    this.setState({
      text: treeData.map(v => `${v.name}（${v.children.length}）`).join('、'),
      checkedKeys: this.treeCheckBox.getCheckedKeys(treeData)
    })
  }
  saveRef = (ref: TreeCheckBox) => {
    this.treeCheckBox = ref
  }
  render () {
    const { title }=this.props
    const { visible, text, checkedKeys } = this.state
    return (
      <>
        <TextArea
          disabled
          placeholder={'请通过按钮选择'+(title?title:'可售区域')+'内容'}
          rows={5}
          value={text}
          style={Object.assign({ width: 450 }, this.props.style)}
        />
        <div />
        <If condition={!!this.props.readOnly}>
          <span
            className='href ml10'
            onClick={() => {
              this.setState({
                visible: true
              })
            }}
          >
            {'查看'+(title?title:'可售区域')}
          </span>
        </If>
        <If condition={!this.props.readOnly}>
          <span
            className='href ml10'
            onClick={() => {
              this.setState({
                visible: true
              })
            }}
          >
            {text ? '编辑'+(title?title:'可售区域'): '新增'+(title?title:'可售区域')}
          </span>
          <span
            className='href ml10'
            onClick={() => {
              const { onChange } = this.props
              if (typeof onChange === 'function') {
                onChange([])
              }
            }}
          >{'清空'+(title?title:'可售区域')}
          </span>
        </If>
        <TreeCheckBox
          ref={this.saveRef}
          title='选择区域'
          api={getAddress}
          checkedKeys={checkedKeys}
          visible={visible}
          disabled={false}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
          onChange={(checkedKeys: string[]) => {
            this.setState({
              checkedKeys
            })
          }}
          onOk={(e) => {
            const { onChange } = this.props
            this.setState({
              visible: false,
              checkedKeys: e.checkedKeys
            })
            onChange && onChange(e.checkedNodes)
          }}
        />
      </>
    )
  }
}

export default SaleArea