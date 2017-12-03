fs = require('fs');
util = require('util');
express = require('express');

var courses = '';
var instructors = '';
var topics = '';
var coursetopicpercent = '';
var topicprofskill = '';


data = fs.readFileSync('data/courses.txt','utf8');
array = data.toString().split("\r\n");
courses = array;


data = fs.readFileSync('data/instructors.txt','utf8');
array = data.toString().split("\r\n");
instructors = array;


data = fs.readFileSync('data/topics.txt','utf8');
array = data.toString().split("\r\n");
topics = array;

data = fs.readFileSync('data/coursetopicpercent.txt','utf8');
array = data.toString().split("\r\n");
coursetopicpercent = array;

data = fs.readFileSync('data/topicprofskill.txt','utf8');
array = data.toString().split("\r\n");
topicprofskill = array;

var coursetopics = new Array(courses.length);
var topicinstructors = new Array(topics.length);
var professorcourse = new Array(courses.length);
var taken = new Array(courses.length);

var professorOutputs = new Array(2);
for(let x=0;x<2;x++){
	professorOutputs[x] = new Array(instructors.length);
	for(let y=0;y<instructors.length;y++){
		professorOutputs[x][y] = '';
	}
}

var finalOutput = [];

for(let x=0;x<courses.length;x++)
{
		coursetopics[x] = new Array(topics.length);
		for(y=0;y<topics.length;y++)
		{
			coursetopics[x][y] = 0;
		}
}

for(let x=0;x<topics.length;x++)
{
		topicinstructors[x] = new Array(instructors.length);
		for(y=0;y<instructors.length;y++)
		{
			topicinstructors[x][y] = 0;
		}
}

for(let x=0;x<instructors.length;x++)
{
		professorcourse[x] = new Array(courses.length);
}

for(let x=0;x<taken.length;x++)
{
	taken[x] = false;
}

function maxColumn( profCourseArray,  colIndex, rowLength)
{
			max = 0;
            maxIndex = -1;
            

            for (let x = 0; x < rowLength; x++)
            {
                if (profCourseArray[colIndex][x] > max && !checkTaken(x))
                {
                    max = profCourseArray[colIndex][x];
                    maxIndex = x;
                }
            }
			
            if (maxIndex != -1)
                taken[maxIndex] = true;

            return maxIndex;
};


function checkTaken(courseIndex)
{
	return taken[courseIndex] == true;
};


for (topicprof in topicprofskill)
{
	tokens = topicprofskill[topicprof].split('\t');
	topicinstructors[parseInt(tokens[0]) - 1][parseInt(tokens[1]) - 1] = parseInt(tokens[2]);
}


for (ctopperc in coursetopicpercent)
{
	tokens = coursetopicpercent[ctopperc].split('\t');
	coursetopics[parseInt(tokens[0]) - 1][ parseInt(tokens[1]) - 1] = parseInt(tokens[2]);
}


for (let x = 0; x < courses.length; x++)
{
	for (let y = 0; y < instructors.length; y++)
	{
		relevance = 0;

		for (let z = 0; z < topics.length; z++)
		{
			relevance = relevance + (coursetopics[x][z] * topicinstructors[z][y]);
		}

		professorcourse[y][x] = relevance;
	}
}
	
for(let k=0;k<2;k++){
  for (let x = 0; x < instructors.length; x++)
	{
		proOut = maxColumn(professorcourse, x, courses.length);
		
		if(professorOutputs[0][x] == '')
		{
			professorOutputs[0][x] = proOut;
		} else if(professorOutputs[1][x] == ''){
			professorOutputs[1][x] = proOut;
		}
		
		if (proOut != -1)
		{
			console.log(courses[proOut]);
		}
	}
}



for(let x=0;x<instructors.length;x++){
	
	var tempObj = {
		
		'professorName':instructors[x],
		'course1':courses[professorOutputs[0][x]],
		'course2':courses[professorOutputs[1][x]],
		'relevance1':professorcourse[x][professorOutputs[0][x]],
		'relevance2':professorcourse[x][professorOutputs[1][x]]
		
	};
	
	finalOutput[x] = tempObj;
	
	
}



app = express();
app.get('/',function(req,res){
	
	res.sendFile('index.html', { root: __dirname });
	
});


app.get('/data',function(req,res){
	
	res.send(finalOutput);
	
});

app.listen(3000);