import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, Popconfirm } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import CarouselEdit from './components/CarouselEdit'
import { CarouselItem } from './interface'
import { LiveStatusEnum } from '../studio/config'
import * as api from './api'

interface Props extends AlertComponentProps {}
interface State {
  dataSource: CarouselItem[]
  total: number
}
class Main extends React.Component<Partial<Props>, State> {
  public columns: ColumnProps<CarouselItem>[] = [
    {
      title: '场次ID',
      dataIndex: 'id',
      width: 150
    },
    {
      title: '直播标题',
      dataIndex: 'liveTitle',
      width: 300
    },
    {
      title: '状态',
      dataIndex: 'liveStatus',
      render: (text) => {
        return LiveStatusEnum[text]
      }
    },
    {
      title: '排序',
      dataIndex: 'carouselSort'
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <span
              className='href'
              onClick={this.edit(record)}
            >
              修改
            </span>&nbsp;&nbsp;
            <span onClick={this.delete(record)} className='href'>
              删除
            </span>
          </div>
        )
      }
    }
  ]
  public state: State = {
    dataSource: [],
    total: 0
  }
  public listpage: ListPageInstanceProps
  public carouselRef: CarouselEdit | null
  public edit = (record?: CarouselItem) => () => {
    if (this.props.alert) {
      const hide = this.props.alert({
        width: 400,
        content: (
          <CarouselEdit
            ref={(ref) => this.carouselRef = ref}
            record={record}
          />
        ),
        onOk: () => {
          if (this.carouselRef) {
            this.carouselRef.save().then(() => {
              hide()
              this.listpage.refresh()
            })
          }
        }
      })
    }
  }
  public delete = (record: CarouselItem) => () => {
    if (this.props.alert) {
      const hide = this.props.alert({
        width: 400,
        content: (
          <div>删除后不可恢复，确认删除？</div>
        ),
        onOk: () => {
          api.deleteCarousel(record.id).then(() => {
            this.listpage.refresh()
          }).then(() => {
            hide()
          })
        }
      })
    }
  }
  public render () {
    const dataSource = this.state.dataSource || []
    const addableNum = 10 - dataSource.length < 0 ? 0 : 10 - dataSource.length
    return (
      <div>
        <ListPage
          style={{padding: 0}}
          columns={this.columns}
          api={api.fetchCarouselList}
          getInstance={(ref) => this.listpage = ref}
          tableProps={{
            pagination: false
          }}
          addonAfterSearch={(
            <div style={{marginTop: -10}}>
              <Button
                type='primary'
                onClick={this.edit()}
              >
                新增场次
              </Button>
              <div style={{float: 'right', marginTop: 5}}>
                {/* 合计 <span style={{color: 'red'}}>{this.state.total}</span> 场直播，还可添加 <span style={{color: '#0b8235'}}>{addableNum}</span> 场 */}
              </div>
            </div>
          )}
          processPayload={(payload) => {
            return {
              ...payload,
              pageSize: undefined,
              page: undefined
            }
          }}
          processData={(result) => {
            result = result || []
            this.setState({
              dataSource: result.filter((item: any) => item.type !== 10),
              total: result.length
            })
            return {
              total: result.length,
              records: result
            }
          }}
        />
      </div>
    )
  }
}
export default Alert(Main)