<template>
	<el-container>
		<el-footer class="footer">
			<el-row :gutter="20" type="flex" align="middle" justify='center'>
				<!-- logo -->
				<el-col :span="6" align="middle">
					<img src="@/assets/logo.png" class="logo">
				</el-col>
				<el-col :span="6">
					<p>&copy;Sakuyo</p>
				</el-col>
			</el-row>
		</el-footer>
	</el-container>

</template>
<script>

</script>
<style scoped>
	.footer {
/*		width: 100%;*/
		background: #242424;
		color: #aaa;
	}

	.logo {
		width:20%;
		filter: grayscale(100%);
	}
	.logo:hover {
		filter: grayscale(0);
	}
	.el-col {
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
	}
</style>