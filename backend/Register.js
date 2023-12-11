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
  
  let isUserExists = await mysqlPool.query('select email from budget_users where email = ?',[userInfo.email.toLowerCase().trim()])
  isUserExists = isUserExists[0] || [];
  
  if(isUserExists.length > 0){
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        loginSuccess: false,
        message:"Email already exists",
        userToken:token,
      }),
      headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": false,
      }
  };
  
  // callback(null, response);
  return context.succeed(response);
  }
  
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";

   for (let i = 0; i <= 11; i++) {
     let randomNumber = Math.floor(Math.random() * chars.length);
     token += chars.substring(randomNumber, randomNumber +1);
  }

  let insertUser = `insert into budget_users(first_name,last_name,email,password,token,token_expire) 
                      values(?,?,?,?,?,DATE_ADD(now(), INTERVAL 1 MINUTE))`;
                      
  await mysqlPool.query(insertUser,
    [ userInfo.firstName,
      userInfo.lastName,
      userInfo.email.toLowerCase().trim(),
      userInfo.password,
      token
      ]);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      loginSuccess: true,
      message:"User created successfully",
      userToken:token,
    }),
    headers:{
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false,
    }
  };
  
  // callback(null, response);
  return context.succeed(response);
  
};
