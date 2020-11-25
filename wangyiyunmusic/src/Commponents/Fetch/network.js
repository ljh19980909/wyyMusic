class Network {
  get(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  }
  post(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => resolve(data))
        .then((error) => reject(error));
    });
  }
}

// 直接导出class的实例,方便外界直接调用实例对象的方法
export default new Network();
