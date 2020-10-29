import React from 'react'
import { Form, FormItem } from '@/packages/common/components'
import { TreeSelect } from 'antd'

const { SHOW_PARENT } = TreeSelect;

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
  {
    title: 'Node3',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  }
];

class Main extends React.Component {
  public state = {
    value: ['0-0-0']
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    
  }
  public onChange = (value: any) => {
    console.log('onChange ', value);
    this.setState({ value });
  }
  public render () {
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择类目',
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