"use client";

import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";



export default function Page() {
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
      const average = (sumPackages / totalOffers);
      const averagePackage = parseFloat(average.toFixed(2));
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
      const placementPercentage = (totalOffers / placementData.filter(item => item.offer_status === 'Accepted').length) * 100;
      const placementPercentageOverall = parseFloat(placementPercentage.toFixed(2));

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
        labels: placementPercentageData.map(item => wrapLabel(item.specialization, 10)), // Adjust the wrapping length as needed
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
            },
            suggestedMax: 100 // Adjust the maximum value as needed
          },
          x: {
            maxBarThickness: 50 // Adjust the maximum bar thickness as needed
          }
        }
      }
    }
  );
};

// Function to wrap label text
const wrapLabel = (text, maxCharacters) => {
  if (text.length > maxCharacters) {
    return text.slice(0, maxCharacters) + '\n' + text.slice(maxCharacters);
  }
  return text;
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
aspectRatio: 2,
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
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden md:flex items-center space-x-2">

          <Select onValueChange={value=> setSelectedYear(value)} defaultValue='2023'>
            <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Year" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            {[...new Set(placementData.map(item => item.students.passing_year))].map(year => (
          <SelectItem value={year}>{year}</SelectItem>
        ))}

        </SelectGroup>
      </SelectContent>
          </Select>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" >
              Analytics
            </TabsTrigger>
          </TabsList>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Highest Package
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.highestPackage} LPA</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last year
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Package
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.averagePackage} LPA</div>
                  <p className="text-xs text-muted-foreground">
                    Median Package : <strong>{statistics.medianPackage} </strong> <br/> Mode Package : {statistics.modePackage}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Placement %</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.placementPercentageOverall}</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last year
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Offers
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalOffers}</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last year
                  </p>
                </CardContent>
              </Card>
            </div>
          <TabsContent value="overview" className="space-y-4">
            <div className="flex flex-col gap-4">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Specialization</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <canvas id="placement-chart" width="400" height="200"></canvas>
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Gender</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <canvas id="gender-chart" width="400" height="200"></canvas>
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>College Academics</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <canvas id="placement-batches-chart" width="400" height="200"></canvas>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Placement Percentage by Specialization</CardTitle>
              </CardHeader>
              <CardContent>
                <canvas id="specialization-chart" width="400" height="200"></canvas>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Placement Percentage by Gender</CardTitle>
              </CardHeader>
              <CardContent>
                <canvas id="gender-chart" width="400" height="200"></canvas>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Placement Percentage by Academics Range</CardTitle>
              </CardHeader>
              <CardContent>
                <canvas id="academics-chart" width="400" height="200"></canvas>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
