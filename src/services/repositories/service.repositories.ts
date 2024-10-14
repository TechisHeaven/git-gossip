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
    throw error;
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
    throw error;
  }
}

export async function getRepoById(id: number | string) {
  try {
    const result = await axios.get(`https://api.github.com/repositories/${id}`);
    return result.data;
  } catch (error) {
    console.log("Service Error: ", error);
    throw error;
  }
}

export async function getRepoContentDataByPath(
  path: number | string,
  url: string
) {
  const mockRepoContents: {
    [key: string]: { name: string; path: string; type: string; sha: string }[];
  } = {
    "": [
      { name: "Folder1", path: "Folder1", type: "dir", sha: "1" },
      { name: "Folder2", path: "Folder2", type: "dir", sha: "2" },
      { name: "File1.txt", path: "File1.txt", type: "file", sha: "3" },
    ],
    Folder1: [
      { name: "Subfolder1", path: "Folder1/Subfolder1", type: "dir", sha: "4" },
      { name: "File2.txt", path: "Folder1/File2.txt", type: "file", sha: "5" },
    ],
    Folder2: [
      { name: "File3.txt", path: "Folder2/File3.txt", type: "file", sha: "6" },
    ],
  };

  try {
    console.log(url);
    const result = await axios.get(
      `https://api.github.com/repos/TechisHeaven/git-gossip/contents/${path}`
    );
    return result.data;

    await new Promise((resolve) => setTimeout(resolve, 500));
    // Ensure the path is a valid key in mockRepoContents
    return mockRepoContents[path];
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function fetchFileContentByUrl(url: string) {
  try {
    const result = await axios.get(url);
    return result.data.content;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
