"use client";
import { logout } from "@/app/server-action/auth/auth-action";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import { useAuthStore } from "@/store/auth/auth-store";
import { icons, LogOut, MenuIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../sheet";
import BaseDialog from "../base-dialog";
import { WorkplaceBox } from "@/app/(auth)/select-workplace/page";
import { ScrollArea } from "../../scroll-area";
import LoadingOverlay from "../overlay/loading";
import { useNotificationStore } from "@/store/normal/notification/noti";
import { useUIStore } from "@/store/common/ui-store";
import CustomCard from "@/components/common/card";
import { format } from "date-fns";
import { Notification } from "@/types/normal/notification/notification";
import EmptyBox from "../empty";
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
  // { items: [{ title: "현황", icon: "LayoutDashboard", path: "/status" }] },
  { items: [{ title: "일정", icon: "CalendarDays", path: "/schedule" }] },
  { items: [{ title: "사업장", icon: "Factory", path: "/workplace" }] },

  { items: [{ title: "공지사항", icon: "AudioLines", path: "/notice" }] },
  {
    items: [
      { title: "업무", isGroup: true },
      { title: "일일업무", icon: "BriefcaseBusiness", path: "/daily" },
      { title: "요청업무", icon: "MessageSquareReply", path: "/req-task" },
      { title: "품질", icon: "BadgeCheck", path: "/qe" },
    ],
  },
  {
    items: [
      { title: "시설", isGroup: true },
      { title: "R&M", icon: "Hammer", path: "/facility/r&m" },
      { title: "M&O", icon: "Cog", path: "/facility/m&o" },
      { title: "MRO", icon: "Package", path: "/facility/mro" },
      { title: "장비", icon: "Wrench", path: "/equipment" },
    ],
  },
  // { items: [{ title: "장비", icon: "Wrench", path: "/equipment" }] },
  {
    items: [
      { title: "민원", isGroup: true },
      { title: "민원", icon: "Headset", path: "/voc" },
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
  const { loginProfile, normalModeProfile, enteredWorkplace } = useAuthStore();

  const returnProfile = () => {
    if (loginMode === "ADMIN") {
      return loginProfile ? (
        <Profile
          loginMode={loginMode}
          name={loginProfile.userName ?? "관리자"}
          job={loginProfile?.job}
          permission="MASTER"
        />
      ) : (
        <div className="flex flex-col gap-1 px-6 py-4">
          <BaseSkeleton className="h-5" />
          <BaseSkeleton className="h-5" />
        </div>
      );
    } else {
      return loginProfile ? (
        <Profile
          loginMode={loginMode}
          workplace={enteredWorkplace?.siteName}
          job={loginProfile?.job}
          name={loginProfile?.userName || ""}
          permission={loginProfile?.role || ""}
        />
      ) : (
        <div className="flex flex-col gap-1 px-6 py-4">
          <BaseSkeleton className="h-5" />
          <BaseSkeleton className="h-5" />
        </div>
      );
    }
  };

  const getFilteredNormalMenu = () => {
    if (loginProfile?.role === "근무자") {
      return NormalMenu.filter((section) => {
        const hasRestrictedMenu = section.items.some(
          (item) =>
            item.title === "시설" ||
            item.title === "R&M" ||
            item.title === "M&O" ||
            item.title === "MRO" ||
            item.title === "장비" ||
            item.title === "민원" ||
            item.title === "위치 QR"
        );
        return !hasRestrictedMenu;
      });
    }
    return NormalMenu;
  };

  return (
    <div className="flex flex-col w-70 h-full bg-[var(--primary)] relative">
      {/**
       * 헤더
       * 로고, 프로필
       */}
      <div className="flex justify-between items-center px-6 py-6">
        <div className="text-2xl font-bold text-white ">S-Agent</div>
        {loginMode === "NORMAL" &&
          !(
            loginProfile?.role === "시스템관리자" ||
            loginProfile?.role === "마스터" ||
            loginProfile?.role === "매니저"
          ) && <Noti />}
      </div>

      {returnProfile()}
      <ScrollArea className="overflow-hidden">
        {/**
         * 바디
         * 메뉴 항목
         */}
        <div className="flex-1 flex flex-col py-4">
          {(loginMode === "ADMIN" ? AdminMenu : getFilteredNormalMenu()).map(
            (section, i) => (
              <div key={i} className="mb-2">
                {/* 섹션 간 여백 */}
                {section.items.map((item, j) => (
                  <MenuItem key={j} item={item} />
                ))}
              </div>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const Noti = () => {
  const {
    loadingKeys,
    notificationList,
    hasMore,
    lastCursor,
    getNotification,
    putReadNotification,
  } = useNotificationStore();
  const { isLoading, hasError } = useUIStore();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    if (!open) return;

    getNotification();
  }, [open]);

  // 무한 스크롤 핸들러
  const handleScroll = useCallback(async () => {
    if (!scrollRef.current) return;
    if (isFetchingMore || !hasMore) return;
    if (isLoading(loadingKeys.LIST)) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // 스크롤이 하단 100px 이내로 도달하면 추가 로드
    if (scrollHeight - scrollTop - clientHeight < 100) {
      setIsFetchingMore(true);
      try {
        await getNotification(lastCursor || undefined); // cursor와 함께 요청
      } finally {
        setIsFetchingMore(false);
      }
    }
  }, [hasMore, lastCursor, isFetchingMore, isLoading, loadingKeys.LIST]);

  const type = (type: number): { label: string; value: string } => {
    switch (type) {
      case 0:
        return { label: "민원", value: "voc" };
      case 1:
        return { label: "공지사항", value: "notice" };
      case 2:
        return { label: "업무요청", value: "req-task" };
      case 3:
        return { label: "일정", value: "schedule" };
      default:
        return { label: "Unknown", value: "Unknown" };
    }
  };

  const onClick = (data: Notification) => {
    putReadNotification(data.readSignSeq.toString());

    if (type(data.notiType).label === "일정") {
      router.push(`/${type(data.notiType).value}`);
    } else {
      router.push(`/${type(data.notiType).value}/${data.originSeq}`);
    }
    setOpen(false);
  };

  const getList = () => {
    if (isLoading(loadingKeys.LIST) || !notificationList)
      return Array.from({ length: 10 }, (_, i) => (
        <BaseSkeleton key={i} className="w-87 h-20.5" />
      ));
    if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;
    return (
      <>
        {notificationList.map((n, i) => (
          <CustomCard
            key={`${n.readSignSeq}-${i}`}
            variant={"list"}
            className={`hover:border-blue-500 hover:bg-blue-50 ${
              n.isRead ? "bg-[var(--read)]" : ""
            }`}
            onClick={() => onClick(n)}
          >
            <div className="flex items-center justify-between">
              <span className="text-blue-500 text-sm">
                {type(n.notiType).label}
              </span>
              <span className="text-xs text-[var(--description-light)]">
                {format(n.createDt, "yyyy-MM-dd HH:mm:ss")}
              </span>
            </div>
            <span className="text-sm">{n.contents}</span>
          </CustomCard>
        ))}

        {/* 추가 로딩 중 표시 */}
        {isFetchingMore && (
          <div className="flex justify-center py-4">
            <BaseSkeleton className="w-87 h-20.5" />
          </div>
        )}

        {/* 더 이상 데이터 없음 표시 */}
        {!hasMore && notificationList.length > 0 && (
          <div className="text-center py-4 text-sm text-[var(--description-light)]">
            더 이상 알림이 없습니다
          </div>
        )}
      </>
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <SheetTrigger asChild>
        <IconButton
          bgClassName="hover:bg-white"
          className="text-white  group-hover:text-primary"
          icon="BellRing"
          size={21}
        />
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle className="text-xl">알람</SheetTitle>
        </SheetHeader>
        <ScrollArea
          className="overflow-hidden"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div className="px-4 pb-2">
            <div className="flex flex-col gap-4">{getList()}</div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

/**
 * 1. 관리자모드, 일반모드 구분
 */
interface ProfileProps {
  loginMode: "ADMIN" | "NORMAL";
  workplace?: string | null;
  job?: string | null;
  name: string;
  permission: string;
}
const Profile = ({
  loginMode,
  workplace,
  job,
  name,
  permission,
}: ProfileProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { adminWorkplaceList, getWorkplacePermission } = useAuthStore();
  //////
  const [enter, setEnter] = useState<boolean>(false);
  const router = useRouter();

  const handleEnter = async (workplace: AdminWorkplaceSelectListItem) => {
    try {
      setEnter(true);
      await getWorkplacePermission(workplace.siteSeq.toString());

      // 전체 새로고침 (팝업도 자동으로 닫힘)
      window.location.href = "/schedule";
    } catch (error) {
      console.error("Failed to change workplace:", error);
      setEnter(false);
    }
  };

  const getList = () => {
    if (!adminWorkplaceList)
      return (
        <div>
          {Array.from({ length: 4 }, (_, i) => (
            <BaseSkeleton key={i} className="h-[66px]" />
          ))}
        </div>
      );
    if (adminWorkplaceList.length === 0) {
      return (
        <span className="text-[var(--description-light)]">
          담당 사업장이 존재하지않습니다.
        </span>
      );
    }
    return adminWorkplaceList.map((v, i) => (
      <WorkplaceBox key={i} data={v} onClick={handleEnter} />
    ));
  };
  return (
    <div className="flex flex-col gap-2 px-6 py-4 bg-white ">
      {loginMode === "NORMAL" && workplace ? (
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--primary)] font-bold">
            {workplace}
          </span>
          {permission === "마스터" ||
          permission === "시스템관리자" ||
          permission === "매니저" ? (
            <BaseDialog
              title="사업장 변경"
              open={open}
              setOpen={setOpen}
              triggerChildren={<IconButton icon={"RefreshCcw"} />}
            >
              <div className="flex flex-col gap-6 w-full">
                <ScrollArea className="overflow-hidden flex-1">
                  <div className="flex flex-col gap-3 px-6 pb-1">
                    {getList()}
                  </div>
                </ScrollArea>
              </div>
            </BaseDialog>
          ) : null}
          <LoadingOverlay isVisible={enter} message="Loading..." />
        </div>
      ) : null}
      <div className="flex flex-col gap-1 ">
        <div className="flex gap-1 items-end ">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-[var(--description-dark)] font-medium">
            {job}
          </span>
        </div>

        <span className="text-xs text-[var(--description-light)]">
          {permission}
        </span>
      </div>

      <Button
        className="hover:text-red-500 hover:font-bold "
        variant={"login"}
        onClick={() => logout()}
        label={"로그아웃"}
      />
    </div>
  );
};

export default SideBar;

export const MobileSidebar = ({ type }: { type: "ADMIN" | "NORMAL" }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth >= 1280) {
          setOpen(false);
        }
      }, 150); // 150ms debounce
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <IconButton icon="Menu" size={24} />
      </SheetTrigger>
      <SheetContent className="w-fit border-none">
        <SheetTitle className="sr-only" />
        <SideBar loginMode={type} />
      </SheetContent>
    </Sheet>
  );
};
