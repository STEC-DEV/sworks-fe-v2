

import React from 'react'
import SideBar from '../ui/custom/side-bar'

interface AdminLayoutProps {
    children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <div className='flex h-full w-full'>
            <SideBar />
            {children}
        </div>
    )
}

export default AdminLayout