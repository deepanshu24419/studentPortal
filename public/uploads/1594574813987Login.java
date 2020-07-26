package Browsermanagement;
import javax.swing.*;  
import java.awt.*;  
import java.awt.event.*;
import java.sql.*;

public class Login extends JFrame  implements ActionListener 
{  
    JLabel l1, l2, l3;  
    JTextField tf1;  
    JButton Login, Signup,Forget;  
    JPasswordField p1;
     Login()  
    {  
        setVisible(true);  
        setSize(700, 700);  
        setLayout(null);  
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);  
        setTitle("Login");  
        l1 = new JLabel("User Name:");  
        l2 = new JLabel("Enter Passowrd:");  
        tf1 = new JTextField();  
        p1 = new JPasswordField();  
        Login= new JButton("Login");  
        Signup = new JButton("SignUp");
	Forget = new JButton("Forget Password");  
        Login.addActionListener(this);  
        Signup.addActionListener(this);  
        Forget.addActionListener(this); 
        l1.setBounds(50, 70, 200, 30);  
        l2.setBounds(50, 140, 200, 30);   
        tf1.setBounds(300, 70, 200, 30);  
        p1.setBounds(300, 150, 200, 30);  
        Login.setBounds(50, 220, 100, 30);  
        Signup.setBounds(170, 220, 100, 30);  
	Forget.setBounds(290, 220, 200, 30);  
        add(l1);  
        add(l2);  
        add(tf1);    
        add(p1);  
        add(Login);  
        add(Signup); 
	add(Forget);  
    }  
    public void actionPerformed(ActionEvent e)  
    {  
          if (e.getSource() == Login)  
         {  
               try  
                {  
                    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/Browser","root","S@ndy2892");  
                    PreparedStatement ps = con.prepareStatement("SELECT `Username`, `password` FROM `Signup` WHERE `username` = ? AND `password` = ?");  
                    ps.setString(1, tf1.getText());  
                    ps.setString(2, String.valueOf(p1.getPassword()));  
                       ResultSet result = ps.executeQuery();             
                    
                    if(result.next()){
                   JOptionPane.showMessageDialog(this," Login Successfull ");
                   if (JOptionPane.OK_OPTION == 0) {
                    setVisible(false);
                       new Browselect();
}
                    }
                    else{
                    JOptionPane.showMessageDialog(this," Not Valid ");
                    }
                      con.close(); 
                }  
                catch (Exception ex)   
                {  
                    System.out.println(ex);  
                } 
         }      
	else if(e.getSource() == Signup)  
          {      
                new Signup();
		setVisible(false);   
          }  
          else 
          {  
            new forget();
	    setVisible(false); 
          }  
    }
    public static void main(String args[])  
    {  
        new Login();  
    }  
}  