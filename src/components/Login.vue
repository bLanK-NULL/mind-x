<template>
    <div class="container">
        <div class="box">
            <a-form :model="formState" name="normal_login" class="login-form">
                <a-form-item label="Username" name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input v-model:value="formState.username">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item label="Password" name="password"
                    :rules="[{ required: true, message: 'Please input your password!' }]">
                    <a-input-password v-model:value="formState.password">

                        <template #prefix>
                            <LockOutlined class="site-form-item-icon" />
                        </template>
                    </a-input-password>
                </a-form-item>

                <a-form-item>
                    <a-form-item name="remember" no-style>
                        <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
                    </a-form-item>
                    <a class="login-form-forgot" href="">Forgot password</a>
                </a-form-item>

                <a-form-item>
                    <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button"
                        @click="toLogin">
                        Log in
                    </a-button>
                    Or
                    <a href="">register now!</a>
                </a-form-item>
            </a-form>
        </div>
    </div>

</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { successMsg, errorMsg } from '@/hooks/Message/globalMessage.js'
import { login } from '@/http/index'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useItemsStore } from '@/store';
const { username } = storeToRefs(useItemsStore())
const router = useRouter()
const formState = reactive({
    username: '',
    password: '',
    remember: true,
});
const disabled = computed(() => {
    return !(formState.username && formState.password);
});
function toLogin() {
    login(formState.username, formState.password).then(res => {
        console.log(res)
        username.value = res.data.username;
        successMsg('登录成功')
        router.push({
            name: 'detail'
        })
    }).catch(err => {
        console.log(err)
        errorMsg('登录失败')
    })
}
</script>

<style scoped>
#components-form-demo-normal-login .login-form {
    max-width: 300px;
}

#components-form-demo-normal-login .login-form-forgot {
    float: right;
}

#components-form-demo-normal-login .login-form-button {
    width: 100%;
}

.container {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #00bfff, #00ffcc);
}

.box {
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    /* margin: 0 auto; */
    transform: translate(-50%, -50%);
    padding: 30px 60px 15px;
    border-radius: 8px;
    box-shadow: #ccc;
}
</style>