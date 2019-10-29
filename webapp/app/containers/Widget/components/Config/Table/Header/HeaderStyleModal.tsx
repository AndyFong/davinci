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
import { Modal, Form, Row } from 'antd'
const FormItem = Form.Item
import { FormComponentProps, FormItemProps } from 'antd/lib/form'

import {
  BackgroundSetting,
  FontSetting,
  AlignmentSetting
} from 'components/StyleSetting'
import { IFontSetting } from 'components/StyleSetting/Font'
import { ITableCellStyle } from '../types'

interface IHeaderStyleModalProps extends FormComponentProps {
  visible: boolean
  onSave: (style: ITableCellStyle) => void
  onCancel: () => void
}

const formItemStyle: Partial<FormItemProps> = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

const HeaderStyleModal: React.FC<IHeaderStyleModalProps> = (props) => {
  const { visible, form, onSave, onCancel } = props
  const { getFieldDecorator } = form

  const saveStyle = useCallback(
    () => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return
        }
        const { backgroundColor, font, justifyContent } = values
        const cellStyle: ITableCellStyle = {
          backgroundColor,
          justifyContent,
          ...(font as IFontSetting)
        }
        onSave(cellStyle)
      })
    },
    [onSave]
  )

  return (
    <Modal
      title="表头样式设置"
      visible={visible}
      wrapClassName={`ant-modal-medium`}
      onOk={saveStyle}
      onCancel={onCancel}
    >
      <Form>
        <FormItem label="背景颜色" {...formItemStyle}>
          {getFieldDecorator('backgroundColor', {})(
            <BackgroundSetting size="small" />
          )}
        </FormItem>
        <FormItem label="字体设置" {...formItemStyle}>
          {getFieldDecorator('font', {})(<FontSetting size="small" />)}
        </FormItem>
        <FormItem label="对齐设置" {...formItemStyle}>
          {getFieldDecorator('justifyContent', {})(
            <AlignmentSetting type="horizontal" size="small" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create<IHeaderStyleModalProps>()(HeaderStyleModal)
