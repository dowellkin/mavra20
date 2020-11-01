import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		beer: [],
		brightness: ['пусто', 'светлое', 'темное', 'ввести'],
		type: ['пусто', 'паст.фил.', 'паст.нефил.', 'непаст.фил.', 'непаст.нефил.', 'ввести'],
		names: [],
		countries: ['РБ', 'РФ', 'Чех', 'ЛТ', 'Герм', 'ввести'],
		settings: {
			onScreen: 14,
			padding: 'medium'
		},
		templates: []
  },
  mutations: {
		addBeer(state, data){
			state.beer.push(data);
		},
		setBeer(state, value){
			state.beer = value;
		},
		removeById(state, value){
			console.log(value);
			let index = state.beer.findIndex(el => el.id == value );
			if(index != -1)
				state.beer.splice(index,1)
			console.log(index);
		},
		setSomeIndexBeer(state, value){
			const item = state.beer.find(el => el.id == value.value.id)
			Object.assign(item, value.value)
		},
		setBrightness(state, value){
			state.brightness = value;
		},
		setType(state, value){
			state.type = value;
		},
		setNames(state, value){
			state.names = value;
		},
		setCountries(state, value){
			state.countries = value;
		},
		clearNames(state){
			state.names = [];
		},
		clearCountries(state){
			state.countries = [];
		},
		setSettings(state, value){
			state.settings = value;
		},
		setOnScreen(state, value){
			state.settings.onScreen = parseInt(value);
		},
		setPadding(state, value){
			state.settings.padding = value;
		},
		setTemplates(state, value){
			state.templates = value;
		}
  },
  actions: {
		updateBeerField(ctx, value){
			const beer = ctx.getters.getBeer;
			let index = beer.findIndex(el => el.id == value.id);
			ctx.commit('setSomeIndexBeer', {index, value});
			ctx.dispatch('saveOnly', 'beer');
		},
		deleteBeerField(ctx, value){
			ctx.commit('removeById', value);
			ctx.dispatch('saveOnly', 'beer');
		},
		addBeer(ctx, value){
			ctx.commit('addBeer', value);
			ctx.dispatch('saveOnly', 'beer');
		},
		clearBeer(ctx){
			ctx.commit('setBeer', []);
			ctx.dispatch('saveOnly', 'beer');
		},
		setBeer(ctx, value){
			ctx.commit('setBeer', value);
			ctx.dispatch('saveOnly', 'beer');
		},
		addCountries(ctx, value){
			let countries = ctx.getters.getCountries;
			if(value == '' || countries.indexOf(value) != -1) return;
			countries.push(value);
			ctx.commit('setCountries', countries);
			ctx.dispatch('saveOnly', 'countries');
		},
		addName(ctx, value){
			let names = ctx.getters.getNames;
			if(value == '' || names.indexOf(value) != -1) return;
			names.push(value);
			ctx.commit('setNames', names);
			ctx.dispatch('saveOnly', 'names');
		},
		save(ctx){
			const beer = ctx.getters.getBeer;
			const brightness = ctx.getters.getBrightness;
			const type = ctx.getters.getType;

			const allData = {beer, brightness, type};

			for (const [key, value] of Object.entries(allData)) {
				console.log(`${key} saved`);
				localStorage.setItem(key, JSON.stringify(value));
			}
		},
		saveOnly(ctx, type){
			type = type.toLowerCase();
			const FLCtype = type[0].toUpperCase() + type.slice(1);
			const val = ctx.getters[`get${FLCtype}`];
			console.log(`${type} saved`);
			localStorage.setItem(type, JSON.stringify(val));
		},
		load(ctx){
			console.log("loaded");
			if(localStorage.getItem('beer')){
				ctx.commit('setBeer',					JSON.parse(localStorage.getItem('beer')));
			}
			if(localStorage.getItem('brightness')){
				ctx.commit('setBrightness',		JSON.parse(localStorage.getItem('brightness')));
			}
			if(localStorage.getItem('type')){
				ctx.commit('setType',					JSON.parse(localStorage.getItem('type')));
			}
			if(localStorage.getItem('names')){
				ctx.commit('setNames',					JSON.parse(localStorage.getItem('names')));
			}
			if(localStorage.getItem('settings')){
				ctx.commit('setSettings',					JSON.parse(localStorage.getItem('settings')));
			}
		},
		updateBrightness(ctx, value){
			ctx.commit('setBrightness', value);
			ctx.dispatch('saveOnly', 'brightness')
		},
		updateType(ctx, value){
			ctx.commit('setType', value);
			ctx.dispatch('saveOnly', 'type')
		},
		clear(ctx, value){
			if(value == '' || value == undefined){
				ctx.commit('clearNames')
				ctx.commit('clearCountries')
			} else if(value.toLowerCase() == 'names'){
				ctx.commit('clearNames')
			} else if(value.toLowerCase() == 'countries'){
				ctx.commit('clearCountries')
			}
		},
		updateOnScreen(ctx, val){
			ctx.commit('setOnScreen', val);
			ctx.dispatch('saveOnly', 'settings')
		},
		updatePadding(ctx, val){
			ctx.commit('setPadding', val);
			ctx.dispatch('saveOnly', 'settings')
		},
		updateTemplates(ctx, val){
			ctx.commit('setTemplates', val)
		}
	},
	getters: {
		getBeer(state){
			return state.beer
		},
		getBrightness(state){
			return state.brightness
		},
		getType(state){
			return state.type
		},
		getId(state){
			if(state.beer.length == 0) return 0 
			return Math.max(...state.beer.map(el=>el.id))+1
		},
		getNames(state){
			return state.names;
		},
		getCountries(state){
			return state.countries;
		},
		getSettings(state){
			return state.settings
		},
		getTemplates(state){
			return state.templates
		}
	},
  modules: {
  }
})