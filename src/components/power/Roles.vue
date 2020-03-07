<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 添加角色按钮 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="addDialogBox = true">添加角色</el-button>
				</el-col>
			</el-row>
			<!-- 角色列表区域 -->
			<el-table :data="rolelist" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 渲染二级和三级权限 -->
							<el-col :span="19">
								<!-- 通过for循环嵌套渲染二级权限 -->
								<el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' :'bdtop','vcenter']">
									<el-col :span="6">
										<el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										<el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
											{{item3.authName}}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						<!-- <pre>{{scope.row}}</pre> -->
					</template>
				</el-table-column>
				<!-- 索引列 -->
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作" width="300px">
					<template slot-scope="scope">
						<!-- 编辑按钮 -->
						<el-button size="mini" type="primary" icon="el-icon-edit" @click="showSetDialog(scope.row.id)">编辑</el-button>
						<!-- 删除按钮 -->
						<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserId(scope.row.id)">删除</el-button>
						<!-- 分配权限 -->
						<el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		
		<!-- 添加角色对话框 -->
		<el-dialog title="添加用户" :visible.sync="addDialogBox" width="50%" @close="addFormClosed">
			<!-- 内容主体区域 -->
		  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
		    <el-form-item label="角色名称" prop="roleName">
		      <el-input v-model="addForm.roleName"></el-input>
		    </el-form-item>
				<el-form-item label="角色描述">
				  <el-input v-model="addForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区域 -->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogBox = false">取 消</el-button>
		    <el-button type="primary" @click="addUserClick">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!-- 编辑角色信息对话框 -->
		<el-dialog title="编辑角色信息" :visible.sync="editDialogSet" width="50%" @close="editSetClosed">
		  <el-form ref="editSetRef" :model="editSetForm" label-width="80px">
		    <el-form-item label="角色名称">
		      <el-input v-model="editSetForm.roleName" disabled></el-input>
		    </el-form-item>
				<el-form-item label="角色描述">
				  <el-input v-model="editSetForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogSet = false">取 消</el-button>
		    <el-button type="primary" @click="editSetUser">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!-- 分配权限对话框 -->
		<el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
		  <!-- 树形控件 -->
			<el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRightDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="allotRights">确 定</el-button>
		  </span>
		</el-dialog>
		
		
	</div>
</template>

