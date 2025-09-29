import React from 'react';
import MyMapImage from "../assets/india_map1.png";
import CountUp from 'react-countup';

const statsData = [
  { value: "118K+", label: "Internship Opportunities", gradient: "from-pink-100 to-orange-100" },
  { value: "25", label: "Sectors", gradient: "from-green-100 to-blue-100" },
  { value: "36", label: "States/UTs", gradient: "from-blue-100 to-purple-100" },
  { value: "734", label: "Districts", gradient: "from-purple-100 to-pink-100" },
  { value: "5", label: "Qualifications", gradient: "from-yellow-100 to-green-100" },
];

const Dashboard = () => {
  const renderAnimatedNumber = (value) => {
    const number = parseInt(value, 10);
    const suffix = value.replace(number.toString(), ''); 

    return (
      <CountUp
        end={number}
        duration={2.5}
        separator=","
        suffix={suffix}
        enableScrollSpy
        scrollSpyDelay={500}
      />
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 inline-block">
                <span className="relative">
                    Dashboard
                    <span className="absolute -left-12 -top-1 w-8 h-1 bg-orange-500 rounded-full"></span>
                    <span className="absolute -right-12 -top-1 w-8 h-1 bg-orange-500 rounded-full"></span>
                </span>
            </h2>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2 max-w-2xl">
            <img src={MyMapImage} alt="Map of India" />
          </div>
          <div className="w-full lg:w-1/2 max-w-lg">
            <div className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${statsData[0].gradient} mb-6 text-center`}>
              <div className="text-5xl font-extrabold text-gray-800">
                {renderAnimatedNumber(statsData[0].value)}
              </div>
              <p className="text-xl text-gray-700 mt-2">{statsData[0].label}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {statsData.slice(1).map((stat, index) => (
                <div key={index} className={`p-5 rounded-2xl shadow-lg bg-gradient-to-br ${stat.gradient} text-center`}>
                  <div className="text-4xl font-bold text-gray-800">
                    {renderAnimatedNumber(stat.value)}
                  </div>
                  <p className="text-md text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;