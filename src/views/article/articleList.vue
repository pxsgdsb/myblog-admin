<template>
  <div class="app-container">
  <div class="myhead">
    <el-input class="search" v-model="searchValue" placeholder="请输入搜索内容"></el-input>
    <el-button type="primary" icon="el-icon-search">搜索</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%" v-loading="loading" border>
    <el-table-column label="排序" width="80" align="center" type="index">
    </el-table-column>
    <!-- <el-table-column label="id" width="80" align="center" type="index">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.id }}</span>
      </template>
    </el-table-column> -->

    <el-table-column label="标题" align="center">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.article_title }}</span>
      </template>
    </el-table-column>

    <el-table-column label="描述" align="center">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.article_describe }}</span>
      </template>
    </el-table-column>

    <el-table-column label="分类" align="center">
      <template slot-scope="scope">
        <el-tag class="pxtag" size="medium">{{ scope.row.class_name }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="标签" align="center" >
      <template slot-scope="scope">
          <el-tag class="pxtag" :disable-transitions="true" type="success" size="medium" v-for="(item,index) in scope.row.label_name" :key="index">{{ item["label_name"] }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="添加时间" align="center" width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.add_time }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center" width="150">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
    @current-change="currentChange"
  ></el-pagination>

  </div>
</template>

<script>
import { getArticleList,deletArticle } from '@/api/article'

export default {
  data() {
    return {
      loading:false,
      tableData: [],
      page:1,
      pageSize:10,
      total:0,
      searchValue:"",
    }
  },
  created() {
    this.fetchListData();
  },
  methods: {
      handleEdit(index, row) {
        this.$router.push({
          path: '/article/articleAdd',
          query: {
            id: row["id"]
          }
        })
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletArticle({id:row["id"],article_title:row["article_title"]}).then(res=>{
            this.fetchListData();
          })
        })
      },
      fetchListData() {
        this.loading = true;
        getArticleList({page:this.page,pageSize:this.pageSize}).then(response => {
          // console.log(response);
          this.tableData = response.data;
          this.total = response.count
          this.loading = false;
        })
      },
      currentChange(page){  
        this.page=page;
        this.fetchListData();
      }

  }
}
</script>
<style scoped>
.pxtag{
  margin:3px ;
}
.el-table{
  box-shadow: rgb(0 0 0 / 10%) 0px 2px 12px 0px;
  padding: 15px 0px;
}
.el-pagination{
  margin-top: 10px;
  padding: 15px 10px;
  box-shadow: rgb(0 0 0 / 10%) 0px 2px 12px 0px;
}
table tr td div span{
  margin-left: 0;
}
.myhead{
  padding: 15px 10px;
  margin-bottom: 10px;
  box-shadow: rgb(0 0 0 / 10%) 0px 2px 12px 0px;
}
.myhead .search{
  width: 200px;
  margin-right: 5px;
}
</style>
