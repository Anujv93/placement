
"use client"
import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { createClient } from '@/utils/supabase/client';

export default function Placement() {
  const supabase = createClient();
  const [selectedYear, setSelectedYear] = useState('');
  const [placementData, setPlacementData] = useState([]);
  const [statistics, setStatistics] = useState({
    highestPackage: 0,
    totalOffers: 0,
    placementPercentageOverall: 0,
    averagePackage: 0,
    medianPackage: 0,
    modePackage: 0
  });

  useEffect(() => {
    const fetchPlacementData = async () => {
      const { data, error } = await supabase
        .from('student_offers')
        .select(`
          id,
          ctc,
          offer_status,
          students (id,passing_year,campus,primary_specialization,gender,aggregate_cgpa)
        `);

      if (error) {
        console.error('Error fetching placement data:', error.message);
        return;
      }

      setPlacementData(data);
    };

    fetchPlacementData();
  }, []);

  useEffect(() => {
    if (selectedYear && placementData.length > 0) {
      // Filter placed students based on selected year
      const filteredData = placementData.filter(item => {
        return item.students.passing_year === selectedYear && item.offer_status === 'Accepted';
      });

      // Calculate statistics
      const totalOffers = filteredData.length;
      const highestPackage = Math.max(...filteredData.map(item => parseFloat(item.ctc)));
      const sumPackages = filteredData.reduce((acc, item) => acc + parseFloat(item.ctc), 0);
      const averagePackage = sumPackages / totalOffers;
      const sortedPackages = filteredData.map(item => parseFloat(item.ctc)).sort((a, b) => a - b);
      let medianPackage;
      if (totalOffers % 2 === 0) {
        medianPackage = (sortedPackages[totalOffers / 2 - 1] + sortedPackages[totalOffers / 2]) / 2;
      } else {
        medianPackage = sortedPackages[Math.floor(totalOffers / 2)];
      }
      const packageCounts = {};
      filteredData.forEach(item => {
        const ctc = parseFloat(item.ctc);
        packageCounts[ctc] = (packageCounts[ctc] || 0) + 1;
      });
      const modePackage = parseFloat(Object.keys(packageCounts).reduce((a, b) => packageCounts[a] > packageCounts[b] ? a : b));
      const placementPercentageOverall = (totalOffers / placementData.filter(item => item.offer_status === 'Accepted').length) * 100;

      setStatistics({
        highestPackage,
        totalOffers,
        placementPercentageOverall,
        averagePackage,
        medianPackage,
        modePackage
      });

      // Calculate placement percentage for each specialization
      const specializationCounts = {};
      filteredData.forEach(item => {
        const specialization = item.students.primary_specialization;
        specializationCounts[specialization] = (specializationCounts[specialization] || 0) + 1;
      });

      const totalCount = filteredData.length;

      const placementPercentageData = Object.keys(specializationCounts).map(specialization => ({
        specialization,
        percentage: (specializationCounts[specialization] / totalCount) * 100
      }));

      renderChart(placementPercentageData);

      // Calculate gender distribution for doughnut chart
      const genderCounts = {};
      filteredData.forEach(item => {
        const gender = item.students.gender;
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;
      });

      const genderData = {
        labels: Object.keys(genderCounts),
        datasets: [{
          label: 'Gender Distribution',
          data: Object.values(genderCounts),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
          hoverOffset: 4
        }]
      };

      renderDoughnutChart(genderData);
      renderPlacementVsBatchesChart(filteredData);
    }
  }, [selectedYear, placementData]);

  const renderChart = (placementPercentageData) => {
    // Clear previous chart if exists
    const existingChart = Chart.getChart('placement-chart');
    if (existingChart) {
      existingChart.destroy();
    }

    // Render new Chart.js bar chart
    new Chart(
      document.getElementById('placement-chart'),
      {
        type: 'bar',
        data: {
          labels: placementPercentageData.map(item => item.specialization),
          datasets: [
            {
              label: 'Placement Percentage by Specialization',
              data: placementPercentageData.map(item => item.percentage),
              backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Placement Percentage (%)'
              }
            }
          }
        }
      }
    );
  };

  const renderDoughnutChart = (genderData) => {
  // Clear previous chart if exists
  const existingChart = Chart.getChart('gender-chart');
  if (existingChart) {
    existingChart.destroy();
  }
  
  // Calculate total count of males and females
  const totalCount = genderData.datasets[0].data.reduce((acc, value) => acc + value, 0);
  
  // Calculate percentage values
  const percentageData = genderData.datasets[0].data.map(value => ((value / totalCount) * 100).toFixed(2));
  
  // Render new Chart.js doughnut chart
  new Chart(
    document.getElementById('gender-chart'),
    {
      type: 'doughnut',
      data: {
        labels: genderData.labels.map((label, index) => `${label} (${percentageData[index]}%)`),
        datasets: genderData.datasets
      },
      options: {
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    }
  );
};

const renderPlacementVsBatchesChart = (placementData) => {
    // Clear previous chart if exists
    const existingChart = Chart.getChart('placement-batches-chart');
    if (existingChart) {
      existingChart.destroy();
    }

    // Define CGPA ranges
    const cgpaRanges = [
      { label: '10 - 9', min: 9.0, max: 10.0 },
      { label: '9 - 8', min: 8.0, max: 9.0 },
      { label: '8 - 7', min: 7.0, max: 8.0 },
      { label: '7 - 6', min: 6.0, max: 7.0 },
      { label: '6 - 5', min: 5.0, max: 6.0 },
      { label: '5 - 4', min: 4.0, max: 5.0 },
      { label: 'Below 4', min: 0, max: 4.0 }
    ];

    // Initialize count of accepted offers for each CGPA range
    const acceptedCounts = cgpaRanges.map(() => 0);
    // Initialize count of total students for each CGPA range
    const totalStudentsCounts = cgpaRanges.map(() => 0);

    // Count accepted offers and total students for each CGPA range
    placementData.forEach(item => {
      const cgpa = parseFloat(item.students.aggregate_cgpa); // Convert CGPA to float
      const accepted = item.offer_status === 'Accepted';
      for (let i = 0; i < cgpaRanges.length; i++) {
        if (cgpa >= cgpaRanges[i].min && cgpa < cgpaRanges[i].max) {
          if (accepted) {
            acceptedCounts[i]++;
          }
          totalStudentsCounts[i]++;
          break;
        }
      }
    });

    // Calculate total number of accepted offers
    const totalAccepted = acceptedCounts.reduce((acc, count) => acc + count, 0);

    // Calculate percentage of accepted offers for each CGPA range
    const placementPercentageData = cgpaRanges.map((range, index) => ({
      label: range.label,
      percentage: totalAccepted > 0 ? (acceptedCounts[index] / totalAccepted) * 100 : 0,
      totalStudents: totalStudentsCounts[index]
    }));

    // Render new Chart.js bar graph
    new Chart(
      document.getElementById('placement-batches-chart'),
      {
        type: 'bar',
        data: {
          labels: cgpaRanges.map(range => range.label),
          datasets: [
            {
              label: 'Placement Percentage by CGPA Range',
              data: placementPercentageData.map(item => item.percentage),
              backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Placement Percentage (%)'
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const data = placementPercentageData[context.dataIndex];
                  return `Percentage: ${data.percentage.toFixed(2)}%, Students: ${data.totalStudents}`;
                }
              }
            }
          }
        }
      }
    );
  };



  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div>
      <h1>Placement Report</h1>
      <label htmlFor="year">Select Year of Passing:</label>
      <select id="year" onChange={handleYearChange} value={selectedYear}>
        <option value="">Select Year</option>
        {/* Assuming data is available for multiple years */}
        {[...new Set(placementData.map(item => item.students.passing_year))].map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <div>
        <canvas id="placement-chart" width="400" height="200"></canvas>
      </div>
      <div>
        <canvas id="gender-chart" width="400" height="200"></canvas>
      </div>
      <div>
        <canvas id="placement-batches-chart" width="400" height="200"></canvas>
      </div>
      <div>
        <h2>Statistics</h2>
        <p>Highest Package: {statistics.highestPackage}</p>
        <p>Total Offers: {statistics.totalOffers}</p>
        <p>Placement Percentage Overall: {statistics.placementPercentageOverall}%</p>
        <p>Average Package: {statistics.averagePackage}</p>
        <p>Median Package: {statistics.medianPackage}</p>
        <p>Mode Package: {statistics.modePackage}</p>
      </div>
    </div>
  );
};
// "use client"
// import { useState, useEffect } from 'react';
// import Chart from 'chart.js/auto';
// import { createClient } from '@/utils/supabase/client';

