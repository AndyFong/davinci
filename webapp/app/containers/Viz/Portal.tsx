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

import React, { useEffect, useCallback } from 'react'
import { createStructuredSelector } from 'reselect'
import { useDispatch, useSelector } from 'react-redux'
import { makeSelectDownloadList } from 'containers/App/selectors'
import {
  makeSelectPortals,
  makeSelectCurrentPortal,
  makeSelectCurrentDashboards
} from './selectors'

import {
  hideNavigator,
  loadDownloadList,
  downloadFile
} from 'containers/App/actions'
import { VizActions } from './actions'

import { Route } from 'react-router-dom'
import { RouteComponentWithParams } from 'utils/types'

import { Layout, PageHeader } from 'antd'
import SplitPane from 'components/SplitPane'
import DownloadList from 'components/DownloadList'
import { Grid } from 'containers/Dashboard/Loadable'

import EmptyPortal from './components/Portal/EmptyPortal'
import DashboardTree from './components/Portal/DashboardTree'
import PortalToolbar from './components/Portal/PortalToolbar'

const mapStateToProps = createStructuredSelector({
  downloadList: makeSelectDownloadList(),
  portals: makeSelectPortals(),
  currentPortal: makeSelectCurrentPortal(),
  currentDashboards: makeSelectCurrentDashboards()
})

interface IVizPortalProps extends RouteComponentWithParams {}

const VizPortal: React.FC<IVizPortalProps> = (props) => {
  const dispatch = useDispatch()
  const {
    portals,
    currentPortal,
    currentDashboards,
    downloadList
  } = useSelector(mapStateToProps)
  const {
    history,
    match: { params }
  } = props
  const portalId = +params.portalId
  const projectId = +params.projectId

  useEffect(() => {
    dispatch(hideNavigator())
    if (!portals.length) {
      dispatch(VizActions.loadPortals(projectId))
    }
  }, [])

  useEffect(() => {
    dispatch(VizActions.loadPortalDashboards(portalId))
  }, [portalId])

  const goToViz = useCallback(() => {
    history.replace(`/project/${projectId}/vizs`)
  }, [])

  const onLoadDownloadList = useCallback(() => dispatch(loadDownloadList()), [])
  const onDownloadFile = useCallback((id) => dispatch(downloadFile(id)), [])

  return (
    <Layout>
      <PageHeader
        ghost={false}
        title={currentPortal.name}
        subTitle={currentPortal.description}
        onBack={goToViz}
        extra={
          <DownloadList
            downloadList={downloadList}
            onLoadDownloadList={onLoadDownloadList}
            onDownloadFile={onDownloadFile}
          />
        }
      />
      {Array.isArray(currentDashboards) &&
        (currentDashboards.length ? (
          <SplitPane
            spliter
            className="ant-layout-content"
            type="horizontal"
            initialSize={250}
            minSize={250}
          >
            <DashboardTree nodes={currentDashboards} toolbar={<PortalToolbar />} />
            <Route
              path="/project/:projectId/portal/:portalId/dashboard/:dashboardId"
              component={Grid}
            />
          </SplitPane>
        ) : (
          <EmptyPortal />
        ))}
    </Layout>
  )
}

export default VizPortal
