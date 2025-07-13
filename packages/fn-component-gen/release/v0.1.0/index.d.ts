import { Component, ExtractPropTypes, Ref, Plugin } from 'vue';

interface IUseFunctionComponentAgr<T extends Component> {
    component: T;
    props?: ExtractPropTypes<T>;
}
/**
 * @name 使用Popup的可见性变量
 * @description 获取当前组件实例的popup可见性
 * @returns Ref<boolean>
 */
declare function usePopupVisible(): Ref<boolean>;
/**
 * @name 使用Popup的确认和关闭方法
 * @description 获取当前组件实例的popup确认和关闭方法
 * @returns { confirm: Function, close: Function }
 */
declare function usePopupMethods(): {
    confirm: (res: any) => void;
    close: (rej: any) => void;
};
/**
 * @name 使用Popup的所有变量
 * @description 获取当前组件实例的popup的所有变量和方法
 * @returns { visible: Ref<boolean>, confirm: Function, close: Function }
 */
declare function usePopupAll(): {
    visible: Ref<boolean>;
    confirm: (res: any) => void;
    close: (rej: any) => void;
};
/**
 * @name useFunctionComponent
 * @description 使用函数式组件
 * @param component 组件
 * @param props 组件props
 * @returns Promise
 */
declare function useFunctionComponent<T extends Component>({ component, props }: IUseFunctionComponentAgr<T>): Promise<unknown>;

declare function setPlugin(plugin: Plugin): void;

export { setPlugin, useFunctionComponent, usePopupAll, usePopupMethods, usePopupVisible };
