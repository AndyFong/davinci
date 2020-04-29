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
import classnames from 'classnames'
import moment from 'moment'
import OperatorTypes from 'utils/operatorTypes'
import { getInitValueByVisualType, getControlValueByVisualType } from './util'
import { ConditionValueTypes } from './types'

import {
  Row,
  Col,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Tag,
  Switch
} from 'antd'

import Styles from './ConditionValuesControl.less'

interface IConditionValuesControlProps {
  className?: string
  size: 'small' | 'default'
  visualType: string
  operatorType: OperatorTypes
  conditionValues: ConditionValueTypes[]
  onChange: (values: ConditionValueTypes[]) => void
}

interface IConditionValuesControlStates {
  localValues: ConditionValueTypes[]
  tagInputting: boolean
  tagInputValue: ConditionValueTypes
}

export class ConditionValuesControl extends React.PureComponent<
  IConditionValuesControlProps,
  IConditionValuesControlStates
> {
  public static defaultProps: Partial<IConditionValuesControlProps> = {
    size: 'default'
  }

  private controlStyle: React.CSSProperties = { width: '100%' }

  public constructor(props: IConditionValuesControlProps) {
    super(props)
    const localValues = ConditionValuesControl.initLocalValues(this.props)
    this.state = {
      localValues,
      tagInputting: false,
      tagInputValue: ''
    }
    if (localValues.length !== props.conditionValues.length) {
      props.onChange([...localValues])
    }
  }

  public static getDerivedStateFromProps: React.GetDerivedStateFromProps<
    IConditionValuesControlProps,
    IConditionValuesControlStates
  > = (nextProps) => {
    const localValues = ConditionValuesControl.initLocalValues(nextProps)
    if (localValues.length !== nextProps.conditionValues.length) {
      nextProps.onChange([...localValues])
    }
    return { localValues }
  }

  private static initLocalValues(props: IConditionValuesControlProps) {
    const { operatorType, visualType, conditionValues } = props

    const values = []
    const initValue = getInitValueByVisualType(visualType)
    let valuesCount = 0
    switch (operatorType) {
      case OperatorTypes.Contain:
      case OperatorTypes.Equal:
      case OperatorTypes.GreaterThan:
      case OperatorTypes.GreaterThanOrEqual:
      case OperatorTypes.LessThan:
      case OperatorTypes.LessThanOrEqual:
      case OperatorTypes.NotEqual:
        valuesCount = 1
        break
      case OperatorTypes.Between:
        valuesCount = 2
      case OperatorTypes.In:
        valuesCount = conditionValues.length
        break
    }

    for (let idx = 0; idx < valuesCount; idx++) {
      if (
        conditionValues[idx] &&
        typeof conditionValues[idx] === typeof initValue
      ) {
        values.push(conditionValues[idx])
      } else {
        values.push(initValue)
      }
    }

    return values
  }

  private localValuesChange = (idx: number) => (...args: any[]) => {
    const { onChange, visualType } = this.props
    const value = getControlValueByVisualType(visualType, args)
    const { localValues } = this.state
    const values = [...localValues]
    values.splice(idx, 1, value)
    onChange(values)
  }

  private renderControl = (idx: number) => {
    const { visualType, size } = this.props
    const { localValues } = this.state

    let control: React.ReactNode
    switch (visualType) {
      case 'string':
      case 'geoCountry':
      case 'geoProvince':
      case 'geoCity':
        const stringValue = localValues[idx] as string
        control = (
          <Input
            style={this.controlStyle}
            size={size}
            value={stringValue}
            onChange={this.localValuesChange(idx)}
          />
        )
        break
      case 'number':
        const numberValue = localValues[idx] as number
        control = (
          <InputNumber
            style={this.controlStyle}
            size={size}
            value={numberValue}
            onChange={this.localValuesChange(idx)}
          />
        )
        break
      case 'date':
        const dateValue = moment(localValues[idx] as string)
        control = (
          <DatePicker
            style={this.controlStyle}
            size={size}
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            value={dateValue}
            onChange={this.localValuesChange(idx)}
          />
        )
        break
      case 'boolean':
        const booleanValue = localValues[idx] as boolean
        control = (
          <Switch
            size={size}
            checkedChildren="是"
            unCheckedChildren="否"
            checked={booleanValue}
            onChange={this.localValuesChange(idx)}
          />
        )
    }

    return control
  }

  private renderRow = () => {
    const { operatorType } = this.props

    let controls: React.ReactNode
    switch (operatorType) {
      case OperatorTypes.Contain:
      case OperatorTypes.Equal:
      case OperatorTypes.GreaterThan:
      case OperatorTypes.GreaterThanOrEqual:
      case OperatorTypes.LessThan:
      case OperatorTypes.LessThanOrEqual:
      case OperatorTypes.NotEqual:
        controls = this.renderControl(0)
        break
      case OperatorTypes.Between:
        controls = (
          <Row
            key="between"
            type="flex"
            align="middle"
            className={Styles.rowBlock}
          >
            <Col span={11}>{this.renderControl(0)}</Col>
            <Col span={2} className={Styles.colDivider}>
              -
            </Col>
            <Col span={11}>{this.renderControl(1)}</Col>
          </Row>
        )
        break
      case OperatorTypes.In:
        controls = this.renderTags()
        break
    }

    return controls
  }

  private renderTags = () => {
    const { visualType } = this.props
    const { localValues, tagInputting, tagInputValue } = this.state

    const tagList = localValues.map((val) => (
      <Tag
        key={val.toString()}
        className={Styles.tag}
        closable
        afterClose={this.removeTag(val)}
      >
        {val}
      </Tag>
    ))

    const tagInputControl = []
    if (tagInputting) {
      switch (visualType) {
        case 'string':
        case 'geoCountry':
        case 'geoProvince':
        case 'geoCity':
          tagInputControl.push(
            <Input
              key="input"
              type="text"
              size="small"
              className={Styles.tagInput}
              value={tagInputValue as string}
              onChange={this.tagInputValueChange}
              onBlur={this.addTag}
              onPressEnter={this.addTag}
            />
          )
          break
        case 'number':
          tagInputControl.push(
            <InputNumber
              key="inputNumber"
              size="small"
              className={Styles.tagInput}
              value={tagInputValue as number}
              onChange={this.tagInputValueChange}
            />
          )
          break
        case 'date':
          const dateValue = moment(
            (tagInputValue || moment().format('YYYY-MM-DD')) as string
          )
          tagInputControl.push(
            <DatePicker
              key="datePicker"
              size="small"
              className={Styles.tagInput}
              value={dateValue}
              onChange={this.tagInputValueChange}
            />
          )
          break
      }
      tagInputControl.push(
        <Button
          key="saveTag"
          className={Styles.tagBtn}
          size="small"
          type="dashed"
          onClick={this.addTag}
        >
          确定
        </Button>
      )
    } else {
      tagInputControl.push(
        <Button
          key="addTag"
          className={Styles.tagBtn}
          size="small"
          type="dashed"
          onClick={this.showTagInput}
        >
          + 添加
        </Button>
      )
    }

    const rowCls = classnames({
      [Styles.rowBlock]: true,
      [Styles.tagList]: true
    })

    return (
      <Row key="tag" type="flex" align="middle" className={rowCls}>
        {tagList}
        {tagInputControl}
      </Row>
    )
  }

  private showTagInput = () => {
    this.setState({
      tagInputting: true
    })
  }

  private addTag = () => {
    const { tagInputValue, localValues } = this.state
    if (tagInputValue) {
      const { onChange, visualType } = this.props
      const newValues = localValues
        .filter((val) => val !== tagInputValue)
        .concat(tagInputValue)
      onChange(newValues)
      this.setState({
        tagInputting: false,
        tagInputValue: getInitValueByVisualType(visualType)
      })
    }
  }

  private removeTag = (tag) => () => {
    const { onChange } = this.props
    const { localValues } = this.state
    onChange(localValues.filter((val) => val !== tag))
  }

  private tagInputValueChange = (...args: any[]) => {
    const { visualType } = this.props
    const tagInputValue = getControlValueByVisualType(visualType, args)
    this.setState({ tagInputValue })
  }

  public render() {
    const { className } = this.props
    return <div className={className}>{this.renderRow()}</div>
  }
}

export default ConditionValuesControl
