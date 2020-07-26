package Browsermanagement;
import javax.swing.*;  
import java.awt.*;  
import java.awt.event.*; 
import java.sql.*;
  
public class Signup extends JFrame implements ActionListener,ItemListener   
{  
    JLabel l1, l2, l3, l4,l5,l6,lq,la;  
    JTextField tf1,tf2;  
    JButton submit, clear,login;  
    JPasswordField p1, p2;
    String uname,pwd,ques;
    JComboBox jc;
    Signup()  
    {  
        setVisible(true);  
        setSize(800, 800);  
        setLayout(null);  
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);  
        setTitle("Signup");  
        JLabel back=new JLabel(new ImageIcon("C:\\Users\\sumit\\Documents\\NetBeansProjects\\Browser_management\\src\\Browsermanagement\\download.jpg"));
        l1 = new JLabel("Signup");  
        l1.setForeground(Color.blue);  
        l1.setFont(new Font("Arial", Font.BOLD, 20));  
        l2 = new JLabel("User Name:");  
        l3 = new JLabel("Enter Passowrd:");  
        l4 = new JLabel("Confirm Password:");  
        lq=new JLabel("Question");
        la=new JLabel("Answer");
        tf1 = new JTextField();
        tf2 = new JTextField();
        
        p1 = new JPasswordField();  
        p2 = new JPasswordField();  
        
        String[] q = {"Pet name","Hobby","Favorite song","Favorite car"};
        jc=new JComboBox(q);
        jc.addItemListener(this);
        submit = new JButton("Submit");  
        clear = new JButton("Clear");
        login=new JButton("Login");
        
        submit.addActionListener(this);  
        clear.addActionListener(this);  
        login.addActionListener(this);
        
        l1.setBounds(80, 70, 200, 30);
        l2.setBounds(80, 110, 200, 30);  
        l3.setBounds(80, 150, 200, 30);  
        l4.setBounds(80,190,200,30);  
        lq.setBounds(80,230,200,30);
        la.setBounds(80,270,200,30);
        tf1.setBounds(300,110,200,30);
        jc.setBounds(300,230,200,30);
        tf2.setBounds(300,270,200,30);
        p1.setBounds(300,150,200,30);  
        p2.setBounds(300,190,200,30);    
        submit.setBounds(120, 320, 100, 30);  
        clear.setBounds(220, 320, 100, 30);  
        login.setBounds(320, 320, 100, 30); 
        
        add(l1);
        add(l2);  
        add(lq);
        add(la);
        add(tf1);
        add(tf2);
        add(jc);
        add(l3);  
        add(p1);  
        add(l4);  
        add(p2);
        add(submit);  
        add(clear);     
        add(login);
        add(back);
        setVisible(true);
    }  
       public void itemStateChanged(ItemEvent e) {
        if(e.getSource()==jc)
        {
          ques=(String)jc.getSelectedItem();
        }
    }
    public void actionPerformed(ActionEvent e)   
    {  
        String valid = "^.*(?=.{8,16})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$";
        
        String uname=tf1.getText();
        char[] pass=p1.getPassword();
        char[] confirm=p2.getPassword();
        String ans=tf2.getText();
        String s1=new String(pass);
        String s2=new String(confirm);
       if(e.getSource()==submit)
        {
           if(uname.length()==0 )
           {
            l5=new JLabel("Please enter a user name or id");
            l5.setBounds(300,20,200,30);
            l5.setFont(new Font("Arial", Font.BOLD, 15));  
            l5.setForeground(Color.red);
            add(l5);
           }
           else
            {
                if(s1.equals(s2) && s1.matches(valid))
            {
         try  
                {  
                   
                    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/Browser","root","S@ndy2892");  
                    PreparedStatement ps = con.prepareStatement("insert into Signup values(?,?,?,?)");  
                    ps.setString(1, uname);  
                    ps.setString(2, s1);  
                    ps.setString(3, ques);
                    ps.setString(4, ans);
                    ps.executeUpdate();  
                        
               con.close(); 
               JOptionPane.showMessageDialog(this,"Signup Successfully");
                       tf1.setText("");
                       tf2.setText("");
                       
                       p1.setText("");
                       p2.setText("");
                }  
                catch (Exception ex)   
                {     
                     JOptionPane.showMessageDialog(this,"Id already taken");
                      tf1.setText("");
                       tf2.setText("");
                        p1.setText("");
                       p2.setText("");
                       System.out.println(ex);
                }  
         }
         else
         {
             
            JOptionPane.showMessageDialog(null,"Please check your Password and type Again");
            p1.setText("");
            p2.setText("");
              tf2.setText("");
                      }
             remove(l5);
            }
           
          }   
          else if(e.getSource()==clear) 
          {  
            
            tf1.setText("");   
              tf2.setText("");
                      
            p1.setText("");  
            p2.setText("");  
          }  
       else
          {
            new Login();
            setVisible(false);
          }
        }
     
    public static void main(String args[])  
    {  
        new Signup();  
    }  
} 
