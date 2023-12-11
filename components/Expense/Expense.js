import Swal from "sweetalert2";
import Services from "../../util/Services";
import * as style from "./Expense.module.css";
import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Util from "../../util/Util";

const Expense = () => {
  let date = new Date();

  const [category, setCategory] = useState();
  const [expenseDate, setExpenseDate] = useState(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  );
  const [amount, setAmount] = useState();
  const [optionsList, setOptionsList] = useState([]);
  const [disabled, setDisabled] = useState(false);

  async function fetchData() {
    let resp = await Services.getCategories(Util.getSessionData("userToken"));
    if (resp && resp.success && resp.data) {
      let options = resp.data.map((item, index) => {
        return (
          <option key={`exp-category-${item.id}`} value={item.id}>
            {item.category}
          </option>
        );
      });

      options.unshift(
        <option key={`exp-category-default`} value="-1">
          --Select Category--
        </option>
      );

      setOptionsList(options);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  const createExpense = async (e) => {
    e.preventDefault();
    let fieldEmptyMessage = "";

    console.log(category, expenseDate, amount);

    if (!category > 0) {
      fieldEmptyMessage = "Select Category";
    }

    if (!fieldEmptyMessage && (!amount || amount <= 0)) {
      fieldEmptyMessage = "Amount shoule be positive";
    }

    if (!fieldEmptyMessage && !expenseDate) {
      fieldEmptyMessage = "Date can not be empty";
    }

    if (fieldEmptyMessage) {
      Swal.fire({
        title: "Error!",
        text: fieldEmptyMessage,
        icon: "error",
      });
      return;
    }
    setDisabled(true);
    let resp = await Services.createExpense({
      expenseDate,
      category,
      amount,
      userToken: Util.getSessionData("userToken"),
    });

    if (resp && resp.data && resp.data.success) {
      Swal.fire({
        title: "Success!",
        text: "Expense created successfully",
        icon: "success",
      });
      setCategory(-1);
      setAmount("");
      let date = new Date();
      setExpenseDate(
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      );
    } else if (resp && resp.data.message) {
      Swal.fire({
        title: "Error!",
        text: resp.data.message,
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Expense creation failed",
        icon: "error",
      });
    }
    setDisabled(false);
  };

  return (
    <>
      <Navbar activeTab="expense"></Navbar>
      <div
        style={{
          width: "30%",
          margin: "auto",
        }}
      >
        <main className={`${style["form-signin"]} "text-center" "mt-5"`}>
          <form onSubmit={createExpense}>
            <h4 className="h4 mb-4 fw-normal">Create Expense</h4>

            <div className="form-floating">
              <input
                type="date"
                className="form-control"
                id="floatingPassword"
                placeholder="Date"
                value={expenseDate}
                onChange={(event) => setExpenseDate(event.target.value)}
              />
              <label htmlFor="floatingPassword">Date</label>
            </div>

            <div className="form-floating">
              <select
                className="form-control"
                id="floatingInput"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {optionsList}
              </select>
              <label htmlFor="floatingInput">Category</label>
            </div>

            <div className="form-floating">
              <input
                type="number"
                className="form-control"
                id="floatingPassword"
                placeholder="Amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <label htmlFor="floatingPassword">Amount</label>
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
    </>
  );
};

export default Expense;
