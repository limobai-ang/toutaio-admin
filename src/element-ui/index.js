import Vue from 'vue'
import {
  Button,
  Select,
  Form,
  FormItem,
  Input,
  Checkbox,
  Message,
  Container,
  Aside,
  Header,
  Main,
  Menu,
  Dropdown,
  DropdownItem,
  MenuItem,
  DropdownMenu,
  MessageBox
} from 'element-ui'

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(MenuItem)
Vue.use(DropdownMenu)
