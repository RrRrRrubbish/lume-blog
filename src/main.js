import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// 1. 注册 Pinia 全局状态管理插件
app.use(pinia)

// 2. 注册 Vue Router 单页面应用路由插件
app.use(router)

// 3. 注册 Element Plus 组件库及中文国际化支持
app.use(ElementPlus, {
  locale: zhCn
})

// 4. 全局注册所有 Element Plus 官方图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')