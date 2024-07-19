import { FC } from "react"

interface Props{
    title?:string;
    hidePicture?:boolean;
    logo?:'board'|'leave'|'performance';
}

const Header:FC<Props> = ({title="CCO Latest Announcements",hidePicture,logo='board'}) => {
    return (
        <div className='container mx-auto  h-auto space-y-3.5 p-3.5 flex items-center justify-center'>
            <h1 className='text-base md:text-2xl font-semibold flex items-center gap-x-2'>
                {!hidePicture&&<img className='h-20 ' src={`${route('public_route')}/logo/${logo}.png`} alt="Board" />}
                <span>{title}</span>
            </h1>
        </div>
    )
}
export default Header