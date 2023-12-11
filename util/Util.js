import axios from "axios";
// import * as CONSTANT from "./constants";
//const crypto = require("crypto");

class Util {
  static CURRENCY_FORMAT_INTEGER = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  });
  static MILLION_FORMAT = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  });

  static async postData(url, data) {
    const finalUrl = process.env.NEXT_PUBLIC_API_BASE_URL + url;
    const response = await fetch(finalUrl, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json();
  }

  static async getData(url) {
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json();
  }

  static async postDataToApiGateway(url, data, headers) {
    let resp = {};
    try {
      if (headers) {
        resp = await axios.post(url, data, {
          headers: headers,
        });
      } else {
        resp = await axios.post(url, data);
      }
      console.log(resp);
      return resp;
    } catch (e) {
      console.error(e);
    }
  }
  static async getDataFromApiGateway(url, headers) {
    let response = {};
    try {
      if (headers) {
        response = await axios.get(url, {
          headers: headers,
        });
      } else {
        response = await axios.get(url);
      }

      response = response.data;
    } catch (error) {
      console.error(error);
    }
    return response;
  }

  static async putDataTopiGateway(url, data, headers) {
    let resp = {};
    try {
      if (headers) {
        resp = await axios.put(url, data, {
          headers: headers,
        });
      } else {
        resp = await axios.put(url, data);
      }
      return resp.data;
    } catch (e) {
      console.error(e);
    }
  }

  static async deleteRequest(url, data, headers = {}) {
    let resp = { status: 0, desc: "Error" };
    try {
      if (headers) {
        resp = await axios.delete(url, {
          data: { ...data },
          headers: {
            UserToken: headers.UserToken,
            "Content-Type": "application/json",
          },
        });
      } else {
        resp = await axios.delete(url, data);
      }
      return resp.data;
    } catch (e) {
      console.error(e);
    }
    return resp;
  }

  static getUserToken() {
    return process.env.USER_TOKEN;
  }

  static getActualUserToken() {
    return this.getSessionData(CONSTANT.USER_TOKEN_KEY);
  }
  static setSessionData(key, value) {
    window.sessionStorage.setItem(key, value);
  }
  static getSessionData(key) {
    return window.sessionStorage.getItem(key);
  }
  static removeSessionData(key) {
    window.sessionStorage.removeItem(key);
  }

  static setLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }
  static getLocalStorage(key) {
    return localStorage.getItem(key);
  }
  static removeLocalStorage(key) {
    localStorage.removeItem(key);
  }

  static convertToString(input) {
    try {
      return input.toString();
    } catch (e) {
      return "";
    }
  }

  static convertToNumber(input) {
    try {
      if (input != null && input != "" && input != undefined) {
        return Number(this.convertToString(input));
      }
    } catch (e) {}
    return input;
  }

  static getDoubleStr(value, precision) {
    if (value == null || value == undefined || value == "") {
      return 0.0 + "";
    }
    let temp = Math.pow(10, precision);
    return Math.round(value * temp) / temp + "";
  }

  static getDoubleStrFixedDecimal(value, precision) {
    if (value == null || value == undefined || value == "") {
      return 0.0 + "";
    }
    let temp = Math.pow(10, precision);
    return (Math.round(value * temp) / temp).toFixed(2) + "";
  }
  static getDoubleStrFixedDecimalHardPrecision(value, precision) {
    if (value == null || value == undefined || value == "") {
      return 0.0 + "";
    }
    let temp = Math.pow(10, precision);
    return (Math.round(value * temp) / temp).toFixed(precision) + "";
  }
  static formatDecimalNumber(data) {
    try {
      if (data == null || data == undefined || data == "") {
        return "0";
      }
      if (data.includes(",")) {
        data = data.replace(/,/g, "");
      }
      if (data.includes("#")) {
        return data;
      }
      return this.MILLION_FORMAT.format(data);
    } catch (e) {
      console.error(e);
    }
  }

  static numberFormatter(num, decimalsPoints = 2) {
    if (Math.abs(num) >= 1000000000) {
      num = (num / 1000000).toFixed(decimalsPoints).replace(/\.0$/, "") + "m";
    } else if (Math.abs(num) >= 1000000) {
      num = (num / 1000).toFixed(decimalsPoints).replace(/\.0$/, "") + "k";
    }

    num = num.toString();
    let formatter = new Intl.NumberFormat("en-US");
    let numSuffix = num.substr(-1);

    if (num && num.length > 0 && ["k", "m"].includes(numSuffix)) {
      return formatter.format(num.substr(0, num.length - 1)) + numSuffix;
    } else {
      return formatter.format(num);
    }
  }

  static formatWholeNumber(data) {
    try {
      if (data == null || data == undefined || data == "") {
        return "0";
      }
      if (data.includes(",")) {
        data = data.replace(/,/g, "");
      }
      if (data.includes("#")) {
        return data;
      }
      return this.CURRENCY_FORMAT_INTEGER.format(data);
    } catch (e) {
      console.error(e);
    }
  }
  static currencyFormatMillion(data) {
    try {
      if (data == null || data == undefined || data == "") {
        return "0";
      }
      if (data.includes(",")) {
        data = data.replace(/,/g, "");
      }
      if (data.includes("#")) {
        return data;
      }
      if (data >= 100000000.0) {
        data = data / 1000000;
        return this.MILLION_FORMAT.format(data) + "M";
      }
      return this.CURRENCY_FORMAT_INTEGER.format(data);
    } catch (e) {}
  }

  static convertToWholeNumber(map, keys) {
    try {
      keys.forEach((element) => {
        if (
          map[element] != null &&
          map[element] != "" &&
          map[element] != undefined
        ) {
          map[element] = this.formatWholeNumber(map[element] + "");
        }
      });
    } catch (e) {}
  }

  static getPercentageValue(value, total) {
    try {
      if (total === 0) {
        return 0;
      } else {
        let p = this.roundTwoDecimal(
          (parseFloat(value) / parseFloat(total)) * 100
        );
        return p;
      }
    } catch (e) {
      console.error(e);
      return 0;
    }
  }

  static getDateInDDMMMYYYYWithEn(date) {
    if (!date) return "";
    const day = date.toLocaleString("en", { day: "2-digit" });
    const month = date.toLocaleString("en", { month: "short" });
    const year = date.toLocaleString("en", { year: "numeric" });
    return day + "-" + month + "-" + year;
  }

  static getDateInDDMMMYYYY(date) {
    if (!date) return "";
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.toLocaleString("default", { year: "numeric" });
    return day + "-" + month + "-" + year;
  }

  static getDateInYYYYMMDDWithEn(date) {
    if (!date) return "";
    const day = date.toLocaleString("en", { day: "2-digit" });
    const month = date.toLocaleString("en", { month: "2-digit" });
    const year = date.toLocaleString("en", { year: "numeric" });
    return year + "-" + month + "-" + day;
  }

  static getDateInYYYYMMDD(date) {
    if (!date) return "";
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const year = date.toLocaleString("default", { year: "numeric" });
    return year + "-" + month + "-" + day;
  }

  static getDateInMMMYYYY(date) {
    if (!date) return "";
    date = new Date(date);
    const month = date.toLocaleString("default", { month: "2-digit" });
    const year = date.toLocaleString("default", { year: "numeric" });
    return month + "/" + year;
  }
  static getDateInMMYY(date) {
    if (!date) return "";
    date = new Date(date);
    const month = date.toLocaleString("default", { month: "2-digit" });
    const year = date.toLocaleString("default", { year: "2-digit" });
    return month + "/" + year;
  }

  static getDateInUI(date) {
    if (!date) return "";

    let dbDate = new Date(date);

    let day = dbDate.toLocaleString("default", { day: "2-digit" });
    let month = dbDate.toLocaleString("default", { month: "2-digit" });
    let year = dbDate.toLocaleString("default", { year: "numeric" });

    return `${day}/${month}/${year}`;
  }

  static getDateInUIwithTime(date) {
    if (!date) return "";

    let dbDate = new Date(date);
    // let time = dbDate.getTime().toString();
    let hours = dbDate.getHours().toString();
    if (hours.length === 1) {
      hours = "0" + hours;
    }
    let mins = dbDate.getMinutes().toString();
    if (mins.length === 1) {
      mins = "0" + mins;
    }

    let day = dbDate.toLocaleString("default", { day: "2-digit" });
    let month = dbDate.toLocaleString("default", { month: "2-digit" });
    let year = dbDate.toLocaleString("default", { year: "numeric" });

    return `${day}/${month}/${year} ${hours}:${mins}`;
  }

  static tPlusTwoDateCalculator(selectedTradeDate, settlementDays) {
    try {
      let dayCount = 0;
      let tradeDateTime = new Date(selectedTradeDate).getTime();
      while (dayCount !== settlementDays && dayCount < 3) {
        tradeDateTime += 24 * 60 * 60 * 1000;
        if (this.checkForDaysStatus(tradeDateTime)) {
          dayCount++;
        }
      }
      return new Date(tradeDateTime);
    } catch (e) {
      console.error("Exception in tPlusTwoDateCalculator in Utility.", e);
    }
  }
  static checkForDaysStatus(tradeDateTime) {
    let marketStatusResponse = BevUser.marketResponse;
    let holidaysList = marketStatusResponse["HOLIDAYS"];
    let tradeDateTime_day = new Date(tradeDateTime).getDay();
    if (tradeDateTime_day === 6 || tradeDateTime_day === 0) {
      return false;
    } else {
      for (let i in holidaysList) {
        if (this.getDateInYYYYMMDDWithEn(new Date(tradeDateTime)) == i) {
          return false;
        }
      }
    }
    return true;
  }

  static roundTwoDecimal(num) {
    return parseFloat(this.getDoubleStr(num, 2));
  }
  static roundThreeDecimal(num) {
    return parseFloat(this.getDoubleStr(num, 3));
  }
  static toMMYYfromDDMMYYYY(data) {
    if (data == null || data == "" || data == undefined) {
      return data;
    }
    let returnData = "";
    try {
      let dateArr = data.split("/");
      let date = new Date(
        parseInt(dateArr[2], 10),
        parseInt(dateArr[1], 10) - 1,
        parseInt(dateArr[0], 10)
      );
      const month = date.toLocaleString("default", { month: "2-digit" });
      const year = date.toLocaleString("default", { year: "2-digit" });
      returnData = month + "/" + year;
    } catch (e) {
      returnData = data;
    }
    return returnData;
  }

  static isNaNNullEmptyUndefined(val) {
    return (
      val === "" ||
      val === undefined ||
      val === "undefined" ||
      val === "null" ||
      val === null ||
      isNaN(val)
    );
  }

  static isPasswordComplex(password) {
    let strength = 0;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    return strength === 4;
  }
  static ifIsNanReturnZero = (v) => {
    let teV = parseFloat(v);
    return isNaN(teV) ? 0 : teV;
  };

  static checkValid(data) {
    if (data == "" || data == undefined || data == null || data === "null") {
      return false;
    }
    return true;
  }

  static orderDateFormatter(data, hideTime) {
    var x = new Date(data);
    let ye = x.getFullYear();
    let mon = (x.getMonth() + 1).toString();
    let da = x.getDate().toString();
    let hour = x.getHours().toString();
    let min = x.getMinutes().toString();
    hour = hour.length === 1 ? "0" + hour : hour;
    min = min.length === 1 ? "0" + min : min;
    mon = mon.length === 1 ? "0" + mon : mon;
    da = da.length === 1 ? "0" + da : da;
    return hideTime
      ? `${da}/${mon}/${ye}`
      : `${da}/${mon}/${ye} ${hour}:${min}`;
  }

  static numberWithCommas(d) {
    if (d == null || d == undefined) {
      return "";
    }
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  static settingTimeoutForRefreshToken() {
    try {
      let refreshBeforeExpiry = 5;
      let JWTToken = Util.getTradeToken();
      if (JWTToken !== "" && JWTToken !== undefined && JWTToken !== null) {
        let base64Url = JWTToken.split(".")[1];
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        let jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        jsonPayload = JSON.parse(jsonPayload);
        let expTime = parseInt(jsonPayload.exp);
        let jwtExpTime =
          new Date(expTime * 1000).getTime() - refreshBeforeExpiry * 60 * 1000;
        let callbackTime = new Date(jwtExpTime) - new Date();
        setTimeout(() => {
          this.refreshTokensForActiveClients();
        }, callbackTime);
      }
    } catch (excp) {
      console.log(`Exception--------------> `, excp);
    }
  }
  static padTo2Digits(num) {
    try {
      return num.toString().padStart(2, "0");
    } catch (e) {
      console.log("error", e);
      return num;
    }
  }
}

export default Util;
