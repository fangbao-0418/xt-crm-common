import React from 'react'
import { ListPage, Form, FormItem } from '@/packages/common/components'
import { FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from './config'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import * as api from './api'
class Main extends React.Component {
  public form: FormInstance
  public columns: ColumnProps<any>[] = [
    {
      dataIndex: 'a',
      title: 'a'
    },
    {
      dataIndex: 'anchorLevel',
      title: 'b'
    }
  ]
  public componentDidMount () {
    this.form.setValues({
      nickName: 'xxx',
      homeId: 'xxx',
      title: '2222'
    })
  }
  public render () {
    return (
      <div style={{background: '#ffffff', padding: 20}}>
        <div>
          <Form
            // style={{marginLeft: 20, display: 'inline-block'}}
            layout='inline'
            getInstance={(ref) => {
              this.form = ref
            }}
            config={getFieldsConfig()}
            readonly
          >
            <Button style={{marginRight: 30}} type='primary'>返回</Button>
            <FormItem name='nickName'/>
            <FormItem name='homeId'/>
            <FormItem name='title'/>
            <FormItem name='status'/>
            <Button style={{marginRight: 10}} type='primary'>下架</Button>
            <Button type='primary'>停播</Button>
          </Form>
        </div>
        <ListPage
          api={api.getStudioList}
          columns={this.columns}
        />
      </div>
    )
  }
}
export default Main
