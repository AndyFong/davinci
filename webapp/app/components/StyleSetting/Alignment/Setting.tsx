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

import React, { useCallback } from 'react'
import {
  AlignmentSettingTypes,
  HorizontalAlignmentValue,
  VerticalAlignmentValue
} from './types'
import { Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

import { HorizontalAlignmentLocale, VerticalAlignmentLocale } from './constants'

interface IAlignmentSettingBaseProps {
  size?: 'large' | 'default' | 'small'
  onChange?: (value: HorizontalAlignmentValue | VerticalAlignmentValue) => void
}

type AlignmentSettingProps = IAlignmentSettingBaseProps & AlignmentSettingTypes

const AlignmentSetting: React.FC<AlignmentSettingProps> = (props) => {
  const { type, value: alignValue, size, onChange } = props

  const radioBtns = Object.entries(
    type === 'horizontal' ? HorizontalAlignmentLocale : VerticalAlignmentLocale
  ).map(([value, text]) => (
    <RadioButton key={value} value={value}>
      {text}
    </RadioButton>
  ))

  const triggerChange = useCallback(
    (e: RadioChangeEvent) => {
      if (onChange) {
        onChange(e.target.value)
      }
    },
    [onChange]
  )

  return (
    <RadioGroup size={size} value={alignValue} onChange={triggerChange}>
      {radioBtns}
    </RadioGroup>
  )
}

export default AlignmentSetting
