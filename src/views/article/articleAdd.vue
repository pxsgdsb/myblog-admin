<template>
  <div class="app-container">
    <div class="markdown">
        <Markdown v-model="value"/>
    </div>
    <div class="foot">
        <el-button>清空</el-button>
        <el-button type="primary" @click="submit()">提交<i class="el-icon-upload el-icon--right"></i></el-button>
    </div>
  </div>
</template>

<script>
    import Markdown from "vue-meditor";
    import { setArticleAdd } from "@/api/article"
    export default {
        name: "add",
        data(){
            return{
                value:"# 标题"
            }
        },
        components: {
            Markdown
        },
        methods:{
            submit(){
                let val = {
                    "article_title":"标题",
                    "article_describe":"描述",
                    "article_content":this.value,
                    "article_class":"class",
                    "article_label":"lable",
                    "add_time":"2021/01/20"
                }
                setArticleAdd(val).then(res=>{
                    console.log(res);
                })
                
            }
        }
    }
</script>
<style>
    .foot{
        width: 100%;
        padding: 20px 0;
    }
</style>