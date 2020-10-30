import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		beer: [],
		brightness: ['пусто', 'светлое', 'темное', 'ввести'],
		type: ['пусто', 'паст.фил.', 'паст.нефил.', 'непаст.фил.', 'непаст.нефил.', 'ввести']
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
			let index = state.beer.findIndex(el => el.id == value);
			if(index != -1)
				state.beer.splice(index,1)
			console.log(index);
		},
		setSomeIndexBeer(state, value){
			const item = state.beer.find(el => el.id == value.value.id)
			Object.assign(item, value.value)
		}
  },
  actions: {
		updateBeerField(ctx, value){
			const beer = ctx.getters.getBeer;
			let index = beer.findIndex(el => el.id == value.id);
			ctx.commit('setSomeIndexBeer', {index, value});
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
		}
	},
  modules: {
  }
})
