import Head from "next/head";
import Script from "next/script";
import Dashboard from "../../components/Dashboard/Dashboard";

const DashBoardPage = () => {
  return (
    <>
      <Head>
        <title>Budget Tracker - Dashboard</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        <meta name="keywords" content="Budget-Login" />
        <meta name="description" content="Login to the Budget App."></meta>
      </Head>
      <div style={{ margin: "2rem" }}>
        <h3>Budget - Dashboard</h3>
        <Dashboard></Dashboard>
      </div>
    </>
  );
};

export default DashBoardPage;
