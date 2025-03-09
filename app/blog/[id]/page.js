import Blog from "@/components/Blog";




export default async function BPage({params}){
    const { id } = await params


    return(
        <Blog id={id} />
    )
}