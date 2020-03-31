import React from 'react'
import { ListItem } from '../config/interface'

const CarouselItem = ({ item }: { item: ListItem }) => {
  let src = ''
  let desc = ''

  if (typeof item === 'string') {
    src = item
  } else {
    src = item.value
    desc = item.label
  }

  return (
    <div style={{ maxWidth: 750 }}>
      <img
        style={{ margin: '0 auto', maxWidth: '100%' }}
        alt='img'
        src={src}
      />
      {desc && (
        <p style={{ textAlign: 'center' }}>{desc}</p>
      )}
    </div>
  )
}

export default CarouselItem
