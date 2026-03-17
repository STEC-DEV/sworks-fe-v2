import React, { JSX } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Bell,
  AlertCircle,
  Info,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  LucideIcon,
} from "lucide-react";

interface SummaryCardData {
  title: string;
  value: string;
  detail: string;
  completed?: number;
  total?: number;
  inProgress?: number;
  percentage?: number;
  count?: number;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  color: "blue" | "orange" | "green" | "purple";
}

interface ScheduleData {
  date: string;
  time: string;
  title: string;
  location: string;
  type: "meeting" | "inspection" | "training";
  isToday: boolean;
}

interface NoticeData {
  id: number;
  title: string;
  date: string;
  isRead: boolean;
  priority: "urgent" | "important" | "normal";
  author: string;
}

interface ComplaintTrendData {
  month: string;
  count: number;
}

interface QualityScoreData {
  month: string;
  score: number;
}

interface DailyWorkData {
  day: string;
  rate: number;
}

interface ColorClasses {
  bg: string;
  text: string;
  icon: string;
  border: string;
}

export default function Dashboard() {
  // 요약 카드 데이터
  const summaryData: SummaryCardData[] = [
    {
      title: "금일 업무 진행률",
      value: "78%",
      detail: "완료 23건 / 전체 29건",
      completed: 23,
      total: 29,
      trend: "+5%",
      trendUp: true,
      icon: CheckCircle,
      color: "blue",
    },
    {
      title: "금일 발생 민원",
      value: "7건",
      detail: "처리완료 4건 / 처리중 3건",
      completed: 4,
      inProgress: 3,
      trend: "-2건",
      trendUp: true,
      icon: AlertCircle,
      color: "orange",
    },
    {
      title: "금일 민원 처리율",
      value: "85%",
      detail: "평균 처리시간 2.3시간",
      percentage: 85,
      trend: "+12%",
      trendUp: true,
      icon: Activity,
      color: "green",
    },
    {
      title: "읽지 않은 공지",
      value: "3건",
      detail: "최근 공지: 2시간 전",
      count: 3,
      trend: "New",
      trendUp: false,
      icon: Bell,
      color: "purple",
    },
  ];

  // 일정 데이터
  const schedules: ScheduleData[] = [
    {
      date: "오늘",
      time: "14:00",
      title: "월간 품질평가 회의",
      location: "본사 2층 회의실",
      type: "meeting",
      isToday: true,
    },
    {
      date: "오늘",
      time: "16:30",
      title: "미화 장비 정기점검",
      location: "강남 사업장",
      type: "inspection",
      isToday: true,
    },
    {
      date: "내일",
      time: "09:00",
      title: "신규 근무자 오리엔테이션",
      location: "강남 사업장",
      type: "training",
      isToday: false,
    },
    {
      date: "내일",
      time: "15:00",
      title: "사업장 안전점검",
      location: "강남 사업장",
      type: "inspection",
      isToday: false,
    },
  ];

  // 공지사항 데이터
  const notices: NoticeData[] = [
    {
      id: 1,
      title: "[긴급] 미화 장비 안전교육 필수 참석 안내",
      date: "2시간 전",
      isRead: false,
      priority: "urgent",
      author: "안전관리팀",
    },
    {
      id: 2,
      title: "3월 품질평가 일정 변경 공지",
      date: "5시간 전",
      isRead: false,
      priority: "important",
      author: "품질관리팀",
    },
    {
      id: 3,
      title: "봄철 미화 작업 가이드라인 업데이트",
      date: "1일 전",
      isRead: false,
      priority: "normal",
      author: "운영팀",
    },
    {
      id: 4,
      title: "신규 장비 도입 및 사용법 안내",
      date: "2일 전",
      isRead: true,
      priority: "normal",
      author: "장비관리팀",
    },
  ];

  // 민원 발생 추이 데이터 (최근 6개월)
  const complaintTrendData: ComplaintTrendData[] = [
    { month: "10월", count: 45 },
    { month: "11월", count: 52 },
    { month: "12월", count: 38 },
    { month: "1월", count: 48 },
    { month: "2월", count: 41 },
    { month: "3월", count: 35 },
  ];

  // 품질평가 점수 추이 (최근 3개월)
  const qualityScoreData: QualityScoreData[] = [
    { month: "1월", score: 87 },
    { month: "2월", score: 89 },
    { month: "3월", score: 92 },
  ];

  // 일일업무 진행률 추이 (최근 7일)
  const dailyWorkData: DailyWorkData[] = [
    { day: "월", rate: 82 },
    { day: "화", rate: 88 },
    { day: "수", rate: 75 },
    { day: "목", rate: 91 },
    { day: "금", rate: 85 },
    { day: "토", rate: 79 },
    { day: "일", rate: 78 },
  ];

  const getColorClasses = (
    color: "blue" | "orange" | "green" | "purple",
  ): ColorClasses => {
    const colors: Record<"blue" | "orange" | "green" | "purple", ColorClasses> =
      {
        blue: {
          bg: "bg-blue-50",
          text: "text-blue-600",
          icon: "bg-blue-100",
          border: "border-blue-200",
        },
        orange: {
          bg: "bg-orange-50",
          text: "text-orange-600",
          icon: "bg-orange-100",
          border: "border-orange-200",
        },
        green: {
          bg: "bg-green-50",
          text: "text-green-600",
          icon: "bg-green-100",
          border: "border-green-200",
        },
        purple: {
          bg: "bg-purple-50",
          text: "text-purple-600",
          icon: "bg-purple-100",
          border: "border-purple-200",
        },
      };
    return colors[color];
  };

  const getTypeColor = (
    type: "meeting" | "inspection" | "training",
  ): string => {
    const colors: Record<"meeting" | "inspection" | "training", string> = {
      meeting: "bg-blue-100 text-blue-700",
      inspection: "bg-green-100 text-green-700",
      training: "bg-purple-100 text-purple-700",
    };
    return colors[type];
  };

  const getTypeLabel = (
    type: "meeting" | "inspection" | "training",
  ): string => {
    const labels: Record<"meeting" | "inspection" | "training", string> = {
      meeting: "회의",
      inspection: "점검",
      training: "교육",
    };
    return labels[type];
  };

  const getPriorityBadge = (
    priority: "urgent" | "important" | "normal",
  ): JSX.Element => {
    switch (priority) {
      case "urgent":
        return (
          <span className="flex items-center text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
            <AlertCircle className="w-3 h-3 mr-1" />
            긴급
          </span>
        );
      case "important":
        return (
          <span className="flex items-center text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
            <Bell className="w-3 h-3 mr-1" />
            중요
          </span>
        );
      default:
        return (
          <span className="flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            <Info className="w-3 h-3 mr-1" />
            일반
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">S-AGENT 대시보드</h1>
          <p className="text-indigo-100 mt-1">현장관리자 | 강남 사업장</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 요약 정보 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryData.map((item, index) => {
            const colors = getColorClasses(item.color);
            const Icon = item.icon;

            return (
              <div
                key={index}
                className={`${colors.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {item.title}
                    </p>
                    <h3 className={`text-3xl font-bold ${colors.text} mb-1`}>
                      {item.value}
                    </h3>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                  <div className={`${colors.icon} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                </div>

                {/* Progress bar for specific cards */}
                {item.title === "금일 업무 진행률" &&
                  item.completed &&
                  item.total && (
                    <div className="mt-4">
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.completed / item.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                {item.title === "금일 민원 처리율" && item.percentage && (
                  <div className="mt-4">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center">
                  {item.trendUp ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-gray-400 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${item.trendUp ? "text-green-600" : "text-gray-500"}`}
                  >
                    {item.trend}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs 어제</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 목록/타임라인 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 최근 일정 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                최근 일정
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                전체보기 →
              </button>
            </div>

            <div className="space-y-4">
              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className={`flex items-start p-4 rounded-lg border-l-4 transition-colors ${
                    schedule.isToday
                      ? "border-indigo-500 bg-indigo-50 hover:bg-indigo-100"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(schedule.type)}`}
                      >
                        {getTypeLabel(schedule.type)}
                      </span>
                      <span
                        className={`text-xs font-semibold ${schedule.isToday ? "text-indigo-700" : "text-gray-600"}`}
                      >
                        {schedule.date}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2">
                      {schedule.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {schedule.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {schedule.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 공지사항 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-indigo-600" />
                최근 공지사항
                {notices.filter((n) => !n.isRead).length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {notices.filter((n) => !n.isRead).length}
                  </span>
                )}
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                전체보기 →
              </button>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    notice.isRead
                      ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      : "border-indigo-200 bg-indigo-50 hover:bg-indigo-100 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getPriorityBadge(notice.priority)}
                        {!notice.isRead && (
                          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                        )}
                      </div>

                      <h3
                        className={`font-semibold mb-1 text-sm ${notice.isRead ? "text-gray-600" : "text-gray-800"}`}
                      >
                        {notice.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{notice.author}</span>
                        <span>•</span>
                        <span>{notice.date}</span>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 flex-shrink-0 ${notice.isRead ? "text-gray-400" : "text-indigo-600"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 통계 및 트렌드 섹션 */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
            통계 및 트렌드
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 민원 발생 추이 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-600" />
              민원 발생 추이
              <span className="ml-2 text-sm text-gray-500 font-normal">
                (최근 6개월)
              </span>
            </h3>

            <div className="h-64 flex items-end justify-between gap-3">
              {complaintTrendData.map((data, index) => {
                const maxCount = Math.max(
                  ...complaintTrendData.map((d) => d.count),
                );
                const height = (data.count / maxCount) * 100;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="relative w-full flex flex-col items-center">
                      <span className="text-sm font-semibold text-orange-600 mb-2">
                        {data.count}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-500 hover:from-orange-600 hover:to-orange-500"
                        style={{ height: `${height * 2}px`, minHeight: "30px" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 mt-2 font-medium">
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">이번 달 평균</span>
                <span className="font-semibold text-orange-700">35건</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-700">전월 대비</span>
                <span className="font-semibold text-green-600 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -14.6%
                </span>
              </div>
            </div>
          </div>

          {/* 품질평가 점수 추이 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-600" />
              품질평가 점수 추이
              <span className="ml-2 text-sm text-gray-500 font-normal">
                (최근 3개월)
              </span>
            </h3>

            <div className="h-64">
              <svg viewBox="0 0 400 240" className="w-full h-full">
                {/* Grid lines */}
                {[0, 20, 40, 60, 80, 100].map((y, i) => (
                  <g key={i}>
                    <line
                      x1="50"
                      y1={210 - y * 1.6}
                      x2="380"
                      y2={210 - y * 1.6}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <text
                      x="35"
                      y={215 - y * 1.6}
                      fill="#9ca3af"
                      fontSize="12"
                      textAnchor="end"
                    >
                      {y}
                    </text>
                  </g>
                ))}

                {/* Line chart */}
                <polyline
                  points={qualityScoreData
                    .map(
                      (data, i) => `${70 + i * 120},${210 - data.score * 1.6}`,
                    )
                    .join(" ")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {qualityScoreData.map((data, i) => (
                  <g key={i}>
                    <circle
                      cx={70 + i * 120}
                      cy={210 - data.score * 1.6}
                      r="6"
                      fill="#3b82f6"
                      className="cursor-pointer"
                    />
                    <circle
                      cx={70 + i * 120}
                      cy={210 - data.score * 1.6}
                      r="3"
                      fill="white"
                    />
                    <text
                      x={70 + i * 120}
                      y={195 - data.score * 1.6}
                      fill="#3b82f6"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {data.score}
                    </text>
                    <text
                      x={70 + i * 120}
                      y={230}
                      fill="#6b7280"
                      fontSize="13"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {data.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">3개월 평균 점수</span>
                <span className="font-semibold text-blue-700">89.3점</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-700">전월 대비</span>
                <span className="font-semibold text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +3.4점
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 일일업무 진행률 추이 - 전체 너비 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            일일업무 진행률 추이
            <span className="ml-2 text-sm text-gray-500 font-normal">
              (최근 7일)
            </span>
          </h3>

          <div className="h-72 flex items-end justify-between gap-4">
            {dailyWorkData.map((data, index) => {
              const isToday = index === dailyWorkData.length - 1;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex flex-col items-center">
                    <span
                      className={`text-sm font-semibold mb-2 ${isToday ? "text-green-600" : "text-gray-600"}`}
                    >
                      {data.rate}%
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday
                          ? "bg-gradient-to-t from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
                          : "bg-gradient-to-t from-gray-300 to-gray-200 hover:from-gray-400 hover:to-gray-300"
                      }`}
                      style={{
                        height: `${data.rate * 2.5}px`,
                        minHeight: "40px",
                      }}
                    ></div>
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium ${isToday ? "text-green-700" : "text-gray-600"}`}
                  >
                    {data.day}
                  </span>
                  {isToday && (
                    <span className="text-xs text-green-600 font-semibold mt-1">
                      오늘
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-700 mb-1">주간 평균</div>
              <div className="text-2xl font-bold text-green-700">82.6%</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-700 mb-1">최고 진행률</div>
              <div className="text-2xl font-bold text-blue-700">91%</div>
              <div className="text-xs text-gray-500 mt-1">목요일</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-700 mb-1">개선 필요</div>
              <div className="text-2xl font-bold text-orange-700">75%</div>
              <div className="text-xs text-gray-500 mt-1">수요일</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
