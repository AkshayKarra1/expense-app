import mysql from "mysql2/promise";

let mysqlPool;


export const handler = async (event,context) => {

  if(typeof mysqlPool == "undefined"){
    let databaseConfig = {
      user: 'admin',
      host: 'budget-app.cjm7xxegcouw.us-east-2.rds.amazonaws.com',
      database: 'budget',
      password: 'Test123456789',
      connectionLimit: 1,
      waitForConnections: true,
      queueLimit: 0
    };

  
    try {
      mysqlPool = mysql.createPool(databaseConfig);
      console.log("Created fresh mysql pool.");
    } catch (e) {
      mysqlPool = undefined;
      throw e;
    }
  }
  
  let userToken = event.queryStringParameters.userToken;
  
  let isValidToken = await mysqlPool.query(`select user_id, email from budget_users where token = ? limit 1;`,[userToken]);
  isValidToken = isValidToken[0] || []
  
  if(isValidToken.length == 0){
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        data: {
          chartData:[]
        },
        message:"User token expired. Login again",
      }),
      headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": false,
      }
    };
  
    return context.succeed(response);
  }
  
  
  let query = `select category_id as id, category as category from budget_categories where user_id = ? order by category`;   
  let categoryList = await mysqlPool.query(query,[isValidToken[0]['user_id']])
  categoryList = categoryList[0] || [];
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      data: categoryList,
    }),
    headers:{
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false,
    }
  };
  
  // callback(null, response);
  return context.succeed(response);
};
