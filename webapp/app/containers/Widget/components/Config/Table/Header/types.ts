import { ViewModelVisualTypes } from 'containers/View/constants'
import { ITableCellStyle } from '../types'

export interface ITableHeaderConfigBase {
  key: string
  headerName: string
  isGroup: boolean
  style: ITableCellStyle
  children: ITableHeaderConfigBase[]
}

export interface ITableHeaderConfig extends ITableHeaderConfigBase {
  alias: string
  visualType: ViewModelVisualTypes
  children: ITableHeaderConfig[]
}
