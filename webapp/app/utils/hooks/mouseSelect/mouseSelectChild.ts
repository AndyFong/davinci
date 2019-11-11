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

import React, { useContext } from 'react'
import { MouseSelectContext, boxIntersects } from './util'
import { BoxRect } from './types'

const useMouseSelectChild = (childNode: HTMLElement, currentSelected: boolean) => {
  const { selectionBox } = useContext(MouseSelectContext)
  if (!selectionBox) {
    return [currentSelected]
  }
  if (!childNode) {
    return [currentSelected]
  }
  const { offsetTop, offsetLeft, clientWidth, clientHeight } = childNode
  const childBox: BoxRect = {
    top: offsetTop,
    left: offsetLeft,
    width: clientWidth,
    height: clientHeight
  }
  const isBoxIntersected = boxIntersects(selectionBox, childBox)
  // if (childNode.innerText.includes('@E42454ED')) {
  //   console.log(childBox, selectionBox, isBoxIntersected)
  // }
  return [isBoxIntersected]
}

export default useMouseSelectChild
