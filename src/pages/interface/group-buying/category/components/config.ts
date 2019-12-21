import { FieldsConfig } from '@/packages/common/components/form'
import { activityType } from '@/enum'
export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    activityList: {
      name: {
        label: '活动名称'
      },
      promotionId: {
        label: '活动ID'
      },
      productName: {
        label: '商品名称'
      },
      productId: {
        label: '商品ID'
      },
      type: {
        type: 'select',
        label: '活动类型',
        controlProps: {
          style: {
            width: 172
          }
        },
        options: activityType.getArray({ type: 'all' }).map(v => ({
          value: v.key,
          label: v.val
        }))
      },
      status: {
        label: '活动状态',
        type: 'select',
        controlProps: {
          style: {
            width: 172
          }
        },
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '关闭',
          value: '0'
        }, {
          label: '开启',
          value: '1'
        }]
      },
      time: {
        type: 'rangepicker',
        label: '有效时间',
        controlProps: {
          showTime: true
        }
      }
    }
  }
  return defaultConfig
}

// <FormItem label="活动名称">
//   {getFieldDecorator('name', {
//     initialValue: ''
//   })(<Input placeholder="请输入活动名称" style={{ width: 180 }} />)}
// </FormItem>
// <FormItem label="活动ID">
//   {getFieldDecorator('promotionId', {
//     initialValue: ''
//   })(<Input placeholder="请输入活动ID" style={{ width: 180 }} />)}
// </FormItem>
// <FormItem label="商品名称">
//   {getFieldDecorator('productName',{
//     initialValue: ''
//   })(
//     <Input placeholder="请输入商品名称" style={{ width: 180 }} />,
//   )}
// </FormItem>
// <FormItem label="商品ID">
//   {getFieldDecorator('productId', {
//     initialValue: ''
//   })(
//     <Input placeholder="请输入商品ID" style={{ width: 180 }} />,
//   )}
// </FormItem>
// <FormItem label="活动类型">
//   {getFieldDecorator('type', {
//     initialValue: ""
//   })(
//     <Select placeholder="请选择活动类型" style={{ width: 180 }}>
//       <Option value="">全部</Option>
//       {activityType.getArray().map((val, i) => (
//         <Option value={val.key} key={i}>
//           {val.val}
//         </Option>
//       ))}
//     </Select>,
//   )}
// </FormItem>
// <FormItem label="活动状态">
//   {getFieldDecorator('status', {
//     initialValue: ""
//   })(
//     <Select placeholder="请选择活动类型" style={{ width: 180 }}>
//       <Option value="">全部</Option>
//       <Option value="0">关闭</Option>
//       <Option value="1">开启</Option>
//     </Select>,
//   )}
// </FormItem>
// <FormItem label="有效时间">
//   {getFieldDecorator('time', {
//     initialValue: ['',''],
//   })(
//     <RangePicker
//       style={{ width: 430 }}
//       format="YYYY-MM-DD HH:mm"
//       showTime={{
//         defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
//       }}
//     />,
//   )}
// </FormItem>