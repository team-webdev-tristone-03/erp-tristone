import { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import { materialAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    materialAPI.getMaterials({ class: user.class }).then(res => setMaterials(res.data));
  }, [user]);

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { header: 'Subject', render: (row) => row.subject?.name || 'General' },
    { header: 'Download', render: (row) => (
      <a href={row.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        Download
      </a>
    )}
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Study Materials</h1>
          <div className="bg-white rounded-lg shadow-md">
            <Table columns={columns} data={materials} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMaterials;
