Scheduling Simulator 2014
=========================
Max Mays and Nickalus Giudice


INTRO
-----
Scheduling Simulator 2014 will fulfill your lifelong dream to visualize different process scheduling algorithms
on a sample data set. It shows, in real time, every step the process scheduler takes as it juggles the various
processes vying for computational time on the CPU.

It was created using node-webkit, a library for creating standalone applications that use HTML, Javascript, and
Node.js. It also uses Angular.js and Bootstrap.

STARTING
--------
Assuming you received a prebundled version, you just need to double click on "scheduling_simulator.exe"

If you didn't (perhaps you cloned this from Github), you need to grab the correct version of the node-webkit binary
for your OS, extract it, and then copy paste all of these files into that folder. Then double click on whatever
binary was extracted to start the application.

LAYOUT
------
The first table shows a list of jobs and various stats associated with them, including the name, cycle time, remaining
cycles, and more. When you run the simulation, each row of the table will be highlighted with a different color: red means
the job has not yet arrived and is inactive, yellow means it is waiting in the queue, green means it is currently running,
and blue means it has finished.

Below the first table is a set of 4 buttons for 4 different process scheduling algorithms. Clicking one of them will
begin the simulation.

Below those buttons are a set of data fields. The two on the left will show the average waiting and turnaround times
of this simulation after it has completed. While the simulation is running, the field on the top right 
will show how much time has elapsed in the simulation, and a button below it will allow you to stop the simulation.

The bottom table will populate with results that contain the average waiting and turnaround times for each algorithm for
easy comparsion after that algorithm has completed.

INSTRUCTIONS
------------
It's simple: just press an algorithm you want to see, and the simulation will start. If you want to stop the simulation
and perhaps choose another algorithm, just press the STOP button. The results for the algorithm will populate in all
the fields mentioned above after the simulation has completed.

LICENSE
-------
See LICENSE.txt