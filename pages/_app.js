import "bootstrap/dist/css/bootstrap.css";
import { useState, useEffect } from "react";
import Util from "../util/Util";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Services from "../util/Services";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  const timerHandler = (flag) => setStartTimer(flag);

  useEffect(() => {
    let timer;
    if (startTimer) {
      let expiresIn = Util.getSessionData("tokenExpiresIn");
      if (expiresIn) {
        expiresIn = parseInt(expiresIn);
        timer = setTimeout(() => {
          setShowPopUp(true);
          Swal.fire({
            title: "Do you want to refresh token?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Refresh",
            denyButtonText: `Log out`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              (async () => {
                let resp = await Services.refreshToken({
                  userToken: Util.getSessionData("userToken"),
                });

                if (resp && resp.data && resp.data.loginSuccess) {
                  Util.setSessionData("userToken", resp.data.userToken);
                  Util.setSessionData(
                    "tokenExpiresIn",
                    resp.data.tokenExpiresIn
                  );
                  setStartTimer(true);
                }
              })();
            } else if (result.isDenied) {
              clearTimeout(timer);
              Util.setSessionData("userToken", "");
              router.push("/");
            }
          });
          setStartTimer(false);
        }, expiresIn * 1000 - 20000);
        console.log("Timer jus set", timer);
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [startTimer]);

  return (
    <Component
      {...pageProps}
      showPopUp={showPopUp}
      timerHandler={timerHandler}
    />
  );
}
