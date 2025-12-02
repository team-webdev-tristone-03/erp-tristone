const Card = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={`${colors[color]} p-4 rounded-full`}>
        <Icon size={32} className="text-white" />
      </div>
    </div>
  );
};

export default Card;
