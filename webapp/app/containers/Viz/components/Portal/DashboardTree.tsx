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

import React, { useState, useEffect, useCallback } from 'react'

import { Card, Tree } from 'antd'
const { DirectoryTree } = Tree
import { AntTreeNodeMouseEvent } from 'antd/lib/tree'
import { IDashboard } from '../../types'

import {
  useDashboardTreeNodes,
  useDashboardConfigMenu
} from 'containers/Viz/hooks'

import { PortalToolbarProps } from './types'

interface IDashboardTreeProps {
  nodes: IDashboard[]
  toolbar: React.FunctionComponentElement<PortalToolbarProps>
}

const DashboardTree: React.FC<IDashboardTreeProps> = (props) => {
  const { nodes, toolbar } = props
  const [dashboardTreeNodes, firstDashboardKey] = useDashboardTreeNodes(nodes)

  const [dashboardMenuStyle, setDashboardMenuStyle] = useState({})
  const dashboardConfigMenu = useDashboardConfigMenu(dashboardMenuStyle)
  const [dashboardMenuVisible, setDashboardMenuVisible] = useState(false)
  const closeDashboardMenu = useCallback(() => {
    setDashboardMenuVisible(false)
  }, [])

  useEffect(() => {
    document.addEventListener('click', closeDashboardMenu, false)
    return () => {
      document.removeEventListener('click', closeDashboardMenu, false)
    }
  }, [])

  const showDashboardContextMenu = useCallback(
    (options: AntTreeNodeMouseEvent) => {
      const { node, event } = options
      const { pageX, pageY } = event
      const menuStyle: React.CSSProperties = {
        position: 'absolute',
        left: pageX,
        top: pageY
      }
      setDashboardMenuStyle(menuStyle)
      setDashboardMenuVisible(true)
    },
    []
  )

  const clonedToolbar = React.cloneElement(toolbar, {
    onSearch: () => {}
  })

  return (
    <>
      <Card size="small" title={toolbar}>
        <DirectoryTree
          defaultExpandAll
          blockNode
          defaultSelectedKeys={firstDashboardKey}
          onRightClick={showDashboardContextMenu}
        >
          {dashboardTreeNodes}
        </DirectoryTree>
      </Card>
      {dashboardMenuVisible && dashboardConfigMenu}
    </>
  )
}

export default DashboardTree
