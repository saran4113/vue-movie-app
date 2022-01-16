import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

export default {
  
  namespaced: true,
  state: ()=>({
    movies: [],
    message: 'Search for the Movie Title',
    loading: false,
    theMovie: {},
    nowMovieId:'n1'
  }),
  getters: {},
  mutations: {
    updateState(state,payload){
      Object.keys(payload).forEach(key=>{
        state[key] = payload[key]
      })
    },
    resetMovies(state){
      state.movies = []
    }
  },
  actions:{
    async searchMovies({state ,commit}, payload) {
      if(state.loading) return 
    
      commit('updateState',{
        message: '',
        loading: true
      })

    try {
        
      const res = await _fetchMovie({
        ...payload,
        page:1
      })
      const {Search, totalResults} =res.data
      commit('updateState',{
        movies: _uniqBy(Search,'imdbID')
      })
      console.log(totalResults) //302
      console.log(typeof totalResults) //string

      const total = parseInt(totalResults, 10)
      const pageLength = Math.ceil(total / 10)

      //추가요청
      if(pageLength>1){
        for(let page = 2; page<=pageLength; page++){
          if(page > (payload.number/10)) break
          const res = await _fetchMovie({
            ...payload,
            page})
          const { Search} = res.data
          commit('updateState',{
            movies:[
              ...state.movies,
              ..._uniqBy(Search,'imdbID')]
          })
        }
      }
    } catch ({message}) {
      commit('updateState',{
        movies:[],
        message
      })
    } finally {
      commit('updateState',{
        loading: false
      })
    }
    },
    async searchMovieWithId({state,commit},payload){
      if(state.loading) return
      commit('updateState',{
        theMovie:{},
        loading: true
      })
      try {
        const res = await _fetchMovie(payload)
        console.log(res.data)
        commit('updateState',{
          theMovie: res.data
        })
      } catch (error) {
        commit('updateState',{
          theMovie:{}
        })
      } finally {
        commit('updateState',{
          loading: false
        })
      }
    },
    changeNowMovieId(){
      
    }
  }
}

async function _fetchMovie(payload) {
  return await axios.post('/.netlify/functions/movie',payload)

}