import axios from "axios";
const baseUrl = "http://localhost:3002/api/blogs";

let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  console.log("newObject:", newObject);
  const config = {
    headers: { Authorization: token },
  };
  console.log("config:", config);
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, newObject) => {
  console.log("newObject:", newObject);
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
};

const remove = async (id) => {
  console.log("delete");
  const config = {
    headers: { Authorization: token },
  };
  console.log("config:", config);
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { getAll, create, update, remove, setToken };
