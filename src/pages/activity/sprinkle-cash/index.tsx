import React from 'react';
import { Button } from 'antd';
import { ListPage } from '@/packages/common/components'
class SprinkleCash extends React.Component {
  jumpTo = () => {
    APP.history.push('/activity/sprinkle-cash/form');
  }
  render () {
    return (
      <>
        <div className='mb10'>
          <Button onClick={this.jumpTo}>新增配置</Button>
        </div>
        <ListPage
          api={() => Promise.resolve({ records: []})}
          columns={[{
            title: '活动ID',
            dataIndex: 'id'
          }, {
            title: '活动日期',
            dataIndex: 'date'
          }, {
            title: '任务可发起次数上限',
            dataIndex: 'limit'
          }, {
            title: '任务奖励',
            dataIndex: 'reward'
          }, {
            title: '活动规则',
            dataIndex: 'rules'
          }, {
            title: '活动状态',
            dataIndex: 'status'
          }, {
            title: '操作',
            render: () => {
              return (
                <>
                  <div>
                    <Button type='link'>编辑</Button>
                    <Button type='link'>结束</Button>
                  </div>
                  <div>
                    <Button type='link'>查看</Button>
                  </div>
                </>
              )
            }
          }
        ]}
        />
      </>
    )
  }
}

export default SprinkleCash;