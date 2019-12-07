import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import styles from './style.module.sass';
interface State {
  dataSource?: Marketing.ItemProps[];
}
interface Props {
  value?: Marketing.PresentContentValueProps;
  onChange?: (value: Marketing.PresentContentValueProps) => void;
  disabled?: boolean;
}
enum ShopStatusEnum {
  下架 = 0,
  上架 = 1
}
class Main extends React.Component<Props> {
  public columns: ColumnProps<Marketing.ItemProps>[] = [
    { title: '活动ID', dataIndex: 'id' },
    {
      title: '活动名称',
      dataIndex: 'title',
      render: (text, record) => {
        return (
          <span
            className="href"
            onClick={() => {
              APP.href(`/activity/info/edit/${record.id}?page=1&pageSize=20`, '_blank');
            }}
          >
            {text}
          </span>
        );
      }
    },
    {
      title: '开始时间',
      width: 180,
      dataIndex: 'startTime',
      render: text => {
        return APP.fn.formatDate(text);
      }
    },
    {
      title: '结束时间',
      width: 180,
      dataIndex: 'endTime',
      render: text => {
        return APP.fn.formatDate(text);
      }
    },
    {
      title: '活动类型',
      width: 150,
      dataIndex: 'activityTypeName'
    },
    {
      title: '活动状态',
      width: 50,
      dataIndex: 'status',
      render: text => {
        return text === 0 ? '关闭' : '开启';
      }
    },
    {
      title: '操作',
      width: 50,
      render: (text, record) => {
        const disabled = this.props.disabled;
        return (
          !disabled && (
            <span
              className="href"
              onClick={() => {
                const { dataSource } = this.state;
                this.onChange((dataSource || []).filter(item => item.id !== record.id));
              }}
            >
              删除
            </span>
          )
        );
      }
    }
  ];
  public state: State = {
    dataSource: (this.props.value && this.props.value.activityList) || []
  };
  public componentWillReceiveProps(props: Props) {
    this.setState({
      dataSource: (props.value && props.value.activityList) || []
    });
  }
  public onChange(row: Marketing.ItemProps[]) {
    const value = this.props.value as Marketing.PresentContentValueProps;
    if (this.props.onChange) {
      this.props.onChange({
        ...value,
        activityList: row
      });
    }
  }
  public render() {
    const { dataSource } = this.state;
    return (
      <div>
        <Table
          className={styles['spu-list']}
          rowKey="id"
          dataSource={dataSource}
          columns={this.columns}
          pagination={false}
        />
      </div>
    );
  }
}
export default Main;
