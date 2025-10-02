"use client";
import { logout } from "@/app/server-action/auth/auth-action";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import { icons, LogOut, MenuIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
interface MenuItem {
  title: string;
  icon?: keyof typeof icons;
  isGroup?: boolean; // 그룹 헤더인지 구분
  path?: string;
}
// 메뉴 섹션
interface MenuSection {
  items: MenuItem[];
}

const NormalMenu: MenuSection[] = [
  { items: [{ title: "현황", icon: "LayoutDashboard", path: "/status" }] },
  { items: [{ title: "사업장", icon: "Factory", path: "/workplace" }] },
  { items: [{ title: "일정", icon: "CalendarDays", path: "/schedule" }] },
  {
    items: [
      { title: "업무", isGroup: true },
      { title: "일일업무", icon: "BriefcaseBusiness", path: "/daily" },
      { title: "요청업무", icon: "MessageSquareReply", path: "/req-task" },
      { title: "품질", icon: "BadgeCheck", path: "/qc" },
    ],
  },
  {
    items: [
      { title: "시설", isGroup: true },
      { title: "R&M", icon: "Hammer", path: "/facility/r&m" },
      { title: "M&O", icon: "Cog", path: "/facility/m&o" },
      { title: "MRO", icon: "Package", path: "/facility/mro" },
    ],
  },
  { items: [{ title: "장비", icon: "Wrench", path: "/equipment" }] },
  {
    items: [
      { title: "민원", isGroup: true },
      { title: "민원", icon: "Megaphone", path: "/voc" },
      { title: "위치 QR", icon: "QrCode", path: "/qr" },
    ],
  },
];

const AdminMenu: MenuSection[] = [
  { items: [{ title: "사업장", icon: "Factory", path: "/admin/workplace" }] },
  { items: [{ title: "관리자", icon: "Users", path: "/admin/user" }] },
  {
    items: [
      { title: "체크리스트", icon: "ListChecks", path: "/admin/checklist" },
    ],
  },
];

/**
 * 메뉴
 * 관리자모드, 일반모드
 */
const MenuItem = ({ item }: { item: MenuItem }) => {
  const router = useRouter();
  const pathName = usePathname();

  const SelectLucideIcon = item.icon ? icons[item.icon] : null;

  const onMove = () => {
    if (!item.path) return;
    router.push(item.path);
  };
  return (
    <div
      className={`flex gap-2 py-2 items-center text-white group ${
        item.isGroup ? "px-4" : "px-6 hover:font-bold hover:cursor-pointer"
      } `}
      onClick={onMove}
    >
      {SelectLucideIcon && (
        <SelectLucideIcon
          className={`stroke-1 w-5 h-5 group-hover:stroke-2 ${
            item.path && pathName?.includes(item.path) ? "stroke-2" : null
          }`}
        />
      )}

      <span
        className={`text-sm ${
          item.path && pathName?.includes(item.path) ? "font-bold" : null
        }`}
      >
        {item.title}
      </span>
    </div>
  );
};

interface SideBarProps {
  loginMode: "ADMIN" | "NORMAL";
}

const SideBar = ({ loginMode }: SideBarProps) => {
  return (
    <div className="flex flex-col w-70 h-full bg-[var(--primary)] side-bar-shadow relative">
      {/**
       * 헤더
       * 로고, 프로필
       */}
      <div className="text-2xl font-bold text-white px-6 py-6">S-Works</div>

      <Profile
        loginMode={loginMode}
        workplace="강남우체국"
        name="이동희"
        permission="MASTER"
      />

      {/**
       * 바디
       * 메뉴 항목
       */}
      <div className="flex-1 flex flex-col py-4">
        {(loginMode === "ADMIN" ? AdminMenu : NormalMenu).map((section, i) => (
          <div key={i} className="mb-2">
            {" "}
            {/* 섹션 간 여백 */}
            {section.items.map((item, j) => (
              <MenuItem key={j} item={item} />
            ))}
          </div>
        ))}
      </div>
      <div className="px-6 py-6">
        <Button
          className="hover:text-red-500 hover:font-bold "
          variant={"login"}
          onClick={() => logout()}
          icon={LogOut}
          label={"로그아웃"}
        />
      </div>
    </div>
  );
};

/**
 * 1. 관리자모드, 일반모드 구분
 */
interface ProfileProps {
  loginMode: "ADMIN" | "NORMAL";
  workplace?: string;
  name: string;
  permission: string;
}
const Profile = ({ loginMode, workplace, name, permission }: ProfileProps) => {
  return (
    <div className="flex flex-col gap-2 px-6 py-4 bg-white ">
      {loginMode === "NORMAL" && workplace ? (
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--primary)] font-bold">
            {workplace}
          </span>
          <IconButton icon={"RefreshCcw"} />
        </div>
      ) : null}
      <div className="flex flex-col gap-1 ">
        <span className="text-sm ">{name}</span>
        <span className="text-xs text-[var(--description-light)]">
          {permission}
        </span>
      </div>
    </div>
  );
};

export default SideBar;
