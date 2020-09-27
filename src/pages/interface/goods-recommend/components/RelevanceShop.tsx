import React from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import ShopModal from './ShopModal';

interface Props {
  readonly: boolean
  value?: any
  onChange?: (value: any) => void
}
interface State {
  dataSource: any[]
}
class Main extends React.Component<Props, State> {
  public state = {
    dataSource: []
  }
  public componentWillReceiveProps(nextProps: any) {
    const value = nextProps.value
    if (value && this.props.value !== value) {
      this.setState({ dataSource: value })
    }
  }
  public onChange () {
    if (this.props.onChange) {
      this.props.onChange(this.state.dataSource)
    }
  }
  public columns: ColumnProps<any>[] = [
    {
      title: "店铺ID",
      dataIndex: "shopId",
    },
    {
      title: "店铺名称",
      dataIndex: "shopName",
    },
    {
      title: "在架商品",
      dataIndex: "productCount",
    },
    {
      title: "操作",
      render: (text, record, index) => {
        return (
          <span
            className="href"
            onClick={() => {
              const { dataSource } = this.state
              dataSource.splice(index, 1)
              this.setState({ dataSource })
            }}
          >
            删除
          </span>
        )
      },
    },
  ]
  public render() {
    const { readonly } = this.props
    const { dataSource } = this.state
    return (
      <div>
        <ShopModal
          ref='shopmodal'
          selectedRows={dataSource.map((item: any) => ({ ...item, onlineProductCount: item.productCount }))}
          selectedRowKeys={dataSource.map((item: any) => item.shopId)}
          onOk={(keys, rows) => {
            console.log('keys, rows', keys, rows)
            const result = rows.map((item) => {
              return {
                ...item,
                productCount: item.onlineProductCount
              }
            })
            this.setState({
              dataSource: result
            }, () => {
              this.onChange()
            })
          }}
        />
        <div>
          <Table
            style={{
              width: 600,
            }}
            columns={this.columns}
            dataSource={dataSource}
          />
        </div>
        <div>
          {!readonly && (
            <span
              className="href"
              onClick={() => {
                const ref: any = this.refs.shopmodal;
                ref.open(this.state.dataSource);
              }}
            >
              +添加店铺
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Main;
