import { Button, ButtonGroup, Tab, Tabs } from '@blueprintjs/core'
import '@blueprintjs/core/lib/css/blueprint.css'
import nanoid from 'nanoid'
import React from 'react'
import { MdBugReport } from 'react-icons/md'

import Settings from './settings'
import style from './style.scss'
import { Decision } from './views/Decision'
import { Entities } from './views/Entities'
import { Inspector } from './views/Inspector'
import { Intents } from './views/Intents'
import { Slots } from './views/Slots'
import { Suggestions } from './views/Suggestions'
import Header from './Header'
import SplashScreen from './SplashScreen'
export const updater = { isLoaded: false, callback: undefined }

const WEBCHAT_WIDTH = 350
const DEV_TOOOLS_WIDTH = 450

export class DevTools extends React.Component<DevToolProps, DevToolState> {
  state = {
    event: undefined,
    visible: false,
    selectedTabId: 'basic',
    showSettings: false
  }

  componentDidMount() {
    updater.callback = data => {
      this.setState({ event: data })
    }

    this.props.store.view.setLayoutWidth(WEBCHAT_WIDTH)
    this.props.store.view.setContainerWidth(WEBCHAT_WIDTH + DEV_TOOOLS_WIDTH)
    this.props.store.setMessageWrapper({ module: 'extensions', component: 'Wrapper' })

    this.props.store.view.addHeaderButton({
      id: 'toggleDev',
      label: 'Show Debugger',
      icon: <MdBugReport />,
      onClick: this.handleToggleDev
    })
  }

  componentWillUnmount() {
    this.props.store.view.removeHeaderButton('toggleDev')
  }

  handleNewSession = () => {
    const userId = 'emulator_' + nanoid(7)
    this.props.store.setUserId(userId)
  }

  handleToggleDev = btnId => {
    /*this.props.store.view.updateHeaderButton('toggleDev', {
      label: 'Hide Developer Tools',
      icon: <MdVisibility color="green" />
    })*/

    this.props.store.view.setContainerWidth(this.state.visible ? WEBCHAT_WIDTH : WEBCHAT_WIDTH + DEV_TOOOLS_WIDTH)
    this.setState({ visible: !this.state.visible })
  }

  toggleSettings = e => this.setState({ showSettings: !this.state.showSettings })
  handleTabChange = selectedTabId => this.setState({ selectedTabId })

  renderSummary() {
    return (
      <div>
        <Decision decision={this.state.event.decision} />
        <Intents nlu={this.state.event.nlu} />
        <Entities nlu={this.state.event.nlu} />
        <Suggestions suggestions={this.state.event.suggestions} />
        <Slots nlu={this.state.event.nlu} />
      </div>
    )
  }

  render() {
    if (!this.state.visible) {
      return null
    }

    return (
      <div className={style.container2}>
        <Settings store={this.props.store} isOpen={this.state.showSettings} toggle={this.toggleSettings} />
        <Header newSession={this.handleNewSession} toggleSettings={this.toggleSettings} />
        {!this.state.event && <SplashScreen />}
        {this.state.event && (
          <div className={style.content}>
            <Tabs id="tabs" onChange={this.handleTabChange} selectedTabId={this.state.selectedTabId}>
              <Tab id="basic" title="Summary" panel={this.renderSummary()} />
              <Tab id="advanced" title="View payload" panel={<Inspector data={this.state.event} />} />
            </Tabs>
          </div>
        )}
      </div>
    )
  }
}

interface DevToolProps {
  store: any
}

interface DevToolState {
  event: any
  selectedTabId: string
  visible: boolean
  showSettings: boolean
}