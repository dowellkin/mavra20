<template>
  <div id="app">

		<a-row class="header" type="flex" justify="space-around" align="middle" style="margin-bottom: 5px">
			<a-col>
				<a-icon class="icon" type="plus" @click="openmodal('add')"/>
				<a-modal :visible="modal.add.visible" @cancel="closemodal('add')" @ok='addSubmit()' :title="modal.add.currentid == -1 ? 'Добавить позицию':'Изменить позицию'">
					<div slot="footer">
						<a-button type="danger" v-if="modal.add.currentid != -1" @click="deleteLine()">Удалить</a-button>
						<a-button @click="closemodal('add')">Отмена</a-button>
						<a-button @click='addSubmit()' type="primary">Ок</a-button>
					</div>
					<p>
						Название пива
						<a-input v-model="modal.add.info.name"></a-input>
						<!-- <a-mentions
							placeholder=""
							:prefix="''"
							v-model="modal.add.info.name"
							@search="onSearch"
						>
							<a-mentions-option v-for="value in getNames || []" :key="value" :value="value">
								{{ value }}
							</a-mentions-option>
						</a-mentions> -->
					</p>
					<p>
						Страна производства
						<!-- <a-input v-model="modal.add.info.country"></a-input> -->
						<a-row type="flex">
							<a-col flex=1>
								<a-select class="modalSelect" v-model="modal.add.info.countrySwitch">
									<a-select-option v-for="country in getCountries" :key="country" :value="country">
										{{country}}
									</a-select-option>
								</a-select>
							</a-col>
							<a-col flex=3 v-if="modal.add.info.countrySwitch == 'ввести'">
								<a-input v-model="modal.add.info.country"></a-input>
							</a-col>
						</a-row>
					</p>
					<p>
						Крепость
						<a-input v-model="modal.add.info.percent"></a-input>
					</p>
					<p>
						Светлое-темное
						<a-row type="flex">
							<a-col flex=1>
								<a-select class="modalSelect" v-model="modal.add.info.brightnessSwitch">
									<a-select-option v-for="bright in getBrightness" :key="bright" :value="bright">
										{{bright}}
									</a-select-option>
								</a-select>
							</a-col>
							<a-col flex=3 v-if="modal.add.info.brightnessSwitch == 'ввести'">
								<a-input v-model="modal.add.info.brightness"></a-input>
							</a-col>
						</a-row>
					</p>
					<p>
						Характеристика
						<a-row type="flex">
							<a-col flex=1>
								<a-select class="modalSelect" v-model="modal.add.info.typeSwitch">
									<a-select-option v-for="type in getType" :key="type" :value="type">
										{{type}}
									</a-select-option>
								</a-select>
							</a-col>
							<a-col flex=3 v-if="modal.add.info.typeSwitch == 'ввести'">
								<a-input v-model="modal.add.info.type"></a-input>
							</a-col>
						</a-row>
					</p>
					<p>
						Стоимость
						<a-input v-model="modal.add.info.price"></a-input>
					</p>
				</a-modal>
			</a-col>
			<a-col>
				<a-icon class="icon" type="setting" @click="openmodal('settings')"/>
				<a-modal :visible="modal.settings.visible" @cancel="closemodal('settings')" :footer="false" title="Настройки">
					<p>
						Максимальное количество строк на экране
						<a-input v-model="modal.settings.onScreen" type="number" min=1 @change="onscreenChange"></a-input>
					</p>
					<p>
						Интервал
						<a-row type='flex'>
							<a-col flex=1>
								<a-select v-model="modal.settings.padding" style="width: 100%" @change="paddingChange">
									<a-select-option value="small">Маленький</a-select-option>
									<a-select-option value="medium">Средний</a-select-option>
									<a-select-option value="huge">Большой</a-select-option>
								</a-select>

							</a-col>
						</a-row>
					</p>
					<p>
						<a-popconfirm
							title="Это заменит все существующие записи на записи из файла book.csv?"
							ok-text="Да"
							cancel-text="Нет"
							@confirm="fetchFromFile"
						>
							<a-button :loading='loadFromFileLoading'>Загрузить из файла</a-button>
						</a-popconfirm>
					</p>
					<a-popconfirm
						title="Очистить весь список?"
						ok-text="Да"
						cancel-text="Нет"
						@confirm="clearBeer"
					>
						<a-button type="danger" icon="delete">Очистить</a-button>
					</a-popconfirm>
				</a-modal>
			</a-col>
			<a-col v-if="getBeer.length > getSettings.onScreen">
				<a-pagination v-model="page" :total="getBeer.length" :pageSize="getSettings.onScreen" @change="onPageChange"/>
			</a-col>
		</a-row>

		<a-config-provider>
			<template #renderEmpty>
        <div style="text-align: center; cursor: pointer" @click="openmodal('add')">
          <a-icon type="smile" style="font-size: 28px; margin-bottom: 15px" />
          <p style="font-size: 20px">Добавтье продукт с помощью "+" в левом верхнем углу экрана</p>
        </div>
      </template>
			<a-table
				class="mainTable"
				:class="[ `padding-${getSettings.padding}`  ]"
				:columns="columns"
				:data-source="getBeer"
				size="large"
				:showHeader="false"
				style="height: 100%"
				:pagination="pag"
				tableLayout="auto"
				rowKey="id"
				@change="onPageChange"
			>
				<span slot="name" slot-scope="text, line" @click="out(line)">{{text}}</span>
				<span slot="percent" slot-scope="text">{{text}}%</span>
				<span slot="price" slot-scope="text">{{text}}р.</span>
			</a-table>
		</a-config-provider>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		scopedSlots: { customRender: 'name' }
	},
	{
		title: 'percent',
		dataIndex: 'percent',
    scopedSlots: { customRender: 'percent' },
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
    scopedSlots: { customRender: 'price' },
	},
]

