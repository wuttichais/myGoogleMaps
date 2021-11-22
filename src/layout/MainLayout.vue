<template>
    <el-container class="container">
        <el-header class="header">
            <el-row>
                <el-col
                    class="logo">
                    <img
                        alt="Google Maps logo"
                        class="google-map-logo"
                        src="../assets/google-map-logo-2.png" />
                </el-col>
                <el-col
                    class="slot-head">
                    <slot name="header"/>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside class="aside">
                <slot name="aside"/>
            </el-aside>
            <el-main class="main">
                <el-row class="content">
                    <slot />
                </el-row>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'MainLayout',
	setup() {

		return {
		}
	}
})
</script>

<style lang="scss" scoped>
.container {
    margin: -8px !important;
    background: #8d8d8d;
    .header {
        background-color: #006eff;
        color: var(--el-text-color-primary);
        text-align: left;
        line-height: 60px;
        .logo {
            max-width: 220px;
            align-items: center;
            display: flex;
            .google-map-logo {
                width: 200px;
                color: #ffffff;
            }
        }
        .slot-head {
            max-width: 50%;
            align-items: center;
            display: flex;
        }
    }
    .aside {
        background-color: #ffffff;
        color: var(--el-text-color-primary);
        text-align: left;
        padding: 10px;
        height: 865px;
        width: 500px;
    }
    .main {
        background-color: #ffffff;
        color: var(--el-text-color-primary);
        height: 865px;
        padding: unset;
    }
}

</style>