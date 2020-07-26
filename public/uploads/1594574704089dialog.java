package Browsermanagement;
import javax.swing.*;  
import java.awt.*;  
import java.awt.event.*;  
 
public class dialog extends JFrame implements ActionListener 
{  
                JDialog dail = new JDialog(this, "dialog Box");
                JLabel l = new JLabel("Your Password has been changed! To continue press Login..."); 
		JButton b = new JButton("Login"); 
                dialog(){
                l.setBounds(50,50,500,50);
		b.setBounds(100,150,100,30);
            	b.addActionListener(this);
		JPanel p = new JPanel(new BorderLayout()); 
		p.add(b); 
            	p.add(l); 
            	dail.add(p);
                dail.setSize(600, 300); 
                dail.setVisible(true);
                add(p);
                
                }  
    public void actionPerformed(ActionEvent e)  
    {  
        new Login();
	setVisible(false);
    }
    public static void main(String args[])  
    {  
        new dialog();  
    }  
}  