// export default function Placement() {
//   const supabase = createClient();
//   const [selectedYear, setSelectedYear] = useState('');
//   const [placementData, setPlacementData] = useState([]);
//   const [statistics, setStatistics] = useState({
//     highestPackage: 0,
//     totalOffers: 0,
//     placementPercentageOverall: 0,
//     averagePackage: 0,
//     medianPackage: 0,
//     modePackage: 0
//   });

//   useEffect(() => {
//     const fetchPlacementData = async () => {
//       const { data, error } = await supabase
//         .from('student_offers')
//         .select(`
//           id,
//           ctc,
//           offer_status,
//           students (id,passing_year,campus,primary_specialization,gender,aggregate_cgpa)
//         `);

//       if (error) {
//         console.error('Error fetching placement data:', error.message);
//         return;
//       }

//       setPlacementData(data);
//     };

//     fetchPlacementData();
//   }, []);

//   useEffect(() => {
//     if (selectedYear && placementData.length > 0) {
//       // Filter placed students based on selected year
//       const filteredData = placementData.filter(item => {
//         return item.students.passing_year === selectedYear && item.offer_status === 'Accepted';
//       });

//       // Calculate statistics
//       const totalOffers = filteredData.length;
//       const highestPackage = Math.max(...filteredData.map(item => parseFloat(item.ctc)));
//       const sumPackages = filteredData.reduce((acc, item) => acc + parseFloat(item.ctc), 0);
//       const averagePackage = sumPackages / totalOffers;
//       const sortedPackages = filteredData.map(item => parseFloat(item.ctc)).sort((a, b) => a - b);
//       let medianPackage;
//       if (totalOffers % 2 === 0) {
//         medianPackage = (sortedPackages[totalOffers / 2 - 1] + sortedPackages[totalOffers / 2]) / 2;
//       } else {
//         medianPackage = sortedPackages[Math.floor(totalOffers / 2)];
//       }
//       const packageCounts = {};
//       filteredData.forEach(item => {
//         const ctc = parseFloat(item.ctc);
//         packageCounts[ctc] = (packageCounts[ctc] || 0) + 1;
//       });
//       const modePackage = parseFloat(Object.keys(packageCounts).reduce((a, b) => packageCounts[a] > packageCounts[b] ? a : b));
//       const placementPercentageOverall = (totalOffers / placementData.filter(item => item.offer_status === 'Accepted').length) * 100;

