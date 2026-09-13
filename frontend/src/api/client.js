import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Hata mesajlarini backend formatina gore standartlastir
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;

    let message = "Beklenmeyen bir hata olustu.";
    let fieldErrors = null;

    if (data) {
      message = data.message || message;
      fieldErrors = data.fieldErrors || null;
    } else if (error.code === "ERR_NETWORK") {
      message = "Sunucuya baglanilamadi. Backend calisiyor mu?";
    }

    return Promise.reject({ message, fieldErrors, status: error.response?.status });
  }
);

export default client;