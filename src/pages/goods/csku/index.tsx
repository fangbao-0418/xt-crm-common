import React from 'react';
import { ListPage } from '@/packages/common/components';
class List extends React.Component {
  columns = [{

  }]
  render() {
    return (
      <ListPage
        api={() => Promise.resolve({ records: []})}
        columns={this.columns}
      />
    )
  }
}

export default List;