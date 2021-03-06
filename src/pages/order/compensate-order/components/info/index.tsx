import React from 'react'
import { Descriptions } from 'antd'
import { replaceHttpUrl } from '@/util/utils'
import Image from '@/components/Image'

const DescriptionsItem = Descriptions.Item

interface Props {
  title?: React.ReactNode
  column?: number
  children?: React.ReactNode
  data?: {
    label: React.ReactNode,
    value: any,
    span: number,
    type?: string
  }[]
}

class Main extends React.Component<Props> {
  render () {
    const { data = [], column, title, children } = this.props

    if (children) {
      return (
        <Descriptions title={title} column={1}>
          <DescriptionsItem>
            {children}
          </DescriptionsItem>
        </Descriptions>
      )
    }
    return (
      <Descriptions title={title} column={column}>
        {
          data.map((item, i) => {
            if (item.type === 'image') {
              return (
                <DescriptionsItem
                  key={i}
                  label={item.label}
                  span={item.span}
                >
                  {
                    (item.value || []).length
                      ? (item.value || []).map((img: string, i: number) => {
                        return (
                          <Image
                            key={i}
                            style={{
                              height: 100,
                              width: 100,
                              minWidth: 100,
                              marginRight: 8
                            }}
                            src={replaceHttpUrl(img)}
                            alt='图片'
                          />
                        )
                      }) : '-'
                  }
                </DescriptionsItem>
              )
            }
            return (
              <Descriptions.Item
                key={i}
                label={item.label}
                span={item.span}
              >
                {item.value}
              </Descriptions.Item>
            )
          })
        }
      </Descriptions>
    )
  }
}

export default Main