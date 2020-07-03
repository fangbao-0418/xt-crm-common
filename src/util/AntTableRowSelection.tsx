import React from 'react'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'

interface State {
  selectedRowKeys: any[]
  selectedRows: any[]
}

function filterRows<R> (rows: any[], key: string): R[] {
  const temp: {[key: number]: boolean} = {}
  const result: any[] = []
  rows.map((item) => {
    const id = item[key]
    if (!temp[id]) {
      result.push(item)
      temp[id] = true
    }
  })
  return result
}

class Main<P, S, R = any> extends React.Component<P, S & State> {
  public rowSelectionKey: string
  public selectedRows: R[] = []
  private _selectedRowKeys: any[] = []
  private _onRowSelectionSelect (record: any, selected: boolean, selectedRows: Object[]) {
    const key = this.rowSelectionKey
    const isExist = this.selectedRows.find((item: any) => item[key] === record[key])
    if (selected && !isExist) {
      this.selectedRows.push(record)
    } else if (!selected && isExist) {
      this.selectedRows = this.selectedRows.filter((item: any) => item[key] !== record[key])
    }
    this._onChange()
  }
  private _onRowSelectionSelectAll (selected: boolean, selectedRows: R[], changeRows: R[]) {
    console.log(this.selectedRows, '_onRowSelectionSelectAll')
    const key = this.rowSelectionKey
    if (selected) {
      changeRows.map((item) => {
        this.selectedRows.push(item)
      })
    } else {
      this.selectedRows = this.selectedRows.filter((item: any) => {
        return !changeRows.find((val: any) => val[key] === item[key])
      })
    }
    this.selectedRows = filterRows<R>(this.selectedRows, key)
    this._onChange()
  }
  private _onRowSelectionChange (selectedRowKeys: any, rows: any) {
    this._selectedRowKeys = selectedRowKeys
    this.setState({
      selectedRowKeys
    })
  }
  public onRowSelectChange: (selectedRowKeys: any[], rows: R[]) => void
  private _onChange = () => {
    if (this.onRowSelectChange) {
      this.onRowSelectChange(this._selectedRowKeys, this.selectedRows)
    }
  }
  public get rowSelection (): TableRowSelection<R> {
    return {
      type: 'checkbox',
      onSelect: this._onRowSelectionSelect.bind(this),
      onSelectAll: this._onRowSelectionSelectAll.bind(this),
      onChange: this._onRowSelectionChange.bind(this),
      selectedRowKeys: this.state.selectedRowKeys
    }
  }
}

export default Main