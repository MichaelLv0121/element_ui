<template>
    <div class="login_container">
        <div class="loin_box">
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login"
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
</style>
