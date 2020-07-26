<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Home</title>
        <style>
            body{
    margin:0px;
    padding: 0px;
    background: url('C:/Users/epaysan/Desktop/sumit/student/5.jpg');
    height: 500px;
    width: 1500px;
    -webkit-background-size: cover;
    background-size: cover;
    font-family: Tahoma, sans-serif;
}

*
{
   margin-top: 5px;
   padding: 0;
}

.container a{
    color: white;
}

.container ul{ 
    display: inline-flex;
    margin-left: 0px;
    list-style:none;
}
.container ul li{
    margin-left: 0px;
    background-color: #5C6E58; 
    width : 200px;
    border: 1px solid black;
    height: 50px;
    line-height: 50px;
    text-align: center;
    float: left;
    color: white;
    font-size: 18px;
}

.container ul li:hover{
    background-color: #8AA899;
}

        </style>
    </head>
    <body>
        <div class="container">
            <ul>
                <li>Home</li>
                <li>R&D</li>
                <li>Press Kit</li>
                <li>Product & Services</li>
                <li><a href="login.jsp">Student Portal</a></li>
                <li>Teacher Portal</li>
	        <li>About C-DAC</li>
            </ul>    
        </div>
    </body>
</html>

