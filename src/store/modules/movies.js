import IDs from '../mock/imdb_top250'
import axios from "@/plugins/axios";
import mutations from "../mutations";

//переводим из массива в объект объектов для дальнейшей записи в стору
function serializeResponse(movies){
  return movies.reduce((acc, movie) => {
    acc[movie.imdbID] = movie;
    return acc;
  }, {});
}

const {MOVIES, CURRENT_PAGE} = mutations;

const movieStore = {
  namespaced: true,
  state: {
    top25IDs: IDs,
    moviesPerPage: 12,
    currentPage: 1,
    movies: {}
  },
  getters: {
    slicedIDs: ({top25IDs}) => (from, to) => top25IDs.slice(from, to),
    currentPage: ({currentPage}) => (currentPage),
    moviesPerPage: ({moviesPerPage}) => (moviesPerPage),
    moviesList: ({movies}) => (movies),
    moviesLenght: ({top25IDs}) => Object.keys(top25IDs).length
  },
  mutations: {
    [MOVIES](state, value) {
      state.movies = value;
    },
    [CURRENT_PAGE](state, value) {
      state.currentPage = value;
    }
  },
  actions: {
    initMoviesStore: {
      handler({ dispatch }) {
        dispatch('fetchMovies');
      },
      root: true,
    },
    async fetchMovies({ getters, commit, dispatch }) {
      try{
        dispatch('toggleLoader', true, {root: true});
        const { currentPage, moviesPerPage, slicedIDs } = getters;
        const from = moviesPerPage * currentPage - moviesPerPage;
        const to = moviesPerPage * currentPage;
        const moviesToFetch = slicedIDs(from, to);
        // console.log(moviesToFetch);

        const requests = moviesToFetch.map((id)=> axios.get(`/?i=${id}`));
        // console.log(requests);

        const response = await Promise.all(requests);
        const movies = serializeResponse(response);
        console.log(response);
        console.log(movies);
        commit(MOVIES, movies);
      } catch(err) {
        console.log(err);
      } finally{
        dispatch('toggleLoader', false, {root: true})
      }
    },
    changeCurrentPage({commit, dispatch}, page) {
      commit(CURRENT_PAGE, page);
      dispatch('fetchMovies');
    }
  }
};
export default movieStore;
