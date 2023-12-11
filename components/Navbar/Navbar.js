import Link from "next/link";
import * as styles from "./Navbar.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Util from "../../util/Util";

const Navbar = (props) => {
  const router = useRouter();

  const logout = () => {
    Swal.fire({
      title: "Are you sure want to logout?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Logout",
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Util.setSessionData("userToken", "");
        router.push("/");
      } else if (result.isDenied) {
      }
    });
  };

  return (
    <>
      <nav className={styles.mainnav}>
        <ul>
          <Link
            href="/dashboard"
            className={`${
              props.activeTab == "dashboard" ? styles.activeItem : styles.item
            }`}
          >
            <li>Dashboard</li>
          </Link>
          <Link
            href="/budgets"
            className={`${
              props.activeTab == "budgets" ? styles.activeItem : styles.item
            }`}
          >
            <li>Budgets</li>
          </Link>
          <Link
            href="/expense"
            className={`${
              props.activeTab == "expense" ? styles.activeItem : styles.item
            }`}
          >
            <li>Expense</li>
          </Link>
          {/* <li
            href="/"
            className={`${
              props.activeTab == "logout" ? styles.activeItem : styles.item
            }`}
          > */}
          <li
            className={styles.item}
            style={{ cursor: "pointer" }}
            onClick={logout}
          >
            Logout
          </li>
          {/* </lis> */}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
