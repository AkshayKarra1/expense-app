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
  
  let userToken = decodeURIComponent(event.queryStringParameters.userToken);
  
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
    
  //let userInfo = JSON.parse(event.body);
  
  let query= `select  ue.category_id,bc.category,sum(ue.amount) as amount
                from  user_expenses ue 
                      inner join budget_categories bc on bc.category_id = ue.category_id
                where ue.user_id = ?
                group by category_id, category;`;
                
  let expenses = await mysqlPool.query(query,[isValidToken[0]['user_id']])
  expenses = expenses[0] || [];
  
  let chartData = [["Category", "Amount"]];
  expenses.forEach(item=>{
    chartData.push([item.category,parseFloat(item.amount)])
  })

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      data: {
        chartData:chartData
      },
      message:"successfull",
    }),
    headers:{
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false,
    }
  };
  
  // callback(null, response);
  return context.succeed(response);
  
};
