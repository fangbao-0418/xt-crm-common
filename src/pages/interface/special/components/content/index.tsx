import React from 'react';
import { connect } from 'react-redux';
import Draggable from '@/components/draggable';
import { namespace } from '../../model';
import Card from './Card';
import styles from './style.module.sass';
interface Props {
  detail: Special.DetailItem;
}
class Main extends React.Component<Props> {
  public render() {
    const { detail } = this.props;
    return (
      <div>
        {detail.list.map((item, index) => {
          return (
            <Card
              key={index}
              detail={item}
              onChange={(value: any) => {
                console.log('value=>', value);
                if (value) {
                  detail.list[index] = value;
                } else {
                  detail.list.splice(index, 1);
                }
                APP.dispatch({
                  type: `${namespace}/changeDetail`,
                  payload: { ...detail },
                });
              }}
            />
          );
        })}
      </div>
    );
  }
}
export default connect((state: any) => {
  return {
    detail: state[namespace].detail,
  };
})(Main);
