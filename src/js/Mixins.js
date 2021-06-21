
/**事件混合配置对象 */
let EventMixin = {
  /**阻止事件冒泡 */
  stopPropagation: (evt) => {
    evt.stopPropagation()
  }
}

export { EventMixin }
