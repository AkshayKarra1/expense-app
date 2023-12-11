import Navbar from "../Navbar/Navbar";
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import Services from "../../util/Services";
import Util from "../../util/Util";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();
  const [chartData, setChartData] = useState(["Category", "Amount"]);

  const pieChartOptions = {
    title: "Monthly Expenses",
  };

  useEffect(() => {
    if (!Util.getSessionData("isTimerSet")) {
    }
  }, []);
  const barGraphOptions = {
    title: "Mothly Expenses",
  };

  async function fetchExpenses() {
    let resp = await Services.getExpenses(
      encodeURIComponent(Util.getSessionData("userToken"))
    );

    if (resp && resp.success && resp.data) {
      setChartData(resp.data.chartData);
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
        text: "User Login failed",
        icon: "error",
      });
    }
  }

  useEffect(() => {
    (async () => {
      await fetchExpenses();
    })();
  }, []);

  return (
    <>
      <Navbar activeTab="dashboard"></Navbar>
      <h4>Budget Reports</h4>
      {chartData.length > 1 ? (
        <div style={{ display: "flex" }}>
          <div>
            <Chart
              chartType="PieChart"
              data={chartData}
              options={pieChartOptions}
              width={"100%"}
              height={"400px"}
            />
          </div>
          <div>
            <Chart
              chartType="Bar"
              width="100%"
              height="400px"
              data={chartData}
              options={barGraphOptions}
            />
          </div>
          <div>
            <Chart
              chartType="AreaChart"
              width="100%"
              height="400px"
              data={chartData}
              options={pieChartOptions}
            />
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h6>No expenses reported</h6>
        </div>
      )}
    </>
  );
};

export default Dashboard;
