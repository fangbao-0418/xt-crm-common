import React from 'react';
import BaseCard from './components/baseCard';
import SkuCard from './components/skuCard';
import LogisCard from './components/logisCard';
import AuditCard from './components/auditCard';

class GoodsDetail extends React.Component {
  render() {
    return (
      <div>
        <BaseCard />
        <SkuCard />
        <LogisCard />
        <AuditCard />
      </div>
    );
  }
}

export default GoodsDetail;
