<template>
    <div class="layout-wrapper app-container">
       <el-form :model="queryParams" ref="queryRef" size="small" :inline="true" v-show="showSearch">
          <el-form-item label="菜单名称" prop="menuName">
             <el-input
                v-model="queryParams.menuName"
                placeholder="请输入菜单名称"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
             />
          </el-form-item>
          <el-form-item>
             <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
             <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
       </el-form>
       <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
             <el-button
                type="primary"
                size="small"
                plain
                icon="Plus"
                @click="handleAdd"
             >新增</el-button>
          </el-col>
          <el-col :span="1.5">
             <el-button 
                type="info"
                size="small"
                plain
                icon="Sort"
                @click="toggleExpandAll"
             >展开/折叠</el-button>
          </el-col>
       </el-row>
       <el-table
          v-if="refreshTable"
          class="menu-table-container"
          v-loading="loading"
          :data="menuList"
          row-key="id"
          size="small"
          :default-expand-all="isExpandAll"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
       >
          <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
          <el-table-column prop="icon" label="图标" align="center" width="100">
             <template #default="scope">
                <svg-icon :name="scope.row.icon" />
             </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
          <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="创建时间" align="center" width="160" prop="createTime">
             <template #default="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
             </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
             <template #default="scope">
                <el-button link type="primary" icon="Edit" size="small" @click="handleUpdate(scope.row)" v-hasPermi="['system:menu:edit']">修改</el-button>
                <el-button link type="primary" icon="Plus" size="small" @click="handleAdd(scope.row)" v-hasPermi="['system:menu:add']">新增</el-button>
                <el-button link type="primary" icon="Delete" size="small" @click="handleDelete(scope.row)" v-hasPermi="['system:menu:remove']">删除</el-button>
             </template>
          </el-table-column>
       </el-table>
       <!-- 添加或修改菜单对话框 -->
       <el-dialog :title="title" v-model="open" width="680px" append-to-body>
          <el-form ref="menuRef" :model="form" :rules="rules" size="small" label-width="100px" label-position="left">
             <el-row :gutter="24">
                <el-col :span="24">
                   <el-form-item label="上级菜单">
                      <el-tree-select
                         v-model="form.parentId"
                         :data="menuOptions"
                         :disabled="parentDisabled"
                         :props="{ value: 'id', label: 'menuName', children: 'children' }"
                         value-key="id"
                         placeholder="选择上级菜单"
                         check-strictly
                      />
                   </el-form-item>
                </el-col>
                <el-col :span="24">
                   <el-form-item label="菜单类型" prop="menuType">
                      <el-radio-group v-model="form.menuType" @change="changeMenuType">
                         <el-radio value="M">目录</el-radio>
                         <el-radio value="C">菜单</el-radio>
                      </el-radio-group>
                   </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'F'">
                   <el-form-item label="菜单图标" prop="icon">
                      <el-popover
                         placement="bottom-start"
                         :width="540"
                         trigger="click"
                      >
                         <template #reference>
                            <el-input v-model="form.icon" size="small" placeholder="点击选择图标" @blur="showSelectIcon" readonly>
                               <template #prefix>
                                  <svg-icon
                                     v-if="form.icon"
                                     :name="form.icon"
                                     class="el-input__icon"
                                     style="width: 16px;height: 16px;"
                                  />
                                  <el-icon v-else style="width: 16px;height: 16px;"><search /></el-icon>
                               </template>
                            </el-input>
                         </template>
                         <icon-select ref="iconSelectRef" @selected="selected" :active-icon="form.icon" />
                      </el-popover>
                   </el-form-item>
                </el-col>
                <el-col :span="12">
                   <el-form-item label="显示排序" prop="orderNum">
                      <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                   </el-form-item>
                </el-col>
                <el-col :span="12">
                   <el-form-item label="菜单名称" prop="menuName">
                      <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
                   </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType == 'C'">
                   <el-form-item prop="routeName">
                      <template #label>
                         <span>
                            路由名称
                            <el-tooltip content="默认不填则和路由地址相同：如地址为：`user`，则名称为`User`（注意：因为router会删除名称相同路由，为避免名字的冲突，特殊情况下请自定义，保证唯一性）" placement="top">
                               <el-icon><question-filled /></el-icon>
                            </el-tooltip>
                         </span>
                      </template>
                      <el-input v-model="form.routeName" placeholder="请输入路由名称" />
                   </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'F'">
                   <el-form-item>
                      <template #label>
                         <span>
                            是否外链
                            <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                               <el-icon><question-filled /></el-icon>
                            </el-tooltip>
                         </span>
                      </template>
                      <el-radio-group v-model="form.isFrame">
                         <el-radio value="0">是</el-radio>
                         <el-radio value="1">否</el-radio>
                      </el-radio-group>
                   </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'F'">
                   <el-form-item prop="path">
                      <template #label>
                         <span>
                            路由地址
                            <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                               <el-icon><question-filled /></el-icon>
                            </el-tooltip>
                         </span>
                      </template>
                      <el-input v-model="form.path" placeholder="请输入路由地址" />
                   </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType == 'C'">
                   <el-form-item prop="component">
                      <template #label>
                         <span>
                            组件路径
                            <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                               <el-icon><question-filled /></el-icon>
                            </el-tooltip>
                         </span>
                      </template>
                      <el-input v-model="form.component" placeholder="请输入组件路径" />
                   </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'M'">
                   <el-form-item>
                      <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
                      <template #label>
                         <span>
                            权限字符
                            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                               <el-icon><question-filled /></el-icon>
                            </el-tooltip>
                         </span>
                      </template>
                   </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType == 'C'">
                   <el-form-item>
                      <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
                      <template #label>
                         <span>
                            路由参数
                            <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                               <el-icon><question-filled /></el-icon>
                            </el-tooltip>
                         </span>
                      </template>
                   </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'F'">
                  <el-form-item>
                     <template #label>
                        <span>
                           显示状态
                           <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                        </span>
                     </template>
                     <el-radio-group v-model="form.visible">
                        <el-radio
                           v-for="dict in sys_show_hide"
                           :key="dict.value"
                           :value="dict.value"
                        >{{ dict.label }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
                <el-col :span="12" v-if="form.menuType == 'C'">
                   <el-form-item>
                      <template #label>
                         <span>
                            是否缓存
                            <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                               <el-icon><question-filled /></el-icon>
                            </el-tooltip>
                         </span>
                      </template>
                      <el-radio-group v-model="form.isCache">
                         <el-radio value="0">缓存</el-radio>
                         <el-radio value="1">不缓存</el-radio>
                      </el-radio-group>
                   </el-form-item>
                </el-col>
            </el-row>
          </el-form>
          <template #footer>
             <div class="dialog-footer">
                <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
                <el-button size="small" @click="cancel">取 消</el-button>
             </div>
          </template>
       </el-dialog>
    </div>
 </template>
 
 <script setup>
 import { computed, getCurrentInstance, nextTick } from "vue";
 import { addMenu, delMenu, getMenu, listMenu, updateMenu } from "@/apis/menu.ts";
 import { handleTree, convertToTree, parseTime } from "@/utils/honghu.ts";
 import { ElMessage } from "element-plus";
 import IconSelect from "@/components/IconSelect/index.vue";
const { proxy } = getCurrentInstance();
//  const { sys_show_hide, sys_normal_disable } = proxy.useDict("sys_show_hide", "sys_normal_disable");
import { ref, reactive, toRefs  } from 'vue' 
 const menuList = ref([]);
 const open = ref(false);
 const loading = ref(true);
 const showSearch = ref(true);
 const title = ref("");
 const menuOptions = ref([]);
 const isExpandAll = ref(true);
 const refreshTable = ref(true);
 const iconSelectRef = ref(null);
 
 const data = reactive({
   form: {},
   queryParams: {
     menuName: undefined,
     visible: undefined
   },
   rules: {
     menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
     orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
     path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
   },
 });

 const { queryParams, form, rules } = toRefs(data);
 const parentDisabled = computed(() => {
   return !(form.value.menuType === "M");
 });
 /** 查询菜单列表 */
 function getList() {
   loading.value = true;
   listMenu(queryParams.value).then(response => {
     const { data = [] } = response;
     console.log(data,'sssssssssssssssssss');
     if(data === null) {
       menuList.value = [];
     } else {
      const baseData = convertToTree(data);
      menuList.value = JSON.parse(JSON.stringify(baseData))
      console.log(convertToTree(data), 'convertToTree(data);');
      
     }
     loading.value = false;
   });
 }
 const sys_show_hide = reactive([
   {
      label: "显示", value: "0"
   },
   {
     label: "隐藏", value: "1"
   }
 ])
 /** 查询菜单下拉树结构 */
 function getTreeSelect() {
   menuOptions.value = JSON.parse(JSON.stringify(menuList.value));
 }
 
 /** 取消按钮 */
 function cancel() {
   open.value = false;
   reset();
 }
 
 /** 表单重置 */
 function reset() {
   form.value = {
     menuId: undefined,
     parentId: '0',
     menuName: undefined,
     icon: undefined,
     menuType: "M",
     orderNum: undefined,
     isFrame: "1",
     isCache: "0",
     visible: "0",
     status: "0"
   };
//    proxy.resetForm("menuRef");
 }
 
 /** 展示下拉图标 */
 function showSelectIcon() {
   iconSelectRef.value.reset();
 }
 
 /** 选择图标 */
 function selected(name) {
   form.value.icon = name;
 }
 
 /** 搜索按钮操作 */
 function handleQuery() {
   getList();
 }
 
 /** 重置按钮操作 */
 function resetQuery() {
   proxy.resetForm("queryRef");
   handleQuery();
 }
 
 /** 新增按钮操作 */
 function handleAdd(row) {
   reset();
   getTreeSelect();
   if (row != null && row.id) {
     form.value.parentId = row.id;
   } else {
     form.value.parentId = '0';
   }
   open.value = true;
   title.value = "添加菜单";
 }
 
 /** 展开/折叠操作 */
 function toggleExpandAll() {
   refreshTable.value = false;
   isExpandAll.value = !isExpandAll.value;
   nextTick(() => {
     refreshTable.value = true;
   });
 }
 
 /** 修改按钮操作 */
 async function handleUpdate(row) {
   reset();
   getMenu({
      id: row.id
   }).then(response => {
     form.value = response.data;
     open.value = true;
     title.value = "修改菜单";
   });
 }
 
 /** 提交按钮 */
 function submitForm() {
   proxy.$refs["menuRef"].validate(valid => {
     if (valid) {
       if (form.value.id) {
         updateMenu(form.value).then(response => {
           ElMessage.success("修改成功");
           open.value = false;
           getList();
         });
       } else {
         addMenu(form.value).then(response => {
           ElMessage.success("新增成功");
           open.value = false;
           getList();
         });
       }
     }
   });
 }
 
 /** 删除按钮操作 */
 function handleDelete(row) {
   proxy.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?').then(function() {
     return delMenu({
      id: row.id
     });
   }).then(() => {
     getList();
     proxy.$modal.msgSuccess("删除成功");
   }).catch(() => {});
 }
 function changeMenuType() {
   if (form.value.menuType === "M") {
     form.value.parentId = "0";
   }
 }
 getList();
 </script>
 <style lang="scss" scoped>
.menu-table-container {
   .svg-icon {
      width: 18px;
      height: 18px;
   }
}
</style>