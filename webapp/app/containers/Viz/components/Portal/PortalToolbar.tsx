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

import React, { useCallback, useRef } from 'react'
import { Row, Button, Tooltip, Popover } from 'antd'
import Search from 'antd/lib/input/Search'
const ButtonGroup = Button.Group

import { PortalToolbarProps } from './types'

interface IPortalToolbarProps extends Partial<PortalToolbarProps> {
  onAdd: () => void
}

const PortalToolbar: React.FC<IPortalToolbarProps> = (props) => {
  const { onSearch, onAdd, onExpandAll, onCollapseAll } = props

  const searchRef = useRef<Search>(null)
  const visibleChange = useCallback(
    (visible) => {
      if (visible && searchRef.current) {
        const input = searchRef.current
        setTimeout(() => input.focus())
      }
    },
    [searchRef.current]
  )

  const searchDashboard = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value)
    },
    [onSearch]
  )

  return (
    <Row type="flex" justify="end">
      <ButtonGroup>
        <Tooltip title="搜索">
          <Popover
            trigger="click"
            onVisibleChange={visibleChange}
            content={
              <Search
                ref={searchRef}
                autoFocus
                onChange={searchDashboard}
                size="small"
                placeholder="输入关键词"
              />
            }
          >
            <Button size="small" type="link" icon="search" />
          </Popover>
        </Tooltip>
        <Tooltip title="添加">
          <Button size="small" type="link" icon="plus" onClick={onAdd} />
        </Tooltip>
        <Tooltip title="收起全部">
          <Button
            size="small"
            type="link"
            icon="folder"
            onClick={onExpandAll}
          />
        </Tooltip>
        <Tooltip title="展开全部">
          <Button
            size="small"
            type="link"
            icon="folder-open"
            onClick={onCollapseAll}
          />
        </Tooltip>
      </ButtonGroup>
    </Row>
  )
}

export default PortalToolbar
