'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

const attendanceData = [
  { name: 'Checked In', value: 150 },
  { name: 'Not Checked In', value: 50 },
]

const COLORS = ['#4CAF50', '#FFA000']

const hourlyCheckIns = [
  { hour: '5 PM', checkIns: 20 },
  { hour: '6 PM', checkIns: 45 },
  { hour: '7 PM', checkIns: 60 },
  { hour: '8 PM', checkIns: 25 },
]

export function AtAGlance() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hourly Check-ins</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyCheckIns}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="checkIns" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}