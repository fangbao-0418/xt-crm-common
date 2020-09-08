import React from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import ShopModal from './ShopModal';

interface Props {
  readonly: boolean
}
interface State {
  dataSource: any[]
}
class Main extends React.Component<Props, State> {
  public state = {
    dataSource: []
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
    return (
      <div>
        <ShopModal ref='shopmodal' />
        <div>
          <Table
            style={{
              width: 600,
            }}
            columns={this.columns}
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
