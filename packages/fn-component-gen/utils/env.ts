// import { createApp } from 'vue'
import type { App, Plugin } from 'vue'

// export let containers: App | null = null

// export function setApp(app: App) {
//   containers = app
// }

// export function getApp() {
//   return containers
// }

export const pluginList = new Set<Plugin>()
export function setPlugin(plugin: Plugin) {
  if (pluginList.has(plugin)) {
    return
  }
  pluginList.add(plugin)
}
export function installPlugins(app: App) {
  pluginList.forEach((plugin) => {
    app.use(plugin)
  })
}
