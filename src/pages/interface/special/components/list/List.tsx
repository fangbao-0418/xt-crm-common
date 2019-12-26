import React from 'react'
import ListContext from './Context'
import Item from './Item'

export interface Props {
  dataSource: any[]
}

class List extends React.Component<Props, any> {
  public static Item = Item
  public render () {
    const { dataSource, children } = this.props
    return (
      <ListContext.Provider value={dataSource}>
        {children}
      </ListContext.Provider>
    )
  }
}

export default List