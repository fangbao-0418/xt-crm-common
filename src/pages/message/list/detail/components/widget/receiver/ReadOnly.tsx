import React from 'react'
import { Input } from 'antd'
const { TextArea } = Input
import { memberOptions } from '../../../../config'
interface Props {
  detail:  Message.ItemProps
}
class Main extends React.Component<Props> {
  public getGroupText () {
    const detail = this.props.detail
    // const { groupType } = detail
    const groupType = detail.groupType || []
    const mapper: any = {}
    const result: string[] = []
    memberOptions.map((item) => {
      mapper[item.value] = item.label
    })
    groupType.map((item) => {
      if (mapper[item]) {
        result.push(mapper[item])
      }
    })
    if (result.length === memberOptions.length) {
      result.unshift('全部')
    }
    console.log(result, 'resultresultresultresultresult')
    return result.join('/')
  }
  public render () {
    const detail = this.props.detail
    console.log(detail, 'detail')
    const memberIds = detail.memberIds || []
    return (
      <div>
        <div><span>{this.getGroupText()}</span></div>
        <div>
          <span
            className='href'
            onClick={() => {
              APP.fn.download(detail.fileUrl, detail.fileName)
            }}
          >
            {detail.fileName}
          </span>
        </div>
        <div className='mt10'>
          <TextArea
            hidden={memberIds.length === 0}
            disabled
            value={memberIds.join('\n')}
            style={{
              height: 100
            }}
          />
        </div>
      </div>
    )
  }
}
export default Main
