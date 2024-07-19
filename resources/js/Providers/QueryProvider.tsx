import {FC, ReactNode,  useState} from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';



const QueryProvider:FC<{children:ReactNode}> = ({children}) => {
    const [queryClient] = useState(()=>new QueryClient);

    
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider