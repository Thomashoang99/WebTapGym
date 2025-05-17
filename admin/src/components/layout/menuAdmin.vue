<template>
	<div class="nav-container primary-menu">
		<div class="mobile-topbar-header">
			
			<div class="toggle-icon ms-auto"><i class='bx bx-arrow-to-left'></i>
			</div>
		</div>
		<nav class="navbar navbar-expand-xl w-100">
			<ul class="navbar-nav justify-content-start flex-grow-1 gap-1">
				<li class="nav-item">
					<router-link to="/admin/quan-li-bai-tap">
						<a class="nav-link" href="/quan-li-bai-tap">
							<div class="parent-icon"><i class="fa-solid fa-dumbbell"></i>
							</div>
							<div class="menu-title">Exercise Management</div>
						</a>
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/admin/quan-li-chuong-trinh-tap-luyen">
						<a class="nav-link" href="/quan-li-chuong-trinh-tap-luyen">
							<div class="parent-icon"><i class="fa-solid fa-list-check"></i>
							</div>
							<div class="menu-title">Program Management</div>
						</a>
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/admin/quan-li-bai-dang">
						<a class="nav-link" href="/quan-li-bai-dang">
							<div class="parent-icon"><i class="fa-solid fa-newspaper"></i>
							</div>
							<div class="menu-title">Article Management</div>
						</a>
					</router-link>
				</li>
                <li class="nav-item">
					<router-link to="/admin/quan-li-user">
						<a class="nav-link" href="/quan-li-user">
							<div class="parent-icon"><i class="fa-solid fa-users"></i>
							</div>
							<div class="menu-title">User Management</div>
						</a>
					</router-link>
				</li>
			</ul>
		</nav>
	</div>
</template>
<script setup>

</script>
<style scoped>
</style>