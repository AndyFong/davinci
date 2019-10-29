/*
 * <<
 * Davinci
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import React from 'react'
import { Drawer } from 'antd'
import HeaderCollection from '../Header/HeaderCollection'
import { ITableHeaderConfig } from '../Header/types'

import Styles from './TableConfigDrawer.less'

interface ITableConfigDrawerProps {
  visible: boolean
  config: ITableHeaderConfig[]
  onClose: () => void
}

const TableConfigDrawer: React.FC<ITableConfigDrawerProps> = (props) => {
  const { visible, config, onClose } = props
  return (
    <Drawer
      title="表格样式设置"
      placement="top"
      visible={visible}
      onClose={onClose}
    >
      <HeaderCollection config={config} />
    </Drawer>
  )
}

export default TableConfigDrawer
