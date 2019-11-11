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
import throttle from 'lodash/throttle'
import { MousePoint, BoxRect } from './types'
import { calculateSelectionBox } from './util'

const useMouseSelect = (
  enable: boolean,
  parentNode: HTMLElement,
  onSelectionChange: (keys: number[] | string[]) => void
) => {
  const [isMouseDown, setMouseDown] = useState(false)
  const [startPoint, setStartPoint] = useState<MousePoint>(null)
  const [endPoint, setEndPoint] = useState<MousePoint>(null)
  const [appendMode, setAppendMode] = useState(false)
  const [selectionBox, setSelectionBox] = useState<BoxRect>(null)

  useEffect(
    () => {
      if (!parentNode) {
        return
      }
      parentNode.style.position = 'relative'
      const onMouseDown = (e: MouseEvent) => {
        if (e.button === 2 || e.which === 2) {
          return
        }
        if (e.altKey || e.shiftKey || e.metaKey) {
          setAppendMode(true)
        }
        setMouseDown(true)
        setStartPoint({ x: e.pageX, y: e.pageY })
      }
      parentNode.addEventListener('mousedown', onMouseDown, false)
      return () => {
        parentNode.removeEventListener('mousedown', onMouseDown, false)
      }
    },
    [parentNode]
  )

  useEffect(
    () => {
      if (!isMouseDown || !startPoint) {
        return
      }
      let timer = null
      const isScrollX = parentNode.scrollWidth > parentNode.clientWidth
      const isScrollY = parentNode.scrollHeight > parentNode.clientHeight
      const initialScrollWidth = parentNode.scrollWidth
      const initialScrollHeight = parentNode.scrollHeight
      const onMouseMove = (e: MouseEvent) => {
        e.preventDefault()
        const newEndPoint = { x: e.pageX, y: e.pageY }
        const newSelectionBox = calculateSelectionBox(
          startPoint,
          newEndPoint,
          parentNode
        )
        setEndPoint(newEndPoint)
        setSelectionBox(newSelectionBox)
        if (!newEndPoint) {
          return
        }
        clearInterval(timer)
        let speed = [0, 0] // speedX, speedY
        if (
          isScrollX &&
          newEndPoint.x >= parentNode.clientWidth
        ) {
          speed[0] = (newEndPoint.x - parentNode.clientWidth) * 2.5
        }
        if (
          isScrollY &&
          newEndPoint.y >= parentNode.clientHeight
        ) {
          speed[1] = (newEndPoint.y - parentNode.clientHeight) * 2.5
        }
        if (!speed[0] && !speed[1]) {
          return
        }

        timer = setInterval(() => {
          requestAnimationFrame(() => {
            parentNode.scrollTo({
              left: parentNode.scrollLeft + speed[0],
              top: parentNode.scrollTop + speed[1]
            })
          })
        })
      }
      window.addEventListener('mousemove', onMouseMove, false)
      return () => {
        window.removeEventListener('mousemove', onMouseMove, false)
        if (timer) {
          clearInterval(timer)
        }
      }
    },
    [isMouseDown, startPoint, parentNode]
  )

  useEffect(() => {
    const onMouseUp = () => {
      setMouseDown(false)
      setStartPoint(null)
      setEndPoint(null)
      setSelectionBox(null)
      setAppendMode(false)
    }
    window.addEventListener('mouseup', onMouseUp, false)
    return () => {
      window.removeEventListener('mouseup', onMouseUp, false)
    }
  }, [])

  const selectionBorder = isMouseDown &&
    endPoint &&
    startPoint && (
      <div
        style={{
          position: 'absolute',
          border: '1px dashed #000',
          ...selectionBox
        }}
      />
    )

  return [selectionBorder, selectionBox]
}

export default useMouseSelect
