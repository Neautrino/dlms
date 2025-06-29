'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Mock data - Replace with actual API calls
const mockData = {
  userStats: {
    totalUsers: 1500,
    activeUsers: 1200,
    labourUsers: 1000,
    managerUsers: 500,
    newUsers: 150,
    verifiedUsers: 1200,
  },
  stateDistribution: {
    labels: ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Others'],
    labourData: [250, 180, 150, 120, 100, 200],
    managerData: [100, 80, 60, 50, 40, 170],
  },
  monthlyGrowth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    labourData: [100, 150, 200, 250, 300, 350],
    managerData: [50, 70, 90, 110, 130, 150],
  },
  skillDistribution: {
    labels: ['Construction', 'Manufacturing', 'IT', 'Healthcare', 'Agriculture', 'Others'],
    data: [30, 25, 20, 15, 10, 20],
  },
  userActivity: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    activeUsers: [120, 150, 180, 200, 220, 180, 150],
    newUsers: [20, 25, 30, 35, 40, 30, 25],
  },
  verificationStatus: {
    verified: 1200,
    pending: 200,
    rejected: 100,
  },
};

export default function AnalyticsPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('monthly');
  const isDarkMode = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Chart options and data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#fff' : '#000',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const stateDistributionData = {
    labels: mockData.stateDistribution.labels,
    datasets: [
      {
        label: 'Labour Users',
        data: mockData.stateDistribution.labourData,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Manager Users',
        data: mockData.stateDistribution.managerData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const monthlyGrowthData = {
    labels: mockData.monthlyGrowth.labels,
    datasets: [
      {
        label: 'Labour Users',
        data: mockData.monthlyGrowth.labourData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Manager Users',
        data: mockData.monthlyGrowth.managerData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const skillDistributionData = {
    labels: mockData.skillDistribution.labels,
    datasets: [
      {
        data: mockData.skillDistribution.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
      },
    ],
  };

  const userActivityData = {
    labels: mockData.userActivity.labels,
    datasets: [
      {
        label: 'Active Users',
        data: mockData.userActivity.activeUsers,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
      },
      {
        label: 'New Users',
        data: mockData.userActivity.newUsers,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const verificationStatusData = {
    labels: ['Verified', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          mockData.verificationStatus.verified,
          mockData.verificationStatus.pending,
          mockData.verificationStatus.rejected,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Analytics Dashboard
        </h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {mockData.userStats.totalUsers}
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                +{mockData.userStats.newUsers} new users this month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {mockData.userStats.activeUsers}
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {Math.round((mockData.userStats.activeUsers / mockData.userStats.totalUsers) * 100)}% of total users
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Verified Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {mockData.userStats.verifiedUsers}
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {Math.round((mockData.userStats.verifiedUsers / mockData.userStats.totalUsers) * 100)}% verification rate
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                User Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {mockData.userStats.labourUsers}:{mockData.userStats.managerUsers}
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Labour to Manager ratio
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    User Distribution by State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Bar options={chartOptions} data={stateDistributionData} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Doughnut options={chartOptions} data={verificationStatusData} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line options={chartOptions} data={userActivityData} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Skill Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Pie options={chartOptions} data={skillDistributionData} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Monthly User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line options={chartOptions} data={monthlyGrowthData} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 