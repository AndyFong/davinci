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

import React, { useState, useCallback } from 'react'
import produce from 'immer'
import { Dropdown, Menu } from 'antd'
const MenuItem = Menu.Item
import HeaderItem from './HeaderItem'
import HeaderStyleModal from './HeaderStyleModal'
import { ITableHeaderConfig } from './types'

import { HeaderSelectedContext } from './util'

import Styles from './styles.less'
import { ITableCellStyle } from '../types'
import { traverseConfig } from 'containers/Widget/components/Chart/Table/util'

import { useMouseSelect, MouseSelectProvider } from 'utils/hooks'

interface IHeaderCollectionProps {
  config: ITableHeaderConfig[]
  onChange: (config: ITableHeaderConfig[]) => void
}

const HeaderCollectionMenu = (
  <HeaderSelectedContext.Consumer>
    {({ openConfig }) => (
      <Menu onClick={openConfig}>
        <MenuItem>设置表头样式</MenuItem>
      </Menu>
    )}
  </HeaderSelectedContext.Consumer>
)

const HeaderCollection: React.FC<IHeaderCollectionProps> = (props) => {
  const { config, onChange } = props
  const [selectedKeys, setSelectedKeys] = useState([])
  const selectedKeysChange = useCallback(
    (key: string, selected: boolean, exclude: boolean) => {
      let newSelectedKeys: string[]
      if (exclude) {
        newSelectedKeys = selected ? [key] : []
      } else {
        newSelectedKeys = selected
          ? selectedKeys.concat(key)
          : selectedKeys.filter((k) => k !== key)
      }
      setSelectedKeys(newSelectedKeys)
    },
    [selectedKeys, setSelectedKeys]
  )

  const [modalVisible, setModalVisible] = useState(false)

  const saveHeaderStyle = (style: ITableCellStyle) => {
    const newConfig = produce(config, (draft) => {
      traverseConfig(draft, 'children', (currentConfig) => {
        if (selectedKeys.includes(currentConfig.key)) {
          currentConfig.style = style
        }
      })
    })
    onChange(newConfig)
  }

  const collectionRef = React.useRef<HTMLUListElement>()
  const [selectionBorder, selectionBox] = useMouseSelect(
    true,
    collectionRef.current,
    (keys: string[]) => {
      setSelectedKeys(keys)
    }
  )

  return (
    <div className={Styles.headerCollection}>
      <HeaderSelectedContext.Provider
        value={{
          selectedKeys,
          selectedKeysChange,
          openConfig: () => setModalVisible(true)
        }}
      >
        <MouseSelectProvider selection={selectionBox}>
          <Dropdown overlay={HeaderCollectionMenu} trigger={['contextMenu']}>
            <ul ref={collectionRef}>
              {config.map((cfg) => (
                <HeaderItem key={cfg.key} config={cfg} />
              ))}
              {selectionBorder}
            </ul>
          </Dropdown>
        </MouseSelectProvider>
        <HeaderStyleModal
          visible={modalVisible}
          onSave={saveHeaderStyle}
          onCancel={() => setModalVisible(false)}
        />
      </HeaderSelectedContext.Provider>
    </div>
  )
}

export default HeaderCollection
