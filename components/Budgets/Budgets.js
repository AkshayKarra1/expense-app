import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Services from "../../util/Services";
import * as style from "./Budgets.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Util from "../../util/Util";

const Budgets = () => {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [budgetList, setBudgeList] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    let resp = await Services.getCategories(Util.getSessionData("userToken"));
    if (resp && resp.success && resp.data) {
      let listRows = resp.data.map((item, index) => {
        return (
          <tr key={`category_row_${item.id}`}>
            <th scope="row">{index + 1}</th>
            <td>{item.category}</td>
          </tr>
        );
      });

      setBudgeList(listRows);
    }
  }

  //let listRows = [];

  const createCategory = async (event) => {
    event.preventDefault();
    if (!category) {
      Swal.fire({
        title: "Error!",
        text: "Category can not be empty",
        icon: "error",
      });
    }
    setDisabled(true);
    let resp = await Services.createCategory({
      category: category,
      userToken: Util.getSessionData("userToken"),
    });
    if (resp && resp.data && resp.data.success) {
      Swal.fire({
        title: "Success!",
        text: resp.message,
        icon: "success",
      });
      setCategory("");
      await fetchData();
    } else if (resp && resp.message) {
      Swal.fire({
        title: "Error!",
        text: resp.message,
        icon: "error",
      });
      router.push("/");
    } else {
      Swal.fire({
        title: "Error!",
        text: "Budget creation failed",
        icon: "error",
      });
    }
    setDisabled(false);
    return;
  };
  return (
    <>
      <Navbar activeTab="budgets"></Navbar>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h5>Budget List</h5>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>{budgetList}</tbody>
          </table>
        </div>
        <div style={{ width: "30%" }}>
          <div>
            <main className={`${style["form-signin"]} "text-center" "mt-5"`}>
              <form onSubmit={createCategory}>
                <h5 className="h5 mb-3 fw-normal">Create new category</h5>
                <div className="form-floating">
                  <input
                    type="text"
                    className="input-sm form-control form-control-sm"
                    id="floatingInput"
                    placeholder="Category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  />
                  <label htmlFor="floatingInput">Category</label>
                </div>

                <button
                  className="w-100 btn btn-md btn-primary"
                  type="submit"
                  disabled={disabled}
                >
                  Create
                </button>
              </form>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Budgets;
