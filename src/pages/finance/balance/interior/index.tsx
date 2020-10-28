import React from 'react'
import { Card } from 'antd'
import Page from '@/components/page'
import CapitalInfo from './components/CapitalInfo'
import BalanceTable from './components/BalanceTable'
class Main extends React.Component {
  public render () {
    return (
      <Page>
        <Card bordered>
          <CapitalInfo />
        </Card>
        <Card className='mt10' bordered>
          <BalanceTable />
        </Card>
      </Page>
    )
  }
}
export default Main
