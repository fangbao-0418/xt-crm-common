import React from 'react'
import { Table, Button } from 'antd'
import Search from './components/Search'
import styles from './style.module.sass'
class Main extends React.Component {
  public columns = [{
    title: '专题ID'
  }, {
    title: '专题名称'
  }, {
    title: '链接'
  }, {
    title: '状态'
  }, {
    title: '操作'
  }]
  public render () {
    console.log(APP, 'APP')
    return (
      <div>
        <div className={styles.container}>
          <Search className={styles.search} />
          <div style={{marginBottom: 20}}>
            <Button
              type="primary"
              onClick={() => {
                APP.history.push('/interface/special/1111')
              }}
            >
              新增专题
            </Button>
          </div>
          <Table
            columns={this.columns}
          />
        </div>
      </div>
    )
  }
}
export default Main