<script>
	export default {
		data() {
			//验证邮箱规则
			var checkEmail = (rule, value, cb) => {
				const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
				if (regEmail.test(value)) {
					return cb()
				}
				cb(new Error('请输入合法的邮箱'))
			}
			
			//验证手机号规则
			var checkMobile = (rule, value, cb) => {
				const regMobile = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
				if (regMobile.test(value)) {
					return cb()
				}
				cb(new Error('请输入合法的手机号'))
			}
			return {
				//所有角色列表数据
				rolelist: [],
				//控制分配权限对话框的显示和隐藏
				setRightDialogVisible:false,
				//所有权限的数据
				rightsList:[],
				//树形控件的属性绑定对象
				treeProps:{
					label:'authName',
					children:'children'
				},
				//默认选中的节点Id值数组
				defKeys:[],
				//当前即将分配权限的角色id
				roleId:'',
				//控制添加角色弹窗显示与隐藏
				addDialogBox:false,
				//添加角色的表单数据
				addForm:{
					roleName:'',
					roleDesc:'',
				},
				//添加表单的验证规则
				addFormRules:{
					roleName:[
						{required: true,message: '请输入登录名称',trigger: 'blur'},
						{min: 3,max: 10,message: '长度在 3 到 10 个字符',trigger: 'blur'}
					]
				},
				//控制编辑角色对话框的隐藏和显示
				editDialogSet:false,
				//查询到角色信息对象
				editSetForm:{}
			}
		},
		created() {
			this.getRolesList()
		},
		methods: {
			async getRolesList() {
				const {
					data: res
				} = await this.$http.get('roles')
				if (res.meta.status !== 200) {
					return this.$message.error(res.meta.msg)
				}
				this.rolelist = res.data
				// console.log(this.rolelist)
			},
			//根据id删除对应的权限
			async removeRightById(role,rightId) {
				//弹框提示用户是否要删除
				const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				
				if(confirmResult !== 'confirm'){return this.$message.info('取消了删除')}
				const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
				if(res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
				
				role.children = res.data
			},
			//展示分配权限的对话框
			async showSetRightDialog(role){
				this.roleId = role.id
				//获取所有权限的数据
				const {data:res} = await this.$http.get('rights/tree')
				
				if(res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
				//把获取到的权限数据保存到data中
				this.rightsList = res.data
				console.log(this.rightsList)
				
				//递归获取三级节点ID
				this.getLeafKeys(role,this.defKeys)
				
				this.setRightDialogVisible = true
			},
			//通过递归形式，获取角色下所有三级权限的id 保存到defKeys数组中
			getLeafKeys(node,arr){
				//如果当前node节点不包含 children属性，则是三级节点
				if(!node.children){return arr.push(node.id)}
				
				node.children.forEach(item => this.getLeafKeys(item,arr))
			},
			//监听分配权限对话框的关闭事件
			setRightDialogClosed(){
				this.defKeys = []
			},
			//点击为角色分配权限
			async allotRights(){
				const keys = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				
				const idStr = keys.join(',')
				
				const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
				if(res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
				
				this.$message.success(res.meta.msg)
				
				this.getRolesList()
				this.setRightDialogVisible = false
			},
			
			//关闭添加角色按钮之后清空选择
			addFormClosed(){
				this.$refs.addFormRef.resetFields()
			},
			//点击按钮添加新用户
			addUserClick(){
				this.$refs.addFormRef.validate(async valid => {
					if(!valid) return this.$message.error('添加用户失败')
					//发起添加用户的网络请求
					const {data:res} = await this.$http.post('roles',this.addForm)
					if(res.meta.status !== 201){return this.$message.error(res.meta.msg)}
					
					this.$message.success(res.meta.msg)
					this.addDialogBox = false
					this.getRolesList()
				})
			},
			//点击编辑按钮弹出对话框
			async showSetDialog(id){
				const {data:res} = await this.$http.get('roles/' + id)
				if(res.meta.status !== 200){return this.$message.error(res.meta.msg)}
				
				this.editSetForm = res.data
				
				this.editDialogSet = true
			},
			//监听编辑角色对话框的关闭事件
			editSetClosed(){
				this.$refs.editSetRef.resetFields()
			},
			//编辑角色信息并提交
			// editSetUser(){
			// 	this.$refs.editSetRef.validate(async valid => {
			// 		if(!valid) return
			// 		//发起编辑角色数据请求
			// 		const {data:res} = await this.$http.put('roles/' + this.editSetForm.roleId,{
			// 			roleName:this.editSetForm.roleName,
			// 			roleDesc:this.editSetForm.roleDesc
			// 		})
			// 		if(res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
			// 		//关闭对话框
			// 		this.editDialogSet =false
			// 		//刷新数据列表
			// 		this.getRolesList()
			// 		//提示修改成功
			// 		this.$message.success('编辑角色成功')
			// 	})
			// },
			//编辑角色信息并提交
			async editSetUser(){
					//发起编辑角色数据请求
					const {data:res} = await this.$http.put('roles/' + this.editSetForm.roleId,{
						roleName:this.editSetForm.roleName,
						roleDesc:this.editSetForm.roleDesc
					})
					if(res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
					//关闭对话框
					this.editDialogSet =false
					//刷新数据列表
					this.getRolesList()
					//提示修改成功
					this.$message.success('编辑角色成功')
			},
			//删除角色
			async removeUserId(id){
				//弹框提醒是否要删除
				const confirmRes = await this.$confirm('永久删除该角色, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).catch(err => err)
				//如果用户确认删除，则返回 confirm
				//如果用户取消删除，则返回cancel
				// console.log(confirmRes)
				if(confirmRes !== 'confirm') {return this.$message.info('已取消删除')}
				
				const {data:res} = await this.$http.delete('roles/' + id)
				
				if(res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
				this.$message.success(res.meta.msg)
				this.getRolesList()
			}
		}
	}
</script>

<style scoped lang="less">
	.el-tag {
		margin: 7px;
	}

	.bdtop {
		border-top: 1px solid #eee;
	}

	.bdbottom {
		border-bottom: 1px solid #eee;
	}

	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
