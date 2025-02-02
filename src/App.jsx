import { useState } from "react";

import axios from "axios";

function App() {
  const { VITE_BASE_URL: BASE_URL, VITE_API_BASE: API_BASE } = import.meta.env;
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);
  const [productList, setProductList] = useState({});
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/admin/signin`, {
        username: user.username,
        password: user.password,
      });
      setIsAuth(true);
      const { token, expired } = res.data;
      document.cookie = `yunlinToken=${token}; expires=${new Date(
        expired
      )}; SameSite=None; Secure`;
      axios.defaults.headers.common["Authorization"] = token;
      const result = await axios.get(
        `${BASE_URL}/api/${API_BASE}/admin/products`
      );
      const products = result.data.products;

      setProductList(products);
      console.log(productList);
    } catch (error) {
      alert(error.message);
    }
  };

  const getOneProduct = async (id) => {
    const res = await axios.get(`${BASE_URL}/api/${API_BASE}/product/${id}`);
    console.log(res);
  };

  return (
    <>
      {isAuth ? (
        <>
          <div className="row">
            <div className="col">
              <table className="table ">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((item) => {
                    return (
                      <tr key={item.id}>
                        <th scope="row">{item.title}</th>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>{item.is_enabled === 1 ? "是" : "否"}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={getOneProduct(item.id)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col">
              <div className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container">
          <h1 className="text-center">請先登入</h1>
          <p></p>
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="username"
                value={user.username}
                onChange={handleInput}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                name="password"
                value={user.password}
                onChange={handleInput}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              login
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
