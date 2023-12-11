import Util from "./Util";
//import * as CONSTANTS from "./constants";

class Services {
  static async register(body) {
    let url = process.env.NEXT_PUBLIC_API_BASE_URL + `/register`;
    return Util.postDataToApiGateway(url, body, null);
  }

  static async login(body) {
    let url = process.env.NEXT_PUBLIC_API_BASE_URL + `/login`;
    return Util.postDataToApiGateway(url, body, null);
  }

  static async createCategory(body) {
    let url = process.env.NEXT_PUBLIC_API_BASE_URL + `/category`;
    return Util.postDataToApiGateway(url, body, null);
  }

  static async createExpense(body) {
    let url = process.env.NEXT_PUBLIC_API_BASE_URL + `/expense`;
    return Util.postDataToApiGateway(url, body, null);
  }

  static async getCategories(userToken) {
    let url =
      process.env.NEXT_PUBLIC_API_BASE_URL + `/category?userToken=${userToken}`;
    return Util.getDataFromApiGateway(url, null);
  }

  static async getExpenses(userToken) {
    let url =
      process.env.NEXT_PUBLIC_API_BASE_URL + `/expense?userToken=${userToken}`;
    return Util.getDataFromApiGateway(url, null);
  }

  static async refreshToken(body) {
    let url = process.env.NEXT_PUBLIC_API_BASE_URL + `/refreshToken`;
    return Util.postDataToApiGateway(url, body, null);
  }
}
export default Services;
