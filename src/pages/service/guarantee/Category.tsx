import React from 'react'
import { Form, FormItem } from '@/packages/common/components'
import { TreeSelect } from 'antd'
import { getTreeCategory } from './api'

const { SHOW_CHILD } = TreeSelect

interface Props {
  value: string[]
  onChange: (value: any[]) => void
}

const valueMap: any = {};
function loops(list: any[], parent?: any) {
  return (list || []).map(({ children, value, title }) => {
    const node: any = (valueMap[value] = parent ? {
      parent,
      value,
      title
    } : {
      value,
      title
    });
    let res = loops(children, node)
    if (res.length) {
      node.children = res
    }
    return node;
  });
}

function getPath(value: string) {
  const path = [];
  let current = valueMap[value];
  while (current) {
    path.unshift(current.value);
    current = current.parent;
  }
  return path;
}


interface State {
  treeData: any[]
}
interface Node {
  id: number
  isLeaf: boolean
  key: number
  level: 1 | 2 | 3
  pId: number
  title: string
  value: number
}

function getTreeData (list: any[]): any[] {
  if (!Array.isArray(list)) {
    list = []
  }
  list = list.map(item => {
    if (!item.childList) {
      return {
        title: item.name,
        value: item.id
      }
    } else {
      return {
        title: item.name,
        value: item.id,
        key: item.id,
        children: getTreeData(item.childList)
      }
    }
  })
  return list
}

class Main extends React.Component<Props, State> {
  public state = {
    treeData: []
  }
  public componentDidMount () {
    this.fetchData()
  }
  public async fetchData () {
    const res: any[] = await getTreeCategory()
    const treeData = getTreeData(res)
    loops(treeData)
    this.setState({
      treeData
    })
  }

  public onChange = (ids: string[], label: string, extra: any) => {
    const treeNodes = ids.map((id: string) => {
      const [firstCategoryId, secondCategoryId, thirdCategoryId]: any = getPath(id)
      return { firstCategoryId, secondCategoryId, thirdCategoryId }
    })
    this.props.onChange(treeNodes)
  }

  public render () {
    const { treeData } = this.state
    const tProps = {
      treeData,
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
            return form.getFieldDecorator('categorys', {
              initialValue: this.props.value
            })(
              <TreeSelect {...tProps} />
            )
          }}
        />
      </Form>
    )
  }
}

export default Main