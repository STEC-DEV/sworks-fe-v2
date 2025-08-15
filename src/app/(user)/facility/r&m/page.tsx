
import AppTitle from '@/components/common/label/title'
import React from 'react'
import RnmFilter from './_components/filter'
import RnmPagination from './_components/pagination'
import DataTable from '@/components/common/data-table'
import { facilityColumns, mockFacilityList } from './_components/rnm-columns'

const Page = () => {
    return (
        <>
            <AppTitle title='R&M' />
            <RnmFilter />
            <RnmPagination />
            <DataTable
                columns={facilityColumns}
                data={mockFacilityList}
                idName={"seq"}
                baseUrl={"r&m"}
                emptyMessage=""
            />
        </>
    )
}

export default Page