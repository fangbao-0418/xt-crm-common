import React from 'react'
import { parseQuery } from '@/packages/common/utils'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import List from '@/packages/common/components/list-page'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig, ComplainTypeEnum } from './config'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Image from '@/components/Image'
import * as api from './api'
import { withRouter, RouteComponentProps } from 'react-router'
interface Props extends AlertComponentProps, RouteComponentProps<{id: string}>{}
class Main extends React.Component<Props> {
  public form: FormInstance
  public id = this.props.match.params.id
  public params: UliveStudio.ItemProps = this.getParams()
  public columns: ColumnProps<any>[] = [
    {
      dataIndex: 'reportNickname',
      title: '举报人'
    },
    {
      dataIndex: 'phone',
      title: '联系方式'
    },
    {
      dataIndex: 'type',
      title: '举报类型',
      render: (text) => {
        return ComplainTypeEnum[text]
      }
    },
    {
      dataIndex: 'otherTypeContent',
      title: '内容详情'
    },
    {
      dataIndex: 'screenshotsUrl',
      title: '截图',
      render: () => {
        return (
          <div>
            <Image src={''}/>
          </div>
        )
      }
    },
    {
      dataIndex: 'createTime',
      title: '生成时间',
      width: 200,
      align: 'center',
      render: (text) => {
        return APP.fn.formatDate(text) || ''
      }
    }
  ]
  public componentDidMount () {
    this.form.setValues(this.params)
  }
  public getParams () {
    const params = parseQuery()
    params.liveStatus = Number(params.liveStatus || 0)
    params.status = Number(params.status || 0)
    return params
  }
  public changeStatus = () => {
    const record = this.params
    const hide = this.props.alert({
      content: (
        <div className='text-center'>
          确定是否{record.status === 0 ? '上架' : '下架'}
        </div>
      ),
      onOk: () => {
        api.changeStatus({
          planId: record.planId,
          status: record.status === 0 ? 1 : 0
        }).then(() => {
          hide()
        })
      }
    })
  }
  public render () {
    return (
      <div style={{background: '#ffffff', padding: 20}}>
        <div>
          <Form
            layout='inline'
            getInstance={(ref) => {
              this.form = ref
            }}
            config={getFieldsConfig()}
            readonly
          > 
            <FormItem>
              <Button onClick={() => { APP.history.push('/ulive/studio') }} style={{marginRight: 30}} type='primary'>返回</Button>
            </FormItem>
            <FormItem name='anchorNickName'/>
            <FormItem label='房间ID' name='planId'/>
            <FormItem label='直播标题' name='liveTitle'/>
            <FormItem name='liveStatus' />
            <FormItem
              style={{
                float: 'right'
              }}
            >
              <Button onClick={this.changeStatus} style={{marginRight: 10}} type='primary'>
                下架
              </Button>
              <Button type='primary'>停播</Button>
            </FormItem>
          </Form>
        </div>
        <List
          processPayload={(payload) => {
            return {
              ...payload,
              livePlanId: this.id
            }
          }}
          api={api.fetchComplainList}
          columns={this.columns}
        />
      </div>
    )
  }
}
export default withRouter(Alert(Main))
