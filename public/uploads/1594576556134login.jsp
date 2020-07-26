<%@page contentType="text/html" pageEncoding="UTF-8"%>
<html lang="en">
<head>
    <meta charset="UTF-8">
<title>Registration Form</title>
<style>
body
 {
  margin:0px;
  padding: 0px;
  background: url('C:/Users/epaysan/Desktop/sumit/student/8.jpg');
  background-repeat: no-repeat;
  height:700px;
  width: 400px;
  display: block;
  -webkit-background-size: cover;
  background-size: cover;
  margin-bottom: 0;
  font-family: Tahoma, sans-serif;
}

*
{
  box-sizing: border-box;
  margin:0px;
  padding:0px;
}

.login{
    position: relative;
    top: 50%;
    left: 55%;
    margin-left: 600px;
    padding: 0;
    transform: translate(-50%,-50%);
    width:650px;
    height: 400px;
    box-sizing: border-box;
    background: rgba(0,0,0,0.5);
    padding: 20px;
}

.login p{
    margin-top: 30px;
    padding:0 0 0px;
    font-weight: bold;
    color:#ffffff;
}
::placeholder{
	color: #ffffff;
}

.login input[type=text],
.login input[type=password]
{
    border: none;
    border-bottom: 1px solid #ffffff;
    background-color: transparent;
    outline: none;
    height: 40px;
    width: 300px;
    color: #ffffff;
    display: 16px;
}
.login a{
    color: #33A4FF;
    font-size: 15px;
    font-weight: bold;
    margin-left: 200px;
}
h1{
	margin: 0;
	padding: 0;
	font-weight: bold;
	color: #ffffff;
}
.login input[type=submit]
{
    border: none;
    height: 40px;
    width: 200px;
    outline: none;
    color: #ffffff;
    font-size: 15px;
    margin-left: 50px;
    background-color: tomato;
    cursor: pointer;
    border-radius: 20px;
}
.login input[type=submit]:hover{
    background-color: cyan;
    color: #ffffff;
}

.login:hover{
    box-shadow:  0px 0px 40px 16px rgba(18, 18, 18,1.00);
}

</style>
</head>
<body>
<div class="login">
    <h1>LOGIN</h1>
    <form action="logindata" method="post" >  
	<p>Enroll id</p>
             <input type="text" id="" name="enroll" placeholder="Enter your enroll id">
	
        <p>Password</p>
            <input type="password" id="" name="password" placeholder="Enter your password" >
            <p>
		<input type="submit" value="Submit">
                <input type="submit" value="Back" ></p><p></p></form></div>
        
</body>
</html>