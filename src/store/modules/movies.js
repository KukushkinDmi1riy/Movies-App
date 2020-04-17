import axios from "@/plugins/axios";

const movieStore = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async fetchMovies() {
      const response = await axios.get("/", {
        params: {
          i: "tt0111161"
        }
      });
      console.log(response);
    }
  }
};
export default movieStore;
