import React, { PureComponent } from 'react'
import { Card, Radio } from 'antd'
import PropTypes from 'prop-types'
import { connect } from '@/util/utils'

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

  componentDidMount () {
    const { dispatch } = this.props
    dispatch[namespace].getSetting()
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
      </Card>
    )
  }

  onChange = (e) => {
    const { dispatch } = this.props
    const { value } = e.target
    dispatch[namespace].setSetting({
      productStyle: value
    })
  };
}
