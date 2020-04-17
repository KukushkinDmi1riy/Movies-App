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
          apiKey: process.env.VUE_APP_API_KEY,
          plot: "full",
          i: "tt0111161"
        }
      });
      console.log(response);
    }
  }
};
export default movieStore;
