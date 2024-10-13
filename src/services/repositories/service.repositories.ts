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
