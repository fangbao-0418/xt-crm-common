/** 阶梯 */
import React from 'react'
import Card from './card'
import PresentContent from './present-content'
type ValueProps = Marketing.PresentContentValueProps
interface Props {
  name: string
  value?: any[]
  onChange?: (value: ValueProps[]) => void
  onSelect?: (type: 0 | 1, index: number) => void
  disabled?: boolean
  giftCanEdit?: boolean
}
const mapper = ['一', '二', '三', '四', '五'] 
class Main extends React.Component<Props> {
  public onChange (value: ValueProps[]) {
    console.log(value, 'ladder change')
    if (this.props.onChange) {
      this.props.onChange([...value])
    }
  }
  public render () {
    const value = this.props.value || []
    const { name, disabled } = this.props
    return (
      value.map((item, index) => {
        const field = `${name}-${index}`
        return (
          <Card
            key={`card-${index}`}
            title={`第${mapper[index]}阶梯优惠`}
            className='mb20'
            rightContent={(
              !disabled && (
                <span
                  className='href'
                  onClick={() => {
                    this.onChange(value.filter((item, currentIndex) => currentIndex !== index))
                  }}
                >
                  删除
                </span>
              )
            )}
          >
            <PresentContent
              type='ladder'
              disabled={disabled}
              giftCanEdit={this.props.giftCanEdit}
              value={value[index]}
              name={field}
              onChange={(val) => {
                value[index] = val
                this.onChange([...value])
              }}
              onSelect={(type) => {
                if (this.props.onSelect) {
                  this.props.onSelect(type, index)
                }
              }}
            />
          </Card>
        )
      })
    )
  }
}
export default Main
