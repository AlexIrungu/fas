import React, { useState, useRef } from 'react';
import { Calendar, ChevronDown, ChevronRight, X, Download, FileText, Image as ImageIcon } from 'lucide-react';

const GanttChart = () => {
  const [expandedPhases, setExpandedPhases] = useState({
    'PROJECT PERIOD': true,
    'INSTALLATION': true
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const chartRef = useRef(null);

  const tasks = [
    { id: 1, name: 'Project Kick-Off Meeting', start: '2025-08-13', end: '2025-08-13', phase: 'PROJECT PERIOD', color: 'bg-purple-500', progress: 100, assignee: 'Project Manager', notes: 'Initial project kickoff with all stakeholders' },
    { id: 2, name: 'Design', start: '2025-08-14', end: '2025-08-21', phase: 'Design', color: 'bg-blue-500', progress: 100, assignee: 'Design Team', notes: 'Complete fire alarm system design and architecture' },
    { id: 3, name: 'Preliminary Design Review (PDR)', start: '2025-08-14', end: '2025-08-21', phase: 'Design', color: 'bg-blue-400', progress: 100, assignee: 'Design Lead', notes: 'Review and approval of preliminary designs' },
    { id: 4, name: 'Procuring of Imported Materials', start: '2025-09-01', end: '2025-09-10', phase: 'Procurement', color: 'bg-yellow-500', progress: 100, assignee: 'Procurement Team', notes: 'Order and receive imported fire alarm equipment' },
    { id: 5, name: 'Procuring of Local Material', start: '2025-09-25', end: '2025-09-30', phase: 'Procurement', color: 'bg-yellow-400', progress: 100, assignee: 'Procurement Team', notes: 'Source local materials and supplies' },
    { id: 6, name: 'Site Review', start: '2025-10-06', end: '2025-10-21', phase: 'Reviews', color: 'bg-orange-500', progress: 100, assignee: 'Site Manager', notes: 'Physical site assessment and validation' },
    { id: 7, name: 'Critical Design Review (CDR)', start: '2025-10-27', end: '2025-11-05', phase: 'Reviews', color: 'bg-orange-400', progress: 100, assignee: 'Engineering Team', notes: 'Final design review before implementation' },
    { id: 8, name: 'Preparation for FAT', start: '2025-11-10', end: '2025-11-21', phase: 'Testing', color: 'bg-green-500', progress: 100, assignee: 'QA Team', notes: 'Factory Acceptance Test preparation' },
    { id: 9, name: 'FAT Training', start: '2025-11-22', end: '2025-11-28', phase: 'Testing', color: 'bg-green-400', progress: 100, assignee: 'Training Team', notes: 'Team training on equipment and procedures' },
    { id: 10, name: 'Meeting at KPLC', start: '2025-12-16', end: '2025-12-16', phase: 'PROJECT PERIOD', color: 'bg-purple-400', progress: 100, assignee: 'Project Manager', notes: 'Coordination meeting with KPLC stakeholders' },
    { id: 11, name: 'Delivery of Local Materials to Site', start: '2025-12-18', end: '2025-12-18', phase: 'PROJECT PERIOD', color: 'bg-purple-300', progress: 100, assignee: 'Logistics Team', notes: 'Transport materials to installation site' },
    { id: 12, name: 'Cabling and Masonry Work', start: '2026-01-06', end: '2026-01-23', phase: 'Pre-Installation', color: 'bg-indigo-500', progress: 75, assignee: 'Construction Team', notes: 'Infrastructure preparation and cabling' },
    { id: 13, name: 'Installation of Fire Alarm System', start: '2026-01-27', end: '2026-02-13', phase: 'INSTALLATION', color: 'bg-red-500', progress: 45, assignee: 'Installation Team', notes: 'Primary installation of fire alarm system components' },
    { id: 14, name: 'Configuration and Testing', start: '2026-02-17', end: '2026-03-06', phase: 'INSTALLATION', color: 'bg-red-400', progress: 0, assignee: 'Technical Team', notes: 'System configuration and integration testing' },
    { id: 15, name: 'Commissioning', start: '2026-04-01', end: '2026-04-30', phase: 'INSTALLATION', color: 'bg-red-300', progress: 0, assignee: 'Commissioning Team', notes: 'Final system commissioning and handover' }
  ];

  const months = [
    { name: 'Aug', year: '2025', days: 31, startDay: 13 },
    { name: 'Sep', year: '2025', days: 30, startDay: 1 },
    { name: 'Oct', year: '2025', days: 31, startDay: 1 },
    { name: 'Nov', year: '2025', days: 30, startDay: 1 },
    { name: 'Dec', year: '2025', days: 31, startDay: 1 },
    { name: 'Jan', year: '2026', days: 31, startDay: 1 },
    { name: 'Feb', year: '2026', days: 28, startDay: 1 },
    { name: 'Mar', year: '2026', days: 31, startDay: 1 },
    { name: 'Apr', year: '2026', days: 30, startDay: 1 }
  ];

  const projectStart = new Date('2025-08-13');
  const projectEnd = new Date('2026-04-30');
  const totalDays = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24));

  const calculateOverallProgress = () => {
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };

  const getTaskPosition = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startOffset = Math.ceil((startDate - projectStart) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    };
  };

  const phases = [...new Set(tasks.map(t => t.phase))];

  const togglePhase = (phase) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  const today = new Date();
  const todayOffset = Math.ceil((today - projectStart) / (1000 * 60 * 60 * 24));
  const todayPosition = `${(todayOffset / totalDays) * 100}%`;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return days === 1 ? '1 day' : `${days} days`;
  };

  const exportToPDF = () => {
    window.print();
  };

  const exportToImage = () => {
    // Load html2canvas from CDN if not already loaded
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => captureAndDownload();
      document.head.appendChild(script);
    } else {
      captureAndDownload();
    }
  };

  const captureAndDownload = () => {
    const element = chartRef.current;
    window.html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'fire-alarm-gantt-chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(error => {
      alert('Export failed. Please try again.');
    });
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-6" ref={chartRef}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="text-red-600" />
              Project Work Schedule
            </h1>
            <p className="text-gray-600 mt-1">KP1/9A.2/OT/044/SS/24-25 - Fire Alarm System Installation</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Overall Progress</div>
              <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Export to PDF"
              >
                <FileText size={18} />
                PDF
              </button>
              <button
                onClick={exportToImage}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Export to Image"
              >
                <ImageIcon size={18} />
                PNG
              </button>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-6 bg-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Project Progress</span>
            <span className="text-sm text-gray-600">{overallProgress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getProgressColor(overallProgress)}`}
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Task List */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-gray-100 p-3 font-semibold text-gray-700 rounded-t">
              Activities
            </div>
            <div className="border border-gray-200 rounded-b">
              {phases.map((phase, idx) => (
                <div key={idx}>
                  <div 
                    className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => togglePhase(phase)}
                  >
                    {expandedPhases[phase] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span className="font-semibold text-sm text-gray-700">{phase}</span>
                  </div>
                  {expandedPhases[phase] && tasks.filter(t => t.phase === phase).map(task => (
                    <div 
                      key={task.id} 
                      className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="text-sm text-gray-600 pl-8">{task.name}</div>
                      <div className="mt-2 pl-8">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(task.progress)}`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="flex-1 overflow-x-auto">
            <div className="min-w-max">
              {/* Timeline Header */}
              <div className="flex bg-gray-100 border border-gray-200 rounded-t">
                {months.map((month, idx) => (
                  <div key={idx} className="flex-1 p-2 text-center border-r border-gray-300 last:border-r-0">
                    <div className="font-semibold text-sm text-gray-700">{month.name} {month.year}</div>
                  </div>
                ))}
              </div>

              {/* Chart Area */}
              <div className="border border-gray-200 border-t-0 rounded-b relative bg-white" style={{ minHeight: '600px' }}>
                {/* Grid Lines */}
                <div className="absolute inset-0 flex">
                  {months.map((month, idx) => (
                    <div key={idx} className="flex-1 border-r border-gray-200 last:border-r-0"></div>
                  ))}
                </div>

                {/* Today Line */}
                {todayOffset >= 0 && todayOffset <= totalDays && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                    style={{ left: todayPosition }}
                  >
                    <div className="absolute -top-6 left-0 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Today
                    </div>
                  </div>
                )}

                {/* Tasks */}
                <div className="relative">
                  {phases.map((phase, phaseIdx) => (
                    <div key={phaseIdx}>
                      <div className="h-10 border-b border-gray-100 bg-gray-50"></div>
                      {expandedPhases[phase] && tasks.filter(t => t.phase === phase).map(task => {
                        const pos = getTaskPosition(task.start, task.end);
                        return (
                          <div key={task.id} className="h-16 border-b border-gray-100 relative">
                            <div 
                              className={`absolute ${task.color} text-white text-xs px-3 py-1 rounded shadow-md top-1/2 transform -translate-y-1/2 hover:shadow-lg transition-all cursor-pointer hover:scale-105`}
                              style={{ left: pos.left, width: pos.width }}
                              onClick={() => setSelectedTask(task)}
                            >
                              <div className="truncate font-medium mb-1">{task.name}</div>
                              <div className="bg-white bg-opacity-30 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-white h-full transition-all"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Project Milestones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Design</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Procurement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Testing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-500 rounded"></div>
            <span>Pre-Installation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Installation</span>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTask(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Task Details</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{selectedTask.name}</h3>
                <span className={`inline-block px-3 py-1 ${selectedTask.color} text-white text-sm rounded-full`}>
                  {selectedTask.phase}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Start Date</div>
                  <div className="font-semibold text-gray-800">{formatDate(selectedTask.start)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">End Date</div>
                  <div className="font-semibold text-gray-800">{formatDate(selectedTask.end)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Duration</div>
                  <div className="font-semibold text-gray-800">{calculateDuration(selectedTask.start, selectedTask.end)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Assigned To</div>
                  <div className="font-semibold text-gray-800">{selectedTask.assignee}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2">Progress</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all ${getProgressColor(selectedTask.progress)}`}
                      style={{ width: `${selectedTask.progress}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-lg text-gray-800">{selectedTask.progress}%</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Notes</div>
                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedTask.notes}</div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className={`w-3 h-3 rounded-full ${
                  selectedTask.progress === 100 ? 'bg-green-500' :
                  selectedTask.progress > 0 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {selectedTask.progress === 100 ? 'Completed' :
                   selectedTask.progress > 0 ? 'In Progress' : 'Not Started'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          ${chartRef.current && `
            #chart-container, #chart-container * {
              visibility: visible;
            }
            #chart-container {
              position: absolute;
              left: 0;
              top: 0;
            }
          `}
        }
      `}</style>
    </div>
  );
};

export default GanttChart;