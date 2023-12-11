import mysql from "mysql2/promise";

let mysqlPool;
export const handler = async (event,context,callback) => {
  
  // mysql connection
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
  
    
  let userInfo = JSON.parse(event.body);
  console.log(userInfo)
  let isUserExists = await mysqlPool.query('select email,user_id from budget_users where token = ?',
  [userInfo.userToken]);
  
  isUserExists = isUserExists[0] || [];
  
  if(isUserExists.length == 0){
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        loginSuccess: false,
        message:"Invalid Credentials",
      }),
      headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": false,
      }
    };
  
    return context.succeed(response);
  }
  
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";

   for (let i = 0; i <= 11; i++) {
     let randomNumber = Math.floor(Math.random() * chars.length);
     token += chars.substring(randomNumber, randomNumber +1);
  }

  let updateUser = `update budget_users set token = ?,token_expire = DATE_ADD(now(), INTERVAL 30 MINUTE) where user_id = ?`;
                      
  await mysqlPool.query(updateUser,[token,isUserExists[0]['user_id']]);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      loginSuccess: true,
      message:"User Login successfull",
      userToken:token,
      tokenExpiresIn: 60
    }),
    headers:{
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false,
    }
  };
  
  return context.succeed(response);
  
};
