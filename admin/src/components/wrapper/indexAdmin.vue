<template>
    <div class="wrapper">
		<div class="header-wrapper">
            <TopAdmin></TopAdmin>
            <MenuAdmin></MenuAdmin>
		</div>
		<div class="page-wrapper">
			<div class="page-content">
                <router-view> </router-view>
            </div>
		</div>
	</div>
</template>
<script>
import TopAdmin from "../layout/topAdmin.vue";
import MenuAdmin from "../layout/menuAdmin.vue";
import "../../assets2/js/bootstrap.bundle.min.js";
import "../../assets2/js/jquery.min.js";
import "../../assets2/plugins/simplebar/js/simplebar.min.js";
import "../../assets2/plugins/metismenu/js/metisMenu.min.js";
import "../../assets2/plugins/perfect-scrollbar/js/perfect-scrollbar.js";
import "../../assets2/js/index.js";
import "../../assets2/js/app.js";
import "../../assets2/js/pace.min.js";
export default {
    name        :   "app",
    components  :   {
        TopAdmin, MenuAdmin
    }
}
</script>
<style>
@import "../../assets2/plugins/simplebar/css/simplebar.css";
@import "../../assets2/plugins/perfect-scrollbar/css/perfect-scrollbar.css";
@import "../../assets2/plugins/metismenu/css/metisMenu.min.css";
@import "../../assets2/css/pace.min.css";
@import "../../assets2/css/bootstrap.min.css";
@import "../../assets2/css/bootstrap-extended.css";
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap");
@import "../../assets2/css/app.css";
@import "../../assets2/css/icons.css";
@import "../../assets2/css/dark-theme.css";
@import "../../assets2/css/semi-dark.css";
@import "../../assets2/css/header-colors.css";
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css");
</style>