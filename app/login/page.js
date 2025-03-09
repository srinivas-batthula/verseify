import Login from "@/components/Login";


export default async function Page({searchParams}){
    const Q = await searchParams.get('q')

    return(
        <Login q={Q} />
    )
}