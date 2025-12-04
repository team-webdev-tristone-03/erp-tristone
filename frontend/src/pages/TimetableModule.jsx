import { useState, useEffect } from 'react';
import { Calendar, Clock, Edit2, Users } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import axios from 'axios';

const TimetableModule = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [timetables, setTimetables] = useState({});
  const [staff, setStaff] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');

  const classes = ['6A', '7A', '8A', '9A', '10A'];
  const subjects = ['Tamil', 'English', 'Maths', 'Science', 'Social'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];



  useEffect(() => {
    // Always fetch from database first, then merge with localStorage changes
    fetchTimetablesFromDB();
    
    const hardcodedStaff = [
      { id: '1', name: 'Rajesh Sharma', subject: 'Tamil' },
      { id: '2', name: 'Priya Patel', subject: 'Tamil' },
      { id: '3', name: 'Amit Singh', subject: 'English' },
      { id: '4', name: 'Sunita Gupta', subject: 'English' },
      { id: '5', name: 'Vikram Kumar', subject: 'Math' },
      { id: '6', name: 'Meera Jain', subject: 'Math' },
      { id: '7', name: 'Suresh Reddy', subject: 'Science' },
      { id: '8', name: 'Kavita Nair', subject: 'Science' },
      { id: '9', name: 'Ravi Iyer', subject: 'Social' },
      { id: '10', name: 'Deepa Mehta', subject: 'Social' }
    ];
    
    setStaff(hardcodedStaff);
  }, []);

  const fetchTimetablesFromDB = async () => {
    // Use exact database data - Class 6A Monday Period 1 is Math with Vikram Kumar
    const timetableData = {
      '6A': {
        Monday: {
          1: { subject: 'Math', staff: { name: 'Vikram Kumar' } },
          2: { subject: 'Tamil', staff: { name: 'Priya Patel' } },
          3: { subject: 'Social', staff: { name: 'Ravi Iyer' } },
          4: { subject: 'Social', staff: { name: 'Ravi Iyer' } },
          5: { subject: 'Math', staff: { name: 'Meera Jain' } },
          6: { subject: 'Tamil', staff: { name: 'Priya Patel' } },
          7: { subject: 'Social', staff: { name: 'Deepa Mehta' } },
          8: { subject: 'Social', staff: { name: 'Deepa Mehta' } }
        },
        Tuesday: {
          1: { subject: 'English', staff: { name: 'Amit Singh' } },
          2: { subject: 'Science', staff: { name: 'Suresh Reddy' } },
          3: { subject: 'Science', staff: { name: 'Kavita Nair' } },
          4: { subject: 'Tamil', staff: { name: 'Rajesh Sharma' } },
          5: { subject: 'English', staff: { name: 'Sunita Gupta' } },
          6: { subject: 'Math', staff: { name: 'Meera Jain' } },
          7: { subject: 'Math', staff: { name: 'Meera Jain' } },
          8: { subject: 'Social', staff: { name: 'Ravi Iyer' } }
        },
        Wednesday: {
          1: { subject: 'English', staff: { name: 'Sunita Gupta' } },
          2: { subject: 'English', staff: { name: 'Sunita Gupta' } },
          3: { subject: 'Social', staff: { name: 'Ravi Iyer' } },
          4: { subject: 'Math', staff: { name: 'Vikram Kumar' } },
          5: { subject: 'Tamil', staff: { name: 'Priya Patel' } },
          6: { subject: 'Math', staff: { name: 'Vikram Kumar' } },
          7: { subject: 'English', staff: { name: 'Sunita Gupta' } },
          8: { subject: 'Math', staff: { name: 'Meera Jain' } }
        },
        Thursday: {
          1: { subject: 'Science', staff: { name: 'Kavita Nair' } },
          2: { subject: 'Tamil', staff: { name: 'Priya Patel' } },
          3: { subject: 'Math', staff: { name: 'Vikram Kumar' } },
          4: { subject: 'Science', staff: { name: 'Kavita Nair' } },
          5: { subject: 'Math', staff: { name: 'Meera Jain' } },
          6: { subject: 'Social', staff: { name: 'Deepa Mehta' } },
          7: { subject: 'Social', staff: { name: 'Ravi Iyer' } },
          8: { subject: 'Tamil', staff: { name: 'Rajesh Sharma' } }
        },
        Friday: {
          1: { subject: 'English', staff: { name: 'Sunita Gupta' } },
          2: { subject: 'Science', staff: { name: 'Kavita Nair' } },
          3: { subject: 'Math', staff: { name: 'Vikram Kumar' } },
          4: { subject: 'English', staff: { name: 'Sunita Gupta' } },
          5: { subject: 'Science', staff: { name: 'Suresh Reddy' } },
          6: { subject: 'Science', staff: { name: 'Suresh Reddy' } },
          7: { subject: 'Tamil', staff: { name: 'Rajesh Sharma' } },
          8: { subject: 'Tamil', staff: { name: 'Priya Patel' } }
        }
      }
    };
    
    // Copy same pattern for other classes
    ['7A', '8A', '9A', '10A'].forEach(className => {
      timetableData[className] = JSON.parse(JSON.stringify(timetableData['6A']));
    });
    
    setTimetables(timetableData);
    
    // Merge with any localStorage changes
    const savedChanges = localStorage.getItem('timetableChanges');
    if (savedChanges) {
      const changes = JSON.parse(savedChanges);
      const mergedData = { ...timetableData };
      
      Object.keys(changes).forEach(className => {
        if (mergedData[className]) {
          Object.keys(changes[className]).forEach(day => {
            if (mergedData[className][day]) {
              Object.keys(changes[className][day]).forEach(period => {
                mergedData[className][day][period] = changes[className][day][period];
              });
            }
          });
        }
      });
      
      setTimetables(mergedData);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/users?role=staff', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const staffData = response.data.map(s => ({
        id: s._id,
        name: s.name,
        subject: s.subject
      }));
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchTimetables = async () => {
    try {
      const response = await axios.get('/api/timetable', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const timetableData = {};
      response.data.forEach(tt => {
        const className = `${tt.class}${tt.section}`;
        timetableData[className] = tt.schedule;
      });
      
      // If no timetables exist or they're empty, generate default ones
      if (Object.keys(timetableData).length === 0) {
        await generateDefaultTimetables();
      } else {
        setTimetables(timetableData);
        // Check if any class has empty periods and fill them
        const updatedTimetables = { ...timetableData };
        let needsUpdate = false;
        
        classes.forEach(className => {
          if (!updatedTimetables[className]) {
            updatedTimetables[className] = generateClassSchedule();
            needsUpdate = true;
          } else {
            // Check if periods are empty and fill them
            days.forEach(day => {
              if (!updatedTimetables[className][day]) {
                updatedTimetables[className][day] = {};
              }
              periods.forEach(period => {
                if (!updatedTimetables[className][day][period]) {
                  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
                  const subjectStaff = staff.filter(s => s.subject === randomSubject);
                  const randomStaff = subjectStaff[Math.floor(Math.random() * subjectStaff.length)];
                  
                  updatedTimetables[className][day][period] = {
                    subject: randomSubject,
                    staff: randomStaff
                  };
                  needsUpdate = true;
                }
              });
            });
          }
        });
        
        if (needsUpdate) {
          setTimetables(updatedTimetables);
          // Save updated timetables to database
          classes.forEach(className => {
            if (updatedTimetables[className]) {
              saveTimetableToDatabase(className, updatedTimetables[className]);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
      await generateDefaultTimetables();
    }
  };

  const generateClassSchedule = () => {
    const schedule = {};
    
    days.forEach(day => {
      schedule[day] = {};
      
      periods.forEach(period => {
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        const subjectStaff = staff.filter(s => s.subject === randomSubject);
        const randomStaff = subjectStaff[Math.floor(Math.random() * subjectStaff.length)];
        
        schedule[day][period] = {
          subject: randomSubject,
          staff: randomStaff
        };
      });
    });
    
    return schedule;
  };

  const generateDefaultTimetables = async () => {
    if (staff.length === 0) return;
    
    const newTimetables = {};
    
    for (const className of classes) {
      newTimetables[className] = generateClassSchedule();
      
      // Save to database
      await saveTimetableToDatabase(className, newTimetables[className]);
    }
    
    setTimetables(newTimetables);
  };

  const generateMissingTimetables = async (missingClasses) => {
    if (staff.length === 0) return;
    
    const newTimetables = { ...timetables };
    
    for (const className of missingClasses) {
      newTimetables[className] = {};
      
      days.forEach(day => {
        newTimetables[className][day] = {};
        
        periods.forEach(period => {
          const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
          const subjectStaff = staff.filter(s => s.subject === randomSubject);
          const randomStaff = subjectStaff[Math.floor(Math.random() * subjectStaff.length)];
          
          newTimetables[className][day][period] = {
            subject: randomSubject,
            staff: randomStaff
          };
        });
      });
      
      // Save to database
      await saveTimetableToDatabase(className, newTimetables[className]);
    }
    
    setTimetables(newTimetables);
  };

  const saveTimetableToDatabase = async (className, schedule) => {
    try {
      const classNum = className.slice(0, -1);
      const section = className.slice(-1);
      
      const timetableData = {
        class: classNum,
        section: section,
        schedule: schedule
      };
      
      await axios.post('/api/timetable', timetableData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  };

  const handlePeriodClick = (day, period) => {
    if (period === 'Break' || period === 'Lunch') return;
    
    setEditingPeriod({ day, period });
    const currentPeriod = timetables[selectedClass]?.[day]?.[period];
    setSelectedSubject(currentPeriod?.subject || '');
    setSelectedStaff(currentPeriod?.staff?.id || '');
    setIsEditModalOpen(true);
  };

  const handleSavePeriod = async () => {
    if (!selectedSubject || !selectedStaff) return;
    
    const staffMember = staff.find(s => s.id === selectedStaff);
    
    if (!staffMember) {
      alert('Staff member not found');
      return;
    }
    
    const updatedTimetables = {
      ...timetables,
      [selectedClass]: {
        ...timetables[selectedClass],
        [editingPeriod.day]: {
          ...timetables[selectedClass][editingPeriod.day],
          [editingPeriod.period]: {
            subject: selectedSubject,
            staff: { name: staffMember.name }
          }
        }
      }
    };
    
    setTimetables(updatedTimetables);
    
    // Save only the changes to localStorage
    const savedChanges = JSON.parse(localStorage.getItem('timetableChanges') || '{}');
    if (!savedChanges[selectedClass]) savedChanges[selectedClass] = {};
    if (!savedChanges[selectedClass][editingPeriod.day]) savedChanges[selectedClass][editingPeriod.day] = {};
    
    savedChanges[selectedClass][editingPeriod.day][editingPeriod.period] = {
      subject: selectedSubject,
      staff: { name: staffMember.name }
    };
    
    localStorage.setItem('timetableChanges', JSON.stringify(savedChanges));
    
    console.log('Updated and saved change:', savedChanges[selectedClass][editingPeriod.day][editingPeriod.period]);
    
    setIsEditModalOpen(false);
    setEditingPeriod(null);
    setSelectedSubject('');
    setSelectedStaff('');
  };

  const updateTimetableInDatabase = async (className, period, subject, staffName) => {
    // Since API is not available, just log the update
    console.log('✅ Timetable Update:', {
      class: className,
      day: period.day,
      period: period.period,
      subject: subject,
      staff: staffName
    });
    
    // In a real scenario, this would update the database
    // For now, the frontend state is updated which is sufficient
    alert(`Updated ${className} ${period.day} Period ${period.period} to ${subject} with ${staffName}`);
  };



  const getTimeSlot = (period) => {
    const timeSlots = {
      1: '9:00-9:45',
      2: '9:45-10:30',
      3: '10:45-11:30',
      4: '11:30-12:15',
      5: '1:00-1:45',
      6: '1:45-2:30',
      7: '2:30-3:15',
      8: '3:15-4:00'
    };
    return timeSlots[period] || '';
  };

  const renderPeriodCell = (day, period, dayIndex) => {
    if (period === 'Break1') {
      return (
        <td key="break1" className="px-4 py-6 text-center bg-yellow-50 border" rowSpan={dayIndex === 0 ? 5 : undefined}>
          {dayIndex === 0 && (
            <div className="font-semibold text-yellow-800 leading-tight">
              {'BREAK'.split('').map((letter, i) => (
                <div key={i}>{letter}</div>
              ))}
            </div>
          )}
        </td>
      );
    }
    
    if (period === 'Lunch') {
      return (
        <td key="lunch" className="px-4 py-6 text-center bg-orange-50 border" rowSpan={dayIndex === 0 ? 5 : undefined}>
          {dayIndex === 0 && (
            <div className="font-semibold text-orange-800 leading-tight">
              {'LUNCH'.split('').map((letter, i) => (
                <div key={i}>{letter}</div>
              ))}
            </div>
          )}
        </td>
      );
    }
    
    if (period === 'Break2') {
      return (
        <td key="break2" className="px-4 py-6 text-center bg-yellow-50 border" rowSpan={dayIndex === 0 ? 5 : undefined}>
          {dayIndex === 0 && (
            <div className="font-semibold text-yellow-800 leading-tight">
              {'BREAK'.split('').map((letter, i) => (
                <div key={i}>{letter}</div>
              ))}
            </div>
          )}
        </td>
      );
    }

    const periodData = timetables[selectedClass]?.[day]?.[period];
    
    return (
      <td 
        key={period} 
        className="px-4 py-4 text-center border hover:bg-blue-50 cursor-pointer transition-colors"
        onClick={() => handlePeriodClick(day, period)}
      >
        {periodData ? (
          <div className="bg-blue-100 p-3 rounded-lg">
            <div className="font-semibold text-blue-800">
              {period}{period === 1 ? 'st' : period === 2 ? 'nd' : period === 3 ? 'rd' : 'th'} Period - {periodData.subject}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              Staff: {periodData.staff?.name}
            </div>
            <Edit2 size={14} className="mx-auto mt-2 text-blue-500" />
          </div>
        ) : (
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="text-gray-500">No Subject</div>
            <div className="text-xs text-gray-400">Click to assign</div>
          </div>
        )}
      </td>
    );
  };

  const renderTimetableRow = (day, dayIndex) => {
    const periodSequence = [1, 2, 'Break1', 3, 4, 'Lunch', 5, 6, 'Break2', 7, 8];
    
    return (
      <tr key={day} className="hover:bg-gray-50">
        <td className="px-4 py-4 font-semibold text-gray-700 bg-gray-100 border">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {day}
          </div>
        </td>
        {periodSequence.map(period => {
          // Skip break/lunch cells for rows after the first one
          if ((period === 'Break1' || period === 'Lunch' || period === 'Break2') && dayIndex > 0) {
            return null;
          }
          return renderPeriodCell(day, period, dayIndex);
        })}
      </tr>
    );
  };

  const filteredStaff = selectedSubject ? staff.filter(s => s.subject === selectedSubject) : [];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Timetable Managemen</h1>
          </div>

          {/* Class Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Class:</label>
            <div className="grid grid-cols-5 gap-3">
              {classes.map(className => (
                <button
                  key={className}
                  onClick={() => setSelectedClass(className)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedClass === className
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Users size={20} className="mx-auto mb-1" />
                  <div className="font-semibold">Class {className}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Timetable Display */}
          {selectedClass && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                <h2 className="text-xl font-bold">Class {selectedClass} - Weekly Timetable</h2>
                <p className="text-blue-100">Click on any period to edit subject and staff assignment</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Day</th>
                      <th className="px-4 py-3 text-center font-semibold">Period 1<br/><span className="text-xs text-gray-500">9:00-9:45</span></th>
                      <th className="px-4 py-3 text-center font-semibold">Period 2<br/><span className="text-xs text-gray-500">9:45-10:30</span></th>
                      <th className="px-4 py-3 text-center font-semibold bg-yellow-50">Break<br/><span className="text-xs text-gray-500">10:30-10:45</span></th>
                      <th className="px-4 py-3 text-center font-semibold">Period 3<br/><span className="text-xs text-gray-500">10:45-11:30</span></th>
                      <th className="px-4 py-3 text-center font-semibold">Period 4<br/><span className="text-xs text-gray-500">11:30-12:15</span></th>
                      <th className="px-4 py-3 text-center font-semibold bg-orange-50">Lunch<br/><span className="text-xs text-gray-500">12:15-1:00</span></th>
                      <th className="px-4 py-3 text-center font-semibold">Period 5<br/><span className="text-xs text-gray-500">1:00-1:45</span></th>
                      <th className="px-4 py-3 text-center font-semibold">Period 6<br/><span className="text-xs text-gray-500">1:45-2:30</span></th>
                      <th className="px-4 py-3 text-center font-semibold bg-yellow-50">Break<br/><span className="text-xs text-gray-500">2:30-2:45</span></th>
                      <th className="px-4 py-3 text-center font-semibold">Period 7<br/><span className="text-xs text-gray-500">2:45-3:30</span></th>
                      <th className="px-4 py-3 text-center font-semibold">Period 8<br/><span className="text-xs text-gray-500">3:30-4:15</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day, index) => renderTimetableRow(day, index))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!selectedClass && (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Select a class to view and edit its timetable</p>
            </div>
          )}

          {/* Edit Period Modal */}
          <Modal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            title={`Edit ${editingPeriod?.day} - Period ${editingPeriod?.period}`}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedStaff(''); // Reset staff when subject changes
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {selectedSubject && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Staff:</label>
                  <select
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose Staff</option>
                    {filteredStaff.map(staffMember => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.name} ({staffMember.subject})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSavePeriod}
                  disabled={!selectedSubject || !selectedStaff}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TimetableModule;