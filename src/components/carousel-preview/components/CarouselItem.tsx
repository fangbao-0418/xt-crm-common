import React from 'react'
import { ListItem } from '../config/interface'
import { getUrl } from '../config/adapter'

const CarouselItem = ({ item }: { item: ListItem }) => {
  let src = ''
  let desc = ''

  if (typeof item === 'string') {
    src = getUrl(item)
  } else {
    src = getUrl(item.value)
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
