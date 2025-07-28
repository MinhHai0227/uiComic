import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getDoanhThuNow,
  getListDoanhThu,
  topUserPayment,
} from "@/redux/slices/transition-slice";
import { DollarSign, TrendingUp, Users, History } from "lucide-react";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const currentDate = new Date();
  const currentMonthNumber = currentDate.getMonth() + 1;
  const vietnameseMonth = `Tháng ${currentMonthNumber}`;

  const [limit, setLimit] = useState(3);
  const dispatch = useAppDispatch();
  const { doanhThu, doanhThuPre, topUser } = useAppSelector(
    (state) => state.transition
  );
  const crrUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (crrUser?.role === "admin") {
      dispatch(getDoanhThuNow());
      dispatch(topUserPayment());
      dispatch(getListDoanhThu(limit));
    }
  }, [dispatch, limit]);

  if (crrUser?.role === "editor") {
    return <div>Bạn không đủ quyền hạn</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Card */}
        <Card className="col-span-1 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Doanh thu hôm nay
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {doanhThu?.doanh_thu_theo_ngay.toLocaleString("vi-VN")} đ
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật: {new Date().toLocaleDateString("vi-VN")}
            </p>
          </CardContent>
        </Card>

        {/* Monthly Revenue Card */}
        <Card className="col-span-1 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Doanh thu {vietnameseMonth}
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {doanhThu?.doanh_thu_theo_thang.toLocaleString("vi-VN")} đ
            </p>
            <p className="text-sm text-gray-500 mt-1">{vietnameseMonth}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-5">
        {/* Top Users Card */}
        <Card className=" bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Top người dùng nạp tiền trong {vietnameseMonth}
            </CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {/* Uncomment and use this when dynamic data is available */}
              {topUser.map((user, index) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {user.username[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {index + 1}. {user.username}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-purple-600">
                    {user.total_paid.toLocaleString("vi-VN")} đ
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Previous Months Revenue Card */}
        <div>
          <Card className=" bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-gray-700">
                <span>
                  Doanh thu
                  <div className="inline-block mx-2">
                    <div className="w-[150px]">
                      <Select
                        value={limit.toString()}
                        onValueChange={(value) => setLimit(Number(value))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Doanh thu của " />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 tháng trước</SelectItem>
                          <SelectItem value="6">6 tháng trước</SelectItem>
                          <SelectItem value="12">12 tháng trước</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </span>
              </CardTitle>
              <History className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {doanhThuPre.map((monthData, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Tháng {monthData.month}/{monthData.year}
                      </p>
                    </div>
                    <span className="font-semibold text-indigo-600">
                      {Number(monthData.total).toLocaleString("vi-VN")} đ
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
