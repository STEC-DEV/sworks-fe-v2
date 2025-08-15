import IconButton from '@/components/common/icon-button'
import CommonPagination from '@/components/ui/custom/pagination/common-pagination'
import React from 'react'

const RnmPagination = () => {
    return (
        <>
            <div className='flex gap-4'>
                <CommonPagination totalCount={20} />
                <IconButton icon='Plus' />
            </div>
        </>
    )
}

export default RnmPagination