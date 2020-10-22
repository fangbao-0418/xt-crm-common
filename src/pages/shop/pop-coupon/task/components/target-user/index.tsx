import React from 'react'
import { Button, Row, Col, Checkbox, Radio, Input } from 'antd'
import Upload from '@/components/upload'

interface ValueProps {
  key: number
  value?: any
}

interface Props {
  value?: ValueProps
  onChange?: (value: ValueProps) => void
  readonly?: boolean
}

interface State {
  value: ValueProps
}

const radioStyle = {
  display: 'block',
  margin: '8px 0 8px'
}

class Main extends React.Component<Props, State> {
  public onChange (value: ValueProps) {
    this.props?.onChange?.(value)
  }
  public render () {
    const { key, value } = this.props.value || {}
    const { readonly } = this.props
    return (
      <div>
        <Radio.Group
          value={key}
          disabled={readonly}
          onChange={(e) => {
            this.onChange({
              key: e.target.value,
              value: e.target.value === 0 ? 'all' : undefined
            })
          }}
        >
          <Radio style={radioStyle} value={0}>全部用户</Radio>
          <Radio style={radioStyle} value={1}>按用户等级</Radio>
          {key === 1 && (
            <Checkbox.Group
              value={value}
              disabled={readonly}
              style={{ width: '100%' }}
              onChange={(e) => {
                this.onChange({
                  key,
                  value: e
                })
              }}
            >
              <Row>
                <Col span={8}>
                  <Checkbox value={0}>普通用户</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={10}>店长</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={20}>高级店长</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={30}>服务商</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value={40}>管理员</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )} 
          <Radio
            style={radioStyle}
            value={2}
          >
            指定用户
          </Radio>
          {key === 2 && (
            <Input.TextArea
              style={{ width: '528px' }}
              rows={4}
              value={value}
              disabled={readonly}
              placeholder='输入用户手机号，以半角逗号隔开，例13928387247,15619237922'
              onChange={(e) => {
                this.onChange({
                  key,
                  value: e.target.value
                })
              }}
            />
          )}
          <Radio style={radioStyle} value={3}>Excel文件上传
            {!readonly && (
              <Button
                type='link'
                onClick={() => {
                  APP.fn.download('https://xituan.oss-cn-shenzhen.aliyuncs.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551571728654649.xlsx', '批量发券模板')
                }}
              >（点击下载模板）
              </Button>
            )}
          </Radio>
          {key === 3 && (
            <Upload
              size={0.5}
              extname='xls,xlsx'
              disabled={readonly}
              fileTypeErrorText='请选择xls,xlsx格式'
              onChange={(val) => {
                this.onChange({
                  key,
                  value: val?.[0]?.url
                })
              }}
              value={value ? [{
                uid: 'file',
                url: value
              }] : undefined}
            >
              <Button type='link'>上传excel</Button>
              <span>(文件最大上传500kb)</span>
            </Upload>
          )}
        </Radio.Group>
      </div>
    )
  }
}
export default Main
