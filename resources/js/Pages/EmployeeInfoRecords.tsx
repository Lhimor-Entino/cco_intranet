import Layout from '@/Components/Layout/Layout';
import { User } from '@/types';
import { Head } from '@inertiajs/inertia-react';
import {ChangeEvent, FC, useEffect, useMemo, useState} from 'react';
import { EmployeeDataTable } from './EmployeeInfoRecordsComponents/EmployeeDataTable';
import { EmployeeColumns } from './EmployeeInfoRecordsComponents/EmployeeColumns';
import EmployeePageHeader from './EmployeeInfoRecordsComponents/EmployeePageHeader';
import EmployeeArchiveMotal from './EmployeeInfoRecordsComponents/EmployeeArchiveMotal';
import EmployeeSkillsModal from './EmployeeInfoRecordsComponents/EmployeeSkillsModal';
import SetSupervisorModal from './EmployeeInfoRecordsComponents/SetSupervisorModal';

interface Props {
    employees:User[];
}

const EmployeeInfoRecords:FC<Props> = ({employees}) => {
    const [strFilter, setStrFilter] = useState<string>('');
    const [filters, setFilters] = useState<{position?:string,project_id?:string,site?:string,shift?:string}>({});
    const onInputChange = (e:ChangeEvent<HTMLInputElement>) => setStrFilter(e.target.value);
    
    // get distinct positions from the employees
    const positions = useMemo(()=>[...new Set(employees.map((employee) => employee.position))].sort(),[employees]);


    //Filter using company_id and last_name column, if strFilter is empty return all employees, then filter using filters state
    const filteredEmployees = useMemo(()=>employees.filter((employee) => {
        if(strFilter === '') return true;
        return employee.company_id.toLowerCase().includes(strFilter.toLocaleLowerCase()) || employee.last_name.toLowerCase().includes(strFilter.toLowerCase());        
    }).filter(employee=>{
        if(filters.position && employee.position !== filters.position) return false;
        return true;
    }).filter(employee=>{
        if(filters.project_id==="no_project" && !employee.project_id) return true;
        if(filters.project_id && employee.project?.id.toString() !== filters.project_id) return false;
        return true;
    }).filter(employee=>{
        if (!filters.site) return true;
        return employee.site.toLowerCase() === filters.site.toLowerCase();
    }).filter(employee=>{
        if((filters.shift && employee.shift_id) && employee.shift_id.toString() === filters.shift) return true;
        //if((filters.shift && employee.shift_id) && employee.shift_id.toString() !== filters.shift) return false;
        if(filters.shift === '0') return !employee.shift_id;
        if(!filters.shift) return true;
    }),[employees,strFilter,filters]);

    
    return (
        <>
            <Head title="Employee Info" />
            <Layout title='Employee Information Records'>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container py-2.5'>
                    <EmployeePageHeader onFilter={setFilters} filters={filters} strFilter={strFilter} onInputChange={onInputChange} positions={positions}  />
                    <div className='flex-1 overflow-y-hidden'>
                        <EmployeeDataTable columns={EmployeeColumns} data={filteredEmployees} />
                    </div>
                </div>
            </Layout>
            <EmployeeArchiveMotal />
            <SetSupervisorModal employees={employees} />
        </>
    );
};

export default EmployeeInfoRecords;