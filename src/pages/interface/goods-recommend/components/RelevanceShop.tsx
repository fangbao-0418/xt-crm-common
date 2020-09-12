import React from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import ShopModal from './ShopModal';

interface Props {
  readonly: boolean
  onChange?: (value: any) => void
}
interface State {
  dataSource: any[]
  selectedRowKeys: any[]
}
class Main extends React.Component<Props, State> {
  public state = {
    dataSource: [],
    selectedRowKeys: []
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
      dataIndex: "product",
    },
    {
      title: "操作",
      render: (records) => {
        return <span className="href">删除</span>;
      },
    },
  ];
  public render() {
    const { readonly } = this.props
    const { dataSource, selectedRowKeys } = this.state
    return (
      <div>
        <ShopModal
          ref='shopmodal'
          selectedRowKeys={selectedRowKeys}
          onOk={(keys, rows) => {
            const result = rows.map((item) => {
              return {
                ...item
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
