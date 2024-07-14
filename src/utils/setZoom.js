// const dpr = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI
// 分辨率小于预期值时对页面进行整体缩放 将显示效果固定在预期值的效果上
// todo 目前element 组件气泡 弹框等样式不受zoom影响 可能会导致错位 慎用！
const preferWidth = 1550 // 预期值
let zoom = 1
// if (dpr > 1) { // 系统或者浏览器缩放比例大于1
const screenWidth = window.screen.width

if (screenWidth < preferWidth) {
  zoom = screenWidth / preferWidth // 缩放倍数
  document.documentElement.style.zoom = zoom
}
console.log('zoom', zoom, screenWidth, preferWidth)
// }
// 设置css变量值
document.documentElement.style.setProperty('--zoom', zoom)
