import axios from "axios";
import { getCurrentUserToken } from "../../utils/storage/token.utils";
import { MAIN_SERVER_ROUTE } from "../../constants";

export async function fetchRepos() {
  const token = await getCurrentUserToken();
  try {
    const result = await axios.get(`${MAIN_SERVER_ROUTE}/repo`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
}
export async function searchRepos(value: string) {
  try {
    const result = await axios.get(
      `https://api.github.com/search/repositories?q=${value}&order=desc&per_page=5`
    );

    return result.data.items;
  } catch (error) {
    console.log(error);
  }
}
