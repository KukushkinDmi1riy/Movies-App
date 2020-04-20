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

const {MOVIES} = mutations;

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
    currenPage: ({currentPage}) => (currentPage),
    moviesPerPage: ({moviesPerPage}) => (moviesPerPage),
    moviesList: ({movies}) => (movies),
  },
  mutations: {
    [MOVIES](state, value) {
      state.movies = value;
    }
  },
  actions: {
    initMoviesStore: {
      handler({ dispatch }) {
        dispatch('fetchMovies');
      },
      root: true,
    },
    async fetchMovies({getters, commit}) {
      try{
        const { currenPage, moviesPerPage, slicedIDs } = getters;
        const from = moviesPerPage * currenPage - moviesPerPage;
        const to = moviesPerPage * currenPage;
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
      };
    }
  }
};
export default movieStore;
