import React, { Children } from 'react'
import { Input } from 'antd'
import TreeCheckBox from '@/packages/common/components/tree-checkbox'
import { If } from '@/packages/common/components'
import { groupBy } from 'lodash'
import { getAddress } from './api'
const { TextArea } = Input
interface SaleAreaProps {
  readOnly?: boolean
  onChange?: (value: any) => void
  value?: any
  style?: React.CSSProperties
}
interface SaleAreaState {
  visible: boolean,
  text: string,
  checkedKeys: string[]
}


function buildTree (list?: any[]) {
  list = list || []
  const provinces = groupBy(list, (item) => item.provinceId + ',' + item.province)
  let citys: any = {}
  for (const name in provinces) {
    citys[name] = groupBy(provinces[name], (item1) => item1.cityId + ',' + item1.city)
  }
  // console.log('分组后的', citys)

  function loop(citys: any[]) {
    if (Object.prototype.toString.call(citys) === '[object Object]') {
      let result: any[] =  []
      for (let prop in citys) {
        const [id, name] = prop.split(',')
        result.push({ id, name, children: loop(citys[prop]) })
      }
      return result
    }
    return citys
  }
  console.log('分组后的', loop(citys))
  return loop(citys)
}

function nodes2Texts(nodes: any[]) {
  return (nodes || []).map((v: any) => {
    return `${v.name}（${v.length}）`
  }).join('、')
}

function convert(nodes: any[]) {
  nodes = nodes || []
  const result: any = {}
  for (let item of nodes) {
    if(!result[item.provinceId]){
      result[item.provinceId] = {
        ...item,
        cityIds: [item.cityId]
      }
    } else if(result[item.provinceId].cityIds.indexOf(item.cityId) == -1 && item.provinceId == result[item.provinceId].provinceId ){
      result[item.provinceId].cityIds.push(item.cityId)
    }
  }
  return Object.values(result)
}
class SaleArea extends React.Component<SaleAreaProps, SaleAreaState>{
  state: SaleAreaState = {
    visible: false,
    text: '',
    checkedKeys: []
  }
  componentWillReceiveProps(props: SaleAreaProps) {
    // buildTree(props.value)
    const checkedOptions = props.value || []
    this.setState({
      text: convert(checkedOptions).map((v: any) => {
        return `${v.province}（${v.cityIds.length}）`
      }).join('、'),
      checkedKeys: checkedOptions.map((v: any) => v.districtId + '')
    })
  }
  render() {
    const { visible, text, checkedKeys } = this.state
    return (
      <>
        <TextArea
          disabled
          placeholder='请通过按钮选择可售区域内容'
          rows={5}
          value={text}
          style={Object.assign({ width: 450 }, this.props.style)}
        />
        <If condition={!!this.props.readOnly}>
          <span
            className='href ml10'
            onClick={() => {
              this.setState({
                visible: true
              })
            }}
          >
            查看可售区域
          </span>
        </If>
        <If condition={!this.props.readOnly}>
          <span
            className='href ml10'
            onClick={() => {
              this.setState({
                visible: true
              })
            }}
          >
            {text ? '编辑可售区域': '新增可售区域'}
          </span>
          <span
            className='href ml10'
            onClick={() => {
              const { onChange } = this.props;
              if (typeof onChange === 'function') {
                onChange([]);
              }
            }}
          >
            清空可售区域
          </span>
        </If>
        <TreeCheckBox
          title='选择区域'
          api={getAddress}
          checkedKeys={checkedKeys}
          visible={visible}
          readOnly={this.props.readOnly}
          checkedNodes={buildTree(this.props.value)}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
          onOk={(e) => {
            const { onChange } = this.props
            this.setState({
              visible: false,
              text: nodes2Texts(e.textNodes)
            })
            onChange && onChange(e.businessCheckNodes)
          }}
        />
      </>
    )
  }
}

export default SaleArea