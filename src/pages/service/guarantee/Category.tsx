import React from 'react'
import { Form, FormItem } from '@/packages/common/components'
import { TreeSelect } from 'antd'
import { getCategorys } from '@/pages/interface/category/api';

const { SHOW_CHILD } = TreeSelect

interface Props {
  value: string[]
  onChange: (value: any[]) => void
}
interface State {
  treeData: any[]
}
class Main extends React.Component<Props, State> {
  public state = {
    treeData: []
  }
  public componentDidMount () {
    this.onLoadData()
  }
  public getTreeNode = (id: number) => {
    const { treeData } = this.state
    const target = treeData.find((item: any) => item.id === id)
    console.log('target', target)
  }
  public onChange = (ids: any, label: string, extra: any) => {
    const treeNodes = ids.map((id: number) => {
      return this.getTreeNode(id)
    })
    this.props.onChange(treeNodes)
  }
  public onLoadData = async (treeNode: any = { props: {} }) => {
    const { id } = treeNode.props
    let treeData: any[] = (await getCategorys(id) || [])
    treeData = treeData.map(item => {
      return {
        title: item.name,
        level: item.level,
        pId: item.parentId,
        id: item.id,
        key: item.id,
        value: item.id,
        isLeaf: item.level === 3
      }
    })
    this.setState((state: any) => {
      return {
        treeData: state.treeData.concat(treeData)
      }
    })
  }
  public render () {
    const { treeData } = this.state
    const tProps = {
      treeData,
      value: this.props.value,
      treeDataSimpleMode: true,
      loadData: this.onLoadData,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_CHILD,
      searchPlaceholder: '请选择类目',
      dropdownStyle: { maxHeight: 300, overflow: 'auto' },
      style: {
        width: '100%'
      },
    };
    return (
      <Form style={{ height: 400 }}>
        <div style={{ color: 'red', marginBottom: 10 }}>取消勾选后所有已选择赠运费的商品将被取消，重新勾选类目后需再次在商品中勾选赠运费险</div>
        <FormItem
          label='类目'
          inner={(form) => {
            return form.getFieldDecorator('categorys')(
              <TreeSelect {...tProps} />
            )
          }}
        />
      </Form>
    )
  }
}

export default Main