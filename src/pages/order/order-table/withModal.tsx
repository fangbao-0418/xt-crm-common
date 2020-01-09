import React, { useState } from 'react';
import LogisticsTrackModal from '../components/modal/LogisticsTrack';

function withModal(WrappedComponent: React.ComponentType<any>) {
	return (props: any) => {
    const [visible, setVisible]= useState<boolean>(false);
		return (
			<>
				<LogisticsTrackModal visible={visible}/>
				<WrappedComponent
          {...props}
          modal={() => {
            setVisible(true)
          }
        }/>
			</>
		)
	}
}

export default withModal;