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

import React, { useState, useCallback, forwardRef } from 'react'
import ColorPicker, { ColorPickerSizes } from 'components/ColorPicker'

interface IBackgroundSettingProps {
  value?: string
  size?: ColorPickerSizes
  onChange?: (color: string) => void
}

const BackgroundSetting: React.FC<IBackgroundSettingProps> = (props) => {
  const { value, size, onChange } = props
  const [color, setColor] = useState(value)

  const triggerChange = useCallback(
    (changedValue: string) => {
      if (onChange) {
        onChange(changedValue)
      }
    },
    [value, onChange]
  )

  return (
    <ColorPicker
      value={color}
      size={size}
      onChange={(val) => {
        setColor(val)
        triggerChange(val)
      }}
    />
  )
}

export default React.memo(forwardRef(BackgroundSetting))