export default {
	name: 'App',
	data(){
		return {
			loadFromFileLoading: false,
			columns,
			page: 1,
			interval: 0,
			modal: {
				add: {
					visible: false,
					info: {
						name: "",
						percent: "",
						country: "",
						countrySwitch: "ввести",
						brightness: "",
						brightnessSwitch: "пусто",
						type: "",
						typeSwitch: "пусто",
						price: "",
					},
					currentid: -1,
				},
				settings: {
					visible: false,
					onScreen: 14,
					padding: 'medium'
				},
			}
		}
	},
  components: {
	},
	computed:{
		pag(){
			if(this.getBeer.length > this.getSettings.onScreen){
				return { pageSize: this.getSettings.onScreen, position: 'top', current: this.page }
			} else {
				return false
			}
		},
		...mapGetters(['getBeer', 'getBrightness', 'getType', 'getNames', 'getCountries', 'getSettings'])
	},
  methods: {
		...mapGetters(['getId']),
		...mapActions(['updateBeerField', 'deleteBeerField', 'addBeer', 'clearBeer', 'addCountries', 'addName', 'setBeer']),
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
			const pages = Math.ceil(this.getBeer.length / this.getSettings.onScreen)
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
			this.clearAddFields()
			if(name == 'add') this.modal.add.currentid = -1
		},
		out(line){
			const id = line.id;
			this.modal.add.currentid = id;
			
			this.modal.add.info = {
				name: line.name,
				percent: line.percent,
				country: line.country,
				brightness: line.brightness,
				brightnessSwitch: "ввести",
				type: line.type,
				typeSwitch: "ввести",
				price: line.price,
			}

			this.openmodal('add');
		},
		clearAddFields(){
			this.modal.add.info = {
				name: "",
				percent: "",
				country: "",
				brightness: "",
				brightnessSwitch: "пусто",
				type: "",
				typeSwitch: "пусто",
				price: "",
			}
			this.modal.add.currentid = -1
		},
		addSubmit(){
			const adMod = this.modal.add
			const inf = adMod.info
			if(inf.name == ''){
				this.$message.error('Добавьте название');
				return;
			}
			// this.$store.dispatch('addName', inf.name);
			// this.$store.dispatch('addCountries', inf.country);
			let result = {
				id: this.getId(),
				name: inf.name,
				percent: inf.percent,
				country: inf.country,
				price: inf.price
			}
			if(adMod.currentid != -1){
				result.id = adMod.currentid;
			}
			const brightnessSwitch = inf.brightnessSwitch;
			if(brightnessSwitch == "ввести"){
				result.brightness = inf.brightness
			} else if(brightnessSwitch == 'пусто') {
				result.brightness = ''
			} else {
				result.brightness = inf.brightnessSwitch
			}
			const typeSwitch = inf.typeSwitch;
			if(typeSwitch == "ввести"){
				result.type = inf.type
			} else if(typeSwitch == 'пусто') {
				result.type = ''
			} else {
				result.type = inf.typeSwitch
			}

			if(this.modal.add.currentid == -1){
				this.addBeer(result)
				this.$message.success('Позиция добавлена успешно');
			} else {
				this.updateBeerField(result);
				this.$message.success('Позиция обновлена успешно');
			}

			this.clearAddFields();
			this.modal.add.visible = false;
		},
		deleteLine(){
			this.deleteBeerField(this.modal.add.currentid);
			this.$message.success('Позиция удалена успешно');
			this.clearAddFields();
			this.modal.add.visible = false;
		},
		onSearch(_, prefix) {
      console.log(_, prefix);
      this.prefix = prefix;
		},
		fetchFromFile(){
			this.loadFromFileLoading = true;
			fetch('./beer.csv')
			.then(res => res.text())
			.then(res => {
				let noNameTrigger = false;
				const lines = res.split("\r\n").filter(el => {
					if(el[0] == ";"){
						noNameTrigger = true;
					}
					return el.length > 0 && el[0] != ";"
				});
				if(noNameTrigger)
					this.$message.warning('Одно или более полей не имеет имени и не будет отображено');
				console.log(lines);
				console.log(lines[8]);
				const result = [];
				lines.forEach(line => {
					let name, percent, country, brightness, type, price;
					[name, percent, country, brightness, type, price] = line.split(";");
					price = parseFloat(price.replace(",", ".")).toFixed(1)
					percent = parseFloat(percent.replace(",", ".")).toFixed(1)
					const beer = {id: result.length ,name, percent, country, brightness, type, price};
					result.push(beer);
				});
				this.setBeer(result);
				this.$message.success("Позиции успешно загружены из файла")
				this.loadFromFileLoading = false;
			})
			.catch(err => {
				console.error(err);
				this.$message.error("Возникла какая-то ошибка")
				this.loadFromFileLoading = false;
			})
		},
		onscreenChange(e){
			console.log(e);
			this.$store.dispatch('updateOnScreen', this.modal.settings.onScreen)
		},
		paddingChange(e){
			console.log(e);
			this.$store.dispatch('updatePadding', this.modal.settings.padding)
		}
	},
	mounted(){
		this.interval = setInterval(() => {
			this.nextPage();
		}, 25000);
		this.$store.dispatch('load');
		this.modal.settings.onScreen = this.getSettings.onScreen
		this.modal.settings.padding = this.getSettings.padding
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
	font-weight: 600;
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
	background: transparent;
	color: rgb(255 255 255 / 33%);
	border: none
}

.mainTable .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
	background-color: rgba(0,0,0,.5);
	background-color: rgba(255, 255, 255, 0.3);
	/* background-color: red; */
}
.mainTable .ant-table-tbody > tr > td {
	padding-left: 5px;
	padding-right: 5px;
	border: none;
	font-size: 38px;
	color: #fff;
	cursor: pointer;
	user-select: none;
}
.header{
	color: #fff;
	/* opacity: .2; */
	/* transition: opacity .2s ease; */
}
/* .header:hover{
	opacity: 1;
} */

.header .icon{
	font-size: 1.7rem;
	opacity: .2;
	transition: opacity .2s ease;
}

.header .icon:hover{
	opacity: 1;
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

.modalSelect{
	width: 100%;
}

.mainTable.padding-small .ant-table-tbody > tr > td{
	padding-top: 0;
	padding-bottom: 0;
}

.mainTable.padding-medium .ant-table-tbody > tr > td{
	padding-top: 5px;
	padding-bottom: 5px;
}

.mainTable.padding-huge .ant-table-tbody > tr > td{
	padding-top: 17px;
	padding-bottom: 17px;
}
</style>
