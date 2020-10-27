import { statusEnum, statusMapColorEnum } from './config'
import React from 'react'

interface Props {
	status: 0 | 1
}
function Color ({ status }: Props) {
	return (
		<span style={{ color: statusMapColorEnum[status]}}>{statusEnum[status]}</span>
	)
}

export default Color