import React, { PureComponent } from 'react'
import { Card, Radio, Button } from 'antd'
import PropTypes from 'prop-types'
import { connect } from '@/util/utils'
import Scene from './scene'

const namespace = 'fresh.settings'

@connect((state) => {
  return {
    value: state[namespace].value
  }
})
export default class extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
    dispatch: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.save=this.save.bind(this)
  }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch[namespace].getSetting()
  }

  onChange = (e) => {
    const { dispatch } = this.props
    const { value } = e.target
    dispatch[namespace].updateVal({
      value
    })
  };

  save=(e)=>{
    const { dispatch } = this.props
    dispatch[namespace].setSetting()
  }

  render () {
    const { value } = this.props
    return (
      <Card>
        <h5>喜团好菜</h5>
        <Radio.Group onChange={this.onChange} value={value}>
          <Radio value={1}>1×1排列</Radio>
          <Radio value={2} style={{ marginLeft: 24 }}>
            1×2排列
          </Radio>
        </Radio.Group>
        <div>
          <Button type='primary' style={{ marginTop: 24 }} onClick={this.save}>保存</Button>
        </div>
        <hr style={{ margin: '20px 0' }} />
        <Scene />
      </Card>
    )
  }
}
