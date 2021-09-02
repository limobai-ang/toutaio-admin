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
  MessageBox,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  RadioGroup,
  Radio,
  Option,
  Col,
  TimePicker,
  DatePicker,
  Table,
  TableColumn,
  Tag,
  Pagination,
  Image,
  Loading,
  Row
} from 'element-ui'

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Loading.directive)
Vue.use(Button)
Vue.use(Row)
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
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Option)
Vue.use(Col)
Vue.use(TimePicker)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Image)
