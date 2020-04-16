<template>
    <div class="login_container">
        <div class="loin_box">
            <!--头像-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="头像">
            </div>
            <!--账户和密码-->
            <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules" status-icon>
                <!--账户-->
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>

                <!--按钮-->
                <el-form-item class="loginButtons">
                    <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
                    <el-button type="info" @click="resetLoginForm('loginFormRef')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                //表单绑定的数据对象
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                //表单验证对象，注意，prop中的属性必须和表单绑定的数据对象中的属性名称一致！
                loginFormRules: {
                    username: [
                        {required: true, message: '请输入账户名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            //点击“重置”按钮重置表单
            resetLoginForm(formName) {
                this.$refs[formName].resetFields();
            },
            //点击“登录”按钮进行数据校验
            login(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) return;
                    //账户校验通过
                    const {data: res} = await this.$http.post('login', this.loginForm);
                    if (res['meta']['status'] === 200) {
                        this.$message({
                            showClose: true,
                            message: '登录成功',
                            type: 'success'
                        });
                        //账户检验成功后取得token并放入sessionStorage中
                        window.sessionStorage.setItem('token', res['data']['token']);
                        //1秒后跳转到主页 /home
                        setTimeout(() => this.$router.push('/home'), 1000);
                    } else {
                        this.$message({
                            showClose: true,
                            message: '账户名或密码错误',
                            type: 'error'
                        });
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #5681b2;
        height: 100%;
    }

    .loin_box {
        width: 450px;
        height: 300px;
        background-color: white;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar_box {
        height: 100px;
        width: 100px;
        border: 1px solid #eeeeee;
        padding: 5px;
        box-shadow: 0 0 10px #555555;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #eeeeee;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }

    .loginButtons {
        display: flex;
        justify-content: flex-end;
    }
</style>
