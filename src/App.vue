<template>
  <div id="app">

		<a-row class="header" type="flex" justify="space-around" align="middle">
			<a-col>
				<a-icon class="icon" type="plus" @click="openmodal('add')"/>
				<a-modal :visible="modal.add.visible" @cancel="closemodal('add')">

				</a-modal>
			</a-col>
			<a-col>
				<a-icon class="icon" type="setting" />
			</a-col>
			<a-col>
				<a-pagination v-model="page" :total="beerData.length" :pageSize="onScreen" @change="onPageChange"/>
			</a-col>
		</a-row>

		<a-config-provider>
			<template #renderEmpty>
        <div style="text-align: center">
          <a-icon type="smile" style="font-size: 20px" />
          <p>Data Not Found</p>
        </div>
      </template>
			<a-table
				class="mainTable"
				:columns="columns"
				:data-source="beerData"
				size="large"
				:showHeader="false"
				style="height: 100%"
				:pagination="pag"
				tableLayout="auto"
				rowKey="id"
				@change="onPageChange"
			/>
		</a-config-provider>
  </div>
</template>

<script>

const columns = [
	{
		title: 'Name',
		dataIndex: 'name'
	},
	{
		title: 'percent',
		dataIndex: 'percent',
	},
	{
		title: 'country',
		dataIndex: 'country',
	},
	{
		title: 'brightness',
		dataIndex: 'brightness',
	},
	{
		title: 'type',
		dataIndex: 'type',
	},
	{
		title: 'price',
		dataIndex: 'price',
	},
]

const beerData = []

for(let i = 0; i < 50; i++){
	beerData.push({
		id: i,
		name: "Пиво",
		percent: "2.4",
		country: "чх",
		brightness: "anus",
		type: "jopa",
		price: "2.2"
	})
}

export default {
	name: 'App',
	data(){
		return {
			columns,
			beerData,
			page: 1,
			onScreen: 15,
			interval: 0,
			modal: {
				add: {
					visible: false
				}
			}
		}
	},
  components: {
	},
	computed:{
		pag(){
			if(this.beerData.length > this.onScreen){
				return { pageSize: this.onScreen, position: 'top', current: this.page }
			} else {
				return false
			}
		}
	},
  methods: {
    onPageChange(pagination) {
			if(pagination.current == undefined){
				this.page = pagination
			} else {
				this.page = pagination.current;
			}
			
			clearInterval(this.interval);
			this.interval = setInterval(() => {
				this.nextPage();
			}, 25000);
		},
		nextPage(){
			const pages = Math.ceil(this.beerData.length / this.onScreen)
			if(this.page < pages){
				this.page += 1;
			} else {
				this.page = 1
			}
		},
		openmodal(name){
			this.modal[name].visible = true
		},
		closemodal(name){
			this.modal[name].visible = false

		}
	},
	mounted(){
		this.interval = setInterval(() => {
			this.nextPage();
		}, 25000);
	}
}
</script>

<style>
html, body{
	margin: 0;
	padding: 0;
	height: 100%;	
}
body{
	overflow: hidden;
}
#app {
	height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
	background: linear-gradient( rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.62) ), url('/img/bg.jpg');
	background-size: cover;
	background-position: 50% 50%;
	padding: 5px;
}

.mainTable .ant-table-placeholder{
	/* background: transparent; */
	border: none
}

.mainTable .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
	background-color: rgba(0,0,0,.5);
	background-color: rgba(255, 255, 255, 0.3);
	/* background-color: red; */
}
.mainTable .ant-table-tbody > tr > td {
	padding: 5px;
	border: none;
	font-size: 36px;
	color: #fff;
}
.header{
	color: #fff;
	opacity: .2;
	transition: opacity .2s ease;
}
.header:hover{
	opacity: 1;
}

.header .icon{
	font-size: 1.7rem;
}


.header .ant-pagination-item a {
	color: #fff
}
.header .ant-pagination-item {
	background-color: transparent;
}
.header .ant-pagination-item-active {
	background-color: rgba(255, 255, 255, 0.3);
}
.header .ant-pagination-prev .ant-pagination-item-link, .header .ant-pagination-next .ant-pagination-item-link{
	background-color: transparent;
	color: #fff
}

.ant-table-pagination{
	display: none;
}
</style>