//       setStatistics({
//         highestPackage,
//         totalOffers,
//         placementPercentageOverall,
//         averagePackage,
//         medianPackage,
//         modePackage
//       });

//       // Calculate placement percentage for each specialization
//       const specializationCounts = {};
//       filteredData.forEach(item => {
//         const specialization = item.students.primary_specialization;
//         specializationCounts[specialization] = (specializationCounts[specialization] || 0) + 1;
//       });

//       const totalCount = filteredData.length;

//       const placementPercentageData = Object.keys(specializationCounts).map(specialization => ({
//         specialization,
//         percentage: (specializationCounts[specialization] / totalCount) * 100
//       }));

//       renderChart(placementPercentageData);

//       // Render line graph
//       renderPlacementTrendChart();
//     }
//   }, [selectedYear, placementData]);

//   const renderChart = (placementPercentageData) => {
//     // Clear previous chart if exists
//     const existingChart = Chart.getChart('placement-chart');
//     if (existingChart) {
//       existingChart.destroy();
//     }

//     // Render new Chart.js chart
//     new Chart(
//       document.getElementById('placement-chart'),
//       {
//         type: 'bar',
//         data: {
//           labels: placementPercentageData.map(item => item.specialization),
//           datasets: [
//             {
//               label: 'Placement Percentage by Specialization',
//               data: placementPercentageData.map(item => item.percentage),
//               backgroundColor: 'rgba(54, 162, 235, 0.5)'
//             }
//           ]
//         },
//         options: {
//           scales: {
//             y: {
//               beginAtZero: true,
//               title: {
//                 display: true,
//                 text: 'Placement Percentage (%)'
//               }
//             }
//           }
//         }
//       }
//     );
//   };

  // const renderPlacementTrendChart = () => {
  //   // Group placement data by year
  //   const placementByYear = {};
  //   placementData.forEach(item => {
  //     const year = item.students.passing_year;
  //     if (!placementByYear[year]) {
  //       placementByYear[year] = [];
  //     }
  //     placementByYear[year].push(item);
  //   });

  //   // Calculate placement percentage for each year
  //   const placementTrendData = Object.keys(placementByYear).map(year => {
  //     const yearData = placementByYear[year].filter(item => item.offer_status === 'Accepted');
  //     const totalOffers = yearData.length;
  //     const placementPercentage = (totalOffers / placementData.filter(item => item.offer_status === 'Accepted').length) * 100;
  //     return { year, placementPercentage, statistics: calculateStatistics(yearData) };
  //   });

  //   // Prepare data for the line graph
  //   const labels = placementTrendData.map(item => item.year);
  //   const data = {
  //     labels: labels,
  //     datasets: [{
  //       label: 'Placement Percentage by Year',
  //       data: placementTrendData.map(item => item.placementPercentage),
  //       fill: false,
  //       borderColor: 'rgb(75, 192, 192)',
  //       tension: 0.1
  //     }]
  //   };

  //   // Render new Chart.js line graph
  //   new Chart(
  //     document.getElementById('placement-trend-chart'),
  //     {
  //       type: 'line',
  //       data: data,
  //       options: {
  //         plugins: {
  //           tooltip: {
  //             callbacks: {
  //               label: function(context) {
  //                 const yearData = placementTrendData[context.dataIndex];
  //                 const stats = yearData.statistics;
  //                 return `Year: ${yearData.year}, Placement Percentage: ${yearData.placementPercentage.toFixed(2)}%, Highest Package: ${stats.highestPackage}, Total Offers: ${stats.totalOffers}, Average Package: ${stats.averagePackage.toFixed(2)}, Median Package: ${stats.medianPackage.toFixed(2)}, Mode Package: ${stats.modePackage}`;
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   );
  // };

