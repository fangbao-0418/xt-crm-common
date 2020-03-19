import React, { Component } from 'react';
import { Input, Table, Button, Popconfirm, Form } from 'antd';
import { connect } from '@/util/utils';
import Modal from './modal';

const FormItem = Form.Item;

const typeMap = ['菜单', '按钮'];
function getColumns(scope) {
  const { showList } = scope.state;
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      width: 300,
      // render(v, record) {
      //     const display = isShow(showList, record) ? 'block' : 'none';
      //     const hasChilds = record.subMenus.length;
      //     return (
      //         <div style={{ display }}>
      //             <span>{v}</span>
      //             {
      //                 hasChilds ? <span>开关</span> : ''
      //             }
      //         </div>
      //     )

      // }
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 200,
      align: 'center',
      render(val, record) {
        return typeMap[val] || '菜单';
      }
    },
    {
      title: '请求地址',
      dataIndex: 'path'
      // render(val, record) {
      //     return render(val, record, showList)
      // },
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      render(val, record) {
        return (
          <div>
            <a style={{ marginRight: 10 }} onClick={() => scope.onEdit(record)}>
              编辑
            </a>
            <Popconfirm
              title="确定删除吗?"
              onConfirm={() => scope.onDel(record)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">删除</a>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
  return columns;
}

@connect(state => ({
  menulist: state['auth.config'].menuList
}))
@Form.create()
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: props.menulist.map(item => item.id)
    };
  }

  onEdit = item => {
    const { dispatch } = this.props;
    dispatch['auth.config'].getMenuInfo({
      id: item.id
    });
    this.onShowModal();
  };

  onDel = item => {
    const { dispatch } = this.props;
    dispatch['auth.config'].delMenu({
      id: item.id
    });
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = () => {
    const {
      form: { validateFields },
      dispatch
    } = this.props;

    validateFields((errors, values) => {
      if (!errors) {
        const payload = {
          ...values
        };
        dispatch['auth.config'].getList(payload, 'menuList');
      }
    });
  };
  onShowModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth.config/saveDefault',
      payload: {
        visible: true
      }
    });
    dispatch['auth.config'].getList({ type: 0 }, 'parentList');
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form layout="inline" style={{ marginBottom: 10 }}>
        <FormItem label="菜单名称">{getFieldDecorator('name')(<Input />)}</FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSearch}>
            查询
          </Button>
          <Button onClick={this.onShowModal} style={{ marginLeft: 10 }}>
            新增目录
          </Button>
        </FormItem>
      </Form>
    );
  };
  render() {
    const { menulist } = this.props;
    return (
      <div style={{ background: '#FFFFFF', padding: 20 }}>
        {this.renderForm()}
        <Table
          // expandedRowRender={this.expandedRowRender}
          dataSource={menulist}
          columns={getColumns(this)}
        >
          {/* <Column title="菜单名称" dataIndex="name"></Column>
                    <Column title="类型" dataIndex="type"></Column> */}
        </Table>
        <Modal />
      </div>
    );
  }
}
