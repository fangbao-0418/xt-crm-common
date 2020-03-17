import React from 'react'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane
import CarouselList from './CarouselList'
import TagList from './TagList'
class Main extends React.Component {
  public render () {
    return (
      <div className='page'>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='轮播场次' key='1'>
            <CarouselList />
          </TabPane>
          <TabPane tab='标签配置' key='2'>
            <TagList />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default Main