// const calculateStatistics = (data) => {
//   if (data.length === 0) {
//     return {
//       highestPackage: 0,
//       totalOffers: 0,
//       averagePackage: 0,
//       medianPackage: 0,
//       modePackage: 0
//     };
//   }

//   const totalOffers = data.length;
//   const highestPackage = Math.max(...data.map(item => parseFloat(item.ctc)));
//   const sumPackages = data.reduce((acc, item) => acc + parseFloat(item.ctc), 0);
//   const averagePackage = sumPackages / totalOffers;
//   const sortedPackages = data.map(item => parseFloat(item.ctc)).sort((a, b) => a - b);
//   let medianPackage;
//   if (totalOffers % 2 === 0) {
//     medianPackage = (sortedPackages[totalOffers / 2 - 1] + sortedPackages[totalOffers / 2]) / 2;
//   } else {
//     medianPackage = sortedPackages[Math.floor(totalOffers / 2)];
//   }
//   const packageCounts = {};
//   data.forEach(item => {
//     const ctc = parseFloat(item.ctc);
//     packageCounts[ctc] = (packageCounts[ctc] || 0) + 1;
//   });
//   const modePackage = parseFloat(Object.keys(packageCounts).reduce((a, b) => packageCounts[a] > packageCounts[b] ? a : b));

//   return {
//     highestPackage,
//     totalOffers,
//     averagePackage,
//     medianPackage,
//     modePackage
//   };
// };

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//   };

//   return (
//     <div>
//       <h1>Placement Report</h1>
//       <label htmlFor="year">Select Year of Passing:</label>
//       <select id="year" onChange={handleYearChange} value={selectedYear}>
//         <option value="">Select Year</option>
//         {/* Assuming data is available for multiple years */}
//         {[...new Set(placementData.map(item => item.students.passing_year))].map(year => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>
//       <div>
//         <canvas id="placement-chart" width="400" height="200"></canvas>
//       </div>
//       <div>
//         <canvas id="placement-trend-chart" width="400" height="200"></canvas>
//       </div>
//       <div>
//         <h2>Statistics</h2>
//         <p>Highest Package: {statistics.highestPackage}</p>
//         <p>Total Offers: {statistics.totalOffers}</p>
//         <p>Placement Percentage Overall: {statistics.placementPercentageOverall}%</p>
//         <p>Average Package: {statistics.averagePackage}</p>
//         <p>Median Package: {statistics.medianPackage}</p>
//         <p>Mode Package: {statistics.modePackage}</p>
//       </div>
//     </div>
//   );
// };
