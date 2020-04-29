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

import moment from 'moment'
import { ConditionValueTypes } from './types'

export function getInitValueByVisualType(
  visualType: string
): ConditionValueTypes {
  switch (visualType) {
    case 'string':
    case 'geoCountry':
    case 'geoProvince':
    case 'geoCity':
      return ''
    case 'number':
      return 0
    case 'date':
      return moment().format('YYYY-MM-DD')
    case 'boolean':
      return false
    default:
      return null
  }
}

export function getControlValueByVisualType(visualType: string, args: any[]) {
  let value: ConditionValueTypes
  switch (visualType) {
    case 'string':
    case 'geoCountry':
    case 'geoProvince':
    case 'geoCity':
      value = (args[0] as React.ChangeEvent<HTMLInputElement>).target.value
      break
    case 'number':
    case 'boolean':
      value = args[0]
      break
    case 'date':
      value = args[1]
      break
  }
  return value
}
