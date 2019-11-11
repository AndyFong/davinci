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
import { BoxRect, MousePoint } from './types'

export const MouseSelectContext = React.createContext<{
  selectionBox: BoxRect
}>(null)

export function boxIntersects(boxA: BoxRect, boxB: BoxRect): boolean {
  if (
    boxA.left <= boxB.left + boxB.width &&
    boxA.left + boxA.width >= boxB.left &&
    boxA.top <= boxB.top + boxB.height &&
    boxA.top + boxA.height >= boxB.top
  ) {
    return true
  }
  return false
}

export function calculateSelectionBox(
  startPoint: MousePoint,
  endPoint: MousePoint,
  parentNode: HTMLElement
): BoxRect {
  const left = Math.min(startPoint.x, endPoint.x) - parentNode.offsetLeft + parentNode.scrollLeft
  const top = Math.min(startPoint.y, endPoint.y) - parentNode.offsetTop + parentNode.scrollTop
  const width = Math.abs(startPoint.x - endPoint.x)
  const height = Math.abs(startPoint.y - endPoint.y)
  return { left, top, width, height }
}
