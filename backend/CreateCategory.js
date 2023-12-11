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
    
  let category = JSON.parse(event.body);
  
  let isValidToken = await mysqlPool.query(`select user_id, email from budget_users where token = ? limit 1;`,[category.userToken]);
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
    
    
  let isCategoryExists = await mysqlPool.query('select category from budget_categories where lower(category) = ? and user_id = ?',[category.category.toLowerCase().trim(), isValidToken[0]['user_id']])
  isCategoryExists = isCategoryExists[0] || [];
  
  if(isCategoryExists.length > 0){
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        message:"Category already exists",
      }),
      headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": false,
      }
    }
    
    return context.succeed(response);
  }
                      
  await mysqlPool.query(`insert into budget_categories(user_id, category) values(?,?)`,[ isValidToken[0]['user_id'], category.category.trim()]);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message:"Category created successfully",
    }),
    headers:{
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false,
    }
  };
  
  // callback(null, response);
  return context.succeed(response);
};
