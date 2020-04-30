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

import React, { forwardRef, useImperativeHandle } from 'react'

import { Form } from 'antd'
const FormItem = Form.Item
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form'

import {
  BackgroundSetting,
  FontSetting,
  AlignmentSetting
} from 'components/StyleSetting'
import { IFontSetting } from 'components/StyleSetting/Font'

import { ITableCellStyle } from './types'

interface ICellStyleSettingProps extends FormComponentProps {
  style: ITableCellStyle
}

const CellStyleSetting: React.ForwardRefRenderFunction<
  WrappedFormUtils,
  ICellStyleSettingProps
> = (props, ref) => {
  const { form, style } = props
  const { getFieldDecorator } = form
  const {
    backgroundColor,
    fontColor,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    justifyContent
  } = style
  const fontSetting: IFontSetting = {
    fontFamily,
    fontStyle,
    fontSize,
    fontWeight,
    fontColor
  }

  useImperativeHandle(ref, () => form)

  return (
    <Form>
      <FormItem label="背景色">
        {getFieldDecorator<ITableCellStyle>('backgroundColor', {
          initialValue: backgroundColor
        })(<BackgroundSetting />)}
      </FormItem>
      <FormItem label="字体">
        {getFieldDecorator('font', {
          initialValue: fontSetting
        })(<FontSetting />)}
      </FormItem>
      <FormItem label="对齐">
        {getFieldDecorator<ITableCellStyle>('justifyContent', {
          initialValue: justifyContent
        })(<AlignmentSetting type="horizontal" />)}
      </FormItem>
    </Form>
  )
}

export default Form.create<ICellStyleSettingProps>()(
  forwardRef(CellStyleSetting)
)
