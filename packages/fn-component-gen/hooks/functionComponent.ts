import { createApp, ref, type Component, ExtractPropTypes, getCurrentInstance, Ref, App } from 'vue'
import { installPlugins } from '../utils/env'

interface IUseFunctionComponentAgr<T extends Component> {
  component: T
  props?: ExtractPropTypes<T>
}

// 用于存储每个弹窗实例的变量和方法
const popupInstanceMap = new Map<
  symbol,
  {
    visible: Ref<boolean>
    confirm: (res: any) => void
    close: (rej: any) => void
  }
>()

/**
 * @name 使用Popup的可见性变量
 * @description 获取当前组件实例的popup可见性
 * @returns Ref<boolean>
 */
export function usePopupVisible(): Ref<boolean> {
  const instance = getCurrentInstance()
  const key = instance?.appContext.config.globalProperties.__popupKey
  if (!key) {
    throw new Error('usePopupVisible需要在使用useFunctionComponent的组件中调用')
  }
  const inst = popupInstanceMap.get(key)
  if (!inst) {
    throw new Error('找不到对应的popup实例')
  }
  return inst.visible
}

/**
 * @name 使用Popup的确认和关闭方法
 * @description 获取当前组件实例的popup确认和关闭方法
 * @returns { confirm: Function, close: Function }
 */
export function usePopupMethods() {
  const instance = getCurrentInstance()
  const key = instance?.appContext.config.globalProperties.__popupKey
  if (!key) {
    throw new Error('usePopupMethods需要在使用useFunctionComponent的组件中调用')
  }
  const inst = popupInstanceMap.get(key)
  if (!inst) {
    throw new Error('找不到对应的popup实例')
  }
  return {
    confirm: inst.confirm,
    close: inst.close
  }
}

/**
 * @name 使用Popup的所有变量
 * @description 获取当前组件实例的popup的所有变量和方法
 * @returns { visible: Ref<boolean>, confirm: Function, close: Function }
 */
export function usePopupAll() {
  const visible = usePopupVisible()
  const { confirm, close } = usePopupMethods()
  return {
    visible,
    confirm,
    close
  }
}

/**
 * @name useFunctionComponent
 * @description 使用函数式组件
 * @param component 组件
 * @param props 组件props
 * @returns Promise
 */
export function useFunctionComponent<T extends Component>({
  component,
  props
}: IUseFunctionComponentAgr<T>) {
  const visibleRef = ref(false)
  // 为每个弹窗实例生成唯一key
  const popupKey = Symbol('popupKey')
  return new Promise((resolve, reject) => {
    const mountNode = document.createElement('div')

    let mountComponent: App | undefined

    // 存储当前实例的变量和方法
    popupInstanceMap.set(popupKey, {
      visible: visibleRef,
      close: (rej: any) => {
        reject(rej)
        remove()
      },
      confirm: (res: any) => {
        resolve(res)
        remove()
      }
    })

    mountComponent = createApp(component, props)

    // 注入popupKey到全局属性
    mountComponent.config.globalProperties.__popupKey = popupKey

    function remove() {
      visibleRef.value = false
      setTimeout(() => {
        mountComponent?.unmount()
        document.body.removeChild(mountNode)
        mountComponent = undefined
        popupInstanceMap.delete(popupKey)
      }, 1000)
    }

    // 挂载插件
    installPlugins(mountComponent)
    // 创建挂载节点
    document.body.appendChild(mountNode)
    // 挂载组件实例
    mountComponent.mount(mountNode)

    setTimeout(() => {
      visibleRef.value = true
    })

    // 路由变化 关闭弹窗 // TODO 还可以优化
    function popstateFn() {
      reject('back')
      remove()
      window.removeEventListener('popstate', popstateFn)
    }
    window.addEventListener('popstate', popstateFn)
  })
}
