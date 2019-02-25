<template>
  <div>
    <Card>

      <tables ref="tables" searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/>

      <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Button type="primary" style="margin-right: 10px;" @click="addUser">添加用户</Button>
          <Button type="primary" @click="exportExcel">导出用户</Button>
        </div>
        <div style="float: right;">
          <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
      </div>

      <Modal v-model="userForm.modal" title="编辑用户信息">
        <Form ref="userForm" :model="userForm.validate" :rules="userForm.ruleValidate" :label-width="80">
          <FormItem label="姓名" prop="name">
            <Input v-model="userForm.validate.name" placeholder="输入姓名" />
          </FormItem>
          <FormItem label="账号" prop="username">
            <Input v-model="userForm.validate.username" placeholder="输入账号" />
          </FormItem>
          <FormItem label="手机号码" prop="tel">
            <Input v-model="userForm.validate.tel" placeholder="输入手机号码" />
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model="userForm.validate.password" type="password" placeholder="输入密码" />
          </FormItem>
          <FormItem label="性别" prop="gender">
            <RadioGroup v-model="userForm.validate.gender">
              <Radio label="MALE">男</Radio>
              <Radio label="FEMALE">女</Radio>
              <Radio label="UNKNOWN">未知</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="角色" prop="roles">
            <Select v-model="userForm.validate.roles" placeholder="选择角色">
              <Option value="1">管理员</Option>
              <Option value="2">普通用户</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="cancel" @click="userCancel()">取消</Button>
          <Button type="reset" @click="handleReset('userForm')" style="margin-left: 8px">重置</Button>
          <Button type="primary" @click="handleSubmit('userForm')">提交</Button>
        </div>
      </Modal>

    </Card>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import { getTableData } from '@/api/data'
  import { queryUser,getUserInfo,removeUser,savaUser } from '@/api/user'
  import { formatDate } from '@/libs/date.js'

  export default {
    name: 'tables_page',
    components: {
      Tables
    },
    data () {
      return {
        columns: [
          { title: '姓名', key: 'name', sortable: true },
          { title: '用户名', key: 'username', sortable: true },
          { title: '手机号码', key: 'tel', sortable: true },
          {
            title: '性别',
            key: 'gender',
            render: function (h) {
              let status = this.row.gender;
              if (status==='UNKNOWN'){ return h('span','未知') };
              if (status==='MALE'){ return h('span','男')};
              if (status==='FEMALE'){ return h('span','女')};
            }
          },
          {
            title: 'Create-Time',
            key: 'createTime',
            render: function (h) {
              return h('div', formatDate(new Date(this.row.createTime),'yyyy-MM-dd hh:mm'));
            }
          },
          {
            title: '操作',
            render: (h, params, vm) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editUser(params.row.id);
                    }
                  }
                }, '编辑'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      this.handleDelete(params.row.id);
                    }
                  }
                }, [h('Button', {props:{type: 'primary', size: 'small'}}, '删除')])
              ]);

            }
          }
        ],
        tableData: [],
        pageNum: 1,
        pageSize: 5,
        total: 0,

        userForm : {
          modal : false,
          validate: {
            userId:'',
            name: '',
            username: '',
            tel: '',
            password: '',
            gender: '',
            roles: ''
          },
          ruleValidate: {
            name: [
              { required: true, message: '姓名不能为空', trigger: 'blur' }
            ],
            username: [
              { required: true, message: '账号不能为空', trigger: 'blur' },
            ],
            tel: [
              { required: true, message: '手机号码不能为空', trigger: 'change' },
              // { type: 'tel', message: '手机号码格式错误', trigger: 'blur' }
            ],
            gender: [
              { required: true, message: '请选择性别', trigger: 'change' }
            ],
            password: [
              { required: true, message: '密码不能为空', trigger: 'change' }
            ],
            roles: [
              // { required: true, message: '请设置角色', trigger: 'change' }
            ]
          }
        },

      }
    },
    methods: {
      handleDelete (id) {
        console.log(id)
        removeUser(id).then(res => {
          this.changePage (this.pageNum)
        })
      },
      exportExcel () {
        this.$refs.tables.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      },
      changePage (page) {
        queryUser(page, this.pageSize, null).then(res => {
          this.tableData = res.data.data.list
          this.pageNum = page;
          this.total = res.data.data.total;
        })
      },
      editUser (id) {
        getUserInfo(id).then(res => {
          this.handleReset('userForm')
          this.userForm.validate.userId = res.data.data.id;
          this.userForm.validate.name = res.data.data.name;
          this.userForm.validate.username = res.data.data.username;
          this.userForm.validate.tel = res.data.data.tel;
          this.userForm.validate.password = res.data.data.password;
          this.userForm.validate.gender = res.data.data.gender;
          this.userForm.modal = true
        })
      },
      addUser () {
        this.userForm.validate.userId = null;
        this.handleReset('userForm')
        this.userForm.modal = true
      },
      userCancel () {
        this.userForm.modal = false;
        this.$Message.info('已取消');
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            var user = {
              name:this.userForm.validate.name,
              username:this.userForm.validate.username,
              tel:this.userForm.validate.tel,
              password:this.userForm.validate.password,
              gender:this.userForm.validate.gender
            }
            savaUser(this.userForm.validate.userId,user).then(res => {
              this.$Message.success('修改成功!');
              this.userForm.modal = false;
              this.changePage (this.pageNum)
            })
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    },
    mounted () {
      queryUser(this.pageNum, this.pageSize, null).then(res => {
        this.tableData = res.data.data.list
        this.total = res.data.data.total;
        console.log(this.total);
      })
    }
  }
</script>

<style>

</style>
