Scheduling Simulator 2014
=========================
Max Mays and Nickalus Giudice


INTRO
-----
Scheduling Simulator 2014 will fulfill your lifelong dream to visualize different process scheduling algorithms
on a sample data set. It shows, in real time, every step the process scheduler takes as it juggles the various
processes vying for computational time on the CPU.

STARTING
--------
Run scheduling_simulator.exe

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