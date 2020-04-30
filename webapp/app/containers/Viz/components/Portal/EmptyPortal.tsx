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

import { Layout, Result, Button } from 'antd'
const { Content } = Layout

const EmptyPortal: React.FC = () => {
  return (
    <Content
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Result
        icon={<img src={require('assets/images/noDashboard.png')} />}
        extra={
          <p>
            请
            <Button size="small" type="link">
              创建文件夹
            </Button>
            或
            <Button size="small" type="link">
              创建 Dashboard
            </Button>
          </p>
        }
      />
    </Content>
  )
}

export default EmptyPortal
