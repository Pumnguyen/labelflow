using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;

namespace Thuchanh1
{
    public partial class HocSinh : Form
    {
        SqlConnection conn = new SqlConnection(Properties.Settings.Default.connStr);

        public HocSinh()
        {
            InitializeComponent();
        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void Form1_Load(object sender, EventArgs e)
        {
            try
            {
                conn.Open();
                string sqlStr = string.Format("SELECT *FROM HocSinh");
               
                SqlDataAdapter adapter = new SqlDataAdapter(sqlStr, conn);
                DataTable dtSinhVien = new DataTable();
                adapter.Fill(dtSinhVien);
                gvHsinh.DataSource = dtSinhVien; /// gvHsinh = name cua data gridview
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message);
            }
            finally
            {
                conn.Close();
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                // Ket noi
                conn.Open();
                string sqlStr = string.Format("INSERT INTO HocSinh(Ten , Diachi, CMND) VALUES ('{0}', '{1}', '{2}')", textBox1.Text, textBox2.Text, textBox3.Text);
                SqlCommand cmd = new SqlCommand(sqlStr, conn);
                if (cmd.ExecuteNonQuery() > 0)
                    MessageBox.Show("them thanh cong");
            }
            catch (Exception ex)
            {
                MessageBox.Show("them that bai" + ex);
            }
            finally
            {
                conn.Close();
            }
            Form1_Load(sender, e);
        }

        private void button2_Click(object sender, EventArgs e)
        {
            try
            {
                // Ket noi
                conn.Open();
                string sqlStr = string.Format("DELETE FROM HocSinh WHERE CMND = '{0}'", textBox3.Text);
                SqlCommand cmd = new SqlCommand(sqlStr, conn);
                if (cmd.ExecuteNonQuery() > 0)
                    MessageBox.Show("Xoa thanh cong");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Xoa that bai" + ex);
            }
            finally
            {
                conn.Close();
            }
            Form1_Load(sender, e);
        }

        private void button3_Click(object sender, EventArgs e)
        {
            try
            {
                // Ket noi
                conn.Open();
                string sqlStr = string.Format("UPDATE HocSinh SET Ten = '{0}', DiaChi = '{1}', CMND = '{2}' WHERE CMND = '{2}'", textBox1.Text, textBox2.Text, textBox3.Text);
                SqlCommand cmd = new SqlCommand(sqlStr, conn);
                if (cmd.ExecuteNonQuery() > 0)
                    MessageBox.Show("Cap nhat thanh cong");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Cap nhat that bai" + ex);
            }
            finally
            {
                conn.Close();
            }
            Form1_Load(sender, e);
        }
    }
}
