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

import React, { useMemo, useCallback } from 'react'
import { IPortal, IDisplayFormed } from 'containers/Viz/types'

import { Row, Col, Card, Tree, Checkbox, Button, Icon, Popconfirm } from 'antd'
const CheckboxGroup = Checkbox.Group
const { TreeNode } = Tree
import { CheckboxOptionType } from 'antd/lib/checkbox'
import { AntTreeNode, AntTreeNodeCheckedEvent } from 'antd/lib/tree'

import { traverseTree } from 'utils/util'

import { IDashboard } from 'containers/Dashboard'
import { IScheduleVizItem } from './types'

interface IScheduleVizConfigProps {
  displays: IDisplayFormed[]
  portals: IPortal[]
  value: IScheduleVizItem[]
  portalDashboards: { [portalId: number]: IDashboard[] }
  onLoadPortalDashboards: (portalId: number) => void
  onChange: (value: IScheduleVizItem[]) => void
}

const portalNodeKeyPrefix = 'portal_'
const dashboardNodeKeyPrefix = 'dashboard_'

const renderPortalDashboardsTreeNodes = (
  portalId: number,
  dashboards: IDashboard[],
  ancestorIds: number[] = [0]
) => {
  if (!Array.isArray(dashboards)) {
    return null
  }

  const dashboardTreeNodes = dashboards.map((d) => {
    const isLeaf = !Array.isArray(d.children)
    const childIds = isLeaf ? [] : d.children.map((child) => child.id)

    return (
      <TreeNode
        title={d.name}
        icon={<Icon type={isLeaf ? 'dot-chart' : 'folder-open'} />}
        key={`${dashboardNodeKeyPrefix}${d.id}`}
        isLeaf={isLeaf}
        dataRef={[portalId, ancestorIds, childIds]}
      >
        {renderPortalDashboardsTreeNodes(
          portalId,
          d.children,
          ancestorIds.concat(d.id)
        )}
      </TreeNode>
    )
  })
  return dashboardTreeNodes
}

const ScheduleVizConfig: React.FC<IScheduleVizConfigProps> = (props) => {
  const {
    displays,
    portals,
    value,
    portalDashboards,
    onLoadPortalDashboards,
    onChange
  } = props

  const displayOptions = useMemo(
    () =>
      displays.map<CheckboxOptionType>(({ id, name }) => ({
        label: name,
        value: id
      })),
    [displays]
  )

  const vizConfig = useMemo(() => {
    const portalKeys = !Array.isArray(portals)
      ? []
      : value
          .filter(({ contentType }) => contentType === 'portal')
          .reduce<string[]>((acc, { id, items }) => {
            // checked all Dashboards under this Portal
            if (!Array.isArray(items)) {
              // check the Portal's validity
              if (~portals.findIndex((portal) => portal.id === id)) {
                acc.push(`${portalNodeKeyPrefix}${id}`)
              }
            } else {
              // check the partial Dashboards under this Portal
              items.map((dashboardId) => {
                acc.push(`${dashboardNodeKeyPrefix}${dashboardId}`)
              })
            }
            return acc
          }, [])
    const displayKeys = value
      .filter(({ contentType }) => contentType === 'display')
      .map(({ id }) => id)
    return { portalKeys, displayKeys }
  }, [value, portals])

  const loadPortalDashboards = useCallback(
    (portalTreeNode: AntTreeNode) => {
      const nodeKey = portalTreeNode.props.eventKey
      const portalId = +nodeKey.slice(portalNodeKeyPrefix.length)
      if (
        nodeKey.includes(portalNodeKeyPrefix) &&
        !portalDashboards[portalId]
      ) {
        onLoadPortalDashboards(portalId)
      }
      return new Promise((resolve) => {
        resolve()
      })
    },
    [portalDashboards, onLoadPortalDashboards]
  )

  const checkPortalDashboards = useCallback(
    (_, e: AntTreeNodeCheckedEvent) => {
      let newValue = [...value]
      const { checked, node } = e
      const { eventKey, dataRef } = node.props

      // Portal Node
      if (eventKey.includes(portalNodeKeyPrefix)) {
        const portalId = +eventKey.slice(portalNodeKeyPrefix.length)
        // remove this Portal value first
        newValue = newValue.filter(({ id }) => id !== portalId)
        if (checked) {
          newValue.push({
            contentType: 'portal',
            id: portalId,
            items: undefined // undefined stands for dynamic check all dashboards
          })
          if (!portalDashboards[portalId]) {
            onLoadPortalDashboards(portalId)
          }
        }
      }
      // Dashboard Node
      else if (eventKey.includes(dashboardNodeKeyPrefix)) {
        const [portalId, ancestorIds, descendantIds] = dataRef
        const dashboardId = +eventKey.slice(dashboardNodeKeyPrefix.length)
        const portalIdx = newValue.findIndex(
          ({ id, contentType }) => id === portalId && contentType === 'portal'
        )
        if (~portalIdx) {
          const portal = newValue[portalIdx]
          if (checked) {
            portal.items = portal.items
              .filter((item) => !descendantIds.includes(item))
              .concat(dashboardId)
          } else {
            if (!portal.items) {
              portal.items = []
              traverseTree(
                portalDashboards[portal.id],
                'children',
                (dashboard) => {
                  portal.items.push(dashboard.id)
                }
              )
            }
            portal.items = portal.items.filter(
              (id) =>
                id !== dashboardId &&
                !ancestorIds.includes(id) &&
                !descendantIds.includes(id)
            )
            if (!portal.items.length) {
              newValue.splice(portalIdx, 1)
            }
          }
        } else {
          // new checked true
          newValue.push({
            contentType: 'portal',
            id: portalId,
            items: [dashboardId]
          })
        }
      }
      onChange(newValue)
    },
    [value, portalDashboards, onLoadPortalDashboards, onChange]
  )

  const displayKeysChange = useCallback(
    (displayKeys: number[]) => {
      const newValue = value
        .filter(({ contentType }) => contentType === 'portal')
        .concat(
          displayKeys.map<IScheduleVizItem>((key) => ({
            contentType: 'display',
            id: key,
            items: undefined // @TODO items id from display slides
          }))
        )
      onChange(newValue)
    },
    [value, onChange]
  )

  return (
    <Row gutter={8}>
      <Col span={12}>
        <Card size="small" title="Dashboard">
          <Tree
            checkable
            blockNode
            showIcon
            checkedKeys={vizConfig.portalKeys}
            loadData={loadPortalDashboards}
            onCheck={checkPortalDashboards}
          >
            {(portals || []).map(({ id, name }) => (
              <TreeNode
                title={name}
                icon={<Icon type="layout" />}
                key={`${portalNodeKeyPrefix}${id}`}
                isLeaf={false}
              >
                {renderPortalDashboardsTreeNodes(id, portalDashboards[id])}
              </TreeNode>
            ))}
          </Tree>
        </Card>
      </Col>
      <Col span={12}>
        <Card size="small" title="Display">
          {/* @TODO make it to tree select when has Display Slide feature */}
          <CheckboxGroup
            options={displayOptions}
            value={vizConfig.displayKeys}
            onChange={displayKeysChange}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default ScheduleVizConfig
