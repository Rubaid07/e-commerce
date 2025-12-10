// src/components/admin/SalesChart.jsx
import { 
  TrendingUp, 
  MoreVertical,
  Download
} from "lucide-react";

const SalesChart = () => {
  const salesData = [
    { month: 'Jan', sales: 4000, orders: 240 },
    { month: 'Feb', sales: 3000, orders: 198 },
    { month: 'Mar', sales: 5000, orders: 280 },
    { month: 'Apr', sales: 4500, orders: 250 },
    { month: 'May', sales: 6000, orders: 320 },
    { month: 'Jun', sales: 5500, orders: 300 },
    { month: 'Jul', sales: 7000, orders: 350 },
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));
  const maxOrders = Math.max(...salesData.map(d => d.orders));

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Sales Overview</h3>
          <p className="text-sm text-gray-600">Monthly revenue and orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold">$45,240</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Orders</span>
            </div>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="flex items-end justify-between h-48 pt-4">
          {salesData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1 px-2">
              {/* Sales Bar */}
              <div className="relative w-full flex justify-center">
                <div 
                  className="w-6 bg-blue-500 rounded-t-lg"
                  style={{ height: `${(data.sales / maxSales) * 100}%` }}
                ></div>
                {/* Orders Bar */}
                <div 
                  className="w-6 bg-green-500 rounded-t-lg absolute bottom-0"
                  style={{ height: `${(data.orders / maxOrders) * 40}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-600">{data.month}</div>
              <div className="mt-1 text-xs font-semibold">${data.sales}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-lg font-bold">$45,240</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-lg font-bold">2,140</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-lg font-bold">$21.14</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-lg font-bold text-green-600">+12.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;