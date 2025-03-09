import Follow from "@/components/Follow";



export default async function FollowPage({params}){
    const { id } = await params


    return (
        <Follow id={id} />
    )
}