import React, { useState } from 'react';
import LogisticsTrackModal from '../components/modal/LogisticsTrack';

function withModal(WrappedComponent: React.ComponentType<any>) {
	return () => {
		const [visible, setVisible]= useState<boolean>(false);
		return (
			<>
				<LogisticsTrackModal visible={visible}/>
				<WrappedComponent modal={() => {
					
				}}/>
			</>
		)
	}
}

export default withModal;