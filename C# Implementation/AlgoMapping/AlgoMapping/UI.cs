using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace AlgoMapping
{
    public partial class UI : Form
    {
        string[] courses; // string of courses that contains course
        string[] instructors; //string of instructors with instructor id
        string[] topics; //string of topics
        string[] coursetopicpercent;
        string[] topicprofskill;

        int[,] coursetopics;
        int[,] topicinstructors;
        int[,] professorcourse;
        bool[] taken;


        public UI()
        {
            InitializeComponent();
 	    
	    // Reading data from files that were generated for project
            
	    courses = File.ReadAllLines(@"../../Data/courses.txt");
            instructors = File.ReadAllLines(@"../../Data/instructors.txt");
            topics = File.ReadAllLines(@"../../Data/topics.txt");
            coursetopicpercent = File.ReadAllLines(@"../../Data/coursetopicpercent.txt");
            topicprofskill = File.ReadAllLines(@"../../Data/topicprofskill.txt");

            coursetopics = new int[courses.Length, topics.Length];
            topicinstructors = new int[topics.Length, instructors.Length];
            professorcourse = new int[instructors.Length, courses.Length];
            taken = new bool[courses.Length];
        }
		
		//return the maximum column for a professor
        private int maxColumn(int[,] profCourseArray, int colIndex,int rowLength)
        {
			
            int max = 0;
            int maxIndex = -1;
            
			
			//loop to go thru all rows and select the max from it
            for (int x = 0; x < rowLength; x++)
            {
                if (profCourseArray[colIndex - 1, x] > max && !checkTaken(x))
                {
                    max = profCourseArray[colIndex - 1, x];
                    maxIndex = x;
                }
            }
            if (maxIndex != -1)
                taken[maxIndex] = true;

            return maxIndex;
        }

		
		
		// return boolean to check whether a course is taken by a professor or not
        private bool checkTaken(int courseIndex)
        {
            return taken[courseIndex] == true;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            foreach (string topicprof in topicprofskill)
            {
		//tokenizing the Expertise data from the file

                string[] tokens = topicprof.Split('\t');
                topicinstructors[ Int32.Parse(tokens[0]) - 1,Int32.Parse(tokens[1]) - 1] = Int32.Parse(tokens[2]);
            }

            foreach (string ctopperc in coursetopicpercent)
            {
		//tokenizing the Percentage data from the file

                string[] tokens = ctopperc.Split('\t');
                coursetopics[Int32.Parse(tokens[0]) - 1, Int32.Parse(tokens[1]) - 1] = Int32.Parse(tokens[2]);
            }

            for (int x = 0; x < courses.Length; x++)
            {
                for (int y = 0; y < instructors.Length; y++)
                {
                    int relevance = 0;

                    for (int z = 0; z < topics.Length; z++)
                    {
			//Checking the relevance

                        relevance = relevance + (coursetopics[x,z] * topicinstructors[z,y]);
                    }

                    professorcourse[y,x] = relevance;
                }
            }


            for(int y = 1; y <= 2; y++)
            {
                for (int x = 1; x <= instructors.Length; x++)
                {
                    int proOut = maxColumn(professorcourse, x, courses.Length);

                    Console.WriteLine(instructors[x - 1].ToString());

                    if (proOut != -1)
                    {
                        Console.WriteLine(courses[proOut]);
                    }
                }
            }

            

        }
    }
}
        