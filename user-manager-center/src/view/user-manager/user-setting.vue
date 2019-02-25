<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出用户</Button>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import { getTableData } from '@/api/data'
  import { queryUser } from '@/api/user'
  import { formatDate } from '@/libs/date.js'

  export default {
    name: 'tables_page',
    components: {
      Tables
    },
    data () {
      return {
        columns: [
          { title: 'Name', key: 'name', sortable: true },
          {
            title: 'Gender',
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
            title: 'Handle',
            key: 'handle',
            button: [
              (h, params, vm) => {
                return h('Poptip', {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      vm.$emit('on-delete', params.tableData[params.row.initRowIndex])
                      vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                    }
                  }
                }, [
                  h('Button', '自定义删除')
                ])
              }
            ]
          }
        ],
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    methods: {
      handleDelete (row) {
        console.log(row)
      },
      exportExcel () {
        this.$refs.tables.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      },
      changePage (page) {
        queryUser(page, this.pageSize, null).then(res => {
          this.tableData = res.data.data.list
        })
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
