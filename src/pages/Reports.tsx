import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  FileText,
  PieChart,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyRevenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
  { month: "Jul", revenue: 72000 },
  { month: "Aug", revenue: 69000 },
  { month: "Sep", revenue: 78000 },
  { month: "Oct", revenue: 82000 },
  { month: "Nov", revenue: 79000 },
  { month: "Dec", revenue: 84250 },
];

const membershipDistribution = [
  { name: "Basic", value: 35, color: "hsl(var(--primary))" },
  { name: "Premium", value: 45, color: "hsl(var(--info))" },
  { name: "Elite", value: 20, color: "hsl(var(--warning))" },
];

const attendanceData = [
  { day: "Mon", attendance: 320 },
  { day: "Tue", attendance: 285 },
  { day: "Wed", attendance: 340 },
  { day: "Thu", attendance: 298 },
  { day: "Fri", attendance: 380 },
  { day: "Sat", attendance: 420 },
  { day: "Sun", attendance: 290 },
];

const reportCards = [
  {
    title: "Total Revenue",
    value: "$812,450",
    change: "+15.2%",
    icon: DollarSign,
    color: "text-success",
  },
  {
    title: "New Members",
    value: "342",
    change: "+8.1%",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Sessions Completed",
    value: "1,847",
    change: "+12.4%",
    icon: Calendar,
    color: "text-info",
  },
  {
    title: "Retention Rate",
    value: "89%",
    change: "+2.3%",
    icon: TrendingUp,
    color: "text-warning",
  },
];

const Reports = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 opacity-0 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your gym's performance and metrics.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reportCards.map((card, index) => (
          <Card
            key={card.title}
            className="stat-card opacity-0 animate-fade-in"
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {card.value}
                  </p>
                  <p className={`text-sm mt-1 ${card.color}`}>
                    {card.change} from last year
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary">
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card
          className="stat-card card-glow opacity-0 animate-fade-in"
          style={{ animationDelay: "500ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Monthly Revenue
            </CardTitle>
            <CardDescription>
              Revenue performance over the past 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Chart */}
        <Card
          className="stat-card card-glow opacity-0 animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-info" />
              Weekly Attendance
            </CardTitle>
            <CardDescription>Average daily check-ins this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="hsl(var(--info))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--info))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Distribution */}
        <Card
          className="stat-card card-glow opacity-0 animate-fade-in"
          style={{ animationDelay: "700ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-warning" />
              Membership Types
            </CardTitle>
            <CardDescription>Distribution by plan type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={membershipDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {membershipDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Share"]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {membershipDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <Card
          className="stat-card lg:col-span-2 opacity-0 animate-fade-in"
          style={{ animationDelay: "800ms" }}
        >
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
            <CardDescription>Download pre-generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Monthly Revenue Report",
                  description: "Financial summary for December 2024",
                  icon: DollarSign,
                },
                {
                  title: "Member Activity Report",
                  description: "Check-ins and session attendance",
                  icon: Users,
                },
                {
                  title: "Trainer Performance",
                  description: "Sessions and ratings overview",
                  icon: TrendingUp,
                },
                {
                  title: "Equipment Usage",
                  description: "Maintenance and usage statistics",
                  icon: BarChart3,
                },
              ].map((report, index) => (
                <button
                  key={report.title}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all text-left group"
                >
                  <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <report.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {report.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {report.description}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
