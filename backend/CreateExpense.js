import mysql from "mysql2/promise";

let mysqlPool;

function getMYSQLFormatDate(date) {
  const tDate = new Date(date);
  const month = tDate.getMonth() + 1;
  return tDate.getFullYear() + "-" + month + "-" + tDate.getDate();
}


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
  
    
  let expense = JSON.parse(event.body);

  console.log(expense);

  let isValidToken = await mysqlPool.query(`select user_id, email from budget_users where token = ? limit 1;`,[expense.userToken]);
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
  

  let insertExpense = `insert into user_expenses(category_id,user_id,amount,last_update) 
                      values(?,?,?,?)`;
                      
  await mysqlPool.query(insertExpense,
    [ expense.category,
      isValidToken[0]['user_id'],
      expense.amount,
      getMYSQLFormatDate(expense.expenseDate)
      ]);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message:"Expense Created",
    }),
    headers:{
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": false,
    }
  };
  
  return context.succeed(response);
  
};
