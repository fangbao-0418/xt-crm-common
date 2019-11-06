import React from 'react'
import { Table, Input, InputNumber } from 'antd';

export default class extends React.Component {
  constructor(props) {
    super(props); 
    const { onChange, value } = props;
    this.columns = [
      {
        title: '层级',
        dataIndex: 'name',
      },
      {
        title: '分佣比%',
        editable: true,
        render: (record) => {
          const { dataSource } = this.state;
          return <InputNumber
            defaultValue={record.value || 0}
            min={0}
            max={100}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            onChange={(value) => {
              record.value = value;
              dataSource[record.key] = record
              this.setState({
                dataSource
              },() => {
                const { dataSource } = this.state;
                let allNum = 0;
                const noVal = dataSource.filter(item => {
                  const { value } = item

                  if(value)allNum += value
                  
                  if(value !== 0){
                    return !value || value === null 
                  }
                });
                console.log()
                if(!noVal.length && allNum === 100){
                  onChange(dataSource)
                } else {
                  onChange([])
                }
              })
            }}
          />
        },
      },
    ];
    console.log(this.props.value, 'va;')
    this.state = {
      dataSource: [
        {
          key: '0',
          name: '团长',
          type: 'headCommissionRate',
        },
        {
          key: '1',
          name: '社区管理员',
          type: 'areaCommissionRate',
        },
        {
          key: '2',
          name: '合伙人',
          type: 'cityCommissionRate',
        },
        {
          key: '3',
          name: '管理员',
          type: 'managerCommissionRate',
        },
      ],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {value} = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (value.length) {
        return {
          dataSource: value,
        };
    }
    // 否则，对于state不进行任何操作
    return null;
  }
  

  render() {
    const { dataSource } = this.state;
    const { columns } = this;
    return (
      <div>
        <Table
          bordered
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
        （输入范围为0~100内任意数值，仅支持整数，分佣比总和须等于100）
      </div>
    );
  }
}
