var schedulingApp = angular.module('schedulingApp', []);

schedulingApp.controller('jobController', function ($scope, $interval) {
    "use strict";
    
    // Job class declaration
    function Job(name, arrivalTime, cycleTime) {
        this.name = name;
        this.arrivalTime = arrivalTime;
        this.cycleTime = cycleTime;
        this.waitingTime = 0;
        this.cyclesDone = 0;
        this.cyclesAllotted = 0;
        
        this.remainingCycles = function () {
            return this.cycleTime - this.cyclesDone;
        };
    }
    
    // Initialize jobs
    $scope.jobs = [
        new Job("A", 0, 16),
        new Job("B", 3, 2),
        new Job("C", 5, 11),
        new Job("D", 9, 6),
        new Job("E", 10, 1),
        new Job("F", 12, 9),
        new Job("G", 14, 4)
    ];
    
    // Initialize stats dictionary
    $scope.statsList = {"fcfs": {"name": "FCFS"}, "sjn": {"name": "SJN"}, "srt": {"name": "SRT"}, "rr": {"name": "RR"}};
    
    // Whether or not to disable the algorithm buttons
    $scope.buttonsDisabled = false;
    
    // Display cancel button?
    $scope.showCancelBtn = false;
    
    // Holds the current running interval
    var running;
    
    // Looks through inactive jobs and activates them when their arrival time
    // is reached
    var activateJobs = function () {
        // We'll work with a copy of the original inactive jobs and loop over that,
        // because we're modifying the original in the forEach loop
        var inactiveJobs = $scope.inactiveJobs.slice(0);
        inactiveJobs.forEach(function (job, index) {
            // If we've hit the jobs arrival time
            if (job.arrivalTime === $scope.currentTime) {
                // Remove the job from the inactive list
                $scope.inactiveJobs.splice(index, 1);
                    
                // Add the job to the end of the waiting list
                $scope.waitingJobs.push(job);
                    
                // Set the background for this job to yellow (waiting)
                job.tableClass = "warning";
                job.status = "Waiting";
            }
                
        });
    };
          
    // Reset all the statistical values
    var resetStats = function() {
        $scope.jobs.forEach(function(job) {
            job.cyclesDone = 0;
            job.waitingTime = 0;
            job.turnaroundTime = "";
            job.tableClass = undefined;
            job.status = "";
            job.finishTime = "";
        });
        
        // Reset statistical values
        $scope.averageWaitingTime = undefined;
        $scope.averageTurnaroundTime = undefined;
    };
    
    // Reset the running status values
    var resetStatus = function() {
        running = undefined;
        $scope.buttonsDisabled = false;
        $scope.inactiveJobs = undefined;
        $scope.waitingJobs = undefined;
        $scope.currentTime = undefined;
        $scope.currentJob = undefined;
    };
    
    var initializeAlgorithm = function (chooseNewJob) {
        // Reset everything
        $scope.cancel(false);
        
        // Show the cancel button
        $scope.showCancelBtn = true;
        
        // Deactivate the algorithm buttons
        $scope.buttonsDisabled = true;
        
        // Waiting jobs (arrived, but are queued) and inactive jobs (not yet arrived) are
        // arrays
        $scope.waitingJobs = [];
        
        // Initally, all jobs are inactive
        // Copy the jobs array to inactiveJobs
        $scope.inactiveJobs = $scope.jobs.slice(0);
        
        // Set all the backgrounds for jobs to red (inactive)
        $scope.inactiveJobs.forEach(function (job) {
            job.tableClass = "danger";
            job.status = "Inactive";
        });
        
        // Start at second "0", the creation time of the scheduler
        // Some jobs may be created alongside the scheduler, so we have to look through
        // the job lists for any arrival times of 0
        // In case any jobs did arrive, we need to choose one as well
        $scope.currentTime = 0;
        activateJobs();
        chooseNewJob();
        
    };
    
    var setCurrentJob = function (job) {
        $scope.currentJob = job;
        
        // Set the background in the table for this job as green (running)
        $scope.currentJob.tableClass = "success";
        $scope.currentJob.status = "Running";
    };
    
    // Unsets the current job. If 'finished', calcualtes the statistics and marks it as done
    // Otherwise, we put it back in the waiting queue
    var unsetCurrentJob = function(finished) {
        if (finished) {
            // Show the stats for this current algorithm
            $scope.currentJob.turnaroundTime = $scope.currentTime - $scope.currentJob.arrivalTime;
            $scope.currentJob.finishTime = $scope.currentTime;
            
            // Set the job background to blue (finished)
            $scope.currentJob.tableClass = "info";
            $scope.currentJob.status = "Finished";
        } else {
            // The job is back in the waiting queue, set it to yellow (waiting)
            $scope.currentJob.tableClass = "warning";
            $scope.currentJob.status = "Waiting";
            $scope.waitingJobs.push($scope.currentJob);
        }
                
        $scope.currentJob = undefined;
    };
    
    var runJobCycle = function() {
        // Perform a cycle for the current job
        $scope.currentJob.cyclesDone++;
            
        // If we finished the job, unload it and calculate turnaround time
        if ($scope.currentJob.cyclesDone === $scope.currentJob.cycleTime) {
            unsetCurrentJob(true);
        }
    };
    
    // All of the algorithms share common functionality in increasing current time, deciding when
    // the algorithm has ended, etc.
    // The only difference is how they choose the next job. So, all algorithms call this base method
    // and pass in the logic for getting the next job
    // Also pass in the stats object to assign to
    var runAlgorithm = function(stats, chooseNewJob) {
        initializeAlgorithm(chooseNewJob);
        
        // Every second...
        running = $interval(function () {
            // Increment the current time
            $scope.currentTime++;
            
            // Go through the inactive jobs and add them to the waiting jobs
            // when they "arrive"
            activateJobs();
            
            // Run a cycle for the current job
            runJobCycle();
            
            // Run logic for choosing a next job
            chooseNewJob(); 
            
            // Check if we're done (no job currently running, no jobs waiting, no jobs yet to arrive)
            if (!$scope.currentJob && $scope.waitingJobs.length === 0 && $scope.inactiveJobs.length === 0) {
                $scope.cancel(true, stats);
            }
            
            // Loop through the waiting jobs queue and increment wait time
            $scope.waitingJobs.forEach(function (job) {
                // Increment the waiting time if it exists, or initialize it
                job.waitingTime++;
            });
            
            
        }, 1000);
    };

    $scope.fcfs = function() {
        runAlgorithm($scope.statsList.fcfs, function() {
            // Check if we have a current job; if we don't, get the first
            // one in the queue (first come first served) or just do nothing if no jobs are available
            if (!$scope.currentJob && $scope.waitingJobs.length > 0) {
                setCurrentJob($scope.waitingJobs.shift());
                return true;
            }
            return false;
        });
    };
    
    $scope.sjn = function() {
        runAlgorithm($scope.statsList.sjn, function() {
            // Check if we have a current job; if we don't, get the one which has the shortest time
            if (!$scope.currentJob && $scope.waitingJobs.length > 0) {
                // If we have only one waiting job, make that the current job
                // Otherwise, we have to choose the one with the shortest job time
                if ($scope.waitingJobs.length === 1) {
                    setCurrentJob($scope.waitingJobs.shift());
                } else {
                    var shortestJobIndex = 0;
                    $scope.waitingJobs.slice(1).forEach(function (job, index) {
                        // If this job's cycle time is less than the current shortest, choose this job
                        if (job.cycleTime < $scope.waitingJobs[shortestJobIndex].cycleTime) {
                            // We have to add one to the index because we sliced the original array
                            // (so element 0 in this array is actually 1 in the original, 
                            // 1 in this is actually 2 in the original, etc.
                            shortestJobIndex = index + 1;
                        }
                    });
                        
                    // Remove the job from the working job set and make it the current job
                    setCurrentJob($scope.waitingJobs.splice(shortestJobIndex, 1)[0]);
                }
            }
        });
    };

    $scope.srt = function() {
        runAlgorithm($scope.statsList.srt, function() {
            // Even if we have a current job, a waiting job can pre-empt it if it has a shorter
            // remaining time
            if ($scope.waitingJobs.length > 0) {
                // If we only have one waiting job, we need to make it the current job if either we have no current job
                // or if the waiting job has SRT than the current job
                if ($scope.waitingJobs.length === 1 && (!$scope.currentJob || $scope.waitingJobs[0].remainingCycles() <
                   $scope.currentJob.remainingCycles())) {
                    
                    // If we have a current job, put it back in the waiting queue
                    // Cool trick: the second statement will only fire here if we have a current job because of
                    // short circuiting of the 'and' operator. This saves us having to write another if statement
                    $scope.currentJob && unsetCurrentJob(false);
                    
                    // Set the waiting job to the current job
                    setCurrentJob($scope.waitingJobs.shift());
                }
                // Otherwise, we have multiple elements: find the one with the shortest remaining time and compare it to the
                // current job
                else {
                    var srtJobIndex = 0;
                    $scope.waitingJobs.slice(1).forEach(function (job, index) {
                            // If this job's rt is less than the current srt, choose it
                            if (job.remainingCycles() < $scope.waitingJobs[srtJobIndex].remainingCycles()) {
                                srtJobIndex = index + 1;
                            }
                    });
                    
                    if (!$scope.currentJob || $scope.waitingJobs[srtJobIndex].remainingCycles() < $scope.currentJob.remainingCycles()) {
                        $scope.currentJob && unsetCurrentJob(false);
                        
                        // Remove this entry from the waiting list and make it the current job
                        setCurrentJob($scope.waitingJobs.splice(srtJobIndex, 1)[0]);
                    }
                }
            }
        });
    };
    
    $scope.rr = function () {
        runAlgorithm($scope.statsList.sjn, function () {
            var timeQuantum = 4;
            if ($scope.currentJob) {
                $scope.currentJob.cyclesAllotted++;
            }
            if ($scope.waitingJobs.length > 0) {
                // If we don't have a current job, get the first one from the queue
                if(!$scope.currentJob) {
                    setCurrentJob($scope.waitingJobs.shift());
                } 
                // Otherwise, we need to check the time allotted to the process in this iteration.
                // If its > timeQuantum, we'll unset this job, put in the back of the queue, and
                // set the next process in the queue as the current job
                else if($scope.currentJob.cyclesAllotted >= timeQuantum) {
                    $scope.currentJob.cyclesAllotted = 0;
                    unsetCurrentJob(false);
                    setCurrentJob($scope.waitingJobs.shift());
                }
            }
        });
    };
    
    // Utility function for calculating the average of an array
    var average = function(a) {
        // First sum up all elements of a
        var sum = a.reduce(function(previous, current) {
            return previous + current;
        });
        
        return sum / a.length;
    };
    
    // Cancels the running algorithm
    // if saveStats is true, will only stop the algorithm but preserve all stats
    // and tally results
    $scope.cancel = function(saveStats, stats) {
        // If an algorithm is running, stop it and clear all variables
        // related to it
        if (angular.isDefined(running)) {
            $interval.cancel(running);
            
            resetStatus();
        
            // Hide the cancel button
            $scope.showCancelBtn = false;
            
            if (!saveStats) {
                // Reset stats for each job
                resetStats();
            } else {
                // Calculate the average times
                var waitingTimes = $scope.jobs.map(function(job) {
                    return job.waitingTime;
                });
                
                var turnaroundTimes = $scope.jobs.map(function(job) {
                    return job.turnaroundTime;
                });
                
                // Set the text output for this algorithm
                $scope.averageWaitingTime = average(waitingTimes).toFixed(2);
                $scope.averageTurnaroundTime = average(turnaroundTimes).toFixed(2);
                
                // Set the output in the algorithm comparison table
                stats.avgWaitTime = $scope.averageWaitingTime;
                stats.avgTurnaroundTime = $scope.averageTurnaroundTime;
            }
        }
    };
});