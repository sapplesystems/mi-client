import apiRequest from "./request";

export const getOrgDetails = async () => {
  const url = `/api/v1/org-details/`;
  const res = await apiRequest({ method: "GET", url });
  return res;
};

export const getUser = async () => {
  let user = apiRequest({
    method: "GET",
    url: "/api/v1/get-user/",
  })
    .then((resp) => {
      localStorage.setItem("user", JSON.stringify({ ...resp.data }));
      return resp.data;
    })
    .catch((error) => {
      message.error(error?.data?.error);
    });
  return user;
};
