import Head from "next/head";
import Script from "next/script";
import Budgets from "../../components/Budgets/Budgets";

const BudgetsPage = () => {
  return (
    <>
      <Head>
        <title>Budget Tracker - Budget</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        <meta name="keywords" content="Budget-Login" />
        <meta name="description" content="Login to the Budget App."></meta>
      </Head>
      <div style={{ margin: "2rem" }}>
        <h3>Budgets</h3>
        <Budgets></Budgets>
      </div>
    </>
  );
};

export default BudgetsPage;
