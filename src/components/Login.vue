<template>
	<div class="login">
		<div class="login_box">
			<div class="avatar_box">
				<img src="../assets/logo.png" />
			</div>
			<el-form label-width="0" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
				<!-- 用户名 -->
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" prefix-icon="iconfont iconbussiness-man"></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" prefix-icon="iconfont iconpassword" type="password"></el-input>
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="info" @click="resetLoginForm" @keyup.enter="login()">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		created() {
			let _self = this;
			document.onkeydown = function(e) {
				let key = window.event.keyCode;
				if (key == 13 || key == 100) {
					_self.login();
				}
			}
		},
		data() {
			return {
				//登录表单数据绑定对象
				loginForm: {
					username: 'admin',
					password: '123456'
				},
				//表单验证规则
				loginFormRules: {
					username: [{
							required: true,
							message: '请输入登录名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入登录密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '长度在 6 到 15 个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			//重置登录表单
			resetLoginForm() {
				this.$refs.loginFormRef.resetFields();
			},
			login() {
				this.$refs.loginFormRef.validate(async valid => {
					if (!valid) return;
					const {
						data: res
					} = await this.$http.post('login', this.loginForm);
					if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
					this.$message.success(res.meta.msg)
					//1,将登录成功之后的token 保存到客户端的 sessionStorage中，因为token只应在当前网站打开期间生效，所以token保存在sessionStorage中
					window.sessionStorage.setItem('token', res.data.token);
					//2，通过编程式导航跳转到后台主页
					this.$router.push('/home');
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.login {
		background-color: #2b4b6b;
		height: 100%;
	}

	.login_box {
		width: 450px;
		height: 300px;
		background-color: #fff;
		border-radius: 3px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		.avatar_box {
			height: 130px;
			width: 130px;
			border: 1px solid #eee;
			border-radius: 50%;
			padding: 10px;
			box-shadow: 0 0 10px #eee;
			position: absolute;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #fff;

			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #eee;
			}
		}
	}

	.btns {
		display: flex;
		justify-content: flex-end;
	}

	.login_form {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
	}
</style>
