import React from 'react';
import { Table, Card, Button, Modal, message } from 'antd';
import { queryBannerList, updateBannerStatus, deleteBanner } from '../api';
import BannerModal from '../banner-modal';
import { formatDate } from '../../helper';
import { TextMapPosition } from '../constant';
import Image from '../../../components/Image';
import Search from './Search'
const replaceHttpUrl = ( imgUrl = '' ) => {
  let imgUrlTrim = imgUrl.trim();
  if (imgUrlTrim.indexOf('http') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrlTrim;
  }
  return imgUrlTrim;
}

class OrderList extends React.Component {
  static defaultProps = {};
  payload = {
    page: 1,
    pageSize: 10
  }
  state = {
    selectedRowKeys: [],
    list: [],
    current: 1,
    pageSize: 10,
    total: 0,
  };

  componentDidMount() {
    this.query();
  }

  query = () => {
    this.setState({
      page: this.payload.page,
      pageSize: this.payload.pageSize
    })
    queryBannerList(this.payload).then(res => {
      this.setState({
        list: res.records,
        total: res.total,
      });
    });
  };

  toggleStatus = (id, status) => {
    updateBannerStatus({
      id,
      status,
    }).then((res) => {
      res && message.success('操作成功');
      this.query();
    });
  };

  handlePageChange = (page, pageSize) => {
    this.payload.page = page
    this.setState(
      {
        current: page,
        pageSize,
      },
      this.query,
    );
  };
  delete = id => {
    Modal.confirm({
      title: '确认',
      content: '确认删除吗？',
      okText: '删除',
      okType: 'danger',
      onOk: () => {
        return deleteBanner({ id }).then(() => {
          this.query();
        });
      },
    });
  };

  render() {
    const { current, total, pageSize } = this.state;

    const columns = [
      {
        title: '排序',
        align: 'center',
        dataIndex: 'sort',
      },
      {
        title: 'banner图',
        dataIndex: 'imgUrlWap',
        render(imgUrlWap) {
          return <Image src={replaceHttpUrl(imgUrlWap)} alt="banner图" style={{ maxWidth: 150, maxHeight: 150 }} />;
        },
      },
      {
        title: 'banner名称 ',
        dataIndex: 'title',
      },
      {
        title: '上线时间',
        dataIndex: 'onlineTime',
        render(onlineTime) {
          return formatDate(onlineTime);
        },
      },
      {
        title: '下线时间',
        dataIndex: 'offlineTime',
        render(offlineTime) {
          return formatDate(offlineTime);
        },
      },
      {
        title: '链接地址',
        dataIndex: 'jumpUrlWap',
        render: (text) => {
          return (
            <span className='href' onClick={() => APP.href(text, '__blank')}>{text}</span>
          )
        }
      },
      {
        title: '位置',
        dataIndex: 'seat',
        render(seat, record) {
          return <span>{record.newSeatStr}/{record.childSeatStr}</span>
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(status) {
          return status ? '开启' : '关闭';
        },
      },
      {
        title: '操作',
        align: 'center',
        width: 200,
        render: (operator, { id, status }) => {
          return (
            <>
              <BannerModal size='small' onSuccess={this.query} isEdit id={id} /> &nbsp;
              <Button
                size='small'
                onClick={() => {
                  this.toggleStatus(id, status ? 0 : 1);
                }}
              >
                {status ? '关闭' : '开启'}
              </Button>
              &nbsp;
              <Button
                size='small'
                type="danger"
                onClick={() => {
                  this.delete(id);
                }}
              >
                删除
              </Button>
            </>
          );
        },
      },
    ].filter(column => !column.hide);
    return (
      <>
        <Card title="">
          {/* <Button onClick={this.query}>查询</Button> &nbsp; */}
          <BannerModal onSuccess={this.query} isEdit={false} />
          <Search
            className='ml10'
            onChange={(value) => {
              this.payload = {
                ...this.payload,
                ...value,
                page: 1
              }
              this.query()
            }}
          />
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Table
            bordered
            columns={columns}
            dataSource={this.state.list}
            pagination={{
              current,
              total,
              pageSize,
              onChange: this.handlePageChange,
            }}
            rowKey={record => record.id}
          />
        </Card>
      </>
    );
  }
}

export default OrderList;
