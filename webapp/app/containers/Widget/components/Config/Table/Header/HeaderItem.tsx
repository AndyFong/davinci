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

import React, { useCallback, useEffect, useContext } from 'react'
import { ITableHeaderConfig } from './types'

import { HeaderSelectedContext } from './util'
import { useMouseSelectChild } from 'utils/hooks'

interface IHeaderItemProps {
  config: ITableHeaderConfig
}

const HeaderItem: React.FC<IHeaderItemProps> = (props) => {
  const { config } = props
  const { key, alias, headerName, style, children } = config

  const {
    fontColor: color,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    backgroundColor,
    justifyContent
  } = style
  const cellCssStyle: React.CSSProperties = {
    color,
    fontFamily,
    fontSize: `${fontSize}px`,
    fontStyle,
    fontWeight: fontWeight as React.CSSProperties['fontWeight'],
    backgroundColor,
    justifyContent
  }

  const onHeaderItemClick = (e: React.MouseEvent) => {
    // if (e.)
  }

  const { selectedKeys, selectedKeysChange } = useContext(HeaderSelectedContext)
  const selected = selectedKeys.includes(key)
  const itemStyle: React.CSSProperties = {}
  if (selected) {
    cellCssStyle.opacity = 0.5
    itemStyle.borderWidth = 2
    itemStyle.borderStyle = 'dashed'
  }

  const itemRef = React.useRef<HTMLSpanElement>()
  const [isBoxIntersected] = useMouseSelectChild(itemRef.current, selected)
  useEffect(
    () => {
      if (isBoxIntersected) {
        selectedKeysChange(key, true)
      }
    },
    [isBoxIntersected]
  )

  return (
    <li style={itemStyle}>
      <span
        ref={itemRef}
        onClick={(e) => {
          selectedKeysChange(key, !selected, !(e.ctrlKey || e.altKey || e.metaKey))
        }}
        style={cellCssStyle}
      >
        {headerName}
      </span>
      {Array.isArray(children) &&
        children.length && (
          <ul>
            {children.map((child) => (
              <HeaderItem key={child.key} config={child} />
            ))}
          </ul>
        )}
    </li>
  )
}

export default HeaderItem
