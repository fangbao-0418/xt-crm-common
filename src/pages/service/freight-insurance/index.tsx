import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, Icon, Popconfirm, Tooltip, Upload } from 'antd'
import { getHeaders, prefix } from '@/util/utils'
import { getList, rePaid, exportInsures, exportClaim } from './api'
import { formConfig } from './config'

class Main extends React.Component {
  public listRef: ListPageInstanceProps
  public columns = [{
    title: '子订单号',
    dataIndex: 'childOrderCode'
  }, {
    title: '保单号',
    dataIndex: 'thirdInsuranceSn'
  }, {
    title: '保额',
    dataIndex: 'insuranceQuota'
  }, {
    title: '保费',
    dataIndex: 'insuranceCost'
  }, {
    title: '起保时间',
    dataIndex: 'insuranceStartTime',
    render: (text: number) => APP.fn.formatDate(text)
  }, {
    title: '终止时间',
    dataIndex: 'insuranceEndTime',
    render: (text: number) => APP.fn.formatDate(text)
  }, {
    title: '运费险状态',
    dataIndex: 'insuranceStatusStr',
    render: (text: string, record: any) => {
      if (record.insuranceStatus === 20) {
        return (
          <>
            <span>{text}</span>
            <Tooltip placement='top' title={record.failReason}>
              <Icon type="info-circle" />
            </Tooltip>
          </>
        )
      }
      return text
    }
  }, {
    title: '报案号',
    dataIndex: 'reportNumber'
  }, {
    title: '赔款金额',
    dataIndex: 'paidPrice',
    render: (text: number) => APP.fn.formatMoneyNumber(text, 'm2u')
  }, {
    title: '支付宝',
    dataIndex: 'paidReciverAccount'
  }, {
    title: '操作',
    render: (record: any) => {
      return record.allowRePaid ? (
        <Popconfirm
          placement='top'
          title='确认重新支付吗？'
          onConfirm={async () => {
            const res = await rePaid(record.insuranceId)
            if (res) {
              APP.success('重新支付成功')
              this.listRef?.refresh()
            }
          }}
          okText='确认'
          cancelText='取消'
        >
          <span className='href'>重新支付</span>
        </Popconfirm>
      ) : '-'
    }
  }]
  public handleImportChange = (info: any) => {
    const { status, response, name } = info.file;
    if (status === 'done') {
      if (response.success) {
        console.log('file response =>', response)
        this.setState({ importRes: response.data})
        APP.success(`${name} 文件上传成功`);
      } else {
        APP.error(`${response.message}`);
      }
    } else if (status === 'error') {
      APP.error(`${name} 文件上传错误.`);
    }
  }
  // 导出投保excel
  public handleExportInsures = async () => {
    const payload = this.listRef.getPayload()
    const res = await exportInsures(payload)
    if (res) {
      APP.success('导出投保excel成功')
    }
  }
  // 导出理赔excel
  public handleExportClaim = async () => {
    const payload = this.listRef.getPayload()
    const res = await exportClaim(payload)
    if (res) {
      APP.success('导出投保excel成功')
    }
  }
  public render () {
    return (
      <ListPage
        getInstance={(ref) => {
          this.listRef = ref
        }}
        rangeMap={{
          insuranceTime: {
            fields: ['insuranceStartTime', 'insuranceEndTime']
          }
        }}
        formConfig={formConfig}
        addonAfterSearch={(
          <>
            <Button type='primary' onClick={this.handleExportInsures}>导出投保excel</Button>
            <Button type='primary' className='ml10' onClick={this.handleExportClaim}>导出理赔excel</Button>
            <Upload
              className='mr10'
              name='file'
              accept='.xls,.xlsx'
              showUploadList={false}
              withCredentials={true}
              action={prefix('/mcweb/trade/insurance/freight/submitExcel')}
              headers={getHeaders({})}
              onChange={this.handleImportChange}
              style={{ margin: '0 10px' }}
            >
              <Button type='primary' className='ml10'>导入excel</Button>
            </Upload>
          </>
        )}
        columns={this.columns}
        api={getList}
      />
    )
  }
}

export default Main