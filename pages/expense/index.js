import Head from "next/head";
import Expense from "../../components/Expense/Expense";

const ExpensePage = () => {
  return (
    <>
      <Head>
        <title>Budget Tracker - Expense</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        <meta name="keywords" content="Budget-Expense" />
        <meta
          name="description"
          content="Expense creation in Budget App."
        ></meta>
      </Head>
      <div style={{ margin: "2rem" }}>
        <h3>Budget - Expense</h3>
        <Expense></Expense>
      </div>
    </>
  );
};

export default ExpensePage;
