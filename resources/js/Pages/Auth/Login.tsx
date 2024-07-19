import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { Head, useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {FC, FormEventHandler, useEffect, useState} from 'react';



const Login:FC= () => {
    const {data,setData,reset,errors,processing,post} = useForm({company_id:'',password:''})

    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        post(route('hrms.login'));
    }


    return (
        <>
            <Head title={`CCO Login`} />
            <div className='h-full flex items-center justify-center'>
                <Card className="w-full md:w-96">
                    <CardHeader>
                        <CardTitle>{`CCO Intranet`}</CardTitle>
                        <CardDescription>{`Enter your HRMS Credentials to continue.`}</CardDescription>
                        <CardDescription>{`You are trying to access a restricted page.`}</CardDescription>
                        <Separator />
                    </CardHeader>
                    <CardContent>                    
                        <form onSubmit={onSubmit} className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="id">Company ID</Label>
                                <Input value={data.company_id} onChange={({target})=>setData('company_id',target.value)} disabled={processing} required autoComplete='off' autoFocus id="id" placeholder="Your Company ID" />
                                {errors.company_id && <p className='text-destructive text-xs w-full text-right'>{removeHTMLTags(errors.company_id)}</p> }
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input value={data.password} onChange={({target})=>setData('password',target.value)} disabled={processing} type='password' required autoComplete='off' id="password" placeholder="HRMS Password" />
                            </div>
                            
                            <Button disabled={processing} type='submit' >
                                { processing && <Loader2 className='h-5 w-5 mr-2 animate-spin' />}
                                {
                                    processing ? "Logging in... Please Wait" : "Login"
                                }
                            </Button>
                        </form>                    
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Login;


export const removeHTMLTags = (str:string):string =>{
    if(str==="") return str;
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.body.textContent || "";
}