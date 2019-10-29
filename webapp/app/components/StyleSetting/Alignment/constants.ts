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

import { HorizontalAlignmentValue, VerticalAlignmentValue } from './types'

export const HorizontalAlignmentLocale: {
  [key in HorizontalAlignmentValue]: string
} = {
  left: '左对齐',
  center: '居中',
  right: '右对齐'
}

export const VerticalAlignmentLocale: {
  [key in VerticalAlignmentValue]: string
} = {
  top: '上',
  middle: '中',
  bottom: '下'
}

