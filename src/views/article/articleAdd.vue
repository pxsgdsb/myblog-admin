<template>
  <div class="app-container add">
    <div id="editor">
            <mavon-editor 
             v-model = 'markdownValue'
             previewBackground="#ffffff"
             :ishljs = "true"
             ref="md"
             @imgAdd="$imgAdd" @imgDel="$imgDel"
            style="height: 100%">
            </mavon-editor>
    </div>
    <div class="foot">
        <el-button @click="markdownValue = ''">清空</el-button>
        <el-button :type="isid?'success':'primary'" @click="dialogFormVisible = true">{{isid?"编辑":"提交"}}<i class="el-icon-upload el-icon--right"></i></el-button>
    </div>
    <!-- 选择分类和标签 -->
    <el-dialog title="选择分类和标签" :visible.sync="dialogFormVisible" width="30%">
        <el-form  class="classAndLabel">
            <el-form-item label="分类" label-width="40px">
                <el-select v-model="myclass" filterable placeholder="请选择活动区域">
                    <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.class_name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标签" label-width="40px">
                <el-select v-model="labelArr" multiple filterable placeholder="请选择">
                    <el-option
                    v-for="item in labelList"
                    :key="item.id"
                    :label="item.label_name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="submit()">提交</el-button>
            <el-button type="success" @click="isadd = true">添加更多</el-button>
        </div>
    </el-dialog>

    <!-- 添加分类或标签 -->
    <el-dialog title="添加分类或标签" :visible.sync="isadd" width="30%">
        <el-form  class="classAndLabel">
            <el-form-item label="分类" label-width="40px">
                <el-input v-model="addMyclass" placeholder="输入分类"></el-input>
            </el-form-item>
            <el-form-item label="标签" label-width="40px">
                <el-input v-model="addMylabel" placeholder="输入标签,半角逗号分隔"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isadd = false">取消</el-button>
            <el-button type="success" @click="add()">添加</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'

    import {setArticleAdd,AddClass,AddLabel,getClassList,getLabelList,upload,deleteImage,editorArticle} from "@/api/article"
    export default {
        inject:['reload'],  //注入刷新页面依赖
        name: "add",
        data(){
            return{
                isid:0,
                // submitWord:"提交",
                markdownValue:"# 标题\r写一段文章描述吧!",
                dialogFormVisible: false,
                isadd:false,
                classList:[],
                labelList:[],
                myclass:"",
                labelArr: [],
                addMyclass:"",
                addMylabel:""
            }
        },
        components: {
            mavonEditor 
        },
        created() {
            this.getClass();
            this.getLabel();
            //路由传参
            this.isid = this.$route.query.id
            if(this.isid){
                editorArticle({id:this.isid}).then(res=>{
                    // console.log(res);
                    this.markdownValue=res.data.word
                    this.myclass=res.data.class_id
                    this.labelArr=res.data.label_id.split(",").map(item => parseInt(item));
                })
            }
        },
        methods:{
            // 提交
            submit(){
                if(this.myclass=="" || this.labelArr.length==0){
                    this.$message({message: '分类与标签不能为空!',type: 'warning'});
                    return
                }
                let html = this.$refs.md.d_render
                var hidden = document.createElement("div");
                hidden.innerHTML = html
                let title = hidden.getElementsByTagName('h1')
                let describe = hidden.getElementsByTagName('p')
                if(title.length==0){
                    this.$message({message: '文章没有标题!',type: 'warning'});
                    return
                }
                if(describe.length==0){
                    this.$message({message: '文章没有描述!',type: 'warning'});
                    return
                }
                title = title[0].innerText
                describe = describe[0].innerText
                let val = {
                    "article_title":title,
                    "article_describe":describe,
                    "article_content":this.markdownValue,
                    "class_id":this.myclass,
                    "label_id":this.labelArr.join(","),
                }
                if(this.isid){
                    val["id"]=this.isid;
                }
                console.log(val);
                setArticleAdd(val).then(res=>{
                    if(this.isid){
                        this.$router.push({path: '/article/articleList',})
                    }
                    this.reload();
                })
            },
            // 添加分类、标签
            add(){
                if(this.addMylabel.indexOf("，")!=-1){
                    this.$message({message: '请确保标签栏内没有全角逗号!',type: 'warning'});
                    return
                }
                if(this.addMylabel[this.addMylabel.length-1]==","){
                    //删除最后一个逗号
                   this.addMylabel=this.addMylabel.substring(0, this.addMylabel.length - 1);
                }
                let myclass = this.addMyclass;
                let mylabel = this.addMylabel!=""?this.addMylabel.split(','):[];
                mylabel = [...new Set(mylabel)] //去重
                if(myclass=="" && mylabel.length==0){
                    this.$message({message: '分类或标签不能为空!',type: 'warning'});
                    return
                }
                let PromiseArr=[];
                if(myclass!=""){
                    let setClass = new Promise((resolve, reject)=>{
                        AddClass({myclass}).then(data=>{
                            resolve(data)
                            this.addMyclass="";
                            this.getClass();
                        }).catch(err=>{
                            reject(err)
                        });
                    })
                   PromiseArr.push(setClass)
                }
                if(mylabel.length!=0){
                    let setLabel = new Promise((resolve, reject)=>{
                        AddLabel({mylabel}).then(data=>{
                            resolve(data)
                            this.addMylabel="";
                            this.getLabel();
                        }).catch(err=>{
                            reject(err)
                        });
                    })
                   PromiseArr.push(setLabel)
                }
                //判断是否都添加成功
                Promise.all(PromiseArr).then(data => {
                    this.addMyclass="";
                    this.addMylabel="";
                    this.isadd = false;
                }).catch(err=>{
                    console.log(err);
                });
            },
            // 获取分类列表
            getClass(){
                getClassList().then(data=>{
                    this.classList=data.data;
                })
            },
            // 获取标签列表
            getLabel(){
                getLabelList().then(data=>{
                    this.labelList=data.data;
                })
            },
            // 绑定@imgAdd event（图片上传）
            $imgAdd(pos, $file) {
                // 第一步.将图片上传到服务器.
                var formdata = new FormData();
                formdata.append('image', $file);
                upload(formdata).then((res) => {
                    let url = res.data;
                    this.$refs.md.$img2Url(pos, url);
                })
            },
            //（删除图片）
            $imgDel(pos) {
                let arr = pos[0].split("/")
                let val = {
                    type:"image",
                    name:arr[arr.length-1]
                }
                deleteImage(val).then(res=>{
                    // console.log(res);
                })
            }

        }
    }
</script>
<style>
    .add .foot{
        width: 100%;
        padding: 20px 0;
    }
    #editor {
        margin: auto;
        width: 100%;
        height: 580px;
    }
    .add .classAndLabel{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .add .el-form-item{
        width: 100%;
        display: flex;
        justify-content: center; 
    }
    .add .el-form-item .el-form-item__content{
        margin-left: 0 !important;
    }
</style>