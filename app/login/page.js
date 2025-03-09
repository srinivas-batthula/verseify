import Login from "@/components/Login";


export default function Page({searchParams}){
    const Q = searchParams?.get('q') || ""

    return(
        <Login q={Q} />
    )
}