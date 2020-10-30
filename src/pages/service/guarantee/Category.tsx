import React from 'react'
import { Form, FormItem } from '@/packages/common/components'
import { TreeSelect } from 'antd'
import { getCategorys } from '@/pages/interface/category/api';

const { SHOW_PARENT } = TreeSelect;

interface Props {
  value: string[]
}
class Main extends React.Component<Props> {
  public state = {
    value: [],
    treeData: []
  }
  public componentDidMount () {
    this.onLoadData()
  }
  public onChange = (value: any, label: string, extra: any) => {
    console.log('onChange ', value, label, extra)
    this.setState({ value });
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
        value: item.id
      }
    })
    this.setState((state: any) => {
      return {
        treeData: state.treeData.concat(treeData)
      }
    })
  }
  public render () {
    const { treeData, value } = this.state
    const tProps = {
      value,
      treeData,
      treeDataSimpleMode: true,
      loadData: this.onLoadData,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
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