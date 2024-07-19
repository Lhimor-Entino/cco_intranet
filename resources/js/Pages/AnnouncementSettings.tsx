import { Announcement } from "@/types"
import { FC } from "react"
import { AnnouncementSettingsDataTable } from "./AnnouncementSettings/AnnouncementSettingsDataTable";
import { AnnouncementSettingsColums } from "./AnnouncementSettings/AnnouncementSettingsColums.";
import { Head } from "@inertiajs/inertia-react";
import Layout from "@/Components/Layout/Layout";
import Header from "@/Components/Header";


interface Props{
    announcements: Announcement[];
}

const AnnouncementSettings:FC<Props> = ({announcements}) => {
    return (
        <>
            <Head title="Settings" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <Header title="Settings" />                    
                    <div className="flex-1 overflow-y-auto">
                        <AnnouncementSettingsDataTable columns={AnnouncementSettingsColums} data={announcements} />
                    </div>                    
                </div>
            </Layout>
        </>
    )
}

export default AnnouncementSettings