import Profile from "@/components/Profile";



export default async function Page({params}){
    const { id } = await params


    return(
        <Profile id={id} />
    )
}