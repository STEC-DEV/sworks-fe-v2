"use client";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import { useDecodeParam } from "@/hooks/params";
import { useBuildingDetailStore } from "@/store/normal/building/detail";
import { Building2 } from "lucide-react";
import React, { useEffect } from "react";
import { BuildingInfo, FacilityInfo, FireInfo } from "./_components/info-item";
import Image from "next/image";
import { useUIStore } from "@/store/common/ui-store";
import { SingleImageBox } from "@/components/common/image-box";
import IconButton from "@/components/common/icon-button";
import CheckDialog from "@/components/common/check-dialog";
import { dialogText } from "../../../../../../public/text";
import { useRouter } from "next/navigation";

const Page = () => {
  const { rawValue } = useDecodeParam("id");
  const { building, getBuildingDetail, deleteBuilding, loadingKeys } =
    useBuildingDetailStore();
  const router = useRouter();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    if (!rawValue) return;
    getBuildingDetail(rawValue);
  }, [rawValue]);

  if (isLoading(loadingKeys.DETAIL) || !building)
    return <BuildingDetailSkeleton />;
  if (hasError(loadingKeys.DETAIL)) return <div>에러 발생</div>;

  const handleDelete = async () => {
    await deleteBuilding(building?.dongSeq.toString());
    router.replace("/workplace");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <AppTitle title={building?.dongName} />
        <CheckDialog
          title={dialogText.defaultDelete.title}
          description={dialogText.defaultDelete.description}
          actionLabel={dialogText.defaultDelete.actionLabel}
          onClick={handleDelete}
        >
          <IconButton icon="Trash2" />
        </CheckDialog>
      </div>

      <div className="w-full h-80 border rounded-[4px] shrink-0 relative">
        {building.images ? (
          <SingleImageBox path={building.images} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-background">
            <Building2
              size={24}
              className="text-[var(--icon)] "
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>
      <BuildingInfo />
      <FacilityInfo />
      <FireInfo />
    </>
  );
};

export default Page;

const BuildingDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <BaseSkeleton className="h-7" />
      <BaseSkeleton className="h-60" />
      <BaseSkeleton className="h-75" />
      <BaseSkeleton className="h-75" />
      <BaseSkeleton className="h-75" />
    </div>
  );
};
